import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from './context';
import Header from './components/Header/Header';
import CartDrawer from './components/Cart/CartDrawer';
import AuthModal from './components/Auth/AuthModal';
import Footer from './components/Footer/Footer';
import MobileBottomNav from './components/Navigation/MobileBottomNav';
import ScrollToTop from './components/Common/ScrollToTop';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import TrackOrderPage from './pages/TrackOrderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminDashboard from './pages/Admin/AdminDashboard';

import BrandPage from './pages/BrandPage';
import BranchPage from './pages/BranchPage';
import ComplainPage from './pages/ComplainPage';
import CategoryLandingPage from './pages/CategoryLandingPage';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppProviders>
        <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white pb-14 sm:pb-0">
          <Header />
          <div className="flex-1 w-full">
            <Routes>
              {/* Storefront Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:idOrSlug" element={<ProductDetailPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/brand" element={<BrandPage />} />
              <Route path="/branch" element={<BranchPage />} />
              <Route path="/complain" element={<ComplainPage />} />

              {/* Direct Orient Department Routes */}
              <Route path="/Renewable%20Energy" element={<CategoryLandingPage slug="renewable-energy" />} />
              <Route path="/Renewable Energy" element={<CategoryLandingPage slug="renewable-energy" />} />
              <Route path="/renewable-energy" element={<CategoryLandingPage slug="renewable-energy" />} />
              <Route path="/ups" element={<CategoryLandingPage slug="ups" />} />
              <Route path="/ips" element={<CategoryLandingPage slug="ips" />} />
              <Route path="/battery" element={<CategoryLandingPage slug="battery" />} />
              <Route path="/telecom" element={<CategoryLandingPage slug="telecom" />} />
              <Route path="/audio-visual" element={<CategoryLandingPage slug="audio-visual" />} />
              <Route path="/office-equipment" element={<CategoryLandingPage slug="office-equipment" />} />
              <Route path="/category/:slug" element={<CategoryLandingPage />} />

              {/* Cart & Checkout Funnel */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:id" element={<OrderSuccessPage />} />
              <Route path="/track-order" element={<TrackOrderPage />} />
              <Route path="/track-order/:trackingNumber" element={<TrackOrderPage />} />

              {/* Customer Account & Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/orders" element={<AccountPage />} />
              <Route path="/order/:id" element={<OrderDetailPage />} />

              {/* Admin Portal */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Fallback */}
              <Route path="*" element={<ShopPage />} />
            </Routes>
          </div>
          <MobileBottomNav />
          <CartDrawer />
          <AuthModal />
          <Footer />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
}
