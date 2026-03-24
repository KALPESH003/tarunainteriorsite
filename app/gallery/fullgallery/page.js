import { projects } from '@/data/projects';
import FullProjectGalleryClient from './FullProjectGalleryClient';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default function FullProjectGalleryPage({ params }) {
  const { id } = params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return <FullProjectGalleryClient project={project} />;
}