import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Clock,
  ShoppingCart,
  Zap,
  ArrowRight,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';

export default function FlashDeals({ dealProduct }) {
  const { addToCart } = useCart();

  // 48-Hour Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 36,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const defaultDeal = {
    _id: 'flash_deal_core_i9',
    title: 'Intel Core i9-14900K 24-Core 32-Thread Desktop Processor',
    slug: 'intel-core-i9-14900k-desktop-processor',
    brand: 'Intel',
    price: 68500,
    discountPrice: 64900,
    stock: 14,
    images: ['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80'],
    shortSpecs: [
      '24 Cores (8P + 16E) / 32 Threads up to 6.0 GHz Turbo',
      '36MB Intel Smart Cache | LGA1700 Socket',
      'PCIe 5.0 & DDR5 Support for extreme gaming & content creation',
    ],
    rating: 4.9,
    numReviews: 28,
  };

  const product = dealProduct || defaultDeal;
  const savings = product.price - product.discountPrice;
  const discountPercent = Math.round((savings / product.price) * 100);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0F172A] border border-slate-800 p-6 sm:p-10 shadow-sm">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Col: Header & Countdown Clock */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="h-4 w-4 text-amber-400" />
              <span>Deal of the Day • Flash Offer</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Limited-Time Tech Deals in Bangladesh
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Special stock allocation with instant price markdown and 3-Year Official Brand Warranty.
            </p>
          </div>

          {/* Real-time Countdown Timer Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
              <Clock className="h-4 w-4 text-blue-400" />
              <span>OFFER EXPIRES IN:</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Hours</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="font-heading font-extrabold text-2xl sm:text-3xl text-blue-400">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Mins</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-200">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Secs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Flash Deal Product Showcase */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center shadow-sm">
          {/* Product Image with Discount Badge */}
          <div className="relative w-full sm:w-56 h-56 rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center p-3 flex-shrink-0">
            <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm">
              Save {formatPrice(savings)}
            </span>
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/250'}
              alt={product.title}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>

          {/* Product Details & Purchase Controls */}
          <div className="flex-1 space-y-3 w-full">
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-blue-400 uppercase tracking-wider">{product.brand}</span>
              <span className="text-slate-600">•</span>
              <div className="flex items-center text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <span className="text-slate-200 font-bold text-xs ml-1">{product.rating}</span>
                <span className="text-slate-500 text-[11px] ml-1">({product.numReviews})</span>
              </div>
            </div>

            <Link
              to={`/product/${product.slug}`}
              className="block font-heading font-bold text-base sm:text-lg text-white hover:text-blue-400 transition-colors line-clamp-2 leading-snug"
            >
              {product.title}
            </Link>

            {/* Quick Specs */}
            <ul className="text-xs text-slate-300 space-y-1">
              {product.shortSpecs?.slice(0, 2).map((spec, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <Zap className="h-3 w-3 text-blue-400 flex-shrink-0" />
                  <span className="truncate">{spec}</span>
                </li>
              ))}
            </ul>

            {/* Price Box */}
            <div className="pt-2 flex items-baseline space-x-3">
              <span className="text-2xl font-extrabold text-white">
                {formatPrice(product.discountPrice)}
              </span>
              <span className="text-sm text-slate-500 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs font-bold text-emerald-400">
                ({discountPercent}% OFF)
              </span>
            </div>

            {/* Stock Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Hurry, only {product.stock} units remaining!</span>
                <span className="text-blue-400 font-semibold">85% Claimed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-blue-600 w-[85%]" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => addToCart(product, 1, true)}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md flex items-center justify-center space-x-2 transition-colors active:scale-95"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Claim Deal Now</span>
              </button>

              <Link
                to={`/product/${product.slug}`}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                Full Specs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
