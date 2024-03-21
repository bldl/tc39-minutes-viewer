import React from "react";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { StyledTreeItem } from "./StyledTreeItem";
import { MinusSquare, PlusSquare, CloseSquare } from "./NavBarIcons";

interface CustomTreeViewProps {
  hashTable: Record<string, Record<string, Record<string, string>>>;
  onSelectDay: (filePath: string) => void;
}

const CustomTreeView: React.FC<CustomTreeViewProps> = ({
  hashTable,
  onSelectDay,
}) => {
  // Function to render tree items recursively
  const renderTreeItems = (
    data: any,
    nodeIdPrefix: string = ""
  ): JSX.Element[] => {
    return Object.entries(data).map(([key, value]) => {
      const nodeId = nodeIdPrefix ? `${nodeIdPrefix}-${key}` : key;

      if (typeof value === "object" && Object.keys(value).length > 0) {
        // Object: render a parent node with children
        return (
          <StyledTreeItem key={nodeId} nodeId={nodeId} label={key}>
            {renderTreeItems(value, nodeId)}
          </StyledTreeItem>
        );
      } else {
        // Leaf node: render an item without children
        return (
          <StyledTreeItem
            key={nodeId}
            nodeId={nodeId}
            label={key}
            onClick={() => onSelectDay(value)}
          />
        );
      }
    });
  };

  // This handles the user clicking on md files in the Tree
  const handleNodeSelect = (event: React.SyntheticEvent, nodeId: string) => {
    const parts = nodeId.split("-");
    // Check if the user clicked on a meeting file
    if (parts.length === 3) {
      onSelectDay(hashTable[parts[0]][parts[1]][parts[2]]);
    }
  };

  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      defaultEndIcon={<CloseSquare />}
      onNodeSelect={handleNodeSelect} // Use the updated function here
      sx={{ flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
    >
      {renderTreeItems(hashTable)}
    </TreeView>
  );
};

export default CustomTreeView;
