'use client';

import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { Roboto, Roboto_Condensed, Roboto_Mono } from 'next/font/google';

/* If these fonts are already loaded globally, remove the three loaders and the variables below. */
const cond = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cond',
});
const sans = Roboto({ subsets: ['latin'], weight: ['500'], display: 'swap', variable: '--font-sans' });
const mono = Roboto_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-mono' });

const COND = { fontFamily: 'var(--font-cond), "Roboto Condensed", sans-serif' };
const SANS = { fontFamily: 'var(--font-sans), Roboto, sans-serif' };
const MONO = { fontFamily: 'var(--font-mono), "Roboto Mono", monospace' };

const projects = [
  {
    id: '01',
    title: 'SKECHERS SHOWROOM, TURNKEY RETAIL',
    year: '2019',
    href: '/projects/skechers-showroom',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: '02',
    title: 'SHREE JAGDAMBA JEWELLERS, RETAIL',
    year: '2020',
    href: '/projects/shree-jagdamba-jewellers',
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: '03',
    title: 'THE ATHARVA RESIDENCES, LUXURY APARTMENT',
    year: '2021',
    href: '/projects/the-atharva-residences',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: '04',
    title: 'LUMINA PENTHOUSE, INTERIORS',
    year: '2022',
    href: '/projects/lumina-penthouse',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: '05',
    title: 'VANGUARD, CORPORATE WORKSPACE',
    year: '2023',
    href: '/projects/vanguard',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: '06',
    title: 'OAK & IRON, PRIVATE RESIDENCE',
    year: '2024',
    href: '/projects/oak-and-iron',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
  },
];

const COPY =
  'From initial spatial concepts to handcrafted furniture pieces, our team handles every detail with care and precision. We bring clarity to the design process, turning your vision into spaces that are timeless, functional, and uniquely yours.';

/* =========================================================
   TUNING
========================================================= */
const ORANGE = '#FF5C05';
const MUTED = '#555555';
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STEP_VH = 85; // scroll distance (dvh) between two projects
const HOLD_VH = 25; // pause on the last project before the section un-pins
const ROW = 1.163; // vertical step between cards, in card-heights (from the design)
const SNAP_IDLE_MS = 220; // after scrolling stops, the camera settles on the nearest project
const CLOSING_VH = 150; // height of the closing block; (CLOSING_VH - 100) = scroll distance of the text fill
const REVEAL_S = 1.2; // text reveal runs this long before the fill is allowed to start

const N = projects.length;
const INDEXES = projects.map((_, i) => i);
// Zig-zag from the design: +0.27 card-widths, then +0.73, repeating (cards sit up-left -> down-right)
const LEFTS = INDEXES.map((i) => Math.floor(i / 2) + (i % 2) * 0.27);
const TRAVEL = (N - 1) * STEP_VH;
const END = TRAVEL / (TRAVEL + HOLD_VH); // scroll progress at which the last card is centred
const RULER_MIN = 4; // marker travel on the ruler, in % of its height
const RULER_MAX = 96;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* Ruler ticks drawn with gradients: short ticks every 8px, long ticks every 40px */
const tick = (c: string, pitch: number) =>
  `repeating-linear-gradient(to bottom, ${c} 0, ${c} 1px, transparent 1px, transparent ${pitch}px)`;
const TICKS_BASE = {
  backgroundImage: `${tick('rgba(255,255,255,0.6)', 8)}, ${tick('rgba(255,255,255,0.9)', 40)}`,
  backgroundSize: '6px 100%, 12px 100%',
  backgroundRepeat: 'no-repeat',
};
const TICKS_BRIGHT = {
  backgroundImage: `${tick('#fff', 8)}, ${tick('#fff', 40)}`,
  backgroundSize: '10px 100%, 18px 100%',
  backgroundRepeat: 'no-repeat',
};

/* =========================================================
   ARROW: swipes up and out, a new one rises in from below
========================================================= */
const SWIPE =
  'absolute inset-0 transition-transform duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none';

