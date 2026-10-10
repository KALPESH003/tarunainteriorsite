'use client';

import { useEffect, useRef } from 'react';

/* =========================================================
   SHARED PINNED-SECTION ENGINE  (v2)

   Same public API as before, so Milestone, Process,
   TextMaskScroll and Portfolio need NO changes.

   What is different inside:
   - Page moves use a critically-damped spring that starts from the
     page's current speed, so the "catch" into a section has no jolt.
   - Input is buffered, not dropped: a swipe made while a stage is still
     animating is queued (one deep) and runs the moment the lock ends.
   - The page is only ever driven by us when WE started it. Scrollbar
     drags, anchor links, find-in-page, Home/End and Tab-focus jumps are
     detected (a scroll with no wheel / touch / key behind it) and left
     completely alone - the pin simply lets go.
========================================================= */

export type PinDirection = 'down' | 'up';

export interface PinnedConfig {
  /** number of stages inside the section */
  count: number;
  /** ignore input this long (ms) after each stage change */
  stepLock?: number;
  /** called when the section takes over. Return the starting stage. */
  onEnter: (direction: PinDirection) => { index: number; busyMs?: number };
  /** called for every stage change while pinned */
  onStep: (index: number) => void;
  /** called when the section hands off to a neighbour (or the user leaves it) */
  onExit?: () => void;
}

interface Entry {
  el: HTMLElement;
  get: () => PinnedConfig;
}

type Step = 1 | -1;

/* ---------- tuning ---------- */
const ENTRY_THRESHOLD = 140; // px from viewport edge where a section locks
const MAX_LEAD = 200; // extra look-ahead for fast flicks so none can skip a section
const GESTURE_GAP = 150; // ms of silence that ends a wheel gesture
const GESTURE_REFRACTORY = 350; // a "rising" wheel can't start a new gesture sooner than this
const TOUCH_THRESHOLD = 40; // swipe distance (px) that counts as a step
const TOUCH_FLICK_DIST = 16; // ...or a quick flick of at least this distance
const TOUCH_FLICK_SPEED = 0.6; // px/ms
const ALIGN_TOLERANCE = 4; // px
const OWN_SCROLL_TOLERANCE = 2; // px - how close a scroll event must be to ours
const PIN_HOLD_TOLERANCE = 3; // px - drift we silently correct while pinned
const SETTLE_MS = 160; // idle time after a free scroll before we re-check alignment
const PENDING_TTL = 1500; // a queued step older than this is discarded
const INPUT_WHEEL_MS = 320; // scroll within this long of a wheel event = wheel driven
const INPUT_KEY_MS = 700; // ...of a scroll key
const INPUT_TOUCH_MS = 2500; // ...of the end of a swipe (momentum)

const INSTANT = 'instant' as ScrollBehavior;
const NEVER = -1e9;

/* ---------- state (module singleton) ---------- */
const entries = new Set<Entry>();
let attached = false;

const st = {
  active: null as Entry | null,
  index: 0,
  animating: false,
  raf: 0,
  busyUntil: 0,

  // our own scroll writes (so we can recognise their scroll events)
  ownY: 0,
  ownAt: NEVER,

  // native scroll velocity (px/s), used to seed the spring
  vY: 0,
  vT: NEVER,
  vel: 0,
  lastScrollY: 0,
  lastDir: 'down' as PinDirection,

  // what is driving the page right now
  lastWheelAt: NEVER,
  lastKeyAt: NEVER,
  touching: false,
  touchMoved: false,
  touchEndAt: NEVER,

  // wheel gesture tracking
  w: { t: NEVER, abs: 0, dir: 0 as 0 | 1 | -1, start: NEVER, used: false },

  // one queued step
  pending: 0 as 0 | 1 | -1,
  pendingAt: 0,
  pendingTimer: 0,

  settleTimer: 0,

  // touch
  touchStartY: 0,
  touchStartT: 0,
  touchHandled: false,
};

/* ---------- helpers ---------- */

