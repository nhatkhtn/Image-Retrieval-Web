import React from 'react';
import { makeStyles,useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
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

        <Typography variant="h6" noWrap>
          Image Retrieval
        </Typography>

      </Toolbar>

    </AppBar>
  );
}

