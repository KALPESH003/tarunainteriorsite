'use client';

import React, { useEffect } from 'react'; 
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
// 1. Import the useRouter hook instead of Link
import { useRouter } from 'next/navigation'; 

const customEase = [0.76, 0, 0.24, 1];

const textReveal = {
  hidden: { y: "120%", opacity: 0 },
  visible: { 
    y: "0%", 
    opacity: 1, 
    transition: { duration: 1.2, ease: customEase } 
  }
};

const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

export default function NotFound() {
  // 2. Initialize the router
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <section className="relative w-full h-screen bg-[#0a0a0a] text-[#e0e0e0] flex flex-col items-center justify-center overflow-hidden selection:bg-[#c9a071] selection:text-black">
      
      {/* --- NOISE TEXTURE OVERLAY --- */}
      <div 
        className="pointer-events-none absolute inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: noiseBg }}
      />

      {/* --- GIANT STRUCTURAL 404 WATERMARK --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[35vw] md:text-[30vw] font-serif font-black text-white/[0.02] select-none pointer-events-none z-0 tracking-tighter leading-none mix-blend-screen"
      >
        404
      </motion.div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 mt-12">
        
        {/* Subtle Label */}
        <div className="overflow-hidden mb-8">
          <motion.div 
            variants={textReveal} 
            initial="hidden" 
            animate="visible" 
            className="flex items-center gap-4"
          >
            <span className="w-2 h-2 bg-[#232a8b] rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-400">
              Uncharted Territory
            </span>
          </motion.div>
        </div>

        {/* Cinematic Headline */}
        <div className="mb-8">
          <div className="overflow-hidden">
            <motion.h1 
              variants={textReveal} 
              initial="hidden" 
              animate="visible" 
              className="text-5xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-tighter font-light text-white"
            >
              This space is a
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-4">
            <motion.h1 
              variants={textReveal} 
              initial="hidden" 
              animate="visible" 
              transition={{ duration: 1.2, ease: customEase, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-tighter font-serif italic text-gray-500"
            >
              blank canvas.
            </motion.h1>
          </div>
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: customEase }}
          className="text-sm md:text-base text-gray-400 font-light max-w-md mx-auto mb-16 leading-relaxed"
        >
          The page you are looking for has been moved, renamed, or perhaps never existed. Let's guide you back to the blueprints.
        </motion.p>

        {/* 3. Changed Link to a Button that triggers router.back() */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: customEase }}
        >

          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-6 bg-white text-black px-6 py-4 lg:px-8 lg:py-5 rounded-full overflow-hidden hover:bg-[#232a8b] transition-colors duration-500"
          >
            <div className="relative w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center bg-black rounded-full overflow-hidden shrink-0">
              <div className="absolute flex items-center justify-center transform transition-transform duration-500 group-hover:translate-x-[200%]">
                <ArrowLeft className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              <div className="absolute flex items-center justify-center transform -translate-x-[200%] transition-transform duration-500 group-hover:translate-x-0">
                <ArrowLeft className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
            </div>
            
            <span className="text-[10px] lg:text-xs font-semibold uppercase tracking-[0.15em] whitespace-nowrap">
              Return to Previous
            </span>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
