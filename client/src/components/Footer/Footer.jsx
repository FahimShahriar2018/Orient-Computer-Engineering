import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#070D18] border-t border-slate-800 text-slate-400 text-xs">
      {/* 1. Value Proposition Banner */}
      <div className="border-b border-slate-800/80 bg-[#0A101D] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-slate-100 font-bold text-sm">100% Genuine Hardware</h4>
                <p className="text-[11px] text-slate-400">Authentic products with official warranty</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-slate-100 font-bold text-sm">Fast Nationwide Delivery</h4>
                <p className="text-[11px] text-slate-400">Dhaka same/next day & all 64 districts</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-slate-100 font-bold text-sm">Easy Returns & RMA</h4>
                <p className="text-[11px] text-slate-400">Hassle-free replacement policy</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-slate-100 font-bold text-sm">Expert Tech Support</h4>
                <p className="text-[11px] text-slate-400">Dedicated computer engineers helpline</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Multi-Column Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
                <Cpu className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-white">
                  ORIENT
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block -mt-1">
                  Computers & Engineering
                </span>
              </div>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm text-xs">
              Orient Computers & Engineering is Bangladesh's trusted destination for genuine computer hardware, high-end gaming rigs, laptops, and enterprise networking engineering solutions.
            </p>

            <div className="space-y-2 text-slate-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Showroom: Orient Engineering Center, Motijheel Commercial Area, Dhaka-1000</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span>Hotline: +880 1711-000001 (10 AM - 8 PM)</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span>Email: support@orientcomputers.com.bd</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-heading font-bold text-sm uppercase tracking-wider text-cyan-400">
              Hardware Catalog
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop?category=processors" className="hover:text-cyan-400 transition-colors">
                  Processors (Intel & AMD)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=graphics-cards" className="hover:text-cyan-400 transition-colors">
                  Graphics Cards (RTX 40-Series)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=motherboards" className="hover:text-cyan-400 transition-colors">
                  Motherboards (Z790 & B650)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=laptops" className="hover:text-cyan-400 transition-colors">
                  Gaming Laptops & Ultrabooks
                </Link>
              </li>
              <li>
                <Link to="/shop?category=monitors" className="hover:text-cyan-400 transition-colors">
                  4K OLED & Gaming Monitors
                </Link>
              </li>
              <li>
                <Link to="/shop?category=networking-engineering" className="hover:text-cyan-400 transition-colors">
                  MikroTik & CCTV Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-heading font-bold text-sm uppercase tracking-wider text-orange-400">
              Customer Service
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/track-order" className="hover:text-orange-400 transition-colors">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-orange-400 transition-colors">
                  My Orders & Receipts
                </Link>
              </li>
              <li>
                <span className="hover:text-orange-400 cursor-pointer transition-colors">
                  Official Brand Warranty Policy
                </span>
              </li>
              <li>
                <span className="hover:text-orange-400 cursor-pointer transition-colors">
                  Terms & Delivery Guidelines
                </span>
              </li>
              <li>
                <span className="hover:text-orange-400 cursor-pointer transition-colors">
                  EMI & Payment Facilities
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Updates */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-heading font-bold text-sm uppercase tracking-wider text-white">
              Stay In Sync
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Subscribe for flash hardware drops, stock alerts, and tech discounts in Bangladesh.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>Subscribe to Offers</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 3. Accepted Payment Badges & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} Orient Computers & Engineering. All Rights Reserved. Developed for Internship Showcase.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] text-slate-400 mr-2 font-medium">We Accept:</span>
            <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-pink-400 font-bold text-[10px]">
              bKash
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-orange-400 font-bold text-[10px]">
              Nagad
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-blue-400 font-bold text-[10px]">
              VISA
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-red-400 font-bold text-[10px]">
              Mastercard
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-emerald-400 font-bold text-[10px]">
              Cash on Delivery (COD)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
