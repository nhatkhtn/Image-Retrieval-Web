import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import HeaderBar from './components/HeaderBar'
import ImageGridList from './components/ImageGrid'
import SearchDrawer from './components/SearchDrawer';
import axios from 'axios';
import update from 'immutability-helper';

const drawerWidth = 450;

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}));

const initialImageList = []

class Stage {
  constructor() {
    this.completed = false;
    this.result = [];
  }
}


const queryWithQuerySentence = (query) => {
  console.log(`make query with sentence ${query}`)
  return [1, 2, 3]
}
const queryWithSemanticLabels = (labels) => {
  console.log(`filter with labels ${labels}`)
  return [4, 5, 6]
}

export default function App() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const handleToggleDrawer = () => {
    setOpen(!open);
  }

  const [stages, setStages] = useState([new Stage()])
  const [imageList, setImageList] = useState(initialImageList)


  const addStage = () => {
    setStages(stages => ([...stages, new Stage()]))
  }
  const makeQuery = (index) => {
    return (method) => {
      if (method === 0) {
        return (query,numImages) => {
          const queryResult = queryWithQuerySentence(query)
          setStages(update(stages, {
            [index]: {
              completed: { $set: true, },
              method: { $set: method, },
              query: { $set: query, },
              numImages: { $set: numImages }
            },
            $splice:[[index+1,stages.length-index-1]]}))
        }
      }
      else if (method === 1) {
        return (labels) => {
          const queryResult = queryWithSemanticLabels(labels)
          setStages(update(stages, {
            [index]: {
              completed: { $set: true, },
              method: { $set: method, },
              labels: { $set: labels, },
            },
            $splice:[[index+1,stages.length-index-1]]}))
        }
      }
    }
  }


  const serverAddress = 'http://127.0.0.1:8000/server';

  const search = (query) => {
    console.log(`search "${query}"`)
    axios.get(`${serverAddress}/${query}/LSC/cosine/30/0`)
      .then(res => { setImageList(res.data.image) })
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <HeaderBar handleClickMenuBotton={handleToggleDrawer} />

      <SearchDrawer
        stages={stages}
        makeQuery={makeQuery}
        addStage={addStage}
        drawerOpen={open}
        drawerWidth={drawerWidth} />

      <ImageGridList
        imageList={imageList}
        drawerOpen={open}
        drawerWidth={drawerWidth} />

    </div>
  )
}