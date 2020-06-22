import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Toolbar from '@material-ui/core/Toolbar';
import Pagination from '@material-ui/lab/Pagination';

const numImagesPerPage = 12;

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: props => -props.drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: props => 0,
  },

  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  hide: {
    display: 'none',
  }
}));

export default function ImageGrid(props) {
  const classes = useStyles(props);
  const [showedImages, setShowedImages] = useState([])
  // setShowedImages(['2015-02-23/b00000001_21i6bq_20150223_070808e.jpg', '2015-02-23/b00000002_21i6bq_20150223_070809e.jpg'])
  const [page, setPage] = useState(1)
  const handleChange = (event, value) => {
    setPage(value)
  }

  useEffect(()=>{
    setPage(1)
    setShowedImages(props.imageList.slice((page-1)*numImagesPerPage, page*numImagesPerPage))
  },[props.imageList])

  useEffect(()=>{
    setShowedImages(props.imageList.slice((page-1)*numImagesPerPage, page*numImagesPerPage))
  },[page])

  return (
    <div className={clsx(classes.content, {
      [classes.contentShift]: props.drawerOpen})}>
      <Toolbar />
      <Pagination size="large" showFirstButton showLastButton
        count={Math.ceil(props.imageList.length/numImagesPerPage)} 
        page={page} onChange={handleChange}
        className={clsx({[classes.hide]: props.imageList.length===0})}/>

      <div className={classes.root}>
        <GridList cellHeight={'auto'} className={classes.gridList} cols={0}>
          {showedImages.map((image) => (
            <GridListTile key={image} >
              <img src={`/LSC_Thumbnail/${image}`} alt={image}/>
            </GridListTile>
          ))}
        </GridList>
      </div>

      <Pagination size="large" showFirstButton showLastButton
        count={Math.ceil(props.imageList.length/numImagesPerPage)} 
        page={page} onChange={handleChange}
        className={clsx({[classes.hide]: props.imageList.length===0})}/>
        
    </div>
  );
}