const now = () => performance.now();
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const topOf = (el: HTMLElement) => window.scrollY + el.getBoundingClientRect().top;
const maxScrollY = () =>
  Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

/** Every scroll WE cause goes through here so onScroll can tell it from the user's. */
function setScroll(y: number) {
  st.ownY = y;
  st.ownAt = now();
  window.scrollTo({ top: y, left: 0, behavior: INSTANT });
}

function nativeVel() {
  return now() - st.vT < 100 ? st.vel : 0;
}
const leadPx = () => Math.min(MAX_LEAD, Math.abs(nativeVel()) * 0.05);

function inputDriven(t: number) {
  return (
    t - st.lastWheelAt < INPUT_WHEEL_MS ||
    t - st.lastKeyAt < INPUT_KEY_MS ||
    st.touching ||
    t - st.touchEndAt < INPUT_TOUCH_MS
  );
}

/* ---------- spring glide ---------- */

function cancelGlide() {
  cancelAnimationFrame(st.raf);
  st.animating = false;
}

/** Spring stiffness + rough settle time. Long hops are a little slower. */
function plan(target: number) {
  if (prefersReduced()) return { omega: 0, ms: 0 };
  const dist = Math.abs(target - window.scrollY);
  const omega = clamp(13.2 - dist / 170, 7.8, 12.5);
  return { omega, ms: Math.round((5.2 / omega) * 1000) };
}

/** Carry the page's current speed into the glide, never enough to overshoot. */
function seedVelocity(dist: number, omega: number) {
  if (omega <= 0 || dist === 0) return 0;
  const sign = Math.sign(dist);
  const toward = nativeVel() * sign;
  if (toward <= 0) return 0;
  return sign * Math.min(toward, omega * Math.abs(dist) * 0.9);
}

/**
 * Critically damped spring, closed-form step: frame-rate independent,
 * no overshoot, and interruptible at any moment.
 */
function glideTo(rawTarget: number, omega: number, v0 = 0) {
  cancelAnimationFrame(st.raf);
  const target = clamp(rawTarget, 0, maxScrollY());
  let pos = window.scrollY;

  if (omega <= 0 || Math.abs(target - pos) < 0.5) {
    if (Math.abs(target - pos) >= 0.5) setScroll(target);
    st.animating = false;
    return;
  }

  let vel = v0;
  let last = now();
  st.animating = true;

  const tick = (t: number) => {
    const dt = clamp((t - last) / 1000, 0.001, 0.1);
    last = t;

    const x = pos - target;
    const b = vel + omega * x;
    const decay = Math.exp(-omega * dt);
    pos = target + (x + b * dt) * decay;
    vel = (vel - b * omega * dt) * decay;

    if (Math.abs(pos - target) < 0.35 && Math.abs(vel) < 6) {
      setScroll(target);
      st.animating = false;
      st.busyUntil = Math.max(st.busyUntil, now());
      return;
    }

    setScroll(pos);
    st.raf = requestAnimationFrame(tick);
  };
  st.raf = requestAnimationFrame(tick);
}

/* ---------- section ownership ---------- */

/** Which registered section (if any) should take over for this direction? */
function findEntry(dir: PinDirection, lead = 0) {
  const vh = window.innerHeight;
  let best: { entry: Entry; dir: PinDirection; top: number } | null = null;

  for (const e of Array.from(entries)) {
    const r = e.el.getBoundingClientRect();
    const aligned = Math.abs(r.top) <= 2 && r.bottom > vh * 0.5;
    const ok =
      aligned ||
      (dir === 'down'
        ? r.top <= ENTRY_THRESHOLD + lead && r.bottom > vh * 0.5
        : r.top <= 1 && r.bottom > -(ENTRY_THRESHOLD + lead));

    if (!ok) continue;
    if (!best || r.top > best.top) {
      best = { entry: e, dir: aligned ? 'down' : dir, top: r.top };
    }
  }
  return best;
}

