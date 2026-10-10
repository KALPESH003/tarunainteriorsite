import type { Metadata } from 'next';
import PortfolioPage from '@/components/portfolio/PortfolioPage';

export const metadata: Metadata = {
  title: 'Portfolio | Taruna Interior Gallery',
  description: 'Explore completed interior projects and work in progress by Taruna Interior Gallery: retail showrooms, luxury apartments, offices and private residences in Vadodara.',
  alternates: { canonical: '/projects' },
  openGraph: { url: '/projects', title: 'Portfolio | Taruna Interior Gallery' },
};

type SP = { tab?: string };

// /projects                 -> Archive tab
// /projects?tab=in-progress -> In progress tab
export default async function Page({ searchParams }: { searchParams?: Promise<SP> | SP }) {
  const sp = (await searchParams) ?? {};
  return <PortfolioPage initialTab={sp.tab === 'in-progress' ? 'in-progress' : 'archive'} />;
}