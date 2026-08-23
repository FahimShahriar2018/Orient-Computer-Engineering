import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  Truck,
  Printer,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BANGLADESH_DIVISIONS, getDistrictsByDivision } from '../utils/bangladeshLocations';
import { formatPrice, formatDate } from '../utils/formatters';
import api from '../services/api';

export default function AccountPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout, updateProfile } = useAuth();

  const initialTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState(initialTab); // 'orders' | 'profile' | 'address'

  // My Orders state
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
  });

  // Address Form state
  const [addressData, setAddressData] = useState({
    division: user?.address?.division || 'Dhaka',
    district: user?.address?.district || 'Dhaka',
    street: user?.address?.street || '',
    postalCode: user?.address?.postalCode || '1209',
  });

  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Sync tab with URL
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
    setMessage(null);
  };

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoadingOrders(true);
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setMyOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Error loading my orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        name: profileData.name,
        phone: profileData.phone,
      };
      if (profileData.newPassword) {
        payload.password = profileData.newPassword;
      }
      await updateProfile(payload);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setProfileData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error updating profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({
        address: addressData,
      });
      setMessage({ type: 'success', text: 'Default shipping address saved!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error updating address' });
    } finally {
      setSaving(false);
    }
  };

  const availableDistricts = getDistrictsByDivision(addressData.division);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#111A30] to-[#0A101D] border border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 font-heading font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-cyan-600/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                {user?.name}
              </h1>
              {user?.role === 'admin' && (
                <span className="px-2 py-0.5 rounded bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[10px] font-extrabold uppercase">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email} • Member of Orient Computers</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all"
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 border border-slate-700 text-slate-300 hover:text-rose-400 font-semibold text-xs transition-colors flex items-center space-x-1.5"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Tabs Sidebar (4 cols) & Tab Content (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0F172A] border border-slate-800 p-4 space-y-2 shadow-xl sticky top-28">
          <button
            onClick={() => handleTabChange('orders')}
            className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all ${
              activeTab === 'orders'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Package className="h-4 w-4" />
              <span>My Orders ({myOrders.length})</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleTabChange('profile')}
            className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all ${
              activeTab === 'profile'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <User className="h-4 w-4" />
              <span>Profile Settings</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleTabChange('address')}
            className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all ${
              activeTab === 'address'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <MapPin className="h-4 w-4" />
              <span>Saved Shipping Address</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="lg:col-span-8 space-y-6">
          {/* Notification Message */}
          {message && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center space-x-2 ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 1: MY ORDERS */}
          {/* ==================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-lg font-heading font-bold text-white flex items-center space-x-2">
                  <Package className="h-5 w-5 text-cyan-400" />
                  <span>Order Purchase History</span>
                </h2>
                <span className="text-xs text-slate-400">Total {myOrders.length} orders</span>
              </div>

              {loadingOrders ? (
                <div className="p-8 text-center text-slate-400 text-xs">Loading order history...</div>
              ) : myOrders.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[#0F172A] border border-slate-800 text-center space-y-4 shadow-xl">
                  <Package className="h-12 w-12 text-slate-600 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-white">No Orders Placed Yet</h3>
                    <p className="text-xs text-slate-400">You haven't purchased any genuine computer components yet.</p>
                  </div>
                  <Link
                    to="/shop"
                    className="inline-block px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((order) => (
                    <div
                      key={order._id}
                      className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-xl"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400">Tracking:</span>
                            <span className="font-mono font-bold text-cyan-400">{order.trackingNumber}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Placed on {formatDate(order.createdAt)}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : order.orderStatus === 'Shipped'
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                                : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                          <span className="font-extrabold text-white text-base">
                            {formatPrice(order.totalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Items Thumbnails */}
                      <div className="flex items-center space-x-3 overflow-x-auto py-1">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-xl p-2 flex-shrink-0">
                            <img src={item.image} alt={item.title} className="w-9 h-9 object-cover rounded-lg bg-slate-800" />
                            <div className="text-[11px]">
                              <span className="text-white font-medium truncate max-w-[150px] block">{item.title}</span>
                              <span className="text-slate-400">Qty: {item.qty}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
                        <div className="text-[11px] text-slate-400 capitalize">
                          Delivery: {order.deliveryMethod?.replace(/_/g, ' ')}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/track-order/${order.trackingNumber}`}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs flex items-center space-x-1"
                          >
                            <Truck className="h-3.5 w-3.5" />
                            <span>Track Status</span>
                          </Link>

                          <Link
                            to={`/order-success/${order._id}`}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center space-x-1"
                          >
                            <Printer className="h-3.5 w-3.5 text-orange-400" />
                            <span>View Invoice</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: PROFILE SETTINGS */}
          {/* ==================================================== */}
          {activeTab === 'profile' && (
            <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg font-heading font-bold text-white flex items-center space-x-2">
                  <User className="h-5 w-5 text-cyan-400" />
                  <span>Personal Profile & Security</span>
                </h2>
                <p className="text-xs text-slate-400">Update your account credentials and contact details.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Mobile Phone</label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Email Address (Read-only)</label>
                  <input
                    type="email"
                    disabled
                    value={profileData.email}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <h4 className="font-bold text-slate-200">Change Password</h4>
                  <div>
                    <label className="block text-slate-400 mb-1">New Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                      placeholder="Enter at least 6 characters"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: SAVED ADDRESS */}
          {/* ==================================================== */}
          {activeTab === 'address' && (
            <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg font-heading font-bold text-white flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                  <span>Default Shipping Address</span>
                </h2>
                <p className="text-xs text-slate-400">Pre-fills during checkout for faster hardware ordering.</p>
              </div>

              <form onSubmit={handleAddressSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Division (বিভাগ)</label>
                    <select
                      value={addressData.division}
                      onChange={(e) => {
                        const div = e.target.value;
                        const dists = getDistrictsByDivision(div);
                        setAddressData({ ...addressData, division: div, district: dists[0] || '' });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                    >
                      {BANGLADESH_DIVISIONS.map((d) => (
                        <option key={d.name} value={d.name}>{d.name} Division</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">District (জেলা)</label>
                    <select
                      value={addressData.district}
                      onChange={(e) => setAddressData({ ...addressData, district: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                    >
                      {availableDistricts.map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Street Address / House / Road / Area</label>
                  <textarea
                    rows={2}
                    value={addressData.street}
                    onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                    placeholder="House #42, Road #11, Dhanmondi R/A"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Default Address'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
