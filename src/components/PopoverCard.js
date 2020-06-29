
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
	root: {
		width: 400,
	},
	media: {
		height: 300,
	},
	cardHeader: {
		padding: 10,
		textAlign: 'center'
	},
	title: {
		fontSize: 13
	},
	searchButton: {
		fontWeight: 600,
	}
}))
export default function PopverCard(props) {
	const classes = useStyles(props);

	return (
		<Popover
			open={props.open}
			anchorEl={props.anchorEl}
			onClose={props.handleClose}
			disableScrollLock={true}
			BackdropProps={{ invisible: false, classes: { root: classes.backdrop } }}
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
					title={props.selectedImage}
					titleTypographyProps={{ variant: 'body2' }} />

				<CardMedia
					className={classes.media}
					image={`/LSC_Thumbnail/${props.selectedImage}`}
					style={{ backgroundSize: 'contain' }}
				/>
				<CardActions style={{ padding: 4 }}>
					<div style={{ flexGrow: 1, flexBasis: 0, display: 'flex', justifyContent: 'flex-start' }}>
						<Button size="small" color="primary"
							className={classes.searchButton}
							onClick={() => { props.handleSearchSimilar(props.selectedImage) }}>
							Similar Images
              </Button>
					</div>

					<Tooltip title="Add image to results" placement="top" aria-label="add">
						<Fab size="medium" color="inherit" aria-label="add"
							onClick={() => { props.handleAddImageToResults(props.selectedImage) }}>
							<AddIcon />
						</Fab>
					</Tooltip>

					<div style={{ flexGrow: 1, flexBasis: 0, display: 'flex', justifyContent: 'flex-end' }}>
						<Button size="small" color="primary"
							className={classes.searchButton}
							onClick={() => { props.handleAdjacentImages(props.selectedImage) }}>
							Adjacent Images
              </Button>
					</div>

				</CardActions>
			</Card>
		</Popover>
	)
}