import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ImageGridList from './Grid'
import ClippedDrawer from './Drawer';
import image from './image.jpg';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
  }));

export default function App() {
  const classes = useStyles();
  console.log(image)
    return (
        <div className={classes.root}>
            <ClippedDrawer/>
            <ImageGridList />
        </div>
    )
}