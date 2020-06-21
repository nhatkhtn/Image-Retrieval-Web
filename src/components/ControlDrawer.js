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


function generateStageLabel(stage) {
  if (!stage.completed) {
    return 'Choose a filter method'
  }
  if (stage.method === 0) {
    return `Get ${stage.numImages} images with caption "${stage.caption}"`
  }
  else if (stage.method === 1) {
    return `Get images with location "${stage.locations}"`
  }
}

export default function ControlDrawer(props) {
  const classes = useStyles(props);

  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  // When click Continue Filtering, set new stage active
  // Not so optimal
  useEffect(() => {
    if (!props.stages[props.stages.length - 1].completed) {
      setActiveStep(props.stages.length - 1)
    }
  })

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
        <Stepper nonLinear activeStep={activeStep} orientation="vertical">
          {props.stages.map((stage, index) => (
            <Step key={index}>
              <StepButton onClick={handleStep(index)}>
                {generateStageLabel(stage)}
              </StepButton>
              <StepContent>
                <FilteringBox handleFilterOnThisStage={props.handleFilter(index)} />
              </StepContent>
            </Step>
          ))}
        </Stepper>

        <div className={clsx(classes.buttonContainer, { [classes.hide]: !props.stages[activeStep].completed })}>
          <Button variant="contained" color="primary"
            onClick={() => { props.addStage(activeStep) }}>
            Continue Filtering
            </Button>
        </div>
      </div>

    </Drawer>
  )
}
