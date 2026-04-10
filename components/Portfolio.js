'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const featuredProjects = [
  {
    id: 'atharva-ellegance',
    title: 'The Atharva Ellegance',
    category: 'Commercial',
    year: '2019',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'skechers',
    title: 'Skechers',
    category: 'Turnkey Retail',
    year: '2019',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'jagdamba-jewellers',
    title: 'Jagdamba Jewellers',
    category: 'Luxury Retail',
    year: '2020',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'maruti-farmhouse',
    title: 'Maruti Farmhouse',
    category: 'Premium Residential',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Portfolio() {
  return (
    <section id="portfolio" className="bg-white py-32 px-6 md:px-12 relative z-20 w-full overflow-hidden border-t border-gray-100">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#232a8b]/5 blur-[150px] rounded-full pointer-events-none z-0 -translate-y-1/2 translate-x-1/3" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 lg:mb-20 gap-8"
        >
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#232a8b]" />
              <span className="text-[#232a8b] text-[11px] uppercase tracking-[0.25em] font-bold">Signature Work</span>
            </div>
            <h2 className="text-gray-900 text-4xl md:text-5xl lg:text-[56px] font-serif font-medium leading-[1.1] tracking-tight">
              A Legacy of <br />
              <span className="italic text-gray-400 font-light">Masterpieces.</span>
            </h2>
          </div>
          
          <Link href="/portfolio" className="group flex items-center gap-4 pb-2 relative overflow-hidden shrink-0">
            <span className="text-gray-900 font-bold text-[11px] tracking-[0.2em] uppercase relative z-10 transition-colors group-hover:text-[#232a8b]">
              View All Projects
            </span>
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#232a8b] group-hover:bg-[#232a8b]/10 transition-all duration-500">
              <ArrowUpRight className="w-4 h-4 text-gray-900 group-hover:text-[#232a8b] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500" />
            </div>
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10"
        >
          {featuredProjects.map((project) => (
            <motion.div key={project.id} variants={cardVariants} className="group">
              <Link href={`/portfolio/${project.id}`} className="block relative w-full h-[400px] lg:h-[550px] rounded-[2rem] overflow-hidden mb-6 bg-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <Image 
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-700 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out z-20">
                  <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Explore</span>
                  <ArrowUpRight className="w-5 h-5 text-[#232a8b]" />
                </div>
              </Link>
              <div className="flex items-start justify-between px-2">
                <div>
                  <h3 className="text-2xl font-serif text-gray-900 mb-2 group-hover:text-[#232a8b] transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-[12px] text-gray-500 uppercase tracking-widest font-bold">
                    {project.category}
                  </p>
                </div>
                <div className="text-[14px] font-serif italic text-gray-500">
                  {project.year}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
