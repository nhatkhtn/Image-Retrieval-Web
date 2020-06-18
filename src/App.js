import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import HeaderBar from './components/HeaderBar'
import ImageGridList from './components/ImageGrid'
import SearchDrawer from './components/SearchDrawer';
import axios from 'axios';

const drawerWidth = 400;

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}));

const initialImageList = [
  '2018-05-04/B00003970_21I6X0_20180504_105327E.JPG',
  '2018-05-04/B00005345_21I6X0_20180504_203125E.JPG',
  '2018-05-04/B00005510_21I6X0_20180504_221253E.JPG',
  '2018-05-04/B00003737_21I6X0_20180504_090920E.JPG',
  '2018-05-04/B00003868_21I6X0_20180504_100827E.JPG',
  '2018-05-04/B00005239_21I6X0_20180504_194455E.JPG',
  '2018-05-04/B00004905_21I6X0_20180504_172026E.JPG',
  '2018-05-04/B00005376_21I6X0_20180504_204551E.JPG',
  '2018-05-04/B00005074_21I6X0_20180504_183544E.JPG',
  '2018-05-04/B00005496_21I6X0_20180504_220508E.JPG',
  '2018-05-04/B00005613_21I6X0_20180504_230509E.JPG',
  '2018-05-04/B00003986_21I6X0_20180504_105934E.JPG',
  '2018-05-04/B00004717_21I6X0_20180504_160618E.JPG',
  '2018-05-04/B00005032_21I6X0_20180504_181105E.JPG',
  '2018-05-04/B00004306_21I6X0_20180504_131435E.JPG',
  '2018-05-04/B00003746_21I6X0_20180504_091250E.JPG',
  '2018-05-04/B00004183_21I6X0_20180504_122057E.JPG',
  '2018-05-04/B00003683_21I6X0_20180504_084605E.JPG',
  '2018-05-04/B00003503_21I6X0_20180504_073334E.JPG',
  '2018-05-04/B00005036_21I6X0_20180504_181237E.JPG',
  '2018-05-04/B00005609_21I6X0_20180504_230252E.JPG',
  '2018-05-04/B00003562_21I6X0_20180504_075353E.JPG',
  '2018-05-04/B00003571_21I6X0_20180504_075726E.JPG',
  '2018-05-04/B00004929_21I6X0_20180504_173020E.JPG',
  '2018-05-04/B00005246_21I6X0_20180504_194739E.JPG',
  '2018-05-04/B00003669_21I6X0_20180504_084013E.JPG',
  '2018-05-04/B00004196_21I6X0_20180504_122718E.JPG',
  '2018-05-04/B00005265_21I6X0_20180504_195522E.JPG',
  '2018-05-04/B00005707_21I6X0_20180504_235358E.JPG',
  '2018-05-04/B00005172_21I6X0_20180504_191609E.JPG',]

export default function App() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const handleToggleDrawer = () => {
    setOpen(!open);
  }

  const [imageList, setImageList] = useState(initialImageList)

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
      <SearchDrawer clickSearch={query => search(query)}  drawerOpen={open} drawerWidth={drawerWidth}/>
      <ImageGridList imageList={imageList} drawerOpen={open} drawerWidth={drawerWidth}/>
    </div>
  )
}