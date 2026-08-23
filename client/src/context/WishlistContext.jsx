import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlistItems');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading wishlist from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Error saving wishlist to localStorage', e);
    }
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => (item._id || item.product) === productId
    );
  };

  const addToWishlist = (product) => {
    if (!isInWishlist(product._id)) {
      setWishlistItems((prev) => [
        ...prev,
        {
          _id: product._id,
          product: product._id,
          title: product.title,
          slug: product.slug,
          brand: product.brand,
          price: product.discountPrice || product.price,
          regularPrice: product.price,
          discountPrice: product.discountPrice || 0,
          image: Array.isArray(product.images) ? product.images[0] : (product.image || ''),
          stock: product.stock,
          rating: product.rating,
        },
      ]);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) =>
      prev.filter((item) => (item._id || item.product) !== productId)
    );
  };

  const toggleWishlist = (product) => {
    const pId = product._id || product.product;
    if (isInWishlist(pId)) {
      removeFromWishlist(pId);
      return false; // Removed
    } else {
      addToWishlist(product);
      return true; // Added
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
