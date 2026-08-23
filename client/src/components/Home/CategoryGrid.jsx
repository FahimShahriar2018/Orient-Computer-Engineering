import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  HardDrive,
  Laptop,
  Monitor,
  Network,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

const ICON_MAP = {
  Cpu: Cpu,
  Layers: Layers,
  HardDrive: HardDrive,
  Laptop: Laptop,
  Monitor: Monitor,
  Network: Network,
};

const DEFAULT_CATEGORIES = [
  {
    name: 'Processors (CPUs)',
    slug: 'processors',
    description: 'Intel 14th Gen & AMD Ryzen 7000/9000',
    icon: 'Cpu',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
    color: 'border-slate-800 hover:border-blue-500/50',
  },
  {
    name: 'Graphics Cards (GPUs)',
    slug: 'graphics-cards',
    description: 'NVIDIA RTX 40-Series & AMD Radeon RX',
    icon: 'Layers',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    color: 'border-slate-800 hover:border-blue-500/50',
  },
  {
    name: 'Motherboards',
    slug: 'motherboards',
    description: 'Intel Z790/B760 & AMD AM5 X670/B650',
    icon: 'HardDrive',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
    color: 'border-slate-800 hover:border-blue-500/50',
  },
  {
    name: 'Laptops & Ultrabooks',
    slug: 'laptops',
    description: 'ASUS ROG, Lenovo Legion & Creator Series',
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
    color: 'border-slate-800 hover:border-blue-500/50',
  },
  {
    name: 'Monitors & Displays',
    slug: 'monitors',
    description: '4K UHD, 240Hz OLED & Ultrawide Curved',
    icon: 'Monitor',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    color: 'border-slate-800 hover:border-blue-500/50',
  },
  {
    name: 'Networking & IT Security',
    slug: 'networking-engineering',
    description: 'MikroTik Switches, WiFi 6 & 4K CCTV',
    icon: 'Network',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    color: 'border-slate-800 hover:border-blue-500/50',
  },
];

export default function CategoryGrid() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success && res.data.categories.length > 0) {
          // Merge API data with images/styling
          const merged = res.data.categories.slice(0, 6).map((cat, idx) => ({
            ...cat,
            image: cat.image || DEFAULT_CATEGORIES[idx]?.image || DEFAULT_CATEGORIES[0].image,
            color: DEFAULT_CATEGORIES[idx]?.color || DEFAULT_CATEGORIES[0].color,
          }));
          setCategories(merged);
        }
      } catch (e) {
        // Fallback to DEFAULT_CATEGORIES
      }
    };
    loadCategories();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span>Explore Hardware Departments</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Browse our comprehensive inventory of genuine PC components & enterprise gear.
          </p>
        </div>

        <Link
          to="/shop"
          className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>View All Departments</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || Cpu;
          return (
            <Link
              key={cat.slug || cat.name}
              to={`/shop?category=${cat.slug}`}
              className="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 p-5 flex items-center justify-between group transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="relative z-10 space-y-2 max-w-[65%]">
                <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {cat.description || 'Explore official models & specs'}
                  </p>
                </div>
                <div className="inline-flex items-center space-x-1 text-xs font-medium text-blue-400 group-hover:text-blue-300 transition-colors pt-1">
                  <span>Shop Department</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Image Thumbnail */}
              <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-800/60 border border-slate-700/80 flex-shrink-0 flex items-center justify-center p-2">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
