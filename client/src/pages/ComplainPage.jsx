import React, { useState } from 'react';
import {
  AlertTriangle,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  ShieldAlert,
  FileText,
  User,
  Hash,
} from 'lucide-react';

export default function ComplainPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    orderNumber: '',
    issueType: 'Warranty / RMA Issue',
    productModel: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTicketId(`ORIENT-CMP-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      orderNumber: '',
      issueType: 'Warranty / RMA Issue',
      productModel: '',
      description: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-[#0F172A] border border-red-900/40 p-8 sm:p-10 overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
            <ShieldAlert className="h-4 w-4" />
            <span>Dedicated Customer Care & Grievance Cell</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading tracking-tight">
            Complain & Support Box
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            At Orient Computers & Engineering, customer satisfaction and genuine warranty fulfillment are our highest priorities. If you encountered any issue with a product, service, or delivery, please let us know directly.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-5 shadow-2xl">
          <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white font-heading">
              Grievance Ticket Registered Successfully
            </h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
              Your complain ticket number is{' '}
              <strong className="text-blue-400 font-mono text-sm">{ticketId}</strong>. A customer support supervisor from Orient Computers will contact you within 24 hours to resolve your issue.
            </p>
          </div>

          <div className="p-4 max-w-md mx-auto rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2 text-left">
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span>Customer Name:</span>
              <strong className="text-slate-200">{formData.name}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span>Phone Contact:</span>
              <strong className="text-slate-200">{formData.phone}</strong>
            </div>
            <div className="flex justify-between">
              <span>Category:</span>
              <strong className="text-blue-400">{formData.issueType}</strong>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
          >
            Submit Another Complaint
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white font-heading border-b border-slate-800 pb-3">
              Submit Your Grievance or Warranty Complaint
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Contact Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="email"
                      placeholder="your.email@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Order ID / Invoice No. (if applicable)
                  </label>
                  <div className="relative">
                    <Hash className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="e.g. ORIENT-2026-948102"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Issue Category *
                  </label>
                  <select
                    value={formData.issueType}
                    onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Warranty / RMA Issue">Warranty / Product Defect</option>
                    <option value="Delayed Delivery">Delayed Courier Delivery</option>
                    <option value="Wrong Item Received">Wrong Item Received</option>
                    <option value="Technical Installation Help">Technical / Installation Support</option>
                    <option value="Billing / Payment Inquiry">Payment & Billing Issue</option>
                    <option value="Staff Behavior">Customer Service Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Product Brand / Model
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ViewSonic IFP7551 / SAKO 300W ESS"
                    value={formData.productModel}
                    onChange={(e) => setFormData({ ...formData, productModel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Detailed Explanation of the Issue *
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Please describe what happened, serial numbers, date of purchase, or any error codes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>{loading ? 'Submitting Complain...' : 'Register Complaint Ticket'}</span>
              </button>
            </form>
          </div>

          {/* Direct Assistance Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-heading">
                Direct Hotline Assistance
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                For immediate technical emergency or urgent warranty assistance, contact our technical team directly:
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href="tel:09642222224"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <Phone className="h-5 w-5 text-blue-400" />
                  <div>
                    <div className="text-[10px] text-slate-400">Direct Hotline</div>
                    <div className="text-xs font-bold text-white font-mono">09642222224</div>
                  </div>
                </a>

                <a
                  href="mailto:support@orientcomputers.com.bd"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <div className="text-[10px] text-slate-400">Email RMA Cell</div>
                    <div className="text-xs font-bold text-white">support@orientcomputers.com.bd</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-blue-950/40 border border-blue-900/40 space-y-3">
              <div className="text-xs font-bold text-blue-300">
                Official Warranty Policy
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                All hardware, UPS, displays, and energy products sold by Orient Computers carry 100% genuine official importer warranty. Please preserve your original invoice or order tracking number for seamless RMA service.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
