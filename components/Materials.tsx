'use client';

import { useCallback, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Roboto, Roboto_Condensed, Roboto_Mono } from 'next/font/google';

/* If these fonts are already loaded globally, remove the three loaders and the variables below. */
const sans = Roboto({ subsets: ['latin'], weight: ['900'], style: ['italic'], display: 'swap', variable: '--font-sans' });
const cond = Roboto_Condensed({ subsets: ['latin'], weight: ['700'], display: 'swap', variable: '--font-cond' });
const mono = Roboto_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-mono' });

const SANS = { fontFamily: 'var(--font-sans), Roboto, sans-serif' };
const COND = { fontFamily: 'var(--font-cond), "Roboto Condensed", sans-serif' };
const MONO = { fontFamily: 'var(--font-mono), "Roboto Mono", monospace' };

/* =========================================================
   LOGOS
   Files live in /public/image/material_logos/ (served from /image/material_logos/).
   `scale` is the logo's visual size inside its tile (1 = fills the logo box).
========================================================= */
const BASE = '/image/material_logos/';
const MASK_COLOR = '#F3F3F3';

const LOGOS = [
  { name: 'Royale Touché', file: 'royale-touche.png', scale: 0.95 },
  { name: 'Asian Paints', file: 'asian-paints.png', scale: 0.64 },
  { name: 'Centuryply', file: 'centuryply.png', scale: 0.88 },
  { name: 'Kohler', file: 'kohler.png', scale: 0.89 },
  { name: 'Hettich', file: 'hettich.png', scale: 0.53 },
  { name: 'Jaquar', file: 'jaquar.png', scale: 0.8 },
  { name: 'Merino', file: 'merino.png', scale: 0.64 },
  { name: 'Pidilite', file: 'pidilite.png', scale: 0.89 },
  { name: 'Greenply', file: 'greenply.png', scale: 0.64 },
  { name: 'Duro', file: 'duro.png', scale: 0.41 },
  { name: 'Häfele', file: 'hafele.png', scale: 0.89 },
  { name: 'Greenlam', file: 'greenlam.png', scale: 0.95 },
  { name: 'Ebco', file: 'ebco.png', scale: 0.38 },
  { name: 'Saint-Gobain', file: 'saint-gobain.png', scale: 0.89 },
  { name: 'Godrej', file: 'godrej.png', scale: 0.89 },
  { name: 'Kajaria', file: 'kajaria.png', scale: 0.89 },
  { name: 'Blum', file: 'blum.png', scale: 0.64 },
  { name: 'RAK Ceramics', file: 'rak.png', scale: 0.76 },
  { name: 'Jindal Steel', file: 'jindal-steel.png', scale: 0.86 },
  { name: 'Ozone', file: 'ozone.png', scale: 0.45 }
];

/* =========================================================
   TUNING
========================================================= */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]; // soft ease-out, no overshoot
const SWAP_MS = 700; // slide duration; both tiles are locked meanwhile
const GRID = 'grid grid-cols-2 gap-[max(6px,0.6vw)] md:grid-cols-4 lg:grid-cols-5';

// Diagonal wave for the appearance animation (5-column desktop layout)
const wave = (i: number) => 0.1 + ((i % 5) + Math.floor(i / 5)) * 0.06;

