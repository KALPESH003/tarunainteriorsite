'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { Roboto_Condensed, Roboto_Mono } from 'next/font/google';
import type { ProjectDetail as Detail } from '@/data/projectDetails';

const cond = Roboto_Condensed({ subsets: ['latin'], weight: ['400', '500', '700', '900'], style: ['normal', 'italic'], display: 'swap', variable: '--font-cond' });
const mono = Roboto_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-mono' });
const COND = { fontFamily: 'var(--font-cond), "Roboto Condensed", sans-serif' };
const MONO = { fontFamily: 'var(--font-mono), "Roboto Mono", monospace' };

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const GHOST_MASK = 'linear-gradient(to bottom, #000 12%, transparent 74%)';
// masonry rhythm: tall, wide, portrait, landscape ... repeats for any number of photos
const RATIOS = ['aspect-[3/4]', 'aspect-[3/2]', 'aspect-[4/5]', 'aspect-[16/10]'];

type Props = {
  project: { id: string; title: string; year: string };
  detail: Detail & { name: string };
  next: { slug: string; title: string; image: string };
};

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase text-[#8a8a8a]">{label}</dt>
      <dd className="mt-1 text-[12px] font-medium uppercase text-white">{value}</dd>
    </div>
  );
}

export default function ProjectDetail({ project, detail, next }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const n = detail.gallery.length;

  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n]);

  // lightbox: keyboard + scroll lock
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, step]);

  const btn =
    'inline-flex h-[52px] w-[200px] items-center justify-center rounded-lg bg-white text-[14px] font-bold uppercase text-black outline-none transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#e6e6e6] active:translate-y-0 focus-visible:ring-2 focus-visible:ring-[#FF5C05] focus-visible:ring-offset-2 focus-visible:ring-offset-black';

  return (
    <MotionConfig reducedMotion="user">
      <div className={`${cond.variable} ${mono.variable} relative overflow-x-clip bg-black text-white`}>
        {/* ================= HERO ================= */}
        <section className="relative">
          <div className="relative min-h-[620px] overflow-hidden px-5 pb-10 pt-[120px] md:min-h-[640px] md:px-[2vw] md:pt-[150px]">
            <Image src={detail.heroImage ?? ''} alt="" fill priority sizes="100vw" className="scale-110 object-cover blur-[3px]" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black" />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <h1 className="relative max-w-[8ch] font-bold uppercase leading-[1.05] tracking-[-0.01em]" style={{ ...COND, fontSize: 'clamp(36px, 4.45vw, 64px)' }}>
                <span className="block overflow-hidden pb-[0.08em]">
                  <motion.span className="block" initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 1, ease: EASE }}>
                    {project.title}
                  </motion.span>
                </span>
                <span className="absolute left-full top-[4px] ml-[10px] text-[13px] font-medium leading-none" style={MONO}>
                  [{project.id}]
                </span>
              </h1>
              <Link href="/" className={`${btn} hidden md:inline-flex`} style={COND}>
                BACK 2 HOME
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
              className="relative z-10 mt-8 max-w-[420px] space-y-4 md:mt-10 md:max-w-[34vw]"
            >
              {detail.sections.map((s) => (
                <div key={s.title}>
                  <h2 className="text-[12px] font-medium text-[#9a9a9a]" style={COND}>{s.title}</h2>
                  <p className="mt-1 text-[12px] leading-[1.5] text-white/90" style={COND}>{s.body}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* feature photo overlaps the hero edge */}
          <motion.div
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
            className="relative mx-5 mt-2 aspect-[3/2] overflow-hidden bg-neutral-900 md:absolute md:right-[1.5vw] md:top-[300px] md:z-20 md:m-0 md:w-[46vw]"
          >
            <Image src={detail.heroImage ?? ''} alt={`${project.title}, ${detail.type}`} fill sizes="(max-width: 768px) 90vw, 46vw" className="object-cover" />
          </motion.div>

          {/* facts */}
          <div className="relative px-5 py-10 md:min-h-[150px] md:px-[2.2vw] md:pt-6">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[130px] select-none overflow-hidden" style={{ maskImage: GHOST_MASK, WebkitMaskImage: GHOST_MASK }}>
              <div className="absolute left-[18vw] top-0 whitespace-nowrap font-black italic uppercase text-[#141414]" style={{ ...COND, fontSize: 'clamp(110px, 18.75vw, 300px)', lineHeight: 0.8 }}>WORK</div>
            </div>
            <dl className="relative grid max-w-[380px] grid-cols-2 gap-x-10 gap-y-4" style={COND}>
              <Meta label="Project type" value={detail.type} />
              <Meta label="Year" value={project.year} />
              <Meta label="Location" value={detail.location} />
              <Meta label="Captured by" value={detail.capturedBy} />
            </dl>
          </div>
        </section>

        {/* ================= GALLERY ================= */}
        <section aria-label={`${project.title} photo gallery`} className="px-5 pb-20 pt-10 md:px-[2.2vw] md:pt-16">
          <ul className="columns-1 gap-4 md:columns-2 md:gap-5 [&>li]:mb-4 md:[&>li]:mb-5">
            {detail.gallery.map((src, i) => (
              <motion.li
                key={src + i}
                className="break-inside-avoid"
                initial={{ clipPath: 'inset(12% 0 0 0)', opacity: 0 }}
                whileInView={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 1, ease: EASE }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Open photo ${i + 1} of ${n}`}
                  className={`group relative block w-full cursor-zoom-in overflow-hidden bg-neutral-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5C05] ${RATIOS[i % RATIOS.length]}`}
                >
                  <Image src={src} alt={`${project.title} interior, view ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 48vw" className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none" />
                </button>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* ================= NEXT PROJECT ================= */}
        <section className="border-t border-white/80 px-5 pb-24 pt-14">
          <Link
            href={`/projects/${next.slug}`}
            prefetch={false}
            aria-label={`Next project: ${next.title}`}
            className="group mx-auto block w-full max-w-[480px] bg-white p-[6px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5C05]"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
              <Image src={next.image} alt="" fill sizes="(max-width: 768px) 90vw, 480px" className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" />
            </div>
            <span className="flex items-center justify-center gap-3 py-5 text-[12px] font-medium uppercase text-black" style={COND}>
              <span className="underline underline-offset-4">Next project</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#FF5C05" strokeWidth="1.4" aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <path d="M2 10 10 2M3.5 2H10v6.5" />
              </svg>
            </span>
          </Link>
          <p className="sr-only">Up next: {next.title}</p>
        </section>

        {/* ================= LIGHTBOX ================= */}
        <AnimatePresence>
          {open !== null && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${project.title} photo ${open + 1} of ${n}`}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
            >
              <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
                <Image src={detail.gallery[open]} alt={`${project.title} interior, view ${open + 1}`} fill sizes="100vw" className="object-contain" priority />
              </div>
              <button type="button" aria-label="Close" onClick={() => setOpen(null)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg border border-white/30 text-xl text-white hover:bg-white hover:text-black md:right-8 md:top-8">×</button>
              {n > 1 && (
                <>
                  <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg border border-white/30 text-white hover:bg-white hover:text-black md:left-8">‹</button>
                  <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg border border-white/30 text-white hover:bg-white hover:text-black md:right-8">›</button>
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[12px] tabular-nums text-white/80" style={MONO}>{open + 1} / {n}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}