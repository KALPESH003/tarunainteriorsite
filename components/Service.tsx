'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion';

/* =========================================================
   DATA
========================================================= */

const services = [
  {
    id: 'modular',
    title: 'MODULAR',
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1600&auto=format&fit=crop',
    description:
      'Precision-engineered modular kitchens and wardrobes designed for maximum space efficiency and modern aesthetics.',
  },
  {
    id: 'interior',
    title: 'INTERIOR',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop',
    description:
      'Bespoke interior spaces crafted with meticulous detail. We curate layouts, materials, and textures to build personal, expressive, and functional sanctuaries.',
  },
  {
    id: 'outdoors',
    title: 'OUTDOORS',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    description:
      'Transformative outdoor living solutions, landscapes, and architectural extensions built to withstand the elements with elegance.',
  },
  {
    id: 'space-saving',
    title: 'SPACE SAVING',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
    description:
      'Clever multi-functional furniture and architectural transformations optimized for compact urban living.',
  },
  {
    id: 'turnkey',
    title: 'TURNKEY',
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600&auto=format&fit=crop',
    description:
      'Complete end-to-end execution from initial blueprints to final white-glove interior styling.',
  },
  {
    id: 'foldable',
    title: 'FOLDABLE',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop',
    description:
      'Innovative folding mechanisms and adaptable installations that reconfigure your rooms instantly.',
  },
  {
    id: 'residential',
    title: 'RESIDENTIAL',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
    description:
      'Comprehensive architectural and interior design solutions tailored for luxury private villas and apartments.',
  },
  {
    id: 'commercial',
    title: 'COMMERCIAL',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
    description:
      'High-impact retail showrooms, hospitality venues, and client-facing spaces built to elevate brand prestige.',
  },
  {
    id: 'corporate',
    title: 'CORPORATE',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1600&auto=format&fit=crop',
    description:
      'Ergonomic, collaborative, and future-proof workspaces designed to maximize employee productivity and wellness.',
  },
];

const N = services.length;
const detailHref = (id: string) => `/services/${id}`;
const toTitle = (t: string) => t.charAt(0) + t.slice(1).toLowerCase();

/* =========================================================
   SETTINGS
========================================================= */

const AUTOPLAY_MS = 6000; // hold each card for 6s, then glide to the next
const MOVE_S = 1.2; // slide duration (seconds) - smooth spring, no bounce

// Entrance (fast + cinematic). The trigger fires BEFORE the section is on screen,
// so the animation is already running when the user arrives (no blank section).
const DUST_MS = 1200; // white dust veil clears in ~1.2s
const REVEAL_AT_MS = 250; // heading / cards start entering almost immediately
const PRE_TRIGGER = '0px 0px 25% 0px'; // start 25% of viewport height before entering

/* =========================================================
   LAYOUT  (1440 x 1000 design canvas scaled to width)
========================================================= */

const CANVAS_W = 1440;
const CANVAS_H = 1000;

const CARD_W = 520;
const CARD_H = 512;
const CARD_TOP = 185;
const FIRST_LEFT = 31;
const GAP = 25;
const PITCH = CARD_W + GAP;
const INFO_TOP = CARD_TOP + CARD_H + 14;
const PAR = 36;

const BTN = { left: 628, top: 868, w: 80, h: 58, gap: 24 };

const TRACK_MIN = CANVAS_W - FIRST_LEFT - (FIRST_LEFT + (N - 1) * PITCH + CARD_W);
const trackX = (pos: number) => Math.min(0, Math.max(TRACK_MIN, (1 - pos) * PITCH));

/* =========================================================
   MOTION
========================================================= */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CONDENSED = { fontFamily: '"Roboto Condensed", sans-serif' };
const MONO = { fontFamily: '"Roboto Mono", monospace' };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// Entrance choreography: quick, staggered, clip-reveal + image "push-in"
const cardV: Variants = {
  hide: { clipPath: 'inset(100% 0% 0% 0%)', y: 50 },
  show: (i: number) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    y: 0,
    transition: { duration: 1, ease: EASE, delay: 0.05 + Math.min(i, 3) * 0.09 },
  }),
};
const imgV: Variants = {
  hide: { scale: 1.35 },
  show: { scale: 1, transition: { duration: 1.5, ease: EASE, delay: 0.05 } },
};
const infoV: Variants = {
  hide: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: 0.35 + Math.min(i, 3) * 0.09 },
  }),
};
const btnV: Variants = {
  hide: { opacity: 0, y: 20, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE, delay: 0.6 } },
};
const ghostV: Variants = {
  hide: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE, delay: 0 } },
};

/* =========================================================
   FIT CANVAS TO SCREEN WIDTH
========================================================= */

