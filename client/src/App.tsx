import React from "react";
import "./App.css";
import ConnectWallet from "./components/navbar/ConnectWallet";
import Footer from "./components/footer/Footer";
import AllRoutes from "./routes/AllRoutes";

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800 overflow-x-hidden">
      <div className="flex-grow">
        <ConnectWallet />
        <AllRoutes />
      </div>
      <Footer />
    </div>
  );
};

export default App;
