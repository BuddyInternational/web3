import React from "react";
import "./App.css";
import ConnectWallet from "./layout/navbar/ConnectWallet";
import Footer from "./layout/footer/Footer";
import AllRoutes from "./routes/AllRoutes";
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800 overflow-x-hidden">
      <div className="flex-grow">
        <ConnectWallet />
        <AllRoutes />
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default App;
