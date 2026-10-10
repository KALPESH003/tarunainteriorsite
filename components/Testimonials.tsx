'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

type Platform = 'instagram' | 'discord' | 'telegram' | 'facebook' | 'linkedin';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  initial: string;
  platform: Platform;
}

/* =========================================================
   CONTENT — edit names / roles / quotes / platforms here
========================================================= */

const row1: Testimonial[] = [
  {
    id: 1,
    quote:
      'Their strategic approach to our architecture saved us months of development time. I cannot recommend their technical expertise enough.',
    name: 'Rohan Sharma',
    role: 'Founder, Prestige Golfshire',
    initial: 'R',
    platform: 'discord',
  },
  {
    id: 2,
    quote:
      'Super supportive, transparent, and easy to work with. They made the entire design process smooth and enjoyable.',
    name: 'Kavita Iyer',
    role: 'Product Lead, FinEdge',
    initial: 'K',
    platform: 'instagram',
  },
  {
    id: 3,
    quote:
      'Working with the team was an absolute game-changer. They delivered a high-quality product ahead of schedule with flawless execution.',
    name: 'Siddharth Roy',
    role: 'CEO, Apex Digital Studios',
    initial: 'S',
    platform: 'telegram',
  },
];

const row2: Testimonial[] = [
  {
    id: 4,
    quote:
      'Their deep expertise saved us months of hassle. Working with them was the best decision we made.',
    name: 'Devendra Patel',
    role: 'MD, Zenith Logistics',
    initial: 'D',
    platform: 'instagram',
  },
  {
    id: 5,
    quote:
      'They completely transformed our home ahead of schedule with flawless execution. An absolute game-changer!',
    name: 'Ananya Mehta',
    role: 'Operations Head, Horizon Workspace',
    initial: 'A',
    platform: 'facebook',
  },
  {
    id: 6,
    quote:
      'Innovative, creative, and highly capable. They are our go-to team for all design projects.',
    name: 'Priya Nair',
    role: 'Lead Architect, Urban Nest',
    initial: 'P',
    platform: 'linkedin',
  },
];

/* =========================================================
   STYLE + MOTION SETTINGS
========================================================= */

const CONDENSED = '"Roboto Condensed", sans-serif';

const TAB_IMAGE = '/metaltexture.png';
const TAB_SCALE = 0.85; // 1 = current size, 0.75 = smaller, 0.6 = much smaller
const TAB_SRC_WIDTH = 530; // width of the PNG in px
const TAB_SLICE = 150; // px at the top and bottom of the PNG that are never stretched (corner + notch)
const TAB_CAP = `calc(${TAB_SLICE} / ${TAB_SRC_WIDTH} * 100cqw)`; // same cap size on screen

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, amount: 0.2, margin: '0px 0px -8% 0px' } as const;

/* =========================================================
   SOCIAL ICONS (one per testimonial)
========================================================= */

function SocialIcon({ platform }: { platform: Platform }) {
  const cls = 'h-[25px] w-[25px]';

  switch (platform) {
    case 'instagram':
      return (
        <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <linearGradient id="tz-ig" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FEDA75" />
              <stop offset="0.25" stopColor="#FA7E1E" />
              <stop offset="0.5" stopColor="#D62976" />
              <stop offset="0.75" stopColor="#962FBF" />
              <stop offset="1" stopColor="#4F5BD5" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill="url(#tz-ig)" />
          <rect x="5.5" y="5.5" width="13" height="13" rx="4" fill="none" stroke="#fff" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" strokeWidth="1.7" />
          <circle cx="16.2" cy="7.8" r="0.95" fill="#fff" />
        </svg>
      );

    case 'discord':
      return (
        <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="6" fill="#5865F2" />
          <g transform="translate(4.5 4.5) scale(0.625)" fill="#fff">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
          </g>
        </svg>
      );

    case 'telegram':
      return (
        <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#2AABEE"
            d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
          />
        </svg>
      );

    case 'facebook':
      return (
        <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="5" fill="#1877F2" />
          <path
            fill="#fff"
            d="M16.5 24v-9.3h3.1l.5-3.7h-3.6V8.7c0-1.1.3-1.8 1.8-1.8h1.9V3.6c-.3 0-1.5-.1-2.8-.1-2.8 0-4.6 1.7-4.6 4.7V11H9.7v3.7h3.1V24h3.7z"
          />
        </svg>
      );

    case 'linkedin':
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="#0077b5" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
  }
}

