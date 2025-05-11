import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimatedComponent from "./components/Animation";
import { AuthProvider } from "./pages/AuthContext";
import { CartProvider } from "./components/Cartcontext"; // Import CartProvider
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Process from "./pages/Process";
import Contact from "./pages/Contact";
import Infrastructure from "./pages/Infrastructure";
import CatalogDetail from "./pages/CatalogDetail";
import Signin from "./components/Signin";
import Account from "./components/Account";
import Cart from "./components/Cart";
import Profile from "./components/Profile";

// Catalog Pages
import Kitchen from "./catlog/Kitchen";
import Living from "./catlog/Living";
import Baby from "./catlog/Baby";
import Linen from "./catlog/Linen";
import Shopping from "./catlog/Shopping";
import Table from "./catlog/Table";
import ProductDetails from "./catlog/ProductDetails"; // Import the new component

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false
    });
  }, []);

  return (
    <Router>
      <AuthProvider>
        <CartProvider> {/* Wrap the app with CartProvider */}
          <ScrollToTop>
            <Navbar /> {/* Navbar will access cart count from CartContext */}
            <Routes>
              <Route path="/" element={<AnimatedComponent><Home /></AnimatedComponent>} />
              <Route path="/home" element={<AnimatedComponent><Home /></AnimatedComponent>} />
              <Route path="/about" element={<AnimatedComponent><About /></AnimatedComponent>} />
              <Route path="/process" element={<AnimatedComponent><Process /></AnimatedComponent>} />
              <Route path="/contact" element={<AnimatedComponent><Contact /></AnimatedComponent>} />
              <Route path="/infrastructure" element={<AnimatedComponent><Infrastructure /></AnimatedComponent>} />
              <Route path="/catlog/:category" element={<AnimatedComponent><CatalogDetail /></AnimatedComponent>} />
              <Route path="/catlog/kitchen" element={<AnimatedComponent><Kitchen /></AnimatedComponent>} />
              <Route path="/catlog/living" element={<AnimatedComponent><Living /></AnimatedComponent>} />
              <Route path="/catlog/baby" element={<AnimatedComponent><Baby /></AnimatedComponent>} />
              <Route path="/catlog/linen" element={<AnimatedComponent><Linen /></AnimatedComponent>} />
              <Route path="/catlog/shopping" element={<AnimatedComponent><Shopping /></AnimatedComponent>} />
              <Route path="/catlog/table" element={<AnimatedComponent><Table /></AnimatedComponent>} />
              <Route path="/signin" element={<AnimatedComponent><Signin /></AnimatedComponent>} />
              <Route path="/account" element={<AnimatedComponent><Account /></AnimatedComponent>} />
              <Route path="/cart" element={<AnimatedComponent><Cart /></AnimatedComponent>} />
              <Route path="/profile" element={<AnimatedComponent><Profile /></AnimatedComponent>} />
              <Route path="/product/:productId" element={<ProductDetails />} /> {/* Add this route */}
            </Routes>
            <Footer />
          </ScrollToTop>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;