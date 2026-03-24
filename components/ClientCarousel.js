'use client';
import { motion } from 'framer-motion';

// Refined SVGs using `currentColor` so Tailwind completely controls their colors
const partnerLogos = [
  {
    id: 'aura',
    svg: (
      <svg height="40" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 30L40 10V50L20 30Z" fill="currentColor" />
        <text x="60" y="38" fill="currentColor" fontFamily="sans-serif" fontWeight="bold" fontSize="24" letterSpacing="0.2em">AURA</text>
      </svg>
    )
  },
  {
    id: 'lumina',
    svg: (
      <svg height="35" viewBox="0 0 250 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="30" r="15" stroke="currentColor" strokeWidth="4" />
        <text x="55" y="38" fill="currentColor" fontFamily="serif" fontStyle="italic" fontSize="28" letterSpacing="0.1em">Lumina Studio</text>
      </svg>
    )
  },
  {
    id: 'vanguard',
    svg: (
      <svg height="30" viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="15" width="30" height="30" stroke="currentColor" strokeWidth="2" />
        <text x="55" y="38" fill="currentColor" fontFamily="sans-serif" fontWeight="200" fontSize="22" letterSpacing="0.4em">VANGUARD</text>
      </svg>
    )
  },
  {
    id: 'nexus',
    svg: (
      <svg height="35" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 50L30 10L50 50H10Z" stroke="currentColor" strokeWidth="2" />
        <text x="65" y="38" fill="currentColor" fontFamily="serif" fontWeight="bold" fontSize="24" letterSpacing="0.1em">NEXUS</text>
      </svg>
    )
  },
  {
    id: 'oak-iron',
    svg: (
      <svg height="30" viewBox="0 0 250 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="38" fill="currentColor" fontFamily="sans-serif" fontWeight="600" fontSize="20" letterSpacing="0.3em">OAK & IRON</text>
      </svg>
    )
  }
];

export default function ClientCarousel() {
  return (
    <section id="partners" className="bg-[#050505] py-24 lg:py-32 relative w-full z-20 overflow-hidden border-t border-white/5">
      
      {/* Seamless Custom Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes infinite-pan {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-pan {
          animation: infinite-pan 30s linear infinite;
          width: max-content;
        }
        .animate-infinite-pan:hover {
          animation-play-state: paused;
        }
        .fade-edges {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}} />

      {/* Giant Watermark - Flipped to translucent white */}
      <div className="absolute top-10 -left-10 text-[150px] md:text-[200px] lg:text-[250px] font-serif font-bold text-white/[0.02] select-none pointer-events-none z-0 whitespace-nowrap">
        PARTNERS
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10 px-6 md:px-12">
        
        {/* High-End Editorial Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
        >
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-brand-blue" />
              <span className="text-brand-blue text-[11px] uppercase tracking-[0.25em] font-bold">Trusted By</span>
            </div>
            {/* Swapped to white text */}
            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight leading-[1.1]">
              Collaborating with <br />
              <span className="italic text-gray-400 font-light">Global Visionaries.</span>
            </h2>
          </div>
          {/* Swapped borders to white/10 */}
          <p className="text-gray-400 text-[13px] md:text-sm font-medium tracking-widest uppercase md:max-w-[250px] md:text-right border-l border-white/10 md:border-l-0 md:border-r pl-4 md:pl-0 md:pr-4">
            Exclusive partnerships delivering uncompromising quality
          </p>
        </motion.div>

      </div>

      {/* The Infinite Cinematic Marquee */}
      <div className="w-full overflow-hidden fade-edges relative z-10 py-10">
        <div className="animate-infinite-pan flex items-center">
          
          {[...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos].map((partner, index) => (
            <div 
              key={`${partner.id}-${index}`} 
              /* Logos rest at gray-600 and illuminate to pure white on hover */
              className="flex items-center justify-center px-12 md:px-20 text-gray-600 hover:text-white transition-all duration-500 cursor-pointer transform hover:scale-110"
              aria-hidden={index >= partnerLogos.length ? "true" : "false"}
            >
              {partner.svg}
            </div>
          ))}

        </div>
      </div>

    </section>
  );
}