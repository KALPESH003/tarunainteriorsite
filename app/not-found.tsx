// app/not-found.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Roboto, Roboto_Condensed } from 'next/font/google';

/* If these fonts are already loaded globally, remove the two loaders and the variables below. */
const cond = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cond',
});
const sans = Roboto({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-sans' });

const COND = { fontFamily: 'var(--font-cond), "Roboto Condensed", sans-serif' };
const SANS = { fontFamily: 'var(--font-sans), Roboto, sans-serif' };

/* =========================================================
   TUNING
========================================================= */
const BG_IMAGE = '/image/background/johannes-sejer-Xn3vcIpPi1E-unsplash.jpg'; // <- your nature / mountain photo (in /public)
const ORANGE = '#FF5C05';
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const INTRO_S = 2.3; // marquee fades in and starts sliding after all the text has appeared
const SLIDE_S = 90; // seconds for the marquee to travel one full loop (higher = slower)
const FALL_MIN = 3.2; // a dropped shape lives 3.2 - 4.0 seconds, then is gone
const FALL_VAR = 0.8;
const MAX_SHAPES = 8;
const COOLDOWN_MS = 350; // stops a flicker when the cursor sits on the edge of the text

const HEADLINE = 'The page you’re looking for has moved, evolved, or no longer exists.'.split(' ');

/* =========================================================
   LOGO: paste your current <svg>...</svg> (the whole thing, unchanged) inside this component
========================================================= */
function Logo() {
  return (
    <svg
      width="72"
      height="33"
      viewBox="0 0 72 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-20 md:w-24"
      aria-label="The Taruna Interior Gallery"
    >
      <path d="M7.69804 7.69609V22.9663H4.10073V7.69609H7.69804ZM11.4002 7.69609V10.5383H0.503414V7.69609H11.4002ZM16.4092 10.9054L13.567 22.9663H9.7075L14.4165 7.69609H16.8287L16.4092 10.9054ZM18.6326 22.9663L15.7904 10.9054L15.3185 7.69609H17.7726L22.4921 22.9663H18.6326ZM18.748 17.2714V20.1136H12.1302V17.2714H18.748ZM22.5823 7.69609H27.8052C28.826 7.69609 29.7105 7.87088 30.4586 8.22048C31.2068 8.57007 31.7801 9.08747 32.1786 9.77267C32.5842 10.4579 32.7869 11.3039 32.7869 12.3107C32.7869 13.1847 32.6751 13.9153 32.4513 14.5027C32.2346 15.09 31.9269 15.5759 31.5284 15.9605C31.1299 16.338 30.6614 16.6492 30.123 16.8939L28.9589 17.5756H24.8582L24.8372 14.7334H27.7213C28.0499 14.7334 28.3226 14.6495 28.5394 14.4817C28.7561 14.3139 28.9169 14.0762 29.0218 13.7685C29.1337 13.4539 29.1896 13.0798 29.1896 12.6463C29.1896 12.2058 29.1372 11.8283 29.0323 11.5136C28.9274 11.199 28.7736 10.9578 28.5708 10.79C28.3751 10.6222 28.1199 10.5383 27.8052 10.5383H26.1691V22.9663H22.5823V7.69609ZM29.3469 22.9663L26.6411 16.2122L30.4377 16.1912L33.196 22.809V22.9663H29.3469ZM40.4178 7.69609H44.0152V18.0895C44.0152 19.2781 43.8019 20.25 43.3754 21.0051C42.9489 21.7532 42.3511 22.3021 41.582 22.6517C40.8129 23.0013 39.9039 23.1761 38.8552 23.1761C37.8134 23.1761 36.9044 23.0013 36.1283 22.6517C35.3522 22.3021 34.744 21.7532 34.3035 21.0051C33.87 20.25 33.6532 19.2781 33.6532 18.0895V7.69609H37.261V18.0895C37.261 18.7188 37.317 19.1977 37.4288 19.5263C37.5477 19.8479 37.726 20.0647 37.9637 20.1766C38.2014 20.2884 38.4986 20.3444 38.8552 20.3444C39.2187 20.3444 39.5159 20.2884 39.7466 20.1766C39.9774 20.0647 40.1452 19.8479 40.25 19.5263C40.3619 19.1977 40.4178 18.7188 40.4178 18.0895V7.69609ZM56.0195 7.69609V22.9663H52.4431L48.6151 13.4644V22.9663H45.0283V7.69609H48.6151L52.4431 17.198V7.69609H56.0195ZM62.9792 10.9054L60.137 22.9663H56.2775L60.9865 7.69609H63.3987L62.9792 10.9054ZM65.2026 22.9663L62.3604 10.9054L61.8884 7.69609H64.3426L69.0621 22.9663H65.2026ZM65.318 17.2714V20.1136H58.7002V17.2714H65.318Z" fill="white"/>
      <path d="M2.56601 0.909926V6H1.36691V0.909926H2.56601ZM3.80008 0.909926V1.85732H0.167805V0.909926H3.80008ZM6.82615 2.93057V3.87447H4.76355V2.93057H6.82615ZM5.1551 0.909926V6H3.95949V0.909926H5.1551ZM7.63371 0.909926V6H6.4381V0.909926H7.63371ZM10.9709 5.0561V6H8.74402V5.0561H10.9709ZM9.16004 0.909926V6H7.96443V0.909926H9.16004ZM10.6808 2.93057V3.84301H8.74402V2.93057H10.6808ZM10.9814 0.909926V1.85732H8.74402V0.909926H10.9814Z" fill="white"/>
      <path d="M1.59764 25.3721V30.4622H0.405528V25.3721H1.59764ZM5.65851 25.3721V30.4622H4.4664L3.19039 27.2948V30.4622H1.99478V25.3721H3.19039L4.4664 28.5394V25.3721H5.65851ZM8.11475 25.3721V30.4622H6.91565V25.3721H8.11475ZM9.34882 25.3721V26.3195H5.71654V25.3721H9.34882ZM12.5147 29.5183V30.4622H10.2878V29.5183H12.5147ZM10.7038 25.3721V30.4622H9.50823V25.3721H10.7038ZM12.2246 27.3927V28.3052H10.2878V27.3927H12.2246ZM12.5252 25.3721V26.3195H10.2878V25.3721H12.5252ZM12.6497 25.3721H14.3906C14.7309 25.3721 15.0257 25.4303 15.2751 25.5469C15.5245 25.6634 15.7156 25.8359 15.8484 26.0643C15.9836 26.2927 16.0512 26.5747 16.0512 26.9103C16.0512 27.2016 16.0139 27.4452 15.9393 27.6409C15.8671 27.8367 15.7645 27.9987 15.6317 28.1269C15.4989 28.2527 15.3427 28.3564 15.1632 28.438L14.7752 28.6653H13.4083L13.4013 27.7179H14.3627C14.4722 27.7179 14.5631 27.6899 14.6354 27.634C14.7076 27.578 14.7612 27.4988 14.7962 27.3962C14.8335 27.2913 14.8521 27.1667 14.8521 27.0222C14.8521 26.8753 14.8346 26.7495 14.7997 26.6446C14.7647 26.5397 14.7134 26.4593 14.6458 26.4034C14.5806 26.3474 14.4955 26.3195 14.3906 26.3195H13.8453V30.4622H12.6497V25.3721ZM14.9045 30.4622L14.0026 28.2108L15.2681 28.2038L16.1876 30.4097V30.4622H14.9045ZM17.602 25.3721V30.4622H16.4099V25.3721H17.602ZM21.6978 27.5361V28.3052C21.6978 28.6711 21.6524 28.9927 21.5615 29.27C21.4706 29.5474 21.3413 29.7805 21.1734 29.9692C21.0056 30.1557 20.8064 30.2967 20.5756 30.3922C20.3472 30.4855 20.0932 30.5321 19.8135 30.5321C19.5315 30.5321 19.2752 30.4855 19.0444 30.3922C18.8137 30.2967 18.6144 30.1557 18.4466 29.9692C18.2788 29.7805 18.1495 29.5474 18.0586 29.27C17.9677 28.9927 17.9222 28.6711 17.9222 28.3052V27.5361C17.9222 27.1702 17.9677 26.8474 18.0586 26.5677C18.1495 26.288 18.2777 26.055 18.4431 25.8685C18.6109 25.6821 18.8102 25.5411 19.0409 25.4455C19.2717 25.3499 19.528 25.3022 19.81 25.3022C20.0897 25.3022 20.3449 25.3499 20.5756 25.4455C20.8087 25.5411 21.008 25.6821 21.1734 25.8685C21.3389 26.055 21.4671 26.288 21.558 26.5677C21.6512 26.8474 21.6978 27.1702 21.6978 27.5361ZM20.4848 28.3052V27.5291C20.4848 27.3007 20.4708 27.1061 20.4428 26.9453C20.4148 26.7844 20.3729 26.6539 20.3169 26.5537C20.261 26.4535 20.1911 26.3801 20.1072 26.3335C20.0233 26.2869 19.9242 26.2635 19.81 26.2635C19.6912 26.2635 19.5898 26.2869 19.5059 26.3335C19.422 26.3801 19.3521 26.4535 19.2961 26.5537C19.2425 26.6539 19.2029 26.7844 19.1773 26.9453C19.1516 27.1061 19.1388 27.3007 19.1388 27.5291V28.3052C19.1388 28.5312 19.1516 28.7247 19.1773 28.8855C19.2029 29.044 19.2425 29.1745 19.2961 29.277C19.3521 29.3796 19.4232 29.4553 19.5094 29.5043C19.5956 29.5509 19.697 29.5742 19.8135 29.5742C19.9254 29.5742 20.0233 29.5509 20.1072 29.5043C20.1934 29.4553 20.2633 29.3796 20.3169 29.277C20.3729 29.1745 20.4148 29.044 20.4428 28.8855C20.4708 28.7247 20.4848 28.5312 20.4848 28.3052ZM21.9656 25.3721H23.7066C24.0469 25.3721 24.3417 25.4303 24.5911 25.5469C24.8404 25.6634 25.0316 25.8359 25.1644 26.0643C25.2996 26.2927 25.3672 26.5747 25.3672 26.9103C25.3672 27.2016 25.3299 27.4452 25.2553 27.6409C25.183 27.8367 25.0805 27.9987 24.9477 28.1269C24.8148 28.2527 24.6587 28.3564 24.4792 28.438L24.0912 28.6653H22.7242L22.7173 27.7179H23.6786C23.7882 27.7179 23.8791 27.6899 23.9513 27.634C24.0236 27.578 24.0772 27.4988 24.1121 27.3962C24.1494 27.2913 24.1681 27.1667 24.1681 27.0222C24.1681 26.8753 24.1506 26.7495 24.1156 26.6446C24.0807 26.5397 24.0294 26.4593 23.9618 26.4034C23.8965 26.3474 23.8115 26.3195 23.7066 26.3195H23.1612V30.4622H21.9656V25.3721ZM24.2205 30.4622L23.3186 28.2108L24.5841 28.2038L25.5035 30.4097V30.4622H24.2205ZM30.5488 27.7423V29.8679C30.4696 29.9448 30.3531 30.0357 30.1992 30.1405C30.0454 30.2454 29.852 30.3375 29.6189 30.4167C29.3882 30.4936 29.1155 30.5321 28.8009 30.5321C28.5095 30.5321 28.2473 30.4878 28.0143 30.3992C27.7812 30.3107 27.582 30.1767 27.4165 29.9972C27.2533 29.8154 27.1275 29.5882 27.0389 29.3155C26.9504 29.0405 26.9061 28.7154 26.9061 28.3401V27.4976C26.9061 27.1247 26.9504 26.7996 27.0389 26.5222C27.1298 26.2449 27.2568 26.0165 27.42 25.837C27.5831 25.6576 27.7766 25.5236 28.0003 25.435C28.224 25.3441 28.4722 25.2987 28.7449 25.2987C29.1528 25.2987 29.4872 25.3674 29.7483 25.5049C30.0116 25.6424 30.2086 25.8405 30.3391 26.0992C30.4696 26.3556 30.5383 26.6667 30.5453 27.0327H29.3987C29.3893 26.8392 29.3614 26.6842 29.3148 26.5677C29.2682 26.4512 29.2017 26.3684 29.1155 26.3195C29.0293 26.2682 28.9197 26.2426 28.7869 26.2426C28.6797 26.2426 28.5841 26.2635 28.5002 26.3055C28.4186 26.3474 28.3487 26.4174 28.2905 26.5153C28.2345 26.6108 28.1914 26.739 28.1611 26.8998C28.1331 27.0606 28.1192 27.2576 28.1192 27.4906V28.3401C28.1192 28.5709 28.1331 28.7666 28.1611 28.9274C28.1891 29.0883 28.2322 29.2164 28.2905 29.312C28.3487 29.4076 28.4268 29.4775 28.5247 29.5218C28.6226 29.566 28.7438 29.5882 28.8883 29.5882C28.9768 29.5882 29.0502 29.5765 29.1085 29.5532C29.1668 29.5299 29.2157 29.5031 29.2553 29.4728C29.295 29.4425 29.3276 29.4215 29.3532 29.4099V28.5848H28.7449V27.7423H30.5488ZM32.7604 26.4418L31.813 30.4622H30.5265L32.0961 25.3721H32.9002L32.7604 26.4418ZM33.5015 30.4622L32.5541 26.4418L32.3968 25.3721H33.2148L34.788 30.4622H33.5015ZM33.5399 28.5639V29.5113H31.334V28.5639H33.5399ZM37.7302 29.5183V30.4622H35.5907V29.5183H37.7302ZM36.0102 25.3721V30.4622H34.8146V25.3721H36.0102ZM40.8052 29.5183V30.4622H38.6657V29.5183H40.8052ZM39.0852 25.3721V30.4622H37.8896V25.3721H39.0852ZM43.9711 29.5183V30.4622H41.7442V29.5183H43.9711ZM42.1602 25.3721V30.4622H40.9646V25.3721H42.1602ZM43.6809 27.3927V28.3052H41.7442V27.3927H43.6809ZM43.9816 25.3721V26.3195H41.7442V25.3721H43.9816ZM44.106 25.3721H45.847C46.1873 25.3721 46.4821 25.4303 46.7315 25.5469C46.9809 25.6634 47.172 25.8359 47.3048 26.0643C47.44 26.2927 47.5076 26.5747 47.5076 26.9103C47.5076 27.2016 47.4703 27.4452 47.3957 27.6409C47.3235 27.8367 47.2209 27.9987 47.0881 28.1269C46.9552 28.2527 46.7991 28.3564 46.6196 28.438L46.2316 28.6653H44.8647L44.8577 27.7179H45.8191C45.9286 27.7179 46.0195 27.6899 46.0917 27.634C46.164 27.578 46.2176 27.4988 46.2525 27.3962C46.2898 27.2913 46.3085 27.1667 46.3085 27.0222C46.3085 26.8753 46.291 26.7495 46.256 26.6446C46.2211 26.5397 46.1698 26.4593 46.1022 26.4034C46.037 26.3474 45.9519 26.3195 45.847 26.3195H45.3017V30.4622H44.106V25.3721ZM46.3609 30.4622L45.459 28.2108L46.7245 28.2038L47.6439 30.4097V30.4622H46.3609ZM48.6144 25.3721L49.2681 27.5815L49.9254 25.3721H51.2084L49.8799 28.6338V30.4622H48.6633V28.6338L47.3314 25.3721H48.6144Z" fill="white"/>
      <path d="M51.3719 30.2401V29.3666H52.2454V30.2401H51.3719Z" fill="#FF5C05"/>
      <path d="M12.0851 5.96631L68.6134 5.96642C69.9315 5.96642 71 7.03492 71 8.35298V29.8319C71 31.1499 69.9315 32.2184 68.6134 32.2184H0" stroke="white" stroke-width="0.477311"/>
    </svg>
  );
}

/* =========================================================
   MARQUEE PIECES
========================================================= */
function Star() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="block h-[5vw] w-[5vw]" fill="currentColor">
      <rect x="42" y="2" width="16" height="96" rx="2" />
      <rect x="42" y="2" width="16" height="96" rx="2" transform="rotate(60 50 50)" />
      <rect x="42" y="2" width="16" height="96" rx="2" transform="rotate(120 50 50)" />
    </svg>
  );
}

