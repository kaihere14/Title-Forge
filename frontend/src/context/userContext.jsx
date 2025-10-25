import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext(null);

// Create axios instance with interceptor
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_DOMAIN,
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await api.get("/api/user/me",{
		headers: {
			Authorization: `Bearer ${localStorage.getItem("accessToken")}`
		}
	  });
      if (response.data) {
        setIsLoggedIn(true);
        setUserData(response.data);
      }
    } catch (err) {
      setIsLoggedIn(false);
      setUserData(null);
      setError(err);
      // Clear tokens if request fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    setUserData(null);
  };

  const value = {
    isLoggedIn,
    userData,
    setIsLoggedIn,
    setUserData,
    fetchUserData,
    logout,
    api, // Export api instance for use in other components
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
};

export default UserContext;
