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

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    setSelectedDay(null);
    setSelectedFilePath(null);
  };

  const handleMonthSelect = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedDay(null);
    setSelectedFilePath(null);
  };

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
