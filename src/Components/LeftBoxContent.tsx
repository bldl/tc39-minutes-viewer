import {
  Grid,
  Paper,
  Typography,
} from '@mui/material';


const LeftBoxContent = () => {
  return (
    <Grid item xs={6}>
      <Paper elevation={3} style={{ padding: '20px', overflowY: 'auto', height: '70vh'}}>
        <Typography variant="body1" align="left">Here goes meeting notes</Typography>
      </Paper>
    </Grid>
  );
};

export default LeftBoxContent;
