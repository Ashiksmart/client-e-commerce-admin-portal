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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CrmFullScreenDialog(props) {
  let { value, process,children } = props
  const [TabValue, setTabValue] = useState({})
  console.log(children,"setViewCRMDatasetViewCRMData", value === module);
  useEffect(() => {
    let obj={}
    for (let i = 0; i < children.length; i++) {
      obj[`${children[i].value}`]=children[i].label
     
    }
    if (props.module === 'crm_leads') {
      console.log(props);
      setTabValue({
        default: 0,
        default_module: "leads",
        selected_data: props.selected_data,
        tab: [{
          name: obj['crm_leads'], value: "leads", index: 0,
          filter: {
            id: { $eq: props.selected_data.id }, is_lead: { $eq: "Y" }
          }
        }, {
          name: obj[`crm_contact`], value: "contacts", index: 1,
          filter: {
            associate_to_lead: { $eq: props.selected_data.id }, is_contact: { $eq: "Y" }
          }
        },{
          name: obj[`crm_company`], value: "account", index: 2, model: "crm_leads",
          filter: {
            id: { $eq: props.selected_data.id }
          }
        }, {
          name: obj[`crm_deals`], value: "deals", index: 3,
          filter: {
            lead_id: { $eq: props.selected_data.id }
          }
        }, {
          name: "Activity", value: "activity", index: 4,
          filter: {
            lead_id: { $eq: props.selected_data.id }
          }
        },
          // { name: "History", value: "history", index: 4 }
        ]
      })
    }
    if (props.module === 'crm_contact') {
      setTabValue({
        default: 0,
        default_module: "contacts",
        selected_data: props.selected_data,
        tab: [{
          name: obj[`crm_contact`], value: "contacts", index: 0,
          filter: {
            id: { $eq: props.selected_data.id }, is_contact: { $eq: "Y" }
          }
        }, {
          name: obj['crm_leads'], value: "leads", index: 1,
          filter: {
            id: { $eq: props.selected_data.associate_to_lead }, is_lead: { $eq: "Y" }
          }
        }, {
          name: obj[`crm_company`], value: "account", index: 2, model: "crm_leads",
          filter: {
            id: { $eq: props.selected_data.id }
          }
        }, {
          name: obj[`crm_deals`], value: "deals", index: 3,
          filter: {
            contact_id: { $eq: props.selected_data.id }
          }
        }, {
          name: "Activity", value: "activity", index: 4,
          filter: {
            contact_id: { $eq: props.selected_data.id }
          }
        },
          // { name: "History", value: "history", index: 5 }

        ]
      })
    } if (props.module === 'crm_company') {
      setTabValue({
        default: 0,
        default_module: "account",
        selected_data: props.selected_data,
        tab: [{
          name: obj[`crm_company`], value: "account", index: 0, model: "crm_company",
          filter: {
            id: { $eq: props.selected_data.id }
          }
        }, {
          name: obj['crm_leads'], value: "leads", index: 1,
          filter: {
            company_id: { $eq: props.selected_data.id }, is_lead: { $eq: "Y" }
          }
        },{
          name: obj[`crm_contact`], value: "contacts", index: 2,
          filter: {
            company_id: { $eq: props.selected_data.id },is_contact: { $eq: "Y" }
          }
        }, {
          name: obj[`crm_deals`], value: "deals", index: 3,
          filter: {
            company_id: { $eq: props.selected_data.id }
          }
        }, {
          name: "Activity", value: "activity", index: 4,
          filter: {
            company_id: { $eq: props.selected_data.id }
          }
        },
          // { name: "History", value: "history", index: 4 }
        ]
      })
    } if (props.module === 'crm_deals') {
      let tabs = []
      console.log(props.selected_data, "props.selected_data.lead_id")
      if (props.selected_data.lead_id !== null && props.selected_data.lead_id !== "null") {
        tabs = [{
          name: obj[`crm_deals`], value: "deals", index: 0,
          filter: {
            id: { $eq: props.selected_data.id }, is_active: { $eq: "Y" }
          }
        }, {
          name: obj['crm_leads'], value: "leads", index: 1,
          filter: {
            id: { $eq: props.selected_data.lead_id }, is_lead: { $eq: "Y" }
          }
        }, {
          name: "Activity", value: "activity", index: 2,
          filter: {
            deal_id: { $eq: props.selected_data.id }
          }
        },
          // { name: "History", value: "history", index: 3 }
        ]
      }
      else if (props.selected_data.contact_id !== null && props.selected_data.contact_id !== "null") {
        tabs = [{
          name: obj[`crm_deals`], value: "deals", index: 0,
          filter: {
            id: { $eq: props.selected_data.id }, is_active: { $eq: "Y" }
          }
        }, {
          name: obj[`crm_contact`], value: "contacts", index: 1,
          filter: {
            id: { $eq: props.selected_data.contact_id }, is_contact: { $eq: "Y" }
          }
        }, {
          name: "Activity", value: "activity", index: 2,
          filter: {
            deal_id: { $eq: props.selected_data.id }
          }
        },
          // { name: "History", value: "history", index: 3 }
        ]
      }
      else if (props.selected_data.company_id !== "0") {
        tabs = [{
          name: obj[`crm_deals`], value: "deals", index: 0,
          filter: {
            id: { $eq: props.selected_data.id }, is_active: { $eq: "Y" }
          }
        }, {
          name: obj[`crm_company`], value: "account", index: 1, model: "crm_company",
          filter: {
            id: { $eq: props.selected_data.company_id }, is_active: { $eq: "Y" }
          }
        }, {
          name: "Activity", value: "activity", index: 2,
          filter: {
            deal_id: { $eq: props.selected_data.id }
          }
        },
          // { name: "History", value: "history", index: 3 }
        ]
      }
      setTabValue({
        default: 0,
        default_module: "deals",
        selected_data: props.selected_data,
        tab: tabs
      })
    }
  }, [props])
  const handleClose = () => {
    props.closeCrm()
  };
  const tabhandleChange = (value) => {
    setTabValue((set) => {
      set.default = value
      return set
    })
    console.log(value, "valuevaluevaluevaluevaluevaluevalue")
  }

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={props.openCrm}
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
              Detail
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
        <List>
          {Object.keys(TabValue).length > 0 && <VerticalTabs selected_data={props.selected_data} module={props.module} value={value} process={process} handleClose={handleClose} TabValue={TabValue} tabhandleChange={tabhandleChange}></VerticalTabs>}
        </List>
      </Dialog>
    </React.Fragment>
  );
}
