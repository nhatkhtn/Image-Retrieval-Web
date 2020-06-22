import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 110,
	},
	text: {
		display: 'inline-flex',
		margin: '0px 0px 20px 0px',
		alignItems: 'center',
	},
	numInput: {
		width: 50,
		margin: 10
	},
	noLabel: {
		marginLeft: -8,
	},
	buttonContainer: {
    display: 'flex',
		justifyContent: 'center',
		marginTop:20
  },
}))
export default function TimeFiltering(props) {
	const classes = useStyles();
	const [value, setValue] = React.useState('female');

	const handleChange = (event) => {
		setValue(event.target.value);
	};
	return (
		<div>
		<FormControl component="fieldset">
			<RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
			<div style={{marginTop:20}}>
				<FormControlLabel value="fdsfasdf" control={<Radio color="primary"/>} label='Filter images taken within a time range' />
				<div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 30 }}>
					<Typography> From </Typography>
					<form className={classes.container} noValidate>
						<TextField
							id="time"
							type="time"
							defaultValue="07:30"
							className={classes.textField}
							InputLabelProps={{
								shrink: true,
							}}
							inputProps={{
								step: 300, // 5 min
							}}
						/>
					</form>
					<Typography> to </Typography>
					<form className={classes.container} noValidate>
						<TextField
							id="time"
							type="time"
							defaultValue="07:30"
							className={classes.textField}
							InputLabelProps={{
								shrink: true,
							}}
							inputProps={{
								step: 300, // 5 min
							}}
						/>
					</form>
				</div>
				</div>
			<div style={{marginTop:20}}>

				<FormControlLabel value="male" control={<Radio color="primary"/>} label='Get images taken before these images' />
				<div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 30,marginTop:-10 }}>

					<Typography>Up to </Typography>
					<TextField type="number"
						className={classes.numInput}
						defaultValue={30}
						onChange={(e) => { }} />
					<Typography > minutes</Typography>
				</div>
				</div>
						
			</RadioGroup>
		</FormControl>
		<div className={classes.buttonContainer}>
        <Button variant="contained" color="primary" 
          onClick={()=>{}}>
          Filter
        </Button>
      </div>
		</div>
	)
}