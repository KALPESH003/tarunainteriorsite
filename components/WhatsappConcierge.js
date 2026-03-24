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
        <div className="relative w-12 h-12 md:w-17 md:h-17 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(37,211,102,0.3)] group-hover:shadow-[0_30px_70px_rgba(37,211,102_0.5)] transition-all duration-700 overflow-hidden border border-white/20">
          
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

// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';

// export default function EliteWhatsappWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [mounted, setMounted] = useState(false);
  
//   // Magnetic Effect Values
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);
//   const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
//   const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

//   const whatsappLink = `https://wa.me/919586396373?text=Hello!%20I'd%20love%20to%20discuss%20a%20new%20interior%20project.`;

//   useEffect(() => {
//     setMounted(true);
//     const timer = setTimeout(() => setIsOpen(true), 3000);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleMouseMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - (rect.left + rect.width / 2);
//     const y = e.clientY - (rect.top + rect.height / 2);
//     mouseX.set(x * 0.3);
//     mouseY.set(y * 0.3);
//   };

//   const resetMouse = () => {
//     mouseX.set(0);
//     mouseY.set(0);
//   };

//   if (!mounted) return null;

//   return (
//     <div className="fixed bottom-10 right-10 z-[9999] flex flex-col items-end">
      
//       {/* 1. EDITORIAL MESSAGE POPUP */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
//             animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
//             exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
//             className="mb-8 relative"
//           >
//             <div className="bg-white/95 backdrop-blur-3xl border border-white/20 p-6 rounded-[1.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.2)] max-w-[280px] text-zinc-900">
              
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="relative flex h-2 w-2">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
//                 </div>
//                 <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-zinc-400">
//                   Direct Concierge
//                 </span>
//               </div>
              
//               {/* Editorial Typography: Light Serif + Regular Sans */}
//               <p className="text-[17px] font-serif italic text-zinc-500 leading-tight mb-2">
//                 Every space tells a story...
//               </p>
//               <p className="text-[14px] font-light text-zinc-800 leading-relaxed tracking-wide">
//                 Shall we begin crafting yours? <br /> Connect with us instantly.
//               </p>

//               {/* Seamless Fluid Tail */}
//               <svg 
//                 className="absolute top-[99%] right-10 text-white/95" 
//                 width="24" height="18" viewBox="0 0 24 18" fill="currentColor"
//               >
//                 <path d="M0 0 Q 12 0, 12 18 Q 12 0, 24 0 Z" />
//               </svg>

//               <button 
//                 onClick={() => setIsOpen(false)}
//                 className="absolute top-4 right-4 text-zinc-300 hover:text-zinc-900 transition-colors"
//               >
//                 <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 1l10 10M11 1L1 11"/></svg>
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* 2. MAGNETIC INTERACTIVE BUTTON */}
//       <motion.a
//         href={whatsappLink}
//         target="_blank"
//         rel="noopener noreferrer"
//         onMouseMove={handleMouseMove}
//         onMouseLeave={resetMouse}
//         style={{ x: springX, y: springY }}
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         className="relative group flex items-center justify-center w-24 h-24"
//       >
//         {/* Animated Glow Halo */}
//         <div className="absolute inset-0 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all duration-1000 group-hover:scale-150" />
        
//         {/* The Glass Orb */}
//         <div className="relative w-16 h-16 md:w-20 md:h-20 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(37,211,102,0.3)] transition-all duration-700 overflow-hidden border border-white/20">
          
//           {/* Surface Reflection */}
//           <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/30" />
          
//           <svg className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
//             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//           </svg>
//         </div>
//       </motion.a>
//     </div>
//   );
// }


// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import { motion, useInView } from 'framer-motion';

// export default function WhatsappConcierge() {
//   const [showPopup, setShowPopup] = useState(false);
  
//   // Create a reference to the static section to track when it is on screen
//   const sectionRef = useRef(null);
  
//   // This hook automatically returns 'true' when the section enters the viewport
//   const isSectionInView = useInView(sectionRef, { 
//     margin: "0px 0px -10% 0px" 
//   });

//   const whatsappNumber = "919586396373";
//   const whatsappMessage = "Hello I would like to know more about your services.";
//   const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

