
// import "src/App.css";
import { useState, useEffect } from "react";
import ChatComponent from "./ChatComponent/ChatComponent";
import NavBarComponent from "./NavBar/NavBarComponent";
import { fetchHashTable } from "./NavBar/FetchMeetings";

const options = [
  "public/meetings/2012-05/may-21.md",
  "public/meetings/2012-05/may-22.md",
  "public/meetings/2012-05/may-23.md"
];

function App() {
  const [selectedOption, setSelectedOption] = useState<string | null>("");
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const loadHashTable = async () => {
      try {
        const hashTable = await fetchHashTable(); // Fetch hash table on startup
        // Assuming hashTable is an object where keys are the options you want to display
        const newOptions = Object.keys(hashTable); // Or any other transformation you need
        setOptions(newOptions);
      } catch (error) {
        console.error('Error fetching hash table:', error);
      }
    };

    loadHashTable();
  }, []);

  const handleSelect = (value: string | null) => {
    setSelectedOption(value);
    console.log(`Selected: ${value}`);
  };

  return (
   <>
        <NavBarComponent
          options={options}
          label="Select"
          onSelect={handleSelect}
        />
        
        <ChatComponent link={selectedOption} />
      
    </>
  );
}

export default App;