function useFit(ref: React.RefObject<HTMLElement | null>) {
  const [fit, setFit] = useState({ s: 1, ready: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (!w) return;
      setFit({ s: w / CANVAS_W, ready: true });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return fit;
}

/* =========================================================
   SMALL PIECES
========================================================= */

const fadeMask = 'linear-gradient(to bottom, #000 12%, transparent 74%)';

function Ghost({
  text,
  left,
  top,
  factor,
  track,
  rv,
}: {
  text: string;
  left: number;
  top: number;
  factor: number;
  track: MotionValue<number>;
  rv: { initial: 'hide'; animate: 'hide' | 'show' };
}) {
  const x = useTransform(track, (v) => v * factor);
  return (
    <motion.div
      aria-hidden="true"
      variants={ghostV}
      {...rv}
      className="pointer-events-none absolute z-[1] mix-blend-difference"
      style={{ left, top }}
    >
      <motion.span
        className="block select-none whitespace-nowrap font-black italic uppercase tracking-[-0.02em] text-[#151515]"
        style={{
          ...CONDENSED,
          x,
          fontSize: 270,
          lineHeight: 0.8,
          WebkitMaskImage: fadeMask,
          maskImage: fadeMask,
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
}

function CardImage({
  src,
  alt,
  i,
  track,
}: {
  src: string;
  alt: string;
  i: number;
  track: MotionValue<number>;
}) {
  const px = useTransform(track, (v) => {
    const center = FIRST_LEFT + i * PITCH + v + CARD_W / 2;
    const t = clamp((CANVAS_W / 2 - center) / (CANVAS_W / 2 + CARD_W / 2), -1, 1);
    return t * PAR;
  });
  return (
    <motion.div className="absolute bottom-0 top-0" style={{ left: -PAR, right: -PAR, x: px }}>
      {/* inherits hide/show from the card -> cinematic push-in while the card unmasks */}
      <motion.div variants={imgV} className="absolute inset-0 will-change-transform">
        <Image src={src} alt={alt} fill sizes="600px" priority={i < 3} className="object-cover" />
      </motion.div>
    </motion.div>
  );
}

function ArrowButton({
  dir,
  disabled,
  onClick,
}: {
  dir: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={dir === 'prev' ? 'Previous service' : 'Next service'}
      disabled={disabled}
      onClick={onClick}
      animate={{ opacity: disabled ? 0.3 : 1 }}
      whileHover={disabled ? undefined : { backgroundColor: '#e6e6e6' }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center rounded-[6px] bg-white outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed"
      style={{ width: BTN.w, height: BTN.h }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dir === 'prev' ? <path d="M19 12H5M12 19l-7-7 7-7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
      </svg>
    </motion.button>
  );
}

/* =========================================================
   DUST VEIL - white grain that sweeps away bottom -> top.
   Plays once, quickly, then unmounts.
========================================================= */

const DW = 720;
const DH = 500;
const SOFT = 0.16;

function buildField() {
  const out = new Float32Array(DW * DH);
  const octave = (cell: number, weight: number) => {
    const gw = Math.ceil(DW / cell) + 2;
    const gh = Math.ceil(DH / cell) + 2;
    const grid = new Float32Array(gw * gh);
    for (let i = 0; i < grid.length; i++) grid[i] = Math.random();
    for (let y = 0; y < DH; y++) {
      const fy = y / cell;
      const iy = Math.floor(fy);
      const ty = fy - iy;
      const sy = ty * ty * (3 - 2 * ty);
      for (let x = 0; x < DW; x++) {
        const fx = x / cell;
        const ix = Math.floor(fx);
        const tx = fx - ix;
        const sx = tx * tx * (3 - 2 * tx);
        const a = grid[iy * gw + ix];
        const b = grid[iy * gw + ix + 1];
        const c = grid[(iy + 1) * gw + ix];
        const d = grid[(iy + 1) * gw + ix + 1];
        const top = a + (b - a) * sx;
        const bot = c + (d - c) * sx;
        out[y * DW + x] += weight * (top + (bot - top) * sy);
      }
    }
  };
  octave(140, 0.3);
  octave(48, 0.28);
  octave(14, 0.2);
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < out.length; i++) {
    out[i] += Math.random() * 0.22;
    if (out[i] < min) min = out[i];
    if (out[i] > max) max = out[i];
  }
  for (let y = 0; y < DH; y++) {
    const g = 1 - y / DH;
    for (let x = 0; x < DW; x++) {
      const i = y * DW + x;
      out[i] = g * 0.6 + ((out[i] - min) / (max - min)) * 0.4;
    }
  }
  return out;
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// slightly gentler curve than cubic so the clear starts right away
const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

function DustVeil({ play, skip }: { play: boolean; skip: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<Float32Array | null>(null);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  const paint = useCallback((t: number) => {
    const cv = canvasRef.current;
    const field = fieldRef.current;
    if (!cv || !field) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(DW, DH);
    const px = new Uint32Array(img.data.buffer);
    for (let i = 0; i < field.length; i++) {
      const a = Math.min(1, Math.max(0, (field[i] - t) / SOFT + 0.5));
      px[i] = (Math.round(a * 255) << 24) | 0x00ffffff;
    }
    ctx.putImageData(img, 0, 0);
  }, []);

  useIsoLayoutEffect(() => {
    if (skip) return;
    fieldRef.current = buildField();
    paint(-0.1);
    setReady(true);
  }, [skip, paint]);

  useEffect(() => {
    if (skip) {
      setDone(true);
      return;
    }
    if (!play || !ready) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / DUST_MS);
      paint(-0.1 + easeInOut(p) * 1.2);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDone(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, ready, skip, paint]);

  if (done) return null;
  return (
    <>
      {!ready && <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white" />}
      <canvas
        ref={canvasRef}
        width={DW}
        height={DH}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </>
  );
}

/* =========================================================
   DESKTOP: cinematic entrance + carousel (all cards equal)
========================================================= */

function Desktop() {
  const reduce = useReducedMotion();

  const stageRef = useRef<HTMLDivElement>(null);
  const fit = useFit(stageRef);
  const inView = useInView(stageRef, { amount: 0.2 });

  const [pos, setPos] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const rv = { initial: 'hide', animate: revealed ? 'show' : 'hide' } as const;

  /* Fires BEFORE the section scrolls into view, so the entrance is already
     underway (or finished) when the user arrives - never a blank section. */
  const started = useInView(stageRef, { amount: 'some', once: true, margin: PRE_TRIGGER });
  useEffect(() => {
    if (!started) return;
    const t = window.setTimeout(() => setRevealed(true), reduce ? 0 : REVEAL_AT_MS);
    return () => window.clearTimeout(t);
  }, [started, reduce]);

  /* ---------- carousel ---------- */
  const track = useMotionValue(0);

  useEffect(() => {
    animate(track, trackX(pos), reduce ? { duration: 0 } : { type: 'spring', duration: MOVE_S, bounce: 0 });
  }, [pos, reduce, track]);

  const go = useCallback((dir: number) => setPos((p) => clamp(p + dir, 0, N - 1)), []);
  const goTo = useCallback((i: number) => setPos(clamp(i, 0, N - 1)), []);

  // autoplay every 6s; after the last card it glides back to the first
  useEffect(() => {
    if (reduce || !revealed || hovered || !inView) return;
    const t = window.setTimeout(() => setPos((p) => (p >= N - 1 ? 0 : p + 1)), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [pos, revealed, hovered, inView, reduce]);

  return (
    <motion.div
      ref={stageRef}
      className="relative isolate hidden w-full overflow-hidden bg-black xl:block"
      style={{ height: CANVAS_H * fit.s, touchAction: 'pan-y' }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our expertise"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}
      onPanEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 60 && Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
          go(info.offset.x < 0 ? 1 : -1);
        }
      }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left bg-black"
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `scale(${fit.s})`,
          visibility: fit.ready ? 'visible' : 'hidden',
        }}
      >
        {/* 1. White dust veil that clears fast to reveal the black section */}
        <DustVeil play={started} skip={!!reduce} />

        {/* 2. Giant faint words */}
        <Ghost text="END 2 END" left={520} top={22} factor={0.06} track={track} rv={rv} />
        <Ghost text="SOLUTIONS" left={-520} top={795} factor={0.12} track={track} rv={rv} />

        {/* 3. Header */}
        <div
          className="absolute z-10 mix-blend-difference"
          style={{
            left: 32 / fit.s,
            top: 40 / fit.s,
            transform: `scale(${1 / fit.s})`,
            transformOrigin: 'top left',
          }}
        >
          <motion.div
            {...rv}
            variants={{ hide: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0 } } }}
          >
            <h2
              className="relative w-max whitespace-nowrap font-bold uppercase text-white"
              style={{ ...CONDENSED, fontSize: 64, lineHeight: 1.05, letterSpacing: '-0.01em' }}
            >
              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  variants={{
                    hide: { y: reduce ? '0%' : '110%', opacity: reduce ? 0 : 1 },
                    show: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: EASE } },
                  }}
                  className="block will-change-transform"
                >
                  OUR EXPERTISE
                </motion.span>
              </span>
              <motion.span
                variants={{
                  hide: { opacity: 0 },
                  show: { opacity: 1, transition: { duration: 0.6, delay: 0.3 } },
                }}
                className="absolute left-full top-[5px] ml-[12px] text-[13px] font-medium leading-none text-white"
                style={{ ...MONO, letterSpacing: '-0.02em' }}
              >
                [02]
              </motion.span>
            </h2>
          </motion.div>
        </div>

        {/* 4. Image track */}
        <motion.div
          {...rv}
          variants={{ hide: {}, show: {} }}
          className="absolute inset-0 z-[4]"
          style={{ x: track }}
        >
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              custom={i}
              variants={cardV}
              role="button"
              tabIndex={0}
              aria-label={`Show ${s.title}`}
              onClick={() => goTo(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  goTo(i);
                }
              }}
              className="absolute cursor-pointer overflow-hidden bg-neutral-900"
              style={{
                left: FIRST_LEFT + i * PITCH,
                top: CARD_TOP,
                width: CARD_W,
                height: CARD_H,
              }}
            >
              <CardImage src={s.image} alt={s.title} i={i} track={track} />
            </motion.div>
          ))}
        </motion.div>

        {/* 5. Info track - every card equally bright */}
        <motion.div
          {...rv}
          variants={{ hide: {}, show: {} }}
          className="absolute left-0 z-[5] mix-blend-difference"
          style={{ x: track, top: INFO_TOP, width: CANVAS_W, height: 200 }}
        >
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              custom={i}
              variants={infoV}
              className="absolute top-0 text-center"
              style={{ left: FIRST_LEFT + i * PITCH, width: CARD_W }}
            >
              <h3
                className="text-[36px] font-bold leading-none text-white"
                style={{ ...CONDENSED, letterSpacing: '-0.01em' }}
              >
                {toTitle(s.title)}
              </h3>
              <p
                className="mx-auto mt-[18px] text-[14px] font-medium leading-[19px] tracking-[0.1em] text-white"
                style={{ ...CONDENSED, maxWidth: 460 }}
              >
                {s.description}{' '}
                <Link
                  href={detailHref(s.id)}
                  className="font-bold underline underline-offset-[3px] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  discover more.
                </Link>
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* 6. Arrows */}
        <motion.div
          {...rv}
          variants={btnV}
          className="absolute z-20 flex mix-blend-difference"
          style={{ left: BTN.left, top: BTN.top, gap: BTN.gap }}
        >
          <ArrowButton dir="prev" disabled={pos === 0} onClick={() => go(-1)} />
          <ArrowButton dir="next" disabled={pos === N - 1} onClick={() => go(1)} />
        </motion.div>
      </div>

      <p className="sr-only" aria-live="polite">
        {`${toTitle(services[pos].title)}, ${pos + 1} of ${N}`}
      </p>
    </motion.div>
  );
}