function Item() {
  return (
    <span className="inline-flex shrink-0 items-center">
      <span>PAGE NOT FOUND</span>
      <span className="mx-[7vw] inline-flex">
        <Star />
      </span>
    </span>
  );
}

/* =========================================================
   FALLING SHAPES
========================================================= */
type Kind = 'circle' | 'ring' | 'square' | 'triangle' | 'diamond' | 'cross' | 'half' | 'hexagon';
const KINDS: Kind[] = ['circle', 'ring', 'square', 'triangle', 'diamond', 'cross', 'half', 'hexagon'];
const COLORS = [ORANGE, '#f3f3f3', '#f3f3f3', ORANGE, '#8a8a8a'];

type Drop = {
  id: number;
  kind: Kind;
  color: string;
  filled: boolean;
  size: number;
  x: number;
  y: number;
  dist: number;
  drift: number;
  rot: number;
  dur: number;
};

function ShapeSvg({ kind, color, filled }: { kind: Kind; color: string; filled: boolean }) {
  const paint = filled
    ? { fill: color }
    : { fill: 'none', stroke: color, strokeWidth: 3.5, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 64 64" className="block h-full w-full" aria-hidden="true">
      {kind === 'circle' && <circle cx="32" cy="32" r="26" {...paint} />}
      {kind === 'ring' && <circle cx="32" cy="32" r="24" fill="none" stroke={color} strokeWidth="6" />}
      {kind === 'square' && <rect x="9" y="9" width="46" height="46" rx="4" {...paint} />}
      {kind === 'triangle' && <polygon points="32,7 58,56 6,56" {...paint} />}
      {kind === 'diamond' && <polygon points="32,4 60,32 32,60 4,32" {...paint} />}
      {kind === 'cross' && <path d="M26 6h12v20h20v12H38v20H26V38H6V26h20z" {...paint} />}
      {kind === 'half' && <path d="M6 42a26 26 0 0 1 52 0z" {...paint} />}
      {kind === 'hexagon' && <polygon points="32,5 55,18.5 55,45.5 32,59 9,45.5 9,18.5" {...paint} />}
    </svg>
  );
}

