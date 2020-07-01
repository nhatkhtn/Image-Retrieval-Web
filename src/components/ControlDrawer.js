import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepButton from '@material-ui/core/StepButton';
import FilteringBox from './FilteringBox'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles( theme => ({
  drawer: {
    width: props => props.drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: props => props.drawerWidth,
  },
  stepper: {
    width: '100%',
  },
  label:{
    textAlign:'left',
    whiteSpace:'break-spaces'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  hide: {
    display: 'none',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
}));


export default function ControlDrawer(props) {
  const classes = useStyles(props);

  function generateStepLabel(step) {
    if (!step.completed) {
      return 'Choose a filter method'
    }
    if (step.method === props.methods.caption) {
      return `Get ${step.content.numImages} images with caption "${step.content.caption}"`
    }
    else if (step.method === props.methods.locations) {
      return `Get images with location "${step.content.locations}"`
    }
    else if (step.method === props.methods.timeRange) {
      return `Get images taken from ${step.content.timeBegin} to ${step.content.timeEnd}`
    }
    else if (step.method === props.methods.timeBefore) {
      return `Get images taken before these images up to ${step. content.minutes} minutes`
    }
    else if (step.method === props.methods.similarImages) {
      return `Get images similar with image\n${step.content.image}`
    }
    else if (step.method === props.methods.adjacentImages) {
      return `Get images adjacent with image\n${step.content.image}`
    }
  }
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

      <div className={classes.stepper}>
        <Stepper nonLinear activeStep={props.activeStep} orientation="vertical">
          {props.steps.map((step, index) => (
            step.method === props.methods.similarImages || step.method===props.methods.adjacentImages ?
              (<Step key={index}>
                <StepButton onClick={() => props.setActiveStep(index)} className={classes.label}>
                  {generateStepLabel(step)}
                </StepButton>
                <StepContent>
                  <div className={classes.imageContainer}>
                    <img src={`/LSC_Thumbnail/${step.content.image}`} alt={step.content.image} />
                  </div>
                </StepContent>
              </Step>)
              :
              (<Step key={index}>
                <StepButton onClick={() => props.setActiveStep(index)}>
                  {generateStepLabel(step)}
                </StepButton>
                <StepContent>
                  <FilteringBox 
                    step={step}
                    methods={props.methods} 
                    handleFilter={props.handleFilter}
                    atFirstStep={index===0}
                    afterFilterLocations={index===1 && props.steps[0].method===props.methods.locations}
                    />
                </StepContent>
              </Step>)
          ))}
        </Stepper>

        <div className={clsx(classes.buttonContainer, { [classes.hide]: !props.steps[props.steps.length - 1].completed })}>
          <Fab variant="extended" color="primary"
            onClick={() => { props.addStep(props.activeStep) }} style={{verticalAlign:'middle'}}>
            <AddIcon />
            Continue Filtering
            </Fab>
        </div>
      </div>

    </Drawer>
  )
}
