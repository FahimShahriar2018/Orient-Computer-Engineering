import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { formatPrice, formatDate } from '../utils/formatters';
import api from '../services/api';

const PIPELINE_STEPS = [
  { key: 'Pending', label: 'Order Placed', desc: 'Received online' },
  { key: 'Confirmed', label: 'Confirmed', desc: 'Payment & SKU verified' },
  { key: 'Processing', label: 'Processing', desc: 'Allocated in warehouse' },
  { key: 'Shipped', label: 'Dispatched', desc: 'In courier transit' },
  { key: 'Delivered', label: 'Delivered', desc: 'Package completed' },
];

export default function TrackOrderPage() {
  const { trackingNumber: urlTracking } = useParams();
  const [trackingInput, setTrackingInput] = useState(urlTracking || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTrack = async (code) => {
    if (!code) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await api.get(`/orders/track/${code.trim()}`);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No active order matching this tracking reference.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlTracking) {
      fetchTrack(urlTracking);
    }
  }, [urlTracking]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTrack(trackingInput);
  };

  const getStepIndex = (status) => {
    const idx = PIPELINE_STEPS.findIndex((s) => s.key.toLowerCase() === (status || '').toLowerCase());
    return idx >= 0 ? idx : 0;
  };

  const currentStepIndex = getStepIndex(order?.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-sm">
          <Truck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
          Track Your Hardware Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Enter your unique Orient Computers tracking code (e.g. <code>ORIENT-2026-948102</code>) to view live fulfillment updates.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
        <div className="relative flex items-center rounded-2xl bg-slate-900 border border-slate-700 p-1.5 focus-within:border-blue-500 shadow-sm overflow-hidden">
          <input
            type="text"
            required
            value={trackingInput}
            onChange={(e) => setTrackingInput(e.target.value)}
            placeholder="Enter Tracking ID: ORIENT-2026-XXXXXX"
            className="w-full bg-transparent px-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none uppercase font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-colors flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            <span>{loading ? 'Searching...' : 'Track'}</span>
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center flex items-center justify-center space-x-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8 space-y-8 shadow-sm animate-in fade-in">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                Tracking Reference
              </div>
              <div className="font-mono font-extrabold text-xl sm:text-2xl text-white">
                {order.trackingNumber}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Placed on {formatDate(order.createdAt)} • Destination: {order.shippingAddress?.district}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                Status: {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Visual Fulfillment Pipeline */}
          <div className="py-4">
            <div className="grid grid-cols-5 gap-2 text-center relative">
              {PIPELINE_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center space-y-2 relative z-10">
                    <div
                      className={`h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-500/20'
                          : isPassed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-900 border border-slate-800 text-slate-600'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isPassed ? 'text-white' : 'text-slate-500'}`}>
                        {step.label}
                      </div>
                      <div className="text-[10px] text-slate-400 hidden sm:block">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity / Status History Log */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Live Timeline Log</span>
            </h4>

            <div className="space-y-3 divide-y divide-slate-800/80">
              {order.statusHistory?.map((h, i) => (
                <div key={i} className="pt-3 first:pt-0 flex items-start justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-blue-400">{h.status}</div>
                    <div className="text-slate-300">{h.note}</div>
                  </div>
                  <div className="text-[11px] text-slate-500">{formatDate(h.timestamp)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Items Preview */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Package Contents ({order.orderItems?.length || 0} items)
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 divide-y divide-slate-800">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <span className="text-white font-medium truncate max-w-md">{item.title}</span>
                  <span className="text-slate-300 font-semibold ml-2">Qty: {item.qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
