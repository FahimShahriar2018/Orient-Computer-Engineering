import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Truck,
  DollarSign,
  TrendingUp,
  X,
  Eye,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Tag,
  Cpu,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatDate } from '../../utils/formatters';
import api from '../../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'users'
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Overview Data
  const [analytics, setAnalytics] = useState(null);

  // Products Data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Product Form State
  const [productForm, setProductForm] = useState({
    title: '',
    brand: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: '',
    sku: '',
    warranty: '3 Years Official Brand Warranty',
    badge: '',
    images: '',
    shortSpecs: '',
    techSpecsList: [{ key: 'Socket', value: '' }, { key: 'Form Factor', value: '' }],
  });

  // Orders Data
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', note: '' });

  // Users Data
  const [usersList, setUsersList] = useState([]);

  // Admin Role Protection Guard
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/account');
    }
  }, [user, navigate]);

  // Load Overview Data
  const fetchOverview = async () => {
    try {
      const res = await api.get('/orders/analytics/overview');
      if (res.data.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Error loading analytics', err);
    }
  };

  // Load Products
  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=100');
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Error loading products', err);
    }
  };

  // Load Categories
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Error loading categories', err);
    }
  };

  // Load Orders
  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error loading orders', err);
    }
  };

  // Load Users
  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      if (res.data.success) {
        setUsersList(res.data.users);
      }
    } catch (err) {
      console.error('Error loading users', err);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchProducts();
    fetchCategories();
    fetchOrders();
    fetchUsers();
  }, []);

  const showToast = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  // ==========================================
  // PRODUCT CRUD HANDLERS
  // ==========================================
  const handleOpenAddProduct = () => {
    setSelectedProduct(null);
    setProductForm({
      title: '',
      brand: '',
      category: categories[0]?._id || '',
      price: '',
      discountPrice: '',
      stock: '10',
      sku: `HW-${Math.floor(1000 + Math.random() * 9000)}`,
      warranty: '3 Years Official Brand Warranty',
      badge: 'NEW',
      images: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80',
      shortSpecs: 'High Performance PC Component\nOfficial Brand Warranty\nInstant BD Delivery',
      techSpecsList: [
        { key: 'Architecture', value: 'Latest Gen' },
        { key: 'Warranty', value: '3 Years' },
      ],
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod) => {
    setSelectedProduct(prod);
    const techList = prod.technicalSpecs
      ? Object.entries(prod.technicalSpecs).map(([key, value]) => ({ key, value }))
      : [{ key: 'Warranty', value: '3 Years' }];

    setProductForm({
      title: prod.title || '',
      brand: prod.brand || '',
      category: prod.category?._id || prod.category || '',
      price: prod.price || '',
      discountPrice: prod.discountPrice || '',
      stock: prod.stock || 0,
      sku: prod.sku || '',
      warranty: prod.warranty || '3 Years Official Brand Warranty',
      badge: prod.badge || '',
      images: Array.isArray(prod.images) ? prod.images.join('\n') : (prod.image || ''),
      shortSpecs: Array.isArray(prod.shortSpecs) ? prod.shortSpecs.join('\n') : '',
      techSpecsList: techList,
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const technicalSpecsMap = {};
      productForm.techSpecsList.forEach((item) => {
        if (item.key && item.value) {
          technicalSpecsMap[item.key.trim()] = item.value.trim();
        }
      });

      const imagesArray = productForm.images
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const shortSpecsArray = productForm.shortSpecs
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: productForm.title,
        brand: productForm.brand,
        category: productForm.category,
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : undefined,
        stock: Number(productForm.stock),
        sku: productForm.sku,
        warranty: productForm.warranty,
        badge: productForm.badge,
        images: imagesArray.length > 0 ? imagesArray : undefined,
        shortSpecs: shortSpecsArray,
        technicalSpecs: technicalSpecsMap,
      };

      if (selectedProduct) {
        await api.put(`/products/${selectedProduct._id}`, payload);
        showToast('success', 'Product updated successfully!');
      } else {
        await api.post('/products', payload);
        showToast('success', 'New product added to inventory!');
      }

      setShowProductModal(false);
      fetchProducts();
      fetchOverview();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      await api.delete(`/products/${selectedProduct._id}`);
      showToast('success', 'Product deleted from inventory');
      setShowDeleteModal(false);
      fetchProducts();
      fetchOverview();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Error deleting product');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ORDER FULFILLMENT HANDLERS
  // ==========================================
  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    setLoading(true);
    try {
      await api.put(`/orders/${orderId}/status`, {
        status: nextStatus,
        note: `Order advanced to ${nextStatus} by Admin`,
      });
      showToast('success', `Order status updated to ${nextStatus}`);
      fetchOrders();
      fetchOverview();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: nextStatus }));
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Error updating order status');
    } finally {
      setLoading(false);
    }
  };

  // Filter products list
  const filteredProducts = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku?.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filter orders list
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'ALL') return true;
    return o.orderStatus?.toLowerCase() === orderStatusFilter.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 ${
            notification.type === 'success'
              ? 'bg-emerald-500/90 text-white border border-emerald-400'
              : 'bg-rose-500/90 text-white border border-rose-400'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[10px] font-extrabold uppercase tracking-wider">
              Executive Portal
            </span>
            <h1 className="text-2xl font-heading font-extrabold text-white">
              Orient Management Console
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time sales analytics, hardware inventory CRUD, and order fulfillment pipeline.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'overview' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'products' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="h-3.5 w-3.5" />
            <span>Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'orders' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="h-3.5 w-3.5" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'users' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Customers ({usersList.length})</span>
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: EXECUTIVE ANALYTICS OVERVIEW */}
      {/* ==================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Revenue */}
            <div className="p-6 rounded-3xl bg-[#0F172A] border border-slate-800 space-y-2 shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-emerald-400">Total Revenue</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {formatPrice(analytics?.stats?.totalRevenue || 485000)}
              </div>
              <p className="text-[11px] text-slate-500">Across nationwide hardware sales</p>
            </div>

            {/* Total Orders */}
            <div className="p-6 rounded-3xl bg-[#0F172A] border border-slate-800 space-y-2 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-cyan-400">Total Orders</span>
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <ShoppingCart className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {analytics?.stats?.totalOrders || orders.length || 18}
              </div>
              <p className="text-[11px] text-slate-500">
                {analytics?.stats?.pendingOrders || 3} pending fulfillment
              </p>
            </div>

            {/* Hardware in Catalog */}
            <div className="p-6 rounded-3xl bg-[#0F172A] border border-slate-800 space-y-2 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-orange-400">Catalog SKUs</span>
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                  <Package className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {products.length || 14}
              </div>
              <p className="text-[11px] text-slate-500">Across 6 tech departments</p>
            </div>

            {/* Registered Customers */}
            <div className="p-6 rounded-3xl bg-[#0F172A] border border-slate-800 space-y-2 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-purple-400">Customers</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {usersList.length || 8}
              </div>
              <p className="text-[11px] text-slate-500">Verified buyer accounts</p>
            </div>
          </div>

          {/* Recent Orders Quick Feed */}
          <div className="rounded-3xl bg-[#0F172A] border border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-bold text-base text-white flex items-center space-x-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span>Recent Storefront Orders</span>
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Tracking</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-cyan-400">{ord.trackingNumber}</td>
                      <td className="py-3 px-3 font-medium text-white">{ord.shippingAddress?.fullName}</td>
                      <td className="py-3 px-3 text-slate-400">{formatDate(ord.createdAt)}</td>
                      <td className="py-3 px-3 font-extrabold text-orange-400">{formatPrice(ord.totalPrice)}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setActiveTab('orders');
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-[11px]"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: PRODUCT INVENTORY MANAGEMENT (CRUD) */}
      {/* ==================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Inventory Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search by title, brand, SKU..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-orange-500/25 flex items-center space-x-2 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Hardware SKU</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="rounded-3xl bg-[#0F172A] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900/60">
                    <th className="py-3.5 px-4">Item</th>
                    <th className="py-3.5 px-4">Brand</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4">Price (৳)</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredProducts.map((prod) => (
                    <tr key={prod._id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4 flex items-center space-x-3 max-w-xs">
                        <img
                          src={prod.images?.[0] || prod.image || 'https://via.placeholder.com/40'}
                          alt={prod.title}
                          className="w-10 h-10 object-cover rounded-lg bg-slate-900 flex-shrink-0"
                        />
                        <span className="font-bold text-white truncate block">{prod.title}</span>
                      </td>
                      <td className="py-3.5 px-4 text-cyan-400 font-semibold">{prod.brand}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{prod.sku}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-orange-400">{formatPrice(prod.discountPrice || prod.price)}</div>
                        {prod.discountPrice && (
                          <div className="text-[10px] text-slate-500 line-through">{formatPrice(prod.price)}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.stock > 5
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : prod.stock > 0
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(prod);
                            setShowDeleteModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: ORDER FULFILLMENT MANAGER */}
      {/* ==================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  orderStatusFilter.toLowerCase() === st.toLowerCase()
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Orders Master Table */}
          <div className="rounded-3xl bg-[#0F172A] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900/60">
                    <th className="py-3.5 px-4">Tracking Code</th>
                    <th className="py-3.5 px-4">Recipient</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-4 text-right">Advance Pipeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{ord.trackingNumber}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{ord.shippingAddress?.fullName}</div>
                        <div className="text-[10px] text-slate-400">{ord.shippingAddress?.district}</div>
                      </td>
                      <td className="py-3.5 px-4 uppercase font-semibold text-slate-300">
                        {ord.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-orange-400">{formatPrice(ord.totalPrice)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : ord.orderStatus === 'Shipped'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                              : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {ord.orderStatus === 'Pending' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord._id, 'Confirmed')}
                            className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px]"
                          >
                            Confirm Order
                          </button>
                        )}
                        {ord.orderStatus === 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord._id, 'Processing')}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                          >
                            Mark Processing
                          </button>
                        )}
                        {ord.orderStatus === 'Processing' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord._id, 'Shipped')}
                            className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px]"
                          >
                            Dispatch Courier
                          </button>
                        )}
                        {ord.orderStatus === 'Shipped' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord._id, 'Delivered')}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: CUSTOMER ACCOUNTS DIRECTORY */}
      {/* ==================================================== */}
      {activeTab === 'users' && (
        <div className="rounded-3xl bg-[#0F172A] border border-slate-800 overflow-hidden shadow-2xl animate-in fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900/60">
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Division</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{u.name}</td>
                    <td className="py-3.5 px-4 text-slate-300">{u.email}</td>
                    <td className="py-3.5 px-4 text-slate-400">{u.phone || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-cyan-400">{u.address?.division || 'Dhaka'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ==================================================== */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-heading font-bold text-white flex items-center space-x-2">
                <Package className="h-5 w-5 text-cyan-400" />
                <span>{selectedProduct ? 'Edit Hardware Product' : 'Add New Hardware to Catalog'}</span>
              </h3>
              <button onClick={() => setShowProductModal(false)} className="p-1 rounded-lg bg-slate-800 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="e.g. NVIDIA GeForce RTX 4080 Super 16GB"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="ASUS, MSI, Intel"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category *</label>
                  <select
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Regular Price (৳) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="85000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Discount Price (৳)</label>
                  <input
                    type="number"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                    placeholder="79900"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Inventory Stock *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="15"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Image URLs (one per line)</label>
                <textarea
                  rows={2}
                  value={productForm.images}
                  onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Quick Bullet Specs (one per line)</label>
                <textarea
                  rows={2}
                  value={productForm.shortSpecs}
                  onChange={(e) => setProductForm({ ...productForm, shortSpecs: e.target.value })}
                  placeholder="16GB GDDR6X VRAM&#10;Boost Clock 2640 MHz"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              {/* Dynamic Technical Specs Builder */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Technical Specification Table (Key-Value)</span>
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm({
                        ...productForm,
                        techSpecsList: [...productForm.techSpecsList, { key: '', value: '' }],
                      })
                    }
                    className="text-xs text-cyan-400 hover:underline font-bold"
                  >
                    + Add Spec Row
                  </button>
                </div>
                {productForm.techSpecsList.map((row, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="e.g. Socket"
                      value={row.key}
                      onChange={(e) => {
                        const updated = [...productForm.techSpecsList];
                        updated[idx].key = e.target.value;
                        setProductForm({ ...productForm, techSpecsList: updated });
                      }}
                      className="w-1/3 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="e.g. LGA1700 / AM5"
                      value={row.value}
                      onChange={(e) => {
                        const updated = [...productForm.techSpecsList];
                        updated[idx].value = e.target.value;
                        setProductForm({ ...productForm, techSpecsList: updated });
                      }}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: DELETE PRODUCT CONFIRMATION */}
      {/* ==================================================== */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl text-center">
            <div className="h-12 w-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Product?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete <strong>{selectedProduct.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                {loading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
