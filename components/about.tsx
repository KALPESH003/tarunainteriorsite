'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  cubicBezier,
  type MotionValue,
  type Variants,
} from 'framer-motion';

/* =========================================================
   CONTENT / THEME  (edit here)
   Remote images need images.unsplash.com in next.config
   (images.remotePatterns) - replace with your own photos.
========================================================= */

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

// The two static photos (they do NOT change)
const IMAGE_A = u('photo-1486406146926-c627a92ad1ab');
const IMAGE_B = u('photo-1600566753190-17f0baa2a6c3', 1200);

// The ONLY changing images: the pills inside the headline
const PILLS = [
  [u('photo-1600585154340-be6161a56a0c', 600), u('photo-1512917774080-9991f1c4c750', 600), u('photo-1545324418-cc1a3fa10c00', 600)],
  [u('photo-1486406146926-c627a92ad1ab', 600), u('photo-1600607687939-ce8a6c25118c', 600), u('photo-1600566753190-17f0baa2a6c3', 600)],
];

const CONDENSED = '"Roboto Condensed", sans-serif';

const INK = '#161616';
const MUTED = '#cfcfcf';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SETTLE = cubicBezier(0.65, 0, 0.35, 1);

type RawPiece = string | { pill: number; gap: string };
type Piece = { text: string; i: number } | { pill: number; gap: string };

const RAW: RawPiece[][] = [
  ['Design'],
  ['isn\u2019t'],
  ['just'],
  ['about'],
  ['how', { pill: 0, gap: '0.28em' }],
  ['a'],
  ['space'],
  ['lo', { pill: 1, gap: '0.06em' }, 'oks,'],
  ['it\u2019s'],
  ['about'],
  ['how'],
  ['it'],
  ['feel'],
  ['to'],
  ['live'],
  ['in'],
  ['it.'],
];

let counter = 0;
const GROUPS: Piece[][] = RAW.map((g) =>
  g.map((p) => (typeof p === 'string' ? { text: p, i: counter++ } : p)),
);
const TOTAL = counter;

/* =========================================================
   HEADLINE PILL SLIDESHOW
========================================================= */

function Slides({
  images,
  interval = 2800,
  delay = 0,
  sizes,
}: {
  images: string[];
  interval?: number;
  delay?: number;
  sizes: string;
}) {
  const [tick, setTick] = useState(0);
  const n = images.length;

  useEffect(() => {
    let iv: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      iv = setInterval(() => setTick((v) => v + 1), interval);
    }, delay);
    return () => {
      clearTimeout(t);
      clearInterval(iv);
    };
  }, [interval, delay]);

  const cur = tick % n;
  const prev = (tick - 1 + n * 1000) % n;

  // Every photo stays mounted and eagerly loaded so a wipe never reveals an empty frame.
  return (
    <div className="absolute inset-0 overflow-hidden bg-neutral-300">
      {images.map((src, i) => {
        const isCur = i === cur;
        const isPrev = tick > 0 && i === prev;
        const animating = isCur && tick > 0;
        return (
          <motion.div
            key={src}
            className="absolute inset-0"
            style={{ zIndex: isCur ? 2 : isPrev ? 1 : 0 }}
            initial={false}
            animate={{ clipPath: isCur || isPrev ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
            transition={{ duration: animating ? 1.2 : 0, ease: EASE }}
          >
            <motion.div
              className="absolute inset-0 will-change-transform"
              initial={false}
              animate={{ scale: isCur ? 1 : isPrev ? 1.08 : 1.4 }}
              transition={{ duration: animating ? 2.2 : isPrev ? 1.2 : 0, ease: EASE }}
            >
              <Image src={src} alt="" fill sizes={sizes} loading="eager" className="object-cover" />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* =========================================================
   HEADLINE
========================================================= */

const wordV: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1, ease: EASE } },
};

function Word({ text, i, progress }: { text: string; i: number; progress: MotionValue<number> }) {
  const start = 0.06 + (i / TOTAL) * 0.64;
  const end = Math.min(1, start + (0.64 / TOTAL) * 2.4);
  const color = useTransform(progress, [start, end], [MUTED, INK]);

  return (
    <span className="-mx-[0.04em] -mb-[0.14em] inline-block overflow-hidden px-[0.04em] pb-[0.14em] align-bottom">
      <motion.span variants={wordV} style={{ color }} className="inline-block will-change-transform">
        {text}
      </motion.span>
    </span>
  );
}

function Pill({
  idx,
  gap,
  progress,
}: {
  idx: number;
  gap: string;
  progress: MotionValue<number>;
}) {
  const from = idx === 0 ? 0.24 : 0.38;
  const range = [from, from + 0.34];
  const opts = { ease: SETTLE };
  const width = useTransform(progress, range, ['0em', '2.9em'], opts);
  const margin = useTransform(progress, range, ['0em', gap], opts);

  return (
    <motion.span
      aria-hidden="true"
      style={{ width, marginLeft: margin, marginRight: idx === 1 ? margin : 0 }}
      className="relative inline-block h-[0.64em] shrink-0 overflow-hidden rounded-full bg-neutral-200 align-middle"
    >
      <Slides images={PILLS[idx]} delay={idx * 900} sizes="240px" />
    </motion.span>
  );
}

function Headline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <div ref={ref} className="relative h-[240vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center px-5 md:px-[4vw]">
        <motion.h2
          aria-label="Design isn't just about how a space looks, it's about how it feel to live in it."
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } } }}
          className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-x-[0.28em] gap-y-[0.02em] text-center text-[clamp(34px,5.2vw,78px)] font-bold leading-[1] tracking-[-0.01em]"
          style={{ fontFamily: CONDENSED }}
        >
          {GROUPS.map((group, gi) => (
            <span key={gi} aria-hidden="true" className="inline-flex items-center whitespace-nowrap">
              {group.map((p, pi) =>
                'pill' in p ? (
                  <Pill key={pi} idx={p.pill} gap={p.gap} progress={scrollYProgress} />
                ) : (
                  <Word key={pi} text={p.text} i={p.i} progress={scrollYProgress} />
                ),
              )}
            </span>
          ))}
        </motion.h2>
      </div>
    </div>
  );
}

