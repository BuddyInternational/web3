import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface LoaderContextType {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

// Create the context
const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

// Create a provider component
export const LoaderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

// Create a custom hook to use the context
export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};
