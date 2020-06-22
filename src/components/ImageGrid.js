import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Toolbar from '@material-ui/core/Toolbar';
import Pagination from '@material-ui/lab/Pagination';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

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
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

const initialState = {
  mouseX: null,
  mouseY: null,
};

export default function ImageGrid(props) {
  const classes = useStyles(props);
  const [showedImages, setShowedImages] = useState([])
  const [page, setPage] = useState(1)
  const handleChange = (event, value) => {
    setPage(value)
  }

  useEffect(() => {
    setPage(1)
    setShowedImages(props.imageList.slice((page - 1) * numImagesPerPage, page * numImagesPerPage))
  }, [props.imageList])

  useEffect(() => {
    setShowedImages(props.imageList.slice((page - 1) * numImagesPerPage, page * numImagesPerPage))
  }, [page])

  const [state, setState] = useState(initialState);
  const [selectedImage, setSelectedImage] = useState(null)

  const handleContextMenu = (image) => (event) => {
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

      <div className={classes.root}>
        <GridList cellHeight={'auto'} className={classes.gridList} cols={0}>
          {showedImages.map((image) => (
            <GridListTile key={image} onContextMenu={handleContextMenu(image)}>
              <img src={`/LSC_Thumbnail/${image}`} alt={image} />
            </GridListTile>
          ))}
        </GridList>
      </div>

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
      </Menu>

      <div className={classes.paginationContainer}>
        <Pagination size="large" showFirstButton showLastButton
          count={Math.ceil(props.imageList.length / numImagesPerPage)}
          page={page} onChange={handleChange}
          className={clsx({ [classes.hide]: props.imageList.length === 0 })} />
      </div>

    </div>
  );
}