/* =========================================================
   MOBILE / TABLET: dark stacked list
========================================================= */

function Stacked() {
  const ref = useRef<HTMLDivElement>(null);
  // starts slightly before the block is visible so it is never seen white/blank
  const seen = useInView(ref, { amount: 'some', once: true, margin: PRE_TRIGGER });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{ backgroundColor: seen ? '#000000' : '#ffffff' }}
      transition={{ duration: 0.8, ease: EASE }}
      className="px-5 pb-16 pt-10 xl:hidden"
    >
      <motion.h2
        initial={false}
        animate={{ color: seen ? '#ffffff' : '#1a1a1a' }}
        transition={{ duration: 0.8, ease: EASE }}
        style={CONDENSED}
        className="mb-8 text-[40px] font-bold uppercase leading-[1.05] tracking-[-0.01em]"
      >
        OUR EXPERTISE
        <sup className="ml-1 align-top text-[12px] font-medium" style={MONO}>
          [02]
        </sup>
      </motion.h2>
      <ul className="flex flex-col gap-12">
        {services.map((s, i) => (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
              <Image src={s.image} alt={s.title} fill sizes="100vw" priority={i === 0} className="object-cover" />
            </div>
            <h3 className="mt-5 text-[30px] font-bold leading-none text-white" style={CONDENSED}>
              {toTitle(s.title)}
            </h3>
            <p
              className="mx-auto mt-3 max-w-[460px] text-[14px] font-medium leading-[19px] tracking-[0.08em] text-white"
              style={CONDENSED}
            >
              {s.description}{' '}
              <Link href={detailHref(s.id)} className="font-bold underline underline-offset-[3px]">
                discover more.
              </Link>
            </p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/* =========================================================
   SECTION
========================================================= */

export default function ServicesShowcase() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative w-full bg-black text-white">
        <Desktop />
        <Stacked />
      </section>
    </MotionConfig>
  );
}







// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import {
//   motion,
//   MotionConfig,
//   useReducedMotion,
//   useScroll,
//   useMotionValueEvent,
//   type Transition,
//   type Variants,
// } from 'framer-motion';

// /* =========================================================
//    DATA  (all services + details live here)
// ========================================================= */

// const services = [
//   {
//     id: 'modular',
//     title: 'MODULAR',
//     image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Precision-engineered modular kitchens and wardrobes designed for maximum space efficiency and modern aesthetics.',
//   },
//   {
//     id: 'interior',
//     title: 'INTERIOR',
//     image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Bespoke interior spaces crafted with meticulous detail. We curate layouts, materials, and textures to build personal, expressive, and functional sanctuaries.',
//   },
//   {
//     id: 'outdoors',
//     title: 'OUTDOORS',
//     image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Transformative outdoor living solutions, landscapes, and architectural extensions built to withstand the elements with elegance.',
//   },
//   {
//     id: 'space-saving',
//     title: 'SPACE SAVING',
//     image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Clever multi-functional furniture and architectural transformations optimized for compact urban living.',
//   },
//   {
//     id: 'turnkey',
//     title: 'TURNKEY',
//     image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Complete end-to-end execution from initial blueprints to final white-glove interior styling.',
//   },
//   {
//     id: 'foldable',
//     title: 'FOLDABLE',
//     image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Innovative folding mechanisms and adaptable installations that reconfigure your rooms instantly.',
//   },
//   {
//     id: 'residential',
//     title: 'RESIDENTIAL',
//     image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Comprehensive architectural and interior design solutions tailored for luxury private villas and apartments.',
//   },
//   {
//     id: 'commercial',
//     title: 'COMMERCIAL',
//     image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'High-impact retail showrooms, hospitality venues, and client-facing spaces built to elevate brand prestige.',
//   },
//   {
//     id: 'corporate',
//     title: 'CORPORATE',
//     image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Ergonomic, collaborative, and future-proof workspaces designed to maximize employee productivity and wellness.',
//   },
// ];

// const detailHref = (id: string) => `/services/${id}`;

// /* =========================================================
//    LAYOUT  - designed on a 1440 x 1000 canvas (matches the
//    reference frames) and scaled to fit the screen.
// ========================================================= */

// type Rect = { left: number; top: number; width: number; height: number };

// const CANVAS_W = 1440;
// const CANVAS_H = 1000;

// const MAIN: Rect = { left: 489, top: 235, width: 476, height: 706 };
// const PREV: Rect = { left: 360, top: 235, width: 104, height: 121 };
// const NEXT: Rect = { left: 993, top: 820, width: 104, height: 121 };
// const TEXT = { left: 1003, top: 498, width: 380 };

// // Dashed guide lines (the slot outlines from the reference frame)
// const H_LINES = [
//   { y: 235, x1: 0, x2: 1440 },
//   { y: 357, x1: 0, x2: 489 },
//   { y: 820, x1: 965, x2: 1440 },
//   { y: 941, x1: 0, x2: 1440 },
// ];
// const V_LINES = [360, 464, 489, 965, 993, 1097].map((x) => ({ x, y1: 235, y2: 1000 }));

// /* =========================================================
//    MOTION SETTINGS
// ========================================================= */

// const STEPS = services.length + 1; // step 0 = header only, step n = service n-1
// const SCROLL_PER_STEP_VH = 60;

// const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
// const MOVE: [number, number, number, number] = [0.76, 0, 0.24, 1];

// // one transition = text out -> guides in -> images slide -> guides out -> text in
// const T_GUIDES_IN = 80;
// const T_MOVE = 380;
// const T_GUIDES_OUT = 1330;
// const T_DONE = 1650;

// const CONDENSED = { fontFamily: '"Roboto Condensed", sans-serif' };
// const MONO = { fontFamily: '"Roboto Mono", monospace' };

// /* =========================================================
//    TILE STATE
//    Every service is one tile that glides between slots:
//    previous (top-left) <- main (centre) <- next (bottom-right)
// ========================================================= */

// const OPEN = 'inset(0% 0% 0% 0%)';
// const CLOSED_BOTTOM = 'inset(100% 0% 0% 0%)'; // image grows up from the bottom edge

// function tileTarget(i: number, c: number) {
//   if (c < 0) {
//     // header-only state: nothing visible yet
//     return i === 0
//       ? { ...MAIN, opacity: 1, scale: 1, clipPath: CLOSED_BOTTOM }
//       : { ...NEXT, opacity: 0, scale: 0.5, clipPath: OPEN };
//   }
//   const r = i - c;
//   if (r === 0) return { ...MAIN, opacity: 1, scale: 1, clipPath: OPEN };
//   if (r === -1) return { ...PREV, opacity: 1, scale: 1, clipPath: OPEN };
//   if (r === 1) return { ...NEXT, opacity: 1, scale: 1, clipPath: OPEN };
//   return { ...(r < 0 ? PREV : NEXT), opacity: 0, scale: 0.5, clipPath: OPEN };
// }

// /* =========================================================
//    TEXT
// ========================================================= */

// const textV: Variants = {
//   hide: { transition: { duration: 0.22 } },
//   show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
// };
// const titleV: Variants = {
//   hide: { y: '110%', transition: { duration: 0.22 } },
//   show: { y: '0%', transition: { duration: 0.8, ease: EASE } },
// };
// const fadeV: Variants = {
//   hide: { opacity: 0, y: 14, transition: { duration: 0.22 } },
//   show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
// };

// /* =========================================================
//    FIT CANVAS TO SCREEN
// ========================================================= */

// function useFit(ref: React.RefObject<HTMLElement | null>) {
//   const [fit, setFit] = useState({ s: 1, x: 0, y: 0, ready: false });
//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const measure = () => {
//       const w = el.clientWidth;
//       const h = el.clientHeight;
//       const s = Math.min(w / CANVAS_W, h / CANVAS_H);
//       setFit({ s, x: (w - CANVAS_W * s) / 2, y: (h - CANVAS_H * s) / 2, ready: true });
//     };
//     measure();
//     const ro = new ResizeObserver(measure);
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, [ref]);
//   return fit;
// }

