'use client';
import { motion } from 'framer-motion';

// Your exact custom SVG paths from the original HTML
const expertiseItems = [
  { name: "Foyer Design", path: "M12 3v18m0-18c-2.5 0-4 2-4 5s1.5 5 4 5m0-10c2.5 0 4 2 4 5s-1.5 5-4 5m-5 8h10M9 21v-3m6 3v-3" },
  { name: "False Ceilings", path: "M8 9h8m-4-6v6m-5 4h10l-1 8H8l-1-8z" },
  { name: "Wardrobes", path: "M12 3v18M9 12h1m4 0h1", rect: { x: 4, y: 4, w: 16, h: 16, rx: 1 } },
  { name: "Pooja Room", path: "M4 6h16M5 6v14m14-14v14M8 6v5l4-3 4 3V6" },
  { name: "Bedroom", path: "M4 14h16v4H4v-4zM6 14v-4a2 2 0 012-2h8a2 2 0 012 2v4M4 18v2m16-2v2" },
  { name: "Retail", path: "M4 10h16M9 10v10m6-10v10m-6-5h6", rect: { x: 4, y: 4, w: 16, h: 16, rx: 1 } },
  { name: "Commercial", path: "M3 10h18M5 10V6a2 2 0 012-2h10a2 2 0 012 2v4M8 10v8m8-8v8M4 18h16 M10 6h4" },
  { name: "Kitchens", path: "M7 10h10M10 6h4m-4 8h4", rect: { x: 4, y: 4, w: 16, h: 16, rx: 1 } },
  { name: "TV Units", path: "M8 20h8m-4-4v4", rect: { x: 3, y: 6, w: 18, h: 10, rx: 1 } },
  { name: "Home Office", path: "M3 10l9-7 9 7v11H3V10z M9 15h6v2H9v-2zm2-4h2v2h-2v-2z" },
  { name: "Crockery", path: "M5 8h14c0 4.5-3 9-7 9s-7-4.5-7-9zM5 8v-2h14v2" },
  { name: "Study Rooms", path: "M7 10h10M8 10V6h8v4m-7 4h6m-8 6h10m-9-6v6m8-6v6" },
  { name: "Furniture", path: "M6 9h12M6 14h12M10 6h4m-4 5h4m-4 5h4", rect: { x: 6, y: 4, w: 12, h: 16, rx: 1 } },
  { name: "Space-Saving", path: "M4 8h16M4 8v8h16V8M8 8V4h8v4m-8 8v4m8-4v4" },
  { name: "Glass Work", path: "M10 6l4 12", rect: { x: 7, y: 3, w: 10, h: 18, rx: 2 } },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 } // Fast cascade effect
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function Expertise() {
  return (
    <section className="bg-[#f8f9fb] py-32 px-6 md:px-12 relative z-20 w-full flex flex-col items-center overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        
        {/* Header Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-brand-blue" />
            <span className="text-brand-blue text-[11px] uppercase tracking-[0.25em] font-bold">Our Expertise</span>
            <div className="w-8 h-[1px] bg-brand-blue" />
          </div>
          <h2 className="text-gray-900 text-4xl md:text-5xl lg:text-[56px] font-serif font-medium leading-[1.1] tracking-tight max-w-2xl">
            Comprehensive <br />
            <span className="italic text-gray-400 font-light">Interior Elements.</span>
          </h2>
        </motion.div>

        {/* The Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative bg-white rounded-[2.5rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-12">
            {expertiseItems.map((item, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="flex flex-col items-center justify-center group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 group-hover:bg-brand-blue/5 flex items-center justify-center mb-5 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_15px_30px_rgba(67,24,255,0.1)] border border-gray-100 group-hover:border-brand-blue/30 relative overflow-hidden">
                  <svg className="w-7 h-7 text-gray-400 group-hover:text-brand-blue transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.rect && (
                      <rect x={item.rect.x} y={item.rect.y} width={item.rect.w} height={item.rect.h} rx={item.rect.rx} strokeWidth="1.5" />
                    )}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.path} />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-gray-500 text-center uppercase tracking-widest group-hover:text-gray-900 transition-colors duration-300">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 w-full flex justify-center"
        >
          <button className="group flex items-center gap-4 bg-gray-900 hover:bg-brand-blue text-white px-10 py-4 rounded-full text-[13px] font-bold tracking-[0.2em] shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(67,24,255,0.25)] transition-all duration-500 ease-out transform hover:-translate-y-1 uppercase overflow-hidden relative">
            {/* The Shimmer Animation previously defined in globals.css */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            <span className="relative z-10">Consult an Expert</span>
            <svg className="w-4 h-4 relative z-10 transform transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </motion.div>

      </div>
    </section>
  );
}