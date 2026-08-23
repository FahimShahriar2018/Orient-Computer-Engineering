import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  Printer,
  ChevronRight,
  ShieldCheck,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { formatPrice, formatDate } from '../utils/formatters';
import api from '../services/api';

export default function OrderDetailPage() {
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
        console.error('Error fetching order details', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>
        <Link to="/account" className="inline-block px-6 py-2.5 bg-cyan-600 text-white font-bold text-xs rounded-xl">
          Return to My Account
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-cyan-400">Home</Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <Link to="/account" className="hover:text-cyan-400">My Account</Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-slate-200">Order {order.trackingNumber}</span>
      </div>

      {/* Main Order Card */}
      <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
              Order Reference
            </div>
            <h1 className="font-mono font-extrabold text-2xl text-white">
              {order.trackingNumber}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Placed on {formatDate(order.createdAt)}</p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase">
              {order.orderStatus}
            </span>
            <Link
              to={`/order-success/${order._id}`}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center space-x-1.5"
            >
              <Printer className="h-4 w-4 text-orange-400" />
              <span>Print Invoice</span>
            </Link>
          </div>
        </div>

        {/* Shipping & Payment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-cyan-400 font-bold uppercase text-[11px]">Delivery Recipient</div>
            <div className="text-white font-bold">{order.shippingAddress?.fullName}</div>
            <div className="text-slate-400">{order.shippingAddress?.phone}</div>
            <div className="text-slate-400">{order.shippingAddress?.address}, {order.shippingAddress?.district}, {order.shippingAddress?.division}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-orange-400 font-bold uppercase text-[11px]">Payment & Delivery</div>
            <div className="text-white font-bold uppercase">{order.paymentMethod} Payment</div>
            <div className="text-slate-400 capitalize">Method: {order.deliveryMethod?.replace(/_/g, ' ')}</div>
            <div className="text-emerald-400 font-semibold">{order.isPaid ? '✔ Paid' : '⏳ Payment Pending'}</div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Purchased Hardware ({order.orderItems?.length})
          </h3>
          <div className="rounded-xl bg-slate-900 border border-slate-800 divide-y divide-slate-800 overflow-hidden">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg bg-slate-800" />
                  <div>
                    <span className="font-bold text-white block max-w-sm">{item.title}</span>
                    <span className="text-slate-500 font-mono">Qty: {item.qty} × {formatPrice(item.price)}</span>
                  </div>
                </div>
                <span className="font-extrabold text-orange-400 text-sm">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grand Total */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-semibold text-white">{formatPrice(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-white">{order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-800 text-white">
              <span>Total Paid:</span>
              <span className="font-extrabold text-orange-400 text-lg">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