// /* =========================================================
//    DESKTOP: pinned, scroll-stepped showcase
// ========================================================= */

// function Desktop() {
//   const reduce = useReducedMotion();
//   const k = reduce ? 0.02 : 1;

//   const trackRef = useRef<HTMLDivElement>(null);
//   const stageRef = useRef<HTMLDivElement>(null);
//   const fit = useFit(stageRef);

//   const [cur, setCur] = useState(0); // step currently shown
//   const [guides, setGuides] = useState(false);
//   const [textOn, setTextOn] = useState(false);

//   const curRef = useRef(0);
//   const wantRef = useRef(0);
//   const busyRef = useRef(false);
//   const timers = useRef<number[]>([]);
//   const pumpRef = useRef<() => void>(() => {});

//   const later = (fn: () => void, ms: number) => {
//     timers.current.push(window.setTimeout(fn, ms));
//   };

//   // Moves one step at a time toward the step the scroll position asks for.
//   pumpRef.current = () => {
//     if (busyRef.current) return;
//     const want = wantRef.current;
//     const c = curRef.current;
//     if (want === c) {
//       setTextOn(c >= 1);
//       return;
//     }
//     const next = c + (want > c ? 1 : -1);
//     busyRef.current = true;
//     setTextOn(false);
//     later(() => !reduce && setGuides(true), T_GUIDES_IN * k);
//     later(() => {
//       curRef.current = next;
//       setCur(next);
//     }, T_MOVE * k);
//     later(() => setGuides(false), T_GUIDES_OUT * k);
//     later(() => {
//       busyRef.current = false;
//       pumpRef.current();
//     }, T_DONE * k);
//   };

//   const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });

//   useMotionValueEvent(scrollYProgress, 'change', (v) => {
//     wantRef.current = Math.max(0, Math.min(STEPS - 1, Math.round(v * (STEPS - 1))));
//     pumpRef.current();
//   });

//   // If the page loads already scrolled into the section, start from that step.
//   useEffect(() => {
//     const want = Math.max(0, Math.min(STEPS - 1, Math.round(scrollYProgress.get() * (STEPS - 1))));
//     wantRef.current = want;
//     if (want > 0) {
//       curRef.current = want;
//       setCur(want);
//       setTextOn(true);
//     }
//     const ts = timers.current;
//     return () => ts.forEach((t) => window.clearTimeout(t));
//   }, [scrollYProgress]);

//   const goTo = (step: number) => {
//     const el = trackRef.current;
//     if (!el) return;
//     const top = el.getBoundingClientRect().top + window.scrollY;
//     const max = el.offsetHeight - window.innerHeight;
//     window.scrollTo({ top: top + (step / (STEPS - 1)) * max, behavior: reduce ? 'auto' : 'smooth' });
//   };

