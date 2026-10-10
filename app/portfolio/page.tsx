'use client';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion';
import { Roboto, Roboto_Condensed, Roboto_Mono } from 'next/font/google';
import { ARCHIVE, IN_PROGRESS, type Project } from '@/data/projects';

/* If these fonts are already loaded globally, remove the three loaders and the variables below. */
const cond = Roboto_Condensed({ subsets: ['latin'], weight: ['400', '500', '700', '900'], style: ['normal', 'italic'], display: 'swap', variable: '--font-cond' });
const sans = Roboto({ subsets: ['latin'], weight: ['500'], display: 'swap', variable: '--font-sans' });
const mono = Roboto_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-mono' });

const COND = { fontFamily: 'var(--font-cond), "Roboto Condensed", sans-serif' };
const MONO = { fontFamily: 'var(--font-mono), "Roboto Mono", monospace' };

/* =========================================================
   SETTINGS
========================================================= */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const WHEEL_TO_HORIZONTAL = true; // mouse wheel over the cards steps through them (page scrolls again at either end)
const BANNER_IMAGE = 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=2000&auto=format&fit=crop'; // replace with your own

type Tab = 'archive' | 'in-progress';
const TABS: { key: Tab; label: string }[] = [
  { key: 'archive', label: 'ARCHIVE' },
  { key: 'in-progress', label: 'IN PROGRESS' },
];
const DATA: Record<Tab, Project[]> = { archive: ARCHIVE, 'in-progress': IN_PROGRESS };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const GHOST_MASK = 'linear-gradient(to bottom, #000 12%, transparent 74%)';

/* =========================================================
   CARD
========================================================= */
const cardV: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', y: 48 },
  show: (i: number) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    y: 0,
    transition: { duration: 1.2, ease: EASE, delay: 0.1 + Math.min(i, 4) * 0.1 },
  }),
};

function Card({
  project,
  index,
  scroller,
}: {
  project: Project;
  index: number;
  scroller: React.RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // the photo drifts inside its frame while the card travels across the screen
  const { scrollXProgress } = useScroll({ target: ref, container: scroller, axis: 'x', offset: ['start end', 'end start'] });
  const imgX = useTransform(scrollXProgress, [0, 1], ['-5%', '5%']);

  return (
    <motion.div
      ref={ref}
      data-card
      custom={index}
      variants={cardV}
      className="shrink-0 snap-start"
      style={{ width: 'var(--cw)' }}
    >
      <Link
        href={`/projects/${project.slug}`}
        prefetch={false}
        draggable={false}
        aria-label={`${project.title}, ${project.year}`}
        className="group block outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5C05]"
      >
        <div className="relative aspect-[660/442] overflow-hidden bg-neutral-900">
          <motion.div className="absolute inset-y-0 -inset-x-[6%] will-change-transform" style={{ x: imgX }}>
            <Image
              src={project.image}
              alt={project.title}
              fill
              draggable={false}
              priority={index < 2}
              sizes="(max-width: 768px) 84vw, 46vw"
              className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] motion-reduce:transition-none"
            />
          </motion.div>
        </div>
        <div className="mt-[22px] flex items-center justify-between gap-4 text-[11px] uppercase md:text-[12px]" style={COND}>
          <span className="flex min-w-0 gap-3.5">
            <span className="text-[#6f6f6f]">{project.id}/</span>
            <span className="truncate font-medium text-white transition-colors duration-300 group-hover:text-[#FF5C05]">
              {project.title}
            </span>
          </span>
          <span className="shrink-0 text-[#8a8a8a]">{project.year}</span>
        </div>
      </Link>
    </motion.div>
  );
}

