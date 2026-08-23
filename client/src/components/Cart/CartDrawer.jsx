import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cartItems,
    isDrawerOpen,
    closeDrawer,
    removeFromCart,
    updateQuantity,
    totalItems,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = useCart();

  if (!isDrawerOpen) return null;

  const handleCheckoutClick = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    closeDrawer();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Backdrop Overlay */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F172A] border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-white">Your Cart</h3>
                <p className="text-xs text-slate-400">{totalItems} {totalItems === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body / Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-slate-800/80">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="h-20 w-20 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
                  <ShoppingCart className="h-10 w-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-semibold text-lg text-slate-200">
                    Your cart is empty
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Discover high-performance processors, GPUs, laptops, and networking hardware.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate('/shop');
                  }}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/25 transition-all"
                >
                  <span>Explore Hardware Store</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.product} className="pt-4 first:pt-0 flex space-x-4 group">
                  {/* Thumbnail */}
                  <img
                    src={item.image || 'https://via.placeholder.com/80'}
                    alt={item.title}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl bg-slate-800 border border-slate-700 flex-shrink-0"
                  />

                  {/* Info & Quantity controls */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={closeDrawer}
                          className="text-xs sm:text-sm font-medium text-slate-200 hover:text-cyan-400 line-clamp-2 transition-colors"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors flex-shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.brand}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Stepper */}
                      <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product, item.qty - 1)}
                          className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-bold text-white px-2 min-w-[20px] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product, item.qty + 1)}
                          className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-xs sm:text-sm font-bold text-orange-400">
                          {formatPrice(item.price * item.qty)}
                        </div>
                        {item.qty > 1 && (
                          <div className="text-[10px] text-slate-400">
                            {formatPrice(item.price)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Controls */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-slate-200 font-semibold">{formatPrice(itemsPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Truck className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Estimated Shipping</span>
                  </span>
                  <span>{shippingPrice === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatPrice(shippingPrice)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm">
                  <span className="font-bold text-white">Estimated Total</span>
                  <span className="font-extrabold text-orange-400 text-base">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={handleViewCartClick}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-medium text-xs transition-colors"
                >
                  View Full Cart & Apply Coupon
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>100% Genuine Hardware & Official Warranty Guaranteed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
