import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
	search: {
		margin: '20px 0px 0px 0px',
	}
}));

export default function QuerySentence(props) {
	const classes = useStyles();
	const [query, setQuery] = useState('');
	const [numImages, setNumImages] = useState(1000);

	return (
		<div>
			<div className={classes.search}>
				<TextField
					fullWidth multiline id="outlined-search" label="Search Query" type="search" variant="outlined"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</div>
			{/* <Grid container justify="center"> */}

				<div style={{ display: 'inline-flex',margin:'0px 0px 20px 5px' }}>
					<Typography style={{ alignSelf: 'center' }}>Get the top </Typography>
					<TextField type="number" 
					defaultValue={numImages}  
					onChange={(e) => setNumImages(e.target.value)}
					style={{ width: 60, alignSelf: 'center', margin: 10 }} />
					<Typography style={{ alignSelf: 'center' }}> results</Typography>
				</div>
			{/* </Grid> */}

			<Grid container justify="center">
				<div>
					<Button variant="contained" color="primary" onClick = {()=>{props.clickSearch(query,numImages)}}>
						Search
            </Button>
				</div>
			</Grid>
		</div>
	)
}