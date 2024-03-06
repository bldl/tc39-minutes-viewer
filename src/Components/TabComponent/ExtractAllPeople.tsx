import React, { useState, useEffect } from "react";

interface Person {
  id: number;
  name: string;
}

interface PeopleListProps {
  onPersonClick: (personName: string) => void;
  link: string | null;
}

const PeopleList: React.FC<PeopleListProps> = ({ onPersonClick, link }) => {
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    if (link) {
      fetchPeopleFromMarkdown();
    }
  }, [link]);

  const fetchPeopleFromMarkdown = async () => {
    try {
      const response = await fetch(link!);
      const markdownContent = await response.text();
      const peopleFromMarkdown = extractPeopleFromMarkdown(markdownContent);
      setPeople(peopleFromMarkdown);
    } catch (error) {
      console.error("Error loading Markdown file:", error);
    }
  };

  const extractPeopleFromMarkdown = (markdownContent: string): Person[] => {
    const people: Person[] = [];

    // Find the section that starts and ends with "-----"
    const sectionStartIndex = markdownContent.indexOf("-----") + 5; // Start after the first delimiter
    const sectionEndIndex = markdownContent.indexOf("-----", sectionStartIndex); // Find the ending delimiter
    const peopleSection = markdownContent.substring(
      sectionStartIndex,
      sectionEndIndex
    );

    // Split the section by commas to get individual names and their credentials
    const namesWithCredentials = peopleSection.split(", ");

    namesWithCredentials.forEach((nameWithCredentials, index) => {
      // Extract name and credentials assuming the format "Name (Credentials)"
      const matches = nameWithCredentials.match(/(.*)\s\((.*)\)/);
      if (matches && matches.length >= 3) {
        const name = matches[1].trim();
        const credentials = matches[2].trim();
        people.push({ id: index, name: `${name} (${credentials})` });
      }
    });

    return people;
  };

  const handlePersonClick = (personName: string) => {
    console.log("Clicked on person:", personName);
    onPersonClick(personName);
  };

  return (
    <div style={{ backgroundColor: "white", padding: "20px" }}>
      <h2>{people.length > 0 ? "People" : "No md file selected"}</h2>
      <ul>
        {people.map((person) => (
          <li key={person.id} onClick={() => handlePersonClick(person.name)}>
            {person.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeopleList;
