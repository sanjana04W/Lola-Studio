import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandStory from '@/components/home/BrandStory';
import SocialProof from '@/components/home/SocialProof';
import { getProducts } from '@/services/storeService';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export const revalidate = 60; // ISR for optimal mobile PageSpeed (target 80+)

const FAQS = [
  {
    q: 'How does Cash on Delivery (COD) work?',
    a: 'You can order any item directly on our website without entering bank or card details. When our courier partner delivers the carefully packaged parcel to your doorstep anywhere in Sri Lanka, you hand the exact cash to the courier rider.',
  },
  {
    q: 'How long does delivery take across Sri Lanka?',
    a: 'Orders within the Colombo and Gampaha (including Negombo) districts typically arrive within 1 to 2 business days. For outstation districts (Kandy, Galle, Jaffna, etc.), delivery takes 2 to 4 business days. You will receive an SMS and email notification once dispatched.',
  },
  {
    q: 'What materials are used for the Buddha statues and decor?',
    a: 'We use high-density mineral cast stone composites, refined quartz aggregates, natural gypsum, and organic earth pigments. Each piece is non-toxic, moisture-resistant, and hand-finished with velvety smooth touch.',
  },
  {
    q: 'How are fragile items protected during shipping?',
    a: 'We take immense pride in our transit safety. Each piece is nestled in multi-layer shock-absorbing air cushioning, boxed in sturdy corrugated cartons, and labeled with high-visibility Fragile tape. In the rare event of transit damage, we provide an immediate free replacement.',
  },
  {
    q: 'Can I request a custom statue or bulk gift order?',
    a: 'Yes! For wedding souvenirs, corporate mindfulness gifts, or bespoke dimensional modifications, please contact our workshop owner directly via WhatsApp at 075 148 3613.',
  },
];

export default async function HomePage() {
  const products = await getProducts(true);

  return (
    <div>
      <HeroBanner />
      <CategoryShowcase />
      <FeaturedProducts products={products} />
      <BrandStory />
      <SocialProof />

      {/* FAQ Accordion Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-brand-600 font-semibold block mb-2">
              Common Questions
            </span>
            <h2 className="font-serif text-3xl font-bold text-brand-950">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-brand-100 p-5 bg-brand-50/30 open:bg-white open:shadow-soft transition-all"
              >
                <summary className="flex items-center justify-between cursor-pointer font-serif text-base font-semibold text-brand-950 list-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-brand-500 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-brand-700 leading-relaxed font-sans border-t border-brand-100/60 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