/** Make `entry` the owner of the page. */
function activate(entry: Entry, dir: PinDirection, travelMs: number) {
  const res = entry.get().onEnter(dir);
  st.active = entry;
  st.index = res.index;
  st.busyUntil = now() + Math.max(res.busyMs ?? 0, travelMs);
  entry.el.style.touchAction = 'none';
}

function clearPending() {
  st.pending = 0;
  if (st.pendingTimer) {
    window.clearTimeout(st.pendingTimer);
    st.pendingTimer = 0;
  }
}

/** Let go of the active section (hand-off, or the user took the page). */
function deactivate(keepPending = false) {
  const entry = st.active;
  if (!entry) return;
  entry.el.style.touchAction = '';
  st.active = null;
  if (!keepPending) clearPending();
  entry.get().onExit?.();
}

function lock(entry: Entry, dir: PinDirection) {
  if (st.active || st.animating) return;
  const target = topOf(entry.el);
  const { omega, ms } = plan(target);
  const v0 = seedVelocity(target - window.scrollY, omega);
  activate(entry, dir, ms);
  glideTo(target, omega, v0);
}

function release(dir: PinDirection) {
  const entry = st.active;
  if (!entry) return;

  const top = topOf(entry.el);
  const h = entry.el.offsetHeight;
  const raw = dir === 'down' ? top + h : top - window.innerHeight;
  const target = clamp(raw, 0, maxScrollY());

  // Nowhere to go (first / last section on the page): stay pinned.
  if (Math.abs(target - window.scrollY) < 2) return;

  const { omega, ms } = plan(target);
  deactivate(true); // a queued swipe carries over to the next section
  st.w.used = true; // swallow the momentum tail of this gesture

  // If the neighbour is also a pinned section, hand over directly.
  for (const e of Array.from(entries)) {
    if (e !== entry && Math.abs(topOf(e.el) - target) <= ALIGN_TOLERANCE) {
      activate(e, dir, ms);
      break;
    }
  }

  glideTo(target, omega);
}

/* ---------- stepping + input buffer ---------- */

function step(dir: Step) {
  const entry = st.active;
  if (!entry) return;
  const cfg = entry.get();
  const next = st.index + dir;

  if (next >= 0 && next < cfg.count) {
    st.index = next;
    cfg.onStep(next);
    st.busyUntil = now() + (cfg.stepLock ?? 900);
    return;
  }
  release(dir > 0 ? 'down' : 'up');
}

function armPending() {
  if (st.pendingTimer) return;
  const wait = Math.max(16, st.busyUntil - now() + 8);
  st.pendingTimer = window.setTimeout(flushPending, wait);
}

function flushPending() {
  st.pendingTimer = 0;
  const dir = st.pending;
  if (!dir) return;

  if (!st.active || now() - st.pendingAt > PENDING_TTL) {
    st.pending = 0;
    return;
  }
  if (st.animating || now() < st.busyUntil) {
    armPending();
    return;
  }
  st.pending = 0;
  step(dir);
}

/** A deliberate input (swipe / key). Runs now, or is queued until the lock ends. */
function request(dir: Step) {
  if (!st.active) return;
  if (st.animating || now() < st.busyUntil) {
    st.pending = dir;
    st.pendingAt = now();
    armPending();
    return;
  }
  step(dir);
}

/* ---------- WHEEL ---------- */

