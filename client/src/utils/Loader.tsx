import React from "react";
import { useLoader } from "../context/LoaderContext";

const Loader: React.FC = () => {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
      {/* Full-page overlay */}
      <div className="absolute inset-0 bg-gray-700 bg-opacity-50 pointer-events-auto"></div>

      {/* Loader animation */}
      <div className="w-20 h-20 border-8 border-dashed rounded-full animate-spin border-blue-600 pointer-events-none"></div>
    </div>
  );
};

export default Loader;
