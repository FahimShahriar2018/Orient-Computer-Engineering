import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Server,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Monitor,
  HardDrive,
  ShoppingCart,
  Heart,
  Sparkles,
  Zap,
  Laptop,
  Flame,
  Search,
} from 'lucide-react';
import { AppProviders, useAuth, useCart, useWishlist } from './context';
import Header from './components/Header/Header';
import CartDrawer from './components/Cart/CartDrawer';
import AuthModal from './components/Auth/AuthModal';
import Footer from './components/Footer/Footer';
import api from './services/api';
import { formatPrice } from './utils/formatters';

function StorefrontHomeTeaser() {
  const { user, openAuthModal } = useAuth();
  const { addToCart, totalItems, itemsPrice } = useCart();
  const { toggleWishlist, isInWishlist, wishlistCount } = useWishlist();

  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState({ online: false, checking: true });

  useEffect(() => {
    const checkServerAndFetch = async () => {
      try {
        const healthRes = await api.get('/health');
        setServerStatus({ online: healthRes.data.status === 'ok', checking: false });

        const featRes = await api.get('/products/featured');
        if (featRes.data.success) {
          setFeaturedItems(featRes.data.featured || featRes.data.bestSellers || []);
        }
      } catch (err) {
        setServerStatus({ online: false, checking: false });
      } finally {
        setLoading(false);
      }
    };
    checkServerAndFetch();
  }, []);

  const sampleQuickHardware = [
    {
      _id: 'prod_preview_1',
      title: 'Intel Core i9-14900K 24-Core 32-Thread Desktop Processor',
      brand: 'Intel',
      price: 68500,
      discountPrice: 64900,
      stock: 14,
      sku: 'INT-CPU-14900K',
      slug: 'intel-core-i9-14900k-desktop-processor',
      images: ['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80'],
      shortSpecs: ['24 Cores / 32 Threads', 'Up to 6.0 GHz Boost Clock', '36MB Smart Cache', 'LGA1700 Socket'],
      badge: 'HOT',
    },
    {
      _id: 'prod_preview_2',
      title: 'ASUS ROG Strix GeForce RTX 4090 OC 24GB GDDR6X Graphics Card',
      brand: 'ASUS',
      price: 275000,
      discountPrice: 259000,
      stock: 5,
      sku: 'ASU-GPU-4090STRIX',
      slug: 'asus-rog-strix-geforce-rtx-4090-oc-24gb',
      images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80'],
      shortSpecs: ['24GB GDDR6X 384-bit', 'Ada Lovelace & DLSS 3.5', 'Vapor Chamber Cooling', 'Axial-Tech Fans'],
      badge: 'GAMING',
    },
    {
      _id: 'prod_preview_3',
      title: 'ASUS ROG Zephyrus G16 OLED 240Hz Gaming Laptop (Core Ultra 9, RTX 4080)',
      brand: 'ASUS',
      price: 365000,
      discountPrice: 345000,
      stock: 4,
      sku: 'ASU-LAP-G16-4080',
      slug: 'asus-rog-zephyrus-g16-oled-gaming-laptop-rtx4080',
      images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80'],
      shortSpecs: ['Intel Core Ultra 9 185H', 'RTX 4080 12GB Laptop GPU', '16" 2.5K OLED 240Hz Display', '32GB LPDDR5X + 1TB SSD'],
      badge: 'NEW',
    },
  ];

  const displayProducts = featuredItems.length > 0 ? featuredItems.slice(0, 3) : sampleQuickHardware;

  const phases = [
    { id: 1, title: 'Phase 1: Environment & Initialization', status: 'Completed', active: true, desc: 'Root monorepo, Express REST API, React 18, Vite & Tailwind CSS.' },
    { id: 2, title: 'Phase 2: Schemas & Seeding', status: 'Completed', active: true, desc: 'MongoDB Mongoose models (User, Product, Category, Order) & realistic tech seeder.' },
    { id: 3, title: 'Phase 3: Backend REST APIs', status: 'Completed', active: true, desc: 'JWT auth, multi-facet product filter endpoints, order management & admin APIs.' },
    { id: 4, title: 'Phase 4: Store Navigation & Global State', status: 'Completed', active: true, desc: 'Amazon-style header, live search, mega menu, Auth/Cart/Wishlist contexts & drawer.' },
    { id: 5, title: 'Phase 5: Storefront Experience', status: 'Next Up', active: false, desc: 'Hero carousel, flash deals countdown, Amazon-style filter sidebar & rich PDP.' },
    { id: 6, title: 'Phase 6: Cart & Multi-Step Checkout', status: 'Upcoming', active: false, desc: 'Full cart view, BD divisions/districts selection, bKash & COD mock payment flow.' },
    { id: 7, title: 'Phase 7: Customer Dashboard & Orders', status: 'Upcoming', active: false, desc: 'User profile management, active order tracking timeline, and printable invoices.' },
    { id: 8, title: 'Phase 8: Admin Management Panel', status: 'Upcoming', active: false, desc: 'Revenue analytics, product inventory CRUD, and order fulfillment controls.' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 w-full">
      {/* Hero Showcase Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0F172A] via-slate-900 to-[#0B1120] border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Phase 4 Architecture Deployed</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
            Orient Computers & Engineering <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-orange-400">
              Next-Gen E-Commerce Core
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Enterprise frontend framework initialized with live global state providers (<code className="text-cyan-300 font-mono text-sm bg-slate-800/80 px-1.5 py-0.5 rounded">Auth</code>, <code className="text-orange-300 font-mono text-sm bg-slate-800/80 px-1.5 py-0.5 rounded">Cart</code>, <code className="text-rose-300 font-mono text-sm bg-slate-800/80 px-1.5 py-0.5 rounded">Wishlist</code>), Amazon-style debounced search bar, hardware mega menu, and slide-out cart drawer.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm">
              <span className={`h-2.5 w-2.5 rounded-full ${serverStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-slate-200">
                Backend API: {serverStatus.checking ? 'Checking...' : serverStatus.online ? 'Connected & Healthy' : 'Standby / Offline'}
              </span>
            </div>

            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm">
              <ShoppingCart className="h-4 w-4 text-orange-400" />
              <span className="text-slate-200">Cart: {totalItems} items ({formatPrice(itemsPrice)})</span>
            </div>

            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm">
              <Heart className="h-4 w-4 text-rose-400" />
              <span className="text-slate-200">Wishlist: {wishlistCount} saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Global State Demonstration (Live Hardware Cards) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center space-x-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              <span>Interactive Hardware Testing Deck</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Test adding items to the persistent Cart Drawer or Wishlist in real-time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayProducts.map((prod) => {
            const inWish = isInWishlist(prod._id);
            return (
              <div
                key={prod._id}
                className="rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl group relative overflow-hidden"
              >
                {/* Badge */}
                {prod.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[10px] font-extrabold uppercase">
                      {prod.badge}
                    </span>
                  </div>
                )}

                {/* Wishlist button */}
                <button
                  onClick={() => toggleWishlist(prod)}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-xl border transition-colors ${
                    inWish
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-rose-400'
                  }`}
                  title="Toggle Wishlist"
                >
                  <Heart className={`h-4 w-4 ${inWish ? 'fill-rose-400' : ''}`} />
                </button>

                {/* Image */}
                <div className="h-48 w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center p-2">
                  <img
                    src={prod.images?.[0] || 'https://via.placeholder.com/300'}
                    alt={prod.title}
                    className="h-full w-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                    {prod.brand}
                  </div>
                  <h3 className="font-heading font-bold text-sm text-slate-100 line-clamp-2 leading-snug">
                    {prod.title}
                  </h3>

                  {/* Bullet Specs */}
                  {prod.shortSpecs && prod.shortSpecs.length > 0 && (
                    <ul className="text-[11px] text-slate-400 space-y-1 pt-1">
                      {prod.shortSpecs.slice(0, 2).map((spec, i) => (
                        <li key={i} className="flex items-center space-x-1.5">
                          <span className="h-1 w-1 rounded-full bg-cyan-400" />
                          <span className="truncate">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Pricing & CTA */}
                <div className="pt-2 border-t border-slate-800 space-y-3">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-extrabold text-orange-400">
                      {formatPrice(prod.discountPrice || prod.price)}
                    </span>
                    {prod.discountPrice > 0 && prod.discountPrice < prod.price && (
                      <span className="text-xs text-slate-500 line-through">
                        {formatPrice(prod.price)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(prod, 1, true)}
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 flex items-center justify-center space-x-2 transition-all"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Phases Roadmap Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Project Development Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Complete status of all 8 phases of the Orient Computers internship specification.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className={`rounded-2xl p-5 border flex flex-col justify-between space-y-3 transition-all ${
                phase.status === 'Completed'
                  ? 'bg-slate-900/90 border-emerald-500/30'
                  : phase.status === 'Next Up'
                  ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">PHASE 0{phase.id}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    phase.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : phase.status === 'Next Up'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {phase.status}
                </span>
              </div>

              <div>
                <h4 className="font-heading font-bold text-sm text-white mb-1">{phase.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{phase.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center text-[11px] text-slate-400">
                {phase.status === 'Completed' && (
                  <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Verified</span>
                  </span>
                )}
                {phase.status === 'Next Up' && (
                  <span className="flex items-center space-x-1 text-cyan-400 font-semibold">
                    <ArrowRight className="h-3.5 w-3.5" />
                    <span>Ready to Implement</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
          <Header />
          <Routes>
            <Route path="/" element={<StorefrontHomeTeaser />} />
            <Route path="*" element={<StorefrontHomeTeaser />} />
          </Routes>
          <CartDrawer />
          <AuthModal />
          <Footer />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
}
