import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// 1. Optimized Google Font Loading
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-serif',
  display: 'swap',
});

// 2. Global SEO Metadata
export const metadata = {
  metadataBase: new URL('https://tarunainteriors.netlify.app'),
  title: 'Taruna Interior gallery', 
  description: 'Designing spaces that reflect you. Elegant, functional interiors crafted with precision, creativity, and a profound understanding of modern luxury living.',
  keywords: ['Taruna Interior gallery, Taruna Interiors','Best interior designers in Vadodara', 'Top interior designers in Vadodara', 'Luxury Interior Design', 'Vadodara Interiors', 'Bespoke Design', 'Pan India'],
  openGraph: {
    title: 'Taruna Interior gallery',
    description: 'Redefining the art of living through bespoke interior solutions.',
    url: 'https://tarunainteriors.netlify.app',
    siteName: 'Taruna Interiors',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      }, 
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

// 3. The Root HTML Shell
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body 
        className={`
          ${inter.variable} 
          ${playfair.variable} 
          font-sans 
          text-white 
          bg-[#0a0a0a] 
          min-h-screen 
          flex 
          flex-col 
          selection:bg-brand-orange 
          selection:text-white 
          antialiased
        `}suppressHydrationWarning
      >
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
        
      </body>
    </html>
  );
}