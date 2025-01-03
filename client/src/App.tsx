import React, { useEffect } from "react";
import "./App.css";
import ConnectWallet from "./layout/navbar/ConnectWallet";
import Footer from "./layout/footer/Footer";
import AllRoutes from "./routes/AllRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router } from "react-router-dom";

const App: React.FC = () => {
  useEffect(() => {
    // Disable right-click across the application
    const handleRightClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleRightClick);

    // Cleanup the event listener on component unmount
    return () => document.removeEventListener("contextmenu", handleRightClick);
  }, []);

  return (
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
  );
};

export default App;
