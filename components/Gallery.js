'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

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

const GalleryCard = ({ src, widthClass, onClick }) => (
  <div onClick={onClick} className={`w-full h-[250px] md:h-full ${widthClass} rounded-[20px] overflow-hidden relative group cursor-pointer bg-gray-100`}>
    <Image 
      src={src} 
      alt="Interior Gallery Inspiration" 
      fill
      // ADDED SIZES: Mobile is 100vw, Desktop is roughly the width percentage of the container
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
      className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-110" 
      priority={false} // Only use priority for Hero images
    />
    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out shadow-2xl">
      <Maximize2 className="w-5 h-5 text-white" />
    </div>
  </div>
);

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === allGalleryImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? allGalleryImages.length - 1 : prev - 1));
  };

  return (
    <section id="gallery" className="bg-white py-32 px-6 md:px-12 relative z-20 w-full overflow-hidden">
      <div className="absolute top-20 left-0 w-full text-center overflow-hidden pointer-events-none z-0">
        <h2 className="text-[12rem] md:text-[18rem] font-serif font-bold text-gray-50/80 leading-none whitespace-nowrap select-none">
          INSPIRATION
        </h2>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-brand-blue" />
              <span className="text-brand-blue text-[11px] uppercase tracking-[0.25em] font-bold">Curated Spaces</span>
            </div>
            <h2 className="text-gray-900 text-4xl md:text-5xl lg:text-[56px] font-serif font-medium leading-[1.1] tracking-tight">
              A Visual <br /> <span className="italic text-gray-400 font-light">Diary.</span>
            </h2>
          </div>
          
          <Link href="/gallery/fullgallery" className="group relative flex items-center gap-4 pb-2 overflow-hidden shrink-0">
            <span className="text-gray-900 font-bold text-sm tracking-wider uppercase relative z-10 transition-colors group-hover:text-brand-blue">
              View Full Gallery
            </span>
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-brand-blue group-hover:bg-brand-blue transition-all duration-500">
              <ArrowUpRight className="w-4 h-4 text-gray-900 group-hover:text-white transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500" />
            </div>
          </Link>
        </motion.div>

        <div className="flex flex-col gap-5">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row gap-5 md:h-[320px] w-full"
          >
            {rowOneImages.map((img, idx) => (
              <GalleryCard key={img.id} src={img.src} widthClass={img.widthClass} onClick={() => setSelectedIndex(idx)} />
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row gap-5 md:h-[320px] w-full"
          >
            {rowTwoImages.map((img, idx) => (
              <GalleryCard key={img.id} src={img.src} widthClass={img.widthClass} onClick={() => setSelectedIndex(idx + rowOneImages.length)} />
            ))}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-lg p-4 md:p-12"
            onClick={() => setSelectedIndex(null)}
          >
            <button 
              className="absolute top-6 right-6 md:top-10 md:right-10 z-[110] w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <button 
              className="absolute left-4 md:left-10 z-[110] w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button 
              className="absolute right-4 md:right-10 z-[110] w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-6xl h-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={allGalleryImages[selectedIndex].src}
                alt="Full screen gallery view"
                fill
                // SIZES FOR LIGHTBOX: This usually takes up most of the screen
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