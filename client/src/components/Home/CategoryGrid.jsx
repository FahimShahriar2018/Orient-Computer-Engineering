import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sun,
  Tv,
  Zap,
  ShieldCheck,
  BatteryCharging,
  Briefcase,
  Radio,
  Cpu,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

const ICON_MAP = {
  Sun: Sun,
  Tv: Tv,
  Zap: Zap,
  ShieldCheck: ShieldCheck,
  BatteryCharging: BatteryCharging,
  Briefcase: Briefcase,
  Radio: Radio,
  Cpu: Cpu,
};

const DEFAULT_CATEGORIES = [
  {
    name: 'Renewable Energy & ESS',
    slug: 'renewable-energy',
    route: '/renewable-energy',
    description: 'Solar inverters, hybrid systems & Lithium power storage',
    icon: 'Sun',
    image: 'https://orientcomputers.com.bd/uploads/category/2025-07-20-687c8cfc6a6af.png',
  },
  {
    name: 'Audio Visual & Displays',
    slug: 'audio-visual',
    route: '/audio-visual',
    description: '4K Interactive Flat Panels (IFP) & smart projectors',
    icon: 'Tv',
    image: 'https://orientcomputers.com.bd/uploads/category/2025-05-10-681f35e6463cd.png',
  },
  {
    name: 'UPS Systems',
    slug: 'ups',
    route: '/ups',
    description: 'High-frequency online & line-interactive offline UPS',
    icon: 'Zap',
    image: 'https://orientcomputers.com.bd/uploads/category/2025-07-20-687c8ce030c77.png',
  },
  {
    name: 'IPS & Inverters',
    slug: 'ips',
    route: '/ips',
    description: 'Pure sinewave & digital home backup inverters',
    icon: 'ShieldCheck',
    image: 'https://orientcomputers.com.bd/uploads/category/2025-07-20-687c8b8211da3.png',
  },
  {
    name: 'Industrial Batteries',
    slug: 'battery',
    route: '/battery',
    description: 'Deep cycle AGM, VRLA & 51.2V LiFePO4 batteries',
    icon: 'BatteryCharging',
    image: 'https://orientcomputers.com.bd/uploads/category/2025-07-20-687c8baa79f4b.png',
  },
  {
    name: 'Telecom Power Solutions',
    slug: 'telecom',
    route: '/telecom',
    description: '48V DC telecom rectifiers & subrack power systems',
    icon: 'Radio',
    image: 'https://orientcomputers.com.bd/uploads/category/2025-05-10-681f3582e1236.png',
  },
  {
    name: 'Office & Banking Equipment',
    slug: 'office-equipment',
    route: '/office-equipment',
    description: 'Vacuum currency counters & banknote sorting machines',
    icon: 'Briefcase',
    image: 'https://orientcomputers.com.bd/uploads/category/2025-05-10-681f362ba7fe2.jpg',
  },
  {
    name: 'PC Components & Peripherals',
    slug: 'pc-component',
    route: '/shop?category=pc-component',
    description: 'Patriot RAM & SSDs, TrendSonic monitors & casings',
    icon: 'Cpu',
    image: 'https://orientcomputers.com.bd/uploads/category/2025-05-10-681f366f3974c.png',
  },
];

export default function CategoryGrid() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success && res.data.categories.length > 0) {
          const merged = res.data.categories.map((cat, idx) => ({
            ...cat,
            route: `/${cat.slug}`,
            image: cat.image || DEFAULT_CATEGORIES[idx]?.image || DEFAULT_CATEGORIES[0].image,
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
            <span>Featured Product Categories</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Get your desired product from our official department catalogs.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || Zap;
          const targetRoute = cat.route || `/${cat.slug}`;

          return (
            <Link
              key={cat.slug || cat.name}
              to={targetRoute}
              className="relative overflow-hidden rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between group transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 flex items-center justify-center p-1.5">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="space-y-1 mt-4">
                <h3 className="font-heading font-bold text-sm text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {cat.description || 'Explore official models & specs'}
                </p>
              </div>

              <div className="inline-flex items-center space-x-1 text-xs font-medium text-blue-400 group-hover:text-blue-300 transition-colors pt-3 border-t border-slate-800/80 mt-3">
                <span>View Products</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

