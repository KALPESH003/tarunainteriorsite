'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const testimonialsData = [
  {
    id: 1,
    text: "Taruna Interior completely transformed our home into a luxury space. The finishing, detailing, and overall design quality was beyond our expectations. Everything was perfectly planned and delivered on time.",
    name: "Rishab Patel",
    location: "Ahmedabad",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    text: "We wanted a luxurious and unique interior, not a basic template design. Taruna Interior gave us custom solutions and executed everything beautifully. Truly worth every penny!",
    name: "Rajveer Parmar",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    text: "What we loved most was the transparency and professionalism. No hidden charges, regular updates, and a very organized process. Taruna Interior is truly a reliable brand.",
    name: "Nidhi Mehta",
    location: "Surat",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    text: "Our 2BHK looked small earlier, but their planning made it feel spacious and super stylish. The layout, lighting, and storage design were done brilliantly. Highly recommended!",
    name: "Kunal Joshi",
    location: "Vadodara",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 5,
    text: "As an NRI, managing a home renovation in India felt impossible. Their turnkey service and weekly virtual walk-throughs made the entire process completely stress-free.",
    name: "Anjali Desai",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 6,
    text: "They designed our corporate office and completely elevated our brand identity. The balance between premium aesthetics and employee ergonomics is simply phenomenal.",
    name: "Vikram Singh",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop"
  }
];

const customEase = [0.76, 0, 0.24, 1];

// Smooth blur-fade animation for the text and images changing
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    filter: "blur(10px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1, ease: customEase }
  },
  exit: (direction) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    filter: "blur(10px)",
    transition: { duration: 0.8, ease: customEase }
  })
};

const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const activeTestimonial = testimonialsData[index];

  return (
    <section className="relative w-full min-h-[90vh] bg-[#0a0a0a] text-white flex items-center overflow-hidden border-t border-white/5 py-24 lg:py-0 selection:bg-[#2c2b74] selection:text-black">
      
      {/* NOISE TEXTURE OVERLAY */}
      <div 
        className="pointer-events-none absolute inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: noiseBg }}
      />

      {/* GIANT BACKGROUND WATERMARK */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-serif font-bold text-white/[0.02] select-none pointer-events-none z-0 whitespace-nowrap tracking-tighter">
        VOICES
      </div>

      <div className="max-w-[1600px] w-full mx-auto relative z-10 px-6 md:px-12 lg:px-20 xl:px-24 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* --- LEFT COLUMN: THE EDITORIAL QUOTE --- */}
        <div className="w-full lg:w-3/5 flex flex-col justify-center relative">
          
          {/* Section Header */}
          <div className="mb-12 lg:mb-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-2 h-2 bg-[#2c2b74] rounded-full" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-400">
                Client Stories
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white leading-[1.1]">
              Words of <br />
              <span className="font-serif italic text-gray-500">Appreciation.</span>
            </h2>
          </div>

          {/* Large Quote Mark */}
          <div className="absolute top-32 lg:top-40 -left-4 lg:-left-12 text-[120px] lg:text-[180px] font-serif leading-none text-[#c9a071]/10 select-none pointer-events-none">
            &quot;
          </div>

          {/* The Animated Quote Text */}
          <div className="relative min-h-[250px] md:min-h-[200px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.p
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="text-2xl md:text-4xl lg:text-[2.5rem] font-light leading-[1.3] tracking-tight text-gray-200 relative z-10"
              >
                {activeTestimonial.text}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Animated Author Info */}
          <div className="mt-12 overflow-hidden h-[60px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col"
              >
                <h4 className="text-lg md:text-xl font-medium text-white mb-1">
                  {activeTestimonial.name}
                </h4>
                <span className="text-[10px] text-[#2c2b74] uppercase tracking-[0.2em] font-bold">
                  {activeTestimonial.location}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* --- RIGHT COLUMN: IMAGE & NAVIGATION --- */}
        <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-end">
          
          {/* Framed Author Image */}
          <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-t-full overflow-hidden border border-white/10 p-2 lg:p-4 bg-[#050505]/50 backdrop-blur-sm">
            <div className="relative w-full h-full rounded-t-full overflow-hidden bg-gray-900">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={index}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Note: I increased the width/quality in the array data above for these larger portraits */}
                  <Image 
                    src={activeTestimonial.image} 
                    alt={activeTestimonial.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover grayscale-[20%] transition-transform duration-[2s] ease-out hover:scale-105" 
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Internal overlay gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-10 flex items-center justify-between w-full max-w-[400px]">
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
              <span className="text-white">0{index + 1}</span>
              <div className="w-16 h-[1px] bg-white/20 relative overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-[#2c2b74]"
                  initial={{ width: 0 }}
                  animate={{ width: `${((index + 1) / testimonialsData.length) * 100}%` }}
                  transition={{ duration: 0.8, ease: customEase }}
                />
              </div>
              <span>0{testimonialsData.length}</span>
            </div>

            {/* Elegant Arrows */}
            <div className="flex items-center gap-3">
              <button 
                onClick={prevTestimonial}
                className="group w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-[#2c2b74] transition-colors duration-500 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-[#2c2b74] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <ArrowLeft className="w-4 h-4 text-white relative z-10 transition-transform duration-500 group-hover:-translate-x-1" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="group w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-[#2c2b74] transition-colors duration-500 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-[#2c2b74] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <ArrowRight className="w-4 h-4 text-white relative z-10 transition-transform duration-500 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}