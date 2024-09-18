import React from 'react';
import './App.css';
import ConnectWallet from './components/ConnectWallet';
import AllRoutes from './routes/AllRoutes';

const App: React.FC = () => {
  return (
    <div className=" m-auto px-5 bg-gray-800 overflow-x-hidden min-h-screen">
      <ConnectWallet />
      <AllRoutes />
    </div>
  );
};

export default App;