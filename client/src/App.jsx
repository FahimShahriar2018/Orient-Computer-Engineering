import React, { useState, useEffect } from 'react';
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
  Sparkles,
  ExternalLink,
  Terminal
} from 'lucide-react';
import api from './services/api';

export default function App() {
  const [serverStatus, setServerStatus] = useState({
    loading: true,
    online: false,
    data: null,
    error: null,
  });

  const checkHealth = async () => {
    setServerStatus((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await api.get('/health');
      setServerStatus({
        loading: false,
        online: true,
        data: res.data,
        error: null,
      });
    } catch (err) {
      setServerStatus({
        loading: false,
        online: false,
        data: null,
        error: err.message || 'Unable to connect to backend server',
      });
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const phases = [
    { id: 1, title: 'Phase 1: Environment & Setup', status: 'Completed', active: true, desc: 'Root monorepo, Express REST API, React 18, Vite & Tailwind CSS.' },
    { id: 2, title: 'Phase 2: Schemas & Seeding', status: 'Next Up', active: false, desc: 'MongoDB Mongoose models (User, Product, Category, Order) & realistic tech seeder.' },
    { id: 3, title: 'Phase 3: Backend REST APIs', status: 'Upcoming', active: false, desc: 'JWT auth, multi-facet product filter endpoints, order management & admin APIs.' },
    { id: 4, title: 'Phase 4: Store Navigation & State', status: 'Upcoming', active: false, desc: 'Mega menu, Amazon-style search, Auth/Cart/Wishlist context providers.' },
    { id: 5, title: 'Phase 5: Storefront Experience', status: 'Upcoming', active: false, desc: 'Hero carousel, deals countdown, catalog filtering sidebar, and rich PDP.' },
    { id: 6, title: 'Phase 6: Cart & Multi-Step Checkout', status: 'Upcoming', active: false, desc: 'Slide-out cart drawer, BD districts shipping selection, bKash/COD mock payment.' },
    { id: 7, title: 'Phase 7: User Accounts & History', status: 'Upcoming', active: false, desc: 'Customer authentication, profile settings, order tracking timeline.' },
    { id: 8, title: 'Phase 8: Admin Management Panel', status: 'Upcoming', active: false, desc: 'Analytics cards, product inventory CRUD, and order fulfillment controls.' },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      {/* Top Brand Notification Bar */}
      <header className="border-b border-slate-800 bg-[#0F172A]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-white">
                ORIENT
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-400 ml-1.5 px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                Computers & Engineering
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Architecture: MERN + Vite + Tailwind</span>
            </div>

            <button
              onClick={checkHealth}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-medium transition-all"
            >
              <Server className="h-3.5 w-3.5" />
              <span>Ping Server</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Showcase */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0F172A] border border-slate-800 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Phase 1 Completed Successfully</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Orient Computers & Engineering <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-orange-400">
                E-Commerce Platform Core
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Environment configured with unified scripts, Express REST API backend, React 18 frontend powered by Vite, and a high-performance Tailwind CSS tech design system.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-slate-200">Security: JWT + Bcrypt</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm">
                <HardDrive className="h-4 w-4 text-cyan-400" />
                <span className="text-slate-200">Database: MongoDB Mongoose</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm">
                <Monitor className="h-4 w-4 text-orange-400" />
                <span className="text-slate-200">UI: Tailwind + Lucide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Server & System Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 rounded-2xl bg-[#0F172A] border border-slate-800 p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Backend Status</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  serverStatus.online ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {serverStatus.loading ? 'Checking...' : serverStatus.online ? 'Online' : 'Standby / Disconnected'}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">REST API Gateway</h3>
              <p className="text-xs text-slate-400">Port: 5000 | Target: /api/health</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
              {serverStatus.loading ? (
                <div className="flex items-center space-x-2 text-slate-400">
                  <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting to API...</span>
                </div>
              ) : serverStatus.online ? (
                <div className="space-y-1 text-emerald-400">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>200 OK - Health Verified</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{serverStatus.data?.message}</p>
                </div>
              ) : (
                <div className="space-y-1 text-amber-400">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Server Not Running</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Run <code className="text-cyan-400">npm run dev</code> from root.</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 rounded-2xl bg-[#0F172A] border border-slate-800 p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Project Directory Layout</span>
                <h3 className="text-lg font-bold text-white">Dual Monorepo Architecture</h3>
              </div>
              <Terminal className="h-5 w-5 text-cyan-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
                <span className="text-cyan-400 font-bold">📂 server/</span>
                <ul className="mt-1.5 space-y-1 text-slate-400 pl-3 border-l border-slate-800">
                  <li>├── <span className="text-slate-200">config/db.js</span> (Mongoose)</li>
                  <li>├── <span className="text-slate-200">controllers/</span> (Endpoints)</li>
                  <li>├── <span className="text-slate-200">models/</span> (Mongoose Schemas)</li>
                  <li>├── <span className="text-slate-200">middleware/</span> (Auth & Error)</li>
                  <li>└── <span className="text-slate-200">server.js</span> (Express Gateway)</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
                <span className="text-orange-400 font-bold">📂 client/</span>
                <ul className="mt-1.5 space-y-1 text-slate-400 pl-3 border-l border-slate-800">
                  <li>├── <span className="text-slate-200">src/components/</span> (UI & Mega Menu)</li>
                  <li>├── <span className="text-slate-200">src/context/</span> (Auth, Cart, Wishlist)</li>
                  <li>├── <span className="text-slate-200">src/pages/</span> (Home, Shop, PDP, Admin)</li>
                  <li>├── <span className="text-slate-200">src/services/api.js</span> (Axios Client)</li>
                  <li>└── <span className="text-slate-200">tailwind.config.js</span> (Orient Theme)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Roadmap */}
        <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Project Roadmap & Execution Stages</h2>
              <p className="text-xs text-slate-400">Step-by-step progress tracking for Orient Computers E-Commerce build.</p>
            </div>
            <div className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
              Stage 1 of 8 Complete
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map((phase) => (
              <div 
                key={phase.id}
                className={`p-4 rounded-xl border transition-all ${
                  phase.active 
                    ? 'bg-gradient-to-b from-cyan-950/30 to-slate-900 border-cyan-500/40 shadow-lg shadow-cyan-500/5' 
                    : 'bg-slate-900/50 border-slate-800/80 opacity-80 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400 font-mono">0{phase.id}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    phase.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    phase.status === 'Next Up' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {phase.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-100 mb-1 line-clamp-1">{phase.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0F172A] py-6 text-center text-xs text-slate-500">
        <p>© 2026 Orient Computers & Engineering. All Rights Reserved. Built for Internship Showcase.</p>
      </footer>
    </div>
  );
}
