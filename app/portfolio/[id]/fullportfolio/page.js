import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import FullPortfolioClient from './FullPortfolioClient';

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  
  if (!project) return { title: 'Gallery Not Found' };
  
  return {
    title: `${project.title} Gallery | Taruna Interiors`,
  };
}

export default async function FullPortfolioPage({ params }) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return <FullPortfolioClient project={project} />;
}