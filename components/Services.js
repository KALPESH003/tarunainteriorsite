'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Home, Building2, Key, Sofa, ArrowRight, 
  UtensilsCrossed, Columns, TreePine, Tv, 
  Maximize, Layers, Baby, Briefcase 
} from 'lucide-react';

const servicesData = [
  { 
    id: 'kitchen', 
    title: 'Modular Kitchen', 
    description: 'Ergonomic, high-end culinary spaces tailored for seamless modern living.',
    heightClass: 'h-[350px]', 
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop',
    icon: UtensilsCrossed
  },
  { 
    id: 'wardrobes', 
    title: 'Wardrobes', 
    description: 'Bespoke storage solutions combining deep functionality with elegant facades.',
    heightClass: 'h-[280px]', 
    image: 'https://images.unsplash.com/photo-1771003936708-bfeb23b5d082?q=80&w=600&auto=format&fit=crop',
    icon: Columns
  },
  { 
    id: 'living', 
    title: 'Living Room', 
    description: 'The heart of your home, designed to be visually striking yet intimately comfortable.',
    heightClass: 'h-[400px]', 
    image: 'https://plus.unsplash.com/premium_photo-1676320514018-ec119b57dbce?q=80&w=600&auto=format&fit=crop',
    icon: Sofa
  },
  { 
    id: 'furniture', 
    title: 'Movable Furniture', 
    description: 'Handcrafted, customizable pieces that perfectly adapt to your spatial requirements.',
    heightClass: 'h-[320px]', 
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600&auto=format&fit=crop',
    icon: Sofa
  },
  { 
    id: 'outdoors', 
    title: 'Outdoors', 
    description: 'Transforming balconies and terraces into luxurious open-air retreats.',
    heightClass: 'h-[350px]', 
    image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=600&auto=format&fit=crop',
    icon: TreePine
  },
  { 
    id: 'tv', 
    title: 'TV Units', 
    description: 'Sleek, integrated entertainment centers that hide clutter and highlight design.',
    heightClass: 'h-[280px]', 
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop',
    icon: Tv
  },
  { 
    id: 'spacesaving', 
    title: 'Space-Saving Furnitures', 
    description: 'Smart, transformative mechanics for maximizing utility in compact footprints.',
    heightClass: 'h-[300px]', 
    image: 'https://images.unsplash.com/photo-1771270786606-f5a0e57db762?q=80&w=600&auto=format&fit=crop',
    icon: Maximize
  },
  { 
    id: 'ceiling', 
    title: 'False Ceiling', 
    description: 'Architectural ceiling frameworks integrating ambient lighting and climate control.',
    heightClass: 'h-[320px]', 
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop',
    icon: Layers
  },
  { 
    id: 'kids', 
    title: "Kid's Room", 
    description: 'Safe, imaginative, and highly adaptable spaces that grow alongside your child.',
    heightClass: 'h-[380px]', 
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop',
    icon: Baby
  },
  { 
    id: 'corporate', 
    title: 'Corporates', 
    description: 'Ergonomic workspaces engineered to boost productivity and team collaboration.',
    heightClass: 'h-[350px]', 
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=600&auto=format&fit=crop',
    icon: Briefcase
  },
  { 
    id: 'commercials', 
    title: 'Commercials', 
    description: 'High-impact retail and hospitality designs that elevate your brand identity.',
    heightClass: 'h-[380px]', 
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
    icon: Building2
  },
  { 
    id: 'residential', 
    title: 'Residential', 
    description: 'Bespoke home interiors reflecting your unique personality and standard of living.',
    heightClass: 'h-[280px]', 
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=600&auto=format&fit=crop',
    icon: Home
  },
  { 
    id: 'turnkey', 
    title: 'Turnkey Projects', 
    description: 'End-to-end management from bare shell civil changes to the final decor styling.',
    heightClass: 'h-[300px]', 
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop',
    icon: Key
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 } 
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Services() {
  return (
    <section id="services" className="bg-white py-32 px-6 md:px-12 relative w-full z-20 overflow-hidden border-t border-gray-100">
      
      {/* Light Theme Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none z-0 translate-x-1/4" />
     
      {/* Giant Background Text */}
      <div className="absolute top-24 -right-20 text-[180px] md:text-[220px] lg:text-[280px] font-serif font-bold text-gray-900/5 select-none pointer-events-none z-0 whitespace-nowrap">
        SERVICES
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-brand-blue" />
              <span className="text-brand-blue text-[11px] uppercase tracking-[0.25em] font-bold">Total Transformation</span>
            </div>
            {/* Swapped back to text-gray-900 for Light Mode */}
            <h2 className="text-gray-900 text-4xl md:text-5xl lg:text-[56px] font-serif font-medium tracking-tight leading-[1.1]">
              End-to-End <br />
              <span className="italic text-gray-400 font-light">Interior Solutions.</span>
            </h2>
          </div>
          {/* Swapped back to text-gray-500 for Light Mode */}
          <p className="text-gray-500 text-[13px] md:text-sm font-medium tracking-widest uppercase md:max-w-[200px] md:text-right border-l border-gray-200 md:border-l-0 md:border-r pl-4 md:pl-0 md:pr-4">
            Everything you need for a complete space revival
          </p>
        </motion.div>

        {/* Masonry Grid Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
        >
          {servicesData.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div 
                key={service.id}
                variants={cardVariants}
                className={`group relative rounded-[24px] overflow-hidden break-inside-avoid shadow-[0_10px_30px_rgba(0,0,0,0.05)] cursor-pointer w-full bg-gray-100 ${service.heightClass}`}
              >
                {/* Optimized Next.js Image */}
                <Image 
                  src={service.image} 
                  alt={service.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                />
                
                {/* Dark Gradient Overlay so the white text stays readable over the photos */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                
                {/* Blue tint on hover */}
                <div className="absolute inset-0 bg-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay" />

                {/* Animated Text Block (Slides up on Hover) */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end z-10">
                  
                  {/* Floating Icon */}
                  <div className="w-10 h-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center mb-5 transform transition-all duration-500 group-hover:-translate-y-2 group-hover:border-brand-blue group-hover:bg-brand-blue">
                    <Icon className="w-4 h-4 text-white" strokeWidth={1.5} />
                  </div>

                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <h3 className="text-[20px] font-serif font-medium text-white mb-3">
                      {service.title}
                    </h3>
                    
                    {/* Collapsible Description Box */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                      <div className="overflow-hidden">
                        <p className="text-[13px] text-gray-200 font-light leading-relaxed mb-4 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {service.description}
                        </p>
                        
                        <Link href="/#contact" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-blue hover:text-white transition-colors">
                          Enquire Now
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}