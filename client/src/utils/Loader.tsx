import React from "react";
import { useLoader } from "../context/LoaderContext";
import "./Loader.css"; // Assuming the CSS is saved here

const Loader: React.FC = () => {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div className="loader" />
    </div>
  );
};

export default Loader;
