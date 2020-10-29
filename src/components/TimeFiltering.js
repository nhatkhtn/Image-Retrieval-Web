import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

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
    marginBottom: 8
  },
  firstOption: {
    marginTop: 4,
  },
  contentFirstOption: {
    "& > * > * ": {
      display: 'inline-flex',
      alignItems: 'center',
      // marginLeft: '30px'
    }
  },
  timePicker: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: 110,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  secondOption: {
    marginTop: 20,
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
    props.step.method === props.methods.timeBefore ?
      props.methods.timeBefore.toString() : props.methods.timeRange.toString());

  const [timeBegin, setTimeBegin] = React.useState(props.step.content.timeBegin || "")
  const [timeEnd, setTimeEnd] = React.useState(props.step.content.timeEnd || "")
  const [minutes, setMinutes] = React.useState(props.step.content.minutes || 30)

  const handleClick = () => {
    if (option === props.methods.timeRange.toString())
      props.clickFilter(props.methods.timeRange)(timeBegin, timeEnd, dateValue)
    else
      props.clickFilter(props.methods.timeBefore)(minutes)
  }

  const [dateValue, setDateValue] = React.useState(['', '', '', '', '', '', '', ''])

  const date = [
    { name: 'Weekday', values: ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    { name: 'Day', values: [...Array(32).keys()].map((i) => i == 0 ? '' : i) },
    { name: 'Month', values: [...Array(13).keys()].map((i) => i == 0 ? '' : i) },
    { name: 'Year', values: ['', 2015, 2016, 2017, 2018] },
  ]


  return (
    <div>
      <FormControl component="fieldset">
        <RadioGroup value={option} onChange={(e) => { setOption(e.target.value) }}>

          <div className={classes.firstOption}>
            <FormControlLabel value={props.methods.timeRange.toString()}
              control={<Radio color="primary" />}
              // disabled={props.atFirstStep}
              label='Filter images taken within a time range' />
            <div className={classes.contentFirstOption}>
              <div>
                <Typography style={{ width: '50px' }}> Time </Typography>
                <Typography style={{ marginRight: '10px' }}> Start </Typography>
                <form className={classes.container} noValidate>
                  <TextField type="time"
                    value={timeBegin}
                    inputProps={{ style: { textAlign: 'center' } }}
                    className={classes.timePicker}
                    InputLabelProps={{ shrink: true, }}
                    inputProps={{ step: 300, }}
                    // disabled={props.atFirstStep}
                    onChange={(e) => setTimeBegin(e.target.value)}
                    style={{ margin: '0px', width: '105px' }}
                  />
                </form>
                <Typography style={{ marginLeft: '20px', marginRight: '10px' }}> End </Typography>
                <form className={classes.container} noValidate>
                  <TextField type="time"
                    value={timeEnd}
                    inputProps={{ style: { textAlign: 'center' } }}
                    className={classes.timePicker}
                    InputLabelProps={{ shrink: true, }}
                    inputProps={{ step: 300, }}
                    // disabled={props.atFirstStep}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    style={{ margin: '0px', width: '105px' }}
                  />
                </form>
              </div>
              {date.map((attribute, i) => (
                <div>
                  <Typography style={{ width: '70px' }}> {attribute.name} </Typography>
                  <Typography> Start </Typography>
                  <Select
                    native value={dateValue[i * 2]}
                    onChange={(e) => {
                      let newDateValue = dateValue.slice();
                      if (dateValue[i * 2] == dateValue[i * 2 + 1]) {
                        newDateValue[i * 2] = e.target.value;
                        newDateValue[i * 2 + 1] = e.target.value;
                        setDateValue(newDateValue);
                      } else {
                        newDateValue[i * 2] = e.target.value;
                        setDateValue(newDateValue);
                      }
                    }}
                    style={{ margin: ' 10px 30px 0px 10px', width: '90px' }}>
                    {attribute.values.map((v) => <option value={v}>{v}</option>)}
                  </Select>
                  <Typography> End </Typography>
                  <Select
                    native value={dateValue[i * 2 + 1]}
                    onChange={(e) => {
                      let newDateValue = dateValue.slice();
                      newDateValue[i * 2+1] = e.target.value;
                      setDateValue(newDateValue);
                    }}
                    style={{ margin: '10px 0px 0px 10px', width: '90px' }}>
                    {attribute.values.map((v) => <option value={v}>{v}</option>)}
                  </Select>
                </div>
              ))}


            </div>
          </div>

          <div className={classes.secondOption}>
            <FormControlLabel value={props.methods.timeBefore.toString()}
              control={<Radio color="primary" />}
              disabled={!props.enableTimeBefore}
              label='Get images taken before these images' />
            <div className={classes.contentSecondOption}>
              <Typography>Up to </Typography>
              <TextField type="number"
                disabled={!props.enableTimeBefore}
                inputProps={{ style: { textAlign: 'center' } }}
                className={classes.numInput}
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)} />
              <Typography > minutes</Typography>
            </div>
          </div>

        </RadioGroup>
      </FormControl>

      <div className={classes.buttonContainer}>
        <Button variant="contained" color="primary"
          onClick={handleClick}
          disabled={props.loading}>
          Filter
        </Button>
      </div>

    </div>
  )
}