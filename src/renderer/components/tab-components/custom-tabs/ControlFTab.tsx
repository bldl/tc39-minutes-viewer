import React from "react";
import CtrlFTab from "../ctrl-f-tabs/CtrlFTab";
import { extractFilename } from "../utils";

interface ControlFTabProps {
  link: string | null;
}

const ControlFTab: React.FC<ControlFTabProps> = ({ link }) => {
  return (
    <>
      <h3>{extractFilename(link, "search-in-file")}</h3>
      <CtrlFTab link={link} />
    </>
  );
};

export default ControlFTab;