function onWheel(e: WheelEvent) {
  if (e.ctrlKey) return; // pinch zoom
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // horizontal

  let delta = e.deltaY;
  if (e.deltaMode === 1) delta *= 16;
  if (e.deltaMode === 2) delta *= window.innerHeight;

  const abs = Math.abs(delta);
  const t = now();
  st.lastWheelAt = t;

  if (abs < 2) {
    if ((st.active || st.animating) && e.cancelable) e.preventDefault();
    return;
  }

  // ---- gesture bookkeeping (one swipe / notch = one intent) ----
  const dir: Step = delta > 0 ? 1 : -1;
  const w = st.w;
  const fresh =
    t - w.t > GESTURE_GAP ||
    dir !== w.dir ||
    (abs > w.abs + 12 && t - w.start > GESTURE_REFRACTORY);

  if (fresh) {
    w.start = t;
    w.used = false;
  }
  w.t = t;
  w.abs = abs;
  w.dir = dir;

  // ---- gliding toward plain content after a hand-off ----
  if (st.animating && !st.active) {
    if (fresh) cancelGlide(); // new intent: let the user take over from here
    else {
      if (e.cancelable) e.preventDefault();
      return;
    }
  }

  // ---- pinned (or gliding into a pinned section) ----
  if (st.active) {
    if (e.cancelable) e.preventDefault(); // the page never moves
    if (w.used) return;
    w.used = true;
    request(dir);
    return;
  }

  // ---- idle: native scrolling, until a section is close enough ----
  if (w.used) {
    // tail of a gesture we already consumed
    if (e.cancelable) e.preventDefault();
    return;
  }

  const found = findEntry(dir > 0 ? 'down' : 'up', leadPx());
  if (found) {
    if (e.cancelable) e.preventDefault();
    w.used = true;
    lock(found.entry, found.dir);
  }
}

/* ---------- TOUCH ---------- */

function onTouchStart(e: TouchEvent) {
  const touch = e.touches[0];
  if (!touch) return;

  st.touching = true;
  st.touchMoved = false;
  st.touchHandled = false;
  st.touchStartY = touch.clientY;
  st.touchStartT = now();

  // Finger down during a hand-off glide to plain content: the user takes over.
  if (st.animating && !st.active) cancelGlide();
}

function onTouchMove(e: TouchEvent) {
  const touch = e.touches[0];
  if (!touch) return;

  const dy = st.touchStartY - touch.clientY; // >0 = swipe up = go down
  if (Math.abs(dy) > 10) st.touchMoved = true;

  if (!st.active) {
    if (st.animating) return;
    if (st.touchHandled || Math.abs(dy) < 8) return;
    const found = findEntry(dy > 0 ? 'down' : 'up');
    if (found) {
      if (e.cancelable) e.preventDefault();
      st.touchHandled = true;
      lock(found.entry, found.dir);
    }
    return;
  }

  if (e.cancelable) e.preventDefault();
  if (st.touchHandled) return; // one stage per swipe

  const dist = Math.abs(dy);
  const speed = dist / Math.max(1, now() - st.touchStartT);
  const flick = dist >= TOUCH_FLICK_DIST && speed >= TOUCH_FLICK_SPEED;
  if (dist < TOUCH_THRESHOLD && !flick) return;

  st.touchHandled = true;
  request(dy > 0 ? 1 : -1);
}

function onTouchEnd(e: TouchEvent) {
  st.touching = e.touches.length > 0;
  if (!st.touching && st.touchMoved) st.touchEndAt = now();
}

/* ---------- KEYBOARD ---------- */

function onKeyDown(e: KeyboardEvent) {
  if (e.altKey || e.ctrlKey || e.metaKey) return;

  const el = e.target as HTMLElement | null;
  const tag = el?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el?.isContentEditable) return;

  let dir: Step | 0 = 0;
  if (e.key === 'ArrowDown' || e.key === 'PageDown') dir = 1;
  else if (e.key === 'ArrowUp' || e.key === 'PageUp') dir = -1;
  else if (e.key === ' ' && tag !== 'BUTTON' && tag !== 'A') dir = e.shiftKey ? -1 : 1;
  if (!dir) return; // Home / End / Tab etc. stay native (the pin lets go)

  st.lastKeyAt = now();

  // Unlocked: native scrolling runs; the scroll listener locks us in range.
  if (!st.active && !st.animating) return;

  e.preventDefault();
  if (e.repeat || !st.active) return;
  request(dir);
}

/* ---------- SCROLL (scrollbar drags, anchors, flings, arrival) ---------- */

function scheduleSettle() {
  window.clearTimeout(st.settleTimer);
  st.settleTimer = window.setTimeout(settle, SETTLE_MS);
}