/* =========================================================
   SHOWCASE - "Curtain", merged into one continuous scene.
   Flat: no shadows, no glow. No empty white stages: the photo
   starts rising while the headline is still on screen, and
   both paragraphs live on the photo.

   The showcase is pulled up by one screen (-mt-[100vh]) so its
   pinned stage overlaps the headline's last screen.

   progress    beat
   0.00-0.22   photo 1 rises from the bottom, covering the headline
   0.16-0.35   paragraph 1 (white, centred) rises in word by word
   0.50-0.62   paragraph 1 lifts away
   0.58-0.80   paragraph 2 is read in at the bottom left,
               photo 2 unmasks as a framed plate at the bottom right
   0.84-0.92   the button arrives
   0.92-1.00   hold, then the whole section slides on
========================================================= */

const MONO = '"Roboto Mono", monospace';

const P1 =
  'At Taruna Interiors, we create bespoke interiors and custom furniture that blend effortless style with everyday functionality. We believe your home or workspace should be a personal sanctuary, tailored entirely to your lifestyle, habits, and taste.';
const P2 =
  'From initial spatial concepts to handcrafted furniture pieces, our team handles every detail with care and precision. We bring clarity to the design process, turning your vision into spaces that are timeless, functional, and uniquely yours.';
const P1_WORDS = P1.split(' ');
const P2_WORDS = P2.split(' ');

const LABEL = 'text-[11px] uppercase leading-none tracking-[0.12em]';
const MASK = '-mb-[0.14em] mr-[0.28em] inline-block overflow-hidden pb-[0.14em] align-bottom';
const LEAD_TEXT =
  'max-w-[1100px] text-center text-[clamp(26px,3.3vw,56px)] font-medium leading-[1.12] tracking-[-0.01em] text-white';

/* paragraph 1: every word rises out of its own mask as you scroll */
function LeadWord({ w, i, p }: { w: string; i: number; p: MotionValue<number> }) {
  const s = 0.16 + (i / P1_WORDS.length) * 0.14;
  const y = useTransform(p, [s, s + 0.05], ['110%', '0%']);
  const opacity = useTransform(p, [s, s + 0.05], [0, 1]);
  return (
    <span className={MASK}>
      <motion.span style={{ y, opacity }} className="inline-block will-change-transform">
        {w}
      </motion.span>
    </span>
  );
}

/* paragraph 2: read in with scroll */
function ScrubWord({ w, i, p }: { w: string; i: number; p: MotionValue<number> }) {
  const s = 0.6 + (i / P2_WORDS.length) * 0.1;
  const opacity = useTransform(p, [s, s + 0.04], [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.3em] inline-block">
      {w}
    </motion.span>
  );
}

