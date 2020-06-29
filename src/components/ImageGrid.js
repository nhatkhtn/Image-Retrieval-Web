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
import Popover from '@material-ui/core/Popover';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
const colsDrawerClose = 4;
const colsDrawerOpen = 6;
const numImagesPerPageDrawerClose = 16;
const numImagesPerPageDrawerOpen = 24;

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
    justifyContent: 'center'
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
  root: {
    width: 400,
  },
  media: {
    height: 300,
  },
  cardHeader: {
    padding:10,
    textAlign:'center'
  },
  title: {
    fontSize: 13
  },
  searchButton: {
    fontWeight:600,
  }
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
    handleClosePopover();
    handleOpenDialog()
  }


  const handleAddImageToResults = (image) => {
    handleClosePopover();
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

      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        disableScrollLock={ true }
        BackdropProps={{ invisible: false, classes:{root:classes.backdrop} }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <Card className={classes.root}>

          <CardHeader className={classes.cardHeader}
            title={selectedImage}
            titleTypographyProps={{ variant: 'body2' }}/>

          <CardMedia
            className={classes.media}
            image={`/LSC_Thumbnail/${selectedImage}`}
            title="Contemplative Reptile"
            style={{ backgroundSize: 'contain' }}
          />
          <CardActions style={{padding:4}}>
            <div style={{ flexGrow: 1, flexBasis: 0, display: 'flex', justifyContent: 'flex-start' }}>
              <Button size="small" color="primary" 
                className={classes.searchButton}
                onClick={()=>{handleSearchSimilar(selectedImage)}}>
                Similar Images
              </Button>
            </div>
            <Tooltip title="Add image to results" placement="top" aria-label="add">
              <Fab size="medium" color="inherit" aria-label="add" onClick={()=>{handleAddImageToResults(selectedImage)}}>
                <AddIcon />
              </Fab>
              </Tooltip>
            <div style={{ flexGrow: 1, flexBasis: 0, display: 'flex', justifyContent: 'flex-end' }}>
              <Button size="small" color="primary" 
                className={classes.searchButton}
                onClick={()=>{handleAdjacentImages(selectedImage)}}>
                Adjacent Images
              </Button>
            </div>

          </CardActions>
        </Card>
      </Popover>

      <AdjacentImages
        open={openDialog}
        handleClose={handleCloseDialog}
        queryImage={selectedImage}
      />

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openMessage}
        onClose={handleCloseMessage}
        message={message}
        autoHideDuration={6000}
      />

      <Backdrop classes={{root:classes.backdrop}} open={props.openBackdrop} >
        <CircularProgress color="inherit" />
      </Backdrop>

    </div>
  );
}
