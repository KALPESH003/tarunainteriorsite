'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';

const customEase = [0.76, 0, 0.24, 1];
const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

export default function ProjectClient({ project }) {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <main className="relative bg-[#0a0a0a] min-h-screen pt-24 pb-32 text-white selection:bg-[#232a8b] selection:text-black overflow-hidden border-t border-white/5">
      
      <div 
        className="pointer-events-none absolute inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: noiseBg }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Scroll Memory Back Button */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: customEase }}
          className="mb-16"
        >
          <Link href="/#portfolio" className="group inline-flex items-center gap-4 text-zinc-500 hover:text-white transition-all duration-500 text-[10px] uppercase tracking-[0.3em] font-bold">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#232a8b] group-hover:bg-[#232a8b] transition-all duration-500 shadow-xl">
            <ArrowLeft className="w-4 h-4 text-white transition-transform group-hover:-translate-x-1" />
          </div>
          <span>Back to Portfolio</span>
        </Link>
        </motion.div>

        {/* Header */}
        <div className="mb-16">
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: customEase }}
              className="text-5xl md:text-7xl lg:text-[100px] font-light tracking-tighter leading-[1] mb-12"
            >
              {project.title}
            </motion.h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap items-center gap-8 md:gap-16 border-t border-b border-white/10 py-8"
          >
            <div className="flex items-center gap-4">
              <Tag className="w-4 h-4 text-[#232a8b]" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Category</p>
                <p className="text-gray-200 text-sm font-light">{project.category}</p>
              </div>
            </div>
            <div className="hidden md:block w-[1px] h-8 bg-white/10" />
            <div className="flex items-center gap-4">
              <MapPin className="w-4 h-4 text-[#232a8b]" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Location</p>
                <p className="text-gray-200 text-sm font-light">{project.location}</p>
              </div>
            </div>
            <div className="hidden md:block w-[1px] h-8 bg-white/10" />
            <div className="flex items-center gap-4">
              <Calendar className="w-4 h-4 text-[#232a8b]" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Year</p>
                <p className="text-gray-200 text-sm font-light">{project.year}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: customEase }}
          className="relative w-full h-[60vh] md:h-[80vh] rounded-[2rem] overflow-hidden mb-24 bg-[#050505]"
        >
          <Image 
            src={project.mainImage}
            alt={project.title}
            fill
            priority
            className="object-cover grayscale-[15%] contrast-110"
          />
        </motion.div>

        {/* Description */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: customEase }}
          className="max-w-4xl mx-auto text-center mb-32"
        >
          <span className="text-[#232a8b] text-6xl font-serif leading-none block mb-4">&quot;</span>
          <p className="text-[20px] md:text-[28px] text-gray-300 font-light leading-relaxed font-serif italic">
            {project.description}
          </p>
        </motion.div>

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {project.gallery.map((imgUrl, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: customEase, delay: index % 2 === 0 ? 0 : 0.2 }}
                className={`relative w-full rounded-[2rem] overflow-hidden bg-[#050505] group ${
                  index === project.gallery.length - 1 && project.gallery.length % 2 !== 0 
                    ? 'md:col-span-2 h-[500px] lg:h-[700px]' 
                    : 'h-[400px] lg:h-[600px]'
                }`}
              >
                <Image 
                  src={imgUrl}
                  alt={`Detail ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: customEase }}
          className="mt-32 text-center border-t border-white/10 pt-24"
        >
          <h3 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-8">
            Inspired by this <span className="font-serif italic text-gray-500">space?</span>
          </h3>
          <button 
            onClick={() => router.push('/#contact')} 
            className="group relative inline-flex items-center gap-6 bg-white text-black px-8 py-5 rounded-full overflow-hidden hover:bg-[#2b2da1] transition-colors duration-500"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.15em] whitespace-nowrap">
              Start Your Project
            </span>
          </button>
        </motion.div>

      </div>
    </main>
  );
}