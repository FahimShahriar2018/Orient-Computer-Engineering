import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [cartItems]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const addToCart = (product, qty = 1, shouldOpenDrawer = true) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product === (product._id || product.product)
      );

      const maxStock = product.stock !== undefined ? product.stock : 99;
      const unitPrice = product.discountPrice && product.discountPrice < product.price
        ? product.discountPrice
        : product.price;

      if (existingItem) {
        const newQty = Math.min(existingItem.qty + qty, maxStock);
        return prevItems.map((item) =>
          item.product === existingItem.product
            ? { ...item, qty: newQty }
            : item
        );
      } else {
        const newItem = {
          product: product._id || product.product,
          title: product.title,
          slug: product.slug,
          brand: product.brand,
          image: Array.isArray(product.images) ? product.images[0] : (product.image || ''),
          price: unitPrice,
          regularPrice: product.price,
          discountPrice: product.discountPrice || 0,
          stock: maxStock,
          sku: product.sku || '',
          qty: Math.min(qty, maxStock),
        };
        return [...prevItems, newItem];
      }
    });

    if (shouldOpenDrawer) {
      setIsDrawerOpen(true);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product !== productId)
    );
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product === productId) {
          const clampedQty = Math.min(newQty, item.stock || 99);
          return { ...item, qty: clampedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Computations
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 50000 || itemsPrice === 0 ? 0 : 100;
  const totalPrice = itemsPrice + shippingPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        itemsPrice,
        shippingPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
