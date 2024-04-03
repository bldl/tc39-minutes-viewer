import React, { createContext, useState, useContext, ReactNode } from "react";

interface SelectedTextContextType {
  selectedText: string;
  setSelectedText: React.Dispatch<React.SetStateAction<string>>;
}

const defaultState: SelectedTextContextType = {
  selectedText: "",
  setSelectedText: () => {},
};

const SelectedTextContext =
  createContext<SelectedTextContextType>(defaultState);

interface SelectedTextProviderProps {
  children: ReactNode; // This line defines the type for children
}

export const SelectedTextProvider: React.FC<SelectedTextProviderProps> = ({
  children,
}) => {
  const [selectedText, setSelectedText] = useState("");

  return (
    <SelectedTextContext.Provider value={{ selectedText, setSelectedText }}>
      {children}
    </SelectedTextContext.Provider>
  );
};

export const useSelectedText = () => useContext(SelectedTextContext);
