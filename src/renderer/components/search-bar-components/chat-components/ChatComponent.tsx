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
  showFileSearchTab: boolean;
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
  const [showFileSearchTab, setShowFileSearchTab] = useState(false);
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
      case "Search in file":
        setShowFileSearchTab(true);
        break;
    }
  };

  const handleSelectOption = (selectedOption: string) => {
    if (activeTab) {
      // Make sure activeTab is a string
      // Default state if this tab hasn't been opened before
      const defaultState: TabStates = {
        showTopicsTab: false,
        showSentimentTab: false,
        showGptTab: false,
        showPersonsTab: false,
        showFileSearchTab: false,
      };

      // Get the current state for activeTab, or default to all false if not set
      const currentState = fileTabStates[activeTab] || defaultState;

      // Update the state based on selectedOption
      const newState = {
        ...currentState,
        showTopicsTab:
          selectedOption === "Topics" ? true : currentState.showTopicsTab,
        showSentimentTab:
          selectedOption === "Sentiment" ? true : currentState.showSentimentTab,
        showGptTab:
          selectedOption === "Search with GPT-3.5" ||
          selectedOption === "Summarize This" ||
          selectedOption === "Analyze Argument Types"
            ? true
            : currentState.showGptTab,
        showPersonsTab:
          selectedOption === "Participants"
            ? true
            : currentState.showPersonsTab,
        showFileSearchTab:
          selectedOption === "Search in file"
            ? true
            : currentState.showFileSearchTab,
      };

      // Update the fileTabStates with the new state for activeTab
      setFileTabStates({
        ...fileTabStates,
        [activeTab]: newState,
      });
    }
  };

  const handleCloseTab = (tabType: string) => {
    // Update the local visibility state based on the tabType
    if (tabType === "Gpt") setShowGptTab(false);
    else if (tabType === "Topics") setShowTopicsTab(false);
    else if (tabType === "Sentiment") setShowSentimentTab(false);
    else if (tabType === "Persons") setShowPersonsTab(false);
    else if (tabType == "ControlF") setShowFileSearchTab(false);

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
        showFileSearchTab,
      } = fileTabStates[activeTab];
      setShowTopicsTab(showTopicsTab);
      setShowSentimentTab(showSentimentTab);
      setShowGptTab(showGptTab);
      setShowPersonsTab(showPersonsTab);
      setShowFileSearchTab(showFileSearchTab);
      } else {
      //If the file hasn't been opened before, reset the tab states to false
      setShowTopicsTab(false);
      setShowSentimentTab(false);
      setShowGptTab(false);
      setShowPersonsTab(false);
      setShowFileSearchTab(false);
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
            showFileSearchTab={showFileSearchTab}
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
