import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  User,
  AlertCircle,
  Building,
  Package,
  Zap,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BANGLADESH_DIVISIONS, getDistrictsByDivision } from '../utils/bangladeshLocations';
import { formatPrice } from '../utils/formatters';
import api from '../services/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, itemsPrice, clearCart } = useCart();
  const { user, openAuthModal, login, setUserSession } = useAuth();

  // Multi-step indicator (1: Shipping -> 2: Delivery -> 3: Payment -> 4: Review)
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Step 1: Shipping Address State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    division: user?.address?.division || 'Dhaka',
    district: user?.address?.district || 'Dhaka',
    address: user?.address?.street || '',
    postalCode: user?.address?.postalCode || '1209',
  });

  // Sync shipping address whenever logged-in user changes
  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
        division: prev.division || user.address?.division || 'Dhaka',
        district: prev.district || user.address?.district || 'Dhaka',
        address: prev.address || user.address?.street || '',
        postalCode: prev.postalCode || user.address?.postalCode || '1209',
      }));
    }
  }, [user]);

  const handleQuickDemoLogin = async () => {
    try {
      await login('customer@orientcomputers.com.bd', 'customer123');
    } catch (err) {
      console.error('Demo login error', err);
    }
  };

  // Step 2: Delivery Method State
  const [deliveryMethod, setDeliveryMethod] = useState('standard_inside_dhaka');

  // Step 3: Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'bkash' | 'nagad' | 'card'
  const [paymentDetails, setPaymentDetails] = useState({
    phoneNumber: user?.phone || '',
    transactionId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  // Available districts for current division
  const availableDistricts = getDistrictsByDivision(shippingAddress.division);

  // Auto-switch delivery method if outside Dhaka
  useEffect(() => {
    if (shippingAddress.division !== 'Dhaka' && deliveryMethod === 'standard_inside_dhaka') {
      setDeliveryMethod('standard_outside_dhaka');
    } else if (shippingAddress.division === 'Dhaka' && deliveryMethod === 'standard_outside_dhaka') {
      setDeliveryMethod('standard_inside_dhaka');
    }
  }, [shippingAddress.division]);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold font-heading text-white">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-400">Add computer hardware to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors">
          Return to Store Catalog
        </Link>
      </div>
    );
  }

  // Auth wall — guest users must sign in before they can checkout
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 flex flex-col items-center text-center space-y-6">
        <div className="h-20 w-20 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <LogIn className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-extrabold text-white">Sign In to Continue</h2>
          <p className="text-sm text-slate-400 max-w-sm">
            Your cart items are saved. Please sign in or create an account to complete your purchase.
          </p>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to Your Account</span>
          </button>

          <button
            onClick={() => openAuthModal('register')}
            className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create a New Account</span>
          </button>

          <Link
            to="/cart"
            className="block text-center text-xs text-slate-400 hover:text-blue-400 transition-colors pt-1"
          >
            ← Back to Cart
          </Link>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Your cart items will be preserved after sign in</span>
        </div>
      </div>
    );
  }

  // Calculate delivery fee
  const getDeliveryFee = () => {
    switch (deliveryMethod) {
      case 'standard_inside_dhaka':
        return itemsPrice > 50000 ? 0 : 100;
      case 'standard_outside_dhaka':
        return itemsPrice > 75000 ? 0 : 200;
      case 'express':
        return 300;
      case 'store_pickup':
        return 0;
      default:
        return 100;
    }
  };

  const deliveryFee = getDeliveryFee();
  const grandTotal = itemsPrice + deliveryFee;

  const handleNextStep = (e) => {
    e?.preventDefault();
    if (currentStep === 1) {
      if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
        setOrderError('Please provide your full name, phone number, and delivery street address.');
        return;
      }
    }
    setOrderError('');
    setCurrentStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setOrderError('');
    setCurrentStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setOrderError('');

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          title: item.title,
          image: item.image,
          price: item.price,
          qty: item.qty,
          sku: item.sku,
        })),
        shippingAddress,
        deliveryMethod,
        paymentMethod,
        paymentResult: {
          phone_number: paymentDetails.phoneNumber,
          transaction_id: paymentDetails.transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          status: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED',
        },
        itemsPrice,
        shippingPrice: deliveryFee,
        taxPrice: 0,
        discountPrice: 0,
        totalPrice: grandTotal,
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success) {
        // If guest checkout auto-created user session, save it
        if (res.data.token && res.data.user && !user && setUserSession) {
          setUserSession({
            ...res.data.user,
            token: res.data.token,
          });
        }
        clearCart();
        navigate(`/order-success/${res.data.order._id}`);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setOrderError('Session expired or authentication needed. Please sign in or use Demo Login.');
      } else {
        const msg = err.response?.data?.message || 'Error placing order. Please verify your details.';
        setOrderError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <Link to="/cart" className="hover:text-blue-400 transition-colors">Cart</Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-slate-200">Multi-Step Checkout</span>
      </div>

      {/* Checkout Progress Stepper Header */}
      <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { num: 1, label: 'Shipping' },
            { num: 2, label: 'Delivery' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Confirmation' },
          ].map((st) => (
            <div key={st.num} className="flex flex-col items-center space-y-1">
              <div
                className={`h-8 w-8 rounded-xl font-bold flex items-center justify-center transition-all ${
                  currentStep === st.num
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/40'
                    : currentStep > st.num
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {currentStep > st.num ? <CheckCircle2 className="h-4 w-4" /> : st.num}
              </div>
              <span className={`text-[11px] font-semibold ${currentStep >= st.num ? 'text-white' : 'text-slate-500'}`}>
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Checkout Layout (8 Cols Step Body + 4 Cols Order Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* Error Banner */}
          {orderError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{orderError}</span>
              </div>
              {!user && (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold rounded-lg text-[11px] transition-colors ml-2 flex-shrink-0"
                >
                  Sign In Now
                </button>
              )}
            </div>
          )}

          {/* Guest Checkout & Fast Sign-in Banner (Shown when not authenticated) */}
          {!user && (
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-950/40 border border-blue-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2 text-blue-400 font-bold">
                  <Zap className="h-4 w-4" />
                  <span>Have an Orient Computers Account?</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Sign in to autofill your address, track shipments with live SMS, and manage warranty claims.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-semibold text-xs transition-colors flex items-center space-x-1"
                >
                  <Zap className="h-3 w-3" />
                  <span>1-Click Demo Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition-colors flex items-center space-x-1"
                >
                  <LogIn className="h-3 w-3" />
                  <span>Sign In</span>
                </button>
              </div>
            </div>
          )}

          {/* Logged in User Badge */}
          {user && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Checking out as: <strong className="text-white">{user.name}</strong> ({user.email})</span>
              </div>
              <span className="text-[11px] text-blue-400 font-medium">Logged In Customer</span>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 1: SHIPPING & CONTACT DETAILS */}
          {/* ==================================================== */}
          {currentStep === 1 && (
            <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-heading font-bold text-white flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span>Step 1: Contact & Delivery Address</span>
                </h3>
                <p className="text-xs text-slate-400">Specify recipient information for nationwide delivery.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1.5">Recipient Full Name *</label>
                  <div className="relative">
                    <User className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      placeholder="Fahim Shahriar"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Mobile Phone (Bangladesh) *</label>
                  <div className="relative">
                    <Phone className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      placeholder="+880 1812-345678"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Email Address for Invoice</label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Division Selector */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Division (বিভাগ) *</label>
                  <select
                    value={shippingAddress.division}
                    onChange={(e) => {
                      const newDiv = e.target.value;
                      const dists = getDistrictsByDivision(newDiv);
                      setShippingAddress({
                        ...shippingAddress,
                        division: newDiv,
                        district: dists[0] || '',
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {BANGLADESH_DIVISIONS.map((d) => (
                      <option key={d.name} value={d.name}>{d.name} Division</option>
                    ))}
                  </select>
                </div>

                {/* District Selector */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">District (জেলা) *</label>
                  <select
                    value={shippingAddress.district}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {availableDistricts.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>

                {/* Detailed Street Address */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1.5">Street Address / House / Road / Area *</label>
                  <textarea
                    rows={2}
                    required
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    placeholder="House #42, Road #11, Dhanmondi R/A"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center space-x-2 transition-colors"
                >
                  <span>Continue to Delivery Method</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: DELIVERY METHOD SELECTION */}
          {/* ==================================================== */}
          {currentStep === 2 && (
            <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-heading font-bold text-white flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-blue-400" />
                  <span>Step 2: Choose Delivery Method</span>
                </h3>
                <p className="text-xs text-slate-400">Select courier or showroom collection preference.</p>
              </div>

              <div className="space-y-3">
                {/* Option 1: Standard Dhaka */}
                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    deliveryMethod === 'standard_inside_dhaka'
                      ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="standard_inside_dhaka"
                      checked={deliveryMethod === 'standard_inside_dhaka'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <div>
                      <div className="font-heading font-bold text-sm text-white">Standard Delivery (Inside Dhaka)</div>
                      <p className="text-xs text-slate-400">Delivered within 24-48 Hours across Dhaka Metro</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-white">
                    {itemsPrice > 50000 ? 'FREE' : '৳100'}
                  </span>
                </label>

                {/* Option 2: Standard Outside Dhaka */}
                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    deliveryMethod === 'standard_outside_dhaka'
                      ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="standard_outside_dhaka"
                      checked={deliveryMethod === 'standard_outside_dhaka'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <div>
                      <div className="font-heading font-bold text-sm text-white">Nationwide Courier (Outside Dhaka)</div>
                      <p className="text-xs text-slate-400">Delivered via Sundarban / SA Paribahan / Paperfly in 2-4 Days</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-white">
                    {itemsPrice > 75000 ? 'FREE' : '৳200'}
                  </span>
                </label>

                {/* Option 3: Express Same-Day */}
                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    deliveryMethod === 'express'
                      ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="express"
                      checked={deliveryMethod === 'express'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <div>
                      <div className="font-heading font-bold text-sm text-white">⚡ Express Same-Day Delivery</div>
                      <p className="text-xs text-slate-400">Guaranteed within 6 Hours (Order before 3 PM in Dhaka)</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-white">৳300</span>
                </label>

                {/* Option 4: Store Pickup */}
                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    deliveryMethod === 'store_pickup'
                      ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="store_pickup"
                      checked={deliveryMethod === 'store_pickup'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <div>
                      <div className="font-heading font-bold text-sm text-white">🏬 Showroom Pickup (Motijheel, Dhaka)</div>
                      <p className="text-xs text-slate-400">Collect directly from Orient Engineering Center with live testing</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-emerald-400">FREE</span>
                </label>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center space-x-2 transition-colors"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 3: PAYMENT METHOD SIMULATION */}
          {/* ==================================================== */}
          {currentStep === 3 && (
            <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-heading font-bold text-white flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  <span>Step 3: Select Payment Option</span>
                </h3>
                <p className="text-xs text-slate-400">Choose Cash on Delivery or simulated Bangladeshi digital payment.</p>
              </div>

              <div className="space-y-3">
                {/* COD */}
                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500/30'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <div>
                      <div className="font-heading font-bold text-sm text-white">Cash on Delivery (COD)</div>
                      <p className="text-xs text-slate-400">Pay cash in Hand when parcel is delivered to your address</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 font-bold text-xs">
                    Popular
                  </span>
                </label>

                {/* bKash Simulation */}
                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'bg-pink-500/10 border-pink-500 ring-1 ring-pink-500/30'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      checked={paymentMethod === 'bkash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-pink-500 focus:ring-pink-500 h-4 w-4"
                    />
                    <div>
                      <div className="font-heading font-bold text-sm text-pink-400">bKash Mobile Payment</div>
                      <p className="text-xs text-slate-400">Instant payment simulation via bKash gateway</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-pink-500/10 text-pink-400 font-bold text-xs">
                    bKash
                  </span>
                </label>

                {/* Nagad Simulation */}
                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'nagad'
                      ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/30'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="nagad"
                      checked={paymentMethod === 'nagad'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-amber-500 focus:ring-amber-500 h-4 w-4"
                    />
                    <div>
                      <div className="font-heading font-bold text-sm text-amber-400">Nagad Mobile Payment</div>
                      <p className="text-xs text-slate-400">Simulated Post Office digital banking</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-bold text-xs">
                    Nagad
                  </span>
                </label>
              </div>

              {/* bKash / Nagad Interactive Input Box */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-3 animate-in fade-in">
                  <div className="text-xs text-blue-300 font-semibold">
                    Simulated {paymentMethod.toUpperCase()} Merchant No: <strong>01711-000001</strong>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Your {paymentMethod.toUpperCase()} Mobile Number</label>
                      <input
                        type="text"
                        value={paymentDetails.phoneNumber}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, phoneNumber: e.target.value })}
                        placeholder="01812345678"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Transaction ID (TrxID)</label>
                      <input
                        type="text"
                        value={paymentDetails.transactionId}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
                        placeholder="8AJ9201948B"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white uppercase font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center space-x-2 transition-colors"
                >
                  <span>Review Final Order</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 4: ORDER SUMMARY & FINAL CONFIRMATION */}
          {/* ==================================================== */}
          {currentStep === 4 && (
            <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-heading font-bold text-white flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span>Step 4: Final Order Review</span>
                </h3>
                <p className="text-xs text-slate-400">Please verify your items, delivery address, and payment method.</p>
              </div>

              {/* Delivery & Payment Snapshots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="text-blue-400 font-bold uppercase text-[11px]">Delivery Recipient</div>
                  <div className="text-white font-bold">{shippingAddress.fullName}</div>
                  <div className="text-slate-400">{shippingAddress.phone}</div>
                  <div className="text-slate-400">{shippingAddress.address}, {shippingAddress.district}, {shippingAddress.division}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="text-slate-300 font-bold uppercase text-[11px]">Payment & Courier</div>
                  <div className="text-white font-bold uppercase">{paymentMethod} Payment</div>
                  <div className="text-slate-400 capitalize">Delivery: {deliveryMethod.replace(/_/g, ' ')}</div>
                  <div className="text-emerald-400 font-semibold">100% Genuine Hardware Guaranteed</div>
                </div>
              </div>

              {/* Items List Preview */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Order Items ({cartItems.length})
                </div>
                <div className="divide-y divide-slate-800 rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.product} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-lg bg-slate-800" />
                        <div>
                          <span className="font-bold text-white block max-w-sm truncate">{item.title}</span>
                          <span className="text-slate-500 font-mono">Qty: {item.qty} × {formatPrice(item.price)}</span>
                        </div>
                      </div>
                      <span className="font-extrabold text-white">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm & Place Order CTA */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <button
                  disabled={submitting}
                  onClick={handlePlaceOrder}
                  className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm flex items-center space-x-2 transition-colors transform active:scale-95 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Order...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Order ({formatPrice(grandTotal)})</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Sticky Summary */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0F172A] border border-slate-800 p-6 space-y-4 shadow-sm sticky top-28">
          <h3 className="text-base font-heading font-bold text-white border-b border-slate-800 pb-3">
            Checkout Summary
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Items Total ({cartItems.length} items)</span>
              <span className="text-slate-200 font-semibold">{formatPrice(itemsPrice)}</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Shipping Fee</span>
              <span className="text-slate-200 font-semibold">
                {deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatPrice(deliveryFee)}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between text-base">
              <span className="font-bold text-white">Grand Total</span>
              <span className="font-extrabold text-white text-xl">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center space-x-2 text-blue-400 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Official Warranty Guarantee</span>
            </div>
            <p>Every component is sourced directly from authorized brand distributors with valid serial numbers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
