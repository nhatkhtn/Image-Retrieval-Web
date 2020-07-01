import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { saveAs } from 'file-saver';
import { GridContextProvider, GridDropZone, GridItem, swap } from "react-grid-dnd";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import update from 'immutability-helper';

const boxesPerRow = 4;
const rowHeight = 300

const useStyles = makeStyles(theme => ({
	gridItem: {
		padding: 10,
	},
	imageContainer: {
		width: "100%",
		height: "100%",
		display: 'relative',
		textAlign: 'center'
	},
	image: {
		width: '100%',
		height: 'auto',
		margin: 0
	},
	card: {
		width: '100%'
	},
	content:{ 
		display: 'flex', 
		padding: '0px 4px 0px 4px', 
		marginTop: '-8px' ,
		'&:last-child':{
			paddingBottom:0,
		}
	},
	filename: {
		wordBreak: 'break-all',
		overflowWrap: 'break-word',
		padding: '8px 8px 4px 8px'
	},
	icon:{
		 margin: '4px 0px' 
	}
}))

export default function AdjacentImages(props) {
	const classes = useStyles();

	const exportToFile = (imageList) => {
		var textString = imageList.join(',\n')
		var blob = new Blob([textString], { type: "text/plain;charset=utf-8" });
		saveAs(blob, "results.txt");
	}

	const handleRemove = (index) => {
		props.setResults(update(props.results,{
			$splice:[[index,1]]
		}))
	}
	// target id will only be set if dragging from one dropzone to another.
	function onChange(sourceId, sourceIndex, targetIndex, targetId) {
		const changedResults = swap(props.results, sourceIndex, targetIndex);
		props.setResults(changedResults);
	}

	return (
		<div>
			<Dialog
				open={props.openResults}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
				onClose={props.handleCloseResults}
				disableScrollLock={true}
				fullWidth={true}
				maxWidth="lg"
			>
				<DialogTitle id="scroll-dialog-title">Results</DialogTitle>
				<DialogContent dividers >
					<DialogContentText
						id="scroll-dialog-description"
						tabIndex={-1}
					>
						<GridContextProvider onChange={onChange}>
							<GridDropZone
								id="items"
								boxesPerRow={boxesPerRow}
								rowHeight={rowHeight}
								style={{ height: Math.ceil(props.results.length / boxesPerRow) * rowHeight }}
							>
								{props.results.map((image, index) => (
									<GridItem key={image} className={classes.gridItem}>
										<Card className={classes.card}>
											<img src={`/LSC_Thumbnail/${image}`} className={classes.image}
												onDragStart={(e) => { e.preventDefault(); }} />

											<CardContent className={classes.content}>
												<Typography variant="body2" color="textSecondary" component="p" className={classes.filename}>
													{image}
												</Typography>
												
												<IconButton className={classes.icon} onClick={()=>{handleRemove(index)}}>
													<DeleteIcon />
												</IconButton>
											</CardContent>

										</Card>
									</GridItem>
								))}
							</GridDropZone>
						</GridContextProvider>
					</DialogContentText>
				</DialogContent>

				<DialogActions>
					<Button onClick={() => { exportToFile(props.results) }} color="primary">
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
