import React, { useState, useEffect } from 'react';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import HeaderBar from './components/HeaderBar'
import ImageGrid from './components/ImageGrid'
import ControlDrawer from './components/ControlDrawer';
import axios from 'axios';
import update from 'immutability-helper';
import Results from './components/Results';
import { parse as parseCSV } from 'papaparse';

const drawerWidth = 500;

class Step {
  constructor(completed = false, method = null, content = {}, result = []) {
    this.completed = completed;
    this.method = method;
    this.content = content;
    this.result = result;
  }
}


const theme = createMuiTheme({
  palette: {
    // primary: {
    //   main: '#0055b8',
    // },
  },
});

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}));

export default function App() {
  const classes = useStyles();

  // Hook handle drawer open or close
  const [openDrawer, setOpenDrawer] = React.useState(true);
  const handleToggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  }

  ///////////////////////////////////////////////////////////////////

  // Hook handle steps
  const [steps, setSteps] = useState([new Step()])
  const [activeStep, setActiveStep] = useState(0)

  // When click Continue Filtering, set new step active
  // Not so optimal
  useEffect(() => {
    setActiveStep(steps.length - 1)
  }, [steps])

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

  const getActiveImageList = () => {
    if (activeStep === 0 || steps[activeStep].completed)
      return steps[activeStep].result;
    else {
      return steps[activeStep - 1].result;
    }
  }

  ///////////////////////////////////////////////////////////////////////
  // Handle loading indicator in image grid
  // TODO: each stage a loading state
  // TODO: display query fail message
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [error, setError] = useState(false);

  const withLoading = (query_fn) => (...params) => {
    setOpenBackdrop(true);
    query_fn(...params)
      .then(() => { setOpenBackdrop(false);})
      .catch((error)=>{setError(error);console.log(error)})
  }

  ////////////////////////////////////////////////////////////////////////////
  // All the query methods

  // TODO: set this variable global
  const methods = {
    caption: 0,
    locations: 1,
    timeRange: 2,
    timeBefore: 3,
    similarImages: 4,
    adjacentImages: 5,
  }

  const filterByCaption = (caption, numImages) => {
    return new Promise((resolve)=>{setTimeout(resolve,5000)}).then(()=>
    axios.get(`/server/query_by_caption/${caption}/cosine/${numImages}`))
      .then(res => {
        updateSteps(activeStep, methods.caption, { caption: caption, numImages: numImages }, res.data.filenames)
      })
  }

  const filterByLocations = (locations) => {
    const locationString = locations.join("|")
    return new Promise((resolve)=>{setTimeout(resolve,5000)}).then(()=>
    axios.get(`/server/query_by_metadata/${locationString}`))
      .then(res => {
        updateSteps(activeStep, methods.locations, { locations: locations }, res.data.filenames)
      })
  }

  const filterByCaptionOnSubset = (caption, numImages) => {
    return new Promise((resolve)=>{setTimeout(resolve,5000)}).then(()=>
    axios.post(`/server/query_by_caption_on_subset`, {
      subset: steps[activeStep - 1].result,
      caption: caption,
      numImages: numImages
    }))
      .then(res => {
        updateSteps(activeStep, methods.caption, { caption: caption, numImages: numImages }, res.data.filenames)
      })
  }

  const filterByLocationsOnSubset = (locations) => {
    const locationString = locations.join("|")
    return axios.post(`/server/query_by_metadata_on_subset`, {
      subset: steps[activeStep - 1].result,
      locations: locationString
    })
      .then(res => {
        updateSteps(activeStep, methods.locations, { locations: locations }, res.data.filenames)
      })
  }

  const filterByTimeRangeOnSubset = (timeBegin, timeEnd) => {
    return axios.post(`/server/query_by_time_range_on_subset`, {
      subset: steps[activeStep - 1].result,
      timeBegin: timeBegin,
      timeEnd: timeEnd,
    })
      .then(res => {
        updateSteps(activeStep, methods.timeRange, { timeBegin: timeBegin, timeEnd: timeEnd }, res.data.filenames)
      })
  }

  const queryImagesBefore = (minutes) => {
    return axios.post(`/server/query_images_before`, {
      subset: steps[activeStep - 1].result,
      minutes: minutes
    })
      .then(res => {
        updateSteps(activeStep, methods.timeBefore, { minutes: minutes }, res.data.filenames)
      })
  }

  // Call when click Filter button of any method
  const handleFilter = (method) => {
    if (activeStep === 0) {
      if (method === methods.caption) {
        return withLoading(filterByCaption)
      }
      else if (method === methods.locations) {
        return withLoading(filterByLocations)
      }
    }
    else {
      if (method === methods.caption) {
        return withLoading(filterByCaptionOnSubset)
      }
      else if (method === methods.locations) {
        return withLoading(filterByLocationsOnSubset)
      }
      else if (method === methods.timeRange) {
        return withLoading(filterByTimeRangeOnSubset)
      }
      else if (method === methods.timeBefore) {
        return withLoading(queryImagesBefore)
      }
    }
  }

  const searchSimilarImages = (image, numImages = 200, adjacentImage='') => {
    const path = image.split('/')
    return new Promise((resolve)=>{setTimeout(resolve,5000)}).then(()=>
    axios.get(`/server/query_similar_images/${path[0]}&${path[1]}/${numImages}`))
      .then(res => {
        setSteps(update(steps, {
          $splice: [steps[activeStep].completed ? [activeStep + 1, steps.length - activeStep - 1]:[activeStep,steps.length-activeStep]],
          $push:// [new Step(true,methods.adjacentImages,{ image: adjacentImage},[]),
            [new Step(
            true,
            methods.similarImages,
            { image: image, numImages: numImages },
            res.data.filenames)]
        }))
      })
  }

  const searchAdjacentImages = (image, numAdjacentImages = 22) => {
    const folder_name = image.split('/')[0]
    return fetch(`LSC_filename/${folder_name}.csv`)
      .then((r) => r.text())
      .then((data) => {
        const filenames = parseCSV(data).data.slice(1).map((e)=>e[1])
        const indexInFile = filenames.findIndex((e) => (e === image))
        const startIndex = Math.max(indexInFile - numAdjacentImages, 0)
        const endIndex = Math.min(indexInFile + numAdjacentImages +1, filenames.length)
        const adjacentImages = filenames.slice(startIndex, endIndex )
        const indexInAdjacentImages = adjacentImages.findIndex((e) => e === image)

        return [adjacentImages, indexInAdjacentImages, filenames, startIndex, endIndex]
      })
  }

  //////////////////////////////////////////////////////////////////////////

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


  return (
    <ThemeProvider theme={theme}>
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
        drawerOpen={openDrawer}
        drawerWidth={drawerWidth}
        methods={methods} />

      <ImageGrid
        drawerOpen={openDrawer}
        drawerWidth={drawerWidth}
        imageList={getActiveImageList()}
        searchSimilarImages={withLoading(searchSimilarImages)}
        searchAdjacentImages={searchAdjacentImages}
        addImageToResults={addImageToResults}
        openBackdrop={openBackdrop}
        error={error} />

      <Results
        results={results}
        setResults={setResults}
        openResults={openResults}
        handleCloseResults={handleCloseResults} />

    </div>
    </ThemeProvider>
  )
}