function SwipeArrow() {
  const svg = (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-full w-full">
      <path d="M2 10 10 2M3.5 2H10v6.5" />
    </svg>
  );
  return (
    <span aria-hidden="true" className="relative block h-3.5 w-3.5 overflow-hidden" style={{ color: ORANGE }}>
      <span className={`${SWIPE} group-hover:-translate-y-full`}>{svg}</span>
      <span className={`${SWIPE} translate-y-full delay-[60ms] group-hover:translate-y-0`}>{svg}</span>
    </span>
  );
}

/* =========================================================
   PROJECT CARD (lives on the canvas; the camera moves, not the card)
========================================================= */
const ProjectCard = memo(function ProjectCard({
  project,
  index,
  focus,
  active,
}: {
  project: (typeof projects)[number];
  index: number;
  focus: MotionValue<number>;
  active: boolean;
}) {
  const range = [index - 1, index, index + 1];
  const opacity = useTransform(focus, range, [0.28, 1, 0.28]);
  const scale = useTransform(focus, range, [0.9, 1, 0.9]);
  const imageX = useTransform(focus, range, ['5%', '0%', '-5%']); // parallax against the camera move

  return (
    <motion.div
      className="absolute will-change-transform"
      style={{
        left: `${LEFTS[index] * 100}%`,
        top: `${index * ROW * 100}%`,
        width: '100%',
        height: '100%',
        opacity,
        scale,
        zIndex: active ? 2 : 1,
      }}
    >
      <Link
        href={project.href}
        prefetch={false}
        tabIndex={active ? 0 : -1}
        aria-label={`${project.title}, ${project.year}`}
        className={`group flex h-full w-full flex-col border border-white/85 bg-black p-[6px] outline-none focus-visible:border-[#FF5C05] ${
          active ? '' : 'pointer-events-none'
        }`}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden bg-neutral-900">
          <motion.div className="absolute inset-0 will-change-transform" style={{ x: imageX, scale: 1.12 }}>
            <Image
              src={project.image}
              alt={project.title}
              fill
              priority={index < 2}
              loading="eager"
              sizes="(max-width: 768px) 84vw, 62vw"
              className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] motion-reduce:transition-none"
            />
          </motion.div>
        </div>

        <div
          className="flex h-11 shrink-0 items-center justify-between px-[15px] text-[11px] uppercase md:h-14 md:text-[12px]"
          style={COND}
        >
          <span className="flex gap-3.5">
            <span className="text-[#6f6f6f]">{project.id}/</span>
            <span className="font-medium text-white">{project.title}</span>
          </span>
          <span className="flex items-center gap-4">
            <span className="text-[#8a8a8a]">{project.year}</span>
            <SwipeArrow />
          </span>
        </div>
      </Link>
    </motion.div>
  );
});

/* =========================================================
   CTA BUTTON: magnetic, orange fill rises, label swipes
========================================================= */
function PortfolioButton() {
  return (
    <Link
      href="/projects"
      prefetch={false}
      className="inline-flex h-[58px] min-w-[235px] items-center justify-center rounded-lg bg-[#e8e8e8] px-10 text-[15px] font-bold uppercase tracking-wide text-black outline-none transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transition-none"
      style={COND}
    >
      VIEW FULL PORTFOLIO
    </Link>
  );
}

/* =========================================================
   CLOSING BLOCK: 1) words rise in (gray)  2) scroll fills gray -> white  3) button
========================================================= */
function Char({ char, progress, range }: { char: string; progress: MotionValue<number>; range: [number, number] }) {
  const color = useTransform(progress, range, [MUTED, '#ffffff']);
  return <motion.span style={{ color }}>{char}</motion.span>;
}

