import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
	search: {
		margin: '20px 0px 0px 0px',
	},
	buttonContainer: {
		display: 'flex',
		justifyContent: 'center'
	},
	text: {
		display: 'inline-flex',
		margin: '0px 0px 20px 5px',
		alignItems:'center',
	},
	numInput: {
		width: 60,
		margin: 10
	}
}));

export default function CaptionFiltering(props) {
	const classes = useStyles();
	const [caption, setCaption] = useState('');
	const [numImages, setNumImages] = useState(1000);

	return (
		<div>
			<div className={classes.search}>
				<TextField
					fullWidth multiline
					id="outlined-search" label="Caption sentence" type="search"
					variant="outlined"
					value={caption}
					onChange={(e) => setCaption(e.target.value)}
				/>
			</div>

			<div className={classes.text}>
				<Typography >Get the top </Typography>
				<TextField type="number"
					className={classes.numInput}
					defaultValue={numImages}
					onChange={(e) => setNumImages(e.target.value)} />
				<Typography > results</Typography>
			</div>

			<div className={classes.buttonContainer}>
				<Button variant="contained" color="primary"
					onClick={() => { props.clickFilter(caption, numImages) }}>
					Filter
        </Button>
			</div>

		</div>
	)
}