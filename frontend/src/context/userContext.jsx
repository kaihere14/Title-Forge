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
      const response = await api.get("/api/user/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.data) {
        setIsLoggedIn(true);
        setUserData(response.data);
      }
    } catch (err) {
      if (err.response.status === 403) {
        try {
          const response2 = await axios.post(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/refresh-token`, { refreshToken: localStorage.getItem("refreshToken") });
          localStorage.setItem("accessToken", response2.data.accessToken);
          localStorage.setItem("refreshToken", response2.data.refreshToken);
          const response3 = await api.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/me`, {
            headers: {
              Authorization: `Bearer ${response2.data.accessToken}`
            }
          });
          if (response3.data) {
            setIsLoggedIn(true);
            setUserData(response3.data);
          }
        } catch (error) {
          setIsLoggedIn(false);
          setUserData(null);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setError("Session expired. Please log in again.");
        }
      }
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
