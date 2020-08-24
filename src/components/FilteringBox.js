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
import TimeFiltering from './TimeFiltering';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

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
    boxShadow:'0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    padding:'10px 4px'
  },
  appbar: {
    // boxShadow:'0 0 0 0 rgba(0,0,0,0)',
  },
  tab: {
    minWidth: 20,
    fontSize: '0.875rem',
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
  const [value, setValue] = React.useState(
    props.step.method===props.methods.timeBefore?
    props.methods.timeRange:(props.step.method || props.methods.caption));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>

      {/* <AppBar position="static" color='default' className={classes.appbar}>
        <Tabs value={value}
          onChange={handleChange}
          aria-label=" tabs example"
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary" 
          >
          <Tab label={<div><FormatQuoteIcon fontSize='small' style={{verticalAlign: 'middle'}} /> Text</div>} {...a11yProps(0)} className={classes.tab} />
          <Tab label={<div><LocationOnIcon fontSize='small' style={{verticalAlign: 'middle'}}/> Locations</div>} {...a11yProps(1)} className={classes.tab} />
          <Tab label={<div><AccessTimeIcon fontSize='small' style={{verticalAlign: 'middle'}} /> Time</div>} {...a11yProps(2)} className={classes.tab} />
        </Tabs>
      </AppBar> */}
      
      {/* <div className={classes.box}> */}
      {/* <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}>
        <TabPanel value={value} index={0} className={classes.tabPanel}> */}
          <CaptionFiltering 
            caption={props.step.content.caption || ''}
            clickFilter={props.handleFilter(props.methods.caption)} 
            loading={props.loading} />
        {/* </TabPanel>
        <TabPanel value={value} index={1} className={classes.tabPanel}>
          <LocationsFiltering 
            locations = {props.step.content.locations || []}
            clickFilter={props.handleFilter(props.methods.locations)}
            loading={props.loading} />
        </TabPanel>
        <TabPanel value={value} index={2} className={classes.tabPanel}>
          <TimeFiltering
            step={props.step}
            clickFilter={props.handleFilter} 
            methods={props.methods}
            atFirstStep={props.atFirstStep}
            enableTimeBefore={props.afterFilterLocations}
            loading={props.loading} 
            />
        </TabPanel>
      </SwipeableViews> */}
      {/* </div> */}
    </div >
  );
}
