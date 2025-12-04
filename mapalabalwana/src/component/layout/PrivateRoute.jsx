import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // Ambil token dari localStorage
  const token = localStorage.getItem("token");

  // Jika token ada, render halaman anak (Outlet)
  // Jika tidak, lempar ke halaman login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
