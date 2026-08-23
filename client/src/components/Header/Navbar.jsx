import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  LogOut,
  Package,
  Shield,
  Menu,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api';

export default function Navbar({ onToggleMobileMenu, isMobileMenuOpen }) {
  const navigate = useNavigate();
  const { user, logout, openAuthModal, isAdmin } = useAuth();
  const { totalItems, itemsPrice, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();

  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Fetch categories for search dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (e) {
        console.error('Error fetching search categories', e);
      }
    };
    fetchCategories();
  }, []);

  // Debounced live search suggestions
  useEffect(() => {
    if (!keyword.trim() || keyword.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const params = { keyword: keyword.trim(), limit: 5 };
        if (selectedCategory) params.category = selectedCategory;
        const res = await api.get('/products', { params });
        if (res.data.success) {
          setSuggestions(res.data.products);
          setShowSuggestions(true);
        }
      } catch (e) {
        console.error('Live search error', e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [keyword, selectedCategory]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    const queryParams = new URLSearchParams();
    if (keyword.trim()) queryParams.set('keyword', keyword.trim());
    if (selectedCategory) queryParams.set('category', selectedCategory);
    navigate(`/shop?${queryParams.toString()}`);
  };

  const handleSelectSuggestion = (slug) => {
    setShowSuggestions(false);
    setKeyword('');
    navigate(`/product/${slug}`);
  };

  return (
    <div className="bg-[#0F172A] border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-6">
          {/* 1. Mobile Menu Button & Brand Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md ring-1 ring-white/10 group-hover:bg-blue-500 transition-colors">
                <Cpu className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                  ORIENT
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 -mt-1">
                  Computers & Engineering
                </span>
              </div>
            </Link>
          </div>

          {/* 2. Amazon-Inspired Global Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-2xl hidden md:block relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className="relative flex items-center w-full rounded-xl bg-slate-900/90 border border-slate-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 shadow-inner transition-all overflow-hidden">
                {/* Category Dropdown inside Search Bar */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-11 bg-slate-800/90 text-slate-300 text-xs font-medium px-3.5 border-r border-slate-700 focus:outline-none cursor-pointer hover:bg-slate-700/80 transition-colors"
                >
                  <option value="">All Departments</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Query Input */}
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Search RTX 4090, Intel i9, Ryzen, Laptops, 4K Monitors..."
                  className="w-full h-11 bg-transparent px-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
                />

                {/* Search Submit Button */}
                <button
                  type="submit"
                  className="h-11 px-5 bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center justify-center transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Live Auto-Suggest Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-[11px] text-blue-400">
                    Suggested Products
                  </span>
                  <span>{suggestions.length} results</span>
                </div>

                {suggestions.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => handleSelectSuggestion(item.slug)}
                    className="w-full px-4 py-3 flex items-center space-x-3.5 hover:bg-slate-800/80 transition-colors text-left group"
                  >
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/60'}
                      alt={item.title}
                      className="w-11 h-11 object-cover rounded-lg bg-slate-800 border border-slate-700 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-slate-200 group-hover:text-blue-400 truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs mt-0.5">
                        <span className="text-slate-400">{item.brand}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-white font-bold">
                          {formatPrice(item.discountPrice || item.price)}
                        </span>
                        {item.discountPrice > 0 && item.discountPrice < item.price && (
                          <span className="text-slate-500 line-through text-[11px]">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0" />
                  </button>
                ))}

                <button
                  onClick={handleSearchSubmit}
                  className="w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-center text-blue-400 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>View all search results for "{keyword}"</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 3. Action Badges (User Account, Wishlist, Cart) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* User Account / Sign In */}
            <div ref={userMenuRef} className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden xl:flex flex-col text-left">
                      <span className="text-[10px] text-slate-400">Hello,</span>
                      <span className="font-semibold text-slate-200 max-w-[100px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold rounded">
                            STORE ADMIN
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          to="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-blue-400 transition-colors"
                        >
                          <User className="h-4 w-4 mr-2.5 text-blue-400" />
                          <span>My Profile & Settings</span>
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-blue-400 transition-colors"
                        >
                          <Package className="h-4 w-4 mr-2.5 text-slate-400" />
                          <span>My Orders & Invoices</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-xs text-blue-400 hover:bg-blue-500/10 transition-colors font-semibold"
                          >
                            <Shield className="h-4 w-4 mr-2.5 text-blue-400" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-800 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-2.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center space-x-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-all hover:border-blue-500/40"
                >
                  <User className="h-4 w-4 text-blue-400" />
                  <div className="hidden sm:flex flex-col text-left leading-tight">
                    <span className="text-[10px] text-slate-400">Account</span>
                    <span className="font-semibold text-white">Sign In</span>
                  </div>
                </button>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-rose-400 transition-colors"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger Button with Slide-out Drawer */}
            <button
              onClick={openDrawer}
              className="relative flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-slate-100 transition-all group"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-blue-400 group-hover:scale-105 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 h-5 w-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-slate-400 font-medium">Cart</span>
                <span className="text-xs font-bold text-white">
                  {formatPrice(itemsPrice)}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center rounded-xl bg-slate-900 border border-slate-700 overflow-hidden">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search computer hardware..."
                className="w-full h-10 bg-transparent px-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
