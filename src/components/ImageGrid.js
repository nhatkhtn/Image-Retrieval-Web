import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Toolbar from '@material-ui/core/Toolbar';
import Pagination from '@material-ui/lab/Pagination';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AdjacentImages from './AdjacentImages'
import Snackbar from '@material-ui/core/Snackbar';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const numImagesPerPageDrawerClose = 16;
const numImagesPerPageDrawerOpen = 24;
const colsDrawerClose=4;
const colsDrawerOpen=6;

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

  gridList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems:'center',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
imgFullWidth: {
  // top: '50%',
  // width: '100%',
  // position: 'relative',
  transform: 'translateY(0%)',//TODO: this is vertical centering
},
  image: {
    display: 'block',
    width: '100%',
    height: 'auto'
  },
  hide: {
    display: 'none',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  // TODO: make smooth transition when toggle drawer
  backdrop: {
    marginLeft:props => props.drawerOpen?props.drawerWidth:0,
    color:'#fff',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    zIndex: theme.zIndex.drawer - 1,
    marginTop: theme.mixins.toolbar.minHeight
  },
}));

const initialState = {
  mouseX: null,
  mouseY: null,
};

export default function ImageGrid(props) {
  const classes = useStyles(props);
  const [numImagesPerPage, setNumImagesPerPage] = useState(1)
  const [cols,setCols] = useState(1)
  const [showedImages, setShowedImages] = useState([])
  const [page, setPage] = useState(1)
  const handleChange = (event, value) => {
    setPage(value)
  }

  useEffect(() => {
    if (props.drawerOpen){
      setCols(colsDrawerClose);
      setNumImagesPerPage(numImagesPerPageDrawerClose);
    }
    else {
      setCols(colsDrawerOpen);
      setNumImagesPerPage(numImagesPerPageDrawerOpen);
    }
  }, [props.drawerOpen])

  useEffect(() => {
    setPage(1)
    setShowedImages(props.imageList.slice((page - 1) * numImagesPerPage, page * numImagesPerPage))
  }, [props.imageList, numImagesPerPage])

  useEffect(() => {
    setShowedImages(props.imageList.slice((page - 1) * numImagesPerPage, page * numImagesPerPage))
  }, [page])

  // Handle menu
  const [state, setState] = useState(initialState);
  const [selectedImage, setSelectedImage] = useState('')

  const handleClick = (image) => (event) => {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    setSelectedImage(image)
  };

  const handleClose = () => {
    setState(initialState);
  };

  const handleSearchSimilar = (image) => {
    handleClose();
    props.searchSimilarImages(image, 100)
  }

  // Handle explore adjacent images
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const handleDialogOpen = () => {
    setDialogOpen(true);

  };
  const handleDialogClose = () => {
    handleClose();
    setDialogOpen(false);
  };
  const handleAdjacentImages = (selectedImage) => {
    handleDialogOpen()
  }
  const handleAddImageToResults = (image) => {
    handleClose();
    const addingResult = props.addImageToResults(image);
    if (addingResult) {
      setMessage(`Add image ${selectedImage} to results.`)
    }
    else {
      setMessage(`Image ${selectedImage} is already in results.`)
    }
    handleOpenMessage();
  }
  
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState('');
  const handleCloseMessage = () => {
    setOpenMessage(false);
  }
  const handleOpenMessage = () => {
    setOpenMessage(true);
  }

  return (
    <div className={clsx(classes.content, {
      [classes.contentShift]: props.drawerOpen
    })}>
      <Toolbar />
      <div className={classes.paginationContainer}>
        <Pagination size="large" showFirstButton showLastButton
          count={Math.ceil(props.imageList.length / numImagesPerPage)}
          page={page} onChange={handleChange}
          className={clsx({ [classes.hide]: props.imageList.length === 0 })} />
      </div>
      <GridList cellHeight={'auto'} cols={cols} spacing={6} classes={{ root: classes.gridList }}>
        {showedImages.map((image) => (
          <GridListTile key={image} onClick={handleClick(image)} classes={{imgFullWidth:classes.imgFullWidth}} >
            <img src={`/LSC_Thumbnail/${image}`} alt={image} className={classes.image} />
          </GridListTile>
        ))}
      </GridList>

      <Menu
        keepMounted
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }>
        <MenuItem onClick={() => { handleSearchSimilar(selectedImage) }}>Search Similar Images</MenuItem>
        <MenuItem onClick={() => { handleAdjacentImages(selectedImage) }}>Explore Adjacent Images</MenuItem>
        <MenuItem onClick={() => { handleAddImageToResults(selectedImage) }}>Add to Results</MenuItem>
      </Menu>

      <AdjacentImages
        open={dialogOpen}
        handleClose={handleDialogClose}
        queryImage={selectedImage}
      />
      <Snackbar
        severity="info"
        anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
        open={openMessage}
        onClose={handleCloseMessage}
        message={message}
        autoHideDuration={6000}
      />

      <div className={classes.paginationContainer}>
        <Pagination size="large" showFirstButton showLastButton
          count={Math.ceil(props.imageList.length / numImagesPerPage)}
          page={page} onChange={handleChange}
          className={clsx({ [classes.hide]: props.imageList.length === 0 })} />
      </div>

      <Backdrop className={classes.backdrop} open={props.openBackdrop} >
        <CircularProgress color="inherit" />
      </Backdrop> 
    </div>
  );
}
