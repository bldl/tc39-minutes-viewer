import React, { createContext, useState, useContext } from "react";

const SelectedTextContext = createContext();

export const SelectedTextProvider = ({ children }) => {
  const [selectedText, setSelectedText] = useState("");

  return (
    <SelectedTextContext.Provider value={{ selectedText, setSelectedText }}>
      {children}
    </SelectedTextContext.Provider>
  );
};

export const useSelectedText = () => useContext(SelectedTextContext);
