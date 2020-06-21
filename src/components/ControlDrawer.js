import React, { useState, useEffect } from 'react';
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

const useStyles = makeStyles({
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
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  hide: {
    display: 'none',
  },
});


function generateStepLabel(step) {
  if (!step.completed) {
    return 'Choose a filter method'
  }
  if (step.method === 0) {
    return `Get ${step.content.numImages} images with caption "${step.content.caption}"`
  }
  else if (step.method === 1) {
    return `Get images with location "${step.content.locations}"`
  }
}

export default function ControlDrawer(props) {
  const classes = useStyles(props);

  // When click Continue Filtering, set new step active
  // Not so optimal
  useEffect(() => {
    if (!props.steps[props.steps.length - 1].completed) {
      props.setActiveStep(props.steps.length - 1)
    }
  },[props.steps.length])

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
            <Step key={index}>
              <StepButton onClick={()=>props.setActiveStep(index)}>
                {generateStepLabel(step)}
              </StepButton>
              <StepContent>
                <FilteringBox handleFilterOnThisStep={props.handleFilter(index)} />
              </StepContent>
            </Step>
          ))}
        </Stepper>

        <div className={clsx(classes.buttonContainer, { [classes.hide]: !props.steps[props.steps.length-1].completed })}>
          <Button variant="contained" color="primary"
            onClick={() => { props.addStep(props.activeStep) }}>
            Continue Filtering
            </Button>
        </div>
      </div>

    </Drawer>
  )
}