/* =========================================================
   PAGE
========================================================= */
export default function NotFound() {
  const reduce = useReducedMotion();
  const k = reduce ? 0 : 1;

  const panelRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const lastRef = useRef(0);
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  /* Fires once each time the cursor ENTERS the sliding text. A cursor resting on the text while it
     slides by does nothing; the person has to leave and hover again for the next shape. */
  const onEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const now = performance.now();
      if (reduce || now - lastRef.current < COOLDOWN_MS) return;
      const panel = panelRef.current;
      const band = bandRef.current;
      if (!panel || !band) return;
      lastRef.current = now;

      const p = panel.getBoundingClientRect();
      const b = band.getBoundingClientRect();
      const size = 28 + Math.random() * 44;
      const x = Math.min(p.width - 50, Math.max(50, e.clientX - p.left));
      const y = b.top - p.top + b.height * 0.5;

      const drop: Drop = {
        id: ++idRef.current,
        kind: KINDS[Math.floor(Math.random() * KINDS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        filled: Math.random() > 0.4,
        size,
        x,
        y,
        dist: p.height - y + size,
        drift: (Math.random() - 0.5) * 140,
        rot: (Math.random() - 0.5) * 300,
        dur: FALL_MIN + Math.random() * FALL_VAR,
      };
      setDrops((d) => [...d.slice(-(MAX_SHAPES - 1)), drop]);
    },
    [reduce],
  );

  const remove = (id: number) => setDrops((d) => d.filter((x) => x.id !== id));

  const textFade = 'linear-gradient(to bottom, #000 30%, transparent 92%)';

  return (
    <section
      aria-label="Page not found"
      className={`${cond.variable} ${sans.variable} fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-[#0a0c0b] text-[#e0e0e0] selection:bg-[#FF5C05] selection:text-white`}
    >
      {/* Photo layer: heavily blurred, slowly drifting and breathing so the area around the black card feels alive */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-[12%] will-change-transform"
        style={{
          background: `url("${BG_IMAGE}") center / cover no-repeat, linear-gradient(160deg, #6f7b7a 0%, #3b4a3a 55%, #5a4a22 100%)`,
          filter: 'blur(26px) saturate(1.1)',
        }}
        animate={
          reduce
            ? undefined
            : {
                scale: [1.08, 1.24, 1.08],
                x: ['-3%', '3%', '-3%'],
                y: ['-2%', '2.5%', '-2%'],
                rotate: [0, 1.2, 0],
              }
        }
        transition={{ duration: 48, ease: 'easeInOut', repeat: Infinity }}
      />

      {/* Black card */}
      <div
        ref={panelRef}
        className="absolute inset-x-3 inset-y-3 overflow-hidden rounded-[22px] bg-black md:bottom-[25px] md:left-5 md:right-5 md:top-[25px] md:rounded-[28px]"
        style={{ boxShadow: '0 0 70px rgba(0,0,0,0.45)' }}
      >
        {/* Logo */}
        <motion.div
          className="absolute left-7 top-7 z-30 md:left-11 md:top-8"
          initial={k ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <Logo />
        </motion.div>

        {/* 404 */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[9%] z-0 flex justify-center"
          initial={k ? { opacity: 0, y: 40, filter: 'blur(14px)' } : false}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: EASE, delay: 0.2 }}
        >
          <span
            className="select-none font-black italic leading-[0.8] tracking-[-0.02em] text-white/[0.06]"
            style={{
              ...COND,
              fontSize: '26vw',
              WebkitMaskImage: textFade,
              maskImage: textFade,
            }}
          >
            404
          </span>
        </motion.div>

        {/* Sliding PAGE NOT FOUND band: appears last, then loops forever */}
        <motion.div
          ref={bandRef}
          onPointerEnter={onEnter}
          className="absolute inset-x-0 top-[49%] z-[1] overflow-hidden"
          style={{ WebkitMaskImage: textFade, maskImage: textFade }}
          initial={k ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: k ? INTRO_S : 0 }}
        >
          <motion.div
            className="flex w-max select-none whitespace-nowrap font-black italic leading-[0.95] tracking-[0.01em] text-white/[0.05] will-change-transform"
            style={{ ...COND, fontSize: '14vw' }}
            animate={reduce ? undefined : { x: ['0%', '-50%'] }}
            transition={{ duration: SLIDE_S, ease: 'linear', repeat: Infinity, delay: INTRO_S }}
          >
            {/* Two identical groups; sliding exactly -50% makes the loop seamless */}
            <div className="flex shrink-0" aria-hidden="true">
              <Item />
              <Item />
            </div>
            <div className="flex shrink-0" aria-hidden="true">
              <Item />
              <Item />
            </div>
          </motion.div>
        </motion.div>

        {/* Falling shapes: drop from the text to the bottom of the card, then fade out */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
          <AnimatePresence>
            {drops.map((d) => (
              <motion.div
                key={d.id}
                className="absolute will-change-transform"
                style={{ left: d.x - d.size / 2, top: d.y - d.size / 2, width: d.size, height: d.size }}
                initial={{ opacity: 0, y: 0, x: 0, scale: 0.6, rotate: 0 }}
                animate={{ opacity: [0, 1, 1, 0], y: d.dist, x: d.drift, scale: 1, rotate: d.rot }}
                transition={{
                  opacity: { duration: d.dur, times: [0, 0.1, 0.62, 1], ease: 'linear' },
                  y: { duration: d.dur, ease: [0.45, 0, 0.35, 1] },
                  x: { duration: d.dur, ease: [0.3, 0, 0.3, 1] },
                  rotate: { duration: d.dur, ease: [0.3, 0, 0.3, 1] },
                  scale: { duration: 0.9, ease: EASE },
                }}
                onAnimationComplete={() => remove(d.id)}
              >
                <ShapeSvg kind={d.kind} color={d.color} filled={d.filled} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Message + button */}
        <div className="absolute inset-x-0 bottom-[13%] z-10 flex flex-col items-center px-6 text-center md:bottom-[11%]">
          <h1
            aria-label="The page you’re looking for has moved, evolved, or no longer exists."
            className="flex max-w-[900px] flex-wrap justify-center gap-x-[0.3em] text-xl font-bold leading-[1.2] text-white md:text-[26px]"
            style={COND}
          >
            {HEADLINE.map((w, i) => (
              <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.1em]">
                <motion.span
                  className="inline-block will-change-transform"
                  initial={k ? { y: '110%' } : false}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.7 + i * 0.05 }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-2 text-[13px] font-normal tracking-[0.03em] text-[#9a9a9a] md:text-sm"
            style={SANS}
            initial={k ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.4 }}
          >
            Let’s get you back to where ideas take shape.
          </motion.p>

          <motion.div
            className="mt-7"
            initial={k ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.6 }}
          >
            {/* Flat button: no hover movement, colour change or underline */}
            <Link
              href="/"
              className="inline-flex h-[50px] min-w-[206px] items-center justify-center rounded-lg bg-[#FF5C05] px-9 text-[15px] font-bold uppercase tracking-wide text-white outline-none [text-decoration:none] hover:[text-decoration:none] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={COND}
            >
              Return Home
            </Link>
          </motion.div>
        </div>

        {/* Bottom right label */}
        <motion.p
          className="pointer-events-none absolute bottom-6 right-7 z-10 text-right text-xs font-black uppercase leading-tight tracking-[0.2em] text-[#333] md:bottom-8 md:right-10 md:text-sm"
          style={COND}
          initial={k ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 1.8 }}
        >
          UNCHARTED
          <br />
          TERRITORY
        </motion.p>
      </div>
    </section>
  );
}