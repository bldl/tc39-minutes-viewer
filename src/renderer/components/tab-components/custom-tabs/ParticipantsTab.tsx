import React from "react";
import Delegates from "../delegates/Delegates";

interface ParticipantsTabProps {
  link: string | null;
}

const ParticipantsTab: React.FC<ParticipantsTabProps> = ({ link }) => {
  return (
    <>
      <h3>{`Participants for ${link}`}</h3>
      <Delegates link={link} />
    </>
  );
};

export default ParticipantsTab;

