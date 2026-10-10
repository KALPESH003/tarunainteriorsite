'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Roboto, Roboto_Condensed, Roboto_Mono } from 'next/font/google';

/* If these fonts are already loaded globally, remove the three loaders and the variables below. */
const sans = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-sans',
});
const cond = Roboto_Condensed({ subsets: ['latin'], weight: ['700'], display: 'swap', variable: '--font-cond' });
const mono = Roboto_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-mono' });

const SANS = { fontFamily: 'var(--font-sans), Roboto, "Helvetica Neue", Arial, sans-serif' };
const COND = { fontFamily: 'var(--font-cond), "Roboto Condensed", sans-serif' };
const MONO = { fontFamily: 'var(--font-mono), "Roboto Mono", monospace' };

/* =========================================================
   PROCESS DATA (unchanged)
========================================================= */

const steps = [
  {
    id: 1,
    title: 'Discovery',
    subtitle: 'Process • INITIAL ALIGNMENT',
    num: '[01]',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600',
    description:
      'A seamless journey from initial concept to your fully realized space. We take the complexity out of interior design and custom craftsmanship. Our structured process ensures complete transparency, precise execution, and a design tailored entirely to your lifestyle.',
  },
  {
    id: 2,
    title: 'Space Planning',
    subtitle: 'Process • ARCHITECTURAL FLOW',
    num: '[02]',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600',
    description:
      'We map out the architectural flow, optimizing spatial dynamics and functionality. Every square foot is thoughtfully allocated to enhance natural light, movement, and the overarching purpose of your unique space.',
  },
  {
    id: 3,
    title: 'Visual Concept',
    subtitle: 'Process • CREATIVE DIRECTION',
    num: '[03]',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600',
    description:
      'Immersive 3D renderings and material boards bring the vision to life. We establish the defining aesthetic, blending bespoke textures, lighting strategies, and custom joinery into a cohesive creative direction.',
  },
  {
    id: 4,
    title: 'Material Curation',
    subtitle: 'Process • TACTILE SELECTION',
    num: '[04]',
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600',
    description:
      'A tactile exploration of premium finishes. From hand-selected marble slabs to sustainable hardwoods and custom fabrics, we curate materials that offer both enduring quality and striking visual impact.',
  },
  {
    id: 5,
    title: 'Precision Build',
    subtitle: 'Process • CRAFTSMANSHIP & SITE',
    num: '[05]',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600',
    description:
      'Where design meets exacting craftsmanship. Our dedicated project managers and master builders execute the plans with rigorous attention to detail, ensuring flawless integration of all architectural elements.',
  },
  {
    id: 6,
    title: 'Styling & Handover',
    subtitle: 'Process • TURNKEY REVEAL',
    num: '[06]',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600',
    description:
      'The final layer of luxury. We meticulously style the space with curated artwork, soft furnishings, and decor. We hand over the keys to a completely turnkey, perfectly finished home ready for you to enjoy.',
  },
];

/* =========================================================
   TUNING
========================================================= */
const ORANGE = '#FF5C05';
const DUR = 850; // ms, row expand / collapse
const EASE_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const tagOf = (subtitle: string) => (subtitle.split('•')[1] ?? subtitle).trim().toUpperCase();
const numOf = (n: string) => `${n.replace(/[\[\]\s]/g, '')}/`;

/* =========================================================
   CTA BUTTON: black on white, magnetic, orange fill rises, label swipes
========================================================= */
function MethodologyButton() {
  return (
    <Link
      href="/process"
      prefetch={false}
      className="inline-flex h-[58px] min-w-[246px] items-center justify-center rounded-lg bg-black px-10 text-[15px] font-bold uppercase tracking-wide text-white outline-none transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#2a2a2a] active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
      style={COND}
    >
      EXPLORE OUR METHODOLOGY
    </Link>
  );
}
/* =========================================================
   ROW
   Height = closed header zone + a panel that animates 0fr -> 1fr (grid trick),
   so the row grows to fit its content with no JS measuring.
========================================================= */
type Step = (typeof steps)[number];

