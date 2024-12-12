import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: null,
    name: "",
    id: null,
    isVendor: false,
    fieldsOfExpertise: "",
    isAdmin: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      fetch("http://localhost:5000/api/auth/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Invalid token");
          }
        })
        .then((data) => {
          handleLogin(
            token, data.name, data.id, data.isVendor, data.fieldsOfExpertise, data.isAdmin);
        })
        .catch(() => {
          localStorage.removeItem("jwtToken");
          setAuthData({
            token: null,
            name: "",
            id: null,
            isVendor: false,
            fieldsOfExpertise: "",
            isAdmin: false,
          });
        });
    }
  }, []);

  const handleLogin = (token, name, id, isVendor,fieldsOfExpertise,isAdmin) => {
    localStorage.setItem("jwtToken", token);
    setAuthData({
      token,
      name,
      id,
      isVendor,
      fieldsOfExpertise,
      isAdmin,
    });
    let userRole = "user";
    if (isAdmin) {
      userRole = "admin";
    }else if (isVendor) {
      userRole = "vendor";
    }
    localStorage.setItem("userRole", userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    setAuthData({
      token: null,
      name: "",
      id: null,
      isVendor: false,
    });
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        ...authData, 
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
