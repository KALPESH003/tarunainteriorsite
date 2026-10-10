'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SectionHeader, { COND, EASE, fontVars } from '@/components/SectionHeader';

type Project = { id: string; title: string; category: string; year: string; mainImage: string };

const fallbackProjects: Project[] = [
  { id: 'taruna-residence', title: 'Taruna Residence', category: 'Residential', year: '2025', mainImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop' },
  { id: 'skechers-flagship', title: 'Skechers Flagship', category: 'Commercial', year: '2024', mainImage: 'https://images.unsplash.com/photo-1567449303183-ae0d6ed1498e?q=80&w=1200&auto=format&fit=crop' },
  { id: 'lumina-workspace', title: 'Lumina Workspace', category: 'Corporate', year: '2024', mainImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop' },
  { id: 'the-glass-house', title: 'The Glass House', category: 'Architecture', year: '2023', mainImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop' },
];

export default function AllProjectsClient({ projects = fallbackProjects }: { projects?: Project[] }) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <main className={`${fontVars} relative min-h-screen overflow-hidden bg-black pb-[max(64px,6vw)] pt-24 text-white`}>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="px-[max(16px,2.3vw)]"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.1em] text-neutral-400 outline-none transition-colors duration-300 hover:text-white focus-visible:text-white"
          style={COND}
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to home
        </Link>
      </motion.div>

      <SectionHeader theme="dark" side="right" num="03" lines={['SELECTED', 'WORKS']} ghost="ARCHIVE" />

      <div className="grid grid-cols-1 gap-x-[max(6px,0.7vw)] gap-y-[max(32px,3vw)] px-[max(16px,2.3vw)] md:grid-cols-2">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE, delay: index % 2 === 0 ? 0 : 0.12 }}
          >
            <Link href={`/portfolio/${project.id}`} className="group block w-full outline-none">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[10px] bg-neutral-900 group-focus-visible:ring-2 group-focus-visible:ring-white">
                <Image
                  src={project.mainImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
                />
              </div>
              <div className="flex items-center justify-between px-1 pt-4 text-[12px] uppercase md:text-[13px]" style={COND}>
                <span className="flex gap-3.5">
                  <span className="text-[#6f6f6f]">{String(index + 1).padStart(2, '0')}/</span>
                  <span className="font-medium text-white">{project.title}</span>
                </span>
                <span className="text-[#8a8a8a]">
                  {project.category} · {project.year}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}