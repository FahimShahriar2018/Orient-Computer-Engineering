import React from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export { useAuth } from './AuthContext';
export { useCart } from './CartContext';
export { useWishlist } from './WishlistContext';
