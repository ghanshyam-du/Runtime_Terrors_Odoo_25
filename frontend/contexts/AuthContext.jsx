"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        const { token, user } = response.data;

        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        console.log(user);

        // Set default axios header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setUser(user);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        userData
      );
      if (response.status === 201) {
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Registration failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const updateProfile = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/update_profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // 👇 Axios will set Content-Type automatically when FormData is passed
          },
        }
      );

      const data = response.data;

      // Update local storage and state with the new user data
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
