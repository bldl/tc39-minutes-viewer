import { Grid, Paper } from "@mui/material";
import RenderMarkdown from "./RenderLeftbox";

const LeftBoxContent = () => {
  return (
    <Grid item xs={6}>
      <Paper
        elevation={3}
        style={{ padding: "20px", overflowY: "auto", height: "70vh" }}
      >
        <RenderMarkdown />
      </Paper>
    </Grid>
  );
};

export default LeftBoxContent;
