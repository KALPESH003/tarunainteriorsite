'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const partners = [
  { id: 'p1', name: 'Maruti Heights', src: '/ClientCarousel/296134687_3384936541783953_4130116842122299721_n.jpg' },
  { id: 'p2', name: 'Nexa', src: '/ClientCarousel/Amar Cars.png' },
  { id: 'p3', name: 'Skechers', src: '/ClientCarousel/CORP_SKX_S_SHIFTED_1COLOR-logo.png' },
  { id: 'p4', name: 'Aarya Bliss', src: '/ClientCarousel/Screenshot 2026-02-27 153717.png' },
  { id: 'p5', name: 'SHAILY', src: '/ClientCarousel/shaily-logos-02.png' },
  { id: 'p6', name: 'Alembic Real Estate', src: '/ClientCarousel/veda-2.png' },
  { id: 'p7', name: 'GXP Solutions Pvt. Ltd.', src: '/ClientCarousel/web-logo-GXP.png' },
  { id: 'p8', name: 'Zillion Group', src: '/ClientCarousel/Group-Logo-02-150x150.png' },
  { id: 'p9', name: 'Jayant Agro-Organics LTD.', src: '/ClientCarousel/edited-photo.png' },
  { id: 'p10', name: 'Parth Elec. & Eng. Ltd.', src: '/ClientCarousel/Parth Electricals & Engineering Limited.png' },
  { id: 'p11', name: 'Ronak Group', src: '/ClientCarousel/RonakGroup.png' },
  { id: 'p12', name: 'HIMALAYA Eng. Co.', src: '/ClientCarousel/WhatsApp-Image-2025-08-29-at-4.57.png' },
  { id: 'p13', name: 'Shree Jagdamba Jwellers', src: '/ClientCarousel/Group 66.png' }
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
          /* Slowed down slightly since the track is longer now */
          animation: infinite-pan 60s linear infinite; 
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
              <div className="w-8 h-[1px] bg-[#232a8b]" />
              <span className="text-[#232a8b] text-[11px] uppercase tracking-[0.25em] font-bold">Trusted By</span>
            </div>
            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight leading-[1.1]">
              Collaborating with <br />
              <span className="italic text-gray-400 font-light">Global Visionaries.</span>
            </h2>
          </div>
          <p className="text-gray-400 text-[13px] md:text-sm font-medium tracking-widest uppercase md:max-w-[250px] md:text-right border-l border-white/10 md:border-l-0 md:border-r pl-4 md:pl-0 md:pr-4">
            Exclusive partnerships delivering uncompromising quality
          </p>
        </motion.div>

      </div>

      {/* The Infinite Cinematic Marquee */}
      <div className="w-full overflow-hidden fade-edges relative z-10 py-10">
        <div className="animate-infinite-pan flex items-center">
          
          {/* FIX: Duplicated exactly 4 times so the -50% CSS transform perfectly visually aligns with the start! */}
          {[...partners, ...partners, ...partners, ...partners].map((partner, index) => (
            <div 
              key={`${partner.id}-${index}`} 
              className="flex flex-col items-center justify-center px-12 md:px-20 group cursor-pointer"
              aria-hidden={index >= partners.length ? "true" : "false"}
            >
              {/* Image Container with Grayscale Filter Effect */}
              <div className="relative w-32 h-16 md:w-40 md:h-20 transition-all duration-500 transform group-hover:scale-110 opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0">
                <Image 
                  src={partner.src}
                  alt={`${partner.name} Logo`}
                  fill
                  sizes="(max-width: 768px) 150px, 200px"
                  className="object-contain"
                />
              </div>
              
              {/* Company Name appearing on Hover */}
              <span className="mt-4 text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                {partner.name}
              </span>
            </div>
          ))}

        </div>
      </div>

    </section>
  );
}
