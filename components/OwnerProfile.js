'use client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function OwnerProfile() {
  const containerRef = useRef(null);
  
  // Framer Motion 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="bg-[#050505] py-32 px-6 md:px-12 relative z-20 w-full overflow-hidden border-t border-white/5 flex justify-center">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-brand-blue/5 blur-[150px] rounded-full pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1300px] w-full"
        style={{ perspective: 1500 }}
      >
        <motion.div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="group relative rounded-[40px] bg-[#0a0a0a] border border-white/5 p-8 md:p-16 lg:p-24 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 overflow-hidden z-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
        >
          
          {/* Abstract Noise Texture Overlay */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-screen" 
            style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
          />

          {/* Dotted Grid Background */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none mix-blend-overlay transition-opacity duration-1000 group-hover:opacity-30" 
            style={{ 
              backgroundImage: "radial-gradient(circle at center, #4318FF 1px, transparent 1px)", 
              backgroundSize: "40px 40px" 
            }}
          />

          {/* The Shimmer Light Sweep */}
          <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none z-0 transform -translate-x-full group-hover:animate-[shimmer_2s_ease-out_forwards]" />

          {/* 3D Image Parallax Layer */}
          <div className="w-full lg:w-[45%] relative z-10 flex justify-center mt-8 lg:mt-0" style={{ transform: "translateZ(60px)" }}>
            <div className="absolute inset-0 bg-brand-blue/20 blur-[80px] rounded-full scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out z-0" />
            
            <div className="absolute inset-0 border border-white/10 rounded-[2rem] z-10 pointer-events-none max-w-[400px] mx-auto hidden md:block aspect-[4/5] transition-transform duration-700 group-hover:translate-x-4 group-hover:translate-y-4 group-hover:border-brand-blue/50" />

            <div className="relative rounded-[2rem] overflow-hidden w-full max-w-[400px] aspect-[4/5] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 bg-black z-20 transition-all duration-700 group-hover:-translate-y-2">
              <div className="absolute inset-0 bg-[#0a0a0a]/40 mix-blend-overlay z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-700" />
              <Image 
                src="/founder.png" 
                alt="Founder Portrait" 
                fill
                className="object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Content & Typography Layer */}
          <div className="w-full lg:w-[55%] relative z-10 flex flex-col justify-center" style={{ transform: "translateZ(40px)" }}>
            
            {/* Giant Decorative Quote */}
            <div className="absolute -top-20 -left-10 text-[250px] font-serif font-black text-white/[0.02] pointer-events-none z-0 leading-none select-none transition-transform duration-1000 group-hover:-translate-y-4">
              &quot;
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-[1px] bg-brand-blue" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-brand-blue font-bold">The Visionary</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-[1.2] mb-8 tracking-tight">
                Redefining spaces. <br />
                <span className="font-light italic text-gray-400">Engineering experiences.</span>
              </h2>

              <div className="space-y-6 text-gray-400 font-light leading-[2] text-[15px] md:text-[17px] pl-6 border-l border-white/10 relative">
                <div className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-brand-blue to-transparent scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-1000 ease-out" />
                
                <p className="transition-colors duration-700 group-hover:text-gray-300">
                  At Taruna Interior, we believe every space should feel like a flawless reflection of the people who live in it. What started as a singular passion for spatial design has evolved into a trusted firm known for elegant planning and absolute execution.
                </p>
                <p className="transition-colors duration-700 group-hover:text-gray-300">
                  Whether it&apos;s a bespoke luxury home or a commercial marvel, our philosophy remains unwavering: to bring your vision to life with complete transparency, uncompromising quality, and unparalleled creativity at every single touchpoint.
                </p>
              </div>

              {/* Founder Name & Animated Signature */}
              <div className="mt-14 pt-8 relative min-h-[100px] flex items-center justify-between">
                
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
                
                <div className="transform transition-transform duration-700 group-hover:translate-x-4 relative z-20 w-1/2">
                  <h4 className="font-serif italic text-2xl md:text-3xl text-white mb-2 tracking-wide">PunamChand R. Suthar</h4>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 font-bold">Founder & Lead Designer</p>
                </div>

                {/* The Custom CSS SVG Signature */}
                <div className="absolute right-0 bottom-6 md:bottom-8 w-[60%] max-w-[420px] pointer-events-none z-10 opacity-60 group-hover:opacity-100 transition-opacity duration-1000">
                  <svg viewBox="0 0 800 300" className="w-full h-full transform -rotate-2">
                    <path className="fountain-pen stroke-p" pathLength="100" d="M 180,220 C 200,100 240,40 260,60 C 280,80 230,240 200,260 C 170,280 150,240 180,180 C 210,120 280,100 300,120 C 320,140 280,180 240,180" />
                    <path className="fountain-pen stroke-p-cross" pathLength="100" d="M 120,150 Q 220,135 320,140" />
                    <path className="fountain-pen stroke-unam" pathLength="100" d="M 240,180 C 250,220 270,220 280,180 C 290,140 300,140 310,180 C 320,220 340,220 350,180 C 360,140 370,140 380,180 C 390,220 410,220 420,180" />
                    <path className="fountain-pen stroke-r" pathLength="100" d="M 440,180 C 450,100 480,120 460,160 C 450,180 470,180 490,160" />
                    <circle className="ink-dot dot-r" cx="510" cy="165" r="3.5" />
                    <path className="fountain-pen stroke-s" pathLength="100" d="M 520,180 C 550,80 580,40 600,60 C 620,80 560,180 540,200 C 520,220 500,180 540,160 C 580,140 600,180 580,200" />
                    <path className="fountain-pen stroke-uthar" pathLength="100" d="M 580,200 C 590,230 610,230 620,180 C 630,80 640,80 640,180 C 650,230 670,230 680,180 C 690,80 700,80 700,180 C 710,230 730,230 740,180 C 750,140 760,140 770,180 C 780,230 800,230 810,180 C 820,130 830,130 840,160" />
                    <path className="fountain-pen stroke-t-cross" pathLength="100" d="M 615,130 Q 635,125 655,130" />
                    <path className="fountain-pen stroke-flourish" pathLength="100" d="M 840,160 C 860,200 890,230 920,230 C 950,230 980,190 990,160 Q 995,145 998,160" />
                    <circle className="ink-dot dot-1" cx="950" cy="225" r="4.5" />
                    <circle className="ink-dot dot-2" cx="975" cy="220" r="4.5" />
                  </svg>
                </div>

              </div>
            </div>
          </div>
          
        </motion.div>
      </motion.div>
    </section>
  );
}