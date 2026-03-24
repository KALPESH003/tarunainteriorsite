import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// 1. Optimized Google Font Loading
// These will automatically map to your Tailwind CSS variables
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
// This ensures your client's site looks highly professional on Google and WhatsApp
export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Taruna Interiors', 
  description: 'Designing spaces that reflect you. Elegant, functional interiors crafted with precision, creativity, and a profound understanding of modern luxury living.',
  keywords: ['Taruna Interiors','Best interior designers in Vadodara', 'Top interior designers in Vadodara', 'Luxury Interior Design', 'Vadodara Interiors', 'Bespoke Design', 'Pan India'],
  openGraph: {
    title: 'Taruna Interiors',
    description: 'Redefining the art of living through bespoke interior solutions.',
    url: 'https://tarunainterior.com',
    siteName: 'Taruna Interiors',
    images: [
      {
        url: '/og-image.jpg', // Create a nice preview image and drop it in your /public folder
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
          selection:bg-brand-blue 
          selection:text-white 
          antialiased
        `}
      >
        {/* The Navbar will sit at the top of every single page */}
        <Navbar />
        
        {/* The current page content gets injected here and expands to fill the space */}
        <main className="flex-grow">
          {children}
        </main>

        {/* The Footer will sit at the bottom of every single page */}
        <Footer />
        
      </body>
    </html>
  );
}