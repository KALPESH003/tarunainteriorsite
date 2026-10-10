import Hero from '../components/Hero';
import About from '../components/about';
import Services from '@/components/Service';
import Stats from '@/components/Stats';
import Portfolioscroll from '@/components/Portfolio';
import Process from '@/components/process';
import Testimonials from '@/components/Testimonials';
import QualityCheck from '@/components/Materials'; 
import Packages from '@/components/package';
import TextMaskScroll from '@/components/TextMaskScroll';

export default function Home() {
  return (
    <main className="relative bg-[#0a0a0a] min-h-screen flex flex-col">

      <Hero />
      <About />
      <Services />
      <Stats />
      <Portfolioscroll />
      <Process />
      <Testimonials />
      <QualityCheck />
      <Packages />
      <TextMaskScroll />

    </main>
  );
}