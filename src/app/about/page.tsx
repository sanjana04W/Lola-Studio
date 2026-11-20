import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Truck,
  Heart,
  Hammer,
  Palette,
  Leaf,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
} from 'lucide-react';

const CRAFT_STEPS = [
  {
    step: '01',
    title: 'Design & Mudra Study',
    description:
      'Each piece begins with careful anatomical sketching adhering to traditional Buddhist mudra iconography, sacred geometry, and modern Japandi proportions.',
    icon: CompassIcon,
  },
  {
    step: '02',
    title: 'Proprietary Mineral Casting',
    description:
      'We blend refined quartz aggregates, natural gypsum, and organic earth pigments to achieve cool geological heft and velvety tactile smoothness.',
    icon: Hammer,
  },
  {
    step: '03',
    title: 'Slow Curing & Hand Burnishing',
    description:
      'Pieces undergo slow moisture-controlled curing, followed by rigorous hand-sanding and edge-softening by our artisans in Negombo.',
    icon: Palette,
  },
  {
    step: '04',
    title: 'Shock-Proof Transit Packaging',
    description:
      'Every delicate sculpture is nestled in multi-layer shock-absorbing air cushions and heavy corrugated boxing to ensure 100% damage-free delivery.',
    icon: ShieldCheck,
  },
];

function CompassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