/** After the user has stopped moving the page themselves. Never moves the page. */
function settle() {
  st.settleTimer = 0;
  if (st.active || st.animating || st.touching) return;

  const vh = window.innerHeight;
  for (const e of Array.from(entries)) {
    const r = e.el.getBoundingClientRect();
    if (Math.abs(r.top) <= ALIGN_TOLERANCE && r.bottom > vh * 0.5) {
      st.w.used = false;
      activate(e, st.lastDir, 0);
      return;
    }
  }
}

function onScroll() {
  const y = window.scrollY;
  const t = now();

  // 1. Echo of our own scrollTo - ignore.
  if (t - st.ownAt < 120 && Math.abs(y - st.ownY) <= OWN_SCROLL_TOLERANCE) {
    st.lastScrollY = y;
    st.vY = y;
    st.vT = t;
    st.vel = 0;
    return;
  }

  // 2. Track native speed (to seed the spring).
  const dt = t - st.vT;
  st.vel = dt > 0 && dt < 120 ? st.vel * 0.4 + ((y - st.vY) / dt) * 1000 * 0.6 : 0;
  st.vY = y;
  st.vT = t;

  const prev = st.lastScrollY;
  st.lastScrollY = y;
  if (y !== prev) st.lastDir = y > prev ? 'down' : 'up';

  // 3. Nothing is driving this scroll: scrollbar drag, anchor link, find-in-page,
  //    Home/End, focus jump... The page belongs to the user - never fight it.
  if (!inputDriven(t)) {
    if (st.animating) cancelGlide();

    if (st.active) {
      const top = st.active.el.getBoundingClientRect().top;
      if (Math.abs(top) <= PIN_HOLD_TOLERANCE) {
        setScroll(y + top); // layout-shift jitter, keep the pin
        return;
      }
      deactivate(); // the user left the section
    }
    scheduleSettle();
    return;
  }

  // 4. Wheel / touch-momentum / key driven scroll.
  if (st.animating) return;

  if (st.active) {
    // hold the pin against stray momentum
    const top = st.active.el.getBoundingClientRect().top;
    if (Math.abs(top) > 1) setScroll(y + top);
    return;
  }

  if (y === prev) return;
  const found = findEntry(st.lastDir, leadPx());
  if (found) lock(found.entry, found.dir);
}

function onResize() {
  if (st.active && !st.animating) {
    const top = st.active.el.getBoundingClientRect().top;
    if (Math.abs(top) > 0.5) setScroll(window.scrollY + top);
  }
}

/* ---------- attach / detach ---------- */

function attach() {
  if (attached) return;
  attached = true;
  st.lastScrollY = window.scrollY;
  st.vY = window.scrollY;

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  scheduleSettle(); // page may load already aligned with a pinned section
}

function detach() {
  if (!attached) return;
  attached = false;

  cancelGlide();
  clearPending();
  window.clearTimeout(st.settleTimer);
  st.settleTimer = 0;
  st.active = null;
  st.touching = false;
  st.touchMoved = false;
  st.w.used = false;
  st.lastWheelAt = NEVER;
  st.lastKeyAt = NEVER;
  st.touchEndAt = NEVER;

  window.removeEventListener('wheel', onWheel);
  window.removeEventListener('touchstart', onTouchStart);
  window.removeEventListener('touchmove', onTouchMove);
  window.removeEventListener('touchend', onTouchEnd);
  window.removeEventListener('touchcancel', onTouchEnd);
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
}

function registerPinnedSection(el: HTMLElement, get: () => PinnedConfig) {
  const entry: Entry = { el, get };
  entries.add(entry);
  attach();

  return () => {
    if (st.active === entry) {
      st.active = null;
      clearPending();
    }
    el.style.touchAction = '';
    entries.delete(entry);
    if (entries.size === 0) detach();
  };
}

/* =========================================================
   HOOK
========================================================= */

export function usePinnedSection(
  ref: { current: HTMLElement | null },
  config: PinnedConfig,
) {
  const cfgRef = useRef(config);
  cfgRef.current = config; // always the latest callbacks, no stale closures

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerPinnedSection(el, () => cfgRef.current);
  }, [ref]);
}


