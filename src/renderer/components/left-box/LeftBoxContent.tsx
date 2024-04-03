import { Grid, Paper } from "@mui/material";
import RenderMarkdown from "./RenderLeftbox";

interface Props {
  link: string | null;
  onHighlight: (highlightedText: string) => void;
  onTabChange: (activeTab: string | null) => void;
}

const LeftBoxContent = ({ link, onHighlight, onTabChange }: Props) => {
  return (
    <Grid item xs={6}>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          overflowY: "auto",
          height: "80vh",
          width: "40vw",
          borderRadius: "20px",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <RenderMarkdown
          link={link}
          onHighlight={onHighlight}
          onTabChange={onTabChange}
        />
      </Paper>
    </Grid>
  );
};

export default LeftBoxContent;
