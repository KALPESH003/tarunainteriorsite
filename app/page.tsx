import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/icon-512.png`,
  image: `${SITE.url}/og-image.png`,
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

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0a0a0a]">
      <JsonLd data={schema} />

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
    </div>
  );
}