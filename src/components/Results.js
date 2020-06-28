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
import { saveAs } from 'file-saver';
import { parse as parseCSV } from 'papaparse';
// import InfiniteScroll from 'react-bidirectional-infinite-scroll';
// import './carousel.css'
// import {maxImageSize} from './ImageGrid';
const maxImageSize = 230;
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
		maxHeight: maxImageSize,
		maxWidth: maxImageSize,
		width: 'auto',
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
		maxHeight: 270,
		maxWidth: 270,
		width: 'auto',
		height: 'auto',
		// boxShadow: '15px 21px 44px 3px rgba(0,0,0,0.57)',
	}
}))

export default function AdjacentImages(props) {
	const classes = useStyles();

	const exportToFile = (imageList) => {
		var textString = imageList.join(',\n')
		var blob = new Blob([textString], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "results.txt");
	}

	return (
		<div>
			<Dialog
				open={props.openResults}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
				fullWidth={true}
				maxWidth="lg"
			>
				<DialogTitle id="scroll-dialog-title">Results</DialogTitle>
				<DialogContent dividers >
					<DialogContentText
						id="scroll-dialog-description"
						tabIndex={-1}
					>
						<GridList cellHeight={'auto'} cols={4} spacing={6} classes={{ root: classes.gridList }}>
							{/* <InfiniteScroll onReachBottom={()=>{}} onReachTop={()=>{}} > */}

								{props.results.map((image, index) => (
									<GridListTile key={image} 
									>
										<img src={`/LSC_Thumbnail/${image}`}/>
									</GridListTile>

								))}
							{/* </InfiniteScroll> */}
						</GridList>
					</DialogContentText>
				</DialogContent>
				<DialogActions>


					<Button onClick={()=>{exportToFile(props.results)}} color="primary">
						Export to File
          </Button>
					<Button onClick={props.handleCloseResults} color="primary">
						Cancel
          </Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
