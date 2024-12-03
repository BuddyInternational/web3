import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { VanityProvider } from "./context/VanityContext";
import { BalanceUpdateProvider } from "./context/BalanceUpdateContext";
import { VanityAddressUpdateProvider } from "./context/VanityAddressesListContext";
import { LoaderProvider } from "./context/LoaderContext";
import { AuthProvider } from "./context/AuthContext";

// Disable right-click globally
document.addEventListener("contextmenu", (e) => e.preventDefault());

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <VanityProvider>
    <AuthProvider>
    <BalanceUpdateProvider>
      <VanityAddressUpdateProvider>
        <LoaderProvider>
          <App />
        </LoaderProvider>
      </VanityAddressUpdateProvider>
    </BalanceUpdateProvider>
    </AuthProvider>
  </VanityProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
