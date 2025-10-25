import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/me`,
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        setIsLoggedIn(true);
        setUserData(response.data);
      }
    } catch (err) {
      setIsLoggedIn(false);
      setUserData(null);
      setError(err);
    }
  };

  const value = {
    isLoggedIn,
    userData,
    setIsLoggedIn,
    setUserData,
    fetchUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
};

export default UserContext;
