'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop',
    title: 'The Atharva Project',
    subtitle: 'Premium Residential — 2026',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
    title: 'Lumina Penthouse',
    subtitle: 'Luxury Modern — 2025',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600&auto=format&fit=crop',
    title: 'Vanguard Workspace',
    subtitle: 'Commercial Office — 2024',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop',
    title: 'Oak & Iron Villa',
    subtitle: 'Bespoke Turnkey — 2023',
  }
];

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToContent = () => {
    const nextSection = document.getElementById('features') || document.getElementById('gallery');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 pt-32 pb-20 lg:py-32 min-h-[100vh] z-10 overflow-hidden bg-[#0a0a0a]">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#4318FF]/20 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Left Column: Text Content */}
      <motion.div 
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="w-full lg:w-[45%] flex flex-col justify-center space-y-8 lg:pr-12 mb-16 lg:mb-0 relative z-20"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 mb-2">
          <div className="w-8 h-[1px] bg-gray-500" />
          <span className="text-gray-400 text-[11px] uppercase tracking-[0.3em] font-bold">
            Luxury Interiors
          </span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-[80px] font-serif font-medium leading-[1.05] text-white tracking-tight">
          Designing <br /> Spaces <em className="font-serif italic text-gray-400 font-light">That</em><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
            Reflect You.
          </span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-gray-400 text-[17px] max-w-lg leading-[1.8] font-light">
          Elegant, functional interiors crafted with precision, creativity, and a profound understanding of modern luxury living.
        </motion.p>
        </motion.div>

      {/* Right Column: Interactive Image Slider */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-[55%] relative h-[500px] md:h-[600px] lg:h-[800px] z-20"
      >
        <div className="relative rounded-[2rem] overflow-hidden w-full h-full group border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 w-full h-full bg-black">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <Image 
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority={currentSlide === 0} 
                  className="object-cover transition-transform duration-[10s]"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none z-20" />

          <div className="absolute bottom-8 md:bottom-12 left-8 md:left-12 right-8 md:right-12 flex items-end justify-between z-30">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-white font-serif text-2xl md:text-3xl mb-2 md:mb-3">
                    {slides[currentSlide].title}
                  </p>
                  <p className="text-white/60 text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold">
                    {slides[currentSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex space-x-2 md:space-x-3 mb-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-[2px] rounded-full transition-all duration-700 ${
                    currentSlide === index ? 'w-8 md:w-12 bg-white' : 'w-3 md:w-4 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}