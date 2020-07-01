import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  tabs: {
    paddingLeft: 300,
    display: 'flex',
    justifyContent: 'center'
  }
}))

export default function HeaderBar(props) {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <AppBar
      position="fixed"
      className={classes.appBar}>

      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={props.handleClickMenuButton}
          edge="start"
          className={classes.menuButton}>

          <MenuIcon />

        </IconButton>

        <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
          Image Retrieval
        </Typography>
        <Button variant="outlined" color="inherit" onClick={props.handleOpenResults}>Show results</Button>

      </Toolbar>



    </AppBar>
  );
}