// 'use client';

// import { useEffect, useRef } from 'react';

// /* =========================================================
//    SHARED PINNED-SECTION ENGINE
//    One set of listeners + one animation for ALL pinned
//    sections, so they can never fight each other.
// ========================================================= */

// export type PinDirection = 'down' | 'up';

// export interface PinnedConfig {
//   /** number of stages inside the section */
//   count: number;
//   /** ignore input this long (ms) after each stage change */
//   stepLock?: number;
//   /** called when the section takes over. Return the starting stage. */
//   onEnter: (direction: PinDirection) => { index: number; busyMs?: number };
//   /** called for every stage change while pinned */
//   onStep: (index: number) => void;
//   /** called when the section hands off to a neighbour */
//   onExit?: () => void;
// }

// interface Entry {
//   el: HTMLElement;
//   get: () => PinnedConfig;
// }

// /* ---------- tuning ---------- */
// const ENTRY_THRESHOLD = 140; // px from viewport edge where a section locks
// const ENTER_DURATION = 700; // pin-to-viewport animation
// const EXIT_DURATION = 800; // hand-off animation
// const GESTURE_GAP = 150; // trackpad momentum guard (ms)
// const TOUCH_THRESHOLD = 40; // min swipe distance (px)
// const ALIGN_TOLERANCE = 4; // px

// const INSTANT = 'instant' as ScrollBehavior;

// /* ---------- state (module singleton) ---------- */
// const entries = new Set<Entry>();
// let attached = false;

// const st = {
//   active: null as Entry | null,
//   index: 0,
//   animating: false,
//   awaitFresh: false,
//   busyUntil: 0,
//   raf: 0,
//   lastWheel: 0,
//   lastAbs: 0,
//   lastScrollY: 0,
//   touchStartY: 0,
//   touchHandled: false,
// };

// /* ---------- helpers ---------- */

// const topOf = (el: HTMLElement) => window.scrollY + el.getBoundingClientRect().top;
// const maxScrollY = () =>
//   Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

// function animateScrollTo(target: number, duration: number) {
//   cancelAnimationFrame(st.raf);
//   const startY = window.scrollY;
//   const dist = target - startY;

//   if (Math.abs(dist) < 1) {
//     st.animating = false;
//     return;
//   }

//   st.animating = true;
//   const t0 = performance.now();

//   const tick = (now: number) => {
//     const t = Math.min(1, (now - t0) / duration);
//     const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
//     window.scrollTo({ top: startY + dist * eased, left: 0, behavior: INSTANT });

//     if (t < 1) {
//       st.raf = requestAnimationFrame(tick);
//     } else {
//       st.animating = false;
//       st.lastScrollY = window.scrollY;
//     }
//   };
//   st.raf = requestAnimationFrame(tick);
// }

// /** Which registered section (if any) should take over for this direction? */
// function findEntry(dir: PinDirection) {
//   const vh = window.innerHeight;
//   let best: { entry: Entry; dir: PinDirection; top: number } | null = null;

//   for (const e of Array.from(entries)) {
//     const r = e.el.getBoundingClientRect();
//     const aligned = Math.abs(r.top) <= 2 && r.bottom > vh * 0.5;
//     const ok =
//       aligned ||
//       (dir === 'down'
//         ? r.top <= ENTRY_THRESHOLD && r.bottom > vh * 0.5
//         : r.top <= 1 && r.bottom > -ENTRY_THRESHOLD);

//     if (!ok) continue;
//     if (!best || r.top > best.top) {
//       best = { entry: e, dir: aligned ? 'down' : dir, top: r.top };
//     }
//   }
//   return best;
// }

// /** Make `entry` the owner of the page. */
// function activate(entry: Entry, dir: PinDirection, travelMs: number) {
//   const res = entry.get().onEnter(dir);
//   st.active = entry;
//   st.index = res.index;
//   st.busyUntil = Date.now() + Math.max(res.busyMs ?? 0, travelMs + 200);
//   entry.el.style.touchAction = 'none';
// }

