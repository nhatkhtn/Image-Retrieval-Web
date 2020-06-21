import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import HeaderBar from './components/HeaderBar'
import ImageGrid from './components/ImageGrid'
import ControlDrawer from './components/ControlDrawer';
import axios from 'axios';
import update from 'immutability-helper';

const drawerWidth = 500;
const initialImageList = []
const imageList = []

const serverAddress = 'http://127.0.0.1:8000/server';

const search = (caption) => {

}

// const filterByCaption = (caption) => {
//   console.log(`search "${caption}"`)
//   axios.get(`${serverAddress}/${caption}/LSC/cosine/30/0`)
//     .then(res => { setImageList(res.data.image) })
// }
const filterByLocations = (locations) => {
  console.log(`filter with locations ${locations}`)
  return [4, 5, 6]
}


class Step {
  constructor() {
    this.completed = false;
    this.result = [];
  }
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}));

export default function App() {
  const classes = useStyles();

  // Hook handle drawer open or close
  const [open, setOpen] = React.useState(true);
  const handleToggleDrawer = () => {
    setOpen(!open);
  }

  const [steps, setSteps] = useState([new Step()])
  // imageList of active step, that display in ImageGrid
  const [activeStep, setActiveStep] = useState(0)

  // Call when click Continue Filtering button
  const addStep = () => {
    setSteps(steps => (update(steps, { $push: [new Step()] })))
  }

  const updateSteps = (index, method, content, result) => {
    setSteps(update(steps, {
      [index]: {
        completed: { $set: true, },
        method: { $set: method, },
        content: { $set: content, },
        result: { $set: result }
      },
      $splice: [[index + 1, steps.length - index - 1]]
    }))
  }

  const filterByCaption = (index) => (caption, numImages) => {
    axios.get(`${serverAddress}/query_by_caption/${caption}/cosine/${numImages}`)
      .then(res => {
        updateSteps(index, 0, { caption: caption, numImages: numImages }, res.data.filenames)
      })
  }

  const filterByLocations = (index) => (locations) => {
    const locationString = locations.join("#")
    axios.get(`${serverAddress}/query_by_metadata/${locationString}`)
      .then(res => {
        updateSteps(index, 1, { locations: locations }, res.data.filenames)
      })
  }

  const filterByCaptionOnSubset = (index) => (caption, numImages) => {
    axios({
      method: 'POST',
      url: `${serverAddress}/query_by_caption_on_subset`,
      data: {
        subset: steps[index - 1].result,
        caption: caption,
        numImages: numImages
      }
    }).then(res => {
      updateSteps(index, 0, { caption: caption, numImages: numImages }, res.data.filenames)
    })
  }

  const filterByLocationsOnSubset = (index) => (locations) => {
    const locationString = locations.join("#")
    axios({
      method: 'POST',
      url: `${serverAddress}/query_by_metadata_on_subset`,
      data: {
        subset: steps[index - 1].result,
        locations: locationString
      }
    }).then(res => {
      updateSteps(index, 1, { locations: locations }, res.data.filenames)
    })
  }

  // Call when click Filter button of any method
  const handleFilter = (index) => (method) => {
    if (index === 0) {
      if (method === 0) {
        return filterByCaption(index)
      }
      else if (method === 1) {
        return filterByLocations(index)
      }
    }
    else {
      if (method === 0) {
        return filterByCaptionOnSubset(index)
      }
      else if (method === 1) {
        return filterByLocationsOnSubset(index)
      }
    }
  }

  const getActiveImageList = (activeStep) => {
    if (steps[activeStep].completed)
      return steps[activeStep].result;
    else {
      if (activeStep === 0)
        return initialImageList;
      else
        return steps[activeStep - 1].result;
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <HeaderBar handleClickMenuButton={handleToggleDrawer} />

      <ControlDrawer
        steps={steps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        handleFilter={handleFilter}
        addStep={addStep}
        drawerOpen={open}
        drawerWidth={drawerWidth} />

      <ImageGrid
        imageList={getActiveImageList(activeStep)}
        drawerOpen={open}
        drawerWidth={drawerWidth} />

    </div>
  )
}