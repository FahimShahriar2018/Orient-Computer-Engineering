import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from './context';
import Header from './components/Header/Header';
import CartDrawer from './components/Cart/CartDrawer';
import AuthModal from './components/Auth/AuthModal';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
          <Header />
          <div className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:idOrSlug" element={<ProductDetailPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              {/* Fallback to ShopPage */}
              <Route path="*" element={<ShopPage />} />
            </Routes>
          </div>
          <CartDrawer />
          <AuthModal />
          <Footer />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
}
