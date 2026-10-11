import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';
import { SITE } from '@/lib/site';

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

const TITLE = 'Interior Designers in Vadodara | Taruna Interior Gallery';
const OG_DESCRIPTION =
  'Redefining the art of living through bespoke interior solutions: residential, retail and commercial interiors in Vadodara and across India.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: '%s | Taruna Interior Gallery',
  },
  description:
    'Designing spaces that reflect you. Elegant, functional interiors crafted with precision, creativity, and a profound understanding of modern luxury living.',
  applicationName: SITE.name,
  keywords: [
    'Taruna Interior Gallery',
    'Taruna Interiors',
    'Best interior designers in Vadodara',
    'Top interior designers in Vadodara',
    'Luxury interior design',
    'Turnkey interiors',
    'Bespoke design',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_IN',
    url: '/',
    title: TITLE,
    description: OG_DESCRIPTION,
    images: [
      {
        url: '/og-image.jpg', // file must exist at public/og-image.jpg (1200x630)
        width: 1200,
        height: 630,
        alt: 'Taruna Interior Gallery: luxury interior design in Vadodara',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: OG_DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} flex min-h-screen flex-col bg-[#0a0a0a] font-sans text-white antialiased selection:bg-brand-orange selection:text-white`}
        suppressHydrationWarning
      >
        <main className="flex flex-grow flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}