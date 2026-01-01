import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { WaterProvider } from "./context/WaterContext"; // ✅ import this
import "./styles/index.css";
import "./styles/App.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WaterProvider>   {/* ✅ Wrap the entire app */}
        <App />
      </WaterProvider>
    </BrowserRouter>
  </React.StrictMode>
);

