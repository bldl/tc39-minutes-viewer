import { useState, useCallback } from "react";

interface UseTreeStateProps {
  defaultExpanded?: string[];
}

const useTreeState = ({ defaultExpanded = [] }: UseTreeStateProps) => {
  const [expanded, setExpanded] = useState<string[]>(defaultExpanded);
  const [selected, setSelected] = useState<string>("");

  const handleToggle = useCallback(
    (_event: React.SyntheticEvent, nodeIds: string[]) => {
      setExpanded(nodeIds);
    },
    []
  );

  const handleSelect = useCallback(
    (_event: React.SyntheticEvent, nodeId: string) => {
      setSelected(nodeId);
    },
    []
  );

  return {
    expanded,
    setExpanded,
    selected,
    setSelected,
    handleToggle,
    handleSelect,
  };
};

export default useTreeState;
