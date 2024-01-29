
// import "src/App.css";
import { useState } from "react";
import ChatComponent from "./ChatComponent/ChatComponent";
import NavBarComponent from "./NavBar/NavBarComponent";

const options = [
  "public/meetings/2012-05/may-21.md",
  "public/meetings/2012-05/may-22.md",
  "public/meetings/2012-05/may-23.md"
];

function App() {
  const [selectedOption, setSelectedOption] = useState<string | null>("");

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
