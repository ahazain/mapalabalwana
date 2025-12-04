import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Tentukan basename sebagai nama repositori Anda
const basename = "/mapalabalwana";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* PENTING: Tambahkan basename untuk mendukung routing di GitHub Pages */}
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
