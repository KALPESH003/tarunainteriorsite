import PortfolioClient from './PortfolioClient';
import { projects } from '@/data/projects'; 

export const metadata = {
  title: 'All Projects | Taruna Interiors',
  description: 'Explore our complete portfolio of premium interior design and architectural projects.',
};

export default function PortfolioPage() {
  return <PortfolioClient projects={projects} />;
}