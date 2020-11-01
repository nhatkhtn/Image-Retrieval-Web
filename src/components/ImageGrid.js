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
import ErrorIcon from '@material-ui/icons/Error';
import Typography from '@material-ui/core/Typography';
import MuiAlert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const colsDrawerClose = 5;
const colsDrawerOpen = 6;
const rowsDrawerClose = 4;
const rowsDrawerOpen = 4;

const useStyles = makeStyles(theme => ({
  content: {
    height:'100vh',
    display:'flex',
    flexDirection:'column',
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
    // paddingRight: theme.spacing(1),
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
  imageContainer: {
    overflow:'visible',
  },
  image: {
    display: 'block',
    width: '100%',
    height: 'auto',
    cursor:'pointer',
    '&:hover':{
      boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px'
    },
    // bug half image cutted in Chrome
    top:'0%',
    transform:'translateY(0%)',
    left:'0%'
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

// .MuiGridListTile-imgFullWidth
// const styleStepLabel = makeStyles({
//   label: {
//     '&.MuiTypography-body2': {
//       fontSize: '1rem',
//       textAlign:'left'
//     }
//   }
// }, { name: 'MuiStepLabel' });

export default function ImageGrid(props) {
  const classes = useStyles(props);

  const [showedImages, setShowedImages] = useState([])
  // const [numImagesPerPage, setNumImagesPerPage] = useState(1)
  // const [cols, setCols] = useState(1)
  const [page, setPage] = useState(1)
  const handleChangePage = (event, value) => {
    setPage(value)
  }

  // useEffect(() => {
  //   if (props.drawerOpen) {
  //     setCols(colsDrawerClose);
  //     setNumImagesPerPage(colsDrawerClose*rowsDrawerClose);
  //   }
  //   else {
  //     setCols(colsDrawerOpen);
  //     setNumImagesPerPage(colsDrawerOpen*rowsDrawerOpen);
  //   }
  // }, [props.drawerOpen])

  useEffect(() => {
    setPage(1)
    setShowedImages(props.imageList.slice((page - 1) * props.cols*props.rows, page * props.cols*props.rows))
  }, [props.imageList, props.cols,props.rows])

  useEffect(() => {
    setShowedImages(props.imageList.slice((page - 1) * props.cols*props.rows, page * props.cols*props.rows))
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



  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const handleCloseMessage = () => {
    setOpenMessage(false);
  }
  const handleOpenMessage = () => {
    setOpenMessage(true);
  }

  const handleAddImageToResults = (image) => {
    let submit_url = 'https://vbs.itec.aau.at:9443/submit?session='+props.sessionID
    +'&item='+image.split('/')[1].split('.')[0]
    console.log('Request: '+submit_url);
    fetch(submit_url)
			.then(response => response.json())
			.then(response=>{
        console.log(response)
        if (response['status']==false) {
          setSeverity('error')
          setMessage(response['description'])
        }
        else {
          if (response['description']=='Submission correct!') {
            setSeverity('success')
          }
          else {
            setSeverity('warning')
          }

          const addingResult = props.addImageToResults(image);
          if (addingResult) {
            setMessage(`${response['description']}\nAdd image ${image} to results.`)
          }
          else {
            setMessage(`${response['description']}\nImage ${image} is already in results.`)
          }
        }
        handleOpenMessage();
      })
    
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  return (
    <div className={clsx(classes.content, {
      [classes.contentShift]: props.drawerOpen
    })}>

      <Toolbar />
      <div style={{overflowY: 'scroll',flexGrow: 1,overflowX:'hidden'}}>
      <div className={classes.paginationContainer}>
        <Pagination size="large" color="primary" showFirstButton showLastButton
          count={Math.ceil(props.imageList.length / (props.cols*props.rows))}
          page={page} onChange={handleChangePage}
          className={clsx({ [classes.hide]: props.imageList.length === 0 })} />
      </div>

      <GridList cellHeight={'auto'} cols={props.cols} spacing={6} classes={{ root: classes.gridList }}>
        {showedImages.map((image) => (
          <GridListTile key={image} onClick={handleClick(image)} classes={{tile:classes.imageContainer}}>
            <img src={`/LSC_Thumbnail/${image}`} alt={image} className={classes.image} />
          </GridListTile>
        ))}
      </GridList>

      <div className={classes.paginationContainer}>
        <Pagination size="large" color="primary" showFirstButton showLastButton
          count={Math.ceil(props.imageList.length / (props.cols*props.rows))}
          page={page} onChange={handleChangePage}
          className={clsx({ [classes.hide]: props.imageList.length === 0 })} />
      </div>
      </div>
      <PopoverCard
        open={openPopover}
        anchorEl={anchorEl}
        handleClose={handleClosePopover}
        selectedImage={selectedImage}
        handleSearchSimilar={handleSearchSimilar}
        handleAdjacentImages={handleAdjacentImages}
        // handleAddImageToResults={handleAddImageToResults}
        handleOpenConfirm={handleOpenConfirm}
      />

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openMessage}
        onClose={handleCloseMessage}
        autoHideDuration={5000}>
        <Alert severity={severity}>
          {message}
        </Alert>
      </Snackbar>

      <AdjacentImages
        open={openDialog}
        handleClose={handleCloseDialog}
        queryImage={selectedImage}
        searchAdjacentImages={props.searchAdjacentImages}
        handleAddImageToResults={handleAddImageToResults}
        handleSearchSimilar={handleSearchSimilar}
        handleOpenConfirm={handleOpenConfirm}
      />

      <Backdrop classes={{ root: classes.backdrop }} open={props.loading} >
        {props.error ? 
          (<Typography><ErrorIcon  style={{verticalAlign: 'middle'}}/>{props.error.name}: {props.error.message}</Typography>)
          :
          (<CircularProgress color="inherit" />)}
      </Backdrop>
      
      {/*Confirm dialog for LSC challenge*/}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to submit this image?"}</DialogTitle>
        <DialogActions>
          <Button onClick={()=>{
            handleAddImageToResults(selectedImage);
            handleCloseConfirm();
            }}
            color="primary">
            YES
          </Button>
          <Button onClick={handleCloseConfirm} color="primary" autoFocus>
            NO
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
