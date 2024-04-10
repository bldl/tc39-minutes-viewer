import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Paper } from "@mui/material";
import AppBarComponent from "../AppBarComponent";
import LeftBoxContent from "../../left-box/LeftBoxContent";
import TabsComponent from "../../tab-components/TabComponent";
import { useSelection } from "../../contexts/SelectionContext";
import { update } from "@react-spring/web";

// Define the shape of the message object
interface Message {
  role: "user" | "assistant";
  content: string;
  activeTab?: string | null;
}

// Props for the ChatComponent.
interface ChatComponentProps {
  isLoading: true | false;
}

interface TabStates {
  showTopicsTab: boolean;
  showSentimentTab: boolean;
  showGptTab: boolean;
  showPersonsTab: boolean;
  showControlFTab: boolean;
}

interface FileTabStates {
  [key: string]: TabStates;
}

// ChatComponent is the main component for the chat interface.
const ChatComponent: React.FC<ChatComponentProps> = ({}) => {
  // Get the selectedFilePath from the SelectionContext
  const { selectedFilePath } = useSelection();
  // State variables for the chat component.
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [clearMessages, setClearMessages] = useState<boolean>(false);
  const [highlightedText, setHighlightedText] = useState<string>("");
  const [showTopicsTab, setShowTopicsTab] = useState(false);
  const [showControlFTab, setShowControlFTab] = useState(false);
  const [showSentimentTab, setShowSentimentTab] = useState(false);
  const [showGptTab, setShowGptTab] = useState(false);
  const [showPersonsTab, setShowPersonsTab] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const [fileTabStates, setFileTabStates] = useState<FileTabStates>({});

  const handleHighlightedText = (text: string) => {
    setHighlightedText(text);
  };
  // Handles changes in the chat input field.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  {
    // Clears all messages from the chat.
  }
  const handleClearMessages = () => {
    setMessages([]);
    setClearMessages(true);
  };

  const updateTab = (tab: string) => {
    switch (tab) {
      case "topics":
        setShowTopicsTab(true);
        break;
      case "sentiment":
        setShowSentimentTab(true);
        break;
      case "persons":
        setShowPersonsTab(true);
        break;
      case "search-in-file":
        setShowControlFTab(true);
        break;
    }
  };

  const handleSelectOption = (selectedOption: string) => {
    // Ensuring activeTab is not null or undefined
    if (!activeTab) return;

    // Retrieve the current state or initialize it if not present
    const currentState = fileTabStates[activeTab] || {
      showTopicsTab: false,
      showSentimentTab: false,
      showGptTab: false,
      showPersonsTab: false,
      showControlFTab: false,
    };

    // Determine which tab should be updated based on the selected option
    const tabToUpdate = {
      Topics: "showTopicsTab",
      Sentiment: "showSentimentTab",
      "Search with GPT-3.5": "showGptTab", // Assuming this as a placeholder
      "Summarize This": "showGptTab", // Assuming this affects the same GPT tab
      "Analyze Argument Types": "showGptTab", // Assuming this affects the same GPT tab
      Participants: "showPersonsTab",
      "Search in file": "showControlFTab",
    }[selectedOption];

    // If there's a tab to update, toggle its visibility
    if (tabToUpdate) {
      const newState = { ...currentState, [tabToUpdate]: true };

      // Update the fileTabStates with the new state
      setFileTabStates((prev) => ({
        ...prev,
        [activeTab]: newState,
      }));
    }
  };
 
  const handleCloseTab = (tabType: string) => {
    // Update the local visibility state based on the tabType
    if (tabType === "Gpt") setShowGptTab(false);
    else if (tabType === "Topics") setShowTopicsTab(false);
    else if (tabType === "Sentiment") setShowSentimentTab(false);
    else if (tabType === "Persons") setShowPersonsTab(false);
    else if (tabType == "ControlF") setShowControlFTab(false);

    // Then, update the fileTabStates for the active tab if it exists
    if (activeTab && fileTabStates[activeTab]) {
      setFileTabStates((prevStates) => ({
        ...prevStates,
        [activeTab]: {
          ...prevStates[activeTab],
          [`show${tabType}Tab`]: false, // Dynamically set the specific tab visibility to false
        },
      }));
    }
  };

  useEffect(() => {
    if (activeTab && fileTabStates[activeTab]) {
      // Load the tab states for the newly selected file
      const {
        showTopicsTab,
        showSentimentTab,
        showGptTab,
        showPersonsTab,
        showControlFTab,
      } = fileTabStates[activeTab];
      setShowTopicsTab(showTopicsTab);
      setShowSentimentTab(showSentimentTab);
      setShowGptTab(showGptTab);
      setShowPersonsTab(showPersonsTab);
      setShowControlFTab(showControlFTab);
      } else {
      //If the file hasn't been opened before, reset the tab states to false

      setShowTopicsTab(false);
      setShowSentimentTab(false);
      setShowGptTab(false);
      setShowPersonsTab(false);
      setShowControlFTab(false);
    }
  }, [activeTab, fileTabStates]);

  {
    // Effect to reset the clearMessages flag.
  }
  useEffect(() => {
    if (clearMessages) {
      setClearMessages(false);
    }
  }, [clearMessages]);

  {
    // Handles sending a message to the chatbot.
  }

  const handleSendMessage = async (prefix: string) => {
    setIsLoading(true);

    const modelName = "gpt-3.5-turbo";
    const maxTokens = 200;

    let finalInput;

    if (prefix == "Summarize this") {
      finalInput = `${prefix}`;
    } else if (
      prefix ==
      "Please analyze the types of arguments used in the provided text."
    ) {
      finalInput = `For your answer, put a hyphen (not numbers) before each new point you make. ${prefix}`;
    } else {
      finalInput = input;
    }

    try {
      // Making a POST request to the OpenAI API.
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
              role: "user",
              content: `${finalInput}\n\nBased on this text: ${highlightedText}`,
            },
          ],
          model: modelName,
          max_tokens: maxTokens,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              import.meta.env.VITE_REACT_APP_OPENAI_API_KEY
            }`,
          },
        }
      );

      // Updating the messages state with the response.
      setMessages([
        ...messages,
        {
          role: "assistant",
          content: response.data.choices[0].message.content,
          activeTab: activeTab,
        },
      ]);
      setInput("");
      setHighlightedText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the chat component UI.
  return (
    <Container style={{ maxWidth: "none", marginLeft: "17.5%" }}>
      <AppBarComponent
        input={input}
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
        handleClearMessages={handleClearMessages}
        handleSelectOption={handleSelectOption}
        updateFilePath={useSelection}
        updateTab={updateTab}
      />
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <LeftBoxContent
          link={selectedFilePath}
          onHighlight={handleHighlightedText}
          onTabChange={setActiveTab}
        />

        <Paper
          elevation={3}
          style={{
            padding: "20px",
            overflowY: "auto",
            height: "80vh",
            width: "40vw",
            maxWidth: "100%",
            borderRadius: "20px",
            flexShrink: 1, // Allow the right box to shrink
          }}
        >
          <TabsComponent
            messages={messages}
            link={selectedFilePath}
            isLoading={isLoading}
            showTopicsTab={showTopicsTab}
            showControlFTab={showControlFTab}
            showSentimentTab={showSentimentTab}
            showGptTab={showGptTab}
            showParticipantsTab={showPersonsTab}
            activeTab={activeTab}
            handleCloseTab={handleCloseTab}
          />
        </Paper>
      </div>
    </Container>
  );
};

export default ChatComponent;
