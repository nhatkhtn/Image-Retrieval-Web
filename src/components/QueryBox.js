import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SemanticLabels from './SemanticLabels';
import TabPanel from './TabPanel';
import SwipeableViews from 'react-swipeable-views';
import QuerySentence from './QuerySentence';

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
  tab: {
    minWidth: 20,
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  box: {
    // padding:'12px',
  },
  search: {
    margin: '20px 0px 20px 0px',
  }
}));

export default function QueryTabs(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  return (
    <div className={classes.root}>

      <AppBar position="static" color="default">
        <Tabs value={value}
          onChange={handleChange}
          aria-label=" tabs example"
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary" >
          <Tab label="Query sentence" {...a11yProps(0)} className={classes.tab} />
          <Tab label="Semantic labels" {...a11yProps(1)} className={classes.tab} />
          <Tab label="Time constraints" {...a11yProps(2)} className={classes.tab} />
        </Tabs>
      </AppBar>

      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}>
          <TabPanel value={value} index={0} className={classes.tabPanel}>
            <QuerySentence clickSearch = {props.makeQueryOnStage(0)}/>
          </TabPanel>
          <TabPanel value={value} index={1} className={classes.tabPanel}>
            <SemanticLabels clickFilter = {props.makeQueryOnStage(1)}/>
          </TabPanel>
          <TabPanel value={value} index={2} className={classes.tabPanel}>
            Enter time range
          </TabPanel>
      </SwipeableViews>

    </div >
  );
}
