'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FullProjectGalleryClient({ project }) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
  }, []);

  const nextMedia = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === project.gallery.length - 1 ? 0 : prev + 1));
  };

  const prevMedia = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? project.gallery.length - 1 : prev - 1));
  };

  if (!isMounted) return null;

  return (
    <main className="bg-[#0a0a0a] min-h-screen relative w-full overflow-x-hidden pt-24 pb-32">
      
      {/* Background ARCHIVE Text - Matches your Archive UI */}
      <div className="fixed top-20 left-0 w-full text-center overflow-hidden pointer-events-none z-0">
        <h1 className="text-[10rem] md:text-[15rem] font-serif font-bold text-white/[0.03] leading-none whitespace-nowrap select-none uppercase">
          {project.title.split(' ')[0]}
        </h1>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Navigation Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="relative z-50">
            <button 
              onClick={() => router.back()} 
              className="group inline-flex items-center gap-4 text-zinc-500 hover:text-white transition-all duration-500 text-[10px] uppercase tracking-[0.2em] font-bold cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#232a8b] group-hover:bg-[#232a8b] transition-all duration-500">
                <ArrowLeft className="w-3 h-3 text-white transition-transform group-hover:-translate-x-1" />
              </div>
              <span>Back to Project</span>
            </button>

            <h2 className="text-white text-5xl lg:text-[72px] font-serif font-medium leading-[1] tracking-tighter mt-8">
              Visual <br /> <span className="italic text-zinc-600 font-light">Breakdown.</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-sm max-w-sm md:text-right font-light leading-relaxed">
            A deep dive into the textures, materials, and execution of <span className="text-white">{project.title}</span>.
          </p>
        </div>

        {/* Masonry Style Grid for the Project Gallery */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {project.gallery.map((imgUrl, index) => (
            <motion.div
              key={index}
              onClick={() => setSelectedIndex(index)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: (index % 3) * 0.1 }}
              className="break-inside-avoid relative w-full rounded-[32px] overflow-hidden group cursor-pointer bg-zinc-900 border border-white/5"
            >
              <div className="relative w-full" style={{ aspectRatio: index % 2 === 0 ? '4/5' : '1' }}>
                <Image 
                  src={imgUrl}
                  alt={`${project.title} Detail ${index}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
              </div>
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700">
                  <Maximize2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-6"
            onClick={() => setSelectedIndex(null)}
          >
            <button className="absolute top-10 right-10 z-[1100] w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center" onClick={() => setSelectedIndex(null)}>
              <X className="w-6 h-6 text-white" />
            </button>
            <button className="absolute left-10 z-[1100] w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center" onClick={prevMedia}>
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button className="absolute right-10 z-[1100] w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center" onClick={nextMedia}>
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative w-full max-w-7xl h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={project.gallery[selectedIndex]} 
                alt="Enlarged view" 
                fill 
                className="object-contain" 
                priority 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}