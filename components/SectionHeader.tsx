'use client';

import { useRef, type CSSProperties } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion';
import { Roboto, Roboto_Condensed, Roboto_Mono } from 'next/font/google';

const sans = Roboto({ subsets: ['latin'], weight: ['400', '500', '700', '900'], style: ['normal', 'italic'], display: 'swap', variable: '--font-sans' });
const cond = Roboto_Condensed({ subsets: ['latin'], weight: ['400', '500', '700'], display: 'swap', variable: '--font-cond' });
const mono = Roboto_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-mono' });

/* ---------- shared design tokens: import these anywhere ---------- */
export const fontVars = `${sans.variable} ${cond.variable} ${mono.variable}`;
export const SANS: CSSProperties = { fontFamily: 'var(--font-sans), Roboto, sans-serif' };
export const COND: CSSProperties = { fontFamily: 'var(--font-cond), "Roboto Condensed", sans-serif' };
export const MONO: CSSProperties = { fontFamily: 'var(--font-mono), "Roboto Mono", monospace' };
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const PAD_X = 'max(16px, 2.3vw)'; // left/right edge of every section

const BTN =
  'inline-flex h-[58px] min-w-[246px] items-center justify-center rounded-lg px-10 text-[15px] font-bold uppercase tracking-wide outline-none transition-[background-color,transform] duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-offset-2';
export const BTN_ON_LIGHT = `${BTN} bg-black text-white hover:bg-[#2a2a2a] focus-visible:ring-black focus-visible:ring-offset-white`;
export const BTN_ON_DARK = `${BTN} bg-[#e8e8e8] text-black hover:bg-white focus-visible:ring-white focus-visible:ring-offset-black`;

/* ---------- the header ---------- */
type Props = {
  num: string; // '02'
  lines: string[]; // title lines
  ghost: string; // giant faint word
  side?: 'left' | 'right';
  theme?: 'light' | 'dark';
  part?: 'both' | 'ghost' | 'title'; // lets a section put the ghost behind content and the title above it
  className?: string; // default is in-flow; pass "absolute inset-x-0 top-0 ..." inside pinned stages
};

export default function SectionHeader({
  num,
  lines,
  ghost,
  side = 'left',
  theme = 'light',
  part = 'both',
  className = 'relative',
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const ghostX = useTransform(scrollYProgress, [0, 1], ['0vw', '-8vw']);

  const right = side === 'right';
  const dark = theme === 'dark';
  const ink = dark ? '#ffffff' : '#1a1a1a';
  const ghostInk = dark ? '#1c1c1c' : '#e6e6e6';
  const fade = 'linear-gradient(to bottom, #000 20%, transparent 70%)';

  const wrapV: Variants = { hide: {}, show: { transition: { staggerChildren: 0.12 } } };
  const lineV: Variants = {
    hide: { y: reduce ? '0%' : '110%', opacity: reduce ? 0 : 1 },
    show: { y: '0%', opacity: 1, transition: { duration: 1, ease: EASE } },
  };
  const tagV: Variants = { hide: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8, delay: 0.5 } } };

  return (
    <header ref={ref} className={`${fontVars} ${className} h-[max(110px,12.78vw)] w-full overflow-hidden`}>
      {part !== 'title' && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute select-none whitespace-nowrap font-black italic leading-none"
          style={{
            ...SANS,
            x: ghostX,
            top: '2.5vw',
            ...(right ? { left: '-3vw' } : { left: '30vw' }),
            fontSize: '15.5vw',
            color: ghostInk,
            maskImage: fade,
            WebkitMaskImage: fade,
          }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        >
          {ghost}
        </motion.span>
      )}

      {part !== 'ghost' && (
        <motion.div
          initial="hide"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={wrapV}
          className="absolute z-10"
          style={{ top: 'max(24px, 2.8vw)', ...(right ? { right: PAD_X } : { left: PAD_X }) }}
        >
          <h2
            aria-label={lines.join(' ')}
            className={`font-bold uppercase ${right ? 'text-right' : ''}`}
            style={{ ...COND, color: ink, fontSize: 'clamp(40px, 4.45vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.01em' }}
          >
            {lines.map((line, i) => (
              <span key={line} aria-hidden="true" className={`relative block w-max ${right ? 'ml-auto' : ''}`}>
                <span className="block overflow-hidden pb-[0.08em]">
                  <motion.span variants={lineV} className="block will-change-transform">
                    {line}
                  </motion.span>
                </span>
                {i === 0 && (
                  <motion.span
                    variants={tagV}
                    className={`absolute top-[5px] text-[13px] font-medium leading-none ${right ? 'right-full mr-3' : 'left-full ml-3'}`}
                    style={{ ...MONO, color: ink, letterSpacing: '-0.02em' }}
                  >
                    [{num}]
                  </motion.span>
                )}
              </span>
            ))}
          </h2>
        </motion.div>
      )}
    </header>
  );
}