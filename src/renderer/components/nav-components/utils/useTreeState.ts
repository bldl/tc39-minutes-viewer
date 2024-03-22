import { useState, useCallback } from "react";

interface UseTreeStateProps {
  defaultExpanded?: string[];
}

const useTreeState = ({ defaultExpanded = [] }: UseTreeStateProps) => {
  const [expanded, setExpanded] = useState<string[]>(defaultExpanded);
  const [selected, setSelected] = useState<string>("");

  const handleToggle = useCallback(
    (event: React.SyntheticEvent, nodeIds: string[]) => {
      setExpanded(nodeIds);
    },
    []
  );

  const handleSelect = useCallback(
    (event: React.SyntheticEvent, nodeId: string) => {
      setSelected(nodeId);
    },
    []
  );

  // Additional functionality can be implemented here, such as handling expand all/collapse all
  const handleExpandAll = useCallback(() => {
    // This would be implemented based on the specific structure of your tree data
    // For example, you might want to set all node IDs to the expanded state
  }, []);

  const handleCollapseAll = useCallback(() => {
    setExpanded([]);
  }, []);

  return {
    expanded,
    setExpanded,
    selected,
    setSelected,
    handleToggle,
    handleSelect,
    handleExpandAll,
    handleCollapseAll,
  };
};

export default useTreeState;
