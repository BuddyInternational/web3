import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface AuthContextType {
  authMethod: string; 
  loginDetails: { mobile?: string; email?: string }; 
  isLoggedIn: boolean;
  setAuthMethod: (method: string) => void;
  setLoginDetails: (details: { mobile?: string; email?: string }) => void;
  setIsLoggedIn: (status: boolean) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authMethod, setAuthMethod] = useState<string>(""); 
  const [loginDetails, setLoginDetails] = useState<{ mobile?: string; email?: string }>({}); 
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 

  return (
    <AuthContext.Provider
      value={{
        authMethod,
        loginDetails,
        isLoggedIn,
        setAuthMethod,
        setLoginDetails,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