// function lock(entry: Entry, dir: PinDirection) {
//   if (st.active || st.animating) return;
//   activate(entry, dir, ENTER_DURATION);
//   animateScrollTo(topOf(entry.el), ENTER_DURATION);
// }

// function release(dir: PinDirection) {
//   const entry = st.active;
//   if (!entry) return;

//   const top = topOf(entry.el);
//   const h = entry.el.offsetHeight;
//   const target =
//     dir === 'down'
//       ? Math.min(top + h, maxScrollY()) // top of next section
//       : Math.max(0, top - window.innerHeight); // bottom of previous section

//   // Nowhere to go (first / last section on the page): stay pinned.
//   if (Math.abs(target - window.scrollY) < 2) return;

//   entry.el.style.touchAction = 'auto';
//   entry.get().onExit?.();
//   st.active = null;
//   st.awaitFresh = true; // swallow the momentum tail

//   // If the neighbour is also a pinned section, hand over directly.
//   for (const e of Array.from(entries)) {
//     if (e !== entry && Math.abs(topOf(e.el) - target) <= ALIGN_TOLERANCE) {
//       activate(e, dir, EXIT_DURATION);
//       break;
//     }
//   }

//   animateScrollTo(target, EXIT_DURATION);
// }

// function step(dir: 1 | -1) {
//   const entry = st.active;
//   if (!entry) return;
//   const cfg = entry.get();
//   const next = st.index + dir;

//   if (next >= 0 && next < cfg.count) {
//     st.index = next;
//     cfg.onStep(next);
//     st.busyUntil = Date.now() + (cfg.stepLock ?? 900);
//     return;
//   }
//   release(dir > 0 ? 'down' : 'up');
// }

// /* ---------- WHEEL ---------- */

// function onWheel(e: WheelEvent) {
//   if (e.ctrlKey) return; // pinch zoom
//   if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // horizontal

//   let delta = e.deltaY;
//   if (e.deltaMode === 1) delta *= 16;
//   if (e.deltaMode === 2) delta *= window.innerHeight;

//   const abs = Math.abs(delta);
//   if (abs < 2) return;

//   const now = Date.now();
//   const gap = now - st.lastWheel;
//   const prevAbs = st.lastAbs;
//   st.lastWheel = now;
//   st.lastAbs = abs;

//   const dir: PinDirection = delta > 0 ? 'down' : 'up';

//   if (st.animating) {
//     e.preventDefault();
//     return;
//   }

//   if (st.awaitFresh) {
//     if (gap > GESTURE_GAP) st.awaitFresh = false;
//     else {
//       e.preventDefault();
//       return;
//     }
//   }

//   if (!st.active) {
//     const found = findEntry(dir);
//     if (found) {
//       e.preventDefault();
//       lock(found.entry, found.dir);
//     }
//     return; // otherwise: normal browser scrolling
//   }

//   e.preventDefault(); // locked: the page never moves
//   if (now < st.busyUntil) return;

//   const accelerating = abs > prevAbs + 10;
//   if (gap <= GESTURE_GAP && !accelerating) return;

//   step(delta > 0 ? 1 : -1);
// }

// /* ---------- TOUCH ---------- */

// function onTouchStart(e: TouchEvent) {
//   st.touchStartY = e.touches[0].clientY;
//   st.touchHandled = false;
// }

// function onTouchMove(e: TouchEvent) {
//   const dy = st.touchStartY - e.touches[0].clientY; // >0 = swipe up = go down

//   if (st.animating) {
//     if (e.cancelable) e.preventDefault();
//     return;
//   }

//   if (!st.active) {
//     if (st.touchHandled || Math.abs(dy) < 8) return;
//     const dir: PinDirection = dy > 0 ? 'down' : 'up';
//     const found = findEntry(dir);
//     if (found) {
//       if (e.cancelable) e.preventDefault();
//       st.touchHandled = true;
//       lock(found.entry, found.dir);
//     }
//     return;
//   }

