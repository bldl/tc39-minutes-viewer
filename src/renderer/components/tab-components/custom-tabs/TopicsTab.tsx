import React from "react";
import TopicList from "../topics/ExtractingAllHeaders";
import { extractFilename, toSlug, useScrollToSection } from "../utils";

interface TopicsTabProps {
  link: string | null;
}

const TopicsTab: React.FC<TopicsTabProps> = ({ link }) => {
  const scrollToSection = useScrollToSection();

  return (
    <>
      <h3>{extractFilename(link, "topics")}</h3>
      <TopicList
        onTopicClick={(topic: string) => scrollToSection(toSlug(topic), topic)}
        link={link}
      />
    </>
  );
};

export default TopicsTab;

