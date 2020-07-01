
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
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
	card: {
		width: 400,
	},
	paper:{
		borderRadius:0,
		// boxShadow:'0 0 0 0 rgba(0,0,0,0)',
		backgroundColor:'rgba(50,50,50)'
	},
	image: {
		width: '100%',
		height: 'auto',
		margin: 0,
		border:'solid 1px rgb(50,50,50)'
		// boxShadow:'0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
	},
	filename:{
		textAlign:'center',
		color:'#fff'
	},
	buttonArea: {
		marginLeft:10,
		display:'flex',
		alignItems:'center'
	},
	searchSimilar:{
		marginLeft:10,
	},
	searchAdjacent: {
		marginLeft:10,
		flexGrow:1,
	},
	addButton:{
		marginRight:10,
		color:'#fff'
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
			classes={{paper:classes.paper}}
		>
			<div className={classes.card}>
				 <img src={`/LSC_Thumbnail/${props.selectedImage}`} className={classes.image}/>
					<Typography variant="body2" component="p" className={classes.filename} >
						{props.selectedImage}
					</Typography>

				<div className={classes.buttonArea}>
					<div className={classes.searchSimilar}>
						<Tooltip title='Find images most similar to this image' placement="top">
							<Button size="small" style={{color:'#fff'}} //color='primary' 
								onClick={() => { props.handleSearchSimilar(props.selectedImage) }}>
								Similar Images
              </Button>
						</Tooltip>
					</div>

					<div className={classes.searchAdjacent}>
						<Tooltip title='Find images taken right before and after this image' placement="top">
							<Button size="small" style={{color:'#fff'}} //color='primary'
								className={classes.searchButton}
								onClick={() => { props.handleAdjacentImages(props.selectedImage) }}>
								Adjacent Images
              </Button>
						</Tooltip>
					</div>

					<div className={classes.addButton}>
					<Tooltip title="Add image to results" placement="top" aria-label="add">
							<IconButton color='inherit'
								onClick={()=>{props.handleAddImageToResults(props.selectedImage)}}>
							<AddIcon  fontSize='large'/>
							</IconButton>
					</Tooltip>
					</div>
					</div>
			</div>
		</Popover>
	)
}