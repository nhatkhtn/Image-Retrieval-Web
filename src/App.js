import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import HeaderBar from './components/HeaderBar'
import ImageGrid from './components/ImageGrid'
import ControlDrawer from './components/ControlDrawer';
import axios from 'axios';
import update from 'immutability-helper';
import Results from './components/Results';

const drawerWidth = 500;
const initialImageList = []

const serverAddress = 'http://127.0.0.1:8000/server';

class Step {
  constructor(completed = false, method = null, content = {}, result = []) {
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

  // TODO: set this variable global
  const methods = {
    caption: 0,
    locations: 1,
    timeRange: 2,
    timeBefore: 3,
    similarImages: 4,
    adjacentImages: 5,
  }

  const filterByCaption = (index) => (caption, numImages) => {
    return axios.get(`${serverAddress}/query_by_caption/${caption}/cosine/${numImages}`)
      .then(res => {
        updateSteps(index, methods.caption, { caption: caption, numImages: numImages }, res.data.filenames)
      })
}

const filterByLocations = (index) => (locations) => {
  const locationString = locations.join("|")
  return axios.get(`${serverAddress}/query_by_metadata/${locationString}`)
    .then(res => {
      updateSteps(index, methods.locations, { locations: locations }, res.data.filenames)
    })
}

const filterByCaptionOnSubset = (index) => (caption, numImages) => {
  return axios({
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
  const locationString = locations.join("|")
  return axios({
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

const filterByTimeRangeOnSubset = (index) => (timeBegin, timeEnd) => {
  return axios({
    method: 'POST',
    url: `${serverAddress}/query_by_time_range_on_subset`,
    data: {
      subset: steps[index - 1].result,
      timeBegin: timeBegin,
      timeEnd: timeEnd,
    }
  }).then(res => {
    updateSteps(index, methods.timeRange, { timeBegin: timeBegin, timeEnd: timeEnd }, res.data.filenames)
  })
}

const queryImagesBefore = (index) => (minutes) => {
  return axios({
    method: 'POST',
    url: `${serverAddress}/query_images_before`,
    data: {
      subset: steps[index - 1].result,
      minutes: minutes
    }
  }).then(res => {
    updateSteps(index, methods.timeBefore, { minutes: minutes }, res.data.filenames)
  })
}
// Call when click Filter button of any method
const handleFilter = (index) => (method) => {
  if (index === 0) {
    if (method === methods.caption) {
      return withLoading(filterByCaption)(index)
    }
    else if (method === methods.locations) {
      return withLoading(filterByLocations)(index)
    }
  }
  else {
    if (method === methods.caption) {
      return withLoading(filterByCaptionOnSubset)(index)
    }
    else if (method === methods.locations) {
      return withLoading(filterByLocationsOnSubset)(index)
    }
    else if (method === methods.timeRange) {
      return withLoading(filterByTimeRangeOnSubset)(index)
    }
    else if (method === methods.timeBefore) {
      return withLoading(queryImagesBefore)(index)
    }
  }
}

const searchSimilarImages = (image, numImages = 100) => {
  const path = image.split('/')
  return axios.get(`${serverAddress}/query_similar_images/${path[0]}&${path[1]}/${numImages}`)
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

// Handle results page
const [results, setResults] = useState([]);
const [openResults, setOpenResults] = useState(false);
const addImageToResults = (image) => {
  if (!results.includes(image)) {
    setResults(update(results, {
      $push: [image]
    }))
    return true;
  }
  else {
    return false;
  }
}
const handleOpenResults = () => {
  setOpenResults(true);
}
const handleCloseResults = () => {
  setOpenResults(false);
}

// TODO: each stage a loading state
// Handle loading image grid
const [openBackdrop, setOpenBackdrop] = useState(false);
const withLoading = (query_fn) => (index) => (...params) => {
  setOpenBackdrop(true);
  query_fn(index)(...params)
  .then(()=>{setOpenBackdrop(false);})
}
const withLoadingSearchSimilarImages = (...params) => {
  setOpenBackdrop(true);
  searchSimilarImages(...params)
  .then(()=>{setOpenBackdrop(false);})
}
return (
  <div className={classes.root}>
    <CssBaseline />
    <HeaderBar
      handleClickMenuButton={handleToggleDrawer}
      handleOpenResults={handleOpenResults} />

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
      openBackdrop={openBackdrop}
      imageList={getActiveImageList(activeStep)}
      searchSimilarImages={withLoadingSearchSimilarImages}
      addImageToResults={addImageToResults}
      drawerOpen={open}
      drawerWidth={drawerWidth} />

    <Results
      results={results}
      openResults={openResults}
      handleCloseResults={handleCloseResults}
      setOpenResuts={setOpenResults} />

  </div>
)
}