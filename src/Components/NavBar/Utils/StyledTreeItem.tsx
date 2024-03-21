import { alpha, styled } from "@mui/material/styles";
import {
  TreeItem,
  TreeItemProps,
  treeItemClasses,
} from "@mui/x-tree-view/TreeItem";
import { TransitionComponent } from "./TransitionComponent";

export const StyledTreeItem = styled((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));
