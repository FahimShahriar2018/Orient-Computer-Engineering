import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Search,
  ExternalLink,
  ShieldCheck,
  Building,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { OFFICIAL_BRANDS } from '../components/Home/BrandsSection';

export default function BrandPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrands = OFFICIAL_BRANDS.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-[#0F172A] border border-purple-900/40 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Award className="h-4 w-4" />
            <span>Authorized National Distributor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Our Global Brand Partners
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Orient Computers & Engineering is the exclusive and authorized distributor in Bangladesh for world-leading energy storage, UPS, interactive display, and high-performance PC component manufacturers.
          </p>
        </div>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="text-sm font-semibold text-slate-200">
          Showing <span className="text-blue-400 font-bold">{filteredBrands.length}</span> Partner Brands
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search brands or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* 3. Brands Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBrands.map((brand) => (
          <div
            key={brand.slug}
            className="flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <div className="space-y-4">
              <div className="h-24 w-full flex items-center justify-center p-4 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors border border-slate-800/60">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-h-16 max-w-[140px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {brand.category}
                </p>
              </div>

              <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>100% Genuine with Official Warranty</span>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between">
              <Link
                to={`/shop?brand=${brand.name}`}
                className="w-full py-2 px-3 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>Browse Products</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Wholesale / Dealership Inquiry Card */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-bold text-white font-heading">
            Interested in Wholesale or Dealership Distribution?
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Partner with Orient Computers & Engineering for bulk institutional procurement, retail dealership in districts across Bangladesh, or corporate projects.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="tel:09642222224"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-colors flex items-center space-x-2"
          >
            <Phone className="h-4 w-4" />
            <span>Call Hotline: 09642222224</span>
          </a>
        </div>
      </div>
    </div>
  );
}
