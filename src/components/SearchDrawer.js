import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepButton from '@material-ui/core/StepButton';
import QueryBox from './QueryBox'

const useStyles = makeStyles({
  drawer: {
    width: props => props.drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: props => props.drawerWidth,
  },
  hide: {
    display: 'none',
  },
  stepper: {
    width: '100%',
  },
});


function generateStageLabel(stage) {
  if (!stage.completed) {
    return 'Choose a query method'
  }
  if (stage.method === 0) {
    return `Get ${stage.numImages} images with query "${stage.query}"`
  }
  else if (stage.method === 1) {
    return `Get images with labels "${stage.labels}"`
  }
}
export default function SearchDrawer(props) {
  const classes = useStyles(props);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

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
                <QueryBox makeQueryOnStage={props.makeQuery(index)} />
              </StepContent>
            </Step>
          ))}
        </Stepper>
        <Grid container justify="center" className={clsx({ [classes.hide]: !props.stages[activeStep].completed })}>
          <div>
            <Button variant="contained" color="primary"
              onClick={() => { props.addStage(activeStep) }}>
              Filter with this result
            </Button>
          </div>
        </Grid>
      </div>

    </Drawer>
  )
}
