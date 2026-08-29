import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  LogIn,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';

const VALID_COUPONS = {
  ORIENT10: { type: 'percent', value: 10, label: '10% Storewide Discount' },
  ORIENT500: { type: 'fixed', value: 500, label: '৳500 Instant Discount' },
  GAMING2026: { type: 'percent', value: 5, label: '5% Gaming Hardware Discount' },
};

export default function CartPage() {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    itemsPrice,
    shippingPrice,
  } = useCart();

  const handleCheckout = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    navigate('/checkout');
  };

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (!code) return;

    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ code, ...VALID_COUPONS[code] });
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try ORIENT10 or ORIENT500');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculate discount amount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((itemsPrice * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const finalTotal = Math.max(0, itemsPrice - discountAmount + shippingPrice);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <div className="h-24 w-24 rounded-3xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-500 shadow-2xl">
          <ShoppingCart className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            Your Shopping Cart is Empty
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            You haven't added any computer components or accessories yet. Explore our genuine hardware catalog with official brand warranty.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-colors"
        >
          <span>Explore Hardware Catalog</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-slate-200">Shopping Cart</span>
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center space-x-2.5">
            <ShoppingCart className="h-7 w-7 text-blue-500" />
            <span>Review Your Shopping Cart</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {totalItems} {totalItems === 1 ? 'hardware item' : 'hardware items'} selected for purchase.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Main Grid: Cart Items List (8 Cols) & Summary Box (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl bg-[#0F172A] border border-slate-800 overflow-hidden shadow-sm divide-y divide-slate-800">
            {cartItems.map((item) => (
              <div key={item.product} className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between group">
                {/* Image & Title */}
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <img
                    src={item.image || 'https://via.placeholder.com/80'}
                    alt={item.title}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl bg-slate-900 border border-slate-700 flex-shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                      {item.brand}
                    </span>
                    <Link
                      to={`/product/${item.slug}`}
                      className="block text-sm font-heading font-bold text-white hover:text-blue-400 transition-colors line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <div className="text-xs text-slate-400 font-mono">
                      Unit Price: {formatPrice(item.price)}
                    </div>
                  </div>
                </div>

                {/* Quantity & Line Total */}
                <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {/* Stepper */}
                  <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.product, item.qty - 1)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-bold text-white px-2.5 min-w-[24px] text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product, item.qty + 1)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[100px]">
                    <div className="text-base font-extrabold text-white">
                      {formatPrice(item.price * item.qty)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product)}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Promo Code Card */}
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Tag className="h-4 w-4" />
              <span>Apply Discount Voucher Code</span>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>Coupon <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.label})</span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs text-rose-400 hover:underline font-semibold ml-4"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code: ORIENT10 or ORIENT500"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 font-semibold text-xs transition-colors"
                >
                  Apply Voucher
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-xs text-rose-400 flex items-center space-x-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{couponError}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Col: Order Summary Box (Sticky) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0F172A] border border-slate-800 p-6 space-y-5 shadow-sm sticky top-28">
          <h3 className="text-base font-heading font-bold text-white border-b border-slate-800 pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Items Subtotal ({totalItems} items)</span>
              <span className="text-slate-200 font-semibold">{formatPrice(itemsPrice)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Voucher Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400">
              <span className="flex items-center space-x-1">
                <Truck className="h-3.5 w-3.5 text-slate-400" />
                <span>Estimated Delivery</span>
              </span>
              <span>{shippingPrice === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatPrice(shippingPrice)}</span>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between text-base">
              <span className="font-bold text-white">Estimated Total</span>
              <span className="font-extrabold text-white text-xl">
                {formatPrice(finalTotal)}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm flex items-center justify-center space-x-2 transition-colors transform active:scale-[0.98]"
          >
            {user ? (
              <>
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Sign In to Checkout</span>
              </>
            )}
          </button>

          <Link
            to="/shop"
            className="block text-center text-xs text-slate-400 hover:text-blue-400 transition-colors"
          >
            ← Continue Shopping
          </Link>

          <div className="pt-4 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Official Brand Replacement Warranty</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>Free Delivery on orders above ৳50,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
