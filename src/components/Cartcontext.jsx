import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../pages/AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { user, isAuthenticated } = useContext(AuthContext);

  // Load cart items from localStorage when component mounts or user changes
  useEffect(() => {
    const loadCartItems = () => {
      try {
        let storedCart = [];
        if (isAuthenticated && user) {
          // If user is logged in, get their specific cart
          storedCart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
        } else {
          // For guest users
          storedCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        }
        setCartItems(storedCart);
        setCartCount(calculateCartCount(storedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        setCartItems([]);
        setCartCount(0);
      }
    };

    loadCartItems();
  }, [isAuthenticated, user]);

  // Calculate total items in cart
  const calculateCartCount = (items) => {
    return items.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem._id === item._id
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        // If item exists, increase quantity
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 1) + 1,
        };
      } else {
        // If item doesn't exist, add with quantity 1
        updatedItems = [...prevItems, { ...item, quantity: 1 }];
      }

      // Save to localStorage
      saveCartToLocalStorage(updatedItems);
      
      // Update cart count
      setCartCount(calculateCartCount(updatedItems));
      
      return updatedItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (index) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((_, i) => i !== index);
      
      // Save to localStorage
      saveCartToLocalStorage(updatedItems);
      
      // Update cart count
      setCartCount(calculateCartCount(updatedItems));
      
      return updatedItems;
    });
  };

  // Update cart item quantity
  const updateCartItemQuantity = (index, newQuantity) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: newQuantity,
      };
      
      // Save to localStorage
      saveCartToLocalStorage(updatedItems);
      
      // Update cart count
      setCartCount(calculateCartCount(updatedItems));
      
      return updatedItems;
    });
  };

  // Save cart to localStorage
  const saveCartToLocalStorage = (items) => {
    try {
      if (isAuthenticated && user) {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
      } else {
        localStorage.setItem("guestCart", JSON.stringify(items));
      }
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
    
    // Clear from localStorage
    try {
      if (isAuthenticated && user) {
        localStorage.removeItem(`cart_${user.id}`);
      } else {
        localStorage.removeItem("guestCart");
      }
    } catch (error) {
      console.error("Error clearing cart from localStorage:", error);
    }
  };

  // Update cart count manually if needed
  const updateCartCount = () => {
    setCartCount(calculateCartCount(cartItems));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        updateCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};