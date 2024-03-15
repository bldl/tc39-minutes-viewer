import React, { useState, useEffect } from "react";
import Delegates from './delegates.tsx';


interface PeopleListProps {
  onPersonClick: (personName: string) => void;
  link: string | null;
}


const PeopleList: React.FC<PeopleListProps> = ({ onPersonClick, link }) => {
  
  // Fetch the content of the Markdown file and extract the people



  const handlePersonClick = (personName: string) => {
    console.log("Clicked on person:", personName);
    onPersonClick(personName);
  };

  return (
    <div>
      {/* <h2>
        {people.length > 0
          ? "People"
          : "Select an MD file from the navigation bar to display the people list."}
      </h2>
      <ul>
        {people.map((person) => (
          <li key={person.id} onClick={() => handlePersonClick(person.name)}>
            {person.name}
          </li>
        ))}
      </ul> */}
      <Delegates link = {link}/>
    </div>
  );
};

export default PeopleList;
