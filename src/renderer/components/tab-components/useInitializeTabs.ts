import { useEffect, useState } from 'react';

interface UseInitializeTabsProps {
  showGptTab: boolean;
  showTopicsTab: boolean;
  showSentimentTab: boolean;
  showParticipantsTab: boolean;
  showControlFTab: boolean;
}

const useInitializeTabs = ({
  showGptTab,
  showTopicsTab,
  showSentimentTab,
  showParticipantsTab,
  showControlFTab,
}: UseInitializeTabsProps) => {
  const [value, setValue] = useState('1');

  useEffect(() => {
    setValue(
      showGptTab
        ? '1'
        : showTopicsTab
        ? '2'
        : showSentimentTab
        ? '3'
        : showParticipantsTab
        ? '4'
        : showControlFTab
        ? '7'
        : '1'
    );
  }, [showGptTab, showTopicsTab, showSentimentTab, showParticipantsTab, showControlFTab]);

  return { value, setValue };
};

export default useInitializeTabs;

