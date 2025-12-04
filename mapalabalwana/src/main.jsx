import React from "react";
import ReactDOM from "react-dom/client";
// Import HashRouter, bukan BrowserRouter
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Menggunakan HashRouter untuk kompatibilitas yang lebih baik dengan GitHub Pages sub-path */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
