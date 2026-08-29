import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Truck, Building, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TopBar() {
  return (
    <div className="bg-[#070D18] border-b border-slate-800 text-[11px] sm:text-xs text-slate-400 py-1.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Contact & Showroom details */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <a
            href="tel:09642222224"
            className="inline-flex items-center space-x-1.5 text-slate-200 hover:text-blue-400 font-semibold transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-blue-400" />
            <span>Hotline: 09642222224</span>
          </a>

          <Link
            to="/branch"
            className="hidden sm:inline-flex items-center space-x-1.5 hover:text-blue-400 transition-colors"
          >
            <Building className="h-3.5 w-3.5 text-slate-400" />
            <span>Branches & Showrooms</span>
          </Link>

          <Link
            to="/complain"
            className="hidden md:inline-flex items-center space-x-1.5 text-slate-400 hover:text-red-400 transition-colors"
          >
            <AlertCircle className="h-3.5 w-3.5 text-red-400" />
            <span>Complain Box</span>
          </Link>
        </div>

        {/* Right: Value Props & Tracking link */}
        <div className="flex items-center space-x-4 sm:space-x-6 ml-auto">
          <div className="hidden sm:inline-flex items-center space-x-1.5 text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>100% Genuine Importer Warranty</span>
          </div>

          <Link
            to="/track-order"
            className="inline-flex items-center space-x-1.5 text-slate-300 hover:text-blue-400 font-medium transition-colors"
          >
            <Truck className="h-3.5 w-3.5 text-blue-400" />
            <span>Track My Order</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

