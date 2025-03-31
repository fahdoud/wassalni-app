
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ensureCryptoPolyfill } from "./utils/cryptoPolyfill";

// Ensure crypto.randomUUID is available
ensureCryptoPolyfill();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
