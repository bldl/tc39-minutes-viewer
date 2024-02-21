import { useState, useEffect } from "react";
import ChatComponent from "./ChatComponent/ChatComponent";
import NavBarComponent from "./NavBar/NavBarComponent";
import { fetchHashTable } from "./NavBar/FetchMeetings";

function App() {
  const [hashTable, setHashTable] = useState({});
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedFilePath, setSelectedFilePath] = useState(null);

  useEffect(() => {
    const loadHashTable = async () => {
      const table = await fetchHashTable();
      setHashTable(table);
    };
    loadHashTable();
  }, []);

  // Handle for year select
  const handleYearSelect = (year) => {
    setSelectedYear(year);
    if (selectedYear !== year) {
      // Only reset these if a different year is selected
      setSelectedMonth(null);
      setSelectedDay(null);
      // Do not reset setSelectedFilePath here to keep the file open
    }
  };

  // Handle for month select
  const handleMonthSelect = (year, month) => {
    setSelectedYear(year);
    if (selectedMonth !== month) {
      // Only reset these if a different month is selected
      setSelectedDay(null);
      // Do not reset setSelectedFilePath here to keep the file open
    }
  };

  // Handle for day select
  const handleDaySelect = (filePath) => {
    setSelectedFilePath(filePath);
  };

  return (
    <>
      <NavBarComponent
        hashTable={hashTable}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onSelectYear={handleYearSelect}
        onSelectMonth={handleMonthSelect}
        onSelectDay={handleDaySelect}
      />
      <ChatComponent link={selectedFilePath} />
    </>
  );
}

export default App;
