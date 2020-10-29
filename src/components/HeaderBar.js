import React from 'react';
import { makeStyles, useTheme,fade } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';

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
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(5),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(0)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '35ch',
    },
  },
}))

export default function HeaderBar(props) {
  const theme = useTheme();
  const classes = useStyles(theme);

  function ValueLabelComponent(props) {
    const { children, open, value } = props;
  
    return (
      <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }

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
          Lifelog Retrieval
        </Typography>
        <Typography style={{display:'inline'}}>
          Num cols
        </Typography>
        <Slider
        value={props.cols}
        onChange={(e,v)=>props.setCols(v)}
        ValueLabelComponent={ValueLabelComponent}
        valueLabelDisplay="auto"
        step={1}
        // marks
        min={1}
        max={10}
        color='secondary'
        style={{width:100,marginLeft:10,marginRight:30}}
      />
        <Typography style={{display:'inline'}}>
          Num rows
        </Typography>
        <Slider
        value={props.rows}
        onChange={(e,v)=>props.setRows(v)}
        ValueLabelComponent={ValueLabelComponent}
        valueLabelDisplay="auto"
        step={1}
        // marks
        min={1}
        max={10}
        color='secondary'
        style={{width:100,marginLeft:10,marginRight:30}}
      />
        <Typography style={{display:'inline'}}>
          Session ID
        </Typography>
        <div className={classes.search}>
            <InputBase
              placeholder="Empty"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              value={props.sessionID}
              onChange={e=>{
                props.setSessionID(e.target.value);
                localStorage.setItem('sessionID',e.target.value);
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        <Button variant="outlined" color="inherit" onClick={props.handleOpenResults}>Show results</Button>

      </Toolbar>

    </AppBar>
  );
}

