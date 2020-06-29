import React from 'react';
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

// import InfiniteScroll from 'react-bidirectional-infinite-scroll';
// import './carousel.css'
// import {maxImageSize} from './ImageGrid';

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
	const searchAdjacentImagesAndUpdate = (image) => {
		if (image !== '') {
			props.searchAdjacentImages(image)
				.then((result) => {
					const [adjacentImages, queryImageIndex] = result
					setAdjacentImages(adjacentImages)
					setQueryImageIndex(queryImageIndex)
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
		props.handleSearchSimilar(image)
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
			>
				<DialogTitle id="scroll-dialog-title">Explore adjacent images</DialogTitle>
				<DialogContent dividers >
					<DialogContentText
						id="scroll-dialog-description"
						tabIndex={-1}
					>
						<GridList cellHeight={'auto'} cols={5} spacing={6} classes={{ root: classes.gridList }}>
							{adjacentImages.map((image, index) => (
								<GridListTile key={image} ref={index === queryImageIndex ? onRefChange : null} classes={{ imgFullWidth: classes.imgFullWidth }}
								>
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