//   const c = cur - 1; // index of the service in the main slot (-1 = none yet)
//   const tileTransition: Transition = reduce
//     ? { duration: 0 }
//     : {
//         default: { duration: 1, ease: MOVE },
//         opacity: { duration: 0.5, ease: 'easeOut' },
//         scale: { duration: 0.8, ease: EASE },
//         clipPath: { duration: 1.1, ease: MOVE },
//       };

//   const lineIn = (i: number) => ({
//     on: {
//       opacity: 1,
//       clipPath: OPEN,
//       transition: { duration: 0.45, ease: EASE, delay: i * 0.03 },
//     },
//     off: {
//       opacity: 0,
//       clipPath: 'inset(0% 100% 100% 0%)',
//       transition: { opacity: { duration: 0.35 }, clipPath: { duration: 0, delay: 0.35 } },
//     },
//   });

//   return (
//     <div
//       ref={trackRef}
//       className="relative hidden lg:block"
//       style={{ height: `calc(100vh + ${(STEPS - 1) * SCROLL_PER_STEP_VH}vh)` }}
//     >
//       <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
//         <div
//           className="absolute left-0 top-0 origin-top-left"
//           style={{
//             width: CANVAS_W,
//             height: CANVAS_H,
//             transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.s})`,
//             visibility: fit.ready ? 'visible' : 'hidden',
//           }}
//         >
//           {/* Giant faint SOLUTIONS, running off the right edge and fading out below */}
//           <motion.div
//             aria-hidden="true"
//             initial={{ opacity: 0, y: reduce ? 0 : 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.1 }}
//             transition={{ duration: 1.6, ease: EASE }}
//             className="pointer-events-none absolute z-0"
//             style={{ left: 510, top: 22 }}
//           >
//             <span
//               className="block select-none whitespace-nowrap font-black italic uppercase tracking-[-0.02em] text-[#e9e9e9]"
//               style={{
//                 ...CONDENSED,
//                 fontSize: 270,
//                 lineHeight: 0.8,
//                 WebkitMaskImage: 'linear-gradient(to bottom, #000 12%, transparent 74%)',
//                 maskImage: 'linear-gradient(to bottom, #000 12%, transparent 74%)',
//               }}
//             >
//               SOLUTIONS
//             </span>
//           </motion.div>

//           {/* Header */}
//           {/* Header: sits inside the canvas, but the scale is cancelled so it renders at real
//     pixels (32px from the left, 40px from the top, 64px text), exactly like PROCESS */}
// <div
//   className="absolute z-10"
//   style={{
//     left: (32 - fit.x) / fit.s,
//     top: (40 - fit.y) / fit.s,
//     transform: `scale(${1 / fit.s})`,
//     transformOrigin: 'top left',
//   }}
// >
//   <motion.div
//     initial="hide"
//     whileInView="show"
//     viewport={{ once: true, amount: 0.3 }}
//     variants={{ hide: {}, show: { transition: { staggerChildren: 0.12 } } }}
//   >
//     <h2
//       className="relative w-max whitespace-nowrap font-bold uppercase text-[#1a1a1a]"
//       style={{ ...CONDENSED, fontSize: 64, lineHeight: 1.05, letterSpacing: '-0.01em' }}
//     >
//       <span className="block overflow-hidden pb-[0.08em]">
//         <motion.span
//           variants={{
//             hide: { y: reduce ? '0%' : '110%', opacity: reduce ? 0 : 1 },
//             show: { y: '0%', opacity: 1, transition: { duration: 1, ease: EASE } },
//           }}
//           className="block will-change-transform"
//         >
//           OUR EXPERTISE
//         </motion.span>
//       </span>
//       <motion.span
//         variants={{
//           hide: { opacity: 0 },
//           show: { opacity: 1, transition: { duration: 0.8, delay: 0.5 } },
//         }}
//         className="absolute left-full top-[5px] ml-[12px] text-[13px] font-medium leading-none text-black"
//         style={{ ...MONO, letterSpacing: '-0.02em' }}
//       >
//         [02]
//       </motion.span>
//     </h2>
//   </motion.div>
// </div>

//           {/* Dashed guide lines: draw in, hold while images slide, fade out */}
//           <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
//             {H_LINES.map((l, i) => (
//               <motion.div
//                 key={`h${i}`}
//                 variants={lineIn(i)}
//                 initial={false}
//                 animate={guides ? 'on' : 'off'}
//                 className="absolute border-t border-dashed border-neutral-700"
//                 style={{ left: l.x1, top: l.y, width: l.x2 - l.x1, height: 0 }}
//               />
//             ))}
//             {V_LINES.map((l, i) => (
//               <motion.div
//                 key={`v${i}`}
//                 variants={lineIn(i + H_LINES.length)}
//                 initial={false}
//                 animate={guides ? 'on' : 'off'}
//                 className="absolute border-l border-dashed border-neutral-700"
//                 style={{ left: l.x, top: l.y1, height: l.y2 - l.y1, width: 0 }}
//               />
//             ))}
//           </div>

//           {/* Image tiles */}
//           {services.map((s, i) => {
//             const r = i - c;
//             const side = c >= 0 && Math.abs(r) === 1;
//             const z = r === 0 ? 4 : Math.abs(r) === 1 ? 3 : 2;
//             return (
//               <motion.div
//                 key={s.id}
//                 initial={false}
//                 animate={tileTarget(i, c)}
//                 transition={tileTransition}
//                 role={side ? 'button' : undefined}
//                 tabIndex={side ? 0 : -1}
//                 aria-label={side ? `Show ${s.title}` : undefined}
//                 onClick={side ? () => goTo(cur + r) : undefined}
//                 onKeyDown={
//                   side
//                     ? (e) => {
//                         if (e.key === 'Enter' || e.key === ' ') {
//                           e.preventDefault();
//                           goTo(cur + r);
//                         }
//                       }
//                     : undefined
//                 }
//                 className="absolute overflow-hidden rounded-[10px] bg-neutral-200 will-change-transform"
//                 style={{
//                   zIndex: z,
//                   pointerEvents: side ? 'auto' : 'none',
//                   cursor: side ? 'pointer' : 'default',
//                 }}
//               >
//                 <Image
//                   src={s.image}
//                   alt={r === 0 ? s.title : ''}
//                   fill
//                   sizes="476px"
//                   priority={i < 2}
//                   className="object-cover"
//                 />
//               </motion.div>
//             );
//           })}

