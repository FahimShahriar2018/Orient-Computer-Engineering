import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import {
  Sun,
  Tv,
  Zap,
  ShieldCheck,
  BatteryCharging,
  Briefcase,
  Radio,
  Cpu,
  Filter,
  Grid,
  List,
  Sparkles,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Building,
  Layers,
} from 'lucide-react';
import ProductCard from '../components/Product/ProductCard';
import QuotationModal from '../components/Common/QuotationModal';
import api from '../services/api';

// Metadata configuration for all 7 Orient categories
const CATEGORY_META = {
  'renewable-energy': {
    title: 'Renewable Energy & Solar ESS Solutions',
    subtitle: 'SAKO Alpha ESS systems, hybrid MPPT solar inverters, and high-cycle 51.2V LiFePO4 storage batteries.',
    icon: Sun,
    bgGradient: 'from-amber-950 via-slate-900 to-[#0F172A]',
    accentColor: 'text-amber-400',
    badge: 'Solar & Lithium ESS',
    featuredBrands: ['SAKO', 'LONG', 'Apollo'],
    subcategories: [
      { label: 'All Renewable', slug: '' },
      { label: 'Energy Storage Systems (ESS)', slug: 'energy-storage-system' },
      { label: 'Hybrid Solar Inverters', slug: 'hybrid-solar-inverter' },
      { label: 'Lithium Power Batteries', slug: 'lithium-batteries' },
    ],
    technicalGuide: {
      title: 'Solar & ESS Engineering Guide',
      points: [
        'Pure Sinewave inverters protect delicate computers and inverter-grade motors from electrical distortion.',
        'LiFePO4 Lithium batteries deliver over 6,000 deep cycles (15+ years) vs ~400 cycles for traditional flooded batteries.',
        'MPPT solar charge controllers provide up to 30% higher solar energy harvesting compared to PWM controllers.',
      ],
    },
  },
  'audio-visual': {
    title: 'Audio Visual & 4K Interactive Flat Panels',
    subtitle: 'Official ViewSonic EDLA certified 4K touch displays, smart Android projectors, and video conference gear.',
    icon: Tv,
    bgGradient: 'from-purple-950 via-slate-900 to-[#0F172A]',
    accentColor: 'text-purple-400',
    badge: 'Official ViewSonic Distributor',
    featuredBrands: ['ViewSonic', 'MOFII'],
    subcategories: [
      { label: 'All Audio Visual', slug: '' },
      { label: 'Interactive Flat Panels (IFP)', slug: 'interactive-flat-panel' },
      { label: 'Smart Projectors', slug: 'projector' },
      { label: 'Commercial Displays', slug: 'commercial-display' },
    ],
    technicalGuide: {
      title: 'Interactive Display Buying Advice',
      points: [
        'Google EDLA Certification ensures full Google Play Store support, Gmail, Google Drive, and multi-user login directly on the board.',
        '40-Point Ultra Fine Touch gives zero latency natural handwriting for universities and boardrooms.',
        'ViewSonic ViewBoard comes with an official 3-year on-site replacement warranty throughout Bangladesh.',
      ],
    },
  },
  'ups': {
    title: 'Enterprise Online & Offline UPS Systems',
    subtitle: 'Apollo & Kstar double conversion zero-transfer online UPS and line-interactive power backup.',
    icon: Zap,
    bgGradient: 'from-blue-950 via-slate-900 to-[#0F172A]',
    accentColor: 'text-blue-400',
    badge: 'Data Center & Medical Grade',
    featuredBrands: ['Apollo', 'Kstar', 'APC'],
    subcategories: [
      { label: 'All UPS Systems', slug: '' },
      { label: 'Online UPS (1kVA - 20kVA+)', slug: 'online-ups' },
      { label: 'Offline UPS (650VA - 2000VA)', slug: 'offline-ups' },
      { label: 'Industrial & Server UPS', slug: 'industrial-ups' },
    ],
    technicalGuide: {
      title: 'Online vs Offline UPS Guide',
      points: [
        'Online UPS provides 0ms transfer time and pure sinewave isolation, crucial for servers, CT scans, and sensitive lab devices.',
        'Built-in Automatic Voltage Regulation (AVR) stabilizes brownouts and high voltage without depleting the battery.',
        'Orient Computers supplies both internal battery strings and external long-run battery rack cabinets.',
      ],
    },
  },
  'ips': {
    title: 'Pure Sinewave Home IPS & Digital Inverters',
    subtitle: 'Heavy-duty digital inverter systems for continuous residential and commercial uninterrupted power.',
    icon: ShieldCheck,
    bgGradient: 'from-emerald-950 via-slate-900 to-[#0F172A]',
    accentColor: 'text-emerald-400',
    badge: 'Continuous Home Backup',
    featuredBrands: ['Apollo', 'SAKO'],
    subcategories: [
      { label: 'All IPS Inverters', slug: '' },
      { label: 'Sinewave Home UPS', slug: 'sinewave-home-ups' },
      { label: 'Square Wave IPS', slug: 'square-wave-home-ups' },
    ],
    technicalGuide: {
      title: 'IPS Power Sizing Guide',
      points: [
        'Calculate your total wattage: Fan (75W), LED Tube (20W), Laptop (65W), Refrigerator (250W start surge).',
        'Pure Sinewave IPS eliminates humming noise in ceiling fans and prevents motor heating.',
      ],
    },
  },
  'battery': {
    title: 'Industrial, Solar & Storage Batteries',
    subtitle: 'Deep cycle sealed lead acid AGM, VRLA maintenance-free, and high density 51.2V Li-Cube Lithium cells.',
    icon: BatteryCharging,
    bgGradient: 'from-cyan-950 via-slate-900 to-[#0F172A]',
    accentColor: 'text-cyan-400',
    badge: 'Deep Cycle & VRLA',
    featuredBrands: ['LONG', 'Apollo', 'SAKO', 'FirstPower'],
    subcategories: [
      { label: 'All Batteries', slug: '' },
      { label: 'Lithium (Li-Cube / LiFePO4)', slug: 'lithium-batteries' },
      { label: 'VRLA AGM Batteries', slug: 'vrla-batteries' },
      { label: 'Solar Deep Cycle', slug: 'solar-batteries' },
    ],
    technicalGuide: {
      title: 'Battery Maintenance & Lifespan',
      points: [
        'VRLA AGM batteries require zero distilled water topping and never leak acidic gas into office rooms.',
        'Keep ambient temperature near 25°C to maximize float service life and prevent premature thermal degradation.',
      ],
    },
  },
  'telecom': {
    title: 'Telecom Power Solutions & Rectifiers',
    subtitle: 'High efficiency 48V DC power rectifiers, modular inverters, and subrack power systems for BTS towers.',
    icon: Radio,
    bgGradient: 'from-indigo-950 via-slate-900 to-[#0F172A]',
    accentColor: 'text-indigo-400',
    badge: 'Telecom BTS & ISP Grade',
    featuredBrands: ['SAKO', 'Kstar'],
    subcategories: [
      { label: 'All Telecom Power', slug: '' },
      { label: 'Telecom Rectifiers', slug: 'rectifier' },
      { label: 'Modular Inverters', slug: 'telecom-inverter' },
      { label: 'Subrack Systems', slug: 'subrack' },
    ],
    technicalGuide: {
      title: 'Telecom Power Reliability',
      points: [
        'N+1 redundant rectifier modules ensure 100% uptime even if one power module undergoes maintenance.',
        'Hot-swappable modules with remote SNMP Ethernet monitoring for remote tower base stations.',
      ],
    },
  },
  'office-equipment': {
    title: 'Office & Banking Automation Equipment',
    subtitle: 'Commercial vacuum currency counter machines, multi-currency note sorters, and paper shredders.',
    icon: Briefcase,
    bgGradient: 'from-rose-950 via-slate-900 to-[#0F172A]',
    accentColor: 'text-rose-400',
    badge: 'Banking & Commercial Grade',
    featuredBrands: ['Futek', 'Plustek'],
    subcategories: [
      { label: 'All Equipment', slug: '' },
      { label: 'Vacuum Currency Counters', slug: 'vacuum-type-money-counter' },
      { label: 'Banknote Sorters', slug: 'money-sorting-machines' },
      { label: 'Document Scanners', slug: 'document-scanner' },
    ],
    technicalGuide: {
      title: 'Bank Currency Counter Buying Tips',
      points: [
        'Vacuum floor-standing counters count 100 banded notes in 3.5 seconds with built-in dust extraction.',
        'UV, MG, IR, and Dual CIS sensors accurately detect counterfeit banknotes across BDT, USD, EUR, and GBP.',
      ],
    },
  },
};

