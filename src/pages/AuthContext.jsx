import { createContext, useState, useEffect } from "react";
import axios from 'axios';

const API_BASE_URL = "http://localhost:5001"; // Ensure the port matches the backend server

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          // Fetch fresh user data including profile picture
          await fetchUserData(token);
        } catch (error) {
          console.error("Error parsing user data:", error);
          logout();
        }
      }
    };

    initializeAuth();
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: token }
      });

      // Fix: The backend returns user fields directly, not under .user
      if (response.data) {
        const updatedUser = {
          ...user,
          ...response.data, // merge all fields from backend (including profilePic as string)
        };
        setUser(updatedUser);
        try {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (e) {
          if (
            e instanceof DOMException &&
            (e.name === "QuotaExceededError" || e.code === 22)
          ) {
            console.error("Auth storage quota exceeded while updating user.", e);
            // Optionally: show a toast or handle for UI
          } else {
            throw e;
          }
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expired, logout user
        logout();
      } else {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isAuthenticated) {
      fetchUserData(token);
    }
  }, [isAuthenticated]);

  const login = async ({ token, user }) => {
    if (token && user) {
      // Ensure token is stored as 'Bearer <token>'
      const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      try {
        localStorage.setItem("token", bearerToken);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        if (
          e instanceof DOMException &&
          (e.name === "QuotaExceededError" || e.code === 22)
        ) {
          // Optionally: show a toast or alert here
          // alert("Storage quota exceeded. Please clear some space.");
          console.error("Auth storage quota exceeded.", e);
          // Optionally, throw or handle for UI
          throw e;
        } else {
          throw e;
        }
      }
      setIsAuthenticated(true);
      setUser(user);
      await fetchUserData(bearerToken);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUserProfile = async (updatedUser) => {
    try {
      const token = localStorage.getItem("token");
      setUser(currentUser => ({
        ...currentUser,
        ...updatedUser
      }));

      localStorage.setItem('user', JSON.stringify({
        ...user,
        ...updatedUser
      }));

      // Refresh user data from server (will update profilePic as string)
      await fetchUserData(token);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
