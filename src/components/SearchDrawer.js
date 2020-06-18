import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles({
  drawer: {
    width: props => props.drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: props => props.drawerWidth,
  },

  search: {
    margin: 20,
  },
});

export default function SearchDrawer(props) {
  const classes = useStyles(props);
  const [query, setQuery] = useState('');

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={props.drawerOpen}
      classes={{
        paper: classes.drawerPaper,
      }}>

      <Toolbar />

      <div className={classes.drawerContainer}>
        <div className={classes.search}>
          <TextField
            fullWidth id="outlined-search" label="Search Query" type="search" variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <Grid container justify="center">
        <div>
          <Button variant="contained" color="primary" onClick={() => { props.clickSearch(query) }}>
            Search
            </Button>
        </div>
      </Grid>

    </Drawer>
  )
}