const FAQ_ITEMS = [
  {
    q: 'Where are Lola Studio creations made?',
    a: 'Every piece is exclusively sculpted, cast, and finished by hand at our independent workshop in Negombo, Sri Lanka.',
  },
  {
    q: 'What materials do you use?',
    a: 'We use non-toxic, eco-conscious mineral cast stone composites, refined quartz sands, natural gypsum, and organic mineral earth pigments. We never use cheap, hollow plastics.',
  },
  {
    q: 'How does Cash on Delivery (COD) work?',
    a: 'Simply browse our online catalogue, add items to your bag, and place your order without entering any credit card details. When our courier brings the parcel to your doorstep anywhere in Sri Lanka, you hand the exact cash to the rider.',
  },
  {
    q: 'Do you accept bespoke or custom gift bundle orders?',
    a: 'Yes! For wedding souvenir sets, corporate mindfulness gifts, or custom color requirements, message our workshop owner directly via WhatsApp at 075 148 3613.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2] text-[#22201E]">
      {/* ── 1. Hero Section ── */}
      <section className="relative py-20 lg:py-28 bg-white border-b border-[#E8E4DC] overflow-hidden">
        {/* Soft atmospheric gradient blurs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#C5A059]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#E8E4DC]/60 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E4DC] shadow-sm text-[#7A756B] text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Artisanal Heritage · Negombo, Sri Lanka</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#22201E] leading-[1.15] tracking-tight">
            Mindful Artistry, Sculpted with Reverence.
          </h1>

          <p className="text-sm sm:text-base text-[#7A756B] leading-relaxed max-w-2xl mx-auto font-sans">
            Lola Studio is an independent Sri Lankan craft workshop dedicated to hand-poured Buddhist iconography, modern zen accents, and timeless stone decor designed to ground contemporary living sanctuaries in peace.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-[#7A756B]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> 100% Handcrafted Locally
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> Islandwide Cash on Delivery
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> Zero Mass-Produced Plastics
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. Origin & Studio Story with User-Uploaded Photos ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#C5A059] font-bold block">
                Our Genesis
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22201E] leading-tight">
                From Raw Mineral Quartz to Mindful Sanctuaries
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#7A756B] leading-relaxed font-sans">
              Founded in coastal Negombo by an artisan with a deep reverence for Buddhist sculpting traditions and modern architectural minimalism, Lola Studio began with a simple observation: modern Sri Lankan homes were increasingly furnished with imported, mass-manufactured hollow plastic ornaments that lacked heft, tactile presence, and spiritual warmth.
            </p>

            <p className="text-xs sm:text-sm text-[#7A756B] leading-relaxed font-sans">
              We chose an uncompromising alternative: formulating proprietary composite mineral stones blended with quartz sands, natural gypsum, and organic earth pigments. Every statue, incense terrace, fluted candle vessel, and wall relief is individually poured, cured to geological density, and hand-burnished to a velvety matte finish.
            </p>

            <p className="text-xs sm:text-sm text-[#7A756B] leading-relaxed font-sans">
              When you hold a Lola Studio creation, you immediately feel its substantial weight, cooling mineral touch, and subtle organic micro-variations that ensure your piece is singularly unique.
            </p>

            {/* Workshop Address Callout */}
            <div className="p-4 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E8E4DC] flex items-center justify-center text-[#C5A059] flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-[#22201E]">Workshop Location</p>
                <p className="text-[#7A756B]">Negombo, Western Province, Sri Lanka</p>
                <p className="text-[11px] text-[#A09890]">Dispatching orders 6 days a week islandwide via trusted courier partners.</p>
              </div>
            </div>
          </div>

          {/* Dual Photo Collage (User's Exact Uploaded Photos) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-soft hover:shadow-lifted transition-all duration-300 border-2 border-white bg-[#F0EDE8]">
                <Image
                  src="FB_IMG_1793101721888.webp"
                  alt="Lola Studio Handcrafted Aroma & Decor Set"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E8E4DC] text-center shadow-sm">
                <p className="font-serif text-xs font-bold text-[#22201E]">Artisan Home Accents</p>
                <p className="text-[10px] text-[#A09890] mt-0.5">Aromatics, trays &amp; small sculptures</p>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-4 rounded-2xl bg-white border border-[#E8E4DC] text-center shadow-sm">
                <p className="font-serif text-xs font-bold text-[#22201E]">Sacred Zen Iconography</p>
                <p className="text-[10px] text-[#A09890] mt-0.5">Buddha &amp; Ganesha altar pieces</p>
              </div>
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-soft hover:shadow-lifted transition-all duration-300 border-2 border-white bg-[#F0EDE8]">
                <Image
                  src="FB_IMG_1793106129719.webp"
                  alt="Lola Studio Buddha & Ganesha Altar Set"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Four-Step Craft Process ── */}
      <section className="py-20 bg-white border-y border-[#E8E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#C5A059] font-bold block">
              The Artisan Method
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22201E]">
              How Every Piece Comes to Life
            </h2>
            <p className="text-xs sm:text-sm text-[#7A756B] leading-relaxed">
              We reject mass assembly lines. Each creation follows an unhurried four-stage ritual of craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CRAFT_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E8E4DC] shadow-sm hover:shadow-soft transition-all space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#C5A059] tracking-wider">
                      STEP {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#E8E4DC] flex items-center justify-center text-[#22201E] group-hover:text-[#C5A059] group-hover:border-[#C5A059]/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#22201E] pt-1">{item.title}</h3>
                  <p className="text-xs text-[#7A756B] leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Guiding Studio Pillars ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#C5A059] font-bold block">
            Core Values
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22201E]">
            Our Guiding Commitments
          </h2>
          <p className="text-xs sm:text-sm text-[#7A756B]">
            What sets every Lola Studio creation apart in homes across Sri Lanka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="p-8 rounded-3xl bg-white border border-[#E8E4DC] shadow-sm hover:shadow-soft transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#22201E]">Spiritual Reverence</h3>
            <p className="text-xs text-[#7A756B] leading-relaxed">
              Every Buddhist sculpture adheres faithfully to ancient Dhyana, Abhaya, and Dharmachakra mudra proportions, sculpted with meditative clarity and devotion rather than commercial haste.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E8E4DC] shadow-sm hover:shadow-soft transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center font-bold">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#22201E]">Tactile Modernity</h3>
            <p className="text-xs text-[#7A756B] leading-relaxed">
              We marry authentic Sri Lankan craft soul with serene Japandi and Nordic minimalism. Organic neutral hues—warm ivory, oat, and charcoal basalt—elevate any contemporary home or altar.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E8E4DC] shadow-sm hover:shadow-soft transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#22201E]">Safe Transit &amp; COD</h3>
            <p className="text-xs text-[#7A756B] leading-relaxed">
              We guarantee 100% transit safety across all 25 districts of Sri Lanka. Hand cash to the courier upon delivery only after receiving your carefully inspected, bubble-wrapped parcel.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. Frequently Asked Questions ── */}
      <section className="py-20 bg-white border-y border-[#E8E4DC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#C5A059] font-bold block">
              Transparency
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#22201E]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8E4DC] shadow-sm space-y-2"
              >
                <h3 className="font-serif text-sm font-bold text-[#22201E]">{item.q}</h3>
                <p className="text-xs text-[#7A756B] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Direct Workshop Connection & CTA ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#E8E4DC] bg-white shadow-soft relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#C5A059] font-bold block">
              Direct Workshop Support
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#22201E]">
              Have a Custom Request or Gift Inquiry?
            </h2>
            <p className="text-xs sm:text-sm text-[#7A756B] leading-relaxed">
              Whether you are preparing a wedding blessing bundle, a housewarming sanctuary, or need dimensions advice, our owner is available directly via WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href="https://wa.me/94751483613?text=Hello%20Lola%20Studio!%20I%20would%20like%20to%20inquire%20about%20your%20handcrafted%20creations."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Workshop</span>
            </a>

            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#22201E] hover:bg-[#33302C] text-white font-sans text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Explore Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
