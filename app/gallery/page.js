'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Play, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryMedia } from '@/data/galleryData';

const customEase = [0.16, 1, 0.3, 1];

export default function FullGallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch for Masonry layout
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const nextMedia = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === galleryMedia.length - 1 ? 0 : prev + 1));
  };

  const prevMedia = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? galleryMedia.length - 1 : prev - 1));
  };

  if (!isMounted) return null;

  return (
    <main className="bg-white min-h-screen relative w-full overflow-x-hidden">
      
      {/* 1. BACKGROUND ARCHIVE TEXT - Lowest Z-index, absolutely no pointer interaction */}
      <div className="fixed top-20 left-0 w-full text-center overflow-hidden pointer-events-none z-0 select-none">
        <h1 className="text-[12rem] md:text-[18rem] font-serif font-bold text-gray-50/50 leading-none whitespace-nowrap">
          ARCHIVE
        </h1>
      </div>

      {/* 2. CONTENT WRAPPER - Mid-level Z-index */}
      <div className="max-w-[1600px] mx-auto py-32 px-6 md:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 relative z-50">
          <div className="relative">
            {/* BACK BUTTON: Forced to highest Z-index and explicit cursor pointer */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: -4 }}
              className="inline-block mb-8 relative z-[100]"
            >
              <Link 
                href="/#gallery" 
                className="group flex items-center gap-4 text-gray-400 hover:text-[#232a8b] transition-all duration-500 text-[10px] uppercase tracking-[0.2em] font-bold cursor-pointer pointer-events-auto"
              >
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#232a8b] group-hover:bg-[#232a8b]/5 transition-all duration-300">
                  <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                </div>
                <span>Back to Gallery</span>
              </Link>
            </motion.div>

            <h2 className="text-gray-900 text-5xl lg:text-[72px] font-serif font-medium leading-[1] tracking-tight">
              The Visual <br /> <span className="italic text-gray-400 font-light">Archive.</span>
            </h2>
          </div>
          <p className="text-gray-500 text-sm max-w-sm md:text-right font-light leading-relaxed">
            A comprehensive collection of our interior spaces, curated materials, and architectural details.
          </p>
        </div>

        {/* 3. MASONRY GRID */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 relative z-10">
          {galleryMedia.map((media, index) => (
            <motion.div
              key={media.id}
              onClick={() => setSelectedIndex(index)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: (index % 5) * 0.1, ease: customEase }}
              className="break-inside-avoid relative w-full rounded-[24px] overflow-hidden group cursor-pointer bg-gray-50 shadow-sm border border-gray-100"
            >
              {media.type === 'video' ? (
                <div className="relative w-full">
                  <video 
                    src={media.url}
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="w-full h-auto object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                  />
                  <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center">
                    <Play className="w-3 h-3 text-white fill-white" />
                  </div>
                </div>
              ) : (
                <div className="relative w-full" style={{ aspectRatio: index % 3 === 0 ? '4/5' : '16/11' }}>
                  <Image 
                    src={media.url}
                    alt={media.alt || "Interior Design Archive"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                  />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out">
                  <Maximize2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. LIGHTBOX MODAL - Highest Z-index */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-12"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Lightbox Controls */}
            <button className="absolute top-6 right-6 md:top-10 md:right-10 z-[1100] w-14 h-14 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xl transition-all border border-white/10" onClick={() => setSelectedIndex(null)}>
              <X className="w-6 h-6 text-white" />
            </button>
            <button className="absolute left-4 md:left-10 z-[1100] w-14 h-14 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xl transition-all border border-white/10" onClick={prevMedia}>
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button className="absolute right-4 md:right-10 z-[1100] w-14 h-14 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xl transition-all border border-white/10" onClick={nextMedia}>
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="relative w-full max-w-7xl h-full max-h-[80vh] rounded-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} 
            >
              {galleryMedia[selectedIndex].type === 'video' ? (
                <video src={galleryMedia[selectedIndex].url} controls autoPlay className="w-full h-full object-contain outline-none bg-black" />
              ) : (
                <Image src={galleryMedia[selectedIndex].url} alt="Gallery" fill sizes="100vw" className="object-contain" priority />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}