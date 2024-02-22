import React, { useState, forwardRef } from "react";
import { Grid, Paper, List, ListItem, ListItemText } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { TreeView } from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"; // Corrected
import CheckBoxIcon from "@mui/icons-material/CheckBox"; // Added
import { useSpring, animated } from "@react-spring/web";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { TransitionProps } from "@mui/material/transitions";
import { alpha, styled } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";

import {
  TreeItem,
  TreeItemProps,
  treeItemClasses,
} from "@mui/x-tree-view/TreeItem";

function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props: SvgIconProps) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

interface NavBarComponentProps {
  hashTable: Record<string, Record<string, Record<string, string>>>;
  onSelectYear: (year: string) => void;
  onSelectMonth: (year: string, month: string) => void;
  onSelectDay: (filePath: string) => void;
}

const NavBarComponent: React.FC<NavBarComponentProps> = ({
  hashTable,
  onSelectYear,
  onSelectMonth,
  onSelectDay,
}) => {
  // CustomTreeItem using forwardRef
  const CustomTreeItem = forwardRef((props: TreeItemProps, ref) => (
    <TreeItem {...props} TransitionComponent={TransitionComponent} ref={ref} />
  ));

  const TransitionComponent = (props) => {
    const style = useSpring({
      from: { opacity: 0, transform: "translate3d(20px,0,0)" },
      to: {
        opacity: props.in ? 1 : 0,
        transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
      },
      config: { friction: 40, tension: 170 }, // Adjust for desired effect
    });

    return (
      <animated.div style={style}>
        <Collapse {...props} />
      </animated.div>
    );
  };

  // StyledTreeItem for custom styling
  const StyledTreeItem = styled(CustomTreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
      "& .close": { opacity: 0.3 },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 15,
      paddingLeft: 18,
      borderLeft: `1px dashed ${theme.palette.text.primary}`,
    },
  }));
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setSelected(nodeIds);
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length > 0 ? [] : Object.keys(hashTable)
    );
  };

  const handleSelectClick = () => {
    setSelected((oldSelected) =>
      oldSelected.length > 0 ? [] : Object.keys(hashTable)
    );
  };
  const handleNodeSelect = (event: React.SyntheticEvent, nodeId: string) => {
    const parts = nodeId.split("-");
    if (parts.length === 1) {
      onSelectYear(parts[0]);
    } else if (parts.length === 2) {
      onSelectMonth(parts[0], parts[1]);
    } else if (parts.length === 3) {
      onSelectDay(hashTable[parts[0]][parts[1]][parts[2]]);
    }
  };
  const renderTreeItems = (
    data: Record<string, any>,
    prefix = ""
  ): JSX.Element[] => {
    return Object.keys(data).map((key) => {
      const newPrefix = prefix ? `${prefix}-${key}` : key;
      if (typeof data[key] === "object") {
        return (
          <StyledTreeItem key={newPrefix} nodeId={newPrefix} label={key}>
            {renderTreeItems(data[key], newPrefix)}
          </StyledTreeItem>
        );
      }
      return <StyledTreeItem key={newPrefix} nodeId={newPrefix} label={key} />;
    });
  };

  return (
    <Grid item xs={12} style={{ position: "relative" }}>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          overflowY: "auto",
          height: "90.2vh",
          width: "15%",
          position: "absolute",
          top: "10%",
          borderRadius: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Button
            onClick={handleExpandClick}
            size="small"
            variant="text"
            sx={{
              color: "grey.900",
              padding: "2px 2px", // Reduced padding
              minWidth: "initial", // Override minimum width to allow the button to be smaller
              fontSize: "0.7rem", // Smaller font size
              "&:hover": {
                backgroundColor: "grey.100",
              },
              "&:focus": {
                outline: "none",
              },
              "&.MuiButtonBase-root:focus": {
                outline: "none",
              },
            }}
          >
            {expanded.length > 0 ? "Collapse All" : "Expand All"}
          </Button>
          <Button
            onClick={handleSelectClick}
            size="small"
            variant="text"
            sx={{
              color: "grey.900",
              padding: "2px 2px", // Reduced padding
              minWidth: "initial", // Override minimum width to allow the button to be smaller
              fontSize: "0.7rem", // Smaller font size
              "&:hover": {
                backgroundColor: "grey.100",
              },
              "&:focus": {
                outline: "none",
              },
              "&.MuiButtonBase-root:focus": {
                outline: "none",
              },
            }}
          >
            {selected.length > 0 ? "Deselect All" : "Select All"}
          </Button>
        </Box>
        <TreeView
          aria-label="file system navigator"
          defaultExpanded={["1"]}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
          defaultEndIcon={<CloseSquare />}
          expanded={expanded}
          selected={selected}
          onNodeToggle={handleToggle}
          onNodeSelect={handleNodeSelect}
          sx={{ height: 700, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
        >
          {renderTreeItems(hashTable)}
        </TreeView>
      </Paper>
    </Grid>
  );
};

export default NavBarComponent;
