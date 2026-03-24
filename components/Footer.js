'use client';
import Link from 'next/link';
import { Send, Phone, Mail, MapPin, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  // Dynamically grab the current year so your copyright is always up to date
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] pt-32 pb-12 w-full text-gray-400 border-t border-white/5 relative z-20 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 pb-20 border-b border-white/5">
            
          {/* Column 1: Brand & About */}
          <div className="lg:col-span-4 flex flex-col space-y-8">
            <Link href="/" className="flex items-center space-x-3 group cursor-pointer w-fit">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-blue transition-colors duration-500">
                {/* Simplified Logo Icon */}
                <svg className="w-5 h-5 text-brand-blue transform group-hover:rotate-180 transition-transform duration-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.8l5 4.5V18H7v-7.7l5-4.5z"/>
                </svg>
              </div>
              <div className="flex items-baseline">
                <span className="text-white font-bold text-2xl tracking-tighter">Taruna</span>
                <span className="text-brand-blue text-sm ml-1 italic font-serif opacity-80">interiors.</span>
              </div>
            </Link>
            
            <p className="text-[15px] leading-relaxed max-w-[320px] font-light text-gray-500">
              Redefining the art of living through bespoke interior solutions that harmonize luxury with functionality.
            </p>
            
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 hover:scale-110">
                <Twitter className="w-4 h-4 fill-current" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 hover:scale-110">
                <Linkedin className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-white text-[11px] font-bold tracking-[0.3em] uppercase mb-8">Navigation</h4>
            <ul className="space-y-4 text-[14px]">
              {[
                { name: 'The Experience', path: '/#why-us' },
                { name: 'Bespoke Services', path: '/#services' },
                { name: 'Signature Work', path: '/portfolio' },
                { name: 'Our Vision', path: '/#about' }
              ].map((link) => (
                <li key={link.name} className="group flex items-center gap-0 hover:gap-3 transition-all duration-300">
                  <div className="w-0 h-[1px] bg-brand-blue group-hover:w-4 transition-all duration-300" />
                  <Link href={link.path} className="group-hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="lg:col-span-3 flex flex-col">
            <h4 className="text-white text-[11px] font-bold tracking-[0.3em] uppercase mb-8">Contact</h4>
            <div className="space-y-6 text-[14px]">
              <div className="group flex items-start gap-4">
                <Phone className="w-4 h-4 mt-1 text-brand-blue shrink-0" />
                <a href="tel:+919586396373" className="group-hover:text-white transition-colors">+91 95863 96373</a>
              </div>
              <div className="group flex items-start gap-4">
                <Mail className="w-4 h-4 mt-1 text-brand-blue shrink-0" />
                <a href="mailto:hello@tarunainterior.com" className="group-hover:text-white transition-colors">hello@tarunainterior.com</a>
              </div>
              <div className="group flex items-start gap-4">
                <MapPin className="w-4 h-4 mt-1 text-brand-blue shrink-0" />
                <p className="leading-relaxed group-hover:text-white transition-colors">
                  Laxmi Nagar, New Sama, <br /> Vadodara, Gujarat
                </p>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter Form */}
          <div className="lg:col-span-3 flex flex-col">
            <h4 className="text-white text-[11px] font-bold tracking-[0.3em] uppercase mb-8">The Insider</h4>
            <p className="text-[13px] mb-6 font-light">Join our elite list for quarterly design inspirations.</p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                required
                placeholder="Email Address" 
                className="w-full bg-white/5 border-b border-white/10 py-3 text-[13px] text-white focus:outline-none focus:border-brand-blue transition-all peer" 
              />
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
              <button type="submit" className="absolute right-0 bottom-3 text-brand-blue hover:text-white transition-colors transform hover:translate-x-1 hover:-translate-y-1">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>

        {/* Watermark Logo */}
        <div className="pt-20 text-center select-none pointer-events-none opacity-[0.02]">
          <h2 className="text-[12vw] font-serif font-black tracking-tighter leading-none text-white">TARUNA</h2>
        </div>

        {/* Copyright & Legal */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-[0.2em] text-gray-600 font-bold">
          <p>&copy; {currentYear} Taruna Interiors. Designed for Luxury.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>

      </div>
      
      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-blue" />
    </footer>
  );
}