import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Printer,
  Truck,
  ArrowRight,
  ShieldCheck,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Building,
} from 'lucide-react';
import { formatPrice, formatDate } from '../utils/formatters';
import api from '../services/api';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error('Error fetching order receipt', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs">Generating official invoice receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Invoice Not Found</h2>
        <Link to="/" className="inline-block px-6 py-2.5 bg-cyan-600 text-white font-bold text-xs rounded-xl">
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Banner (Screen Only) */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#0A101D] border border-emerald-500/30 p-8 text-center space-y-4 shadow-2xl print:hidden">
        <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Order Confirmed & Allocated
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            Thank You for Shopping with Orient Computers!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Your computer hardware items have been reserved in our central warehouse. A confirmation SMS/Email has been dispatched.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center space-x-2 transition-colors"
          >
            <Printer className="h-4 w-4 text-cyan-400" />
            <span>Print Invoice Receipt</span>
          </button>

          <Link
            to={`/track-order/${order.trackingNumber}`}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/25 flex items-center space-x-2 transition-colors"
          >
            <Truck className="h-4 w-4" />
            <span>Track Delivery Pipeline</span>
          </Link>
        </div>
      </div>

      {/* Official Printable Invoice Sheet */}
      <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-8 sm:p-12 space-y-8 shadow-2xl text-slate-200 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-800 print:border-slate-300 gap-4">
          <div>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-white print:text-black">
              ORIENT
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 ml-1.5 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 print:border-black print:text-black">
              Computers & Engineering
            </span>
            <p className="text-[11px] text-slate-400 print:text-gray-600 mt-1">
              Motijheel Commercial Area, Dhaka-1000, Bangladesh • Hotline: +880 1711-000001
            </p>
          </div>

          <div className="text-right sm:text-right space-y-1">
            <div className="text-xs uppercase font-bold text-cyan-400 print:text-black">TAX INVOICE</div>
            <div className="font-mono text-sm font-bold text-white print:text-black">#{order._id.substring(0, 10).toUpperCase()}</div>
            <div className="text-xs text-slate-400 print:text-gray-600">{formatDate(order.createdAt)}</div>
          </div>
        </div>

        {/* Tracking & Customer Details Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 print:bg-gray-100 print:border-gray-300 text-xs">
          <div>
            <div className="text-[11px] font-bold text-slate-400 print:text-gray-600 uppercase mb-1">
              Tracking Reference:
            </div>
            <div className="font-mono font-extrabold text-orange-400 print:text-black text-sm">
              {order.trackingNumber}
            </div>
            <div className="text-[11px] text-slate-400 capitalize mt-0.5">
              Status: <strong className="text-emerald-400 print:text-black">{order.orderStatus}</strong>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 print:text-gray-600 uppercase mb-1">
              Billed & Shipped To:
            </div>
            <div className="font-bold text-white print:text-black">{order.shippingAddress?.fullName}</div>
            <div className="text-slate-400 print:text-gray-700">{order.shippingAddress?.phone}</div>
            <div className="text-slate-400 print:text-gray-700">
              {order.shippingAddress?.address}, {order.shippingAddress?.district}, {order.shippingAddress?.division}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 print:text-gray-600 uppercase mb-1">
              Payment & Courier:
            </div>
            <div className="font-bold text-white print:text-black uppercase">{order.paymentMethod} Payment</div>
            <div className="text-slate-400 print:text-gray-700 capitalize">
              Delivery: {order.deliveryMethod?.replace(/_/g, ' ')}
            </div>
            <div className="text-emerald-400 print:text-black font-semibold mt-0.5">
              {order.isPaid ? '✔ Payment Received' : '⏳ Payment on Delivery'}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 print:border-gray-300 text-slate-400 print:text-gray-700 font-bold uppercase text-[10px]">
                <th className="py-3 px-2">Item Description</th>
                <th className="py-3 px-2">SKU</th>
                <th className="py-3 px-2 text-right">Unit Price</th>
                <th className="py-3 px-2 text-center">Qty</th>
                <th className="py-3 px-2 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 print:divide-gray-300">
              {order.orderItems?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-2 font-semibold text-white print:text-black max-w-sm">
                    {item.title}
                  </td>
                  <td className="py-3 px-2 text-slate-400 print:text-gray-600 font-mono text-[11px]">
                    {item.sku || 'HW-GEN-01'}
                  </td>
                  <td className="py-3 px-2 text-right text-slate-300 print:text-black">
                    {formatPrice(item.price)}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-white print:text-black">
                    {item.qty}
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-orange-400 print:text-black">
                    {formatPrice(item.price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end pt-4 border-t border-slate-800 print:border-gray-300">
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400 print:text-gray-700">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-200 print:text-black">{formatPrice(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-400 print:text-gray-700">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-slate-200 print:text-black">
                {order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-800 print:border-gray-300 text-white print:text-black">
              <span>Grand Total:</span>
              <span className="font-extrabold text-orange-400 print:text-black">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Warranty Assurance Footer */}
        <div className="pt-6 border-t border-slate-800 print:border-gray-300 text-[11px] text-slate-500 print:text-gray-600 flex items-center justify-between">
          <span>Official Warranty provided by Orient Computers & Engineering authorized service centers.</span>
          <span>Computer Generated Receipt</span>
        </div>
      </div>
    </div>
  );
}
