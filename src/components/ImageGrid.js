import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Toolbar from '@material-ui/core/Toolbar';
import Pagination from '@material-ui/lab/Pagination';
import AdjacentImages from './AdjacentImages'
import Snackbar from '@material-ui/core/Snackbar';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import PopoverCard from './PopoverCard';

const colsDrawerClose = 4;
const colsDrawerOpen = 6;
const numImagesPerPageDrawerClose = 16;
const numImagesPerPageDrawerOpen = 24;

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
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
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
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
    justifyContent: 'center',
    margin:10,
  },
  // TODO: make smooth transition when toggle drawer
  backdrop: {
    marginLeft: props => props.drawerOpen ? props.drawerWidth : 0,
    color: '#fff',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    zIndex: theme.zIndex.drawer - 1,
    marginTop: theme.mixins.toolbar.minHeight
  },
  
}));


export default function ImageGrid(props) {
  const classes = useStyles(props);

  const [showedImages, setShowedImages] = useState([])
  const [numImagesPerPage, setNumImagesPerPage] = useState(1)
  const [cols, setCols] = useState(1)
  const [page, setPage] = useState(1)
  const handleChangePage = (event, value) => {
    setPage(value)
  }

  useEffect(() => {
    if (props.drawerOpen) {
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

  ///////////////////////////////////////////////////////////////////////
  const [selectedImage, setSelectedImage] = useState('');

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (image) => (event) => {
    setAnchorEl(event.currentTarget);
    setSelectedImage(image)
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  const openPopover = Boolean(anchorEl);

  /////////////////////////////////////////////////////////////////////////
  const handleSearchSimilar = (image) => {
    handleClosePopover();
    props.searchSimilarImages(image)
  }


  // Handle explore adjacent images
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleAdjacentImages = (selectedImage) => {
    // handleClosePopover();
    handleOpenDialog()
  }



  const handleAddImageToResults = (image) => {
    // handleClosePopover();
    const addingResult = props.addImageToResults(image);
    if (addingResult) {
      setMessage(`Add image ${image} to results.`)
    }
    else {
      setMessage(`Image ${image} is already in results.`)
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
          page={page} onChange={handleChangePage}
          className={clsx({ [classes.hide]: props.imageList.length === 0 })} />
      </div>

      <GridList cellHeight={'auto'} cols={cols} spacing={6} classes={{ root: classes.gridList }}>
        {showedImages.map((image) => (
          <GridListTile key={image} onClick={handleClick(image)} >
            <img src={`/LSC_Thumbnail/${image}`} alt={image} className={classes.image} />
          </GridListTile>
        ))}
      </GridList>

      <div className={classes.paginationContainer}>
        <Pagination size="large" showFirstButton showLastButton
          count={Math.ceil(props.imageList.length / numImagesPerPage)}
          page={page} onChange={handleChangePage}
          className={clsx({ [classes.hide]: props.imageList.length === 0 })} />
      </div>

      <PopoverCard
        open={openPopover}
        anchorEl={anchorEl}
        handleClose={handleClosePopover}
        selectedImage={selectedImage}
        handleSearchSimilar={handleSearchSimilar}
        handleAdjacentImages={handleAdjacentImages}
        handleAddImageToResults={handleAddImageToResults}
      />

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openMessage}
        onClose={handleCloseMessage}
        message={message}
        autoHideDuration={6000}
      />

      <AdjacentImages
        open={openDialog}
        handleClose={handleCloseDialog}
        queryImage={selectedImage}
        searchAdjacentImages={props.searchAdjacentImages}
        handleAddImageToResults={handleAddImageToResults}
        handleSearchSimilar={handleSearchSimilar}
      />

      <Backdrop classes={{ root: classes.backdrop }} open={props.openBackdrop} >
        <CircularProgress color="inherit" />
      </Backdrop>

    </div>
  );
}
