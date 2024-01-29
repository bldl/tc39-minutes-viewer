import ChatComponent from "./ChatComponent";
import "../App.css";
import { useState } from "react";
import NavBarComponent from "./NavBarComponent";

const options = ['meeting 1', 'meeting 2', 'meeting 3'];

function App() {
  const [selectedOption, setSelectedOption] = useState<string | null>('');

  const handleSelect = (value: string | null) => {
      setSelectedOption(value);
      console.log(`Selected: ${value}`);
  };

  return (
    <>
      <div>
        <ChatComponent />
      </div>
      <div>
        <h1>Hore jævel: {selectedOption}</h1>
        <NavBarComponent options={options} label="Select an Option" onSelect={handleSelect} />
      </div>
    </>
  );
}

export default App;
