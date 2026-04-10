'use client';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ArrowUpRight, Navigation } from 'lucide-react';
import Link from 'next/link';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Location() {
  return (
    <section id="location" className="relative w-full h-[100vh] min-h-[800px] bg-[#050505] overflow-hidden z-20 border-t border-white/5">
      
      {/* 1. The Dark Architectural Google Map Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        {/* We use `invert` combined with `grayscale` to turn standard Google Maps into a dark-mode blueprint */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14759.240038639999!2d73.1732002617098!3d22.360801568590226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fcfa76699faeb%3A0xad668970da6c5b1f!2sTaruna%20interior%20gallery!5e0!3m2!1sen!2sin!4v1774329569795!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full grayscale invert contrast-125 opacity-30 mix-blend-lighten"
        />
      </div>

      {/* 2. Seamless Blend Gradients (Vignette Effect for Dark Mode) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent w-[80%] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] pointer-events-none z-0 opacity-90" />

      {/* 3. Giant Structural Watermark */}
      <div className="absolute top-32 -left-20 text-[180px] md:text-[220px] lg:text-[280px] font-serif font-bold text-white/[0.02] select-none pointer-events-none z-0 whitespace-nowrap tracking-tighter">
        HEADQUARTERS
      </div>

      {/* 4. The Interactive Dark Glassmorphic UI */}
      <div className="max-w-[1400px] mx-auto relative z-10 h-full flex items-center px-6 md:px-12">
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative w-full max-w-lg bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-[2rem] p-10 md:p-14 overflow-hidden group"
        >
          {/* Subtle animated blue glow inside the card */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-blue/10 blur-[80px] rounded-full group-hover:bg-brand-blue/20 transition-colors duration-700 pointer-events-none" />

          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 mb-8">
            <div className="w-8 h-[1px] bg-brand-blue" />
            <span className="text-brand-blue text-[11px] uppercase tracking-[0.25em] font-bold">Visit Studio</span>
          </motion.div>

          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-medium text-white tracking-tight leading-[1.1] mb-10">
            Let's build <br />
            <span className="italic text-gray-500 font-light">something timeless.</span>
          </motion.h2>

          <div className="space-y-8 mb-12">
            
            {/* Address */}
            <motion.div variants={fadeUp} className="flex items-start gap-5 group/item cursor-default">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-brand-blue group-hover/item:bg-brand-blue/10 group-hover/item:border-brand-blue/30 transition-colors duration-500">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">Location</h4>
                <p className="text-[15px] text-gray-300 font-light leading-relaxed group-hover/item:text-white transition-colors">
                  Taruna Interior Gallery<br />
                  Sama Road, Vadodara,<br />
                  Gujarat, India 390008
                </p>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div variants={fadeUp} className="flex items-start gap-5 group/item">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-brand-blue group-hover/item:bg-brand-blue/10 group-hover/item:border-brand-blue/30 transition-colors duration-500">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">Direct Line</h4>
                <p className="text-[15px] text-gray-300 font-light leading-relaxed group-hover/item:text-brand-blue transition-colors cursor-pointer">
                  +91 95863 96373
                </p>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeUp} className="flex items-start gap-5 group/item">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-brand-blue group-hover/item:bg-brand-blue/10 group-hover/item:border-brand-blue/30 transition-colors duration-500">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">Enquiries</h4>
                <p className="text-[15px] text-gray-300 font-light leading-relaxed group-hover/item:text-brand-blue transition-colors cursor-pointer">
                  design@tarunainteriors.com
                </p>
              </div>
            </motion.div>

          </div>

          {/* Magnetic-Style Action Button */}
          <motion.div variants={fadeUp}>
            <Link 
              href="https://www.google.com/maps/dir/?api=1&destination=Taruna+interior+gallery,+Sama+Rd,+Poonam+Nagar,+Vijayraj+Nagar,+Kasturba+Nagar,+New+Sama,+Vadodara,+Gujarat+390008" 
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative w-full flex items-center justify-between bg-white/5 border border-white/10 text-white p-2 pr-6 rounded-full overflow-hidden hover:border-brand-blue/50 transition-all duration-500"
            >
              {/* Animated Button Background */}
              <div className="absolute inset-0 bg-brand-blue translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-out z-0" />
              
              <div className="relative z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10 group-hover/btn:bg-white/20 transition-colors">
                <Navigation className="w-4 h-4 transform group-hover/btn:rotate-45 transition-transform duration-500" />
              </div>
              
              <span className="relative z-10 text-[13px] font-bold uppercase tracking-[0.15em] ml-4">
                Get Directions
              </span>
              
              <ArrowUpRight className="relative z-10 w-4 h-4 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-all duration-500" />
            </Link>
          </motion.div>

        </motion.div>

      </div>

      {/* Interactive Pulsing Map Marker */}
      <div className="absolute top-[45%] right-[25%] hidden lg:flex items-center justify-center pointer-events-none z-10">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.8, ease: "backOut" }}
          className="relative"
        >
          {/* Radar Ping Effect */}
          <div className="absolute -inset-8 border border-brand-blue/40 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <div className="absolute -inset-4 border border-brand-blue/60 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
          
          {/* Core Marker */}
          <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(67,24,255,0.6)] relative z-10">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>

          {/* High-Contrast Hover Label */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            Taruna HQ
          </div>
        </motion.div>
      </div>

    </section>
  );
}