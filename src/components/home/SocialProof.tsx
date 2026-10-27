import React from 'react';
import Image from 'next/image';
import { Star, MessageCircle, Heart, Play, ExternalLink } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Kavindi Perera',
    location: 'Colombo 07',
    source: 'Facebook Review',
    text: 'Received the Samadhi Buddha statue today in Colombo! The weight and stone texture are extraordinary in real life. Safely packaged with bubble wrap and the courier took cash on delivery without any issue.',
    product: 'Samadhi Buddha Statue',
    rating: 5,
  },
  {
    id: 2,
    name: 'Tharindu Fernando',
    location: 'Negombo',
    source: 'TikTok Comment',
    text: 'Saw this on TikTok @lolastudio21 and immediately ordered the Sunburst Mandala wall plaque. It transformed our living room entrance. Proud to support local Negombo talent!',
    product: 'Sunburst Mandala Relief',
    rating: 5,
  },
  {
    id: 3,
    name: 'Anuki Jayawardena',
    location: 'Kandy',
    source: 'Instagram DM',
    text: 'Ordered the Sacred Sanctuary gift bundle for my sister’s new apartment. The packaging was so aesthetic, even the handwritten card smelled like cinnamon. She loved it so much!',
    product: 'Sanctuary Gift Bundle',
    rating: 5,
  },
];

const SOCIAL_POSTS = [
  {
    id: 1,
    platform: 'TikTok',
    views: '45.2K views',
    likes: '3.8K',
    title: 'Unmolding our Samadhi Buddha statue ✨ Studio ASMR',
    image: '/FB_IMG_1793104373311.jpg',
    url: 'https://www.tiktok.com/@lolastudio21?_r=1&_t=ZS-9AuDDaKFHC0',
  },
  {
    id: 2,
    platform: 'Instagram',
    views: 'Reel',
    likes: '1.4K',
    title: 'Lotus incense burner waterfall effect 🕯️ Mindful evenings',
    image: '/FB_IMG_1793104253266.jpg',
    url: 'https://www.instagram.com/lola_studio_21?mdxt=MWozank0YWp1NDgzZg==',
  },
  {
    id: 3,
    platform: 'Facebook',
    views: 'Community',
    likes: '890',
    title: 'New gift bundles packed for dispatch islandwide 📦',
    image: '/FB_IMG_1793104474800.jpg',
    url: 'https://www.facebook.com/share/1BHPwwgVWa/',
  },
];

export default function SocialProof() {
  return (
    <section className="py-20 bg-[#FAF7F2] border-b border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-600 font-semibold block mb-2">
            Loved Across Sri Lanka
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
            Real Stories & Social Proof
          </h2>
          <p className="text-xs sm:text-sm text-brand-600 mt-3 font-sans">
            Follow our studio journey on TikTok, Facebook, and Instagram to watch our artisans sculpt in real time.
          </p>
        </div>

        {/* Video & Social Spotlight Carousel/Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {SOCIAL_POSTS.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-soft hover:shadow-floating transition-all bg-black"
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Center Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-brand-950 transition-all shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Meta Overlay */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-bold text-white tracking-wide">
                  {post.platform} • {post.views}
                </span>
              </div>

              <div className="absolute bottom-4 inset-x-4">
                <p className="text-white text-xs font-medium line-clamp-2 leading-relaxed mb-2">
                  {post.title}
                </p>
                <div className="flex items-center justify-between text-[11px] text-white/70">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1 underline font-medium text-brand-200">
                    Watch on {post.platform} <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Written Customer Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-white border border-brand-100 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-zen-gold mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-zen-gold text-zen-gold" />
                  ))}
                </div>
                <p className="text-xs text-brand-800 leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-brand-50 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-brand-950">{t.name}</h4>
                  <p className="text-[11px] text-brand-500">{t.location} • {t.source}</p>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                  Verified COD
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
