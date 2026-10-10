'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
  type Variants,
} from 'framer-motion';

/* =========================================================
   DATA — "WE" stays fixed, only this word changes
========================================================= */

const words = ['DESIGN.', 'CRAFT.', 'TRANSFORM.', 'STYLE.', 'RENOVATE.'];

const TEXTURE_IMAGE =
  'https://images.unsplash.com/photo-1756706718604-ef4af3970e33?q=80&w=1974&auto=format&fit=crop';

/* =========================================================
   TUNING
========================================================= */

const REVEAL_MS = 900; // wipe-in duration
const EXIT_MS = 480; // wipe-out duration
const WE_SLIDE_MS = 700; // "WE" glide duration
const TRACK_MS = 1500; // how long the backdrop re-measures after a word change

/**
 * Scroll budget, expressed in viewport-heights (dvh) so it adapts to every
 * screen automatically — no JS measuring needed.
 *
 *   STEP_VH   : scroll distance per word
 *   COVER_VH  : scroll distance in which the footer slides up and covers
 *               the pinned section (footer is pulled up by exactly 100dvh,
 *               see Footer.tsx, so this MUST stay 100)
 *
 * Timeline (scroll distance while pinned):
 *   [0 ................ WORDS_VH) -> words change (last word gets a full STEP of hold)
 *   [WORDS_VH ... WORDS_VH+100)  -> footer rises from the bottom and covers it
 */
const STEP_VH = 60;
const COVER_VH = 100;
const WORDS_VH = words.length * STEP_VH;
const PIN_SCROLL_VH = WORDS_VH + COVER_VH;
const SECTION_HEIGHT_DVH = 100 + PIN_SCROLL_VH; // pinned screen + scroll budget

const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EXIT_EASE: [number, number, number, number] = [0.7, 0, 0.84, 0];

const FONT = { fontFamily: '"Roboto Condensed", sans-serif' };

const textureStyle: React.CSSProperties = {
  backgroundImage: `url("${TEXTURE_IMAGE}")`,
  backgroundRepeat: 'no-repeat',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
};

/* =========================================================
   COMPONENT
========================================================= */

export default function TextMaskScroll() {
  const trackRef = useRef<HTMLElement>(null); // tall scroll track (NOT overflow-hidden, so sticky works)
  const stageRef = useRef<HTMLDivElement>(null); // sticky viewport-sized stage, also the photo "canvas"
  const weRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  const [index, setIndex] = useState(0);

  /* ---------- native scroll -> word index (no wheel/touch listeners, no locking) ---------- */

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const updateIndex = (p: number) => {
    const scrolledVh = p * PIN_SCROLL_VH;
    const i = Math.min(words.length - 1, Math.max(0, Math.floor(scrolledVh / STEP_VH)));
    setIndex((prev) => (prev === i ? prev : i));
  };

  useMotionValueEvent(scrollYProgress, 'change', updateIndex);

  // Correct word on mount (e.g. page reloaded mid-scroll / anchor jump)
  useEffect(() => {
    updateIndex(scrollYProgress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================================
     SINGLE-PHOTO BACKDROP
     Photo is mapped to the stage's pixel size; each text span gets a
     background-position equal to its offset inside the stage. Because
     offsets are relative to the stage (not the viewport), they stay
     correct while the stage is pinned, un-pinning, or being covered.
  ========================================================= */

  const syncBackdrop = () => {
    const canvas = stageRef.current;
    if (!canvas) return;
    const c = canvas.getBoundingClientRect();

    const paint = (el: HTMLElement | null) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.backgroundSize = `${c.width}px ${c.height}px`;
      el.style.backgroundPosition = `${-(r.left - c.left)}px ${-(r.top - c.top)}px`;
    };

    paint(weRef.current);
    paint(wordRef.current);
  };

  // Track every frame only while a word transition is running.
  useEffect(() => {
    syncBackdrop();
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      syncBackdrop();
      if (now - start < TRACK_MS) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // At rest: resize / orientation / dynamic-viewport changes / font load.
  useEffect(() => {
    syncBackdrop();
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncBackdrop);
    };

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    if (ro) {
      if (stageRef.current) ro.observe(stageRef.current);
      if (weRef.current) ro.observe(weRef.current);
    }
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);
    document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
    };
  }, []);

  /* ---------- word reveal / wipe-out ---------- */

  const wordV: Variants = {
    initial: {
      opacity: 0,
      filter: reduce ? 'blur(0px)' : 'blur(16px)',
      clipPath: reduce ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)',
    },
    animate: {
      opacity: 1,
      filter: 'blur(0px)',
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: {
        clipPath: { duration: reduce ? 0.3 : REVEAL_MS / 1000, ease: REVEAL_EASE },
        opacity: { duration: reduce ? 0.3 : (REVEAL_MS / 1000) * 0.6, ease: REVEAL_EASE },
        filter: { duration: reduce ? 0.3 : (REVEAL_MS / 1000) * 0.7, ease: REVEAL_EASE },
      },
    },
    exit: {
      opacity: 0,
      filter: reduce ? 'blur(0px)' : 'blur(10px)',
      clipPath: reduce ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)',
      transition: { duration: reduce ? 0.2 : EXIT_MS / 1000, ease: EXIT_EASE },
    },
  };

  return (
    // Tall track: gives the page real scroll distance. No overflow set here,
    // otherwise position:sticky on the stage would stop working.
    <section
      ref={trackRef}
      id="tagline"
      className="relative w-full bg-black"
      style={{ height: `${SECTION_HEIGHT_DVH}dvh` }}
    >
      
      {/* Pinned stage — pure CSS sticky, scrolling is never intercepted */}
      <div ref={stageRef} className="sticky top-0 z-0 flex w-full select-none items-center justify-start overflow-hidden bg-black" style={{ height: '100dvh' }} >

        {/* Background Image with Black Overlay */}
                <div className="absolute inset-0 z-0">
                <Image
                  src="/image/ernest-karchmit-Cr17jEgt7V4-unsplash.jpg"
                alt="Background"
                fill
                className="object-cover"
                />
                {/* The black overlay to darken the image so the text remains readable */}
                <div className="absolute inset-0 bg-black/95" />
                </div>

                <div className="relative mx-auto flex w-full max-w-[1800px] items-center justify-start px-6 text-left md:px-12 lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: REVEAL_EASE }}
            className="flex flex-col items-start text-left italic text-[clamp(64px,17vw,300px)] font-black uppercase leading-none tracking-tighter"
            style={FONT}
          >
            {/* Screen-reader text (visual words below are aria-hidden) */}
            <span className="sr-only">We design, craft, transform, style, renovate.</span>

            {/* Fixed "WE": top line, never moves */}
            <span ref={weRef} aria-hidden="true" className="inline-block" style={textureStyle}>
              WE
            </span>

            {/* Changing word: bottom line, fixed height so "WE" can't shift while words swap */}
            <span
              aria-hidden="true"
              className="relative -mt-[0.14em] block h-[1.06em] overflow-hidden whitespace-nowrap pb-[0.06em]"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[index]}
                  ref={wordRef}
                  variants={wordV}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="inline-block will-change-[filter,clip-path,opacity]"
                  style={textureStyle}
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h2>
        </div>
      </div>
    </section>
  );
}