/* =========================================================
   RAIL: native horizontal scroll + snap, mouse drag, wheel steps,
   keyboard, arrows, progress line
========================================================= */
const railV: Variants = {
  hidden: {},
  show: {},
  exit: { opacity: 0, x: -40, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
};

function Rail({ items, railProgress }: { items: Project[]; railProgress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);
  const suppressClick = useRef(false);
  const dragging = useRef(false);
  const snapBack = useRef<number | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const n = items.length;

  const { scrollX, scrollXProgress } = useScroll({ container: scroller });
  const fill = useTransform(scrollXProgress, [0, 1], [1 / n, 1]);

  const pitch = useCallback(() => {
    const cards = scroller.current?.querySelectorAll<HTMLElement>('[data-card]');
    if (!cards || cards.length < 2) return 1;
    return cards[1].offsetLeft - cards[0].offsetLeft || 1;
  }, []);

  const goTo = useCallback(
    (i: number) => {
      scroller.current?.scrollTo({ left: clamp(i, 0, n - 1) * pitch(), behavior: reduce ? 'auto' : 'smooth' });
    },
    [n, pitch, reduce],
  );

  useMotionValueEvent(scrollX, 'change', (x) => {
    const i = clamp(Math.round(x / pitch()), 0, n - 1);
    idxRef.current = i;
    setIndex(i);
  });
  useMotionValueEvent(scrollXProgress, 'change', (v) => railProgress.set(v));

  useEffect(() => () => window.clearTimeout(snapBack.current), []);

  /* Mouse wheel: one gentle step per gesture; at either end the page scrolls normally */
  useEffect(() => {
    const el = scroller.current;
    if (!el || !WHEEL_TO_HORIZONTAL) return;
    let locked = false;
    let until = 0;
    let timer: number | undefined;
    const release = () => {
      const left = until - performance.now();
      if (left > 0) timer = window.setTimeout(release, left);
      else locked = false;
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // trackpad sideways swipes are already native
      const dir = Math.sign(e.deltaY);
      const atStart = el.scrollLeft <= 2;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
      if ((dir < 0 && atStart) || (dir > 0 && atEnd)) return;
      e.preventDefault();
      window.clearTimeout(timer);
      timer = window.setTimeout(release, 160);
      if (locked) return;
      locked = true;
      until = performance.now() + 520;
      goTo(idxRef.current + dir);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      window.clearTimeout(timer);
    };
  }, [goTo]);

  /* Mouse drag with a little throw, then it settles on the nearest card */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    if (!el || e.pointerType !== 'mouse' || e.button !== 0) return;
    window.clearTimeout(snapBack.current);
    const startX = e.clientX;
    const startLeft = el.scrollLeft;
    let lastX = startX;
    let lastT = performance.now();
    let vel = 0;
    let moved = 0;

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved < 4) return;
      if (!dragging.current) {
        dragging.current = true;
        suppressClick.current = true;
        el.style.scrollSnapType = 'none';
        el.style.cursor = 'grabbing';
      }
      el.scrollLeft = startLeft - dx;
      const now = performance.now();
      vel = (ev.clientX - lastX) / Math.max(1, now - lastT);
      lastX = ev.clientX;
      lastT = now;
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (!dragging.current) return;
      dragging.current = false;
      el.style.cursor = '';
      const p = pitch();
      const target = clamp(Math.round((el.scrollLeft - vel * 220) / p), 0, n - 1);
      el.scrollTo({ left: target * p, behavior: reduce ? 'auto' : 'smooth' });
      snapBack.current = window.setTimeout(() => {
        el.style.scrollSnapType = '';
      }, 750);
      window.setTimeout(() => {
        suppressClick.current = false; // the click that follows a drag must not open a project
      }, 0);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goTo(idxRef.current + 1);
    else if (e.key === 'ArrowLeft') goTo(idxRef.current - 1);
    else return;
    e.preventDefault();
  };

  const arrow = 'flex h-11 w-11 items-center justify-center rounded-lg border border-white/30 text-white outline-none transition-[background-color,color,opacity,border-color] duration-300 hover:border-white hover:bg-white hover:text-black focus-visible:border-[#FF5C05] disabled:pointer-events-none disabled:opacity-25';

  return (
    <motion.div variants={railV} initial="hidden" animate="show" exit="exit">
      <div
        ref={scroller}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onDragStart={(e) => e.preventDefault()}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className="relative flex cursor-grab snap-x snap-mandatory overflow-x-auto overscroll-x-contain outline-none [--cw:82vw] [--gap:12px] [--pl:20px] [-ms-overflow-style:none] [scrollbar-width:none] md:[--cw:45.83vw] md:[--gap:25px] md:[--pl:4.17vw] [&::-webkit-scrollbar]:hidden"
        style={{ paddingLeft: 'var(--pl)', columnGap: 'var(--gap)', scrollPaddingLeft: 'var(--pl)' }}
      >
        {items.map((p, i) => (
          <Card key={p.slug} project={p} index={i} scroller={scroller} />
        ))}
        {/* lets the last card reach the left edge too */}
        <div aria-hidden="true" className="shrink-0" style={{ width: 'max(0px, calc(100% - var(--cw) - var(--gap)))' }} />
      </div>

      <div className="mt-10 flex items-center gap-5 px-5 md:px-[4.17vw]" style={MONO}>
        <span className="w-[72px] text-[12px] tracking-[0.08em] tabular-nums text-white">
          {String(index + 1).padStart(2, '0')} <span className="text-[#6f6f6f]">/ {String(n).padStart(2, '0')}</span>
        </span>
        <div className="relative h-px flex-1 bg-[#262626]">
          <motion.div style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-white" />
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous project" disabled={index === 0} onClick={() => goTo(index - 1)} className={arrow}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <button type="button" aria-label="Next project" disabled={index === n - 1} onClick={() => goTo(index + 1)} className={arrow}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   CTA BANNER
========================================================= */
function Banner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);
  const words = 'YOUR VISION DESERVES THE RIGHT DESIGN PARTNER.'.split(' ');

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: 'inset(12% 3% 12% 3% round 20px)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 20px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.3, ease: EASE }}
      className="relative mx-[13px] flex min-h-[299px] items-center justify-center overflow-hidden rounded-[20px] bg-neutral-900"
    >
      <motion.div className="absolute inset-x-0 -inset-y-[12%] will-change-transform" style={{ y }}>
        <Image src={BANNER_IMAGE} alt="" fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 bg-black/55" />

      <motion.div
        className="relative z-10 flex flex-col items-center px-6 py-14 text-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } }}
      >
        <h2
          className="mx-auto max-w-[920px] text-[clamp(32px,4.45vw,64px)] font-bold uppercase leading-[1.05] tracking-[-0.01em] text-white"
          style={COND}
        >
          {words.map((w, i) => (
            <Fragment key={i}>
              <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                <motion.span
                  className="inline-block will-change-transform"
                  variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 1, ease: EASE } } }}
                >
                  {w}
                </motion.span>
              </span>{' '}
            </Fragment>
          ))}
        </h2>
        <motion.div
          className="mt-7"
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 0.3 } } }}
        >
          <Link
            href="/contact"
            className="inline-flex h-[58px] min-w-[235px] items-center justify-center rounded-lg bg-[#e8e8e8] px-10 text-[15px] font-bold uppercase tracking-wide text-black outline-none transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={COND}
          >
            CONTACT US
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   FOOTER (delete this + <Footer /> below if your layout already has one)
========================================================= */
const SOCIALS = [
  { label: 'INSTAGRAM', href: 'https://instagram.com' },
  { label: 'YOUTUBE', href: 'https://youtube.com' },
  { label: 'LINKEDIN', href: 'https://linkedin.com' },
  { label: 'FACEBOOK', href: 'https://facebook.com' },
];

