import React, { useState, useLayoutEffect, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import PopoverCard from './PopoverCard';
import update from 'immutability-helper';

import InfiniteScroll from './scroll';

const numImagesLoadMore =10;

const useStyles = makeStyles(theme => ({
	gridList: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
		backgroundColor: theme.palette.background.paper,
	},
	image: {
		display: 'block',
		width: '100%',
		height: 'auto'
	},
	imgFullWidth: {
		// top: '50%',
		// width: '100%',
		// position: 'relative',
		transform: 'translateY(0%)',
	},
	dialog: {
		minHeight: '80vh',
		maxHeight: '80vh',
	},
	queryImage: {
		border: 'solid red 2px',
		display: 'block',
		width: '100%',
		height: 'auto',
		// boxShadow: '15px 21px 44px 3px rgba(0,0,0,0.57)',
	}
}))

const addedImgList = [
	'2018-05-27/B00005994_21I6X0_20180527_153711E.JPG',
	'2018-05-27/B00005995_21I6X0_20180527_153735E.JPG',
	'2018-05-27/B00005996_21I6X0_20180527_153759E.JPG',
	'2018-05-27/B00005997_21I6X0_20180527_153823E.JPG',
	'2018-05-27/B00005998_21I6X0_20180527_153847E.JPG',
	'2018-05-27/B00005999_21I6X0_20180527_153910E.JPG',
	'2018-05-27/B00006000_21I6X0_20180527_153936E.JPG',
	'2018-05-27/B00006432_21I6X0_20180527_183439E.JPG',
	'2018-05-27/B00006433_21I6X0_20180527_183503E.JPG',
	'2018-05-27/B00006434_21I6X0_20180527_183526E.JPG',
	
	]
export default function AdjacentImages(props) {
	const classes = useStyles();

	// Keep track of the query image and scroll to it
	const [ref, setRef] = React.useState(null);
	const onRefChange = React.useCallback(node => {
		if (node !== null) {
			setRef(node);
		}
	});
	// TODO: use a better solution for this bug
	React.useEffect(() => {
		if (props.open && ref) {
			setTimeout(() => { ref.scrollIntoView({ block: "center" }) }, 500)
		}
	}, [props.open, ref])
	const returnToCenterImage = () => {
		ref.scrollIntoView({ behavior: 'smooth', block: "center" })
	}

	// List of adjacent images
	const [adjacentImages, setAdjacentImages] = React.useState([])
	const [queryImageIndex, setQueryImageIndex] = React.useState(null)
	const [allImages, setAllImages] = useState([])
	const [startIndex, setStartIndex] = useState(0)
	const [endIndex, setEndIndex] = useState(0)

	const searchAdjacentImagesAndUpdate = (image) => {
		if (image !== '') {
			props.searchAdjacentImages(image)
				.then((result) => {
					const [adjacentImages, queryImageIndex, filenames, initialStartIndex, initialEndIndex] = result
					setAdjacentImages(adjacentImages)
					setQueryImageIndex(queryImageIndex)
					setAllImages(filenames)
					setStartIndex(initialStartIndex)
					setEndIndex(initialEndIndex)
				})

		}
	}
	React.useEffect(() => {
		if (props.open)
			searchAdjacentImagesAndUpdate(props.queryImage)
	}, [props.open])


	//////////////////////////////////////////////////////////
	const [selectedImage, setSelectedImage] = React.useState('');

	const [anchorEl, setAnchorEl] = React.useState(null);
	const handleClosePopover = () => {
		setAnchorEl(null);
	};
	const openPopover = Boolean(anchorEl);

	const handleClick = (image) => (event) => {
		setAnchorEl(event.currentTarget);
		setSelectedImage(image)
	};

	const handleSearchSimilar = (image) => {
		handleClosePopover();
		props.handleClose();
		props.handleSearchSimilar(image, 200, props.queryImage)
	}

	const handleAdjacentImages = (image) => {
		handleClosePopover();
		searchAdjacentImagesAndUpdate(image)
	}

	/////////////////////////////////////////////////////////////////
	// Loading more adjacent images

	const addPrevImages = ()=>{
		const addedImages = allImages.slice(Math.max(0,startIndex-numImagesLoadMore),startIndex)
		setAdjacentImages(addedImages.concat(adjacentImages))
		return addedImages.length
	}
	const addAfterImages = ()=>{
		const addedImages = allImages.slice(endIndex,Math.min(allImages.length,endIndex+numImagesLoadMore))
		setAdjacentImages(adjacentImages.concat(addedImages))
	}
	
	const [gridListRef, setGridListRef] = useState(null);
	const [dialogRef, setDialogRef] = useState(null);
	const [numElAdded, setNumElAdded] = useState(0);
	const [prevScrollTop, setPrevScrollTop] = useState(0);

	const handleScroll = () => {
		const {firstChild, lastChild} = gridListRef
		const {scrollTop, offsetTop, offsetHeight} = dialogRef

    const topEdge = firstChild.offsetTop
    const bottomEdge = lastChild.offsetTop + lastChild.offsetHeight
    const scrolledUp = scrollTop + offsetTop
		const scrolledDown = scrolledUp + offsetHeight
		
    if (scrolledDown >= bottomEdge) {
			setPrevScrollTop(scrollTop)
			addAfterImages()
    } else if (scrolledUp <= topEdge) {
			setPrevScrollTop(scrollTop)
			setNumElAdded(addPrevImages())
    }
	}
	
	useEffect(()=> {
		if (gridListRef!=null)   {
			const oldTop = gridListRef.children[numElAdded].offsetTop
			const newTop = gridListRef.firstChild.offsetTop
			dialogRef.scrollTop = prevScrollTop + oldTop-newTop
		}
	},[adjacentImages.length])

	return (
		<div>
			<Dialog
				open={props.open}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
				disableScrollLock={true}
				onClose={props.handleClose}
				fullWidth={true}
				maxWidth="lg"
				onScroll={handleScroll}
			>
				<DialogTitle id="scroll-dialog-title">Explore adjacent images</DialogTitle>
				<DialogContent dividers ref={(ref)=>{setDialogRef(ref)}}>
					<DialogContentText
						id="scroll-dialog-description"
						tabIndex={-1}
					>
						<GridList cellHeight={'auto'} cols={5} spacing={6} classes={{ root: classes.gridList }}
							ref={(ref)=> {setGridListRef(ref)}}
						>
								{adjacentImages.map((image, index) => (
									<GridListTile ref={index === queryImageIndex ? onRefChange : null} classes={{ imgFullWidth: classes.imgFullWidth }}>
										<img src={`/LSC_Thumbnail/${image}`}
											className={clsx({ [classes.queryImage]: index === queryImageIndex, [classes.image]: index != queryImageIndex })}
											onClick={handleClick(image)}
										/>
									</GridListTile>
								))}

						</GridList>

						<PopoverCard
							open={openPopover}
							anchorEl={anchorEl}
							handleClose={handleClosePopover}
							selectedImage={selectedImage}
							handleSearchSimilar={handleSearchSimilar}
							handleAdjacentImages={handleAdjacentImages}
							handleAddImageToResults={props.handleAddImageToResults}
						/>

					</DialogContentText>
				</DialogContent>
				<DialogActions>

					<Button onClick={returnToCenterImage} color="primary">
						Return to query image
          </Button>
					<Button onClick={props.handleClose} color="primary">
						Cancel
          </Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
