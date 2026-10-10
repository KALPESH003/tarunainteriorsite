'use client';

import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion';
import { Roboto_Condensed } from 'next/font/google';
import { Fragment, useEffect, useMemo, useRef } from 'react';

// If Roboto Condensed is already loaded globally, remove this and the className below.
const roboto = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MUTED = '#4a4a4a'; // unfilled (gray) text colour
const FILLED = '#ffffff'; // filled (white) text colour

const HEADLINE =
  'With decades of expertise, thoughtful design, and uncompromising attention to detail, we create distinctive spaces tailored to the way you live, work, and experience them.';

// `label` is an array of lines so the line breaks match the design exactly.
const statsData = [
  { id: 1, value: 15, suffix: '+', label: ['YEARS OF', 'CRAFTSMANSHIP'] },
  { id: 2, value: 50, suffix: '+', label: ['TRUSTED', 'PARTNERS'] },
  { id: 3, value: 100, suffix: '%', label: ['TAILORED', 'AND BESPOKE'] },
  { id: 4, value: 200, suffix: '+', label: ['SPACES', 'DESIGNED AND', 'DELIVERED'] },
];

/* -------------------------------------------------------------------------- */
/*  Left side: gray -> white text fill driven by scroll                        */
/* -------------------------------------------------------------------------- */

function Char({
  char,
  progress,
  range,
}: {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const color = useTransform(progress, range, [MUTED, FILLED]);
  return <motion.span style={{ color }}>{char}</motion.span>;
}

function ScrollFillText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();

  // 0 when the paragraph's top hits 90% of the viewport,
  // 1 when its bottom reaches the middle of the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.5'],
  });

  // Split into words -> characters, giving each character a global index
  const { words, total } = useMemo(() => {
    let index = 0;
    const words = text
      .split(' ')
      .map((word) => word.split('').map((char) => ({ char, index: index++ })));
    return { words, total: index };
  }, [text]);

  const WINDOW = 0.12; // how many neighbouring characters fill at the same time

  return (
    <p
      ref={ref}
      className="text-[2.5rem] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-5xl lg:text-[56px]"
    >
      {reduceMotion ? (
        text
      ) : (
        <>
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">
            {words.map((chars, w) => (
              <Fragment key={w}>
                <span className="inline-block whitespace-nowrap">
                  {chars.map(({ char, index }) => {
                    const start = (index / total) * (1 - WINDOW);
                    return (
                      <Char
                        key={index}
                        char={char}
                        progress={scrollYProgress}
                        range={[start, start + WINDOW]}
                      />
                    );
                  })}
                </span>{' '}
              </Fragment>
            ))}
          </span>
        </>
      )}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*  Right side: stat rows with counter, masked text reveal and divider draw    */
/* -------------------------------------------------------------------------- */

const rise: Variants = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 0.9, ease: EASE } },
};

const drawLine: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.1, ease: EASE } },
};

function StatRow({
  stat,
  index,
  isLast,
}: {
  stat: (typeof statsData)[number];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, stat.value, {
      duration: reduceMotion ? 0 : 2.2,
      delay: reduceMotion ? 0 : index * 0.12 + 0.15,
      ease: EASE,
    });
    return () => controls.stop();
  }, [inView, count, stat.value, index, reduceMotion]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={{
        hidden: {},
        show: { transition: { delayChildren: index * 0.12, staggerChildren: 0.07 } },
      }}
      className="relative grid min-h-[104px] grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-center py-3 sm:min-h-[120px]"
    >
      {/* Number */}
      <span className="block overflow-hidden">
        <motion.span
          variants={rise}
          className="block pl-2.5 text-5xl font-medium leading-[1.1] tabular-nums text-white sm:text-[56px]"
        >
          <motion.span>{rounded}</motion.span>
          {stat.suffix}
        </motion.span>
      </span>

      {/* Label (each line slides up from a mask) */}
      <div className="text-xl font-medium leading-[1.1] text-neutral-300 sm:text-[28px]">
        {stat.label.map((line) => (
          <span key={line} className="block overflow-hidden">
            <motion.span variants={rise} className="block">
              {line}
            </motion.span>
          </span>
        ))}
      </div>

      {/* Divider (draws in from the left) */}
      {!isLast && (
        <motion.span
          variants={drawLine}
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-white/20"
        />
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */

export default function Stats() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        className={`${roboto.className} relative flex min-h-screen w-full items-center bg-black px-6 py-24 sm:px-8`}
      >
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-16 lg:grid-cols-[1fr_minmax(0,470px)] lg:gap-28">
          <ScrollFillText text={HEADLINE} />

          <div>
            {statsData.map((stat, i) => (
              <StatRow
                key={stat.id}
                stat={stat}
                index={i}
                isLast={i === statsData.length - 1}
              />
            ))}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}