import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ImageGridList from './Grid'
import SearchPanel from './Drawer';
import image from './image.jpg';
import axios from "axios";


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
  }));
  // class App extends React.Component {
  //   return (
  //     //         <div className={classes.root}>
  //     //             <ClippedDrawer/>
  //     //             <ImageGridList />
  //     //         </div>
  //     //     )
  // }
export default function App() {
  const classes = useStyles();
  // console.log(image)
  
  // useEffect(() => {

  //   axios.get('http://127.0.0.1:8000/server/windows/LSC/cosine/10/0')
  //   .then(res => {console.log(res)})
  // });
  const [imageList, setImageList] = useState([]);

  const serverAddress = 'http://127.0.0.1:8000/server';

  const search = (query) => {
    console.log(`search "${query}"`)
    axios.get(`${serverAddress}/${query}/LSC/cosine/30/0`)
    .then(res => {setImageList(res.data.image)})
  }
  return (
        <div className={classes.root}>
            <SearchPanel clickSearch={query =>search(query)}/>
            <ImageGridList imageList={imageList}/>
        </div>
    )
}