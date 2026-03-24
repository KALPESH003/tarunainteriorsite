'use client';
import { motion } from 'framer-motion';

// We store the SVGs in an array to keep the JSX clean and scalable
const partnerLogos = [
  {
    id: 'aura',
    svg: (
      <svg height="40" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 30L40 10V50L20 30Z" fill="currentColor" className="text-white"/>
        <text x="60" y="38" fill="white" fontFamily="sans-serif" fontWeight="bold" fontSize="24" letterSpacing="0.2em">AURA</text>
      </svg>
    )
  },
  {
    id: 'lumina',
    svg: (
      <svg height="35" viewBox="0 0 250 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="30" r="15" stroke="currentColor" strokeWidth="4" className="text-white"/>
        <text x="55" y="38" fill="white" fontFamily="serif" fontStyle="italic" fontSize="28" letterSpacing="0.1em">Lumina Studio</text>
      </svg>
    )
  },
  {
    id: 'vanguard',
    svg: (
      <svg height="30" viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="15" width="30" height="30" stroke="currentColor" strokeWidth="2" className="text-white"/>
        <text x="55" y="38" fill="white" fontFamily="sans-serif" fontWeight="200" fontSize="22" letterSpacing="0.4em">VANGUARD</text>
      </svg>
    )
  },
  {
    id: 'nexus',
    svg: (
      <svg height="35" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 50L30 10L50 50H10Z" stroke="currentColor" strokeWidth="2" className="text-white"/>
        <text x="65" y="38" fill="white" fontFamily="serif" fontWeight="bold" fontSize="24" letterSpacing="0.1em">NEXUS</text>
      </svg>
    )
  },
  {
    id: 'oak-iron',
    svg: (
      <svg height="30" viewBox="0 0 250 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="38" fill="white" fontFamily="sans-serif" fontWeight="600" fontSize="20" letterSpacing="0.3em">OAK & IRON</text>
      </svg>
    )
  }
];

export default function Partners() {
  return (
    <section id="partners" className="relative py-24 lg:py-32 w-full bg-[#050505] z-20 border-t border-b border-white/5 overflow-hidden">
      
      {/* Subtle Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-transparent opacity-50 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        
        {/* Left Column: Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-1/4 flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-brand-blue/50" />
            <span className="text-brand-blue text-[9px] uppercase tracking-[0.4em] font-bold">Trusted By</span>
          </div>
          <h3 className="text-white text-2xl md:text-3xl font-serif leading-tight">
            Visionaries & <br />Global Brands.
          </h3>
        </motion.div>

        {/* Right Column: Infinite Marquee Carousel */}
        <div className="lg:w-3/4 overflow-hidden mask-edges relative">
          <div className="animate-marquee flex items-center gap-16 lg:gap-24 pl-16">
            
            {/* Render the logos twice to create a seamless infinite loop */}
            {[...partnerLogos, ...partnerLogos].map((partner, index) => (
              <div 
                key={`${partner.id}-${index}`} 
                className="flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity duration-500 cursor-pointer grayscale hover:grayscale-0 shrink-0"
                aria-hidden={index >= partnerLogos.length ? "true" : "false"} // Hide the duplicates from screen readers
              >
                {partner.svg}
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}