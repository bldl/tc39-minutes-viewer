import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ChatMessages from "../ChatComponent/ChatMessages";


interface Message {
    role: "user" | "assistant";
    content: string;
  }
  
  interface TabBoxProps {
    messages: Message[];
  }

const TabsComponent: React.FC<TabBoxProps> = ({ messages }) => {

    return (
      <Tabs>
        {/* List of tabs */}
        <TabList>
          {/* Tabs and tab-names */}
          <Tab>ChatGPT</Tab>
          <Tab>Tab 2</Tab>  
          <Tab>Tab 3</Tab>
        </TabList>

        {/* Content for tabs */}

        {/* ChatGPT tab */}
        <TabPanel>
          <ChatMessages messages={messages}/>
       </TabPanel>

       {/* Second tab */}
        <TabPanel>
          {/* Place content for second tab here */}
        </TabPanel>

        {/* Third tab */}
        <TabPanel>
          {/* Place content for third tab here  */}
        </TabPanel>

      </Tabs>

    );
};
  
export default TabsComponent;
