import { notFound } from 'next/navigation';
import { projects } from '@/data/projects'; 
import ProjectClient from './ProjectClient';

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params; 
  const project = projects.find((p) => p.id === id);
  
  if (!project) return { title: 'Project Not Found | Taruna Interiors' };
  
  return {
    title: `${project.title} | Taruna Interiors Portfolio`,
    description: project.description,
  };
}

export default async function ProjectDetail({ params }) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound(); 
  }

  return <ProjectClient project={project} />;
}

// import { notFound } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ArrowLeft, MapPin, Calendar, Tag } from 'lucide-react';
// import { projects } from '@/data/projects'; // Imports the array we created earlier

// // 1. Generate Static Params (The Secret to Blazing Fast Speeds)
// // This tells Next.js at build time to create a static HTML page for every project in your array.
// export function generateStaticParams() {
//   return projects.map((project) => ({
//     id: project.id,
//   }));
// }

// // 2. Dynamic SEO Metadata
// // Automatically generates the perfect Google title and description for each specific project!
// export function generateMetadata({ params }) {
//   const project = projects.find((p) => p.id === params.id);
  
//   if (!project) return { title: 'Project Not Found | Taruna Interiors' };
  
//   return {
//     title: `${project.title} | Taruna Interiors Portfolio`,
//     description: project.description,
//   };
// }

// // 3. The Page Template (Server Component)
// export default function ProjectDetail({ params }) {
//   // Find the specific project based on the URL (e.g., /portfolio/skechers)
//   const project = projects.find((p) => p.id === params.id);

//   // If someone types a random URL like /portfolio/fake-project, show the 404 page
//   if (!project) {
//     notFound();
//   }

//   return (
//     <main className="bg-[#050505] min-h-screen pt-24 pb-32">
      
//       <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
//         {/* Back Navigation */}
//         <div className="mb-12">
//           <Link href="/#portfolio" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-blue transition-colors text-[11px] uppercase tracking-widest font-bold">
//             <ArrowLeft className="w-4 h-4" />
//             Back to Portfolio
//           </Link>
//         </div>

//         {/* Project Header */}
//         <div className="mb-16">
//           <h1 className="text-5xl md:text-6xl lg:text-[80px] font-serif text-white tracking-tight leading-[1.1] mb-8">
//             {project.title}
//           </h1>
          
//           <div className="flex flex-wrap items-center gap-8 border-t border-b border-white/10 py-6">
//             <div className="flex items-center gap-3">
//               <Tag className="w-4 h-4 text-brand-blue" />
//               <div>
//                 <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Category</p>
//                 <p className="text-white text-sm font-medium">{project.category}</p>
//               </div>
//             </div>
//             <div className="hidden md:block w-[1px] h-8 bg-white/10" />
//             <div className="flex items-center gap-3">
//               <MapPin className="w-4 h-4 text-brand-blue" />
//               <div>
//                 <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Location</p>
//                 <p className="text-white text-sm font-medium">{project.location}</p>
//               </div>
//             </div>
//             <div className="hidden md:block w-[1px] h-8 bg-white/10" />
//             <div className="flex items-center gap-3">
//               <Calendar className="w-4 h-4 text-brand-blue" />
//               <div>
//                 <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Year</p>
//                 <p className="text-white text-sm font-medium">{project.year}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Hero Image */}
//         <div className="relative w-full h-[50vh] md:h-[70vh] rounded-[2rem] overflow-hidden mb-16 shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-[#121212]">
//           <Image 
//             src={project.mainImage}
//             alt={`${project.title} Main View`}
//             fill
//             priority
//             className="object-cover"
//           />
//         </div>

//         {/* Project Description */}
//         <div className="max-w-3xl mx-auto text-center mb-20">
//           <p className="text-[18px] md:text-[22px] text-gray-300 font-light leading-relaxed font-serif italic">
//             &quot;{project.description}&quot;
//           </p>
//         </div>

//         {/* Dynamic Photo Gallery Grid */}
//         {project.gallery && project.gallery.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
//             {project.gallery.map((imgUrl, index) => (
//               <div key={index} className="relative w-full h-[400px] lg:h-[600px] rounded-[2rem] overflow-hidden bg-[#121212]">
//                 <Image 
//                   src={imgUrl}
//                   alt={`${project.title} Gallery Image ${index + 1}`}
//                   fill
//                   className="object-cover hover:scale-105 transition-transform duration-[1.5s]"
//                 />
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Next Steps CTA */}
//         <div className="mt-32 text-center border-t border-white/10 pt-20">
//           <h3 className="text-3xl font-serif text-white mb-6">Inspired by this space?</h3>
//           <Link href="/#contact" className="inline-block px-10 py-4 rounded-full bg-brand-blue text-white text-[12px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors duration-500 shadow-[0_15px_30px_rgba(67,24,255,0.3)]">
//             Start Your Project
//           </Link>
//         </div>

//       </div>
//     </main>
//   );
// }