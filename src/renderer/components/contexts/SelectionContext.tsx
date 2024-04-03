import React, { createContext, useContext, useState, ReactNode } from "react";

interface SelectionContextType {
  selectedYear: string | null;
  setSelectedYear: (year: string | null) => void;
  selectedMonth: string | null;
  setSelectedMonth: (month: string | null) => void;
  selectedFilePath: string | null;
  setSelectedFilePath: (filePath: string | null) => void;
}

const defaultContextValue: SelectionContextType = {
  selectedYear: null,
  setSelectedYear: () => {},
  selectedMonth: null,
  setSelectedMonth: () => {},
  selectedFilePath: null,
  setSelectedFilePath: () => {},
};

const SelectionContext =
  createContext<SelectionContextType>(defaultContextValue);

export const useSelection = () => useContext(SelectionContext);

interface SelectionProviderProps {
  children: ReactNode;
}

export const SelectionProvider: React.FC<SelectionProviderProps> = ({
  children,
}) => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const value = {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedFilePath,
    setSelectedFilePath,
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};
