import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import TextField from '@material-ui/core/TextField';
import ImageGridList from './Grid';
import Tags from './Semantics';
import Button from '@material-ui/core/Button';
import SimpleTabs from './AppBar';
import Grid from '@material-ui/core/Grid';


const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  search: {
    margin: 20,
  },
}));

export default function SearchPanel(props) {
  const classes = useStyles();

  const [query, setQuery] = useState('');

  return (
    <div>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Image Retrieval
          </Typography>
        </Toolbar>
      </AppBar>
      {/* <SimpleTabs /> */}
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <div className={classes.search}>
            <TextField 
              fullWidth id="outlined-search" label="Search Query" type="search" variant="outlined" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {/* <Divider /> */}
          {/* <Tags /> */}
        </div>
        <Grid container justify="center">
          <div>
            <Button variant="contained" color="primary" onClick = {()=>{props.clickSearch(query)}}>
              Search 
            </Button>
          </div>
        </Grid>

      </Drawer>
    </div>
  );
}
