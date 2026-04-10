'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';

export default function EliteWhatsappWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Magnetic Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const whatsappLink = `https://wa.me/919586396373?text=Hello!%20I'd%20love%20to%20discuss%20a%20new%20interior%20project.`;

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x * 0.35);
    mouseY.set(y * 0.35);
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[9999] flex flex-col items-end">
      
      {/* 1. EDITORIAL MESSAGE POPUP */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-10 relative"
          >
            <div className="bg-white/95 backdrop-blur-3xl border border-white/20 p-6 rounded-[1.8rem] shadow-[0_40px_100px_rgba(0,0,0,0.18)] max-w-[280px] text-zinc-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-zinc-400">Direct Concierge</span>
              </div>
              
              <p className="text-[17px] font-serif italic text-zinc-500 leading-tight mb-2">Every space tells a story...</p>
              <p className="text-[14px] font-light text-zinc-800 leading-relaxed tracking-wide">
                Shall we begin crafting yours? <br /> Connect with us instantly.
              </p>

              <svg className="absolute top-[99%] right-10 text-white/95" width="24" height="18" viewBox="0 0 24 18" fill="currentColor">
                <path d="M0 0 Q 12 0, 12 18 Q 12 0, 24 0 Z" />
              </svg>

              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-zinc-300 hover:text-zinc-900 transition-colors">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 1l10 10M11 1L1 11"/></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ENHANCED LIQUID AURA BUTTON */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
        style={{ x: springX, y: springY }}
        className="relative group flex items-center justify-center w-24 h-24"
      >
        {/* --- THE LIQUID AURA ANIMATIONS --- */}
        
        {/* Ring 1: Constant Soft Pulse */}
        <div className="absolute inset-0 rounded-full bg-green-500/10 animate-[ping_3s_infinite_ease-in-out]" />
        
        {/* Ring 2: Faster Inner Glow */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-4 rounded-full border border-green-500/20" 
        />
        
        {/* Ring 3: Hover Expansion Ring (Only visible on hover) */}
        <div className="absolute inset-0 border border-green-500/40 rounded-full scale-50 opacity-0 group-hover:scale-150 group-hover:opacity-100 transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]" />

        {/* Dynamic Gradient Mesh Glow */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 bg-gradient-to-tr from-green-400/20 via-transparent to-brand-blue/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        />

        {/* --- THE MAIN BUTTON --- */}
        <div className="relative w-14 h-14 md:w-19 md:h-19 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(37,211,102,0.3)] group-hover:shadow-[0_30px_70px_rgba(37,211,102_0.5)] transition-all duration-700 overflow-hidden border border-white/20">
          
          {/* Internal Liquid Light Effect */} 
          
          <motion.div 
            animate={{ x: [-40, 40], y: [-20, 20] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            className="absolute w-16 h-16 bg-white/30 blur-2xl rounded-full pointer-events-none" 
          />

          <svg className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10 drop-shadow-xl" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>
      </motion.a>
    </div>
  );
}
