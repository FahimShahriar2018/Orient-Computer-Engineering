import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ChevronRight, Sparkles } from 'lucide-react';

export const OFFICIAL_BRANDS = [
  {
    name: 'ViewSonic',
    slug: 'Viewsonic',
    category: 'Interactive Displays & Projectors',
    image: 'https://orientcomputers.com.bd/uploads/thumbnail-image/2025-05-06-6819d5a4c02e7.webp',
  },
  {
    name: 'SAKO',
    slug: 'sako',
    category: 'Solar Inverters & Lithium ESS',
    image: 'https://orientcomputers.com.bd/uploads/thumbnail-image/2025-05-05-68189f3f83325.webp',
  },
  {
    name: 'Apollo',
    slug: 'apollo',
    category: 'Offline & Online UPS / AGM Batteries',
    image: 'https://orientcomputers.com.bd/uploads/thumbnail-image/2025-03-29-67e799eaa92d5.webp',
  },
  {
    name: 'Patriot',
    slug: 'patriot',
    category: 'Viper DDR5 Gaming RAM & NVMe SSDs',
    image: 'https://orientcomputers.com.bd/uploads/thumbnail-image/2025-03-29-67e799fcdfc6d.webp',
  },
  {
    name: 'TrendSonic',
    slug: 'trendsonic',
    category: 'Frameless Monitors & RGB Casings',
    image: 'https://orientcomputers.com.bd/uploads/thumbnail-image/2025-05-06-6819ea90dfcb2.png',
  },
  {
    name: 'Kstar',
    slug: 'kstar',
    category: 'Enterprise Online Double Conversion UPS',
    image: 'https://orientcomputers.com.bd/uploads/thumbnail-image/2025-03-29-67e79a29812d1.webp',
  },
  {
    name: 'LONG Battery',
    slug: 'long',
    category: 'Industrial Deep Cycle Solar Batteries',
    image: 'https://orientcomputers.com.bd/uploads/thumbnail-image/2025-03-29-67e79a30c410a.webp',
  },
  {
    name: 'Plustek',
    slug: 'plustek',
    category: 'High Speed Enterprise Document Scanners',
    image: 'https://orientcomputers.com.bd/uploads/thumbnail-image/2025-05-06-6819d57fa51ff.webp',
  },
  {
    name: 'FirstPower',
    slug: 'firstpower',
    category: 'VRLA High Rate Backup Power',
    image: 'https://orientcomputers.com.bd/uploads/thumbnail-image/2025-03-29-67e79a0360762.webp',
  },
  {
    name: 'APC',
    slug: 'apc',
    category: 'Schneider Electric Smart UPS Systems',
    image: 'https://orientcomputers.com.bd/uploads/thumbnail-image/2025-03-29-67e799dfcc5dc.webp',
  },
  {
    name: 'Neata',
    slug: 'neata',
    category: 'Standby Power Sealed Batteries',
    image: 'https://orientcomputers.com.bd/uploads/thumbnail-image/2026-07-14-6a561a3f08a80.webp',
  },
  {
    name: 'Futek',
    slug: 'futek',
    category: 'Vacuum Banking & Money Sorters',
    image: 'https://orientcomputers.com.bd/uploads/thumbnail-image/2025-03-29-67e79a13d0ac5.webp',
  },
];

export default function BrandsSection() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Award className="h-4 w-4" />
            <span>Official Authorized Importer & Partner</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading tracking-tight">
            Our Official Brands
          </h2>
          <p className="text-xs text-slate-400">
            Orient Computers & Engineering is the leading authorized distributor of world-class energy and hardware brands in Bangladesh.
          </p>
        </div>

        <Link
          to="/brand"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <span>View All Brands</span>
          <ChevronRight className="h-3.5 w-3.5 text-blue-400" />
        </Link>
      </div>

      {/* Brand Grid Showcase */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {OFFICIAL_BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            to={`/shop?brand=${brand.name}`}
            className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/40 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center"
          >
            <div className="h-16 w-full flex items-center justify-center p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors mb-2">
              <img
                src={brand.image}
                alt={brand.name}
                className="max-h-12 max-w-[100px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden font-bold text-slate-200 text-sm">{brand.name}</span>
            </div>
            <h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
              {brand.name}
            </h4>
            <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
              {brand.category}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