//           {/* Details for the service in the main slot */}
//           {c >= 0 && (
//             <motion.div
//               key={c}
//               variants={textV}
//               initial="hide"
//               animate={textOn ? 'show' : 'hide'}
//               className="absolute z-10"
//               style={{ left: TEXT.left, top: TEXT.top, width: TEXT.width }}
//             >
//               <span className="block overflow-hidden pb-[0.1em]">
//                 <motion.h3
//                   variants={titleV}
//                   className="text-[24px] font-medium uppercase leading-[1.1] text-[#1a1a1a]"
//                   style={CONDENSED}
//                 >
//                   {services[c].title}
//                 </motion.h3>
//               </span>
//               <motion.p
//                 variants={fadeV}
//                 className="mt-[22px] text-[14px] font-medium leading-[19px] tracking-[0.1em] text-neutral-900"
//                 style={CONDENSED}
//               >
//                 {services[c].description}
//               </motion.p>
//               <motion.div variants={fadeV} className="mt-[38px]">
//                 <Link
//                   href={detailHref(services[c].id)}
//                   tabIndex={textOn ? 0 : -1}
//                   className="text-[14px] font-medium tracking-[0.1em] text-neutral-900 underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
//                   style={CONDENSED}
//                 >
//                   discover more
//                 </Link>
//               </motion.div>
//             </motion.div>
//           )}
//         </div>

//         {/* Screen-reader list of every service (the visual one shows one at a time) */}
//         <ul className="sr-only">
//           {services.map((s) => (
//             <li key={s.id}>
//               <Link href={detailHref(s.id)}>{s.title}</Link>
//               <p>{s.description}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    MOBILE / TABLET: simple stacked list with every service
// ========================================================= */

// function Stacked() {
//   return (
//     <div className="px-5 pb-16 pt-10 lg:hidden">
//       <h2
//         className="mb-8 text-[40px] font-bold uppercase leading-[1.05] tracking-[-0.01em] text-[#1a1a1a]"
//         style={CONDENSED}
//       >
//         OUR EXPERTISE
//         <sup className="ml-1 align-top text-[12px] font-medium text-black" style={MONO}>
//           [02]
//         </sup>
//       </h2>
//       <ul className="flex flex-col gap-12">
//         {services.map((s, i) => (
//           <motion.li
//             key={s.id}
//             initial={{ opacity: 0, y: 32 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.2 }}
//             transition={{ duration: 0.9, ease: EASE }}
//           >
//             <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-neutral-200">
//               <Image
//                 src={s.image}
//                 alt={s.title}
//                 fill
//                 sizes="100vw"
//                 priority={i === 0}
//                 className="object-cover"
//               />
//             </div>
//             <h3 className="mt-5 text-[22px] font-medium uppercase text-[#1a1a1a]" style={CONDENSED}>
//               {s.title}
//             </h3>
//             <p
//               className="mt-3 text-[14px] font-medium leading-[19px] tracking-[0.08em] text-neutral-900"
//               style={CONDENSED}
//             >
//               {s.description}
//             </p>
//             <Link
//               href={detailHref(s.id)}
//               className="mt-5 inline-block text-[14px] font-medium tracking-[0.1em] text-neutral-900 underline underline-offset-4"
//               style={CONDENSED}
//             >
//               discover more
//             </Link>
//           </motion.li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// /* =========================================================
//    SECTION
// ========================================================= */

// export default function ServicesShowcase() {
//   return (
//     <MotionConfig reducedMotion="user">
//       <section className="relative w-full bg-white text-black">
//         <Desktop />
//         <Stacked />
//       </section>
//     </MotionConfig>
//   );
// }










































// 'use client';

// import React, { useEffect, useRef, useState } from 'react';
// import Image from 'next/image';
// import { motion, useReducedMotion, type Variants, type Transition } from 'framer-motion';

// /* =========================================================
//    ICONS  (unchanged)
// ========================================================= */

// const ICONS: Record<string, string[]> = {
//   modular: [
//     'M4 3h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z',
//     'M15 3h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z',
//     'M15 14h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z',
//     'M4 14h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z',
//   ],
//   interior: [
//     'M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3',
//     'M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z',
//     'M5 18v2',
//     'M19 18v2',
//   ],
//   outdoors: [
//     'm17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z',
//     'M12 22v-3',
//   ],
//   'space-saving': ['M4 14h6v6', 'M20 10h-6V4', 'm14 10 7-7', 'm3 21 7-7'],
//   turnkey: ['m21 2-9.6 9.6', 'm15.5 7.5 3 3L22 7l-3-3', 'M10.5 15.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'],
//   foldable: [
//     'M2 12h6',
//     'M22 12h-6',
//     'M12 20v2',
//     'M12 14v2',
//     'M12 8v2',
//     'M12 2v2',
//     'm19 9-3 3 3 3',
//     'm5 15 3-3-3-3',
//   ],
//   residential: [
//     'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8',
//     'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
//   ],
//   commercial: ['M3 9h18l-1.5-5h-15z', 'M5 9v11h14V9', 'M10 20v-5h4v5'],
//   corporate: [
//     'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z',
//     'M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2',
//     'M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2',
//     'M10 6h4',
//     'M10 10h4',
//     'M10 14h4',
//     'M10 18h4',
//   ],
// };

// function Icon({ id }: { id: string }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={1.75}
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       aria-hidden
//       className="h-[18px] w-[18px] transition-transform duration-500 ease-out group-hover:scale-110 lg:h-5 lg:w-5"
//     >
//       {ICONS[id].map((d, i) => (
//         <path key={i} d={d} />
//       ))}
//     </svg>
//   );
// }

// /* =========================================================
//    DATA
// ========================================================= */

// const services = [
//   {
//     id: 'modular',
//     title: 'MODULAR',
//     image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Precision-engineered modular kitchens and wardrobes designed for maximum space efficiency and modern aesthetics.',
//   },
//   {
//     id: 'interior',
//     title: 'INTERIOR',
//     image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Bespoke interior spaces crafted with meticulous detail. We curate layouts, materials, and textures to build personal, expressive, and functional sanctuaries.',
//   },
//   {
//     id: 'outdoors',
//     title: 'OUTDOORS',
//     image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Transformative outdoor living solutions, landscapes, and architectural extensions built to withstand the elements with elegance.',
//   },
//   {
//     id: 'space-saving',
//     title: 'SPACE SAVING',
//     image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Clever multi-functional furniture and architectural transformations optimized for compact urban living.',
//   },
//   {
//     id: 'turnkey',
//     title: 'TURNKEY',
//     image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Complete end-to-end execution from initial blueprints to final white-glove interior styling.',
//   },
//   {
//     id: 'foldable',
//     title: 'FOLDABLE',
//     image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Innovative folding mechanisms and adaptable installations that reconfigure your rooms instantly.',
//   },
//   {
//     id: 'residential',
//     title: 'RESIDENTIAL',
//     image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Comprehensive architectural and interior design solutions tailored for luxury private villas and apartments.',
//   },
//   {
//     id: 'commercial',
//     title: 'COMMERCIAL',
//     image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'High-impact retail showrooms, hospitality venues, and client-facing spaces built to elevate brand prestige.',
//   },
//   {
//     id: 'corporate',
//     title: 'CORPORATE',
//     image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1600&auto=format&fit=crop',
//     description:
//       'Ergonomic, collaborative, and future-proof workspaces designed to maximize employee productivity and wellness.',
//   },
// ];

