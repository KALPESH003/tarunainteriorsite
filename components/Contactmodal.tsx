'use client';

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Image, { type StaticImageData } from 'next/image';
import { AnimatePresence, motion, useAnimationControls, type Variants } from 'framer-motion';

/* =========================================================
   CONTENT  (copy is exactly as shown in the design)
========================================================= */

const COPY = {
  caption: ['Design your future, one blueprint at a time.', 'Let’s connect for architects shaping tommorow.'],
  sub: 'Structure- Your gateway to architectural exceptance.',
  terms: 'By reviewing this architecture, you accept to out',
  thanksTitle: 'THANKS!',
  thanksBody: 'We’ve received your enquiry and will be in touch soon:)',
  timelineNote:
    'NOTE: Our studio has an 8-12 minimum wait time to commence new projects. Project timelines vary depending on a range of factors but we ask that you allow a minimum of 6 to 12 months from commencement to delivery of construction plans ready for build.',
  budgetNote:
    'NOTE: Our design fees start from a minimum of ₹10,000- ₹40,000 p/m². Project costs can vary significantly depending on your needs. We will create a custom proposal for you project, including detailed fees and inclusions, once after we meet to provide clarity on any costs moving forward.',
};

const PROJECT_TYPES = ['NEW HOME', 'RENOVATION', 'INTERIOR', 'COMMERCIAL PROJECT', 'FURNITURE SUPPLY', 'OTHER'];
const BUDGETS = ['< ₹5 Lakh', '₹5-10 Lakh', '₹10-20 Lakh', '₹20-50 Lakh', '₹1+ Cr', 'Custom'];
const YES_NO = ['YES', 'NO'];
const TOTAL = 5;

/* =========================================================
   FORM STATE
========================================================= */

export type ContactData = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  workedBefore: string;
  location: string;
  timeline: string;
  budget: string;
  brief: string;
  engaged: string;
  designer: string;
};

const EMPTY: ContactData = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  workedBefore: '',
  location: '',
  timeline: '',
  budget: '',
  brief: '',
  engaged: '',
  designer: '',
};

// required fields (the ones with the orange asterisk) for each step
function validate(step: number, d: ContactData): Record<string, boolean> {
  const e: Record<string, boolean> = {};
  if (step === 0) {
    if (d.name.trim().length < 2) e.name = true;
    if (!/^\S+@\S+\.\S+$/.test(d.email.trim())) e.email = true;
    if (d.phone.replace(/\D/g, '').length < 10) e.phone = true;
  }
  if (step === 1) {
    if (!d.projectType) e.projectType = true;
    if (!d.workedBefore) e.workedBefore = true;
  }
  if (step === 2) {
    if (!d.location.trim()) e.location = true;
    if (!d.timeline.trim()) e.timeline = true;
  }
  if (step === 3 && !d.budget) e.budget = true;
  if (step === 4 && !d.engaged) e.engaged = true;
  return e;
}

/* =========================================================
   STYLE TOKENS
========================================================= */

const ORANGE = '#ff5a00';
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CONDENSED = { fontFamily: '"Roboto Condensed", sans-serif' };
const MONO = { fontFamily: '"Roboto Mono", monospace' };

// makes the modal self-contained (loads the three Roboto families it uses)
const FONT_CSS =
  "@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@900&family=Roboto+Condensed:wght@400;500;700&family=Roboto+Mono:wght@400;500;700&display=swap');";

const pad = (n: number) => String(n).padStart(2, '0');

/* =========================================================
   MOTION
========================================================= */

const stepV: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: EASE, staggerChildren: 0.06, delayChildren: 0.05 },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -40,
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
  }),
};

const itemV: Variants = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  exit: {},
};

function Item({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemV} className={className}>
      {children}
    </motion.div>
  );
}

/* =========================================================
   FORM PARTS
========================================================= */

function Label({
  children,
  required,
  htmlFor,
  className = '',
}: {
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}) {
  const Tag = htmlFor ? 'label' : 'p';
  return (
    <Tag htmlFor={htmlFor} className={`block text-[14px] font-medium leading-4 text-white ${className}`}>
      {children}
      {required && (
        <span className="relative -top-[5px] ml-[3px] align-top text-[13px] leading-none" style={{ color: ORANGE }}>
          *
        </span>
      )}
    </Tag>
  );
}

