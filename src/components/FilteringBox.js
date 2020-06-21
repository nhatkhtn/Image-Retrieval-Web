// Box to choose between different filter methods
import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LocationsFiltering from './LocationsFiltering';
import TabPanel from './TabPanel';
import SwipeableViews from 'react-swipeable-views';
import CaptionFiltering from './CaptionFiltering';

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

export default function FilteringBox(props) {
  const classes = useStyles();
  const theme = useTheme();

  // hook for active tab
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
          <Tab label="Caption" {...a11yProps(0)} className={classes.tab} />
          <Tab label="Locations" {...a11yProps(1)} className={classes.tab} />
          <Tab label="Time" {...a11yProps(2)} className={classes.tab} />
        </Tabs>
      </AppBar>

      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}>
        <TabPanel value={value} index={0} className={classes.tabPanel}>
          <CaptionFiltering clickFilter={props.handleFilterOnThisStage(0)} />
        </TabPanel>
        <TabPanel value={value} index={1} className={classes.tabPanel}>
          <LocationsFiltering clickFilter={props.handleFilterOnThisStage(1)} />
        </TabPanel>
        <TabPanel value={value} index={2} className={classes.tabPanel}>
          Enter time range
        </TabPanel>
      </SwipeableViews>

    </div >
  );
}
