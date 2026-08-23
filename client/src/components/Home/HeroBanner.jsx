import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Flame,
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'NEXT-GEN GRAPHICS MONSTER',
    title: 'NVIDIA GeForce RTX 4090 OC 24GB GDDR6X',
    description:
      'Experience ultimate 4K ray tracing, DLSS 3.5 frame generation, and AI workstation performance with official brand replacement warranty.',
    priceBadge: 'From ৳2,59,000',
    link: '/shop?category=graphics-cards',
    ctaText: 'Explore RTX 40-Series',
    badgeColor: 'orange',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    tag: 'FLAGSHIP GAMING PROCESSORS',
    title: 'AMD Ryzen 7 7800X3D & Intel 14th Gen i9',
    description:
      'Dominate esports and heavy multi-threaded productivity with huge 3D V-Cache and up to 6.0 GHz Turbo clock speeds.',
    priceBadge: 'Up to 15% OFF',
    link: '/shop?category=processors',
    ctaText: 'Shop Processors',
    badgeColor: 'blue',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    tag: 'CREATOR & GAMING LAPTOPS',
    title: 'ASUS ROG Zephyrus G16 OLED 240Hz Display',
    description:
      'Intel Core Ultra 9 with AI Boost NPU, RTX 4080 graphics, and stunning 2.5K OLED Nebula display in a precision CNC aluminum unibody.',
    priceBadge: 'Official 2-Yr Warranty',
    link: '/shop?category=laptops',
    ctaText: 'View Laptops',
    badgeColor: 'purple',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    tag: 'ENTERPRISE IT & SECURITY',
    title: 'MikroTik 10G PoE Switches & Dahua 4K CCTV',
    description:
      'Turnkey IT infrastructure, managed fiber switches, and AI perimeter surveillance systems for businesses across Bangladesh.',
    priceBadge: 'Engineering Support Included',
    link: '/shop?category=networking-engineering',
    ctaText: 'Explore Solutions',
    badgeColor: 'emerald',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80',
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
      {/* Background Image with Dark Vignette & Color Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover object-center opacity-25 filter blur-[1px] scale-105 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />
      </div>

      {/* Slide Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-20 lg:py-24 flex flex-col justify-between min-h-[460px] sm:min-h-[500px]">
        <div className="max-w-2xl space-y-4">
          {/* Tag & Offer Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{slide.tag}</span>
            </span>

            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>{slide.priceBadge}</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            {slide.title}
          </h1>

          {/* Description */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
            {slide.description}
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              to={slide.link}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md flex items-center space-x-2 transition-colors active:scale-95"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/shop"
              className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm transition-colors"
            >
              Browse All Hardware
            </Link>
          </div>
        </div>

        {/* Slide Indicators & Navigation Arrows */}
        <div className="pt-8 flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center space-x-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center space-x-2">
            <button
              onClick={prevSlide}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