const fieldBase =
  'block w-full rounded-[8px] bg-[#333] px-5 text-[14px] font-medium tracking-[0.02em] text-white outline-none transition-shadow duration-200 placeholder:text-[#9b9b9b] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.45)]';

function Field({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  autoFocus,
  inputMode,
  autoComplete,
  height = 'h-[47px]',
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  error?: boolean;
  autoFocus?: boolean;
  inputMode?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  height?: string;
}) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      inputMode={inputMode}
      autoComplete={autoComplete}
      aria-invalid={error || undefined}
      className={`${fieldBase} ${height} ${error ? 'shadow-[0_0_0_1px_#ff5a00]' : ''}`}
    />
  );
}

function Choice({
  label,
  selected,
  error,
  onClick,
}: {
  label: string;
  selected: boolean;
  error?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      initial={false}
      animate={{
        borderColor: selected ? ORANGE : error ? 'rgba(255,90,0,0.55)' : '#2c2c2c',
        backgroundColor: selected ? '#000000' : '#141414',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="h-[47px] w-full rounded-[8px] border px-3 text-[14px] font-medium tracking-[0.02em] text-white outline-none focus-visible:shadow-[0_0_0_1px_rgba(255,255,255,0.5)]"
    >
      {label}
    </motion.button>
  );
}

function ChoiceGrid({
  options,
  value,
  onChange,
  error,
  tight,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  tight?: boolean;
}) {
  return (
    <div role="group" className={`grid grid-cols-2 gap-x-[14px] pr-[3px] ${tight ? '' : 'gap-y-3'}`}>
      {options.map((o) => (
        <Choice key={o} label={o} selected={value === o} error={error} onClick={() => onChange(o)} />
      ))}
    </div>
  );
}

function Note({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] leading-[15px] text-[#5e5e5e] ${className}`} style={MONO}>
      {children}
    </p>
  );
}

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
    >
      <path d="M2.5 9.5 9.5 2.5M3.5 2.5h6v6" />
    </svg>
  );
}

function Primary({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  return (
    <motion.button
      type="submit"
      disabled={disabled}
      whileHover={disabled ? undefined : { backgroundColor: '#ff6d1f' }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.2 }}
      className="group flex h-[47px] w-full items-center justify-center gap-[10px] rounded-[8px] bg-[#ff5a00] text-[16px] font-bold uppercase tracking-[0.15em] text-white outline-none focus-visible:shadow-[0_0_0_2px_#fff] disabled:cursor-wait disabled:opacity-80"
    >
      {children}
      <Arrow />
    </motion.button>
  );
}

function StepHeader({ title, step }: { title: string; step: number }) {
  return (
    <Item>
      <div className="flex items-end gap-[11px]">
        <h2 className="flex-1 border-b border-white pb-[5px] text-[16px] font-bold uppercase leading-4">{title}</h2>
        <span className="translate-y-[3px] text-[16px] font-bold leading-4">
          [{pad(step + 1)}/{pad(TOTAL)}]
        </span>
      </div>
    </Item>
  );
}

function Actions({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <Item className="mt-auto pt-8">
      {step === 0 ? (
        <Primary>NEXT</Primary>
      ) : (
        <div className="grid grid-cols-2 gap-[23px]">
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ backgroundColor: '#272727' }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.2 }}
            className="h-[47px] rounded-[8px] bg-[#1c1c1c] text-[16px] font-bold uppercase tracking-[0.15em] text-white outline-none focus-visible:shadow-[0_0_0_1px_rgba(255,255,255,0.5)]"
          >
            BACK
          </motion.button>
          <Primary>NEXT</Primary>
        </div>
      )}
    </Item>
  );
}

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
   MODAL
========================================================= */

export type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  /** Called with the finished form. Throw / reject to show an error. */
  onSubmit?: (data: ContactData) => Promise<void> | void;
  /** Left-hand photo (put the picture in /public and point to it) */
  imageSrc?: string | StaticImageData;
  /** Optional logo image. If omitted a text logo is drawn. */
  logoSrc?: string;
  termsHref?: string;
  privacyHref?: string;
};

