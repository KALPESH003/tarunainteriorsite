'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import SectionHeader, { COND, EASE, fontVars } from '@/components/SectionHeader';

const COPY_TEXT = 'text-[14px] font-medium leading-[19px] tracking-[0.1em]';

export default function OwnerProfile() {
  return (
    <section
      id="founder"
      className={`${fontVars} relative z-20 w-full overflow-hidden bg-black pb-[max(64px,6vw)] text-white`}
    >
      <SectionHeader theme="dark" side="right" num="09" lines={['THE', 'VISIONARY']} ghost="FOUNDER" />

      <div className="grid grid-cols-1 items-center gap-10 px-[max(16px,2.3vw)] lg:grid-cols-[1fr_1.32fr] lg:gap-x-[1.2vw]">
        {/* Photo: wipes up, then settles from a slight zoom */}
        <motion.div
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-neutral-900 lg:aspect-auto lg:h-[78vh]"
        >
          <motion.div
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.8, ease: EASE }}
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src="/founder.png"
              alt="Founder portrait"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          className="flex flex-col justify-center lg:pl-[4vw] lg:pr-[1vw]"
          style={COND}
        >
          <h3 className="text-[clamp(28px,3.2vw,48px)] font-bold uppercase leading-[1.05] tracking-[-0.01em]">
            Redefining spaces.
            <br />
            <span className="text-[#4a4a4a]">Engineering experiences.</span>
          </h3>

          <div className={`mt-8 max-w-[560px] space-y-5 text-neutral-300 ${COPY_TEXT}`}>
            <p>
              At Taruna Interior, we believe every space should feel like a flawless reflection of the people who
              live in it. What started as a singular passion for spatial design has evolved into a trusted firm known
              for elegant planning and absolute execution.
            </p>
            <p>
              Whether it&apos;s a bespoke luxury home or a commercial marvel, our philosophy remains unwavering: to
              bring your vision to life with complete transparency, uncompromising quality, and unparalleled
              creativity at every single touchpoint.
            </p>
          </div>

          <div className="relative mt-12 flex min-h-[110px] items-center justify-between border-t border-white/20 pt-8">
            <div className="relative z-10">
              <h4 className="text-[24px] font-medium uppercase leading-[1.1]">PunamChand R. Suthar</h4>
              <p className={`mt-2 uppercase text-neutral-500 ${COPY_TEXT}`}>Founder &amp; Lead Designer</p>
            </div>

            <div className="pointer-events-none absolute bottom-2 right-0 w-[55%] max-w-[380px] opacity-80">
              <svg viewBox="100 30 920 270" className="h-auto w-full -rotate-2" aria-hidden="true">
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
        </motion.div>
      </div>
    </section>
  );
}