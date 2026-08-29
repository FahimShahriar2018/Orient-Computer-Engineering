import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building,
  Navigation,
  ExternalLink,
} from 'lucide-react';

const BRANCHES = [
  {
    name: 'Head Office & Central Showroom',
    city: 'Dhaka',
    address: 'Concord Tower, Suite No. 1401, 113 Kazi Nazrul Islam Avenue, Banglamotor, Dhaka-1000, Bangladesh',
    phone: '09642222224',
    mobile: '+880 1711-000001',
    email: 'info@orientcomputers.com.bd',
    hours: 'Saturday – Thursday: 9:30 AM – 7:30 PM (Friday Closed)',
    type: 'Headquarters & Wholesale Center',
    isPrimary: true,
  },
  {
    name: 'Motijheel Commercial Branch',
    city: 'Dhaka',
    address: 'Orient Engineering Center, Level 4, Motijheel Commercial Area, Dhaka-1000',
    phone: '09642222224',
    mobile: '+880 1711-000002',
    email: 'motijheel@orientcomputers.com.bd',
    hours: 'Saturday – Thursday: 9:30 AM – 7:00 PM',
    type: 'Banking & Industrial Power Solutions',
    isPrimary: false,
  },
  {
    name: 'Elephant Road Tech Showroom',
    city: 'Dhaka',
    address: 'Shop # 412, Level 4, Multiplan Center / Computer City Center, New Elephant Road, Dhaka-1205',
    phone: '09642222224',
    mobile: '+880 1711-000003',
    email: 'multiplan@orientcomputers.com.bd',
    hours: 'Monday – Saturday: 10:00 AM – 8:00 PM (Tuesday Closed)',
    type: 'Retail & Peripherals Display',
    isPrimary: false,
  },
  {
    name: 'Chattogram Port City Branch',
    city: 'Chattogram',
    address: 'Agrabad Commercial Area, Main Road, Double Mooring, Chattogram-4100',
    phone: '09642222224',
    mobile: '+880 1711-000004',
    email: 'ctg@orientcomputers.com.bd',
    hours: 'Saturday – Thursday: 9:30 AM – 7:00 PM',
    type: 'Regional Distribution & Telecom Hub',
    isPrimary: false,
  },
];

export default function BranchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-[#0F172A] border border-blue-900/40 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Building className="h-4 w-4" />
            <span>Nationwide Presence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Our Showrooms & Branches
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Visit our corporate office, central showroom, or regional distribution branches for hands-on interactive display demonstrations, UPS capacity sizing, and direct wholesale inquiries.
          </p>
        </div>
      </div>

      {/* Central Hotline Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4 text-center sm:text-left">
          <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Universal Customer Care & Wholesale Hotline</div>
            <div className="text-xl font-bold text-white font-mono">09642222224</div>
          </div>
        </div>

        <a
          href="tel:09642222224"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-colors flex items-center space-x-2"
        >
          <Phone className="h-4 w-4" />
          <span>Call Universal Hotline</span>
        </a>
      </div>

      {/* Branches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BRANCHES.map((branch, index) => (
          <div
            key={index}
            className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${
              branch.isPrimary
                ? 'bg-slate-900 border-blue-500/50 shadow-xl'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-blue-400 border border-slate-700 mb-2">
                  {branch.type}
                </span>
                <h3 className="text-lg font-bold text-white font-heading">
                  {branch.name}
                </h3>
              </div>
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{branch.address}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>
                  Hotline: <strong className="text-white">{branch.phone}</strong> (Ext: {branch.mobile})
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span>{branch.email}</span>
              </div>

              <div className="flex items-center space-x-3 text-slate-400">
                <Clock className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span>{branch.hours}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <a
                href={`tel:${branch.phone}`}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-blue-400" />
                <span>Call Branch</span>
              </a>

              <a
                href="https://maps.google.com/?q=Concord+Tower+Dhaka"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-4 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <span>Get Directions</span>
                <Navigation className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