/* One logo: a solid block cut out with the PNG's alpha channel */
function LogoMark({ file, scale }: { file: string; scale: number }) {
  const url = `url("${BASE}${file}")`;
  return (
    <span
      aria-hidden="true"
      className="block"
      style={{
        width: `${60 * scale}%`,
        height: `${72 * scale}%`,
        backgroundColor: MASK_COLOR,
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  );
}

export default function QualityCheck() {
  const reduce = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);
  const shown = useInView(gridRef, { once: true, margin: '0px 0px -15% 0px' });

  // slots[slot] = index of the logo currently sitting in that tile
  const [slots, setSlots] = useState<number[]>(() => LOGOS.map((_, i) => i));
  const slotsRef = useRef(slots);
  const lockUntil = useRef<number[]>(LOGOS.map(() => 0));

  const slotOf: number[] = [];
  slots.forEach((logo, slot) => (slotOf[logo] = slot));

  /* Hovering a tile makes its logo slide to the neighbouring tile on the opposite side
     from where the cursor entered. Always a straight horizontal / vertical move to the
     directly adjacent tile, so the grid stays perfectly aligned. */
  const swapFrom = useCallback((a: number, e: React.PointerEvent<HTMLDivElement>) => {
    const now = performance.now();
    if (lockUntil.current[a] > now) return;

    const cols =
      getComputedStyle(tilesRef.current as Element).gridTemplateColumns.split(' ').length || 1;
    const total = LOGOS.length;
    const row = Math.floor(a / cols);
    const col = a % cols;

    // Which side did the cursor enter from?
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
    const horizontal = Math.abs(nx) >= Math.abs(ny);
    const dx = horizontal ? (nx >= 0 ? -1 : 1) : 0; // move away from the cursor
    const dy = horizontal ? 0 : ny >= 0 ? -1 : 1;

    // Preferred direction first, then the opposite, then the perpendicular ones
    const dirs: [number, number][] = [
      [dx, dy],
      [-dx, -dy],
      [dy, dx],
      [-dy, -dx],
    ];

    let b = -1;
    for (const [ox, oy] of dirs) {
      const c = col + ox;
      const rr = row + oy;
      if (c < 0 || c >= cols || rr < 0) continue;
      const idx = rr * cols + c;
      if (idx >= total || lockUntil.current[idx] > now) continue;
      b = idx;
      break;
    }
    if (b < 0) return;

    lockUntil.current[a] = lockUntil.current[b] = now + SWAP_MS;

    const next = slotsRef.current.slice();
    [next[a], next[b]] = [next[b], next[a]];
    slotsRef.current = next;
    setSlots(next);
  }, []);

  // Ghost word drifts left as the section scrolls past
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start end', 'end start'] });
  const ghostX = useTransform(scrollYProgress, [0, 1], ['0vw', '-8vw']);
  const fade = 'linear-gradient(to bottom, #000 12%, transparent 78%)';

  const k = reduce ? 0 : 1;

  return (
    <section
      id="materials"
      aria-label="Quality check"
      className={`${sans.variable} ${cond.variable} ${mono.variable} relative w-full overflow-hidden bg-[#060606] pb-[max(48px,4vw)] text-white`}
    >
      {/* Header */}
      <header ref={headerRef} className="relative h-[max(190px,16.9vw)] overflow-hidden">
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-[25.7vw] top-[0.9vw] select-none whitespace-nowrap font-black italic leading-none"
          style={{ ...SANS, x: ghostX, fontSize: '20vw', color: '#1c1c1c', maskImage: fade, WebkitMaskImage: fade }}
          initial={k ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        >
          PREMIUM
        </motion.span>

        <h2
          className="absolute left-[max(16px,3.47vw)] top-[5vw] font-bold uppercase text-white"
          style={{ ...COND, fontSize: 'max(34px, 4.4vw)', lineHeight: 0.98, letterSpacing: '-0.005em' }}
        >
          {['QUALITY', 'CHECK'].map((line, i) => (
            <span key={line} className="relative block w-max">
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={k ? { y: '105%' } : false}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: EASE, delay: 0.1 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
              {i === 0 && (
                <motion.span
                  className="absolute left-full top-[0.02em] ml-[0.33em] text-[max(11px,0.9vw)] font-medium leading-none tracking-normal"
                  style={MONO}
                  initial={k ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  [06]
                </motion.span>
              )}
            </span>
          ))}
        </h2>
      </header>

      {/* Grid */}
      <div className="px-[max(16px,3.47vw)]">
        <div ref={gridRef} className="relative">
          {/* Tiles: static backgrounds + hover targets (no hover glow, shadow or colour change) */}
          <div ref={tilesRef} className={GRID}>
            {slots.map((logo, slot) => (
              <motion.div
                key={slot}
                initial={k ? { opacity: 0, y: 24 } : false}
                animate={shown ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.9, ease: EASE, delay: wave(slot) }}
                onPointerEnter={(e) => swapFrom(slot, e)}
                className="relative aspect-[261/175] overflow-hidden bg-[#0e0e0e]"
              >
                <span className="sr-only">{LOGOS[logo].name}</span>
              </motion.div>
            ))}
          </div>

          {/* Logos: one layer above the tiles using the identical grid.
              Swapping = changing a logo's `order`; framer-motion's layout animation slides it
              in a straight line to its new tile. No arc, tilt, scale or blur. */}
          <div aria-hidden="true" className={`${GRID} pointer-events-none absolute inset-0 z-10 auto-rows-fr`}>
            {LOGOS.map((logo, i) => (
              <motion.div
                key={logo.file}
                layout="position"
                transition={{ layout: { duration: k * (SWAP_MS / 1000), ease: EASE } }}
                className="relative"
                style={{ order: slotOf[i] }}
              >
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={k ? { opacity: 0 } : false}
                  animate={shown ? { opacity: 1 } : undefined}
                  transition={{ duration: 0.9, ease: EASE, delay: wave(i) + 0.2 }}
                >
                  <LogoMark file={logo.file} scale={logo.scale} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}