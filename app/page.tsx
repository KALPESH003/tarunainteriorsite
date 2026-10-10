import JsonLd from '@/components/JsonLd';
import { SITE } from '@/lib/site';

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

const schema = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/opengraph-image`,
  description: SITE.description,
  email: SITE.email,
  telephone: SITE.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    addressCountry: SITE.address.country,
  },
  areaServed: 'Vadodara, Gujarat',
  sameAs: SITE.socials,
};

// inside the page component's JSX:
// <JsonLd data={schema} />


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