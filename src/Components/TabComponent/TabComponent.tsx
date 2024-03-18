import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ChatMessages from "../ChatComponent/ChatMessages";
import TopicList from "./ExtractingAllHeaders";
import { annotate } from "rough-notation";
import ExtractAllPeople from "./ExtractAllPeople.tsx";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface TabBoxProps {
  messages: Message[];
  link: string | null;
  isLoading: true | false;
  showTopicsTab: boolean;
  showSentimentTab: boolean;
  showGptTab: boolean;
  showParticipantsTab: boolean;
}

const TabsComponent: React.FC<TabBoxProps> = ({
  messages,
  link,
  isLoading,
  showTopicsTab,
  showGptTab,
  showSentimentTab,
  showParticipantsTab,
}: TabBoxProps) => {
  // Sentiment start
  const [sentimentResult, setSentimentResult] = useState<string[]>([]);
  const [overallSentiment, setOverallSentiment] = useState<string>("");
  const [lastTopicClick, setLastTopicClick] = useState<{
    topic: string;
    time: number;
  }>({
    topic: "",
    time: 0,
  });

  // Calculate and set overall sentiment based on scores
  useEffect(() => {
    window.api.receiveSentimentAnalysis((event: any, arg: string) => {
      const scores = JSON.parse(arg); // Assuming arg is a JSON string that represents an array, e.g., "[1, 1]"
      const sentimentDescriptions = scores.map((score: string | number) =>
        interpretSentiment(score)
      );
      setSentimentResult(sentimentDescriptions); // Update the state with an array of descriptions

      const overall = interpretOverallSentiment(scores);
      setOverallSentiment(overall);
    });
  }, []);

  const extractFilename = (
    link: string | null,
    type: "topics" | "sentiment" | "persons"
  ): string => {
    if (!link) return "No file selected";

    // Normalize backslashes to forward slashes for consistency
    const normalizedLink = link.replace(/\\/g, "/");

    // Extract the part after 'public/meetings/'
    const pattern = /public\/meetings\/(.*)/;
    const match = normalizedLink.match(pattern);
    if (!match) return "Invalid link format";

    // Extracted filename will be something like '2019-03/26.md'
    let [yearMonth, dayWithExtension] = match[1].split("/");
    if (!dayWithExtension) return "Invalid link format";

    // Split the year and month, and remove the '.md' extension from day
    let [year, month] = yearMonth.split("-");

    //remove also the .md from the day and letters
    let part = dayWithExtension.replace(".md", "");
    let day = part.replace(/[a-zA-Z--]/g, "");

    // Reconstruct the URL with the type
    const reconstructedUrl = `http://tc39/${year}/${month}/${day}/${type}`;

    return reconstructedUrl;
  };

  // Convert sentiment analysis numeric result to a descriptive message
  const interpretSentiment = (score: string | number) => {
    const sentimentMap = {
      "0": "Negative",
      "1": "Neutral",
      "2": "Positive",
    };
    return sentimentMap[score] || "Unknown"; // Default to 'Unknown' if score is not in the map
  };

  const interpretOverallSentiment = (scores: any[]) => {
    if (scores.length === 0) return "No sentiment analysis performed yet.";
    const averageScore =
      scores.reduce((acc, cur) => acc + cur, 0) / scores.length;
    // Define thresholds for categorizing sentiment
    if (averageScore < 0.5) return "Overall sentiment is Negative.";
    else if (averageScore >= 0.5 && averageScore < 1.5)
      return "Overall sentiment is Neutral.";
    else return "Overall sentiment is Positive.";
  };
  // Sentiment end

  const scrollToSection = (id: string, topic: string) => {
    const currentTime = new Date().getTime();
    console.log("Clicked on topic in scroll:", topic);
    console.log("Id:", id);
    if (
      topic === lastTopicClick.topic &&
      currentTime - lastTopicClick.time < 2000
    ) {
      // It's been less than two seconds since the last click of the same topic
      return;
    }

    // Update last topic click with the current topic and time
    setLastTopicClick({ topic, time: currentTime });

    // Proceed with scrolling and annotating the element
    const element = document.getElementById(id);

    console.log("Element:", element);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Wait until scroll if finished before annotating the element
      setTimeout(() => {
        annotateElement(element);
      }, 700);
    }
  };

  const annotateElement = (element: Element) => {
    const annotation = annotate(element, {
      type: "underline",
      color: "red",
      padding: 5,
      strokeWidth: 2,
      iterations: 1,
    });
    annotation.show();
    // Automatically hide the annotation after a delay if you want
    setTimeout(() => {
      annotation.hide();
    }, 2000);
  };

  function toSlug(text: string): string {
    // Normalize Unicode characters, remove non-alphanumeric characters, replace spaces with hyphens
    // This approach assumes a basic handling of special characters and may need adjustments for edge cases
    return text
      .normalize("NFD") // Decompose Unicode into base characters and diacritics
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .toLowerCase() // Convert to lowercase
      .replace(/&/g, "")
      .replace(/:=/g, "-")
      .replace(/"/g, "-")
      .replace(/[\s]+/g, "-") // Replace spaces and repeated hyphens with a single hyphen
      .replace(/[^a-z0-9\-]/g, "") // Remove remaining non-alphanumeric/non-hyphen characters
      .replace(/\-\-+/g, "-") // Replace multiple hyphens with a single hyphen
      .replace(/^-+|-+$/g, "") // Trim hyphens from start and end
      .replace(/""/g, ""); // Handle ':=' by removing it
  }

  const handlePerosnClick = (person: string) => {
    scrollToSection(toSlug(person), person);
  };

  return (
    <Tabs>
      {!showGptTab &&
        !showTopicsTab &&
        !showParticipantsTab &&
        !showSentimentTab && (
          <h2>
            Here we can add instructions for the app. The text will disappear
            once a tab is opened.
          </h2>
        )}
      {/* List of tabs */}
      {(showGptTab ||
        showTopicsTab ||
        showSentimentTab ||
        showParticipantsTab) && (
        <TabList>
          {/* Tabs and tab-names */}
          {showGptTab && <Tab>ChatGPT</Tab>}
          {showTopicsTab && <Tab>Topics</Tab>}
          {showSentimentTab && <Tab>Sentiment</Tab>}
          {showParticipantsTab && <Tab>Persons</Tab>}
        </TabList>
      )}

      {/* Content for tabs */}

      {showGptTab && (
        <TabPanel>
          <ChatMessages messages={messages} isLoading={isLoading} />
        </TabPanel>
      )}

      {showTopicsTab && (
        <TabPanel>
          <h3>{extractFilename(link, "topics")}</h3>
          <TopicList
            onTopicClick={function (topic: string): void {
              scrollToSection(toSlug(topic), topic);
              console.log("Clicked on topic:", topic);
              console.log("After being slugged", toSlug(topic));
            }}
            link={link}
          />
        </TabPanel>
      )}

      {/* Sentiment tab */}
      {showSentimentTab && (
        <TabPanel>
          <h2>Sentiment Analysis</h2>
          <h3>{extractFilename(link, "sentiment")}</h3>
          {sentimentResult.length > 0 ? (
            <>
              <ul>
                {sentimentResult.map((sentiment, index) => (
                  <li key={index}>{sentiment}</li>
                ))}
              </ul>
              <p>
                <strong>Overall Sentiment:</strong> {overallSentiment}
              </p>
            </>
          ) : (
            <p>No sentiment analysis has been performed yet.</p>
          )}
        </TabPanel>
      )}

      {showParticipantsTab && (
        <TabPanel>
          <h3>{extractFilename(link, "persons")}</h3>
          <ExtractAllPeople
            link={link}
            onPersonClick={(person) => handlePerosnClick(person)}
          />
        </TabPanel>
      )}
    </Tabs>
  );
};

export default TabsComponent;
