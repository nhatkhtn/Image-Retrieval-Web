import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import HeaderBar from './components/HeaderBar'
import ImageGrid from './components/ImageGrid'
import ControlDrawer from './components/ControlDrawer';
import axios from 'axios';
import update from 'immutability-helper';

const drawerWidth = 500;
const initialImageList = []

const serverAddress = 'http://127.0.0.1:8000/server';

class Step {
  constructor(completed = false, method = '', content = {}, result = []) {
    this.completed = completed;
    this.method = method;
    this.content = content;
    this.result = result;
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

  // When click Continue Filtering, set new step active
  // Not so optimal
  useEffect(() => {
    setActiveStep(steps.length - 1)
  }, [steps])

  const methods = {
    caption: 0,
    locations: 1,
    time: 2,
    similarImages: 3,
    nearbyImages: 4,
  }

  const filterByCaption = (index) => (caption, numImages) => {
    axios.get(`${serverAddress}/query_by_caption/${caption}/cosine/${numImages}`)
      .then(res => {
        updateSteps(index, methods.caption, { caption: caption, numImages: numImages }, res.data.filenames)
      })
  }

  const filterByLocations = (index) => (locations) => {
    const locationString = locations.join("&")
    axios.get(`${serverAddress}/query_by_metadata/${locationString}`)
      .then(res => {
        updateSteps(index, methods.locations, { locations: locations }, res.data.filenames)
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
      updateSteps(index, methods.caption, { caption: caption, numImages: numImages }, res.data.filenames)
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
      updateSteps(index, methods.locations, { locations: locations }, res.data.filenames)
    })
  }

  // Call when click Filter button of any method
  const handleFilter = (index) => (method) => {
    if (index === 0) {
      if (method === methods.caption) {
        return filterByCaption(index)
      }
      else if (method === methods.locations) {
        return filterByLocations(index)
      }
    }
    else {
      if (method === methods.caption) {
        return filterByCaptionOnSubset(index)
      }
      else if (method === methods.locations) {
        return filterByLocationsOnSubset(index)
      }
    }
  }

  const searchSimilarImages = (image, numImages = 100) => {
    const path = image.split('/')
    axios.get(`${serverAddress}/query_similar_images/${path[0]}&${path[1]}/${numImages}`)
      .then(res => {
        setSteps(update(steps, {
          $splice: [[steps[activeStep].completed ? activeStep + 1 : activeStep, steps.length - activeStep - 1]],
          $push: [new Step(
            true,
            methods.similarImages,
            { image: image, numImages: numImages },
            res.data.filenames)]
        }))
      })
  }
  const getActiveImageList = (activeStep) => {
    if (activeStep === 0 || steps[activeStep].completed)
      return steps[activeStep].result;
    else {
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
        drawerWidth={drawerWidth}
        methods={methods} />

      <ImageGrid
        imageList={getActiveImageList(activeStep)}
        searchSimilarImages={searchSimilarImages}
        drawerOpen={open}
        drawerWidth={drawerWidth}/>

    </div>
  )
}