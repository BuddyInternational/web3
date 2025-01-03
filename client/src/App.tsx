import React, { useEffect } from "react";
import "./App.css";
import ConnectWallet from "./layout/navbar/ConnectWallet";
import Footer from "./layout/footer/Footer";
import AllRoutes from "./routes/AllRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Helmet } from "react-helmet";

const App: React.FC = () => {
  useEffect(() => {
    // Disable right-click across the application
    const handleRightClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleRightClick);

    // Cleanup the event listener on component unmount
    return () => document.removeEventListener("contextmenu", handleRightClick);
  }, []);

  return (
    <>
      <div>
        <Helmet>
          <title>Gully Buddy International</title>
          <meta name="robots" content="index, follow" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
          />
          <link
            rel="apple-touch-icon"
            sizes="192x192"
            href="%PUBLIC_URL%/CDE.svg"
          />
          <link
            rel="apple-touch-icon"
            sizes="512x512"
            href="%PUBLIC_URL%/CDE.svg"
          />
          <meta
            name="description"
            content="Join our Web3-powered DApp membership platform for collaborative growth and exclusive perks. Earn residuals, explore retail, and unlock exclusive tools."
          />
        </Helmet>
      </div>

      <Router>
        <div className="flex flex-col min-h-screen bg-gray-800 overflow-x-hidden">
          <div className="flex-grow">
            <ConnectWallet />
            <AllRoutes />
          </div>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </>
  );
};

export default App;