/* =========================================================
   CARD
========================================================= */

function TestimonialCard({ data, tabbable }: { data: Testimonial; tabbable: boolean }) {
  return (
    <motion.div
      tabIndex={tabbable ? 0 : -1}
      whileHover="hover"
      whileFocus="hover"
      initial="rest"
      animate="rest"
      className="group relative flex h-[237px] w-[320px] shrink-0 flex-col justify-between overflow-hidden rounded-[22px] border bg-white px-8 py-7 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:w-[405px] md:px-[49px] md:py-[36px]"
      variants={{
        rest: {
          y: 0,
          boxShadow: '0 14px 44px -10px rgba(0,0,0,0.13)',
          borderColor: 'rgb(241 241 241)',
        },
        hover: {
          y: -6,
          boxShadow: '0 26px 56px -12px rgba(0,0,0,0.22)',
          borderColor: 'rgb(229 231 235)',
          transition: { duration: 0.45, ease: EASE },
        },
      }}
    >
      <p
        className="relative z-10 text-justify text-[14px] leading-[1.15] text-[#555] md:text-[15px]"
        style={{ fontFamily: CONDENSED, hyphens: 'none' }}
      >
        &ldquo;{data.quote}&rdquo;
      </p>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-[18px]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ececec] bg-[#f4f4f5] text-[16px] font-medium text-[#6b7280]">
            {data.initial}
          </div>

          <div className="flex flex-col">
            <span className="text-[14.5px] font-medium leading-[1.2] text-[#1a1a1a]">
              {data.name}
            </span>
            <span className="mt-0.5 text-[12.5px] leading-[1.35] text-[#6b7280]">{data.role}</span>
          </div>
        </div>

        <motion.div
          className="shrink-0"
          variants={{
            rest: { scale: 1, opacity: 0.95 },
            hover: { scale: 1.12, opacity: 1, transition: { duration: 0.35, ease: EASE } },
          }}
        >
          <SocialIcon platform={data.platform} />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Testimonials() {
  const reduce = useReducedMotion();
  const d = (px: number) => (reduce ? 0 : px);

  const headerV: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };
  const fadeV: Variants = {
    hidden: { opacity: 0, y: d(12) },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };
  const lineV: Variants = {
    hidden: { y: reduce ? '0%' : '110%', opacity: reduce ? 0 : 1 },
    show: { y: '0%', opacity: 1, transition: { duration: 1, ease: EASE } },
  };
  const ruleV: Variants = {
    hidden: { scaleX: reduce ? 1 : 0, opacity: reduce ? 0 : 0.9 },
    show: { scaleX: 1, opacity: 1, transition: { duration: 1.2, ease: EASE } },
  };
  const tabV: Variants = {
    hidden: { opacity: 0, x: d(-40) },
    show: { opacity: 1, x: 0, transition: { duration: 1.1, ease: EASE } },
  };
  const marqueeV: Variants = {
    hidden: { opacity: 0, y: d(24) },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE, delay: reduce ? 0 : 0.2 } },
  };

  const ghostMask = 'linear-gradient(to bottom, #000 35%, transparent 80%)';

  return (
    <section className="relative z-10 w-full overflow-hidden bg-white pb-16 text-black md:pb-[4.6vw]">
      {/* Seamless native marquee animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-33.3333%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 90s linear infinite;
          width: max-content;
        }
        .animate-scroll-right {
          animation: scroll-right 90s linear infinite;
          width: max-content;
        }
        @media (max-width: 767px) {
          .animate-scroll-left { animation-duration: 46s; }
          .animate-scroll-right { animation-duration: 46s; }
        }
        .mask-edges {
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
        @media (min-width: 768px) {
          .mask-edges {
            mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-left, .animate-scroll-right {
            animation-play-state: paused;
          }
        }
      `,
        }}
      />

   {/* Huge ghost word behind the header, fading out downward */}
      <motion.div
        initial={{ opacity: 0, y: d(30) }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.6, ease: EASE }}
        className="pointer-events-none absolute top-[2.5vw] left-[-24vw] z-0 flex select-none whitespace-nowrap font-black italic leading-none"
        style={{
          fontFamily: CONDENSED,
          fontSize: '15.5vw', // MATCHED EXACTLY to previous section
          color: '#e6e6e6',
          maskImage: ghostMask,
          WebkitMaskImage: ghostMask,
        }}
      >
        APPRECIATION”
      </motion.div>

      {/* ===================== HEADER ===================== */}
      <div className="relative z-10 h-[max(110px,12.78vw)] w-full">
        <motion.div
          variants={headerV}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="absolute z-10"
          style={{ right: 32, top: 40 }} // MATCHED position structure, placed on right
        >
          <h2
            className="relative whitespace-nowrap font-bold uppercase text-[#1a1a1a] text-right"
            style={{
              fontFamily: CONDENSED,
              fontSize: 64, // MATCHED EXACTLY
              lineHeight: 1.05, // MATCHED EXACTLY
              letterSpacing: '-0.01em', // MATCHED EXACTLY
            }}
          >
            {/* Absolute Positioned [05] Tag relative to the H2 text */}
            <motion.span
              variants={fadeV}
              className="absolute text-[13px] font-medium leading-none text-black"
              style={{
                fontFamily: CONDENSED,
                left: -45, // Adjusted to sit cleanly to the left of "CLIENT"
                top: 5, // MATCHED EXACTLY
                letterSpacing: '-0.02em',
              }}
            >
              [05]
            </motion.span>

            {['CLIENT', 'SAYS'].map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span variants={lineV} className="block will-change-transform">
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>
        </motion.div>
      </div>

      {/* ===================== TAB + MARQUEE ===================== */}
      {/* FIXED: Changed mt-[3.7vw] to mt-2 md:mt-4 to pull the slider up tightly against the header */}
      <div
        className="relative z-10 mt-2 md:mt-4"
        style={{ '--tab-end': `calc(2.25vw + 9.4vw * ${TAB_SCALE})` } as React.CSSProperties}
      >
      </div>

      {/* ===================== TAB + MARQUEE ===================== */}
     <div
  className="relative z-10 mt-8 md:mt-[3.7vw]"
  style={{ '--tab-end': `calc(2.25vw + 9.4vw * ${TAB_SCALE})` } as React.CSSProperties}
>
        {/* Vertical TESTIMONIALS tab with flared (inverted-radius) corners */}
                {/* Brushed-metal tab (PNG) with engraved TESTIMONIALS */}
        <motion.div
          variants={tabV}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        className="pointer-events-none absolute left-[2.25vw] z-10 hidden md:block"
        style={
          {
            containerType: 'size',
            width: `calc(9.4vw * ${TAB_SCALE})`,
            top: `calc(${((1 - TAB_SCALE) / 2) * 100}% - 0.45vw)`,
            bottom: `calc(${((1 - TAB_SCALE) / 2) * 100}% - 0.45vw)`,
          } as React.CSSProperties
        }>
          {/* Metal: top/bottom caps keep their shape, the middle stretches to the card height */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              borderStyle: 'solid',
              borderColor: 'transparent',
              borderWidth: `${TAB_CAP} 0`,
              borderImageSource: `url("${TAB_IMAGE}")`,
              borderImageSlice: `${TAB_SLICE} 0 fill`,
              borderImageWidth: `${TAB_CAP} 0`,
              borderImageRepeat: 'stretch',
            }}
          />

          {/* Engraved lettering (centred on the metal body, sized from the tab height) */}
          <div
            className="absolute inset-y-0 left-0 flex items-center justify-center"
            style={{ width: '75.5%' }}
          >
            <span
              className="whitespace-nowrap font-black uppercase leading-none"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                fontFamily: CONDENSED,
                fontSize: '13.6cqh',
                color: 'rgba(14,14,14,0.62)',
                /* rotated 180°, so offsets are flipped: light lip below the letters, dark lip above */
                textShadow: '0 -1px 0 rgba(255,255,255,0.38), 0 1px 0 rgba(0,0,0,0.45)',
              }}
            >
              Testimonials
            </span>
          </div>
        </motion.div>

        {/* Dual infinite marquee (extra vertical padding keeps card shadows from being clipped) */}
        <motion.div
          variants={marqueeV}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mask-edges relative -my-10 flex flex-col gap-4 overflow-hidden py-10 md:ml-[var(--tab-end)] md:gap-[29px]"
        >
          {/* Row 1 — moves left */}
          <div className="animate-scroll-left flex gap-4 md:gap-[26px] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
            {/* Triplicated for seamless looping; only the middle copy is keyboard-reachable */}
            {[...row1, ...row1, ...row1].map((t, idx) => (
              <TestimonialCard
                key={`r1-${t.id}-${idx}`}
                data={t}
                tabbable={idx >= row1.length && idx < row1.length * 2}
              />
            ))}
          </div>

          {/* Row 2 — moves right */}
          <div className="animate-scroll-right flex gap-4 md:gap-[26px] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
            {[...row2, ...row2, ...row2].map((t, idx) => (
              <TestimonialCard
                key={`r2-${t.id}-${idx}`}
                data={t}
                tabbable={idx >= row2.length && idx < row2.length * 2}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}






// 'use client';

// import React from 'react';
// import { motion, useReducedMotion, type Variants } from 'framer-motion';

// interface Testimonial {
//   id: number;
//   quote: string;
//   name: string;
//   role: string;
//   initial: string;
// }

// const row1: Testimonial[] = [
//   {
//     id: 1,
//     quote:
//       'Their strategic approach to our architecture saved us months of development time. I cannot recommend their technical expertise enough.',
//     name: 'James Wilson',
//     role: 'Product Lead, FinEdge',
//     initial: 'J',
//   },
//   {
//     id: 2,
//     quote:
//       'Working with the team was an absolute game-changer. They delivered a high-quality product ahead of schedule with flawless execution.',
//     name: 'Sarah Jenkins',
//     role: 'CEO, TechFlow',
//     initial: 'S',
//   },
//   {
//     id: 3,
//     quote:
//       'The level of support and communication throughout the entire design process was amazing. We felt valued and heard at every single step.',
//     name: 'Michael Chang',
//     role: 'Founder, Apex Web',
//     initial: 'M',
//   },
// ];

// const row2: Testimonial[] = [
//   {
//     id: 4,
//     quote:
//       'We were completely blown away by the level of support and communication. The entire design process was amazing.',
//     name: 'Rahul Rao',
//     role: 'Operations Manager, GXP Solutions',
//     initial: 'R',
//   },
//   {
//     id: 5,
//     quote:
//       'Innovative, strategic, and highly capable. They have officially become our go-to partners for all digital transformation initiatives.',
//     name: 'Emily Chen',
//     role: 'Director, CloudSync',
//     initial: 'E',
//   },
//   {
//     id: 6,
//     quote:
//       'Incredible dedication from the team. They went above and beyond our expectations. The launch was a success across all metrics.',
//     name: 'Anita Desai',
//     role: 'CMO, Bloom Retail',
//     initial: 'A',
//   },
// ];

// /* =========================================================
//    MOTION SETTINGS  (tweak these to change the feel)
// ========================================================= */

// const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
// const VIEWPORT = { once: true, amount: 0.2, margin: '0px 0px -8% 0px' } as const;

// /* =========================================================
//    LINKEDIN ICON
// ========================================================= */

// function LinkedInIcon() {
//   return (
//     <svg className="h-5 w-5 text-[#0077b5]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
//       <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//     </svg>
//   );
// }

// /* =========================================================
//    CARD
// ========================================================= */

// function TestimonialCard({ data, tabbable }: { data: Testimonial; tabbable: boolean }) {
//   return (
//     <motion.div
//       tabIndex={tabbable ? 0 : -1}
//       whileHover="hover"
//       whileFocus="hover"
//       initial="rest"
//       animate="rest"
//       className="group relative flex h-[240px] w-[320px] shrink-0 flex-col justify-between overflow-hidden rounded-[20px] border border-gray-100 bg-white p-8 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:w-[380px]"
//       variants={{
//         rest: { y: 0, boxShadow: '0 0px 0px rgba(0,0,0,0)', borderColor: 'rgb(243 244 246)' },
//         hover: {
//           y: -6,
//           boxShadow: '0 20px 40px -20px rgba(0,0,0,0.18)',
//           borderColor: 'rgb(229 231 235)',
//           transition: { duration: 0.45, ease: EASE },
//         },
//       }}
//     >
      

//       <p
//         className="relative z-10 text-[13px] leading-relaxed text-gray-600 md:text-[14px]"
//         style={{ letterSpacing: '-0.02em' }}
//       >
//         &ldquo;{data.quote}&rdquo;
//       </p>

//       <div className="relative z-10 mt-6 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <motion.div
//             variants={{
//               rest: { backgroundColor: 'rgb(249 250 251)', color: 'rgb(31 41 55)' },
//               hover: { backgroundColor: '#161616', color: '#ffffff', transition: { duration: 0.35, ease: EASE } },
//             }}
//             className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold"
//             style={{ fontFamily: '"Roboto Mono", monospace' }}
//           >
//             {data.initial}
//           </motion.div>
//           <div className="flex flex-col">
//             <span className="text-[13px] font-bold text-black" style={{ letterSpacing: '-0.02em' }}>
//               {data.name}
//             </span>
//             <span className="text-[11px] text-gray-400" style={{ letterSpacing: '-0.02em' }}>
//               {data.role}
//             </span>
//           </div>
//         </div>

//         <motion.div
//           variants={{
//             rest: { scale: 1, opacity: 0.85 },
//             hover: { scale: 1.12, opacity: 1, transition: { duration: 0.35, ease: EASE } },
//           }}
//         >
//           <LinkedInIcon />
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// }

// /* =========================================================
//    COMPONENT
// ========================================================= */

// export default function Testimonials() {
//   const reduce = useReducedMotion();
//   const d = (px: number) => (reduce ? 0 : px);

//   const headerV: Variants = {
//     hidden: {},
//     show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
//   };
//   const fadeV: Variants = {
//     hidden: { opacity: 0, y: d(12) },
//     show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
//   };
//   const lineV: Variants = {
//     hidden: { y: reduce ? '0%' : '110%', opacity: reduce ? 0 : 1 },
//     show: { y: '0%', opacity: 1, transition: { duration: 1, ease: EASE } },
//   };
//   const ruleV: Variants = {
//     hidden: { scaleX: reduce ? 1 : 0, opacity: reduce ? 0 : 0.9 },
//     show: { scaleX: 1, opacity: 0.9, transition: { duration: 1.2, ease: EASE } },
//   };
//   const headlineV: Variants = {
//     hidden: {},
//     show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
//   };
//   const marqueeV: Variants = {
//     hidden: { opacity: 0, y: d(24) },
//     show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE, delay: reduce ? 0 : 0.2 } },
//   };

//   const headlineLines = ['REAL WORDS', 'FROM THOSE', 'WHO', 'TRUSTED', 'OUR WORK'];

//   return (
//     <section className="relative z-10 w-full overflow-hidden bg-white py-16 text-black md:py-24">
//       {/* Seamless native marquee animations */}
//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//         @keyframes scroll-left {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-33.3333%); }
//         }
//         @keyframes scroll-right {
//           0% { transform: translateX(-33.3333%); }
//           100% { transform: translateX(0); }
//         }
//         .animate-scroll-left {
//           animation: scroll-left 90s linear infinite;
//           width: max-content;
//         }
//         .animate-scroll-right {
//           animation: scroll-right 90s linear infinite;
//           width: max-content;
//         }
//         @media (max-width: 767px) {
//           .animate-scroll-left { animation-duration: 46s; }
//           .animate-scroll-right { animation-duration: 46s; }
//         }
//         .mask-edges {
//           mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
//           -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
//         }
//         @media (min-width: 768px) {
//           .mask-edges {
//             mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
//             -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
//           }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .animate-scroll-left, .animate-scroll-right {
//             animation-play-state: paused;
//           }
//         }
//       `,
//         }}
//       />

//       {/* HUGE Background Typography - Absolutely Centered Behind Content */}
//       <motion.div
//         initial={{ opacity: 0, y: d(30) }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, amount: 0.1 }}
//         transition={{ duration: 1.6, ease: EASE }}
//         className="pointer-events-none absolute left-0 top-[20%] z-0 flex w-full justify-center overflow-hidden"
//       >
//         <h2
//           className="whitespace-nowrap text-[20vw] leading-[0.8] text-gray-50 opacity-80 select-none"
//           style={{
//             fontFamily: '"Roboto Condensed", sans-serif',
//             fontWeight: 900,
//             letterSpacing: '-0.02em',
//           }}
//         >
//           APPRECIATION.
//         </h2>
//       </motion.div>

//       <div className="relative z-10 mx-auto w-full max-w-[1700px] px-6 md:px-12 lg:px-16">
//         {/* Top Header Row */}
//         <motion.div
//           variants={headerV}
//           initial="hidden"
//           whileInView="show"
//           viewport={VIEWPORT}
//           className="mb-4 flex items-end justify-between"
//         >
//           <motion.span
//             variants={fadeV}
//             className="text-[18px] font-bold text-black md:text-[22px]"
//             style={{ fontFamily: '"Roboto Mono", monospace', letterSpacing: '-0.02em' }}
//           >
//             [ 05 ]
//           </motion.span>

//           <h2
//             className="text-[32px] uppercase leading-none text-black md:text-[52px]"
//             style={{ fontFamily: '"Roboto Condensed", sans-serif', fontWeight: 900, letterSpacing: '-0.02em' }}
//           >
//             <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
//               <motion.span variants={lineV} className="inline-block will-change-transform">
//                 CLIENT SAYS!
//               </motion.span>
//             </span>
//           </h2>
//         </motion.div>

//         {/* Thin Black Divider */}
//         <motion.hr
//           variants={ruleV}
//           initial="hidden"
//           whileInView="show"
//           viewport={VIEWPORT}
//           style={{ transformOrigin: 'left center' }}
//           className="mb-16 w-full border-t-[1px] border-black opacity-90 md:mb-20"
//         />

//         {/* Content Layout */}
//         <div className="flex w-full flex-col items-center gap-16 xl:flex-row xl:items-start xl:gap-8">
//           {/* Left Side: Editorial Headline */}
//           <motion.div
//             variants={headlineV}
//             initial="hidden"
//             whileInView="show"
//             viewport={VIEWPORT}
//             className="w-full shrink-0 xl:w-[28%]"
//           >
//             <h3
//               className="text-[12vw] uppercase leading-[0.85] text-[#333333] md:text-[64px] lg:text-[76px]"
//               style={{
//                 fontFamily: '"Roboto Condensed", sans-serif',
//                 fontWeight: 900,
//                 letterSpacing: '-0.02em',
//               }}
//             >
//               {headlineLines.map((line, i) => (
//                 <span key={i} className="block overflow-hidden pb-[0.05em] -mb-[0.05em]">
//                   <motion.span variants={lineV} className="block will-change-transform">
//                     {line}
//                   </motion.span>
//                 </span>
//               ))}
//             </h3>
//           </motion.div>

//           {/* Right Side: Dual Infinite Scrolling Carousels */}
//           <motion.div
//             variants={marqueeV}
//             initial="hidden"
//             whileInView="show"
//             viewport={VIEWPORT}
//             className="mask-edges relative flex w-full flex-col gap-4 overflow-hidden md:gap-6 xl:w-[72%]"
//           >
//             {/* Row 1 - Moves Left */}
//             <div className="animate-scroll-left flex gap-4 md:gap-6 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
//               {/* Triplicated for seamless looping; only the middle copy is keyboard-reachable */}
//               {[...row1, ...row1, ...row1].map((testimonial, idx) => (
//                 <TestimonialCard
//                   key={`r1-${testimonial.id}-${idx}`}
//                   data={testimonial}
//                   tabbable={idx >= row1.length && idx < row1.length * 2}
//                 />
//               ))}
//             </div>

//             {/* Row 2 - Moves Right */}
//             <div className="animate-scroll-right flex gap-4 md:gap-6 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
//               {[...row2, ...row2, ...row2].map((testimonial, idx) => (
//                 <TestimonialCard
//                   key={`r2-${testimonial.id}-${idx}`}
//                   data={testimonial}
//                   tabbable={idx >= row2.length && idx < row2.length * 2}
//                 />
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }