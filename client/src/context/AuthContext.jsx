/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  login as apiLogin, 
  logout as apiLogout, 
  isAuthenticated, 
  verifyOTP as apiVerifyOTP,
  getCurrentUser as apiGetCurrentUser
} from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token) {
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch {
            localStorage.removeItem('user');
          }
        }
        
        // Always try to fetch fresh user data if token exists
        try {
          const freshUser = await apiGetCurrentUser();
          if (freshUser) {
            const normalizedUser = { _id: freshUser._id, name: freshUser.name, email: freshUser.email, isAdmin: freshUser.isAdmin };
            setUser(normalizedUser);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
          }
        } catch (e) {
          console.error("Failed to fetch fresh user data", e);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    const userData = { _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return data;
  };

  const verifyOTP = async (email, otp) => {
    const data = await apiVerifyOTP(email, otp);
    // After verification, we usually get a token but maybe not the full user object
    // So we fetch it
    try {
      const userData = await apiGetCurrentUser();
      if (userData) {
        const normalizedUser = { _id: userData._id, name: userData.name, email: userData.email, isAdmin: userData.isAdmin };
        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      }
    } catch (e) {
      console.error("Failed to fetch user after OTP verification", e);
    }
    return data;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, verifyOTP, updateUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
