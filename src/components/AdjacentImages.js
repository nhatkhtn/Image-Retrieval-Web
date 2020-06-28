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
import { parse as parseCSV } from 'papaparse';
// import InfiniteScroll from 'react-bidirectional-infinite-scroll';
// import './carousel.css'
// import {maxImageSize} from './ImageGrid';
const numAdjacentImages = 52;

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
	React.useEffect(() => {
		findAdjacentImages(props.queryImage)
	}, [props.open, props.queryImage])
	const findAdjacentImages = (image) => {
		if (image === '') {
			setAdjacentImages([]);
			setQueryImageIndex(null);
		}
		else {
			const folder_name = image.split('/')[0]
			fetch(`LSC_filename/${folder_name}.csv`)
				.then((r) => r.text())
				.then((data) => {
					const filenames = parseCSV(data).data.slice(1)
					const imgIndex = filenames.findIndex((e) => (e[1] === image))
					console.log(imgIndex)
					const imgList = filenames.slice(Math.max(imgIndex - numAdjacentImages, 0), Math.min(imgIndex + numAdjacentImages, filenames.length)).map((row) => row[1])
					setAdjacentImages(imgList)
					setQueryImageIndex(imgList.findIndex((e) => e === image))
				})
		}
	}

	return (
		<div>
			<Dialog
				open={props.open}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
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
							{/* <InfiniteScroll onReachBottom={()=>{}} onReachTop={()=>{}} > */}


								{adjacentImages.map((image, index) => (
									<GridListTile key={image} ref={index === queryImageIndex ? onRefChange : null} classes={{ imgFullWidth: classes.imgFullWidth }}
									>
										<img src={`/LSC_Thumbnail/${image}`} className={clsx({ [classes.queryImage]: index === queryImageIndex, [classes.image]: index != queryImageIndex })} />
									</GridListTile>

								))}

							{/* </InfiniteScroll> */}
						</GridList>
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
