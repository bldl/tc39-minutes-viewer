import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ChatComponent from '../ChatComponent/ChatComponent';
import 'react-tabs/style/react-tabs.css';

const TabsComponent: React.FC = () => {
    return (
      <Tabs>
        <TabList>
          <Tab>Tab 1</Tab>
          {/* Add more tabs as needed */}
        </TabList>
  
        {/* Add more TabPanels for additional tabs */}
      </Tabs>
    );
  };
  
export default TabsComponent;
