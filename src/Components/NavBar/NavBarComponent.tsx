import React, { useState } from "react";
import { Box } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { TransitionProps } from "@mui/material/transitions";
import Collapse from "@mui/material/Collapse";
import { alpha, styled } from "@mui/material/styles";
import { TreeView } from "@mui/x-tree-view/TreeView";
import {
  TreeItem,
  TreeItemProps,
  treeItemClasses,
} from "@mui/x-tree-view/TreeItem";
import { Grid, Paper } from "@mui/material";
import Button from "@mui/material/Button";

// Functions
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
    reset: true,
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
// End functions

interface NavBarComponentProps {
  hashTable: Record<string, Record<string, Record<string, string>>>;
  onSelectDay: (filePath: string) => void;
}

const NavBarComponent: React.FC<NavBarComponentProps> = ({
  hashTable,
  onSelectDay,
}) => {
  const CustomTreeItem = React.forwardRef(
    (props: TreeItemProps, ref: React.Ref<HTMLLIElement>) => (
      <TreeItem
        {...props}
        TransitionComponent={TransitionComponent}
        ref={ref}
      />
    )
  );

  const StyledTreeItem = styled(CustomTreeItem)(({ theme }) => ({
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

  //// Handle Expand functionality
  const [expanded, setExpanded] = useState<string[]>([]);

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length > 0 ? [] : Object.keys(hashTable)
    );
  };
  //// End

  // This handles the user clicking on md files in the Tree
  const handleNodeSelect = (event: React.SyntheticEvent, nodeId: string) => {
    const parts = nodeId.split("-");
    // Check if the user clicked on a meeting file
    if (parts.length === 3) {
      onSelectDay(hashTable[parts[0]][parts[1]][parts[2]]);
    }
  };

  // Iterate through the hashtable, and populate the Tree with StyledTreeItems
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

  // Return the Component
  return (
    <Grid item xs={12} style={{ position: "relative", marginLeft: "1%" }}>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          overflowY: "auto",
          height: "92.2vh",
          width: "17%",
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
          <Button // This button is for the handling of expand click
            onClick={handleExpandClick}
            size="small"
            variant="text"
            sx={{
              padding: "2px 2px",
              fontSize: "0.75rem",
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
        </Box>
        <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 300 }}>
          <TreeView
            aria-label="file system navigator"
            defaultExpanded={["1"]}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
            //// Expansion of tree is functional, but removes animation. I think it is because of the use of "UseState"
            //expanded={expanded}
            //onNodeToggle={handleToggle}
            onNodeSelect={handleNodeSelect}
            sx={{ overflowX: "hidden" }}
          >
            {renderTreeItems(hashTable)}
          </TreeView>
        </Box>
      </Paper>
    </Grid>
  );
};

export default NavBarComponent;
