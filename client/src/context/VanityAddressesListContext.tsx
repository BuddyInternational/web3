import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

// Define the context type explicitly
interface VanityAddressUpdateContextType {
  triggerVanityAddressUpdate: boolean;
  setTriggerVanityAddressUpdate: Dispatch<SetStateAction<boolean>>;
  resetVanityAddressList: () => void;
}

// Initialize the context with a type but without providing an incorrect default value
const VanityAddressUpdateContext = createContext<VanityAddressUpdateContextType | undefined>(undefined);

export const VanityAddressUpdateProvider = ({ children }: { children: React.ReactNode }) => {
  const [triggerVanityAddressUpdate, setTriggerVanityAddressUpdate] = useState(false);

  const resetVanityAddressList = () => {
    setTriggerVanityAddressUpdate(true);
  };

  return (
    <VanityAddressUpdateContext.Provider
      value={{ triggerVanityAddressUpdate, setTriggerVanityAddressUpdate, resetVanityAddressList }}
    >
      {children}
    </VanityAddressUpdateContext.Provider>
  );
};

// Hook to use the context
export const useVanityAddressUpdate = () => {
  const context = useContext(VanityAddressUpdateContext);
  if (!context) {
    throw new Error("useVanityAddressUpdate must be used within a VanityAddressUpdateProvider");
  }
  return context;
};
