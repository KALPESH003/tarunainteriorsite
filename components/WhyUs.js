'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// The 3 distinct positioning states for the image carousel
const imageStateClasses = [
  // State 0: Main Focus (Front)
  "top-0 left-0 w-[75%] h-[85%] rounded-[24px] z-20 opacity-100 shadow-2xl scale-100 blur-0 border-8 border-[#f8f9fb]",
  // State 1: Accent (Bottom Right)
  "top-[55%] left-[45%] w-[50%] h-[45%] rounded-[24px] z-30 opacity-100 shadow-[0_20px_50px_rgba(0,0,0,0.2)] scale-100 blur-0 border-8 border-[#f8f9fb]",
  // State 2: Background (Top Right, Faded)
  "top-[5%] left-[50%] w-[45%] h-[45%] rounded-[24px] z-0 opacity-40 shadow-lg scale-90 blur-[2px] border-8 border-[#f8f9fb]"
];

const images = [
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop", // img-0
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop", // img-1
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop"  // img-2
];

export default function WhyUs() {
  // Tracks which tab is active: 0 (Knowledge), 1 (Excellence), or 2 (Management)
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="whyus" className="bg-[#f8f9fb] py-24 px-6 md:px-12 relative z-20 w-full overflow-hidden">
      
      {/* Giant Background Text */}
      <div className="absolute top-40 -left-20 text-[200px] font-serif font-bold text-gray-900/5 select-none pointer-events-none z-0">
        TARUNA
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="relative flex flex-col items-center text-center w-full px-4 mb-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] bg-brand-blue/5 rounded-full blur-[80px] pointer-events-none z-0" />

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-3 border border-brand-blue/20 text-brand-blue text-[11px] uppercase tracking-[0.25em] font-bold px-6 py-2.5 bg-white/60 backdrop-blur-md shadow-[0_10px_40px_rgba(67,24,255,0.08)] rounded-full hover:-translate-y-1 transition-all duration-300 cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue" />
              </span>
              The Taruna Difference
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative z-10 text-4xl md:text-5xl lg:text-[56px] font-serif font-medium text-gray-900 mt-8 mb-6 leading-[1.15] max-w-4xl mx-auto"
          >
            Redefining Luxury, <br className="hidden md:block" />
            <span className="italic text-gray-400 font-light">One Detail at a Time.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative z-10 text-gray-600 text-[15px] md:text-base max-w-[600px] mx-auto leading-relaxed font-medium"
          >
            We don&apos;t just design spaces; we craft experiences. With an uncompromising dedication to quality and a passion for perfection, we turn your vision into a living masterpiece.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative z-10 w-[1px] h-16 bg-gradient-to-b from-brand-blue/50 to-transparent mt-10 origin-top"
          />
        </div>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto mb-32"
        >
          <div className="absolute bottom-[7px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-gray-200 via-brand-blue/30 to-gray-200 z-0" />
          
          <div className="flex justify-between relative z-10">
            {/* Tab 1 */}
            <div className="flex flex-col items-center w-1/3 group cursor-pointer" onClick={() => setActiveTab(0)}>
              <span className={`text-[12px] mb-4 font-bold uppercase tracking-widest text-center h-8 transition-colors duration-500 group-hover:text-brand-blue ${activeTab === 0 ? 'text-brand-blue' : 'text-gray-400'}`}>
                In-Depth<br />Knowledge
              </span>
              <div className={`w-4 h-4 rounded-full ring-[6px] ring-[#f8f9fb] shadow-md transform transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] relative z-10 ${activeTab === 0 ? 'bg-brand-blue scale-150' : 'bg-gray-300 group-hover:bg-brand-blue group-hover:scale-150'}`} />
            </div>
            {/* Tab 2 */}
            <div className="flex flex-col items-center w-1/3 group cursor-pointer" onClick={() => setActiveTab(1)}>
              <span className={`text-[12px] mb-4 font-bold uppercase tracking-widest text-center h-8 transition-colors duration-500 group-hover:text-brand-blue ${activeTab === 1 ? 'text-brand-blue' : 'text-gray-400'}`}>
                Excellence &<br />Leadership
              </span>
              <div className={`w-4 h-4 rounded-full ring-[6px] ring-[#f8f9fb] shadow-md transform transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] relative z-10 ${activeTab === 1 ? 'bg-brand-blue scale-150' : 'bg-gray-300 group-hover:bg-brand-blue group-hover:scale-150'}`} />
            </div>
            {/* Tab 3 */}
            <div className="flex flex-col items-center w-1/3 group cursor-pointer" onClick={() => setActiveTab(2)}>
              <span className={`text-[12px] mb-4 font-bold uppercase tracking-widest text-center h-8 transition-colors duration-500 group-hover:text-brand-blue ${activeTab === 2 ? 'text-brand-blue' : 'text-gray-400'}`}>
                Dedicated<br />Management
              </span>
              <div className={`w-4 h-4 rounded-full ring-[6px] ring-[#f8f9fb] shadow-md transform transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] relative z-10 ${activeTab === 2 ? 'bg-brand-blue scale-150' : 'bg-gray-300 group-hover:bg-brand-blue group-hover:scale-150'}`} />
            </div>
          </div>
        </motion.div>

        {/* Content & Carousel Area */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Rotating Image Carousel */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative w-full lg:w-1/2 h-[500px] md:h-[600px] group"
          >
            {images.map((src, index) => {
              // Mathematical magic to perfectly mimic your original JS logic
              const stateIdx = (index - activeTab + 3) % 3;
              const positioningClasses = imageStateClasses[stateIdx];
              const overlayOpacity = stateIdx === 0 ? 'opacity-0' : 'opacity-50';

              return (
                <div 
                  key={index}
                  className={`absolute transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden will-change-transform ${positioningClasses}`}
                >
                  <div className={`absolute inset-0 bg-brand-blue/10 z-10 pointer-events-none transition-opacity duration-1000 ${overlayOpacity} ${stateIdx === 0 ? 'group-hover:opacity-0' : ''}`} />
                  <Image src={src} alt="Interior detail" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              );
            })}

            {/* Floating 100% Satisfaction Badge */}
            <div className="absolute top-12 -right-4 md:-right-8 bg-white px-6 py-4 rounded-2xl shadow-xl z-40 flex items-center gap-4 animate-[float_4s_ease-in-out_infinite] pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              </div>
              <div>
                <p className="text-[22px] font-bold text-gray-900 leading-none">100%</p>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Client Satisfaction</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Tab Content (Cross-fading panels) */}
          <div className="w-full lg:w-1/2 relative h-[650px] md:h-[600px]">
            
            {/* Content 0: Knowledge */}
            <div className={`absolute inset-0 w-full transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${activeTab === 0 ? 'opacity-100 translate-y-0 z-10 pointer-events-auto' : 'opacity-0 translate-y-8 -z-10 pointer-events-none'}`}>
              <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 font-medium leading-tight">
                Precision in <br /><span className="italic text-gray-400 font-light">Every Detail.</span>
              </h3>
              <p className="text-[16px] text-gray-600 leading-relaxed font-light mb-8">
                In-depth Knowledge means we design with complete understanding, not guesswork. Every project starts with studying the space to ensure it perfectly complements your lifestyle. 
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm border border-transparent hover:border-gray-100 cursor-default">
                  <div className="mt-1 bg-brand-blue/10 p-2 rounded-full text-brand-blue shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-bold text-[15px] mb-1">Spatial Optimization</h4>
                    <p className="text-sm text-gray-500 font-medium">Mastering the flow of the room and utilizing every corner efficiently.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm border border-transparent hover:border-gray-100 cursor-default">
                  <div className="mt-1 bg-brand-blue/10 p-2 rounded-full text-brand-blue shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-bold text-[15px] mb-1">Practical Aesthetics</h4>
                    <p className="text-sm text-gray-500 font-medium">Balancing lighting, ventilation, and deep storage requirements.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm border border-transparent hover:border-gray-100 cursor-default">
                  <div className="mt-1 bg-brand-blue/10 p-2 rounded-full text-brand-blue shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-bold text-[15px] mb-1">Enduring Quality</h4>
                    <p className="text-sm text-gray-500 font-medium">Guiding clients toward premium finishes so your home stays beautiful.</p>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <p className="text-[18px] font-serif italic text-gray-800">&quot;Your home doesn&apos;t just look good in photos—it feels perfect to live in every day.&quot;</p>
              </div>
            </div>

            {/* Content 1: Excellence */}
            <div className={`absolute inset-0 w-full transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${activeTab === 1 ? 'opacity-100 translate-y-0 z-10 pointer-events-auto' : 'opacity-0 translate-y-8 -z-10 pointer-events-none'}`}>
              <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 font-medium leading-tight">
                Leading with <br /><span className="italic text-gray-400 font-light">Vision.</span>
              </h3>
              <p className="text-[16px] text-gray-600 leading-relaxed font-light mb-8">
                Excellence isn&apos;t just a buzzword; it&apos;s our baseline. We lead the industry by sourcing exclusive materials and introducing innovative design frameworks.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm border border-transparent hover:border-gray-100 cursor-default">
                  <div className="mt-1 bg-brand-blue/10 p-2 rounded-full text-brand-blue shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-bold text-[15px] mb-1">Pioneering Concepts</h4>
                    <p className="text-sm text-gray-500 font-medium">Staying ahead of trends to deliver timeless, bespoke environments.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm border border-transparent hover:border-gray-100 cursor-default">
                  <div className="mt-1 bg-brand-blue/10 p-2 rounded-full text-brand-blue shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-bold text-[15px] mb-1">Uncompromising Standards</h4>
                    <p className="text-sm text-gray-500 font-medium">Partnering only with master artisans and premium vendors.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm border border-transparent hover:border-gray-100 cursor-default">
                  <div className="mt-1 bg-brand-blue/10 p-2 rounded-full text-brand-blue shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-bold text-[15px] mb-1">Sustainable Luxury</h4>
                    <p className="text-sm text-gray-500 font-medium">Integrating eco-conscious materials without sacrificing opulence.</p>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <p className="text-[18px] font-serif italic text-gray-800">&quot;We don&apos;t follow trends; we set the standard for timeless elegance.&quot;</p>
              </div>
            </div>

            {/* Content 2: Management */}
            <div className={`absolute inset-0 w-full transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${activeTab === 2 ? 'opacity-100 translate-y-0 z-10 pointer-events-auto' : 'opacity-0 translate-y-8 -z-10 pointer-events-none'}`}>
              <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 font-medium leading-tight">
                Flawless <br /><span className="italic text-gray-400 font-light">Execution.</span>
              </h3>
              <p className="text-[16px] text-gray-600 leading-relaxed font-light mb-8">
                Our dedicated project managers ensure a seamless journey from concept to completion, handling the logistics so you can enjoy the creative process.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm border border-transparent hover:border-gray-100 cursor-default">
                  <div className="mt-1 bg-brand-blue/10 p-2 rounded-full text-brand-blue shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-bold text-[15px] mb-1">Timeline Adherence</h4>
                    <p className="text-sm text-gray-500 font-medium">Strict scheduling to ensure your project is completed precisely on time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm border border-transparent hover:border-gray-100 cursor-default">
                  <div className="mt-1 bg-brand-blue/10 p-2 rounded-full text-brand-blue shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-bold text-[15px] mb-1">Transparent Communication</h4>
                    <p className="text-sm text-gray-500 font-medium">Weekly visual updates and direct access to your lead designer.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm border border-transparent hover:border-gray-100 cursor-default">
                  <div className="mt-1 bg-brand-blue/10 p-2 rounded-full text-brand-blue shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-bold text-[15px] mb-1">Turnkey Delivery</h4>
                    <p className="text-sm text-gray-500 font-medium">From white-glove installation to the final styling of accessories.</p>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <p className="text-[18px] font-serif italic text-gray-800">&quot;Your peace of mind is as important to us as the final reveal.&quot;</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}