export default function CategoryLandingPage({ slug: propSlug }) {
  const { slug: routeSlug } = useParams();
  const location = useLocation();

  // Normalize slug from route, prop, or pathname (e.g. "/Renewable%20Energy" -> "renewable-energy")
  let currentSlug = propSlug || routeSlug;
  if (!currentSlug) {
    const cleanPath = decodeURIComponent(location.pathname).replace(/^\//, '').toLowerCase();
    if (cleanPath === 'renewable energy' || cleanPath === 'renewable-energy') currentSlug = 'renewable-energy';
    else if (cleanPath === 'audio-visual' || cleanPath === 'audiovisual') currentSlug = 'audio-visual';
    else if (cleanPath === 'office-equipment' || cleanPath === 'office equipment') currentSlug = 'office-equipment';
    else currentSlug = cleanPath;
  }

  const meta = CATEGORY_META[currentSlug] || {
    title: `${currentSlug?.toUpperCase()} Products`,
    subtitle: 'Explore authentic hardware, power, and enterprise solutions from Orient Computers.',
    icon: Layers,
    bgGradient: 'from-slate-900 to-[#0F172A]',
    accentColor: 'text-blue-400',
    badge: 'Official Catalog',
    featuredBrands: ['ViewSonic', 'SAKO', 'Apollo', 'Patriot', 'TrendSonic'],
    subcategories: [{ label: 'All Products', slug: '' }],
    technicalGuide: null,
  };

  const IconComponent = meta.icon;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products?category=${currentSlug}`);
        if (res.data.success) {
          setProducts(res.data.products || []);
        }
      } catch (err) {
        console.error('Error fetching category products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSlug]);

  // Filter and sort products
  const filteredProducts = products.filter((p) => {
    if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
    if (selectedBrand && p.brand?.toLowerCase() !== selectedBrand.toLowerCase()) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // Default
  });

  const availableBrands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Category Hero Banner */}
      <div className={`relative rounded-3xl bg-gradient-to-r ${meta.bgGradient} border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl`}>
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
              <IconComponent className="h-3.5 w-3.5" />
              <span>{meta.badge}</span>
            </span>

            <span className="text-xs text-slate-300 font-medium">
              Authorized Wholesale & Retail Stock
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
            {meta.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {meta.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="tel:09642222224"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md flex items-center space-x-2 transition-colors"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Direct Hotline: 09642222224</span>
            </a>

            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold text-xs transition-colors"
            >
              Request Custom B2B Quotation
            </button>
          </div>
        </div>
      </div>

      {/* 2. Subcategories & Filter Bar */}
      <div className="space-y-4">
        {/* Subcategory Pills */}
        {meta.subcategories?.length > 1 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {meta.subcategories.map((sub) => {
              const active = selectedSubcategory === sub.slug;
              return (
                <button
                  key={sub.slug}
                  onClick={() => setSelectedSubcategory(sub.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Secondary Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 font-medium">Filter by Brand:</span>
            <button
              onClick={() => setSelectedBrand('')}
              className={`px-3 py-1 rounded-lg border transition-colors ${
                selectedBrand === ''
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              All Brands
            </button>
            {availableBrands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-3 py-1 rounded-lg border transition-colors ${
                  selectedBrand === b
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className="flex items-center space-x-1 border-l border-slate-800 pl-3">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Product Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {filteredProducts.map((prod) => (
            <ProductCard key={prod._id || prod.id} product={prod} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-heading">
            No products match this filter
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your brand or subcategory filter to see all products in {meta.title}.
          </p>
          <button
            onClick={() => {
              setSelectedSubcategory('');
              setSelectedBrand('');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* 4. Technical Buyer Guide Section */}
      {meta.technicalGuide && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-blue-400">
            <HelpCircle className="h-5 w-5" />
            <h3 className="text-base font-bold text-white font-heading">
              {meta.technicalGuide.title}
            </h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            {meta.technicalGuide.points.map((pt, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. Direct B2B Quotation Footer Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-[#0F172A] border border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-white font-heading">
            Need Bulk Pricing or Institutional Tender Proposals?
          </h4>
          <p className="text-xs text-slate-400">
            Our engineering team at Concord Tower Head Office provides official quotations with VAT & warranty support.
          </p>
        </div>

        <button
          onClick={() => setIsQuoteModalOpen(true)}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors flex-shrink-0 flex items-center space-x-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>Request Tender / RFQ Quote</span>
        </button>
      </div>

      <QuotationModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        product={{ title: meta.title, brand: meta.featuredBrands?.[0] || 'Orient Computers' }}
      />
    </div>
  );
}
