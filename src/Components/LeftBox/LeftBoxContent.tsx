import { Grid, Paper } from "@mui/material";
import RenderMarkdown from "./RenderLeftbox";

interface Props {
  link: string | null;
  onHighlight: (highlightedText: string) => void;
}

const LeftBoxContent = ({ link, onHighlight }: Props) => {

  
  return (
    <Grid item xs={6}>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          overflowY: "auto",
          height: "77vh",
          width: "37.8vw",
          borderRadius: "20px",
        }}
      > 
        <RenderMarkdown link={link} onHighlight={onHighlight} />
      </Paper>
    </Grid>
  );
};

export default LeftBoxContent;
