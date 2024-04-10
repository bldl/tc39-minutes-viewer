import React from "react";
import Delegates from "../delegates/Delegates";
import { extractFilename } from "../utils";

interface ParticipantsTabProps {
  link: string | null;
}

const ParticipantsTab: React.FC<ParticipantsTabProps> = ({ link }) => {
  return (
    <>
      <h3>{extractFilename(link, "persons")}</h3>
      <Delegates link={link} />
    </>
  );
};

export default ParticipantsTab;
