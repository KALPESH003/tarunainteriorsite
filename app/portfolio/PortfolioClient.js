'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const customEase = [0.76, 0, 0.24, 1];
const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

export default function PortfolioClient({ projects }) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <main className="relative bg-[#0a0a0a] min-h-screen pt-32 pb-32 text-white selection:bg-[#232a8b] selection:text-black overflow-hidden">
      <div 
        className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: noiseBg }}
      />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: customEase }}
          className="mb-12"
        >
          <Link href="/#portfolio" className="group inline-flex items-center gap-4 text-zinc-500 hover:text-white transition-all duration-500 text-[10px] uppercase tracking-[0.3em] font-bold">
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#232a8b] group-hover:bg-[#232a8b] transition-all duration-500 shadow-xl">
              <ArrowLeft className="w-4 h-4 text-white transition-transform group-hover:-translate-x-1" />
            </div>
            <span>Back to Home</span>
          </Link>
        </motion.div>

        <div className="mb-20">
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: customEase }}
              className="text-5xl md:text-7xl lg:text-[100px] font-light tracking-tighter leading-[1] mb-6"
            >
              Selected <span className="font-serif italic text-zinc-500">Works.</span>
            </motion.h1>
          </div>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light leading-relaxed"
          >
            An archive of our most defining interior spaces and architectural executions.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 lg:gap-y-24">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: customEase, delay: index % 2 === 0 ? 0 : 0.2 }}
            >
              <Link href={`/portfolio/${project.id}`} className="group block w-full">
                <div className="relative w-full h-[50vh] md:h-[60vh] rounded-[2rem] overflow-hidden bg-[#050505] mb-6 border border-white/5">
                  <Image 
                    src={project.mainImage} alt={project.title} fill sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-all duration-[1.5s] ease-out group-hover:scale-105 group-hover:contrast-110 grayscale-[10%]"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-start px-2">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-light mb-2 group-hover:text-[#232a8b] transition-colors duration-500">
                      {project.title}
                    </h2>
                    <p className="text-zinc-500 text-sm font-light">
                      {project.category} — {project.year}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}