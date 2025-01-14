import React, { useEffect, useState, useMemo } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import VerticalTabs from '../general/AppTabs';
import { set } from 'lodash';
import OrderDetails from './OrderDetails';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CrmFullOrderDialog(props) {
  let { value, process,children } = props
  const [TabValue, setTabValue] = useState({})
  useEffect(() => {
   
  }, [props])
  const handleClose = () => {
    props.closetab()
  };
  

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={props.openorderdetail.length>0}
        onClose={handleClose}
        TransitionComponent={Transition}
        style={{
          zIndex: 1200
        }}
      >
        <AppBar sx={{
          position: 'relative',
          backgroundColor: "#ffffff",
          boxShadow: "0px 2px 35px #f0f0f0"
        }}>
          <Toolbar>
            <Typography style={{ color: "#333333" }} sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
             Order Detail
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon style={{ color: "#333" }} />
            </IconButton>

          </Toolbar>
        </AppBar>
        <OrderDetails taskdetail={props.taskdetail} employee={props.employee} screen={props.screen} taskpage={props.taskpage} orderInfo={props.openorderdetail}/>
        
      </Dialog>
    </React.Fragment>
  );
}