function Showcase() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // light inertia on the scroll value = smooth, filmic motion
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.5, restDelta: 0.0005 });
  const p = reduce ? scrollYProgress : smooth;
  const o = { ease: SETTLE };

  /* photo 1 rises from the bottom, then drifts slowly */
  const rise = useTransform(p, [0, 0.22], ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'], o);
  const img1Scale = useTransform(p, [0, 0.22, 0.95], [1.3, 1.04, 1.1], o);
  const dim = useTransform(p, [0, 0.3], [0.15, 0.5], o);

  /* paragraph 1 lifts away */
  const leadY = useTransform(p, [0.5, 0.62], ['0svh', '-16svh'], o);
  const leadOpacity = useTransform(p, [0.5, 0.6], [1, 0], o);

  /* paragraph 2 + button */
  const p2Opacity = useTransform(p, [0.58, 0.62], [0, 1]);
  const p2Y = useTransform(p, [0.58, 0.7], ['5svh', '0svh'], o);
  const btnOpacity = useTransform(p, [0.84, 0.92], [0, 1], o);
  const btnVisibility = useTransform(p, (v) => (v > 0.84 ? 'visible' : 'hidden'));

  /* photo 2 plate */
  const plateClip = useTransform(p, [0.7, 0.86], ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'], o);
  const plateY = useTransform(p, [0.7, 0.86], ['6svh', '0svh'], o);
  const plateScale = useTransform(p, [0.7, 0.9], [1.3, 1], o);

  return (
    <div ref={ref} className="relative -mt-[100vh] h-[420vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* photo layer: rises over the headline, then holds everything */}
        <motion.div style={{ clipPath: rise }} className="absolute inset-0 bg-neutral-900">
          <motion.div style={{ scale: img1Scale }} className="absolute inset-0 will-change-transform">
            <Image
              src={IMAGE_A}
              alt="Architecture & Interior"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </motion.div>
          <motion.div aria-hidden="true" style={{ opacity: dim }} className="absolute inset-0 bg-black" />

          {/* paragraph 1, centred */}
          <motion.div
            style={{ y: leadY, opacity: leadOpacity }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 md:px-[8vw]"
          >
            <p className={LEAD_TEXT} style={{ fontFamily: CONDENSED }}>
              {P1_WORDS.map((w, i) => (
                <LeadWord key={i} w={w} i={i} p={p} />
              ))}
            </p>
          </motion.div>

          {/* paragraph 2 + button, bottom left */}
          <motion.div
            style={{ opacity: p2Opacity, y: p2Y }}
            className="absolute bottom-[8svh] left-5 right-5 z-20 flex max-w-[520px] flex-col items-start text-white lg:bottom-[11vh] lg:left-[2.3vw] lg:right-auto"
          >
            <span className={`${LABEL} mb-5 text-white/70`} style={{ fontFamily: MONO }}>
              (Our approach)
            </span>
            <p
              className="text-[15px] font-medium leading-[22px] tracking-[0.06em] lg:text-[17px] lg:leading-[24px]"
              style={{ fontFamily: CONDENSED }}
            >
              {P2_WORDS.map((w, i) => (
                <ScrubWord key={i} w={w} i={i} p={p} />
              ))}
            </p>
            <motion.div style={{ opacity: btnOpacity, visibility: btnVisibility }} className="mt-8">
              <Link
                href="/about"
                className="inline-flex h-[58px] w-[246px] items-center justify-center rounded-[10px] bg-white text-[16px] font-bold uppercase text-black transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-neutral-200 active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                style={{ fontFamily: CONDENSED }}
              >
                MORE ABOUT STUDIO
              </Link>
            </motion.div>
          </motion.div>

          {/* photo 2: a small framed plate, bottom right */}
          <motion.div
            style={{ clipPath: plateClip, y: plateY }}
            className="absolute right-5 top-[12svh] z-20 h-[26svh] w-[42vw] overflow-hidden rounded-[4px] bg-neutral-700 lg:bottom-[11vh] lg:right-[2.3vw] lg:top-auto lg:h-[36vh] lg:w-[24vw]"
          >
            <motion.div style={{ scale: plateScale }} className="absolute inset-0 will-change-transform">
              <Image
                src={IMAGE_B}
                alt="Concrete house with carport"
                fill
                sizes="(max-width: 1024px) 42vw, 24vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate w-full bg-white text-black">
        <Headline />
        <Showcase />
      </section>
    </MotionConfig>
  );
}