//   if (e.cancelable) e.preventDefault();
//   if (st.touchHandled) return; // one stage per swipe
//   if (Math.abs(dy) < TOUCH_THRESHOLD) return;
//   if (Date.now() < st.busyUntil) return;

//   st.touchHandled = true;
//   step(dy > 0 ? 1 : -1);
// }

// /* ---------- KEYBOARD ---------- */

// function onKeyDown(e: KeyboardEvent) {
//   if (e.altKey || e.ctrlKey || e.metaKey) return;

//   const el = e.target as HTMLElement | null;
//   const tag = el?.tagName;
//   if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el?.isContentEditable) return;

//   let dir: 1 | -1 | 0 = 0;
//   if (e.key === 'ArrowDown' || e.key === 'PageDown') dir = 1;
//   else if (e.key === 'ArrowUp' || e.key === 'PageUp') dir = -1;
//   else if (e.key === ' ' && tag !== 'BUTTON' && tag !== 'A') dir = e.shiftKey ? -1 : 1;
//   if (!dir) return;

//   // Unlocked: native scrolling runs; the scroll listener locks us in range.
//   if (!st.active && !st.animating) return;

//   e.preventDefault();
//   if (st.animating || e.repeat) return;
//   if (Date.now() < st.busyUntil) return;

//   step(dir);
// }

// /* ---------- SCROLL (scrollbar drags, flings, arrival) ---------- */

// function onScroll() {
//   const y = window.scrollY;
//   const moved = y !== st.lastScrollY;
//   const goingDown = y > st.lastScrollY;
//   st.lastScrollY = y;

//   if (st.animating) return;

//   if (st.active) {
//     const top = st.active.el.getBoundingClientRect().top;
//     if (Math.abs(top) > 1) {
//       window.scrollTo({ top: y + top, left: 0, behavior: INSTANT });
//     }
//     return;
//   }

//   if (!moved) return;

//   const dir: PinDirection = goingDown ? 'down' : 'up';
//   const found = findEntry(dir);
//   if (found) lock(found.entry, found.dir);
// }

// function onResize() {
//   if (st.active && !st.animating) {
//     const top = st.active.el.getBoundingClientRect().top;
//     window.scrollTo({ top: window.scrollY + top, left: 0, behavior: INSTANT });
//   }
// }

// /* ---------- attach / detach ---------- */

// function attach() {
//   if (attached) return;
//   attached = true;
//   st.lastScrollY = window.scrollY;
//   window.addEventListener('wheel', onWheel, { passive: false });
//   window.addEventListener('touchstart', onTouchStart, { passive: true });
//   window.addEventListener('touchmove', onTouchMove, { passive: false });
//   window.addEventListener('keydown', onKeyDown);
//   window.addEventListener('scroll', onScroll, { passive: true });
//   window.addEventListener('resize', onResize);
// }

// function detach() {
//   if (!attached) return;
//   attached = false;
//   cancelAnimationFrame(st.raf);
//   st.animating = false;
//   st.active = null;
//   st.awaitFresh = false;
//   window.removeEventListener('wheel', onWheel);
//   window.removeEventListener('touchstart', onTouchStart);
//   window.removeEventListener('touchmove', onTouchMove);
//   window.removeEventListener('keydown', onKeyDown);
//   window.removeEventListener('scroll', onScroll);
//   window.removeEventListener('resize', onResize);
// }

// function registerPinnedSection(el: HTMLElement, get: () => PinnedConfig) {
//   const entry: Entry = { el, get };
//   entries.add(entry);
//   attach();

//   return () => {
//     if (st.active === entry) st.active = null;
//     el.style.touchAction = '';
//     entries.delete(entry);
//     if (entries.size === 0) detach();
//   };
// }

// /* =========================================================
//    HOOK
// ========================================================= */

// export function usePinnedSection(
//   ref: { current: HTMLElement | null },
//   config: PinnedConfig,
// ) {
//   const cfgRef = useRef(config);
//   cfgRef.current = config; // always the latest callbacks, no stale closures

//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     return registerPinnedSection(el, () => cfgRef.current);
//   }, [ref]);
// }