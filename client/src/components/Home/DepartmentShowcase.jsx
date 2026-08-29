import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../Product/ProductCard';

export default function DepartmentShowcase({
  title,
  subtitle,
  categorySlug,
  icon: Icon,
  products = [],
  viewAllLink,
  accentColor = 'text-blue-400',
}) {
  if (!products || products.length === 0) return null;

  const targetLink = viewAllLink || `/${categorySlug}`;

  return (
    <section className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            {Icon && <Icon className={`h-5 w-5 ${accentColor}`} />}
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <Link
          to={targetLink}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors self-start sm:self-auto"
        >
          <span>View All in {title}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product._id || product.id} product={product} viewMode="grid" />
        ))}
      </div>
    </section>
  );
}
