import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  HardDrive,
  Laptop,
  Monitor,
  Network,
  Zap,
  Flame,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Grid,
  Shield,
  Sun,
  Tv,
  BatteryCharging,
  Briefcase,
  ShieldCheck,
  Building,
  Tag,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';

const ICON_MAP = {
  Cpu: Cpu,
  Layers: Layers,
  HardDrive: HardDrive,
  Laptop: Laptop,
  Monitor: Monitor,
  Network: Network,
  Zap: Zap,
  Sun: Sun,
  Tv: Tv,
  BatteryCharging: BatteryCharging,
  Briefcase: Briefcase,
  ShieldCheck: ShieldCheck,
};

export default function CategoryBar({ isMobileMenuOpen, onCloseMobileMenu }) {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (e) {
        console.error('Error fetching categories for category bar', e);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      {/* Desktop Horizontal Category Bar */}
      <nav className="hidden lg:block bg-[#0B1120] border-b border-slate-800 text-xs text-slate-300 font-medium relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* All Products / Catalog Hub */}
            <Link
              to="/shop"
              className="flex items-center space-x-2 px-3.5 py-3 text-slate-200 hover:text-blue-400 hover:bg-slate-800/60 rounded-t-lg transition-colors font-semibold"
            >
              <Grid className="h-4 w-4 text-blue-500" />
              <span>All Products</span>
            </Link>

            {/* Dynamic Hardware Categories */}
            {categories.slice(0, 6).map((cat) => {
              const IconComponent = ICON_MAP[cat.icon] || Cpu;
              const isHovered = hoveredCategory?._id === cat._id;

              return (
                <div
                  key={cat._id}
                  onMouseEnter={() => setHoveredCategory(cat)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="relative"
                >
                  <Link
                    to={`/shop?category=${cat.slug}`}
                    className={`flex items-center space-x-1.5 px-3 py-3 rounded-t-lg transition-colors ${
                      isHovered
                        ? 'bg-slate-800 text-blue-400'
                        : 'text-slate-300 hover:text-blue-400 hover:bg-slate-800/40'
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5 text-blue-500" />
                    <span>{cat.name}</span>
                    {cat.subcategories?.length > 0 && (
                      <ChevronDown className="h-3 w-3 text-slate-500 ml-0.5" />
                    )}
                  </Link>

                  {/* Mega Menu Flyout */}
                  {isHovered && cat.subcategories?.length > 0 && (
                    <div className="absolute top-full left-0 w-80 bg-[#0F172A] border border-slate-700 rounded-b-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2.5 pb-1 border-b border-slate-800 flex items-center justify-between">
                        <span>{cat.name} Subcategories</span>
                        <Sparkles className="h-3 w-3 text-blue-400" />
                      </div>

                      <div className="space-y-1">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            to={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                            className="flex items-center justify-between p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors group"
                          >
                            <span className="text-xs group-hover:text-blue-400 transition-colors">
                              {sub.name}
                            </span>
                            <ChevronRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                          </Link>
                        ))}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-between items-center text-[11px]">
                        <Link
                          to={`/shop?category=${cat.slug}`}
                          className="text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
                        >
                          <span>Explore All in {cat.name}</span>
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Highlights */}
          <div className="flex items-center space-x-2">
            <Link
              to="/brand"
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
            >
              <Tag className="h-3.5 w-3.5 text-blue-400" />
              <span>Brands</span>
            </Link>

            <Link
              to="/branch"
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
            >
              <Building className="h-3.5 w-3.5 text-emerald-400" />
              <span>Branches</span>
            </Link>

            <Link
              to="/shop?deals=true"
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
            >
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>Flash Deals</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex">
          <div className="w-4/5 max-w-sm bg-[#0F172A] border-r border-slate-800 h-full overflow-y-auto p-5 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <span className="font-heading font-bold text-lg text-white">Navigation & Catalog</span>
                </div>
                <button
                  onClick={onCloseMobileMenu}
                  className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {/* Mobile Category List */}
              <div className="space-y-1">
                <Link
                  to="/shop"
                  onClick={onCloseMobileMenu}
                  className="flex items-center space-x-3 p-2.5 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-blue-400 font-semibold"
                >
                  <Grid className="h-4 w-4 text-blue-500" />
                  <span>All Products</span>
                </Link>

                <Link
                  to="/brand"
                  onClick={onCloseMobileMenu}
                  className="flex items-center space-x-3 p-2.5 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-blue-400 font-semibold"
                >
                  <Tag className="h-4 w-4 text-blue-400" />
                  <span>Authorized Brands</span>
                </Link>

                <Link
                  to="/branch"
                  onClick={onCloseMobileMenu}
                  className="flex items-center space-x-3 p-2.5 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-blue-400 font-semibold"
                >
                  <Building className="h-4 w-4 text-emerald-400" />
                  <span>Branches & Showrooms</span>
                </Link>

                <Link
                  to="/complain"
                  onClick={onCloseMobileMenu}
                  className="flex items-center space-x-3 p-2.5 rounded-xl text-red-300 hover:bg-slate-800 hover:text-red-400 font-semibold"
                >
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span>Complain Box</span>
                </Link>

                <div className="pt-2 pb-1 border-t border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Categories
                </div>

                {categories.map((cat) => {
                  const IconComponent = ICON_MAP[cat.icon] || Cpu;
                  return (
                    <div key={cat._id} className="py-0.5">
                      <Link
                        to={`/shop?category=${cat.slug}`}
                        onClick={onCloseMobileMenu}
                        className="flex items-center justify-between p-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-400"
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-sm">{cat.name}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-600" />
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Quick Links */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <Link
                  to="/shop?deals=true"
                  onClick={onCloseMobileMenu}
                  className="flex items-center space-x-2.5 p-2 rounded-lg text-slate-200 hover:text-white bg-slate-800 font-semibold text-xs"
                >
                  <Flame className="h-4 w-4 text-amber-400" />
                  <span>Flash Deals & Offers</span>
                </Link>

                <Link
                  to="/track-order"
                  onClick={onCloseMobileMenu}
                  className="flex items-center space-x-2.5 p-2 rounded-lg text-blue-400 bg-blue-500/10 font-semibold text-xs"
                >
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span>Track My Order</span>
                </Link>
              </div>
            </div>

            <div className="pt-6 text-[11px] text-slate-500 text-center border-t border-slate-800">
              Orient Computers & Engineering © 2026
            </div>
          </div>
          <div className="flex-1" onClick={onCloseMobileMenu}></div>
        </div>
      )}
    </>
  );
}
