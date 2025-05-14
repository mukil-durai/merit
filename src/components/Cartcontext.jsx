import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../pages/AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { isAuthenticated, user } = useContext(AuthContext);

  // Load cart items from localStorage on initial render or when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const userCart = localStorage.getItem(`cart_${user.id}`);
      setCartItems(userCart ? JSON.parse(userCart) : []);
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, user]);

  const updateCartCount = () => {
    if (isAuthenticated && user) {
      const userCart = localStorage.getItem(`cart_${user.id}`);
      setCartItems(userCart ? JSON.parse(userCart) : []);
    }
  };

  const addToCart = (product, navigate) => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    const newCartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };

    const userId = user.id;
    let userCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    
    const existingItemIndex = userCart.findIndex(item => item._id === newCartItem._id);

    if (existingItemIndex !== -1) {
      userCart[existingItemIndex].quantity += 1;
    } else {
      userCart.push(newCartItem);
    }

    try {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(userCart));
      setCartItems(userCart);
    } catch (e) {
      if (
        e instanceof DOMException &&
        (e.name === "QuotaExceededError" || e.code === 22)
      ) {
        // Optionally: show a toast or alert here
        // For now, just log and do not update state
        // Optionally, you could clear cart or notify user
        // alert("Your cart is full. Please remove some items or clear storage.");
        console.error("Cart storage quota exceeded.", e);
        // Optionally, throw or handle for UI
        throw e;
      } else {
        throw e;
      }
    }
  };

  const clearCart = () => {
    if (isAuthenticated && user) {
      localStorage.removeItem(`cart_${user.id}`);
      setCartItems([]);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      setCartItems, 
      addToCart, 
      updateCartCount,
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};