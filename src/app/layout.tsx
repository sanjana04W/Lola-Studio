import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import PixelScripts from '@/components/common/PixelScripts';

export const metadata: Metadata = {
  title: 'Lola Studio | Handcrafted Zen & Artisanal Home Decor Sri Lanka',
  description:
    'Discover artisan-crafted Buddha statues, mineral stone incense burners, architectural wall art, and curated gift bundles. Handcrafted in Negombo, Sri Lanka with Islandwide Cash on Delivery (COD).',
  keywords: [
    'handmade home decor Sri Lanka',
    'Budupilima',
    'minimalist home decor Negombo',
    'Buddha statue Sri Lanka online',
    'Lola Studio Negombo',
    'Lola Studio Sri Lanka',
    'aesthetic room decor Sri Lanka COD',
    'buy home decor online Sri Lanka cash on delivery',
    'incense burner Sri Lanka',
    'mindful gifts Negombo'
  ],
  openGraph: {
    title: 'Lola Studio | Handcrafted Zen & Artisanal Home Decor',
    description: 'Mindfully sculpted Buddha statues and modern stone home decor in Negombo, Sri Lanka. Cash on delivery islandwide.',
    url: 'https://lolastudio.lk',
    siteName: 'Lola Studio',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'Lola Studio Artisanal Decor',
      },
    ],
    locale: 'en_LK',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#22201E]">
        <AuthProvider>
          <CartProvider>
            <PixelScripts />
            <Navbar />
            <CartDrawer />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