function Footer() {
  const fadeDown = 'linear-gradient(to bottom, #000 20%, transparent 100%)';
  const fadeUp = 'linear-gradient(to bottom, transparent 0%, #000 70%)';
  return (
    <footer className="relative mt-[90px] overflow-hidden bg-black pb-8 pt-[150px] text-[14px] text-white md:mt-[110px] md:pt-[190px]" style={MONO}>
      {/* ghost words */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 select-none" style={COND}>
        <div
          className="absolute right-[1vw] top-[18px] whitespace-nowrap text-[clamp(60px,10vw,150px)] font-black italic uppercase leading-[0.8] tracking-[-0.02em] text-[#111]"
          style={{ maskImage: fadeUp, WebkitMaskImage: fadeUp }}
        >
          INTERIORS.
        </div>
        <div className="absolute left-0 top-[70px] h-4 w-[69%] bg-[#0b0b0b] md:top-[78px]" />
        <div
          className="absolute inset-x-0 top-[100px] text-center text-[34vw] font-black uppercase leading-[0.8] tracking-[-0.02em] text-[#101010]"
          style={{ maskImage: fadeDown, WebkitMaskImage: fadeDown }}
        >
          TARUNA
        </div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 text-center md:grid-cols-3 md:px-[60px]">
        <div>
          <p className="mb-6 uppercase">Address</p>
          <p className="leading-[20px]">
            A-60 Laxmi Nagar, Near Pushpa Nagar
            <br />
            New Sama Road, Sama- Vadodara
          </p>
        </div>
        <div>
          <p className="mb-6 uppercase">Email</p>
          <a href="mailto:contact@tarunainteriors.com" className="underline underline-offset-[3px] transition-colors hover:text-[#FF5C05]">
            contact@tarunainteriors.com
          </a>
        </div>
        <div>
          <p className="mb-6 uppercase">Contact</p>
          <a href="tel:+919580222222" className="underline underline-offset-[3px] transition-colors hover:text-[#FF5C05]">
            +91 95802 22222
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-[150px] flex max-w-[1440px] flex-col items-center justify-between gap-5 px-6 md:mt-[200px] md:flex-row md:px-[70px]">
        <nav aria-label="Social" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="uppercase transition-colors hover:text-[#FF5C05]">
              {s.label}
            </a>
          ))}
        </nav>
        <p className="text-center">&copy; {new Date().getFullYear()} Taruna Interior Gallery. All rights reserved</p>
      </div>
    </footer>
  );
}