export default function ContactModal({
  open,
  onClose,
  onSubmit,
  imageSrc = '/image/background/johannes-sejer-Xn3vcIpPi1E-unsplash.jpg',
  logoSrc,
  termsHref = '/terms',
  privacyHref = '/privacy',
}: ContactModalProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [d, setD] = useState<ContactData>(EMPTY);
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState(false);
  const shake = useAnimationControls();
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => setMounted(true), []);

  // lock page scroll + close on Escape while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const reset = useCallback(() => {
    setStep(0);
    setDir(1);
    setD(EMPTY);
    setAttempted(false);
    setBusy(false);
    setFailed(false);
    setDone(false);
  }, []);

  const set = <K extends keyof ContactData>(k: K, v: ContactData[K]) => {
    setD((p) => ({ ...p, [k]: v }));
  };

  const errors = attempted ? validate(step, d) : {};

  const next = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (Object.keys(validate(step, d)).length) {
      setAttempted(true);
      shake.start({ x: [0, -8, 8, -6, 6, -3, 0], transition: { duration: 0.45 } });
      return;
    }
    if (step < TOTAL - 1) {
      setAttempted(false);
      setDir(1);
      setStep((s) => s + 1);
      return;
    }
    setBusy(true);
    setFailed(false);
    try {
      if (onSubmit) await onSubmit(d);
      else await new Promise((r) => setTimeout(r, 900));
      setDone(true);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const back = () => {
    setAttempted(false);
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  /* ---------- the five steps ---------- */

  const steps = [
    // 01 - personal details
    <>
      <StepHeader title="PERSONAL DETAILS" step={0} />
      <Item className="mt-4">
        <Label htmlFor="name" required className="mb-2">
          Full Name
        </Label>
        <Field id="name" value={d.name} onChange={(v) => set('name', v)} placeholder="Your Full Name" error={errors.name} autoFocus autoComplete="name" />
      </Item>
      <Item className="mt-[18px]">
        <Label htmlFor="email" required className="mb-2">
          Email Address
        </Label>
        <Field id="email" type="email" inputMode="email" value={d.email} onChange={(v) => set('email', v)} placeholder="Your Email Address" error={errors.email} autoComplete="email" />
      </Item>
      <Item className="mt-[18px]">
        <Label htmlFor="phone" required className="mb-2">
          Contact Number
        </Label>
        <Field id="phone" type="tel" inputMode="tel" value={d.phone} onChange={(v) => set('phone', v)} placeholder="+91 98765 43210" error={errors.phone} autoComplete="tel" />
      </Item>
      <Actions step={0} onBack={back} />
    </>,

    // 02 - project type
    <>
      <StepHeader title="PROJECT DETAILS" step={1} />
      <Item className="mt-8">
        <Label required className="mb-3">
          What type of project are you looking for?
        </Label>
        <ChoiceGrid options={PROJECT_TYPES} value={d.projectType} onChange={(v) => set('projectType', v)} error={errors.projectType} />
      </Item>
      <Item className="mt-6">
        <Label required className="mb-[18px]">
          Have you ever worked with architecture or interior designer?
        </Label>
        <ChoiceGrid options={YES_NO} value={d.workedBefore} onChange={(v) => set('workedBefore', v)} error={errors.workedBefore} tight />
      </Item>
      <Actions step={1} onBack={back} />
    </>,

    // 03 - location + timeline
    <>
      <StepHeader title="PROJECT DETAILS" step={2} />
      <Item className="mt-8">
        <Label htmlFor="location" required className="mb-3">
          Where are you planning to build your project?
        </Label>
        <Field id="location" value={d.location} onChange={(v) => set('location', v)} placeholder="Ahmedabad, Gujarat" error={errors.location} autoFocus />
      </Item>
      <Item className="mt-[15px]">
        <Label htmlFor="timeline" required className="mb-3">
          Project timeline
        </Label>
        <Field id="timeline" value={d.timeline} onChange={(v) => set('timeline', v)} placeholder="4-6 months" error={errors.timeline} />
      </Item>
      <Item className="mt-[17px]">
        <Note>{COPY.timelineNote}</Note>
      </Item>
      <Actions step={2} onBack={back} />
    </>,

    // 04 - budget
    <>
      <StepHeader title="PROJECT DETAILS" step={3} />
      <Item className="mt-8">
        <Label required className="mb-3">
          Project budget range
        </Label>
        <ChoiceGrid options={BUDGETS} value={d.budget} onChange={(v) => set('budget', v)} error={errors.budget} />
      </Item>
      <Item className="mt-[14px]">
        <Note className="max-w-[480px]">{COPY.budgetNote}</Note>
      </Item>
      <Actions step={3} onBack={back} />
    </>,

    // 05 - brief + submit
    <>
      <StepHeader title="PROJECT DETAILS" step={4} />
      <Item className="mt-8">
        <Label htmlFor="brief" className="mb-3">
          Project brief (provide any additional information you may have for your project)
        </Label>
        <textarea
          id="brief"
          name="brief"
          value={d.brief}
          onChange={(e) => set('brief', e.target.value)}
          placeholder="want to share something..."
          className={`${fieldBase} h-[125px] resize-none py-5 leading-[19px]`}
        />
      </Item>
      <Item className="mt-[30px]">
        <Label required className="mb-[18px]">
          Have you engaged a architect/interior designer?
        </Label>
        <ChoiceGrid options={YES_NO} value={d.engaged} onChange={(v) => set('engaged', v)} error={errors.engaged} tight />
        <AnimatePresence initial={false}>
          {d.engaged === 'YES' && (
            <motion.div
              key="designer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="pt-[13px]">
                <Label htmlFor="designer" className="mb-3">
                  Architect/interior designer details
                </Label>
                <Field id="designer" value={d.designer} onChange={(v) => set('designer', v)} placeholder="architecture/interior designer name and organization" height="h-[52px]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Item>
      <Item className="mt-10">
        <Primary disabled={busy}>{busy ? 'SENDING…' : 'SUBMIT'}</Primary>
        {failed && (
          <p className="mt-3 text-[11px] leading-[15px]" style={{ ...MONO, color: ORANGE }} role="alert">
            Something went wrong. Please try again.
          </p>
        )}
      </Item>
    </>,
  ];

  const minH = ['lg:min-h-[417px]', 'lg:min-h-[428px]', 'lg:min-h-[428px]', 'lg:min-h-[428px]', ''][step];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence onExitComplete={reset}>
      {open && (
        <motion.div
          key="contact-modal"
          className="fixed inset-0 z-[100]"
          role="dialog"
          aria-modal="true"
          aria-label="Contact"
          style={CONDENSED}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <style>{FONT_CSS}</style>

          {/* blurred page behind */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-2xl" onClick={onClose} aria-hidden="true" />

          {/* shell */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: EASE } }}
            exit={{ opacity: 0, y: 32, scale: 0.98, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } }}
            className="absolute inset-0 flex flex-col overflow-hidden bg-black text-white lg:inset-x-5 lg:inset-y-[25px] lg:mx-auto lg:max-w-[1600px] lg:flex-row lg:rounded-[24px] lg:p-[9px] lg:shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
          >
            {/* ---------- left: photo ---------- */}
            <div className="relative h-[150px] shrink-0 overflow-hidden sm:h-[200px] lg:h-auto lg:w-[48.8%] lg:rounded-[16px]">
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.14 }}
                animate={{ scale: 1, transition: { duration: 1.8, ease: EASE } }}
              >
                <Image
                    src={imageSrc}
                    alt=""
                    fill
                    priority
                    unoptimized={imgFailed}
                    onError={() => setImgFailed(true)}
                    sizes="(min-width:1024px) 50vw, 100vw"
                    className="object-cover"
                    />
              </motion.div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />

              <motion.div
                className="absolute left-5 top-5 lg:left-[37px] lg:top-[38px]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5, ease: EASE } }}
              >
                {logoSrc ? <Image src={logoSrc} alt="The Taruna Interior Gallery" width={72} height={30} /> : <Logo />}
              </motion.div>

              <motion.div
                className="absolute inset-x-0 bottom-[74px] hidden px-6 text-center lg:block"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 1, delay: 0.7, ease: EASE } }}
              >
                <p className="text-[24px] font-medium leading-[27px] text-white">
                  {COPY.caption[0]}
                  <br />
                  {COPY.caption[1]}
                </p>
                <p className="mt-[11px] text-[11.6px] leading-[14px] text-white" style={MONO}>
                  {COPY.sub}
                </p>
              </motion.div>
            </div>

            {/* ---------- right: form ---------- */}
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
              {/* giant faint word (clipped on the left, runs off the right) */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 select-none"
                animate={{ x: done ? -60 : step * -18 }}
                transition={{ duration: 1, ease: EASE }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 1.6, delay: 0.3, ease: EASE } }}
                  className="absolute block whitespace-nowrap font-black uppercase leading-[0.8] tracking-[-0.01em] text-[#1b1b1b]"
                  style={{
                    fontFamily: 'Roboto, "Roboto Condensed", sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(72px, 12.2vw, 176px)',
                    left: '-1.08em',
                    top: '0.4em',
                    WebkitMaskImage: 'linear-gradient(to bottom, #000 25%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, #000 25%, transparent 100%)',
                  }}
                >
                  CONTACT
                </motion.span>
              </motion.div>

              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-5 z-20 text-[16px] font-bold uppercase tracking-[0.02em] text-white underline underline-offset-[3px] outline-none transition-opacity hover:opacity-70 focus-visible:opacity-70 lg:right-[22px] lg:top-[26px]"
              >
                CLOSE
              </button>

              <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-4 pt-[84px] sm:px-10 lg:pb-[100px] lg:pl-[clamp(40px,6vw,86px)] lg:pr-[clamp(40px,7.7vw,111px)] lg:pt-[200px]">
                <AnimatePresence mode="wait" initial={false}>
                  {done ? (
                    <motion.div
                      key="done"
                      className="mt-auto pb-2 lg:absolute lg:bottom-[76px] lg:left-8 lg:right-6 lg:mt-0 lg:pb-0"
                      initial="hide"
                      animate="show"
                      variants={{ show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } } }}
                    >
                      {[COPY.thanksTitle, COPY.thanksBody].map((line) => (
                        <span key={line} className="block overflow-hidden pb-[0.06em]">
                          <motion.span
                            variants={{
                              hide: { y: '110%' },
                              show: { y: '0%', transition: { duration: 1, ease: EASE } },
                            }}
                            className="block font-bold leading-[1.02] tracking-[-0.01em] text-white"
                            style={{ fontSize: 'clamp(40px, 5.28vw, 76px)' }}
                          >
                            {line}
                          </motion.span>
                        </span>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div key="form" layout="position" className="my-auto w-full max-w-[511px]" exit={{ opacity: 0, transition: { duration: 0.25 } }}>
                      <motion.div animate={shake}>
                        <AnimatePresence mode="wait" custom={dir} initial={false}>
                          <motion.form
                            key={step}
                            custom={dir}
                            variants={stepV}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            onSubmit={next}
                            noValidate
                            className={`flex flex-col ${minH}`}
                          >
                            {steps[step]}
                          </motion.form>
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* terms */}
              <p
                className="relative z-10 shrink-0 px-6 pb-6 pt-2 text-center text-[11px] leading-[14px] text-[#707070] lg:pb-[52px]"
                style={MONO}
              >
                {COPY.terms}{' '}
                <a href={termsHref} className="font-bold text-white hover:underline">
                  Terms of Services
                </a>{' '}
                and{' '}
                <a href={privacyHref} className="font-bold text-white hover:underline">
                  Privacy Policy.
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* =========================================================
   DROP-IN CONTACT BUTTON
   <ContactButton className="...">Contact</ContactButton>
========================================================= */

export function ContactButton({
  children = 'Contact',
  className,
  ...modalProps
}: { children?: ReactNode; className?: string } & Omit<ContactModalProps, 'open' | 'onClose'>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      <ContactModal open={open} onClose={() => setOpen(false)} {...modalProps} />
    </>
  );
}