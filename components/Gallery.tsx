'use client';

import { useState, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import SectionHeader, { BTN_ON_LIGHT, COND, EASE, fontVars } from '@/components/SectionHeader';

const rowOneImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop', widthClass: 'md:w-[25%]' },
  { id: 2, src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop', widthClass: 'md:w-[20%]' },
  { id: 3, src: 'https://images.unsplash.com/photo-1771287490603-fbf9b6211cc3?w=1200&auto=format&fit=crop&q=80', widthClass: 'md:w-[35%]' },
  { id: 4, src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop', widthClass: 'md:w-[20%]' },
];

const rowTwoImages = [
  { id: 5, src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop', widthClass: 'md:w-[20%]' },
  { id: 6, src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop', widthClass: 'md:w-[35%]' },
  { id: 7, src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop', widthClass: 'md:w-[25%]' },
  { id: 8, src: 'https://images.unsplash.com/photo-1769745402932-4c93d9e76d98?w=1200&auto=format&fit=crop&q=80', widthClass: 'md:w-[20%]' },
];

const allGalleryImages = [...rowOneImages, ...rowTwoImages];
const GAP = 'gap-[max(6px,0.7vw)]';
const ROW = `flex flex-col md:h-[max(240px,22vw)] md:flex-row ${GAP} w-full`;

function GalleryCard({ src, widthClass, onClick }: { src: string; widthClass: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open image"
      className={`group relative h-[250px] w-full cursor-zoom-in overflow-hidden rounded-[10px] bg-neutral-200 outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 md:h-full ${widthClass}`}
    >
      <Image
        src={src}
        alt="Interior gallery inspiration"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
      />
    </button>
  );
}

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const total = allGalleryImages.length;

  const nextImage = (e: MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((p) => (p === null ? null : (p + 1) % total));
  };
  const prevImage = (e: MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((p) => (p === null ? null : (p - 1 + total) % total));
  };

  const rowMotion = (delay: number) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section
      id="gallery"
      className={`${fontVars} relative z-20 w-full overflow-hidden bg-white pb-[max(64px,6vw)] text-black`}
    >
      <SectionHeader num="08" lines={['VISUAL', 'DIARY']} ghost="INSPIRATION" />

      <div className={`flex flex-col px-[max(16px,2.3vw)] ${GAP}`}>
        <motion.div {...rowMotion(0.1)} className={ROW}>
          {rowOneImages.map((img, idx) => (
            <GalleryCard key={img.id} src={img.src} widthClass={img.widthClass} onClick={() => setSelectedIndex(idx)} />
          ))}
        </motion.div>
        <motion.div {...rowMotion(0.2)} className={ROW}>
          {rowTwoImages.map((img, idx) => (
            <GalleryCard
              key={img.id}
              src={img.src}
              widthClass={img.widthClass}
              onClick={() => setSelectedIndex(idx + rowOneImages.length)}
            />
          ))}
        </motion.div>
      </div>

      <motion.div {...rowMotion(0.1)} className="mt-[max(40px,4vw)] flex justify-center px-6">
        <Link href="/gallery/fullgallery" className={BTN_ON_LIGHT} style={COND}>
          View Full Gallery
        </Link>
      </motion.div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-12"
            onClick={() => setSelectedIndex(null)}
          >
            <button
              aria-label="Close"
              className="absolute right-6 top-6 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 md:right-10 md:top-10"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="h-5 w-5 text-white" />
            </button>
            <button
              aria-label="Previous image"
              className="absolute left-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 md:left-10"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              aria-label="Next image"
              className="absolute right-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 md:right-10"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="relative h-full max-h-[85vh] w-full max-w-6xl overflow-hidden rounded-[10px]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={allGalleryImages[selectedIndex].src}
                alt="Full screen gallery view"
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}