/* =========================================================
   PAGE
========================================================= */
export default function PortfolioPage({ initialTab = 'archive' }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const railProgress = useMotionValue(0);
  const ghostX = useTransform(railProgress, [0, 1], ['0vw', '-16vw']);

  const switchTab = (t: Tab) => {
    if (t === tab) return;
    setTab(t);
    // shareable URL without a navigation
    window.history.replaceState(null, '', t === 'archive' ? '/projects' : '/projects?tab=in-progress');
  };

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      switchTab(tab === 'archive' ? 'in-progress' : 'archive');
      e.preventDefault();
    }
  };

  const btn =
    'relative flex h-[58px] w-[min(246px,38vw)] items-center justify-center rounded-lg border border-white/90 text-[15px] font-bold uppercase outline-none focus-visible:border-[#FF5C05]';

  return (
    <MotionConfig reducedMotion="user">
      <main className={`${cond.variable} ${sans.variable} ${mono.variable} min-h-dvh overflow-x-clip bg-black text-white`}>
        {/* header: title, tabs, back button */}
        <section className="relative [--pt:128px] md:[--pt:176px]" style={{ paddingTop: 'var(--pt)' }}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 z-0 h-[130px] overflow-hidden"
            style={{ top: 'calc(var(--pt) + 44px)', maskImage: GHOST_MASK, WebkitMaskImage: GHOST_MASK }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
              className="absolute left-[54vw] top-0 whitespace-nowrap font-black italic uppercase text-[#141414]"
              style={{ ...COND, x: ghostX, fontSize: 'clamp(110px, 18.75vw, 300px)', lineHeight: 0.8, letterSpacing: '-0.02em' }}
            >
              WORK
            </motion.div>
          </div>

          <div className="relative z-10 px-5 md:pl-[4.17vw] md:pr-[2.43vw]">
            <h1 className="relative w-max font-bold uppercase leading-[1.05] tracking-[-0.01em]" style={{ ...COND, fontSize: 'clamp(40px, 4.45vw, 64px)' }}>
              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block will-change-transform"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, ease: EASE, delay: 0.1 }}
                >
                  PORTFOLIO
                </motion.span>
              </span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="absolute left-full top-[4px] ml-[10px] text-[13px] font-medium leading-none tracking-[-0.02em]"
                style={MONO}
              >
                [03]
              </motion.span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
              className="mb-5 mt-7 flex items-center justify-between gap-3"
            >
              <div role="tablist" aria-label="Project status" onKeyDown={onTabKey} className="flex gap-3 md:gap-[29px]">
                {TABS.map((t) => {
                  const active = tab === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      role="tab"
                      id={`tab-${t.key}`}
                      aria-selected={active}
                      aria-controls="projects-panel"
                      tabIndex={active ? 0 : -1}
                      onClick={() => switchTab(t.key)}
                      className={btn}
                      style={COND}
                    >
                      {active && (
                        <motion.span
                          layoutId="tab-pill"
                          className="absolute -inset-px rounded-lg bg-white"
                          transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                        />
                      )}
                      <span className={`relative z-10 transition-colors duration-300 ${active ? 'text-black' : 'text-white'}`}>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <Link
                href="/"
                className="hidden h-[58px] w-[246px] items-center justify-center rounded-lg bg-white text-[15px] font-bold uppercase text-black outline-none transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#e6e6e6] active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#FF5C05] focus-visible:ring-offset-2 focus-visible:ring-offset-black md:flex"
                style={COND}
              >
                BACK 2 HOME
              </Link>
            </motion.div>
          </div>
        </section>

        {/* horizontal cards */}
        <section id="projects-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="relative z-10">
          <AnimatePresence mode="wait">
            <Rail key={tab} items={DATA[tab]} railProgress={railProgress} />
          </AnimatePresence>
        </section>

        <section className="mt-[90px] md:mt-[110px]">
          <Banner />
        </section>

        <Footer />
      </main>
    </MotionConfig>
  );
}