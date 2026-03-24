import Hero from '@/components/Hero';
import Features from '@/components/Features';
import WhyUs from '@/components/WhyUs';
import Services from '@/components/Services';
import OwnerProfile from '@/components/OwnerProfile';
import Stats from '@/components/Stats';
import Portfolio from '@/components/Portfolio';
import Gallery from '@/components/Gallery';
import ClientCarousel from '@/components/ClientCarousel';
import Testimonials from '@/components/Testimonials';
import Location from '@/components/LocationMap';
import ContactForm from '@/components/ContactForm';
import WhatsappConcierge from '@/components/WhatsappConcierge';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  return (
    <main className="relative bg-[#0a0a0a] min-h-screen overflow-hidden flex flex-col">
      
      {/* 1. Impactful Entrance */}
      <Hero />
      
      {/* 2. Trust Indicators immediately after the fold */}
      <Features />

      {/* 3. The Taruna Brand Story */}
      <WhyUs />
      <Services />
      
      {/* 4. The Visionary / Founder Section */}
      <OwnerProfile />

      {/* 5. Company Milestones */}
      <Stats />

      {/* 6. Visual Proof & Case Studies */}
      <Portfolio />
      <Gallery />

      {/* 7. Social Proof */}
      <ClientCarousel />
      <Testimonials />

      {/* 8. Granular Offerings & Reach */}
      <Location />

      {/* 9. Lead Generation */}
      <ContactForm />

      {/* Floating Concierge */}
      <WhatsappConcierge />
      <ScrollToTop />

    </main>
  );
}