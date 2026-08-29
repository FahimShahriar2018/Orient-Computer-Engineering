import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowRight,
  Flame,
  Tv,
  Sun,
  ShieldCheck,
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'OFFICIAL VIEWSONIC DISTRIBUTOR',
    title: 'ViewSonic ViewBoard 86" & 75" 4K EDLA Interactive Displays',
    description:
      'Google EDLA Certified with native Play Store, 40-point ultra fine touch, 45W stereo soundbar, and official 3-year on-site warranty for smart classrooms & corporate boardrooms.',
    priceBadge: 'Enterprise & Education',
    link: '/shop?category=audio-visual',
    ctaText: 'Explore Interactive Flat Panels',
    image: 'https://orientcomputers.com.bd/uploads/banner/2025-05-10-681f08e42f534.webp',
  },
  {
    id: 2,
    tag: 'RENEWABLE SOLAR & ESS',
    title: 'SAKO Alpha ESS & Li-Cube 51.2V Lithium Power Storage',
    description:
      'Zero-maintenance high cycle Lithium Iron Phosphate (LiFePO4) solar storage systems with pure sinewave hybrid inverters for nonstop 24/7 backup power.',
    priceBadge: 'Up to 5-Yr Warranty',
    link: '/shop?category=renewable-energy',
    ctaText: 'Explore Solar & ESS',
    image: 'https://orientcomputers.com.bd/uploads/banner/2025-07-20-687c7e923e4ae.webp',
  },
  {
    id: 3,
    tag: 'ENTERPRISE POWER BACKUP',
    title: 'Apollo & Kstar Online & Offline UPS Solutions',
    description:
      'True online double conversion zero-transfer UPS and maintenance-free sealed lead acid AGM batteries for data centers, hospitals, and workstations across Bangladesh.',
    priceBadge: '100% Genuine Warranty',
    link: '/shop?category=ups',
    ctaText: 'Explore UPS & Batteries',
    image: 'https://orientcomputers.com.bd/uploads/banner/2025-07-20-687c805ebdf52.webp',
  },
  {
    id: 4,
    tag: 'EXTREME HARDWARE & PERIPHERALS',
    title: 'Patriot Viper DDR5 RAM & TrendSonic Displays',
    description:
      'Patriot Viper Elite 5 RGB DDR5 5600MHz memory, ultra-fast 2000MB/s external SSDs, and TrendSonic 100Hz IPS frameless monitors with official importer replacement guarantee.',
    priceBadge: 'Official Importer Stock',
    link: '/shop?category=pc-component',
    ctaText: 'Shop PC Components',
    image: 'https://orientcomputers.com.bd/uploads/banner/2025-05-10-681f08e42f534.webp',
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* 1. Main Hero Carousel (8 Cols on Desktop) */}
      <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between min-h-[440px] sm:min-h-[480px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center opacity-30 filter blur-[0.5px] scale-105 transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />
        </div>

        {/* Slide Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col justify-between h-full">
          <div className="max-w-xl space-y-3.5">
            {/* Tag */}
            <div className="flex flex-wrap items-center gap-2.5">
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
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
              {slide.description}
            </p>

            {/* Action CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link
                to={slide.link}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md flex items-center space-x-2 transition-colors active:scale-95"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                to="/shop"
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                Browse Catalog
              </Link>
            </div>
          </div>

          {/* Slide Indicators & Navigation Arrows */}
          <div className="pt-6 flex items-center justify-between">
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

            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Side Promotional Ad Cards (4 Cols on Desktop) */}
      <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-5 justify-between">
        {/* Ad 1: ViewSonic Smart Projector */}
        <Link
          to="/shop?category=audio-visual"
          className="group relative flex-1 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-950/60 via-slate-900 to-[#0F172A] border border-purple-900/30 p-5 sm:p-6 flex flex-col justify-between shadow-xl hover:border-purple-500/50 transition-all duration-300"
        >
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-block">
              FEATURED AUDIO VISUAL
            </span>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              ViewSonic M2e Smart 1080p LED Projector
            </h3>
            <p className="text-xs text-slate-400">
              Harman Kardon Audio with Instant Auto-Focus & Cinema SuperColor+.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <span className="text-sm font-extrabold text-amber-400 font-heading">
              ৳78,000
            </span>
            <span className="text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
              <span>View Deal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>

        {/* Ad 2: SAKO Alpha ESS System */}
        <Link
          to="/shop?category=renewable-energy"
          className="group relative flex-1 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-950/60 via-slate-900 to-[#0F172A] border border-blue-900/30 p-5 sm:p-6 flex flex-col justify-between shadow-xl hover:border-blue-500/50 transition-all duration-300"
        >
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block">
              PORTABLE SOLAR POWER
            </span>
            <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
              SAKO Alpha ESS 300W Energy Storage
            </h3>
            <p className="text-xs text-slate-400">
              Pure sine wave AC 220V + Solar charging + 45W Type-C fast charge.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <span className="text-sm font-extrabold text-emerald-400 font-heading">
              ৳29,500
            </span>
            <span className="text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
              <span>Shop Energy</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

