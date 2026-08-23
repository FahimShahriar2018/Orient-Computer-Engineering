import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { totalItems, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, openAuthModal } = useAuth();

  const pathname = location.pathname;

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-lg border-t border-slate-800/90 px-3 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
      {/* 1. Home */}
      <Link
        to="/"
        className={`flex flex-col items-center space-y-1 text-[10px] font-semibold transition-colors ${
          pathname === '/' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>

      {/* 2. Shop Catalog */}
      <Link
        to="/shop"
        className={`flex flex-col items-center space-y-1 text-[10px] font-semibold transition-colors ${
          pathname.startsWith('/shop') ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Compass className="h-4 w-4" />
        <span>Catalog</span>
      </Link>

      {/* 3. Wishlist */}
      <Link
        to="/wishlist"
        className={`relative flex flex-col items-center space-y-1 text-[10px] font-semibold transition-colors ${
          pathname === '/wishlist' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <div className="relative">
          <Heart className="h-4 w-4" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-2 h-3.5 w-3.5 rounded-full bg-rose-500 text-white text-[8px] font-extrabold flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </div>
        <span>Wishlist</span>
      </Link>

      {/* 4. Cart Drawer Toggle */}
      <button
        onClick={openCartDrawer}
        className="relative flex flex-col items-center space-y-1 text-[10px] font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <div className="relative">
          <ShoppingBag className="h-4 w-4 text-orange-400" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 h-3.5 w-3.5 rounded-full bg-orange-500 text-white text-[8px] font-extrabold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        <span className="text-orange-400">Cart</span>
      </button>

      {/* 5. Customer / Admin Account */}
      {user ? (
        <Link
          to={user.role === 'admin' ? '/admin' : '/account'}
          className={`flex flex-col items-center space-y-1 text-[10px] font-semibold transition-colors ${
            pathname.startsWith('/account') || pathname.startsWith('/admin')
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="h-4 w-4" />
          <span>{user.role === 'admin' ? 'Admin' : 'Account'}</span>
        </Link>
      ) : (
        <button
          onClick={() => openAuthModal('login')}
          className="flex flex-col items-center space-y-1 text-[10px] font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <User className="h-4 w-4" />
          <span>Sign In</span>
        </button>
      )}
    </nav>
  );
}