//   // Handle the initial greeting popup timing
//   useEffect(() => {
//     const timer1 = setTimeout(() => setShowPopup(true), 2000);
//     const timer2 = setTimeout(() => setShowPopup(false), 8000);
//     return () => {
//       clearTimeout(timer1);
//       clearTimeout(timer2);
//     };
//   }, []);

//   return (
//     <>
//       {/* 1. THE STATIC CONCIERGE SECTION */}
//       <section 
//         ref={sectionRef} 
//         id="concierge" 
//         className="relative py-16 lg:py-20 w-full bg-[#050505] z-20 overflow-hidden"
//       >
//         {/* Green ambient glow */}
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-green-500/5 blur-[120px] rounded-full pointer-events-none z-0 transition-opacity duration-1000" />

//         <motion.div 
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//           className="max-w-[1400px] mx-auto px-8 lg:px-16 relative z-10"
//         >
//           <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 group hover:border-white/20 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
//             <div className="flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-12 w-full lg:w-auto">
//               {/* Online Indicator */}
//               <div className="flex items-center gap-3 shrink-0">
//                 <div className="relative flex h-3 w-3">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
//                   <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
//                 </div>
//                 <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/50 group-hover:text-white transition-colors duration-500">
//                   Online Now
//                 </span>
//               </div>

//               <div className="hidden md:block w-[1px] h-12 bg-white/10 group-hover:bg-white/30 transition-colors duration-500" />

//               <div>
//                 <h3 className="text-2xl lg:text-3xl font-serif text-white mb-2">Private Concierge</h3>
//                 <p className="text-white/40 text-[13px] font-light max-w-md leading-relaxed">
//                   Bypass the inbox. Connect directly with our lead designers via WhatsApp for immediate material requests, quick inquiries, or to schedule a private viewing.
//                 </p>
//               </div>
//             </div>

//             <a 
//               href={whatsappLink} 
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="relative overflow-hidden w-full lg:w-auto inline-flex items-center justify-center gap-4 px-10 py-5 rounded-full border border-white/20 bg-[#0a0a0a] transition-all duration-500 hover:scale-105 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] group/btn shrink-0"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] z-0" />
//               {/* WhatsApp SVG Icon */}
//               <svg className="w-5 h-5 text-white/70 group-hover/btn:text-green-400 transition-colors duration-500 relative z-10" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//               </svg>
//               <span className="relative z-10 text-[11px] uppercase tracking-[0.2em] font-bold text-white group-hover/btn:text-white transition-colors duration-500">
//                 Start Conversation
//               </span>
//             </a>
//           </div>
//         </motion.div>
//       </section>

//       {/* 2. THE FLOATING WIDGET */}
//       {/* It automatically hides when isSectionInView becomes true */}
//       <div 
//         className={`fixed bottom-[30px] right-[30px] z-[9999] flex items-center justify-center w-[70px] h-[70px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
//           isSectionInView ? 'opacity-0 translate-y-12 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'
//         }`}
//       >
//         {/* Greeting Popup */}
//         <div 
//           className={`absolute bottom-[80px] right-[10px] bg-white text-[#333] px-5 py-3 rounded-xl text-[13px] font-medium shadow-[0_10px_30px_rgba(0,0,0,0.15)] whitespace-nowrap transition-all duration-500 pointer-events-none origin-bottom-right ${
//             showPopup ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-[10px] scale-95'
//           }`}
//         >
//           👋 Hi! Need help with an interior project?
//         </div>

//         {/* Pulsing Radar Rings */}
//         <div className="absolute w-[70px] h-[70px] bg-[#25D366]/40 rounded-full animate-[ping_2.5s_ease-in-out_infinite]" />
//         <div className="absolute w-[85px] h-[85px] bg-[#25D366]/20 rounded-full animate-[ping_2.5s_ease-in-out_infinite_0.4s]" />
        
//         {/* Main Floating Button */}
//         <a 
//           href={whatsappLink}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="relative z-10 w-[60px] h-[60px] bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform duration-300 hover:scale-110"
//         >
//           <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
//             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//           </svg>
//         </a>
//       </div>
//     </>
//   );
// }