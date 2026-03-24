'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Smooth spring for the progress ring
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Rotate the arrow slightly based on scroll
  const arrowRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, x: -50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0, x: -50 }}
          className="fixed bottom-10 left-10 z-[9999]"
        >
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="relative group w-20 h-20 flex items-center justify-center"
          >
            {/* 1. THE PROGRESS RING (SVG) */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="transparent"
                className="text-black/5" // Background track
              />
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                style={{ pathLength: scrollYProgress }}
                className="text-brand-blue" // Actual progress color
              />
            </svg>

            {/* 2. THE 3D GLASS BODY */}
            <div className="absolute inset-2 rounded-full overflow-hidden
              /* Deep Frost Glass */
              bg-white/10 backdrop-blur-2xl
              /* 3D Inner Lighting */
              border border-white/40
              /* Shadow to ensure visibility on white sections */
              shadow-[0_20px_50px_rgba(0,0,0,0.2),inset_0_0_15px_rgba(255,255,255,0.2)]
              transition-colors duration-500 group-hover:bg-brand-blue/20
            ">
              {/* 3. FLOATING AMBIENT GLOW (Inside the glass) */}
              <motion.div 
                animate={{ 
                  x: [0, 10, -10, 0], 
                  y: [0, -10, 10, 0] 
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-12 h-12 bg-brand-blue/30 blur-xl rounded-full"
              />
            </div>

            {/* 4. THE ARROW (Magnetic & Glowing) */}
            <motion.div 
              style={{ rotate: arrowRotate }}
              className="relative z-10"
            >
              <ArrowUp className="w-6 h-6 text-black group-hover:text-brand-blue transition-colors duration-300" />
            </motion.div>

            {/* 5. 3D "POP" TOOLTIP */}
            <div className="absolute left-full ml-6 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="flex flex-col items-start">
                <div className="bg-zinc-900 text-white text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-700 shadow-2xl">
                  Elevate
                </div>
              </div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
