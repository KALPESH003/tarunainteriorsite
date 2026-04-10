'use client';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

// Data array for easy updating
const statsData = [
  { id: 1, value: 12, suffix: '+', title: 'Years Experience', subtitle: 'Mastering spatial design.' },
  { id: 2, value: 200, suffix: '+', title: 'Projects Delivered', subtitle: 'Residential & commercial.' },
  { id: 3, value: 15, suffix: '+', title: 'Design Experts', subtitle: 'Dedicated visionary team.' },
];

// Reusable Counter Sub-Component
function Counter({ value, suffix, title, subtitle }) {
  const ref = useRef(null);
  
  // Triggers when the component comes into the viewport
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const count = useMotionValue(0);
  // Transforms the raw decimal motion value into a clean integer
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: 2.5, ease: "easeOut" });
    }
  }, [isInView, count, value]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center text-center group py-6 md:py-0 px-4">
      <div className="flex items-baseline justify-center mb-1">
        <motion.h2 className="text-5xl lg:text-[56px] font-serif font-medium text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tight">
          {rounded}
        </motion.h2>
        <span className="text-3xl text-brand-blue font-bold">{suffix}</span>
      </div>
      {/* Use {title} here instead of {label} */}
      <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">{title}</p> 
      <p className="text-xs text-gray-500 font-medium max-w-[180px]">{subtitle}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="relative py-10 px-4 md:px-8 bg-gray-900 w-full z-10 overflow-hidden">
      
      {/* Background Blurs and Textures */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[150%] bg-brand-blue/10 blur-[120px] rounded-full transform rotate-12 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[80%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGgyMHYyMEgyMHptLTIwIDBoMjB2MjBIMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')" }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1000px] mx-auto relative z-10"
      >
        {/* Glassmorphic Container */}
        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] py-8 px-6 md:p-16 shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {statsData.map((stat) => (
              <Counter key={stat.id} {...stat} />
            ))}
          </div>
          
        </div>
      </motion.div>

    </section>
  );
}