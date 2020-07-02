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
		marginTop: 16,
		marginBottom:8
	},
	firstOption: {
		marginTop:4,
	},
	contentFirstOption: { 
		display: 'inline-flex', 
		alignItems: 'center', 
		marginLeft: '30px'
	},
	timePicker: {
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
		width: 110,
	},
	secondOption: {
		marginTop:20,
	},
	contentSecondOption: { 
		display: 'inline-flex', 
		alignItems: 'center', 
		margin: '-20px 0px 0px 30px',
	 }
}))
export default function TimeFiltering(props) {
	const classes = useStyles();
	const [option, setOption] = React.useState(
		props.step.method===props.methods.timeBefore?
		props.methods.timeBefore.toString():props.methods.timeRange.toString());

	const [timeBegin,setTimeBegin] = React.useState(props.step.content.timeBegin || "07:30")
	const [timeEnd,setTimeEnd] = React.useState(props.step.content.timeEnd || "07:30")
	const [minutes, setMinutes] = React.useState(props.step.content.minutes || 30)

	const handleClick = ()=>{
		if (option===props.methods.timeRange.toString())
			props.clickFilter(props.methods.timeRange)(timeBegin,timeEnd)
		else
			props.clickFilter(props.methods.timeBefore)(minutes)
	}
	
	return (
		<div>
			<FormControl component="fieldset">
				<RadioGroup value={option} onChange={(e)=>{setOption(e.target.value)}}>

					<div className={classes.firstOption}>
						<FormControlLabel value={props.methods.timeRange.toString()}
							control={<Radio color="primary" />} 
							disabled={props.atFirstStep}
							label='Filter images taken within a time range' />
						<div className={classes.contentFirstOption}>
							<Typography> From </Typography>
							<form className={classes.container} noValidate>
								<TextField type="time" 
									value={timeBegin}
									inputProps={{style: { textAlign: 'center' }}}
									className={classes.timePicker}
									InputLabelProps={{ shrink: true,}}
									inputProps={{ step: 300, }}
									disabled={props.atFirstStep}
									onChange={(e)=>setTimeBegin(e.target.value)}
								/>
							</form>
							<Typography> to </Typography>
							<form className={classes.container} noValidate>
								<TextField type="time" 
									value={timeEnd}
									inputProps={{style: { textAlign: 'center' }}}
									className={classes.timePicker}
									InputLabelProps={{ shrink: true,}}
									inputProps={{ step: 300, }}
									disabled={props.atFirstStep}
									onChange={(e)=>setTimeEnd(e.target.value)}
								/>
							</form>
						</div>
					</div>

					<div className={classes.secondOption}>
						<FormControlLabel value={props.methods.timeBefore.toString()} 
							control={<Radio color="primary" />} 
							disabled = {!props.enableTimeBefore}
							label='Get images taken before these images' />
						<div className={classes.contentSecondOption}>
							<Typography>Up to </Typography>
							<TextField type="number"
								disabled = {!props.enableTimeBefore}
								inputProps={{style: { textAlign: 'center' }}}
								className={classes.numInput}
								value={minutes}
								onChange={(e)=>setMinutes(e.target.value)}/>
							<Typography > minutes</Typography>
						</div>
					</div>

				</RadioGroup>
			</FormControl>

			<div className={classes.buttonContainer}>
				<Button variant="contained" color="primary"
					onClick={handleClick}
					disabled={props.atFirstStep}>
					Filter
        </Button>
			</div> 

		</div>
	)
}