function Row({
  step,
  index,
  open,
  k,
  onSelect,
  onKey,
  liRef,
  btnRef,
}: {
  step: Step;
  index: number;
  open: boolean;
  k: number; // 1 = animate, 0 = reduced motion
  onSelect: () => void;
  onKey: (e: KeyboardEvent) => void;
  liRef: (el: HTMLLIElement | null) => void;
  btnRef: (el: HTMLButtonElement | null) => void;
}) {
  const btnId = `process-btn-${step.id}`;
  const panelId = `process-panel-${step.id}`;
  const tag = tagOf(step.subtitle);
  const ms = (v: number) => `${v * k}ms`;

  // Content inside the panel rises in after the row has started opening, and leaves fast on close
  const rise = (delay: number): CSSProperties => ({
    opacity: open ? 1 : 0,
    transform: open ? 'translateY(0)' : 'translateY(14px)',
    transition: open
      ? `opacity ${ms(600)} ease ${ms(delay)}, transform ${ms(800)} ${EASE_CSS} ${ms(delay)}`
      : `opacity ${ms(180)} ease, transform ${ms(180)} ease`,
  });

  const move = (shift: string) => `calc(-50% + ${open ? shift : '0px'})`;
  const slide = `transform ${ms(DUR)} ${EASE_CSS}, translate ${ms(450)} ${EASE_CSS}`;

  const processLabel = (
    <>
      <span className="text-[#666]" style={{ ...SANS, fontSize: 'max(15px, 1.55vw)' }}>
        Process
      </span>
      <span className="ml-[0.8vw] text-[#555]" style={{ ...MONO, fontSize: 'max(11px, 1.05vw)' }}>
        ·{tag}
      </span>
    </>
  );

  return (
    <motion.li
      ref={liRef}
      initial={k ? { opacity: 0, y: 36 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay: Math.min(index, 3) * 0.07 }}
      className={`relative bg-black transition-colors duration-500 ${open ? '' : 'hover:bg-[#101010]'}`}
      style={{ contain: 'layout paint' }}
    >
      {/* Header: the whole closed row is the button (number, title, tag live inside it) */}
      <button
        id={btnId}
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-disabled={open}
        onClick={onSelect}
        onKeyDown={onKey}
        className={`group absolute inset-x-0 top-0 z-20 block w-full text-left outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FF5C05] ${
          open ? 'cursor-default' : 'cursor-pointer [--hx:0px] hover:[--hx:12px]'
        }`}
        style={{ height: 'var(--closed)' }}
      >
        <span
          className={`absolute left-[18px] top-1/2 font-bold leading-none transition-colors duration-300 md:left-[2.6vw] ${
            open ? 'text-[#6a6a6a]' : 'text-[#6a6a6a] group-hover:text-[#FF5C05]'
          }`}
          style={{
            ...COND,
            fontSize: 'max(16px, 1.55vw)',
            transform: `translateY(${move('var(--ny)')})`,
            transition: `${slide}, color 300ms ease`,
          }}
        >
          {numOf(step.num)}
        </span>

        <span
          className="absolute left-[58px] top-1/2 whitespace-nowrap font-bold leading-none text-white md:left-[11.67vw]"
          style={{
            ...SANS,
            fontSize: 'max(20px, 2.3vw)',
            transform: `translateY(${move('var(--ty)')})`,
            translate: 'var(--hx, 0px) 0px',
            transition: slide,
          }}
        >
          {step.title}
        </span>

        {/* Collapsed tag: fades out as the row opens (its twin sits bottom-left of the panel) */}
        <span
          className={`absolute left-[71.9vw] top-1/2 hidden -translate-y-1/2 whitespace-nowrap transition-[filter] duration-300 lg:block ${
            open ? '' : 'group-hover:brightness-150'
          }`}
          style={{ opacity: open ? 0 : 1, transition: `opacity ${ms(open ? 200 : 500)} ease ${ms(open ? 0 : 250)}, filter 300ms ease` }}
        >
          {processLabel}
        </span>
      </button>

      {/* Spacer = closed height */}
      <div aria-hidden="true" style={{ height: 'var(--closed)' }} />

      {/* Panel */}
      <div
        className="grid"
        style={{ gridTemplateRows: open ? '1fr' : '0fr', transition: `grid-template-rows ${ms(DUR)} ${EASE_CSS}` }}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            aria-hidden={!open}
            className="flex flex-col justify-between px-[18px] pb-6 pt-1 md:min-h-[calc(var(--open)_-_var(--closed))] md:pb-[2vw] md:pl-[11.67vw] md:pr-[2.3vw] md:pt-0"
          >
            {/* Image: in flow on mobile, pinned to the right on desktop; wipes up, then settles from a zoom */}
            <div
              aria-hidden={!open}
              className="relative mb-5 aspect-[16/10] w-full overflow-hidden bg-[#111] md:absolute md:right-[2.15vw] md:top-[2.1vw] md:mb-0 md:aspect-auto md:h-[20.3vw] md:w-[40.4vw]"
              style={{
                clipPath: open ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
                transition: `clip-path ${ms(open ? 950 : 450)} ${EASE_CSS} ${ms(open ? 150 : 0)}`,
              }}
            >
              <div
                className="absolute inset-0 will-change-transform"
                style={{
                  transform: open ? 'scale(1)' : 'scale(1.18)',
                  transition: `transform ${ms(open ? 1500 : 450)} ${EASE_CSS} ${ms(open ? 150 : 0)}`,
                }}
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  loading="eager"
                  priority={index === 0}
                  sizes="(min-width: 768px) 41vw, 92vw"
                  className="object-cover"
                />
              </div>
            </div>

            <p
              className="max-w-[60ch] text-white md:max-w-[36vw] md:pt-[2.3vw] lg:max-w-[27.8vw]"
              style={{ ...SANS, fontSize: 'max(14px, 1.1vw)', lineHeight: 1.28, ...rise(250) }}
            >
              {step.description}
            </p>

            <p className="mt-5 whitespace-nowrap md:mt-0" style={rise(380)}>
              {processLabel}
            </p>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

/* =========================================================
   SECTION
========================================================= */
export default function Process() {
  const [openIndex, setOpenIndex] = useState(0);
  const reduce = useReducedMotion();
  const k = reduce ? 0 : 1;

  const headerRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const raf = useRef(0);

  // Ghost word drifts left as the section scrolls past
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start end', 'end start'] });
  const ghostX = useTransform(scrollYProgress, [0, 1], ['0vw', '-8vw']);

  // If the person scrolls themselves, stop holding the clicked row in place
  useEffect(() => {
    const stop = () => cancelAnimationFrame(raf.current);
    const events = ['wheel', 'touchmove', 'keydown'] as const;
    events.forEach((e) => window.addEventListener(e, stop, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, stop));
      stop();
    };
  }, []);

  /* Open a row. While rows above collapse, the clicked row would slide up under the cursor, so for the
     length of the animation the page is nudged each frame to keep it exactly where the person clicked. */
  const select = (i: number) => {
    if (i === openIndex) return;
    const el = rowRefs.current[i];
    const top0 = el?.getBoundingClientRect().top ?? 0;
    setOpenIndex(i);
    if (!el) return;

    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const tick = (now: number) => {
      const dy = el.getBoundingClientRect().top - top0;
      if (Math.abs(dy) > 0.5) window.scrollBy(0, dy);
      if (now - t0 < DUR + 60) raf.current = requestAnimationFrame(tick);
      else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    };
    raf.current = requestAnimationFrame(tick);
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = steps.length - 1;
    const to =
      e.key === 'ArrowDown' ? Math.min(last, i + 1) :
      e.key === 'ArrowUp' ? Math.max(0, i - 1) :
      e.key === 'Home' ? 0 :
      e.key === 'End' ? last : null;
    if (to === null) return;
    e.preventDefault();
    btnRefs.current[to]?.focus();
  };

  const fade = 'linear-gradient(to bottom, #000 20%, transparent 68%)';

  return (
    <section
      id="process"
      aria-label="Our process"
      className={`${sans.variable} ${cond.variable} ${mono.variable} relative w-full bg-white pb-[max(64px,6vw)] text-black`}
    >
      {/* Header */}
      <header ref={headerRef} className="relative h-[max(110px,12.78vw)] overflow-hidden bg-white">
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-[30vw] top-[2.5vw] select-none whitespace-nowrap font-black italic leading-none"
          style={{
            ...SANS,
            x: ghostX,
            fontSize: '15.5vw',
            color: '#e6e6e6',
            maskImage: fade,
            WebkitMaskImage: fade,
          }}
        >
          EXECUTION.
        </motion.span>

        <motion.div
                    initial="hide"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{ hide: {}, show: { transition: { staggerChildren: 0.12 } } }}
                    className="absolute z-10"
                    style={{ left: 32, top: 40 }}
                  >
                    <h2
                      className="relative whitespace-nowrap font-bold uppercase text-[#1a1a1a]"
                      style={{ ...COND, fontSize: 64, lineHeight: 1.05, letterSpacing: '-0.01em' }}
                    >
                      <span className="block overflow-hidden pb-[0.08em]">
                        <motion.span
                          variants={{
                            hide: { y: reduce ? '0%' : '110%', opacity: reduce ? 0 : 1 },
                            show: { y: '0%', opacity: 1, transition: { duration: 1, ease: EASE } },
                          }}
                          className="block will-change-transform"
                        >
                          PROCESS
                        </motion.span>
                      </span>
                      <motion.span
                        variants={{
                          hide: { opacity: 0 },
                          show: { opacity: 1, transition: { duration: 0.8, delay: 0.5 } },
                        }}
                        className="absolute text-[13px] font-medium leading-none text-black"
                        style={{ ...MONO, left: 255, top: 5, letterSpacing: '-0.02em' }}
                      >
                        [04]
                      </motion.span>
                    </h2>
                  </motion.div>
        
      </header>

      {/* Rows */}
      <ul
        className="m-0 flex list-none flex-col gap-[max(6px,0.7vw)] px-[max(16px,2.3vw)] [--closed:76px] [--ny:0px] [--ty:0px] md:[--closed:clamp(96px,8.47vw,170px)] md:[--ny:calc((var(--open)_-_var(--closed))_/_2)] md:[--open:max(24.45vw,330px)] md:[--ty:calc(var(--closed)_*_0.42)]"
        style={{ overflowAnchor: 'none' }}
      >
        {steps.map((step, i) => (
          <Row
            key={step.id}
            step={step}
            index={i}
            open={i === openIndex}
            k={k}
            onSelect={() => select(i)}
            onKey={(e) => onKey(e, i)}
            liRef={(el) => {
              rowRefs.current[i] = el;
            }}
            btnRef={(el) => {
              btnRefs.current[i] = el;
            }}
          />
        ))}
      </ul>

      {/* Full process page */}
      <motion.div
        className="mt-[max(40px,4vw)] flex justify-center px-6"
        initial={k ? { opacity: 0, y: 24 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <MethodologyButton />
      </motion.div>
    </section>
  );
}