function Closing() {
  const blockRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();

  // Step 1: reveal starts as the paragraph rises into view
  const revealed = useInView(textRef, { once: true, margin: '0px 0px -10% 0px' });

  // Step 2: the fill is locked until the reveal has finished, then it follows the scroll
  const gate = useMotionValue(0);
  useEffect(() => {
    if (!revealed) return;
    const controls = animate(gate, 1, { delay: REVEAL_S, duration: 0.8, ease: 'easeOut' });
    return () => controls.stop();
  }, [revealed, gate]);

  const { scrollYProgress } = useScroll({ target: blockRef, offset: ['start start', 'end end'] });
  const raw = useTransform([scrollYProgress, gate], ([p, g]: number[]) => clamp01((p - 0.1) / 0.8) * g);
  const fill = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.5 });

  const { words, total } = useMemo(() => {
    let i = 0;
    const words = COPY.split(' ').map((w) => w.split('').map((char) => ({ char, index: i++ })));
    return { words, total: i };
  }, []);

  const WINDOW = 0.12;

  return (
    <div ref={blockRef} className="relative bg-black" style={{ height: `${CLOSING_VH}dvh` }}>
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center px-6 md:px-10">
        <p
          ref={textRef}
          className="mx-auto max-w-[1000px] text-center text-2xl font-medium leading-[1.24] text-white md:text-[34px]"
          style={SANS}
        >
          {reduce ? (
            COPY
          ) : (
            <>
              <span className="sr-only">{COPY}</span>
              <span aria-hidden="true">
                {words.map((chars, w) => (
                  <Fragment key={w}>
                    <span className="inline-block overflow-hidden whitespace-nowrap align-top">
                      <motion.span
                        className="inline-block"
                        initial={{ y: '105%', opacity: 0 }}
                        animate={revealed ? { y: 0, opacity: 1 } : undefined}
                        transition={{ duration: 0.9, ease: EASE, delay: w * 0.022 }}
                      >
                        {chars.map(({ char, index }) => {
                          const start = (index / total) * (1 - WINDOW);
                          return <Char key={index} char={char} progress={fill} range={[start, start + WINDOW]} />;
                        })}
                      </motion.span>
                    </span>{' '}
                  </Fragment>
                ))}
              </span>
            </>
          )}
        </p>

        {/* Step 3: button arrives last */}
        <motion.div
          className="mt-10 md:mt-11"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={revealed ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease: EASE, delay: REVEAL_S }}
        >
          <PortfolioButton />
        </motion.div>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION
