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
      <RenderMarkdown
        link={link}
        onHighlight={onHighlight}
        onTabChange={onTabChange}
      />
    </Grid>
  );
};

export default LeftBoxContent;
