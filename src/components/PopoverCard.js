
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';

const useStyles = makeStyles((theme) => ({
	popover: {
		'&:first-child': {
			backgroundColor: 'rgba(255,255,255,0.5) !important'
		}
	},
	card: {
		width: 400,
	},
	paper: {
		borderRadius: 0,
		// boxShadow:'0 0 0 0 rgba(0,0,0,0)',
		// backgroundColor:'rgba(50,50,50)'
	},
	image: {
		width: '100%',
		height: 'auto',
		margin: 0,
		border: 'solid 1px white'
		// boxShadow:'0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
	},
	filenameAndAddButton: {
		display: 'flex',
		alignItems: 'center',
		marginTop: -8
	},
	filename: {
		textAlign: 'left',
		flexGrow: 1,
		marginLeft: 20
	},
	addButton: {
		marginRight: 16,
		position: 'relative',
		top: -28
	},
	buttonArea: {
		display: 'flex',
		height: 50,
	},
	searchButton: {
		flexGrow: 1,
		flexBasis: 0,
		border: 'solid 1px white',
		height: '100%',
		width: '100%',
		backgroundColor: '#ededed',
		borderRadius: 0,
		'&:hover': {
			backgroundColor: '#e0e0e0',
		}
	},
	popper: {

	},
	tooltip: {
		// fontSize:'0.875rem'
	},
	backdrop: {
		backgroundColor: 'rgba(255,255,255,0.5)'
	},
}))
export default function PopverCard(props) {
	const classes = useStyles(props);

	return (
		<Popover
			open={props.open}
			anchorEl={props.anchorEl}
			onClose={props.handleClose}
			disableScrollLock={true}
			BackdropComponent={Backdrop}
			BackdropProps={{ invisible: false, classes: { root: classes.backdrop } }}
			anchorOrigin={{
				vertical: 'center',
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'center',
				horizontal: 'center',
			}}
			className={classes.popover}
			classes={{ paper: classes.paper }}
		>
			<div className={classes.card}>

				<img src={`/LSC_Thumbnail/${props.selectedImage}`} className={classes.image} />

				<div className={classes.filenameAndAddButton}>
					<Typography variant="body2" component="p" className={classes.filename} >
						{props.selectedImage.split('/').join('/\n')}
					</Typography>

					<div className={classes.addButton}>
						<Tooltip classes={{ tooltip: classes.tooltip }} title="Add image to results" placement="top" aria-label="add">
							<Fab color='primary'
								onClick={() => { props.handleAddImageToResults(props.selectedImage) }}>
								<AddIcon fontSize='large' />
							</Fab>
						</Tooltip>
					</div>
				</div>

				<div className={classes.buttonArea}>
					<Tooltip title='Find images most similar to this image' placement="top">
						<Button className={classes.searchButton} onClick={() => { props.handleSearchSimilar(props.selectedImage) }}>
							Similar Images
						</Button>
					</Tooltip>

					<Tooltip title='Find images taken right before and after this image' placement="top">
						<Button className={classes.searchButton}
							onClick={() => { props.handleAdjacentImages(props.selectedImage) }}>
							Adjacent Images
						</Button>
					</Tooltip>
				</div>
			</div>
		</Popover>
	)
}