import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context interface
interface HeaderUpdateContextProps {
  triggerUpdate: () => void;
  updateCount: number;  // Add updateCount here
}

// Create the context with a default value
const HeaderUpdateContext = createContext<HeaderUpdateContextProps>({
  triggerUpdate: () => {},
  updateCount: 0,  // Provide a default value
});

// Create a provider component
export const HeaderUpdateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [updateCount, setUpdateCount] = useState(0);

  const triggerUpdate = () => {
    setUpdateCount((prevCount) => prevCount + 1);
  };

  return (
    <HeaderUpdateContext.Provider value={{ triggerUpdate, updateCount }}>
      {children}
    </HeaderUpdateContext.Provider>
  );
};

// Create a custom hook to use the context
export const useHeaderUpdate = () => {
  return useContext(HeaderUpdateContext);
};
