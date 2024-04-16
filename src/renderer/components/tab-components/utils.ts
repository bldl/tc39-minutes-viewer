import { useState } from "react";
import { annotate } from "rough-notation";

export const extractFilename = (
  link: string | null,
  type: "topics" | "sentiment" | "persons" | "gpt" | "search-in-file"
): string => {
  if (!link) return "";

  // Normalize backslashes to forward slashes for consistency
  const normalizedLink = link.replace(/\\/g, "/");

  // Extract the part after 'public/meetings/'
  const pattern = /public\/meetings\/(.*)/;
  const match = normalizedLink.match(pattern);
  if (!match) return "Invalid link format";

  // Extracted filename will be something like '2019-03/26.md'
  const [yearMonth, dayWithExtension] = match[1].split("/");
  if (!dayWithExtension) return "Invalid link format";

  // Split the year and month, and remove the '.md' extension from day
  const [year, month] = yearMonth.split("-");

  //remove also the .md from the day and letters
  const part = dayWithExtension.replace(".md", "");
  const day = part.replace(/[a-zA-Z--]/g, "");

  // Reconstruct the URL with the type
  const reconstructedUrl = `tc39://${year}/${month}/${day}/${type}`;

  return reconstructedUrl;
};

export const toSlug = (text: string) => {
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
};

export const annotateElement = (element: Element) => {
  const annotation = annotate(element as HTMLElement, {
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

export const useScrollToSection = () => {
  const [lastTopicClick, setLastTopicClick] = useState<{
    topic: string;
    time: number;
  }>({ topic: "", time: 0 });

  const scrollToSection = (id: string, topic: string) => {
    const currentTime = new Date().getTime();
    if (
      topic === lastTopicClick.topic &&
      currentTime - lastTopicClick.time < 2000
    ) {
      return; // It's been less than two seconds since the last click on the same topic.
    }

    setLastTopicClick({ topic, time: currentTime });

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => annotateElement(element), 700);
    }
  };

  return scrollToSection;
};
