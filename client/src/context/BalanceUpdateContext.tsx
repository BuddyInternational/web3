import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

// Define the context type explicitly
interface BalanceUpdateContextType {
  triggerUpdate: boolean;
  setTriggerUpdate: Dispatch<SetStateAction<boolean>>;
  resetBalances: () => void;
}

// Initialize the context with a type but without providing an incorrect default value
const BalanceUpdateContext = createContext<BalanceUpdateContextType | undefined>(undefined);

export const BalanceUpdateProvider = ({ children }: { children: React.ReactNode }) => {
  const [triggerUpdate, setTriggerUpdate] = useState(false);

  const resetBalances = () => {
    setTriggerUpdate(true);
  };
  return (
    <BalanceUpdateContext.Provider value={{ triggerUpdate, setTriggerUpdate,resetBalances }}>
      {children}
    </BalanceUpdateContext.Provider>
  );
};

// Hook to use the context
export const useBalanceUpdate = () => {
  const context = useContext(BalanceUpdateContext);
  if (!context) {
    throw new Error("useBalanceUpdate must be used within a BalanceUpdateProvider");
  }
  return context;
};
