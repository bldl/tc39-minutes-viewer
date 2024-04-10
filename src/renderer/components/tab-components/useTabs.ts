import { SetStateAction, useState } from "react";

const useTabs = (defaultTab = "1") => {
  const [value, setValue] = useState(defaultTab);
  const handleChange = (_event: any, newValue: SetStateAction<string>) => {
    setValue(newValue);
  };

  return { value, setValue, handleChange };
};

export default useTabs;
