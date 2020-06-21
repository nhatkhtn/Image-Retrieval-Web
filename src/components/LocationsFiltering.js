import React, { useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '20px 0px 20px 0px',
    // width: 500,
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
}));

export default function LocationsFiltering(props) {
  const classes = useStyles();
  const [locations, setLocations] = useState('')
  return (
    <div>
      <div className={classes.root}>

        <Autocomplete
          multiple
          id="tags-outlined"
          options={locationList}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Locations"
              placeholder="Home, Work,..."
            />
          )}
          onChange={(event, value) => { setLocations(value) }}/>
      </div>

      <div className={classes.buttonContainer}>
        <Button variant="contained" color="primary" 
          onClick={() => props.clickFilter(locations)}>
          Filter
        </Button>
      </div>

    </div>
  );
}

const locationList = ['Home', 'Work', 'Verbena Avenue', 'Dublin City University (DCU)',
  'Science Gallery Café', 'The Helix', 'DCU School of Nursing',
  'Thunder Road Café', 'The Westin', 'Brown Thomas', 'Costa Coffee',
  'Starbucks', 'Dunnes Stores',
  'Dublin Airport (DUB) - Aerfort Bhaile Átha Cliath', 'Bayside',
  'Lidl', "O'Brien Centre for Science",
  'Howth Junction Business Centre',
  'Hilan Korean & Chinese Restaurant', 'Dublin Airport T2 Car Park',
  'Car Rental Village', "McDonald's",
  'Sheffield University - Portobello Centre', 'Novotel',
  'Sheffield Tap', 'Café Rouge', 'The Antiques Emporium',
  'Kinder Lodge', 'Devonshire Arms', 'Waterstones',
  'Manchester International Airport (MAN)', 'Web Summit HQ',
  'Pavilions Shopping Centre', 'Waterside ', "Eddie Rocket's",
  'Homebase', 'Power City', 'Rathdown Park', 'Caim Church',
  'The Sisters Home', 'Gate 212', 'London City Airport (LCY)',
  'Tenter Street Apartment ', 'Grange Tower Bridge Hotel',
  'Gate 303', 'Frankfurt Airport (FRA)', 'Gate Z66',
  'Modern Universe Business Plaza', 'Dentistry.ie',
  "O'Briens Sandwhich Bar", 'Tesco Extra',
  'The Blanchardstown Centre', 'Starbucks Stillorgan',
  'Leopardstown Racecourse Pavilion', 'Leopardstown Racecourse',
  'Donaghmede Shopping Centre', "St. Brigid's Church",
  'Yamamori Izakaya Bar', 'The Henry Grattan',
  'Jervis Shopping Centre', 'Arnotts Department Store', 'B&Q',
  'Connolly Train Station', 'McDonalds', 'Omni Park Shopping Centre',
  'Dunnes Cornelscourt', 'Siam Thai, Dundrum Town Centre',
  'DCU Restaurant', 'Invent Cafe', 'Hotel Killarney', 'Ross Castle',
  'Tea & Tales', 'DAA Executive Lounge', 'Gate 110',
  'Stockholm Arlanda (ARN) International Airport',
  'SAS Gold Lounge Arlanda', 'Stockholm-Arlanda Airport Gate 10A',
  'Oslo - Gardermoen Norway International Airport',
  'Clarion Hotel & Congress Oslo Airport', 'SAS Domestic Lounge OSL',
  'Tromsø Lufthavn, Langnes (TOS)', 'Smarthotel', 'Rå Sushi Tromsø',
  'Realfagbygget', 'Forskningsparken i Tromsø',
  'SAS Businesslounge Tromsø Lufthavn',
  'Oslo Lufthavn Gardermoen, Gate 53', 'The Black Sheep',
  'Park Inn Radisson Hotel, Gardermoen', 'Oslo Lufthavn (OSL)',
  'Clarion Hotel The Edge', 'Fjellheisen Cable Car Tromsø',
  'Radisson Blu Hotel, Tromsoe', 'MH-kafeen UIT', 'Gate 102',
  'Science Gallery Trinity College Dublin',
  'Captain Americas Cookhouse & Bar', 'Grafton Street',
  'SuperValu, Killester', 'Ballsbridge Hotel',
  'Radisson Blu Royal Hotel, Dublin', 'Pho Ta',
  'Mc Donalds Liffey Valley Retail Park :)', "Lena's Tea Room",
  'Yeats Country Hotel Spa & Leisure Club',
  'Austies Bar and Restaurant', 'Quayside Shopping Centre',
  'Shells Sea Side Bakery Cafe', 'Sligo Retail Park',
  'The Golden Wok Chinese, Thai and Vietnamese Takeaway',
  'Liffey Valley Shopping Centre', 'Boots Liffey Valley',
  'Prezzo, Liffey Valley Center',
  'DCU Staff CarPark (Albert College)', 'Mc Donalds - Donaghmede',
  'Guinness Enterprise Centre,', 'Eddie Rockets Clare Hall', 'Avoca',
  'DCU Engineering Building', 'Leman Solicitors', "Angelina's",
  'DCU School of Computing', 'Dublin Airport',
  "Ann's Bakery and Restaurant",
  'The Morrison, a DoubleTree by Hilton Hotel',
  "Crabby Jo's Restaurant", "Grace O'Malley Drive", 'Steven An',
  'Permanent TSB', 'Howth', 'Airside Retail Park',
  'Airside retail park', 'Arisu Korean Restrant',
  'Smyths Toys Ireland', 'Fitzsimons Bar', 'Pavlova Passion Bakery',
  'Marie Louise Tea Rooms', 'Howth Harbour', 'Port of Howth',
  "Woodie's DIY",
  "Embassy of  The People's Republic of China Visa & Consular Office",
  'Collins Park', 'Sandymount Hotel', "St Patrick's College, Dublin",
  'Greendale Shopping Centre', "O'Connors Cafe Bar & Restaurant",
  'Limerick City', 'Limerick Colbert railway station',
  'Thai Massage Rooms',
  'Madam Mok Asian Fusion Restaurant & Take Away',
  'Wanda Realm Wuhan', 'Wuhan University', 'Hanjie Steet',
  'East China Normal University',
  'Shanghai Pudong International airport', 'Regency Hotel',
  'Dentist Kilbarrack', 'Starbucks Rathmines', 'Jurys Inn',
  'Powerscourt Townhouse Centre', 'SOLE Seafood & Grill',
  'Georges Street Arcade']