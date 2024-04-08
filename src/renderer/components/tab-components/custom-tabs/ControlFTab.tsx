import React from "react";
import CtrlFTab from "../ctrl-f-tabs/CtrlFTab";

interface ControlFTabProps {
  link: string | null;
}

const ControlFTab: React.FC<ControlFTabProps> = ({ link }) => {
  return (
    <>
      <h3>{`File Search in ${link}`}</h3>
      <CtrlFTab link={link} />
    </>
  );
};

export default ControlFTab;

