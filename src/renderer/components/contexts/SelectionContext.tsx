import React, { createContext, useState, useContext } from "react";

interface SelectionContextType {
  selectedYear: string | null;
  setSelectedYear: (year: string | null) => void;
  selectedMonth: string | null;
  setSelectedMonth: (month: string | null) => void;
  selectedFilePath: string | null;
  setSelectedFilePath: (filePath: string | null) => void;
}

const SelectionContext = createContext<SelectionContextType>({
  selectedYear: null,
  setSelectedYear: () => {},
  selectedMonth: null,
  setSelectedMonth: () => {},
  selectedFilePath: null,
  setSelectedFilePath: () => {},
});

export const useSelection = () => useContext(SelectionContext);

export const SelectionProvider: React.FC = ({ children }) => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  return (
    <SelectionContext.Provider
      value={{
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        selectedFilePath,
        setSelectedFilePath,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};
