import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    addToCart(item, 1, true);
    removeFromWishlist(item._id || item.product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center space-x-2.5">
            <Heart className="h-7 w-7 text-rose-500 fill-rose-500/20" />
            <span>My Hardware Wishlist</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Saved computer components and gear ready for your next custom build.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-12 text-center space-y-5 shadow-sm">
          <div className="h-20 w-20 rounded-2xl bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500">
            <Heart className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-xl text-white">Your Wishlist is Empty</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Save your favorite processors, graphics cards, and gaming laptops by clicking the heart icon on any product.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <span>Explore Hardware Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item._id || item.product}
              className="rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 p-4 flex flex-col justify-between space-y-4 shadow-sm transition-all"
            >
              <div className="relative h-48 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center p-3">
                <Link to={`/product/${item.slug || item._id}`}>
                  <img
                    src={item.image || 'https://via.placeholder.com/200'}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(item._id || item.product)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 flex-1">
                <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                  {item.brand}
                </span>
                <Link
                  to={`/product/${item.slug || item._id}`}
                  className="block text-sm font-heading font-bold text-slate-100 hover:text-blue-400 transition-colors line-clamp-2"
                >
                  {item.title}
                </Link>
                <div className="text-base font-extrabold text-white">
                  {formatPrice(item.price)}
                </div>
              </div>

              <button
                onClick={() => handleMoveToCart(item)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Move to Cart</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
