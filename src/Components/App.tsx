import ChatComponent from "./ChatComponent/ChatComponent";
import "../App.css";
import { useState } from "react";
import NavBarComponent from "./NavBar/NavBarComponent";

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
        <h1>NavBar Test: {selectedOption}</h1>
        <NavBarComponent options={options} label="Select a meeting: " onSelect={handleSelect} />
      </div>
    </>
  );
}

export default App;
