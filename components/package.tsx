'use client';

import Image from 'next/image';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

/* =========================================================
   CONTENT / THEME  (edit here)
========================================================= */

const BG_IMAGE =
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop';
const CONTACT_HREF = '#contact';
const ORANGE = '#FF5C05';
const TAB_BG = '#e6e6e6';

const CONDENSED = '"Roboto Condensed", sans-serif';
const MONO = '"Roboto Mono", monospace';
const cond = { fontFamily: CONDENSED } as const;

/* =========================================================
   MOTION SETTINGS  (tweak these to change the feel)
========================================================= */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, amount: 0.2, margin: '0px 0px -8% 0px' } as const;
const VIEWPORT_CARD = { once: true, amount: 0.15, margin: '0px 0px -10% 0px' } as const;

/* =========================================================
   ICONS
========================================================= */

const iconCls = 'mt-[3px] h-[18px] w-[18px] shrink-0 text-white';

const CheckIcon = () => (
  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CrossIcon = () => (
  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AreaIcon = () => (
  <svg className="h-[15px] w-[15px] shrink-0 text-white/85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l6-6M10 9h5v5" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 9.5l7-7M3.5 2.5h6v6" />
  </svg>
);

interface Deliverable {
  text: string;
  included: boolean;
}

/* =========================================================
   PACKAGE CARD
========================================================= */

function PackageCard({
  badge,
  title,
  price,
  priceNote,
  areaNote,
  items,
  cta,
  featured = false,
  index,
}: {
  badge: string;
  title: string;
  price: string;
  priceNote: string;
  areaNote: string;
  items: Deliverable[];
  cta: string;
  featured?: boolean;
  index: number;
}) {
  const reduce = useReducedMotion();
  const d = (px: number) => (reduce ? 0 : px);
  const base = index * 0.12;

  const cardV: Variants = {
    hidden: { opacity: 0, y: d(48) },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: reduce ? 0 : base } },
  };

  const innerV: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: reduce ? 0 : 0.15 + base } },
  };

  const fadeV: Variants = {
    hidden: { opacity: 0, y: d(14) },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  const listV: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: reduce ? 0 : 0.35 + base } },
  };

  const itemV: Variants = {
    hidden: { opacity: 0, x: d(-10) },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
  };

  // The tab drops down from the card's top edge
  const tabV: Variants = {
    hidden: { scaleY: reduce ? 1 : 0, opacity: 0 },
    show: { scaleY: 1, opacity: 1, transition: { duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.45 + base } },
  };

  return (
    <motion.article
      variants={cardV}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT_CARD}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="relative flex w-full max-w-[496px] flex-col rounded-[24px] bg-gradient-to-b from-[#303030]/90 via-[#212121]/90 to-[#141414]/95 px-[22px] pb-[35px] pt-[18px] text-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.65)] ring-1 ring-inset ring-white/[0.06] backdrop-blur-xl"
    >
      {/* Hanging tab with concave fillets where it meets the card edge */}
      <motion.div variants={tabV} style={{ originY: 0 }} className="absolute right-[44px] top-0 z-10 h-7">
        <span
          aria-hidden="true"
          className="absolute -left-3 top-0 h-3 w-3"
          style={{ background: `radial-gradient(circle at 0 100%, transparent 11.5px, ${TAB_BG} 12px)` }}
        />
        <span
          className="flex h-full items-center whitespace-nowrap rounded-b-[10px] px-4 text-[14px] font-bold uppercase tracking-[0.03em] text-[#2b2b2b]"
          style={{ ...cond, background: TAB_BG }}
        >
          {badge}
        </span>
        <span
          aria-hidden="true"
          className="absolute -right-3 top-0 h-3 w-3"
          style={{ background: `radial-gradient(circle at 100% 100%, transparent 11.5px, ${TAB_BG} 12px)` }}
        />
      </motion.div>

      <motion.div variants={innerV} className="flex flex-1 flex-col">
        {/* Title chip */}
        <motion.h3
          variants={fadeV}
          className="mt-8 flex h-[58px] w-[221px] max-w-full items-center justify-center rounded-[8px] border border-white/35 bg-white/20 text-[21px] font-bold text-white/90 min-[500px]:mt-0"
          style={cond}
        >
          {title}
        </motion.h3>

        {/* Price */}
        <motion.div variants={fadeV} className="mt-[26px] flex flex-wrap items-baseline gap-x-2" style={cond}>
          <span className="text-[31px] font-bold leading-[1.1]">{price}</span>
          <span className="text-[17px] font-semibold text-white/95">{priceNote}</span>
        </motion.div>

        {/* Area */}
        <motion.div variants={fadeV} className="mt-1 flex items-center gap-3 text-[14px] text-white/85" style={cond}>
          <AreaIcon />
          <span>{areaNote}</span>
        </motion.div>

        {/* Deliverables */}
        <motion.p variants={fadeV} className="mt-[11px] text-[18px] leading-6 text-white/90" style={cond}>
          Deliverables:
        </motion.p>

        <motion.ul
          variants={listV}
          className="mx-[6px] mt-[10px] flex flex-1 flex-col border-y border-white/30 pb-[22px] pt-[9px]"
          style={{ fontFamily: MONO }}
        >
          {items.map((item) => (
            <motion.li
              key={item.text}
              variants={itemV}
              className="flex items-start gap-[6px] text-[11.5px] leading-6 text-white/80"
            >
              {item.included ? <CheckIcon /> : <CrossIcon />}
              <span className="min-w-0">
                <span className="sr-only">{item.included ? 'Included: ' : 'Not included: '}</span>
                {item.text}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        {/* CTA */}
        <motion.div variants={fadeV} className="mt-[70px]">
          <a
            href={CONTACT_HREF}
            className={`group mx-auto flex h-[58px] w-full max-w-[300px] items-center justify-center gap-2 rounded-[8px] text-[16px] font-bold uppercase transition-[background-color,transform] duration-300 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
              featured ? 'text-white hover:brightness-110' : 'bg-white text-black hover:bg-gray-100'
            }`}
            style={{ ...cond, backgroundColor: featured ? ORANGE : undefined }}
          >
            {cta}
            <ArrowIcon />
          </a>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Packages() {
  const reduce = useReducedMotion();
  const d = (px: number) => (reduce ? 0 : px);

  const package1: Deliverable[] = [
    { text: 'Modular Kitchen: BWP Marine Ply with soft-close Hettich fittings', included: true },
    { text: 'Living & Dining: TV unit, entry shoe rack & dedicated Mandir niche', included: true },
    { text: 'Master Bedroom: Full-height wardrobe & hydraulic storage bed', included: true },
    { text: 'Guest Room: 2-door wardrobe with integrated vanity & study desk', included: true },
    { text: 'Ceiling & Paint: Gypsum false ceiling + Asian Paints Royal finish', included: true },
    { text: 'Bespoke Joinery: Custom fluted wall paneling & acrylic finishes', included: false },
    { text: 'Dining Credenza: Crockery display unit with glass detailing', included: false },
  ];

  const package2: Deliverable[] = [
    { text: 'Bespoke Kitchen: Acrylic / PU setup with tall pantry & rolling shutter', included: true },
    { text: 'Living & Formal Dining: TV unit with fluted paneling + glass credenza', included: true },
    { text: 'Master Suite: 8 ft × 9 ft full-height wardrobe & custom upholstered bed', included: true },
    { text: 'Parent & Kids Rooms: 2 full wardrobes, study workspace & soft-close drawers', included: true },
    { text: 'Architectural Finishes: Peripheral false ceiling, chandelier points & accent texture', included: true },
    { text: 'Custom Temple: Standalone CNC lattice work Pooja Room layout', included: true },
    { text: 'Turnkey Styling: Complimentary white-glove styling & final walkthrough', included: true },
  ];

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
    hidden: { scaleX: reduce ? 1 : 0, opacity: reduce ? 0 : 1 },
    show: { scaleX: 1, opacity: 1, transition: { duration: 1.2, ease: EASE } },
  };

  return (
    <section className="bg-black">
    <section className="relative isolate flex min-h-screen w-full flex-col overflow-hidden rounded-b-[2rem] rounded-t-none bg-white pb-12 pt-10 md:rounded-b-[3rem] md:pb-[58px] md:pt-5">
      {/* Background: blurred photo under a white fade */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 1.08 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.8, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={BG_IMAGE}
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover blur-[6px] brightness-[0.6]"
          />
        </motion.div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, #ffffff 0%, #ffffff 26%, rgba(255,255,255,0.55) 38%, rgba(255,255,255,0) 58%)',
          }}
        />
      </div>

      {/* Giant faint word behind the header */}
              <motion.div
                initial={{ opacity: 0, y: d(30) }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.6, ease: EASE }}
                className="pointer-events-none absolute inset-x-0 top-[3vw] z-0 overflow-hidden pl-[28vw]"
                aria-hidden="true"
              >
                <span
                  className="block select-none whitespace-nowrap text-[18vw] italic leading-[0.8] text-[#e6e6e6]"
                  style={{
                    fontFamily: CONDENSED,
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    WebkitMaskImage: 'linear-gradient(to bottom, #000 25%, transparent 90%)',
                    maskImage: 'linear-gradient(to bottom, #000 25%, transparent 90%)',
                  }}
                >
                  TRANSPARENT.
                </span>
              </motion.div>

              <div className="relative z-10 mx-auto flex w-full max-w-[1920px] flex-col px-5 md:px-[2.3vw]">
                {/* Header: two-line title, with [07] at the top-right of "POPULAR" */}
                <motion.div variants={headerV} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                  <h2
                    aria-label="Popular package"
                    className="text-[clamp(40px,4.45vw,64px)] font-bold uppercase leading-[0.92] text-black"
                    style={{ fontFamily: CONDENSED, letterSpacing: '-0.01em' }}
                  >
                    {['Popular', 'Package'].map((line, i) => (
                      <span key={line} aria-hidden="true" className="relative block w-max">
                        <span className="block overflow-hidden pr-[0.12em]">
                          <motion.span variants={lineV} className="block will-change-transform">
                            {line}
                          </motion.span>
                        </span>

                        {i === 0 && (
                          <motion.span
                            variants={fadeV}
                            className="absolute left-full top-[0.05em] ml-[0.2em] text-[13px] font-medium leading-none tracking-normal text-black"
                            style={{ fontFamily: MONO }}
                          >
                            [07]
                          </motion.span>
                        )}
                      </span>
                    ))}
                  </h2>
                </motion.div>

        {/* Cards */}
        <div className="mx-auto mt-16 grid w-full max-w-[1024px] grid-cols-1 justify-items-center gap-8 lg:grid-cols-2">
          <PackageCard
            index={0}
            featured
            badge="Most Popular"
            title="Essential 2BHK"
            price="₹5.50 Lakhs"
            priceNote="(Starting all-inclusive)"
            areaNote="Ideal for 850 – 1,100 sq. ft."
            items={package1}
            cta="Book 2BHK Consultation"
          />
          <PackageCard
            index={1}
            badge="Premium Selection"
            title="Grand 3BHK"
            price="₹8.75 Lakhs"
            priceNote="(Starting all-inclusive)"
            areaNote="Ideal for 1,350 – 1,850 sq. ft."
            items={package2}
            cta="Book 3BHK Consultation"
          />
        </div>
      </div>
    </section>
    </section>
  );
}
