import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ARCHIVE, IN_PROGRESS } from '@/data/projects';

const ALL = [...ARCHIVE, ...IN_PROGRESS];
const find = (slug: string) => ALL.find((p) => p.slug === slug);

export function generateStaticParams() {
  return ALL.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = find(slug);
  if (!project) return {};
  const description = `${project.title} (${project.year}): an interior design project by Taruna Interior Gallery, Vadodara.`;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: 'article',
      url: `/projects/${slug}`,
      title: project.title,
      description,
      images: [{ url: project.image, alt: project.title }],
    },
    twitter: { card: 'summary_large_image', images: [project.image] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = find(slug);
  if (!project) notFound();
  // ...your page
}