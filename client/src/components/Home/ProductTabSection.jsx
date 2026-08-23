import React, { useState } from 'react';
import { Sparkles, Zap, Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../Product/ProductCard';

export default function ProductTabSection({ featured = [], bestSellers = [], newArrivals = [] }) {
  const [activeTab, setActiveTab] = useState('featured'); // 'featured' | 'bestSellers' | 'newArrivals'

  const getActiveProducts = () => {
    switch (activeTab) {
      case 'bestSellers':
        return bestSellers.length > 0 ? bestSellers : featured;
      case 'newArrivals':
        return newArrivals.length > 0 ? newArrivals : featured;
      case 'featured':
      default:
        return featured;
    }
  };

  const products = getActiveProducts();

  return (
    <section className="space-y-6">
      {/* Section Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span>Featured Hardware Showcase</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Hand-picked desktop components, creator workstations, and gaming gear.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'featured'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔥 Top Featured
          </button>
          <button
            onClick={() => setActiveTab('bestSellers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'bestSellers'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⭐ Best Sellers
          </button>
          <button
            onClick={() => setActiveTab('newArrivals')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'newArrivals'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ New Arrivals
          </button>
        </div>
      </div>

      {/* Product Cards Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Loading hardware showcase...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} viewMode="grid" />
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-blue-400 font-semibold text-xs transition-colors shadow-sm"
        >
          <span>View All Hardware in Store Catalog</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
