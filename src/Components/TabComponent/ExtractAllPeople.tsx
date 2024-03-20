import React, { useState, useEffect } from "react";

import Delegates from './Delegates.tsx';



interface PeopleListProps {
  link: string | null;
}



const PeopleList: React.FC<PeopleListProps> = ({ link }) => {
  


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
      <Delegates link={link} />
    </div>
  );
};

export default PeopleList;
