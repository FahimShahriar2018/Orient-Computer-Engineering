import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Star,
  ShieldCheck,
  Check,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/formatters';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id || product.id);
  const finalPrice = product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;

  const discountPercent = product.discountPrice && product.discountPrice < product.price
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : (product.image || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80');

  const inStock = product.stock > 0;

  // ----------------------------------------------------
  // LIST VIEW LAYOUT
  // ----------------------------------------------------
  if (viewMode === 'list') {
    return (
      <div className="rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 p-5 flex flex-col sm:flex-row gap-5 transition-all hover:shadow-2xl group relative overflow-hidden">
        {/* Thumbnail with Wishlist & Badge */}
        <div className="relative w-full sm:w-56 h-48 sm:h-auto rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 flex items-center justify-center p-3">
          {product.badge && (
            <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-md bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[10px] font-extrabold uppercase tracking-wider">
              {product.badge}
            </span>
          )}

          <button
            onClick={() => toggleWishlist(product)}
            className={`absolute top-3 right-3 z-10 p-2 rounded-xl border transition-colors ${
              inWishlist
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-rose-400'
            }`}
            title="Wishlist"
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-rose-400' : ''}`} />
          </button>

          <Link to={`/product/${product.slug || product._id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={imageUrl}
              alt={product.title}
              className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Content Details */}
        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="font-bold text-cyan-400 uppercase tracking-wider">{product.brand}</span>
              {product.category?.name && (
                <>
                  <span>•</span>
                  <span>{product.category.name}</span>
                </>
              )}
            </div>

            <Link
              to={`/product/${product.slug || product._id}`}
              className="text-base sm:text-lg font-heading font-bold text-white hover:text-cyan-400 transition-colors line-clamp-2 mt-1"
            >
              {product.title}
            </Link>

            {/* Ratings */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <span className="text-xs font-bold text-slate-200 ml-1">
                  {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
                </span>
              </div>
              <span className="text-slate-500 text-xs">({product.numReviews || 0} reviews)</span>
              <span className="text-slate-600">•</span>
              <div className="flex items-center space-x-1 text-xs">
                <span className={`h-2 w-2 rounded-full ${inStock ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                <span className={inStock ? 'text-emerald-400' : 'text-rose-400'}>
                  {inStock ? `${product.stock} in stock` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Short specs */}
            {product.shortSpecs && product.shortSpecs.length > 0 && (
              <ul className="text-xs text-slate-300 space-y-1 mt-3">
                {product.shortSpecs.slice(0, 3).map((spec, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                    <span className="truncate">{spec}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pricing and Action */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold text-orange-400">
                  {formatPrice(finalPrice)}
                </span>
                {discountPercent > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <div className="text-xs text-slate-500 line-through">
                  Regular: {formatPrice(product.price)}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Link
                to={`/product/${product.slug || product._id}`}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                View Specs
              </Link>
              <button
                disabled={!inStock}
                onClick={() => addToCart(product, 1, true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-orange-500/25 flex items-center space-x-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // GRID VIEW LAYOUT (DEFAULT)
  // ----------------------------------------------------
  return (
    <div className="rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-2xl group relative overflow-hidden">
      {/* Badge Top Left */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-0.5 rounded-md bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[10px] font-extrabold uppercase tracking-wider">
            {product.badge}
          </span>
        </div>
      )}

      {/* Wishlist Button Top Right */}
      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute top-3 right-3 z-10 p-2 rounded-xl border transition-colors ${
          inWishlist
            ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-rose-400'
        }`}
        title="Wishlist"
      >
        <Heart className={`h-4 w-4 ${inWishlist ? 'fill-rose-400' : ''}`} />
      </button>

      {/* Image Thumbnail */}
      <div className="h-48 sm:h-52 w-full rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center p-3 relative">
        <Link to={`/product/${product.slug || product._id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.title}
            className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-bold text-cyan-400 uppercase tracking-wider">{product.brand}</span>
          <div className="flex items-center space-x-1">
            <span className={`h-1.5 w-1.5 rounded-full ${inStock ? 'bg-emerald-400' : 'bg-rose-500'}`} />
            <span className={inStock ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
              {inStock ? 'In Stock' : 'Stock Out'}
            </span>
          </div>
        </div>

        <Link
          to={`/product/${product.slug || product._id}`}
          className="text-sm font-heading font-bold text-slate-100 hover:text-cyan-400 transition-colors line-clamp-2 leading-snug"
        >
          {product.title}
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1.5">
          <div className="flex items-center text-amber-400">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <span className="text-xs font-bold text-slate-200 ml-1">
              {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
            </span>
          </div>
          <span className="text-slate-500 text-[11px]">({product.numReviews || 0})</span>
        </div>

        {/* Quick Specs */}
        {product.shortSpecs && product.shortSpecs.length > 0 && (
          <ul className="text-[11px] text-slate-400 space-y-1 pt-1">
            {product.shortSpecs.slice(0, 2).map((spec, idx) => (
              <li key={idx} className="flex items-center space-x-1.5">
                <span className="h-1 w-1 rounded-full bg-cyan-400 flex-shrink-0" />
                <span className="truncate">{spec}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pricing & Add to Cart Footer */}
      <div className="pt-3 border-t border-slate-800 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-lg font-extrabold text-orange-400">
              {formatPrice(finalPrice)}
            </div>
            {discountPercent > 0 && (
              <div className="text-[11px] text-slate-500 line-through">
                {formatPrice(product.price)}
              </div>
            )}
          </div>

          {discountPercent > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              -{discountPercent}%
            </span>
          )}
        </div>

        <button
          disabled={!inStock}
          onClick={() => addToCart(product, 1, true)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-[0.98]"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
}
