import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  Building,
  User,
  CheckCircle2,
  Send,
  FileText,
} from 'lucide-react';

export default function QuotationModal({ isOpen, onClose, product }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    quantity: 1,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      company: '',
      quantity: 1,
      message: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-[#0F172A] border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              Quotation Request Received!
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-semibold text-white">{formData.name}</span>. Our enterprise sales engineering team at Orient Computers will review your requirement for{' '}
              <span className="text-blue-400 font-semibold">{product?.title || 'this product'}</span> and call you back on{' '}
              <span className="text-emerald-400 font-semibold">{formData.phone}</span> with the official quotation.
            </p>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div>Immediate Inquiry Hotline:</div>
              <a
                href="tel:09642222224"
                className="text-blue-400 hover:underline font-bold text-sm flex items-center justify-center space-x-1"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>09642222224</span>
              </a>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold mb-2">
                <FileText className="h-3.5 w-3.5" />
                <span>Wholesale & B2B Quotation</span>
              </div>
              <h3 className="text-lg font-bold text-white font-heading">
                Request Official Price Quote
              </h3>
              <p className="text-xs text-slate-400">
                Get competitive wholesale or customized institutional pricing from Orient Computers & Engineering.
              </p>
            </div>

            {/* Product Summary */}
            {product && (
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/80'}
                  alt={product.title}
                  className="h-12 w-12 object-contain rounded-lg bg-white/5 p-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {product.title}
                  </div>
                  <div className="text-[11px] text-blue-400 font-mono">
                    SKU: {product.sku || 'N/A'} • {product.brand}
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Engr. Rahim Ahmed"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Phone / Mobile *
                  </label>
                  <div className="relative">
                    <Phone className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="email"
                      placeholder="procurement@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="e.g. Grameenphone / Tech BD"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Estimated Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Specific Requirements or Delivery Location
                </label>
                <textarea
                  rows="3"
                  placeholder="Mention delivery site, required delivery date, or installation support needs..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <a
                  href="tel:09642222224"
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-blue-400" />
                  <span>Direct Call</span>
                </a>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{loading ? 'Submitting...' : 'Submit Quotation Request'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
