import type { Metadata } from 'next';
import PortfolioPage from '@/components/portfolio/PortfolioPage';

export const metadata: Metadata = {
  title: 'Portfolio | Taruna Interior Gallery',
  description: 'Archive of completed projects and the work currently in progress at Taruna Interior Gallery.',
};

type SP = { tab?: string };

// /projects                 -> Archive tab
// /projects?tab=in-progress -> In progress tab
export default async function Page({ searchParams }: { searchParams?: Promise<SP> | SP }) {
  const sp = (await searchParams) ?? {};
  return <PortfolioPage initialTab={sp.tab === 'in-progress' ? 'in-progress' : 'archive'} />;
}