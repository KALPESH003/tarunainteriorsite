'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Framer Motion hook for the precise scroll progress bar
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Deliberate, jitter-free scroll detection
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
    const previous = scrollY.getPrevious() || 0;

    // --- DYNAMIC THRESHOLD LOGIC ---
    let hideThreshold = 800; // A safe fallback just in case
    
    // Looks for your features bar on the page
    const featuresElement = document.getElementById('features-bar');
    
    if (featuresElement) {
      // Calculates the exact pixel where the features bar ends!
      hideThreshold = featuresElement.offsetTop + featuresElement.offsetHeight;
    }

    // 1. If we are still above or inside the features bar, NEVER hide the navbar
    if (latest < hideThreshold) {
      setIsHidden(false);
      return;
    }

    // 2. Hide when scrolling DOWN past the features bar
    if (latest > previous && latest > hideThreshold) {
      setIsHidden(true);
    } 
    // 3. Show when scrolling UP (with a 5px buffer to prevent trackpad jitter)
    else if (latest < previous - 5) {
      setIsHidden(false);
    }
  });

  return (
    <motion.header 
      initial={{ y: "0px" }}
      // THE TRICK: Slides up exactly its height, minus the 2px for the progress bar!
      animate={{ y: isHidden ? "calc(-100% + 2px)" : "0px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ transition: 'background-color 0.5s ease, padding 0.5s ease' }}
      className={`fixed top-0 w-full z-[100] ${
        scrolled 
          ? `bg-[#0a0a0a]/90 backdrop-blur-xl py-2 ${isHidden ? 'shadow-none' : 'shadow-[0_6px_30px_rgba(0,0,0,0.45)]'}` 
          : 'bg-[#0a0a0a]/70 backdrop-blur-md py-5 shadow-none'
      }`}
    >
      <div className="flex items-center justify-between px-6 lg:px-12">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:border-brand-blue/50 transition-colors duration-500">
            <svg viewBox="0 0 246 239" className="w-7 h-7 text-brand-blue transform group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M119.35 1.50948C121.366 0.163496 123.994 0.163517 126.011 1.50948L242.18 79.0456C247.116 82.3403 244.784 90.0358 238.849 90.0358H219.513C219.623 90.7698 219.681 91.5212 219.681 92.2858V110.398C219.681 107.085 216.994 104.398 213.681 104.398H175.681C172.367 104.398 169.681 107.084 169.681 110.398V136.355C169.681 139.669 172.367 142.355 175.681 142.355H213.681C216.994 142.355 219.681 139.669 219.681 136.355V158.297C219.681 154.983 216.994 152.297 213.681 152.297H175.681C172.367 152.297 169.681 154.983 169.681 158.297V215.884C169.681 219.198 172.367 221.884 175.681 221.884H213.681C216.994 221.884 219.681 219.198 219.681 215.884V223.286C219.681 231.57 212.965 238.286 204.681 238.286H39.6809C31.3967 238.286 24.6809 231.57 24.6809 223.286V136.355C24.6809 139.669 27.3672 142.355 30.6809 142.355H60.6809V215.884C60.6809 219.198 63.3672 221.884 66.6809 221.884H104.681C107.994 221.884 110.681 219.198 110.681 215.884V142.355H148.681C151.994 142.355 154.681 139.669 154.681 136.355V110.398C154.681 107.085 151.994 104.398 148.681 104.398H30.6809C27.3672 104.398 24.6809 107.084 24.6809 110.398V92.2858C24.6809 91.5211 24.7385 90.7698 24.8489 90.0358H6.51196C0.577266 90.0358 -1.75508 82.3404 3.1809 79.0456L119.35 1.50948Z" fill="url(#paint0_linear_nav)"/>
              <defs>
                <linearGradient id="paint0_linear_nav" x1="277.501" y1="29.9997" x2="-41.4979" y2="292.501" gradientUnits="userSpaceOnUse">
                  <stop offset="0.089242" stopColor="#3A08EE"/>
                  <stop offset="0.577699" stopColor="#0A4FFF"/>
                  <stop offset="0.938854" stopColor="#203D87"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex items-baseline">
            <span className="text-white font-bold text-2xl tracking-tight">Taruna</span>
            <span className="text-white/70 text-sm ml-1 italic font-serif opacity-80">interiors.</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex items-center text-[12px] font-bold tracking-[0.15em] uppercase text-gray-400">
            <li className="px-6">
              <Link href="/" className="relative text-white group py-2">
                Home
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transition-transform duration-300 origin-right scale-x-100" />
              </Link>
            </li>
            <li className="px-6">
              <Link href="/#whyus" className="relative group hover:text-white transition-colors py-2">
                About
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
              </Link>
            </li>
            <li className="px-6">
              <Link href="/#services" className="relative group hover:text-white transition-colors py-2">
                Services
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
              </Link>
            </li>
            <li className="px-6">
              <Link href="/#portfolio" className="relative group hover:text-white transition-colors py-2">
                Projects
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
              </Link>
            </li>
          </ul>
        </nav>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center space-x-6">
          <Link href="/#contact" className="hidden md:flex items-center justify-center gap-2 relative overflow-hidden text-white px-8 py-3 border border-white/20 bg-white/5 backdrop-blur-sm rounded-full text-[12px] font-bold tracking-widest uppercase transition-all duration-500 hover:bg-[#4318FF] hover:border-[#4318FF] hover:shadow-[0_0_30px_rgba(67,24,255,0.4)] hover:-translate-y-0.5 group">
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />                
            <span className="relative z-10">Consult Now</span>
          </Link>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-[#4318FF] transition-colors flex flex-col gap-1.5 group lg:hidden z-50"
            aria-label="Toggle Menu"
          >
            <span className={`h-[2px] bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'w-8 rotate-45 translate-y-[8px]' : 'w-8 group-hover:w-6'}`} />
            <span className={`h-[2px] bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'w-0 opacity-0' : 'w-8'}`} />
            <span className={`h-[2px] bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'w-8 -rotate-45 -translate-y-[8px]' : 'w-8 group-hover:w-4'}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-xl z-40 transition-all duration-500 lg:hidden flex flex-col items-center justify-center space-y-8 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <Link onClick={() => setMobileMenuOpen(false)} href="/" className="text-2xl font-serif text-white hover:text-[#4318FF] transition-colors">Home</Link>
        <Link onClick={() => setMobileMenuOpen(false)} href="/#about" className="text-2xl font-serif text-white hover:text-[#4318FF] transition-colors">About</Link>
        <Link onClick={() => setMobileMenuOpen(false)} href="/#services" className="text-2xl font-serif text-white hover:text-[#4318FF] transition-colors">Services</Link>
        <Link onClick={() => setMobileMenuOpen(false)} href="/portfolio" className="text-2xl font-serif text-white hover:text-[#4318FF] transition-colors">Projects</Link>
        <Link onClick={() => setMobileMenuOpen(false)} href="/#contact" className="mt-8 px-8 py-3 rounded-full bg-[#4318FF] text-white text-[12px] font-bold uppercase tracking-widest">Consult Now</Link>
      </div>

      {/* Progress Indicator Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
        <motion.div 
          style={{ scaleX }}
          className="h-full bg-gradient-to-r from-white to-[#4318FF] origin-left rounded-r-full"
        />
      </div>
    </motion.header>
  );
}



// 'use client';
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { motion, useScroll, useSpring } from 'framer-motion';

// export default function Navbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Framer Motion hook for the precise scroll progress bar at the bottom of the nav
//   const { scrollYProgress } = useScroll();
//   const scaleX = useSpring(scrollYProgress, {
//     stiffness: 100,
//     damping: 30,
//     restDelta: 0.001
//   });

//   // Listen for scroll to trigger the "glass" shrinking effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <header 
//       className={`fixed top-0 w-full z-[100] transition-all duration-500 ease-in-out ${
//         scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl shadow-[0_6px_30px_rgba(0,0,0,0.45)] py-2' : 'bg-[#0a0a0a]/70 backdrop-blur-md py-5'
//       }`}
//     >
//       <div className="flex items-center justify-between px-6 lg:px-12">
        
//         {/* Logo Section */}
//         <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
//           <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:border-brand-blue/50 transition-colors duration-500">
//             <svg viewBox="0 0 246 239" className="w-7 h-7 text-brand-blue transform group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M119.35 1.50948C121.366 0.163496 123.994 0.163517 126.011 1.50948L242.18 79.0456C247.116 82.3403 244.784 90.0358 238.849 90.0358H219.513C219.623 90.7698 219.681 91.5212 219.681 92.2858V110.398C219.681 107.085 216.994 104.398 213.681 104.398H175.681C172.367 104.398 169.681 107.084 169.681 110.398V136.355C169.681 139.669 172.367 142.355 175.681 142.355H213.681C216.994 142.355 219.681 139.669 219.681 136.355V158.297C219.681 154.983 216.994 152.297 213.681 152.297H175.681C172.367 152.297 169.681 154.983 169.681 158.297V215.884C169.681 219.198 172.367 221.884 175.681 221.884H213.681C216.994 221.884 219.681 219.198 219.681 215.884V223.286C219.681 231.57 212.965 238.286 204.681 238.286H39.6809C31.3967 238.286 24.6809 231.57 24.6809 223.286V136.355C24.6809 139.669 27.3672 142.355 30.6809 142.355H60.6809V215.884C60.6809 219.198 63.3672 221.884 66.6809 221.884H104.681C107.994 221.884 110.681 219.198 110.681 215.884V142.355H148.681C151.994 142.355 154.681 139.669 154.681 136.355V110.398C154.681 107.085 151.994 104.398 148.681 104.398H30.6809C27.3672 104.398 24.6809 107.084 24.6809 110.398V92.2858C24.6809 91.5211 24.7385 90.7698 24.8489 90.0358H6.51196C0.577266 90.0358 -1.75508 82.3404 3.1809 79.0456L119.35 1.50948Z" fill="url(#paint0_linear_nav)"/>
//               <defs>
//                 <linearGradient id="paint0_linear_nav" x1="277.501" y1="29.9997" x2="-41.4979" y2="292.501" gradientUnits="userSpaceOnUse">
//                   <stop offset="0.089242" stopColor="#3A08EE"/>
//                   <stop offset="0.577699" stopColor="#0A4FFF"/>
//                   <stop offset="0.938854" stopColor="#203D87"/>
//                 </linearGradient>
//               </defs>
//             </svg>
//           </div>
//           <div className="flex items-baseline">
//             <span className="text-white font-bold text-2xl tracking-tight">Taruna</span>
//             <span className="text-white/70 text-sm ml-1 italic font-serif opacity-80">interiors.</span>
//           </div>
//         </Link>

//         {/* Desktop Links */}
//         <nav className="hidden lg:flex items-center">
//           <ul className="flex items-center text-[12px] font-bold tracking-[0.15em] uppercase text-gray-400">
//             <li className="px-6">
//               <Link href="/" className="relative text-white group py-2">
//                 Home
//                 <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transition-transform duration-300 origin-right scale-x-100" />
//               </Link>
//             </li>
//             <li className="px-6">
//               <Link href="/#about" className="relative group hover:text-white transition-colors py-2">
//                 About
//                 <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
//               </Link>
//             </li>
//             <li className="px-6">
//               <Link href="/#services" className="relative group hover:text-white transition-colors py-2">
//                 Services
//                 <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
//               </Link>
//             </li>
//             <li className="px-6">
//               <Link href="/portfolio" className="relative group hover:text-white transition-colors py-2">
//                 Projects
//                 <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
//               </Link>
//             </li>
//           </ul>
//         </nav>

//         {/* Action Buttons & Mobile Toggle */}
//         <div className="flex items-center space-x-6">
//           <Link href="/#contact" className="hidden md:flex items-center justify-center gap-2 relative overflow-hidden text-white px-8 py-3 border border-white/20 bg-white/5 backdrop-blur-sm rounded-full text-[12px] font-bold tracking-widest uppercase transition-all duration-500 hover:bg-[#4318FF] hover:border-[#4318FF] hover:shadow-[0_0_30px_rgba(67,24,255,0.4)] hover:-translate-y-0.5 group">
//             <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />                
//             <span className="relative z-10">Consult Now</span>
//           </Link>
          
//           <button 
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="text-white hover:text-[#4318FF] transition-colors flex flex-col gap-1.5 group lg:hidden z-50"
//             aria-label="Toggle Menu"
//           >
//             <span className={`h-[2px] bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'w-8 rotate-45 translate-y-[8px]' : 'w-8 group-hover:w-6'}`} />
//             <span className={`h-[2px] bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'w-0 opacity-0' : 'w-8'}`} />
//             <span className={`h-[2px] bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'w-8 -rotate-45 -translate-y-[8px]' : 'w-8 group-hover:w-4'}`} />
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu Overlay */}
//       <div className={`fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-xl z-40 transition-all duration-500 lg:hidden flex flex-col items-center justify-center space-y-8 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
//         <Link onClick={() => setMobileMenuOpen(false)} href="/" className="text-2xl font-serif text-white hover:text-[#4318FF] transition-colors">Home</Link>
//         <Link onClick={() => setMobileMenuOpen(false)} href="/#about" className="text-2xl font-serif text-white hover:text-[#4318FF] transition-colors">About</Link>
//         <Link onClick={() => setMobileMenuOpen(false)} href="/#services" className="text-2xl font-serif text-white hover:text-[#4318FF] transition-colors">Services</Link>
//         <Link onClick={() => setMobileMenuOpen(false)} href="/portfolio" className="text-2xl font-serif text-white hover:text-[#4318FF] transition-colors">Projects</Link>
//         <Link onClick={() => setMobileMenuOpen(false)} href="/#contact" className="mt-8 px-8 py-3 rounded-full bg-[#4318FF] text-white text-[12px] font-bold uppercase tracking-widest">Consult Now</Link>
//       </div>

//       {/* Progress Indicator Bar at the bottom of the Nav */}
//       <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
//         <motion.div 
//           style={{ scaleX }}
//           className="h-full bg-gradient-to-r from-white to-[#4318FF] origin-left rounded-r-full"
//         />
//       </div>
//     </header>
//   );
// }