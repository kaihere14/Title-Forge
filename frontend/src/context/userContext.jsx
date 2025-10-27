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
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

    // Check if user is logged in on mount
    useEffect(() => {
      const token = localStorage.getItem("accessToken") && localStorage.getItem("refreshToken");
      if (token) {
        fetchUserData();
      } else {
        setIsLoading(false);
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
      isLoading,
    };

    // Show loading screen while verifying authentication
    if (isLoading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="animate-spin h-8 w-8 text-gray-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading...
            </h2>
            <p className="text-sm text-gray-600">
              Verifying your session
            </p>
          </div>
        </div>
      );
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
  };

  export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within a UserProvider");
    return ctx;
  };


  export default UserContext;
