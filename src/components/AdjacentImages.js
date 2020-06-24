import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import './carousel.css'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
// import {maxImageSize} from './ImageGrid';
const maxImageSize = 230;

const imageList = ['2018-05-04/B00003970_21I6X0_20180504_105327E.JPG',
  '2018-05-04/B00005345_21I6X0_20180504_203125E.JPG',
  '2018-05-04/B00005510_21I6X0_20180504_221253E.JPG',
  '2018-05-04/B00003737_21I6X0_20180504_090920E.JPG',
  '2018-05-04/B00003868_21I6X0_20180504_100827E.JPG',
  '2018-05-04/B00005239_21I6X0_20180504_194455E.JPG',
  '2018-05-04/B00004905_21I6X0_20180504_172026E.JPG',
  '2018-05-04/B00005376_21I6X0_20180504_204551E.JPG',
  '2018-05-04/B00005074_21I6X0_20180504_183544E.JPG',
  '2018-05-04/B00005496_21I6X0_20180504_220508E.JPG',
  '2018-05-04/B00005613_21I6X0_20180504_230509E.JPG',
  '2018-05-04/B00003986_21I6X0_20180504_105934E.JPG',
  '2018-05-04/B00004717_21I6X0_20180504_160618E.JPG',
  '2018-05-04/B00005032_21I6X0_20180504_181105E.JPG',
  '2018-05-04/B00004306_21I6X0_20180504_131435E.JPG',
  '2018-05-04/B00003746_21I6X0_20180504_091250E.JPG',
  '2018-05-04/B00004183_21I6X0_20180504_122057E.JPG',
  '2018-05-04/B00003683_21I6X0_20180504_084605E.JPG',
  '2018-05-04/B00003503_21I6X0_20180504_073334E.JPG',
  '2018-05-04/B00005036_21I6X0_20180504_181237E.JPG',
  '2018-05-04/B00005609_21I6X0_20180504_230252E.JPG',
  '2018-05-04/B00003562_21I6X0_20180504_075353E.JPG',
  '2018-05-04/B00003571_21I6X0_20180504_075726E.JPG',
  '2018-05-04/B00004929_21I6X0_20180504_173020E.JPG',
  '2018-05-04/B00005246_21I6X0_20180504_194739E.JPG',
  '2018-05-04/B00003669_21I6X0_20180504_084013E.JPG',
  '2018-05-04/B00004196_21I6X0_20180504_122718E.JPG',
  '2018-05-04/B00005265_21I6X0_20180504_195522E.JPG',
  '2018-05-04/B00005707_21I6X0_20180504_235358E.JPG',
  '2018-05-04/B00005172_21I6X0_20180504_191609E.JPG',
  '2018-05-04/B00003970_21I6X0_20180504_105327E.JPG',
  '2018-05-04/B00005345_21I6X0_20180504_203125E.JPG',
  '2018-05-04/B00005510_21I6X0_20180504_221253E.JPG',
  '2018-05-04/B00003737_21I6X0_20180504_090920E.JPG',
  '2018-05-04/B00003868_21I6X0_20180504_100827E.JPG',
  '2018-05-04/B00005239_21I6X0_20180504_194455E.JPG',
  '2018-05-04/B00004905_21I6X0_20180504_172026E.JPG',
  '2018-05-04/B00005376_21I6X0_20180504_204551E.JPG',
  '2018-05-04/B00005074_21I6X0_20180504_183544E.JPG',
  '2018-05-04/B00005496_21I6X0_20180504_220508E.JPG',
  '2018-05-04/B00005613_21I6X0_20180504_230509E.JPG',
  '2018-05-04/B00003986_21I6X0_20180504_105934E.JPG',
  '2018-05-04/B00004717_21I6X0_20180504_160618E.JPG',
  '2018-05-04/B00005032_21I6X0_20180504_181105E.JPG',
  '2018-05-04/B00004306_21I6X0_20180504_131435E.JPG',
  '2018-05-04/B00003746_21I6X0_20180504_091250E.JPG',
  '2018-05-04/B00004183_21I6X0_20180504_122057E.JPG',
  '2018-05-04/B00003683_21I6X0_20180504_084605E.JPG',
  '2018-05-04/B00003503_21I6X0_20180504_073334E.JPG',
  '2018-05-04/B00005036_21I6X0_20180504_181237E.JPG',
  '2018-05-04/B00005609_21I6X0_20180504_230252E.JPG',
  '2018-05-04/B00003562_21I6X0_20180504_075353E.JPG',
  '2018-05-04/B00003571_21I6X0_20180504_075726E.JPG',
  '2018-05-04/B00004929_21I6X0_20180504_173020E.JPG',
  '2018-05-04/B00005246_21I6X0_20180504_194739E.JPG',
  '2018-05-04/B00003669_21I6X0_20180504_084013E.JPG',
  '2018-05-04/B00004196_21I6X0_20180504_122718E.JPG',
  '2018-05-04/B00005265_21I6X0_20180504_195522E.JPG',
  '2018-05-04/B00005707_21I6X0_20180504_235358E.JPG',
  '2018-05-04/B00005172_21I6X0_20180504_191609E.JPG']

const useStyles = makeStyles(theme => ({
  gridList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems:'center',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  image: {
    display: 'block',
    maxHeight: maxImageSize,
    maxWidth: maxImageSize,
    width: 'auto',
    height: 'auto'
  },
  imgFullWidth: {
    // top: '50%',
    // width: '100%',
    // position: 'relative',
    transform: 'translateY(0%)',
  },
  dialog:{
    minHeight: '80vh',
    maxHeight: '80vh',
  },
  originalImage: {
    border:'solid red 2px',
    // margin:'10px',
    display: 'block',
    maxHeight: 270,
    maxWidth: 270,
    width: 'auto',
    height: 'auto',
    // boxShadow: '15px 21px 44px 3px rgba(0,0,0,0.57)',
  }
}))
export default function AdjacentImages(props) {
  const classes = useStyles();
  
  const [ref, setRef] = React.useState(null);
  const onRefChange = React.useCallback(node => {
    if (node !== null) {
      setRef(node);
    }
  }, []);
  
  // TODO: use a better solution for this bug
  React.useEffect(() => {
    if (props.open && ref) {
      setTimeout(() => { ref.scrollIntoView({block: "center"}) }, 500)
    }
  }, [props.open, ref])

  const returnToCenterImage = () => {
    ref.scrollIntoView({behavior: 'smooth',block: "center"})
  }

  return (
    <div>
      <Dialog
        open={props.open}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="scroll-dialog-title">Explore adjacent images</DialogTitle>
        <DialogContent dividers >
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >
            <GridList cellHeight={'auto'} cols={0} spacing={6} classes={{ root: classes.gridList }}>
              {imageList.map((image, index) => (
                <GridListTile key={image} ref={index === 30 ? onRefChange : null} classes={{imgFullWidth:classes.imgFullWidth}}
                  >
                  <img src={`/LSC_Thumbnail/${image}`} className={clsx({ [classes.originalImage]: index===32,[classes.image]:index!=32 })} />
                </GridListTile>

              ))}
            </GridList>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          
          <Button onClick={returnToCenterImage} color="primary">
            Return to original image
          </Button>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