// /* =========================================================
//    MOTION SETTINGS
// ========================================================= */

// const DEFAULT_ID = 'interior';
// const OPEN = 4.5; // flex weight of the open card (closed cards = 1)
// const HOVER_INTENT_MS = 60;
// const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
// const CARD_SPRING: Transition = { type: 'spring', stiffness: 220, damping: 30, mass: 0.9 };

// const VIEWPORT = { once: true, amount: 0.2, margin: '0px 0px -8% 0px' } as const;
// const VIEWPORT_CARD = { once: true, amount: 0.1 } as const;

// const FONT_CONDENSED = { fontFamily: '"Roboto Condensed", sans-serif' };
// const FONT_MONO = { fontFamily: '"Roboto Mono", monospace' };

// /* =========================================================
//    TITLE  (letters rise out of a mask when a card opens)
// ========================================================= */

// const letterV: Variants = {
//   hidden: { y: '110%', opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
//   show: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: EASE } },
// };

// const titleV: Variants = {
//   hidden: { transition: { staggerChildren: 0.01, staggerDirection: -1 } },
//   show: { transition: { staggerChildren: 0.03, delayChildren: 0.18 } },
// };

// function AnimatedTitle({ text }: { text: string }) {
//   return (
//     <motion.h3
//       variants={titleV}
//       aria-label={text}
//       className="flex flex-wrap gap-x-[0.3em] text-[24px] font-bold uppercase leading-[1.1] tracking-[-0.02em] text-white lg:text-[28px]"
//       style={FONT_CONDENSED}
//     >
//       {text.split(' ').map((word, wi) => (
//         <span key={wi} aria-hidden className="inline-flex whitespace-nowrap">
//           {word.split('').map((ch, ci) => (
//             <span key={ci} className="inline-block overflow-hidden">
//               <motion.span variants={letterV} className="inline-block will-change-transform">
//                 {ch}
//               </motion.span>
//             </span>
//           ))}
//         </span>
//       ))}
//     </motion.h3>
//   );
// }

// /* =========================================================
//    COMPONENT
// ========================================================= */

// export default function ServicesAccordion() {
//   const reduce = useReducedMotion();
//   const d = (px: number) => (reduce ? 0 : px);

//   const [activeId, setActiveId] = useState(DEFAULT_ID);
//   const listRef = useRef<HTMLDivElement>(null);
//   const hoverTimer = useRef<number | undefined>(undefined);
//   const [dims, setDims] = useState({ openW: 0, openH: 0 });

//   /* Measure the size an OPEN card will have so images/text are laid out at that
//      fixed size and merely revealed while cards resize. */
//   useEffect(() => {
//     const el = listRef.current;
//     if (!el) return;

//     const measure = () => {
//       const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
//       const n = services.length;
//       const units = OPEN + n - 1;
//       setDims({
//         openW: ((el.clientWidth - gap * (n - 1)) * OPEN) / units,
//         openH: ((el.clientHeight - gap * (n - 1)) * OPEN) / units,
//       });
//     };

//     measure();
//     const ro = new ResizeObserver(measure);
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);

//   useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

//   const onEnter = (e: React.PointerEvent, id: string) => {
//     if (e.pointerType !== 'mouse') return;
//     window.clearTimeout(hoverTimer.current);
//     hoverTimer.current = window.setTimeout(() => setActiveId(id), HOVER_INTENT_MS);
//   };

//   const onLeave = () => window.clearTimeout(hoverTimer.current);

//   const select = (id: string) => {
//     window.clearTimeout(hoverTimer.current);
//     setActiveId(id);
//   };

//   const cssVars =
//     dims.openW > 0
//       ? ({
//           '--open-w': `${dims.openW}px`,
//           '--open-h': `${dims.openH}px`,
//           // text column = open card minus left padding (20px) and a wider right gutter (80px)
//           '--content-w': `${Math.max(200, dims.openW - 100)}px`,
//         } as React.CSSProperties)
//       : undefined;

//   /* ---------- section entrance ---------- */

//   const headerV: Variants = {
//     hidden: {},
//     show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
//   };
//   const fadeV: Variants = {
//     hidden: { opacity: 0, y: d(12) },
//     show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
//   };
//   const lineV: Variants = {
//     hidden: { y: reduce ? '0%' : '110%', opacity: reduce ? 0 : 1 },
//     show: { y: '0%', opacity: 1, transition: { duration: 1, ease: EASE } },
//   };
//   const ruleV: Variants = {
//     hidden: { scaleX: reduce ? 1 : 0, opacity: reduce ? 0 : 1 },
//     show: { scaleX: 1, opacity: 1, transition: { duration: 1.2, ease: EASE } },
//   };
//   const cardInV: Variants = {
//     hidden: { opacity: 0, y: d(48) },
//     show: (i: number) => ({
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.9, ease: EASE, delay: reduce ? 0 : 0.1 + i * 0.06 },
//     }),
//   };

//   /* ---------- text inside an open card ---------- */

//   const contentV: Variants = { hidden: {}, show: {} };
//   const ruleInV: Variants = {
//     hidden: { scaleX: 0, opacity: 0, transition: { duration: 0.15 } },
//     show: { scaleX: 1, opacity: 1, transition: { duration: 0.8, ease: EASE, delay: 0.25 } },
//   };
//   const descV: Variants = {
//     hidden: { opacity: 0, y: d(12), filter: reduce ? 'blur(0px)' : 'blur(4px)', transition: { duration: 0.2 } },
//     show: {
//       opacity: 1,
//       y: 0,
//       filter: 'blur(0px)',
//       transition: { duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.34 },
//     },
//   };

//   return (
//     <section className="relative flex min-h-screen w-full select-none flex-col justify-center overflow-hidden bg-white pb-6 pt-8 text-black">
//       {/* Huge background typography: starts ~29% from the left, bleeds off the right edge,
//           and sits behind both the header and the cards */}
//       <motion.div
//         initial={{ opacity: 0, y: d(30) }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, amount: 0.1 }}
//         transition={{ duration: 1.6, ease: EASE }}
//         className="pointer-events-none absolute left-[8vw] top-[5.7vw] z-0 md:left-[29vw]"
//       >
//         <h2
//           className="select-none whitespace-nowrap text-[18vw] font-black uppercase leading-[0.8] tracking-[-0.02em] text-[#f6f6f6]"
//           style={FONT_CONDENSED}
//         >
//           SERVICES.
//         </h2>
//       </motion.div>

