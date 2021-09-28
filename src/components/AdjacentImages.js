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

const cols = 5;
const numImagesLoadMore = 10;

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

export default function AdjacentImages(props) {
	const classes = useStyles();

	// Keep track of the query image and scroll to it
	const ref = React.useRef(null);
	const [dialogJustOpened, setDialogJustOpened] = useState(false)

	// TODO: use a better solution for this bug
	React.useEffect(() => {
		if (dialogJustOpened && ref.current && dialogRef) {
			ref.current.scrollIntoView({ block: "center" })

			// dialogRef and ref have the same offsetParent
			if (dialogRef.scrollTop + dialogRef.offsetTop < ref.current.offsetTop 
				&& dialogRef.scrollTop + dialogRef.offsetTop + dialogRef.offsetHeight 
				> ref.current.offsetTop + ref.current.offsetHeight) {
				setDialogJustOpened(false)
			}
		}
	})
	const returnToCenterImage = () => {
		ref.current.scrollIntoView({ behavior: 'smooth', block: "center" })
	}

	///////////////////////////////////////////////////////////////////////
	// Load adjacent images

	const [adjacentImages, setAdjacentImages] = React.useState([])
	const [queryImageIndex, setQueryImageIndex] = React.useState(null)
	const [allImages, setAllImages] = useState([])
	const [startIndex, setStartIndex] = useState(0)
	const [endIndex, setEndIndex] = useState(0)
	const [reachTopImage, setReachTopImage] = useState(false)
	const [numPaddingImages, setNumPaddingImages] = useState(0) // padding for the query image showed in center column
	
	const searchAdjacentImagesAndUpdate = (image) => {
		if (image !== '') {
			props.searchAdjacentImages(image)
				.then((result) => {
					const [adjacentImages, initialQueryImageIndex, filenames, initialStartIndex, initialEndIndex] = result
					setAdjacentImages(adjacentImages)
					setQueryImageIndex(initialQueryImageIndex)
					setAllImages(filenames)
					setStartIndex(initialStartIndex)
					setEndIndex(initialEndIndex)
					setNumPaddingImages((Math.floor(cols / 2) + cols - initialQueryImageIndex % cols) % cols)
				})
				.then(() => {
					setDialogJustOpened(true)
				})
		}
	}
	React.useEffect(() => {
		if (props.open)
			searchAdjacentImagesAndUpdate(props.queryImage)
			setReachTopImage(false)
	}, [props.open])

	/////////////////////////////////////////////////////////////////
	// Loading more adjacent images

	const [gridListRef, setGridListRef] = useState(null);
	const [dialogRef, setDialogRef] = useState(null);
	const [numElAdded, setNumElAdded] = useState(1);
	const [prevScrollTop, setPrevScrollTop] = useState(0);
	const [justAddPrev, setJustAddPrev] = useState(false);

	const addPrevImages = () => {
		const newStartIndex = Math.max(0, startIndex - numImagesLoadMore)
		const addedImages = allImages.slice(newStartIndex, startIndex)
		setAdjacentImages(addedImages.concat(adjacentImages))
		setQueryImageIndex(queryImageIndex + addedImages.length)
		setStartIndex(newStartIndex)
		setJustAddPrev(true)
		setNumElAdded(addedImages.length)
		if (addedImages.length===0) setReachTopImage(true)
	}
	const addAfterImages = () => {
		const newEndIndex = Math.min(allImages.length, endIndex + numImagesLoadMore)
		const addedImages = allImages.slice(endIndex, newEndIndex)
		setAdjacentImages(adjacentImages.concat(addedImages))
		setEndIndex(newEndIndex)
	}

	const handleScroll = () => {
		const { firstChild, lastChild } = gridListRef
		const { scrollTop, offsetTop, offsetHeight } = dialogRef

		const topEdge = firstChild.offsetTop
		const bottomEdge = lastChild.offsetTop + lastChild.offsetHeight
		const scrolledUp = scrollTop + offsetTop
		const scrolledDown = scrolledUp + offsetHeight

		if (scrolledDown >= bottomEdge) {
			setPrevScrollTop(scrollTop)
			addAfterImages()
		} else if (scrolledUp <= topEdge && !reachTopImage) {
			setPrevScrollTop(scrollTop)
			addPrevImages()
		}
	}

	useEffect(() => {
		if (gridListRef != null && justAddPrev 	) {
			const oldTop = gridListRef.children[numElAdded].offsetTop
			const newTop = gridListRef.firstChild.offsetTop
			dialogRef.scrollTop = prevScrollTop + oldTop - newTop
			setJustAddPrev(false)
		}
	}, [justAddPrev])

	//////////////////////////////////////////////////////////
	// Popover
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
				<DialogTitle id="scroll-dialog-title">View Timeline</DialogTitle>
				<DialogContent dividers ref={(ref) => { setDialogRef(ref) }}>
					<DialogContentText
						id="scroll-dialog-description"
						tabIndex={-1}
					>
						<GridList cellHeight={'auto'} cols={cols} spacing={6} classes={{ root: classes.gridList }}
							ref={(ref) => { setGridListRef(ref) }}>

							{Array(numPaddingImages).fill(0).map(() => (
								<GridListTile>
									<p className={classes.image}></p>
								</GridListTile>
							))}
							{adjacentImages.map((image, index) => (
								<GridListTile ref={index === queryImageIndex ? ref : null} classes={{ imgFullWidth: classes.imgFullWidth }}>
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
							// handleAddImageToResults={props.handleAddImageToResults}
							handleOpenConfirm={props.handleOpenConfirm}
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
