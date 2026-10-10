'use client';

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Roboto_Condensed, Roboto_Mono } from 'next/font/google';
import { usePathname } from 'next/navigation';
/* ------------------------------------------------------------------ */
/*  Fonts (condensed display + mono for details, as in the design)     */
/*  If your site already loads these, remove this block and reuse them */
/* ------------------------------------------------------------------ */
const display = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
});
const mono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

/* ------------------------------------------------------------------ */
/*  Content — edit everything here                                     */
/* ------------------------------------------------------------------ */
const HERO_IMAGE = 'https://images.unsplash.com/photo-1548248823-ce16a73b6d49?q=80&w=1888&auto=format&fit=crop'; // put the woven-panel photo in /public/images/
const HEADLINE = 'Your vision deserves the right design partner.';

const CONTACT_SECTION_ID = 'contact'; // id of your contact section, if one exists on the page
const EMAIL = 'contact@tarunainteriors.com';
const PHONE_LABEL = '+91 95863 96373';
const PHONE_HREF = 'tel:+919586396373';
const ADDRESS_LINES = ['A-68 Laxmi Nagar, Near Pushpa Nagar', 'New Sama Road, Sama- Vadodara'];
const MAP_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS_LINES.join(', ')
)}`;

// Replace with your real profile URLs
const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/taruna_interior' },
  { label: 'YouTube', href: 'https://youtube.com/@tarunainteriorgallery' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/taruna-interior-gallery' },
  { label: 'Facebook', href: 'https://facebook.com/punamchand.suthar.520' },
];

/* ------------------------------------------------------------------ */
/*  Cursor lens settings — tweak to taste                              */
/* ------------------------------------------------------------------ */
const LENS_SIZE = 84; // px — the little rounded square
const LENS_RADIUS = 24; // px — corner roundness
const LENS_FOLLOW = 0.13; // 0–1, lower = floatier / more lag
const GLOW_RADIUS = 240; // px — soft light pool that spreads over the image

// Pages whose last block reserves scroll space for the footer to slide over (curtain reveal)
const OVERLAP_ROUTES = ['/'];
/* ------------------------------------------------------------------ */
/*  Motion helpers                                                     */
/* ------------------------------------------------------------------ */
const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

const rise = (on: boolean) =>
  `transition-[opacity,transform] duration-[900ms] ${EASE} motion-reduce:transition-none ${
    on ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
  }`;

const delay = (on: boolean, ms: number) => ({ transitionDelay: on ? `${ms}ms` : '0ms' });

/* ------------------------------------------------------------------ */
/*  Shared classes                                                     */
/* ------------------------------------------------------------------ */
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';

const labelCls = 'mb-[18px] text-[13px] uppercase text-white';

const detailLinkCls = `text-[13px] font-medium text-white underline decoration-white/40 underline-offset-[5px] transition-colors duration-300 hover:decoration-white ${focusRing}`;

const socialCls = `relative py-1 text-white/90 transition-colors duration-300 hover:text-white after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100 ${focusRing}`;

/* Keyframes for the pulsing lens (scoped with a tz- prefix) */
const LENS_CSS = `
@keyframes tz-ring {
  0%   { transform: scale(1);   opacity: .7; }
  70%  { opacity: .08; }
  100% { transform: scale(2.7); opacity: 0; }
}
@keyframes tz-core {
  0%, 100% { transform: scale(1);    box-shadow: 0 0 22px rgba(255,255,255,.28), inset 0 0 14px rgba(255,255,255,.18); }
  50%      { transform: scale(1.09); box-shadow: 0 0 44px rgba(255,255,255,.5),  inset 0 0 22px rgba(255,255,255,.32); }
}
@keyframes tz-breathe {
  0%, 100% { opacity: .75; }
  50%      { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .tz-ring, .tz-core, .tz-glow-pulse { animation: none !important; }
  .tz-ring { display: none; }
}
`;

export default function Footer() {
  const pathname = usePathname();
  const overlap = OVERLAP_ROUTES.includes(pathname);
  const currentYear = new Date().getFullYear();
  const rootRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  /* ---- cursor lens refs (no React re-renders while moving) ---- */
  const bannerRef = useRef<HTMLDivElement>(null);
  const lensWrapRef = useRef<HTMLDivElement>(null); // opacity (show / hide)
  const lensMoveRef = useRef<HTMLDivElement>(null); // translate (position)
  const lensFlowRef = useRef<HTMLDivElement>(null); // squash / tilt from speed
  const glowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const active = useRef(false);
  const primed = useRef(false);
  const raf = useRef(0);

  // One reveal, fired once when the footer rises into view
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Animation loop: eases the lens toward the cursor, runs only while needed
  const tick = () => {
    const t = target.current;
    const c = current.current;
    const dx = t.x - c.x;
    const dy = t.y - c.y;
    c.x += dx * LENS_FOLLOW;
    c.y += dy * LENS_FOLLOW;

    const speed = Math.hypot(dx, dy);
    const stretch = 1 + Math.min(speed, 60) / 260; // gentle squash while moving fast
    const tilt = Math.max(-10, Math.min(10, dx * 0.12)); // lean into the direction

    if (lensMoveRef.current) {
      lensMoveRef.current.style.transform = `translate3d(${c.x - LENS_SIZE / 2}px, ${
        c.y - LENS_SIZE / 2
      }px, 0)`;
    }
    if (lensFlowRef.current) {
      lensFlowRef.current.style.transform = `rotate(${tilt}deg) scale(${stretch})`;
    }
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle ${GLOW_RADIUS}px at ${c.x}px ${c.y}px, rgba(255,255,255,0.26), rgba(255,255,255,0.09) 45%, transparent 72%)`;
    }

    if (active.current || speed > 0.15) {
      raf.current = requestAnimationFrame(tick);
    } else {
      raf.current = 0;
    }
  };

  const setLensVisible = (on: boolean) => {
    const o = on ? '1' : '0';
    if (lensWrapRef.current) lensWrapRef.current.style.opacity = o;
    if (glowRef.current) glowRef.current.style.opacity = o;
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const rect = bannerRef.current?.getBoundingClientRect();
    if (!rect) return;
    target.current.x = e.clientX - rect.left;
    target.current.y = e.clientY - rect.top;

    // First entry: start at the cursor instead of flying in from the corner
    if (!primed.current) {
      current.current.x = target.current.x;
      current.current.y = target.current.y;
      primed.current = true;
    }
    active.current = true;
    setLensVisible(true);
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  const handlePointerLeave = () => {
    active.current = false;
    primed.current = false;
    setLensVisible(false);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // Smooth-scroll to #contact if it exists, otherwise open a pre-filled email
  const handleContactClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(CONTACT_SECTION_ID);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Project enquiry')}`;
    }
  };

  const words = HEADLINE.split(' ');

  return (
    <section ref={rootRef} className={`relative z-10 ${overlap ? '-mt-[100dvh]' : ''}`}>
      <style>{LENS_CSS}</style>

      <footer className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden rounded-t-[2rem] bg-black md:rounded-t-[3rem]">
        {/* ============ BANNER ============ */}
        <div
          ref={bannerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative flex min-h-[300px] flex-1 flex-col items-center justify-center overflow-hidden rounded-[36px] px-6 py-14 text-center md:mx-3 md:mt-3 md:rounded-[36px] md:py-16"
        >
         {/* Photo */}
          <div aria-hidden="true" className="absolute inset-0 bg-[#2b2b30]">
            <div
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2400ms] ${EASE} motion-reduce:transition-none ${
                shown ? 'scale-100' : 'scale-[1.12]'
              }`}
              style={{ backgroundImage: `url(${HERO_IMAGE})` }}
            />
          </div>


          {/* Dark overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/55"
          />
         
          <div className="relative z-10 flex flex-col items-center">
            <h2
              className={`${display.className} max-w-[62rem] text-[clamp(2.25rem,4.4vw,4.25rem)] font-bold uppercase leading-[1.06] tracking-[0.005em] text-white`}
            >
              {words.map((word, i) => (
                <Fragment key={`${word}-${i}`}>
                  <span className="inline-block overflow-hidden pb-[0.06em] align-top">
                    <span
                      className={`inline-block transition-transform duration-[1000ms] ${EASE} will-change-transform motion-reduce:transition-none ${
                        shown ? 'translate-y-0' : 'translate-y-[115%]'
                      }`}
                      style={delay(shown, 120 + i * 70)}
                    >
                      {word}
                    </span>
                  </span>
                  {i < words.length - 1 ? ' ' : null}
                </Fragment>
              ))}
            </h2>

            <div className={`mt-9 ${rise(shown)}`} style={delay(shown, 120 + words.length * 70)}>
              <a
                href={`#${CONTACT_SECTION_ID}`}
                onClick={handleContactClick}
                className={`${display.className} inline-flex h-[58px] min-w-[235px] items-center justify-center rounded-lg bg-[#e8e8e8] px-10 text-[15px] font-bold uppercase tracking-wide text-black transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white active:translate-y-0 active:scale-[0.98] ${focusRing}`}
              >
                Contact us
              </a>
            </div>
          </div>
        </div>

        {/* ============ BLACK SECTION ============ */}
        {/* Two layers share one grid cell: the giant wordmark behind, details in front */}
        <div className={`${mono.className} relative grid`}>
          {/* Layer 1 — wordmark */}
          <div
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 select-none self-end pt-[2vw]"
          >
            {/* INTERIORS. with a rule drawing in from the left */}
            <div className="flex items-end gap-[0.9vw] pr-[2.3vw]">
              <span
                className={`mb-[0.35vw] h-[1.1vw] min-h-[4px] flex-1 origin-left bg-[#151515] transition-transform duration-[1400ms] ${EASE} motion-reduce:transition-none ${
                  shown ? 'scale-x-100' : 'scale-x-0'
                }`}
                style={delay(shown, 350)}
              />
              <span
                className={`${display.className} text-[7vw] font-extrabold uppercase leading-[0.7] text-[#151515] ${rise(
                  shown
                )}`}
                style={delay(shown, 500)}
              >
                Interiors.
              </span>
            </div>

            {/* TARUNA, fading to black at the bottom */}
            <div className="relative mt-[1.2vw] overflow-hidden">
              <div
                className={`${display.className} whitespace-nowrap text-center text-[29vw] font-extrabold uppercase leading-[0.7] tracking-[-0.01em] text-[#141414] transition-[opacity,transform] duration-[1600ms] ${EASE} motion-reduce:transition-none ${
                  shown ? 'translate-y-0 opacity-100' : 'translate-y-[18%] opacity-0'
                }`}
                style={delay(shown, 300)}
              >
                Taruna
              </div>
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-b from-transparent to-black" />
            </div>
          </div>

          {/* Layer 2 — details */}
          <div className="relative z-10 col-start-1 row-start-1 flex flex-col justify-between gap-14 px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-12 md:px-[4.5vw] md:pt-[9vw]">
            {/* Columns: Address · Email · Contact */}
            <div className="flex flex-col items-center gap-10 text-center lg:flex-row lg:items-start lg:justify-between">
              <div
                className={`w-full max-w-[300px] lg:w-[300px] ${rise(shown)}`}
                style={delay(shown, 700)}
              >
                <h4 className={labelCls}>Address</h4>
                <a
                  href={MAP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-[13px] font-medium leading-relaxed text-white decoration-white/60 underline-offset-[5px] hover:underline ${focusRing}`}
                >
                  {ADDRESS_LINES[0]}
                  <br />
                  {ADDRESS_LINES[1]}
                </a>
              </div>

              <div
                className={`w-full max-w-[300px] lg:w-[300px] ${rise(shown)}`}
                style={delay(shown, 800)}
              >
                <h4 className={labelCls}>Email</h4>
                <a href={`mailto:${EMAIL}`} className={detailLinkCls}>
                  {EMAIL}
                </a>
              </div>

              <div
                className={`w-full max-w-[300px] lg:w-[300px] ${rise(shown)}`}
                style={delay(shown, 900)}
              >
                <h4 className={labelCls}>Contact</h4>
                <a href={PHONE_HREF} className={detailLinkCls}>
                  {PHONE_LABEL}
                </a>
              </div>
            </div>

            {/* Bottom bar */}
            <div
              className={`flex flex-col items-center gap-5 text-[13px] text-white md:flex-row md:justify-between ${rise(
                shown
              )}`}
              style={delay(shown, 1000)}
            >
              <nav aria-label="Social media">
                <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 uppercase md:gap-x-10">
                  {SOCIALS.map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} target="_blank" rel="noopener noreferrer" className={socialCls}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <p className="text-center text-white/90 md:text-right">
                © {currentYear} Taruna Interiors. All rights reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}







// 'use client';
// import Link from 'next/link';

// export default function Footer() {
//   const currentYear = new Date().getFullYear();

//   return (
//     /*
//       LAYERED COVER
//       - `-mt-[100dvh]` pulls the footer up by exactly one viewport, so it starts
//         overlapping the last 100dvh of TextMaskScroll's scroll track. While that
//         section is still pinned (position: sticky), the footer rises from the
//         bottom of the screen at normal scroll speed and covers it.
//       - `relative z-10` keeps it above the pinned stage (z-0).
//       - Transparent background so the rounded top corners reveal the section
//         underneath instead of black squares.
//       REQUIREMENTS: render <Footer /> as the direct next sibling of <TextMaskScroll />,
//       and don't wrap them in an ancestor with overflow hidden/auto/clip (breaks sticky).
//     */
//     <section className="relative z-10 -mt-[100dvh]">
//       {/* min-h-[100dvh] guarantees the footer is at least one viewport tall so it
//           fully covers the pinned section by the time that section un-pins. */}
//       <footer className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden rounded-b-none rounded-t-[2rem] bg-gradient-to-b from-[#1439df] via-[#0c1f96] to-[#050b33] px-6 pb-6 pt-28 md:rounded-t-[3rem] md:pb-8 md:pt-36">

//         {/* Headline */}
//         <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] font-black text-white text-center leading-[1.1] tracking-tight max-w-4xl z-10 font-sans">
//           Your vision deserves the<br className="hidden md:block"/> right design partner.
//         </h2>

//         {/* Action Button */}
//         <Link
//           href="#contact"
//           className="mt-10 md:mt-12 bg-[#e0e0e0] text-[#0f2bb8] text-[13px] md:text-[14px] font-bold uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-white transition-colors duration-300 z-10"
//         >
//           Contact Us
//         </Link>

//         {/* Info Columns */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4 w-full max-w-6xl mt-24 md:mt-32 text-center z-10">

//           {/* Contact */}
//           <div className="flex flex-col items-center">
//             <h4 className="text-[10px] md:text-[11px] text-white/70 uppercase tracking-[0.2em] font-semibold mb-4">
//               Contact
//             </h4>
//             <a
//               href="tel:+919586396373"
//               className="text-white text-sm md:text-[15px] font-medium underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
//             >
//               +91 95863 96373
//             </a>
//           </div>

//           {/* Email */}
//           <div className="flex flex-col items-center">
//             <h4 className="text-[10px] md:text-[11px] text-white/70 uppercase tracking-[0.2em] font-semibold mb-4">
//               Email
//             </h4>
//             <a
//               href="mailto:contact@tarunainteriors.com"
//               className="text-white text-sm md:text-[15px] font-medium underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
//             >
//               contact@tarunainteriors.com
//             </a>
//           </div>

//           {/* Address */}
//           <div className="flex flex-col items-center max-w-[300px] mx-auto">
//             <h4 className="text-[10px] md:text-[11px] text-white/70 uppercase tracking-[0.2em] font-semibold mb-4">
//               Address
//             </h4>
//             <p className="text-white text-sm md:text-[15px] font-medium leading-relaxed">
//               A-68 Laxmi Nagar, Near Pushpa Nagar<br/>
//               New Sama Road, Sama- Vadodara
//             </p>
//           </div>

//         </div>

//         {/* Giant Background Text Group (Stacked & Right-Aligned) */}
//         <div className="absolute bottom-16 md:bottom-12 left-0 w-full flex justify-center z-0 pointer-events-none select-none" aria-hidden="true">
//           <div className="flex flex-col items-end transform scale-y-[1.4] scale-x-[1.1] md:scale-x-[1.4] origin-bottom">
//             <h3 className="text-[6vw] md:text-[3vw] font-black text-white/60 leading-none tracking-tight mb-[4px] z-10">
//               INTERIORS.
//             </h3>
//             <h1 className="text-[32vw] md:text-[17vw] font-black leading-[0.80] tracking-tighter bg-gradient-to-b from-white/40 via-white/10 to-transparent bg-clip-text text-transparent">
//               TARUNA
//             </h1>
//           </div>
//         </div>

//         {/* Bottom Bar — mt-auto pins it to the bottom when the footer is taller
//             than content; pt-* keeps the original 32/40 spacing as a minimum. */}
//         <div className="mt-auto w-full flex flex-col md:flex-row justify-between items-center gap-6 pt-32 md:pt-40 z-10 text-[9px] md:text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">

//           <div className="flex flex-wrap justify-center gap-6 md:gap-8">
//             <Link href="https://instagram.com" className="hover:text-white transition-colors">Instagram</Link>
//             <Link href="https://youtube.com" className="hover:text-white transition-colors">Youtube</Link>
//             <Link href="https://linkedin.com" className="hover:text-white transition-colors">LinkedIn</Link>
//             <Link href="https://facebook.com" className="hover:text-white transition-colors">Facebook</Link>
//           </div>

//           <div className="text-center md:text-right">
//             © {currentYear} Taruna Interiors. All rights reserved
//           </div>

//         </div>

//       </footer>
//     </section>
//   );
// }














// 'use client';
// import Link from 'next/link';

// export default function Footer() {
//   const currentYear = new Date().getFullYear();

//   return (
//     // Outer wrapper to provide the white background padding around the "card"
//     <section className="bg-[#000000]">
//       <footer className="relative w-full bg-gradient-to-b from-[#1439df] via-[#0c1f96] to-[#050b33] rounded-t-[2rem] rounded-b-none md:rounded-t-[3rem] overflow-hidden flex flex-col items-center pt-28 md:pt-36 px-6 pb-6 md:pb-8">
        
//         {/* Headline */}
//         <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] font-black text-white text-center leading-[1.1] tracking-tight max-w-4xl z-10 font-sans">
//           Your vision deserves the<br className="hidden md:block"/> right design partner.
//         </h2>

//         {/* Action Button */}
//         <Link 
//           href="#contact" 
//           className="mt-10 md:mt-12 bg-[#e0e0e0] text-[#0f2bb8] text-[13px] md:text-[14px] font-bold uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-white transition-colors duration-300 z-10"
//         >
//           Contact Us
//         </Link>

//         {/* Info Columns */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4 w-full max-w-6xl mt-24 md:mt-32 text-center z-10">
          
//           {/* Contact */}
//           <div className="flex flex-col items-center">
//             <h4 className="text-[10px] md:text-[11px] text-white/70 uppercase tracking-[0.2em] font-semibold mb-4">
//               Contact
//             </h4>
//             <a 
//               href="tel:+919586396373" 
//               className="text-white text-sm md:text-[15px] font-medium underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
//             >
//               +91 95863 96373
//             </a>
//           </div>

//           {/* Email */}
//           <div className="flex flex-col items-center">
//             <h4 className="text-[10px] md:text-[11px] text-white/70 uppercase tracking-[0.2em] font-semibold mb-4">
//               Email
//             </h4>
//             <a 
//               href="mailto:contact@tarunainteriors.com" 
//               className="text-white text-sm md:text-[15px] font-medium underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
//             >
//               contact@tarunainteriors.com
//             </a>
//           </div>

//           {/* Address */}
//           <div className="flex flex-col items-center max-w-[300px] mx-auto">
//             <h4 className="text-[10px] md:text-[11px] text-white/70 uppercase tracking-[0.2em] font-semibold mb-4">
//               Address
//             </h4>
//             <p className="text-white text-sm md:text-[15px] font-medium leading-relaxed">
//               A-68 Laxmi Nagar, Near Pushpa Nagar<br/> 
//               New Sama Road, Sama- Vadodara
//             </p>
//           </div>

//         </div>

//         {/* Giant Background Text */}
//         {/* Using a vertical scale (scale-y-125) to mimic the ultra-condensed heavy font in the reference */}
//           {/* <div className="absolute bottom-10 md:bottom-4 left-0 w-full flex justify-center z-0 pointer-events-none overflow-hidden select-none">
//           <div className="relative flex flex-col items-end top-1">
//             {/* Small top-right "INTERIORS" text */}
//             {/* <span className="text-[6vw] text-white/40 font-black uppercase leading-none tracking-tight text-[3.5vw] md:text-[6.5 vw] pr-[4vw] md:pr-[1vw] mb-1 md:mb-0 z-10">
//               INTERIORS.
//             </span>
//              */}
//             {/* Giant "TARUNA" text */}
//             {/* <h1 className="text-[32vw] md:text-[23vw] font-black leading-[0.75] tracking-tighter bg-gradient-to-b from-white/30 via-white/10 to-transparent bg-clip-text text-transparent transform scale-y-125 scale-x-90 md:scale-x-100 origin-bottom">
//               TARUNA
//             </h1>
//           </div>
//         </div> */}

//         {/* Giant Background Text Group (Stacked & Right-Aligned) */}
//         <div className="absolute bottom-16 md:bottom-12 left-0 w-full flex justify-center z-0 pointer-events-none select-none">
          
//           {/* Main vertical scaling wrapper for the condensed font look.
//               By scaling the PARENT, the gap between children is preserved. */}
//           <div className="flex flex-col items-end transform scale-y-[1.4] scale-x-[1.1] md:scale-x-[1.4] origin-bottom">
            
//             {/* INTERIORS. text - perfectly flush right, large, condensed.
//                 We use mb-[10px] here which will visually become ~14px due to the parent's scale-y[1.4] */}
//             <h3 className="text-[6vw] md:text-[3vw] font-black text-white/60 leading-none tracking-tight mb-[4px] z-10">
//               INTERIORS.
//             </h3>
            
//             {/* TARUNA text - No individual transforms here, it inherits from the parent */}
//             <h1 className="text-[32vw] md:text-[17vw] font-black leading-[0.80] tracking-tighter bg-gradient-to-b from-white/40 via-white/10 to-transparent bg-clip-text text-transparent">
//               TARUNA
//             </h1>
            
//           </div>
//         </div>

//         {/* Bottom Bar (Socials & Copyright) */}
//         <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 mt-32 md:mt-40 z-10 text-[9px] md:text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
          
//           <div className="flex flex-wrap justify-center gap-6 md:gap-8">
//             <Link href="https://instagram.com" className="hover:text-white transition-colors">Instagram</Link>
//             <Link href="https://youtube.com" className="hover:text-white transition-colors">Youtube</Link>
//             <Link href="https://linkedin.com" className="hover:text-white transition-colors">LinkedIn</Link>
//             <Link href="https://facebook.com" className="hover:text-white transition-colors">Facebook</Link>
//           </div>

//           <div className="text-center md:text-right">
//             © {currentYear} Taruna Interiors. All rights reserved
//           </div>

//         </div>

//       </footer>
//     </section>
//   );
// }








// 'use client';
// import Link from 'next/link';
// import { Send, Phone, Mail, MapPin, Twitter, Linkedin } from 'lucide-react';

// export default function Footer() {
//   // Dynamically grab the current year so your copyright is always up to date
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-[#050505] pt-32 pb-12 w-full text-gray-400 border-t border-white/5 relative z-20 overflow-hidden">
      
//       {/* Background Ambient Glow */}
//       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none z-0" />

//       <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 pb-20 border-b border-white/5">
            
//           {/* Column 1: Brand & About */}
//           <div className="lg:col-span-4 flex flex-col space-y-8">
//             <Link href="/" className="flex items-center space-x-3 group cursor-pointer w-fit">
//               <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-blue transition-colors duration-500">
//                 {/* Simplified Logo Icon */}
//                 <svg className="w-5 h-5 text-brand-blue transform group-hover:rotate-180 transition-transform duration-700" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.8l5 4.5V18H7v-7.7l5-4.5z"/>
//                 </svg>
//               </div>
//               <div className="flex items-baseline">
//                 <span className="text-white font-bold text-2xl tracking-tighter">Taruna</span>
//                 <span className="text-brand-blue text-sm ml-1 italic font-serif opacity-80">interiors.</span>
//               </div>
//             </Link>
            
//             <p className="text-[15px] leading-relaxed max-w-[320px] font-light text-gray-500">
//               Redefining the art of living through bespoke interior solutions that harmonize luxury with functionality.
//             </p>
            
//             <div className="flex gap-4">
//               <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 hover:scale-110">
//                 <Twitter className="w-4 h-4 fill-current" />
//               </a>
//               <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 hover:scale-110">
//                 <Linkedin className="w-4 h-4 fill-current" />
//               </a>
//             </div>
//           </div>

//           {/* Column 2: Navigation Links */}
//           <div className="lg:col-span-2 flex flex-col">
//             <h4 className="text-white text-[11px] font-bold tracking-[0.3em] uppercase mb-8">Navigation</h4>
//             <ul className="space-y-4 text-[14px]">
//               {[
//                 { name: 'The Experience', path: '/#why-us' },
//                 { name: 'Bespoke Services', path: '/#services' },
//                 { name: 'Signature Work', path: '/portfolio' },
//                 { name: 'Our Vision', path: '/#about' }
//               ].map((link) => (
//                 <li key={link.name} className="group flex items-center gap-0 hover:gap-3 transition-all duration-300">
//                   <div className="w-0 h-[1px] bg-brand-blue group-hover:w-4 transition-all duration-300" />
//                   <Link href={link.path} className="group-hover:text-white transition-colors">
//                     {link.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Column 3: Contact Info */}
//           <div className="lg:col-span-3 flex flex-col">
//             <h4 className="text-white text-[11px] font-bold tracking-[0.3em] uppercase mb-8">Contact</h4>
//             <div className="space-y-6 text-[14px]">
//               <div className="group flex items-start gap-4">
//                 <Phone className="w-4 h-4 mt-1 text-brand-blue shrink-0" />
//                 <a href="tel:+919586396373" className="group-hover:text-white transition-colors">+91 95863 96373</a>
//               </div>
//               <div className="group flex items-start gap-4">
//                 <Mail className="w-4 h-4 mt-1 text-brand-blue shrink-0" />
//                 <a href="mailto:hello@tarunainterior.com" className="group-hover:text-white transition-colors">hello@tarunainterior.com</a>
//               </div>
//               <div className="group flex items-start gap-4">
//                 <MapPin className="w-4 h-4 mt-1 text-brand-blue shrink-0" />
//                 <p className="leading-relaxed group-hover:text-white transition-colors">
//                   Laxmi Nagar, New Sama, <br /> Vadodara, Gujarat
//                 </p>
//               </div>
//             </div>
//           </div>

//         </div>

//         {/* Watermark Logo */}
//         <div className="pt-20 text-center select-none pointer-events-none opacity-[0.02]">
//           <h2 className="text-[12vw] font-serif font-black tracking-tighter leading-none text-white">TARUNA</h2>
//         </div>

//         {/* Copyright & Legal */}
//         <div className="pt-10 flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-[0.2em] text-gray-600 font-bold">
//           <p>&copy; {currentYear} Taruna Interiors. Designed for Luxury.</p>
//           <div className="flex gap-8 mt-4 md:mt-0">
//             <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
//             <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
//           </div>
//         </div>

//       </div>
      
//       {/* Bottom Accent Line */}
//       <div className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-blue" />
//     </footer>
//   );
// }