//       <div className="relative z-10 mx-auto flex w-full max-w-[1700px] flex-col px-5 md:px-8 lg:px-9">
//         {/* 1. Header */}
//         <motion.div
//           variants={headerV}
//           initial="hidden"
//           whileInView="show"
//           viewport={VIEWPORT}
//           className="mb-10 w-full lg:mb-[52px]"
//         >
//           <h2
//             className="text-[40px] font-black uppercase italic leading-[0.95] tracking-[-0.02em] text-[#1a1a1a] md:text-[64px]"
//             style={FONT_CONDENSED}
//           >
//             <span className="block overflow-hidden pb-[0.08em] pr-[0.1em]">
//               <motion.span variants={lineV} className="block will-change-transform">
//                 END 2 END
//               </motion.span>
//             </span>
//             <span className="-mt-[0.08em] block overflow-hidden pb-[0.08em] pr-[0.1em]">
//               <motion.span variants={lineV} className="block will-change-transform">
//                 SOLUTIONS
//               </motion.span>
//             </span>
//           </h2>

//           {/* Divider + index tag share one row; the rule ends where the tag begins */}
//           <div className="-mt-[2px] flex items-end gap-3">
//             <motion.div
//               variants={ruleV}
//               style={{ transformOrigin: 'left center' }}
//               className="h-px flex-1 bg-black"
//             />
//             <motion.span
//               variants={fadeV}
//               className="text-[12px] font-medium leading-none text-black md:text-[13px]"
//               style={{ ...FONT_MONO, letterSpacing: '-0.02em' }}
//             >
//               [ 02 ]
//             </motion.span>
//           </div>
//         </motion.div>

//         {/* 2. Accordion: vertical below lg, horizontal from lg up */}
//         <div
//           ref={listRef}
//           style={cssVars}
//           className="flex h-[760px] w-full flex-col items-stretch gap-2 lg:h-[665px] lg:flex-row"
//         >
//           {services.map((service, i) => {
//             const isOpen = activeId === service.id;

//             return (
//               <motion.div
//                 key={service.id}
//                 role="button"
//                 tabIndex={0}
//                 aria-expanded={isOpen}
//                 aria-label={service.title}
//                 onPointerEnter={(e) => onEnter(e, service.id)}
//                 onPointerLeave={onLeave}
//                 onClick={() => select(service.id)}
//                 onFocus={() => select(service.id)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' || e.key === ' ') {
//                     e.preventDefault();
//                     select(service.id);
//                   }
//                 }}
//                 initial={false}
//                 animate={{ flex: isOpen ? OPEN : 1 }}
//                 transition={reduce ? { duration: 0 } : CARD_SPRING}
//                 className="group min-h-0 min-w-0 cursor-pointer rounded-[24px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
//               >
//                 <motion.div
//                   custom={i}
//                   variants={cardInV}
//                   initial="hidden"
//                   whileInView="show"
//                   viewport={VIEWPORT_CARD}
//                   className={`relative h-full w-full overflow-hidden rounded-[24px] border bg-black transition-[border-color] duration-500 ${
//                     isOpen ? 'border-white/20' : 'border-transparent'
//                   }`}
//                 >
//                   {/* Collapsed-state gradient: grey at the top fading to black at the bottom
//                       (left to right on mobile rows). A brighter twin fades in on hover. */}
//                   <div
//                     aria-hidden
//                     className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#4a4a4a] to-black lg:bg-gradient-to-b"
//                   />
//                   <div
//                     aria-hidden
//                     className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#5f5f5f] to-black opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:bg-gradient-to-b"
//                   />

//                   {/* Background image, fixed to the OPEN size so the card reveals it */}
//                   <motion.div
//                     aria-hidden
//                     initial={false}
//                     animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : reduce ? 1 : 1.12 }}
//                     transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
//                     className="pointer-events-none absolute left-0 top-1/2 z-[1] h-[var(--open-h,100%)] w-full -translate-y-1/2 lg:left-1/2 lg:top-0 lg:h-full lg:w-[var(--open-w,100%)] lg:-translate-x-1/2 lg:translate-y-0"
//                   >
//                     <div className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]">
//                       <Image
//                         src={service.image}
//                         alt=""
//                         fill
//                         sizes="(max-width: 1024px) 100vw, 45vw"
//                         priority={service.id === DEFAULT_ID}
//                         className="object-cover"
//                       />
//                     </div>
//                     {/* Bottom shade for text legibility */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
//                   </motion.div>

//                   {/* Icon badge: centered on collapsed columns, top-left on the open card */}
//                   <div
//                     className={`absolute left-4 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-[left,background-color,color] duration-500 ease-out lg:top-7 lg:h-11 lg:w-11 ${
//                       isOpen
//                         ? 'bg-white text-black lg:left-5'
//                         : 'bg-white/15 text-white group-hover:bg-white/25 lg:left-[calc(50%-22px)]'
//                     }`}
//                   >
//                     <Icon id={service.id} />
//                   </div>

//                   {/* Collapsed label: vertical (reads bottom-to-top) on desktop, inline row on mobile */}
//                   <div
//                     aria-hidden={isOpen}
//                     className={`pointer-events-none absolute bottom-0 left-14 right-4 top-0 z-10 flex items-center transition-[opacity,transform] duration-300 ease-out lg:bottom-12 lg:left-0 lg:right-0 lg:top-auto lg:justify-center ${
//                       isOpen
//                         ? 'opacity-0 delay-0 lg:translate-y-2'
//                         : 'opacity-100 delay-200 lg:translate-y-0 lg:group-hover:-translate-y-1'
//                     }`}
//                   >
//                     <span
//                       className="whitespace-nowrap text-[15px] font-bold uppercase tracking-[0.01em] text-white lg:rotate-180 lg:text-[22px] lg:[writing-mode:vertical-rl]"
//                       style={FONT_CONDENSED}
//                     >
//                       {service.title}
//                     </span>
//                   </div>

//                   {/* Open content: fixed width on desktop so text never re-wraps mid-animation */}
//                   <motion.div
//                     variants={contentV}
//                     initial={false}
//                     animate={isOpen ? 'show' : 'hidden'}
//                     aria-hidden={!isOpen}
//                     className={`absolute bottom-5 left-4 right-4 z-10 flex flex-col lg:bottom-7 lg:left-5 lg:right-auto lg:w-[var(--content-w,376px)] ${
//                       isOpen ? '' : 'pointer-events-none'
//                     }`}
//                   >
//                     <AnimatedTitle text={service.title} />

//                     <motion.span
//                       variants={ruleInV}
//                       style={{ transformOrigin: 'left center' }}
//                       className="mb-3 mt-1 h-px w-full bg-white/60"
//                     />

//                     <motion.p
//                       variants={descV}
//                       className="text-justify text-[13px] leading-5 text-white lg:text-[15px] lg:leading-5"
//                       style={FONT_MONO}
//                     >
//                       {service.description}
//                     </motion.p>
//                   </motion.div>
//                 </motion.div>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }