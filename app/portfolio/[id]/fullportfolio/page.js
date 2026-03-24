import { projects } from '@/data/projects';
import FullPortfolioClient from './FullPortfolioClient';
import { notFound } from 'next/navigation';

// Generates static paths for lightning-fast loading
export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default function FullPortfolioPage({ params }) {
  const { id } = params;
  const project = projects.find((p) => p.id === id);

  // If the user types a random URL, send them to a 404 page
  if (!project) {
    notFound();
  }

  // Pass the found project to your Client Component
  return <FullPortfolioClient project={project} />;
}