========================================================= */
export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const snapTimer = useRef<number | undefined>(undefined);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  // Native scroll drives everything; the spring is what makes it feel buttery.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.55, restDelta: 0.0001 });
  const focus = useTransform(smooth, [0, END], [0, N - 1]); // 0 -> N-1 = which project the camera is on

  // Camera: pans the whole canvas toward the bottom-right, so cards travel to the top-left
  const camX = useTransform(focus, INDEXES, LEFTS.map((l) => `${-l * 100}%`));
  const camY = useTransform(focus, INDEXES, INDEXES.map((i) => `${-i * ROW * 100}%`));
  const ghostX = useTransform(focus, [0, N - 1], ['0vw', '-8vw']);

  // Ruler marker (vertical, left edge)
  const topPct = useTransform(focus, [0, N - 1], [RULER_MIN, RULER_MAX]);
  const markerTop = useMotionTemplate`${topPct}%`;
  const magnify = useMotionTemplate`linear-gradient(to bottom, transparent calc(${topPct}% - 9%), #000 ${topPct}%, transparent calc(${topPct}% + 9%))`;

  useMotionValueEvent(focus, 'change', (v) => setActive(Math.round(v)));

  const goTo = useCallback(
    (i: number) => {
      const el = sectionRef.current;
      const sticky = el?.firstElementChild as HTMLElement | null;
      if (!el || !sticky) return;
      const travelPx = el.offsetHeight - sticky.offsetHeight;
      const top = el.getBoundingClientRect().top + window.scrollY + (i / (N - 1)) * END * travelPx;
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    },
    [reduce],
  );

  // Soft snap: when the scroll goes idle between two projects, glide to the nearest one
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    window.clearTimeout(snapTimer.current);
    snapTimer.current = window.setTimeout(() => {
      const f = clamp01(p / END) * (N - 1);
      const near = Math.round(f);
      if (Math.abs(f - near) > 0.03) goTo(near);
    }, SNAP_IDLE_MS);
  });
  useEffect(() => () => window.clearTimeout(snapTimer.current), []);

  const onRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientY - r.top) / r.height) * 100;
    const i = Math.round(((pct - RULER_MIN) / (RULER_MAX - RULER_MIN)) * (N - 1));
    goTo(Math.min(N - 1, Math.max(0, i)));
  };

  const onRulerKey = (e: React.KeyboardEvent) => {
    if (['ArrowDown', 'ArrowRight'].includes(e.key)) goTo(Math.min(N - 1, active + 1));
    else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) goTo(Math.max(0, active - 1));
    else return;
    e.preventDefault();
  };

  const fade = 'linear-gradient(to bottom, #000 55%, transparent 100%)';

  return (
    <div className={`${cond.variable} ${sans.variable} ${mono.variable} bg-black text-white`}>
      <section
        ref={sectionRef}
        id="portfolio"
        aria-label="Featured works"
        className="relative w-full select-none [--cw:84vw] [--ch:calc(var(--cw)_*_1.15)] md:[--cw:min(62.5vw,120dvh)] md:[--ch:calc(var(--cw)_*_0.6456)]"
        style={{ height: `${100 + TRAVEL + HOLD_VH}dvh` }}
      >
        <div className="sticky top-0 h-dvh w-full overflow-hidden bg-black">
          {/* Ghost word: clipped, faded, drifts slowly with the camera */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[22dvh] overflow-hidden"
            style={{ maskImage: fade, WebkitMaskImage: fade }}
          >
            <motion.div
              className="absolute -left-[9vw] top-[4.5dvh] whitespace-nowrap font-black uppercase italic text-[#161616]"
              style={{ ...COND, x: ghostX, fontSize: '20vw', lineHeight: 0.8, letterSpacing: '-0.02em' }}
            >
              PORTFOLIO
            </motion.div>
          </div>

          {/* Header */}
          <h2
            className="absolute right-[1.75vw] top-[4dvh] z-20 text-right font-bold uppercase leading-[0.95] tracking-[-0.01em]"
            style={{ ...COND, fontSize: 'clamp(38px, 4.5vw, 84px)' }}
          >
            <span className="absolute right-full top-[0.35em] mr-3 text-[11px] font-medium tracking-normal" style={MONO}>
              [03]
            </span>
            FEATURED
            <br />
            WORKS
          </h2>

          {/* Camera rig: one card-sized box centred in the viewport; cards are placed around it */}
          <motion.div
            className="absolute z-10 will-change-transform"
            style={{
              left: 'calc(50% - var(--cw) / 2)',
              top: 'calc(50% - var(--ch) / 2)',
              width: 'var(--cw)',
              height: 'var(--ch)',
              x: camX,
              y: camY,
            }}
          >
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} focus={focus} active={i === active} />
            ))}
          </motion.div>

          {/* Soft fade so the next card peeks in instead of being cut off */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[12dvh]"
            style={{ background: 'linear-gradient(to top, #000, transparent)' }}
          />

          {/* Progress ruler: vertical, left edge. Ticks near the orange marker light up and grow. */}
          <div
            className="absolute inset-y-0 left-0 z-30 w-6 cursor-pointer outline-none md:w-9"
            role="slider"
            tabIndex={0}
            aria-label="Project"
            aria-orientation="vertical"
            aria-valuemin={1}
            aria-valuemax={N}
            aria-valuenow={active + 1}
            onClick={onRulerClick}
            onKeyDown={onRulerKey}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 w-[18px]" style={TICKS_BASE} />
            <motion.div
              className="pointer-events-none absolute inset-y-0 left-0 w-[18px]"
              style={{ ...TICKS_BRIGHT, maskImage: magnify, WebkitMaskImage: magnify }}
            />
            <motion.div className="pointer-events-none absolute left-[21px]" style={{ top: markerTop }}>
              <div
                className="h-0 w-0 -translate-y-1/2 border-y-[4px] border-r-[6px] border-y-transparent"
                style={{ borderRightColor: ORANGE }}
              />
            </motion.div>
            <motion.div
              className="pointer-events-none absolute left-[34px] hidden -translate-y-1/2 text-[10px] font-medium leading-none tracking-[0.08em] md:block"
              style={{ ...MONO, top: markerTop, color: ORANGE }}
            >
              {String(active + 1).padStart(2, '0')}
            </motion.div>
          </div>
        </div>
      </section>

      <Closing />
    </div>
  );
}
