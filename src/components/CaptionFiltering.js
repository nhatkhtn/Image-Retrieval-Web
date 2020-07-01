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
		alignItems: 'center',
	},
	numInput: {
		width: 60,
		margin: 10
	}
}));

export default function CaptionFiltering(props) {
	const classes = useStyles();
	const [caption, setCaption] = useState(props.caption);
	const [numImages, setNumImages] = useState(100);
	const [invalidInput, setInvalidInput] = useState(false);
	const [helperText, setHelperText] = useState('')
	const inputRef = React.createRef();

	const handleClick = () => {
		if (caption === "") {
			setInvalidInput(true);
			setHelperText('Query sentence cannot be empty')
			inputRef.current.focus();
		}
		else {
			setInvalidInput(false);
			setHelperText('')
			props.clickFilter(caption, numImages)
		}
	}

	return (
		<div>
			<div className={classes.search}>
				<TextField
					fullWidth multiline autoFocus
					id="outlined-search" label="Query sentence" type="search"
					helperText={helperText}
					variant="outlined"
					value={caption}
					error={invalidInput}
					inputRef={inputRef}
					onChange={(e) => setCaption(e.target.value)}
				/>
			</div>

			<div className={classes.text}>
				<Typography >Get the top </Typography>
				<TextField type="number"
					inputProps={{ style: { textAlign: 'center' } }}
					className={classes.numInput}
					defaultValue={numImages}
					onChange={(e) => setNumImages(e.target.value)} />
				<Typography > results</Typography>
			</div>

			<div className={classes.buttonContainer}>
				<Button variant="contained" color="primary"
					onClick={handleClick}>
					Filter
        </Button>
			</div>

		</div>
	)
}