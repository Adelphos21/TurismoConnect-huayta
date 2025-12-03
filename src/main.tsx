import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/utilities.css";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const rootElement = document.getElementById("root");

// Ideal: ponga su Client ID sandbox en .env
// VITE_PAYPAL_CLIENT_ID=ASDF1234...
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <PayPalScriptProvider
        options={{
          clientId: PAYPAL_CLIENT_ID,
          currency: "USD",   // o "PEN" si quiere soles
          intent: "capture",
        }}
      >
        <App />
      </PayPalScriptProvider>
    </React.StrictMode>
  );
} else {
  console.error('El elemento con id "root" no se encontró en el DOM');
}
