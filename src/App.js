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

const filterByCaption = (caption) => {
  console.log(`Filter with caption ${caption}`)
  return [1, 2, 3]
}
const filterByLocations = (locations) => {
  console.log(`filter with locations ${locations}`)
  return [4, 5, 6]
}


class Stage {
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

  const [stages, setStages] = useState([new Stage()])
  const [imageList, setImageList] = useState(initialImageList)

  // Call when click Continue Filtering button
  const addStage = () => {
    setStages(stages => (update(stages, { $push: [new Stage()] })))
  }

  // Call when click Filter button of any method
  const handleFilter = (index) => (method) => {
    // Filter by Caption
    if (method === 0) {
      return (caption, numImages) => {
        const result = filterByCaption(caption)
        setStages(update(stages, {
          [index]: {
            completed: { $set: true, },
            method: { $set: method, },
            caption: { $set: caption, },
            numImages: { $set: numImages }
          },
          $splice: [[index + 1, stages.length - index - 1]]
        }))
      }
    }
    // Filter by Location
    else if (method === 1) {
      return (locations) => {
        const result = filterByLocations(locations)
        setStages(update(stages, {
          [index]: {
            completed: { $set: true, },
            method: { $set: method, },
            locations: { $set: locations, },
          },
          $splice: [[index + 1, stages.length - index - 1]]
        }))
      }
    }
  }

  const serverAddress = 'http://127.0.0.1:8000/server';

  const search = (caption) => {
    console.log(`search "${caption}"`)
    axios.get(`${serverAddress}/${caption}/LSC/cosine/30/0`)
      .then(res => { setImageList(res.data.image) })
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <HeaderBar handleClickMenuButton={handleToggleDrawer} />

      <ControlDrawer
        stages={stages}
        handleFilter={handleFilter}
        addStage={addStage}
        drawerOpen={open}
        drawerWidth={drawerWidth} />

      <ImageGrid
        imageList={imageList}
        drawerOpen={open}
        drawerWidth={drawerWidth} />

    </div>
  )
}