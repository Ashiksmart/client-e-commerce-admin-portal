import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useSelection, useMemo, useDispatch } from 'react';
// @mui
import { Container, Stack, Typography, Button } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';

import {
  getToken,
  createProduct,
  getAllPartners,
  getProducts,
  findTemplate,
  createTemplate,
  parseStringToValidJSON,
  filterProducts,
  createTemplateFld,
  findTemplateFlds,
  findCategories,
  deleteProduct
} from '../services/AppService'
import { AppTable } from '../components/general/AppTable'
import AppDialog from '../components/general/AppDialog'
import Iconify from '../components/iconify';
import { updateProduct } from '../services/AppService';

import { useHistory, useNavigate } from 'react-router-dom'
import AppForm from './AppForm';
import AppDrawer from '../sections/@dashboard/app/AppDrawer';


export const saveProduct = (values, formValues) => {
  
  let createObj = {}

  

  createObj = {
    id: formValues.is_edit ? (formValues.initialValues.id) : "0",
    category_id: "1",
    account_id: getToken().account_id,
    partner_id: "1",
    sub_category_id: "1",
    is_active: values.is_active || "Y",
    details: {
      ...values
    },
    additional_info: {
    }
  }
  

  if (formValues.is_edit) {
    updateProduct(createObj)
      .then((createRes) => {
        
      })
      .catch((err) => {
        console.log(err);
      })
  }
  else {
    createProduct(createObj)
      .then((createRes) => {
        
      })
      .catch((err) => {
        console.log(err);
      })

  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [templateFlds, setTemplateFlds] = useState({});
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedData, setSelectedData] = useState({})
  const [openDialog, setOpenDialog] = useState(false);


  //  const [formSchema, setFormSchema] = useState({
  //   "data": {
  //     "template": "mobilecustomform",
  //     "type": "lead",
  //     "fields": [
  //       {
  //         "id": 6,
  //         "heading": "Default Field",
  //         "name": "defaultfield",
  //         "fields": [
  //           {
  //             "id": 2127,
  //             "model": "first_name",
  //             "label": "First Name",
  //             "placeholder": "First Name",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [
  //               {
  //                 "type": "required",
  //                 "params": [
  //                   "Required"
  //                 ]
  //               },
  //             ],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2140,
  //             "model": "last_name",
  //             "label": "Last Name",
  //             "placeholder": "Last Name",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2124,
  //             "model": "priority",
  //             "label": "Priority",
  //             "placeholder": "Lead Priority",
  //             "type": "TextInput",
  //             "model_type": "BigNumber",
  //             "validationType": "number",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2137,
  //             "model": "timezone",
  //             "label": "Timezone",
  //             "placeholder": "Timezone",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2134,
  //             "model": "dialed_count",
  //             "label": "dialed_count",
  //             "placeholder": "Lead Priority",
  //             "type": "TextInput",
  //             "model_type": "BigNumber",
  //             "validationType": "number",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2123,
  //             "model": "phone_number",
  //             "label": "Phone Number",
  //             "placeholder": "Phone Number",
  //             "type": "TextInput",
  //             "model_type": "BigNumber",
  //             "validationType": "number",
  //             "validations": [
  //               {
  //                 "type": "required",
  //                 "params": [
  //                   "field required"
  //                 ]
  //               }
  //             ],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": true,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": false,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2144,
  //             "model": "user",
  //             "label": "USER",
  //             "placeholder": "User Name",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2149,
  //             "model": "email",
  //             "label": "Email",
  //             "placeholder": "Email",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2147,
  //             "model": "address",
  //             "label": "Address",
  //             "placeholder": "Address",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2133,
  //             "model": "list_id",
  //             "label": "List Id",
  //             "placeholder": "List ID",
  //             "type": "TextInput",
  //             "model_type": "BigNumber",
  //             "validationType": "number",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2138,
  //             "model": "tags",
  //             "label": "Tags",
  //             "placeholder": "Tags",
  //             "type": "MultiSelectList",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": true,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2150,
  //             "model": "hopper_status",
  //             "label": "Hopper Status",
  //             "placeholder": "hopper_status",
  //             "type": "SelectList",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "0",
  //                 "value": "0"
  //               },
  //               {
  //                 "name": "1",
  //                 "value": "1"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2166,
  //             "model": "subdisposition",
  //             "label": "Subdisposition",
  //             "placeholder": "Subdisposition",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": false,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2165,
  //             "model": "lead_id",
  //             "label": "LEAD_ID",
  //             "placeholder": "Lead ID",
  //             "type": "TextInput",
  //             "model_type": "BigNumber",
  //             "validationType": "number",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": false,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2164,
  //             "model": "sms_notify",
  //             "label": "sms_notify",
  //             "placeholder": "sms_notify",
  //             "type": "TextInput",
  //             "model_type": "Number",
  //             "validationType": "number",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2151,
  //             "model": "wa_notify",
  //             "label": "wa_notify",
  //             "placeholder": "wa_notify",
  //             "type": "TextInput",
  //             "model_type": "Number",
  //             "validationType": "number",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2163,
  //             "model": "api_push",
  //             "label": "api_push",
  //             "placeholder": "api_push",
  //             "type": "TextInput",
  //             "model_type": "Number",
  //             "validationType": "number",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2159,
  //             "model": "email_notify",
  //             "label": "email_notify",
  //             "placeholder": "email_notify",
  //             "type": "TextInput",
  //             "model_type": "Number",
  //             "validationType": "number",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2160,
  //             "model": "disposition",
  //             "label": "Disposition",
  //             "placeholder": "disposition",
  //             "type": "SelectList",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "CallBack",
  //                 "value": "callback"
  //               },
  //               {
  //                 "name": "Answered",
  //                 "value": "answered"
  //               },
  //               {
  //                 "name": "Not Answer",
  //                 "value": "not_answer"
  //               },
  //               {
  //                 "name": "Ringing No Response",
  //                 "value": "RNR"
  //               },
  //               {
  //                 "name": "Busy",
  //                 "value": "busy"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2155,
  //             "model": "modified_date",
  //             "label": "Modified Date",
  //             "placeholder": "Modified Date",
  //             "type": "DatePicker",
  //             "model_type": "DateTime",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": false,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2154,
  //             "model": "created_at",
  //             "label": "Created At",
  //             "placeholder": "Created At",
  //             "type": "DatetimePicker",
  //             "model_type": "DateTime",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2158,
  //             "model": "created_by",
  //             "label": "Created By",
  //             "placeholder": "Created By",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2161,
  //             "model": "modified_by",
  //             "label": "Modified By",
  //             "placeholder": "Modified By",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2156,
  //             "model": "alt_number",
  //             "label": "Alternative Number",
  //             "placeholder": "Alternative Number",
  //             "type": "TextInput",
  //             "model_type": "BigNumber",
  //             "validationType": "number",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2162,
  //             "model": "deleted",
  //             "label": "deleted",
  //             "placeholder": "deleted",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2157,
  //             "model": "isclosed",
  //             "label": "isclosed",
  //             "placeholder": "isclosed",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2153,
  //             "model": "lead_status",
  //             "label": "Lead Status",
  //             "placeholder": "Lead Status",
  //             "type": "SelectList",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2152,
  //             "model": "source",
  //             "label": "Source",
  //             "placeholder": "source",
  //             "type": "SelectList",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [
  //               {
  //                 "type": "required",
  //                 "params": [
  //                   "field required"
  //                 ]
  //               }
  //             ],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": true,
  //             "multiple": false,
  //             "isdefaultfield": true,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           }
  //         ]
  //       },
  //       {
  //         "id": 4,
  //         "heading": "linkedfieldselect",
  //         "name": "linkedfieldselect",
  //         "fields": [
  //           {
  //             "id": 2102,
  //             "model": "select12",
  //             "label": "Select12",
  //             "placeholder": "",
  //             "type": "SelectList",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Parent",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "No Data",
  //                 "value": "val1"
  //               },
  //               {
  //                 "name": "Option Label 2",
  //                 "value": "val2"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2110,
  //             "model": "selectmulti",
  //             "label": "Selectmulti",
  //             "placeholder": "",
  //             "type": "MultiSelectList",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": true,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "No Data",
  //                 "value": "no data"
  //               },
  //               {
  //                 "name": "Option Label 2",
  //                 "value": "Option 2"
  //               },
  //               {
  //                 "name": "Option Label 3",
  //                 "value": "Option 3"
  //               },
  //               {
  //                 "name": "Option Label 4",
  //                 "value": "Option 4"
  //               },
  //               {
  //                 "name": "Option Label 5",
  //                 "value": "Option 5"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2100,
  //             "model": "textcld",
  //             "label": "Textcld",
  //             "placeholder": "",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "select12",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "val1",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2135,
  //             "model": "selectchld",
  //             "label": "Selectchld",
  //             "placeholder": "",
  //             "type": "SelectList",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "select12",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {
  //                   "val1": "1,3,4",
  //                   "val2": "6,8,6"
  //                 }
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "No Data",
  //                 "value": "no data"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2142,
  //             "model": "long_textchld",
  //             "label": "Long Textchld",
  //             "placeholder": "",
  //             "type": "LongTextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "select12",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "val1",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2113,
  //             "model": "checkbox12356",
  //             "label": "Checkbox12356",
  //             "placeholder": "",
  //             "type": "Checkbox",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "select12",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "val2",
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "checkbox12356",
  //                 "value": "checkbox12356"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2141,
  //             "model": "radiochld",
  //             "label": "Radiochld",
  //             "placeholder": "",
  //             "type": "RadioButton",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "select12",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {
  //                   "val1": "1,3,4",
  //                   "val2": "1,3,4"
  //                 }
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "Option Label 1",
  //                 "value": "Option 1"
  //               },
  //               {
  //                 "name": "Option Label 2",
  //                 "value": "Option 2"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2112,
  //             "model": "timechld",
  //             "label": "Timechld",
  //             "placeholder": "",
  //             "type": "TimePicker",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "select12",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "val1",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2114,
  //             "model": "date_timechld",
  //             "label": "Date timechld",
  //             "placeholder": "",
  //             "type": "DatetimePicker",
  //             "model_type": "DateTime",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "select12",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "val1",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2107,
  //             "model": "datechld",
  //             "label": "Datechld",
  //             "placeholder": "",
  //             "type": "DatePicker",
  //             "model_type": "Date",
  //             "validationType": "date",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "select12",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "val1",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           }
  //         ]
  //       },
  //       {
  //         "id": 0,
  //         "heading": "linkedwithcheckbox",
  //         "name": "linkedwithcheckbox",
  //         "fields": [
  //           {
  //             "id": 2093,
  //             "model": "checkboxpartent",
  //             "label": "Checkboxpartent",
  //             "placeholder": "",
  //             "type": "Checkbox",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Parent",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": {},
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "checkboxpartent",
  //                 "value": "checkboxpartent"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2121,
  //             "model": "textchkboxchld",
  //             "label": "Textchkboxchld",
  //             "placeholder": "",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "checkboxpartent",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "checkboxpartent",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2094,
  //             "model": "long_texthkboxchld",
  //             "label": "Long Texthkboxchld",
  //             "placeholder": "",
  //             "type": "LongTextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "checkboxpartent",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "checkboxpartent",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2119,
  //             "model": "radiohkboxchld",
  //             "label": "Radiohkboxchld",
  //             "placeholder": "",
  //             "type": "RadioButton",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "checkboxpartent",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {
  //                   "checkboxpartent": "0,9,8,7"
  //                 }
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "Option Label 1",
  //                 "value": "Option 1"
  //               },
  //               {
  //                 "name": "Option Label 2",
  //                 "value": "Option 2"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2095,
  //             "model": "selecthkboxchld",
  //             "label": "Selecthkboxchld",
  //             "placeholder": "",
  //             "type": "SelectList",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "checkboxpartent",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {
  //                   "checkboxpartent": "1,2,3,4"
  //                 }
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "No Data",
  //                 "value": "no data"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2116,
  //             "model": "checkboxhkboxchld",
  //             "label": "Checkboxhkboxchld",
  //             "placeholder": "",
  //             "type": "Checkbox",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "checkboxpartent",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "checkboxpartent",
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "",
  //                 "value": ""
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2118,
  //             "model": "timehkboxchld",
  //             "label": "Timehkboxchld",
  //             "placeholder": "",
  //             "type": "TimePicker",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "checkboxpartent",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "checkboxpartent",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2111,
  //             "model": "datehkboxchld",
  //             "label": "Datehkboxchld",
  //             "placeholder": "",
  //             "type": "DatePicker",
  //             "model_type": "Date",
  //             "validationType": "date",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "checkboxpartent",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "checkboxpartent",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2106,
  //             "model": "date_timehkboxchld",
  //             "label": "Date timehkboxchld",
  //             "placeholder": "",
  //             "type": "DatetimePicker",
  //             "model_type": "DateTime",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "checkboxpartent",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "checkboxpartent",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           }
  //         ]
  //       },
  //       {
  //         "id": 2,
  //         "heading": "linkedwithradio",
  //         "name": "linkedwithradio",
  //         "fields": [
  //           {
  //             "id": 2096,
  //             "model": "radioqwer",
  //             "label": "Radioqwer",
  //             "placeholder": "",
  //             "type": "RadioButton",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Parent",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "Option Label 1",
  //                 "value": "v1"
  //               },
  //               {
  //                 "name": "Option Label 2",
  //                 "value": "v2"
  //               },
  //               {
  //                 "name": "Option Label 3",
  //                 "value": "v3"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2104,
  //             "model": "textrdiochld",
  //             "label": "Textrdiochld",
  //             "placeholder": "",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "radioqwer",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "v1",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2103,
  //             "model": "long_textrdiochld",
  //             "label": "Long Textrdiochld",
  //             "placeholder": "",
  //             "type": "LongTextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "radioqwer",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "v2",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2101,
  //             "model": "radioardiochld",
  //             "label": "Radioardiochld",
  //             "placeholder": "",
  //             "type": "RadioButton",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "radioqwer",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {
  //                   "v1": "1,2,3",
  //                   "v2": "4,5,6",
  //                   "v3": "7,8,9"
  //                 }
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "Option Label 1",
  //                 "value": "Option 1"
  //               },
  //               {
  //                 "name": "Option Label 2",
  //                 "value": "Option 2"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2109,
  //             "model": "selectrdiochld",
  //             "label": "Selectrdiochld",
  //             "placeholder": "",
  //             "type": "SelectList",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "radioqwer",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {
  //                   "v1": "1,2,3",
  //                   "v2": "4,5,6",
  //                   "v3": "7,8,9"
  //                 }
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "No Data",
  //                 "value": "no data"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2105,
  //             "model": "daterdiochld",
  //             "label": "Daterdiochld",
  //             "placeholder": "",
  //             "type": "DatePicker",
  //             "model_type": "Date",
  //             "validationType": "date",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "radioqwer",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "v1",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2148,
  //             "model": "checkboxrdiochld",
  //             "label": "Checkboxrdiochld",
  //             "placeholder": "",
  //             "type": "Checkbox",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "radioqwer",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "v1",
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "checkboxrdiochld",
  //                 "value": "checkboxrdiochld"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2143,
  //             "model": "timerdiochld",
  //             "label": "Timerdiochld",
  //             "placeholder": "",
  //             "type": "TimePicker",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "radioqwer",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "v2",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2145,
  //             "model": "datetimerdoichld",
  //             "label": "Datetimerdoichld",
  //             "placeholder": "",
  //             "type": "DatetimePicker",
  //             "model_type": "DateTime",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": true,
  //               "link_type": "Child",
  //               "linked_to": "radioqwer",
  //               "link_property": {
  //                 "isShow": true,
  //                 "isShowvalue": "v2",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           }
  //         ]
  //       },
  //       {
  //         "id": 1,
  //         "heading": "newcat",
  //         "name": "newcat",
  //         "fields": [
  //           {
  //             "id": 2167,
  //             "model": "selectmultcat",
  //             "label": "Selectmultcat",
  //             "placeholder": "",
  //             "type": "MultiSelectList",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": true,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "No Data",
  //                 "value": "no data"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2097,
  //             "model": "date321",
  //             "label": "Date321",
  //             "placeholder": "",
  //             "type": "DatePicker",
  //             "model_type": "Date",
  //             "validationType": "date",
  //             "validations": [],
  //             "readonly": true,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2108,
  //             "model": "date_time321",
  //             "label": "Date time321",
  //             "placeholder": "",
  //             "type": "DatetimePicker",
  //             "model_type": "DateTime",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2136,
  //             "model": "checkboxs",
  //             "label": "Checkboxs",
  //             "placeholder": "",
  //             "type": "Checkbox",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "checkboxs",
  //                 "value": "checkboxs"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2128,
  //             "model": "text1",
  //             "label": "Text1",
  //             "placeholder": "text123",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2129,
  //             "model": "long_text1",
  //             "label": "Long Text1",
  //             "placeholder": "long_text1",
  //             "type": "LongTextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2130,
  //             "model": "radio1",
  //             "label": "Radio1",
  //             "placeholder": "",
  //             "type": "Checkbox",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "radio1",
  //                 "value": "radio1"
  //               },
  //               {
  //                 "name": "radio1",
  //                 "value": "radio1"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2139,
  //             "model": "select1",
  //             "label": "Select1",
  //             "placeholder": "",
  //             "type": "SelectList",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "No Data",
  //                 "value": "no data"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2125,
  //             "model": "checkbox1",
  //             "label": "Checkbox1",
  //             "placeholder": "",
  //             "type": "RadioButton",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "checkbox1",
  //                 "value": "checkbox1"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 2132,
  //             "model": "time1",
  //             "label": "Time1",
  //             "placeholder": "",
  //             "type": "TimePicker",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": true,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": true
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           }
  //         ]
  //       },
  //       {
  //         "id": 3,
  //         "heading": "sel",
  //         "name": "sel",
  //         "fields": [
  //           {
  //             "id": 2120,
  //             "model": "selectmul",
  //             "label": "Selectmul",
  //             "placeholder": "",
  //             "type": "MultiSelectList",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": true,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": [
  //               {
  //                 "name": "No Data",
  //                 "value": "no data"
  //               }
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         "id": 5,
  //         "heading": "text",
  //         "name": "text",
  //         "fields": [
  //           {
  //             "id": 2098,
  //             "model": "text12",
  //             "label": "Text12",
  //             "placeholder": "",
  //             "type": "TextInput",
  //             "model_type": "Text",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2099,
  //             "model": "text3",
  //             "label": "Text3",
  //             "placeholder": "",
  //             "type": "TextInput",
  //             "model_type": "LongText",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2115,
  //             "model": "text4",
  //             "label": "Text4",
  //             "placeholder": "",
  //             "type": "TextInput",
  //             "model_type": "SmallNumber",
  //             "validationType": "number",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2131,
  //             "model": "text5",
  //             "label": "Text5",
  //             "placeholder": "",
  //             "type": "TextInput",
  //             "model_type": "Number",
  //             "validationType": "number",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2146,
  //             "model": "date_time1",
  //             "label": "Date time1",
  //             "placeholder": "",
  //             "type": "DatetimePicker",
  //             "model_type": "DateTime",
  //             "validationType": "string",
  //             "validations": [],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2126,
  //             "model": "text6",
  //             "label": "Text6",
  //             "placeholder": "",
  //             "type": "TextInput",
  //             "model_type": "BigNumber",
  //             "validationType": "number",
  //             "validations": [
  //               {
  //                 "type": "min",
  //                 "params": [
  //                   1,
  //                   "Date1 cannot be less than 1"
  //                 ]
  //               },
  //               {
  //                 "type": "max",
  //                 "params": [
  //                   10,
  //                   "Date1 cannot be less than 10"
  //                 ]
  //               }
  //             ],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           },
  //           {
  //             "id": 2122,
  //             "model": "date1",
  //             "label": "Date1",
  //             "placeholder": "",
  //             "type": "DatePicker",
  //             "model_type": "Date",
  //             "validationType": "date",
  //             "validations": [
  //               {
  //                 "type": "min",
  //                 "params": [
  //                   "2023-08-01",
  //                   "Date1 cannot be less than 2023-08-01 "
  //                 ]
  //               },
  //               {
  //                 "type": "max",
  //                 "params": [
  //                   "2023-09-30",
  //                   "Date1 cannot be less than 2023-09-30 "
  //                 ]
  //               }
  //             ],
  //             "readonly": false,
  //             "disabled": false,
  //             "required": false,
  //             "multiple": false,
  //             "isdefaultfield": false,
  //             "hasDefault": true,
  //             "show_on_agent": {
  //               "isShow": true,
  //               "filter": false
  //             },
  //             "show_on_admin": {
  //               "isShow": false,
  //               "filter": false
  //             },
  //             "link": {
  //               "is_link": false,
  //               "link_type": "",
  //               "linked_to": "",
  //               "link_property": {
  //                 "isShow": false,
  //                 "isShowvalue": "",
  //                 "value": {}
  //               }
  //             },
  //             "values": []
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // })

  let [pageinfo, setpageinfo] = useState(
    {
      title: "Products",
      Headers: [
        {
          title: "Id",
          checkbox: false,
          avatar: false,
          sort: false,
          value: 'id',
          action: false
        },
        {
          title: "Name",
          checkbox: false,
          avatar: false,
          sort: false,
          value: 'details.product_title',
          action: false
        },
        {
          title: "Brand",
          checkbox: false,
          avatar: false,
          sort: false,
          value: "details.brand",
          action: false
        },
        {
          title: "Price",
          checkbox: false,
          avatar: false,
          sort: false,
          value: "details.price",
          action: false
        },
        {
          title: "Offer Percentage",
          checkbox: false,
          avatar: false,
          sort: false,
          value: "details.offer_percent",
          action: false
        },
        {
          title: "Actions",
          checkbox: false,
          avatar: false,
          sort: false,
          value: "",
          action: true,
          actionValue: [
            { name: "Edit", value: 'edit' },
            { name: "Delete", value: 'delete' }
          ]
        }
      ]
    })

  let prodObj = {
    account_id: getToken().account_id,
    partner_id: "1",
    category_id: "1",
    sub_category_id: "1",
    details: {
      product_title: "REDMI 10 Power (Sporty Orange, 128 GB)  (8 GB RAM)",
      brand: "Redmi",
    },
    additional_info: {
      model_name: "Redmi 10 Power",
      images: [
        "https://m.media-amazon.com/images/I/81BJsETLICL._AC_UY218_.jpg",
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/f/i/y/-original-imaghzc8aktnap5e.jpeg?q=70"
      ],
      price: "₹18,999",
      discount: "₹13,499",
      offer_percent: "28%off",
      rating: "4.2",
      rating_nos: "20001",
      os: "OxygenOS",
      about: `Camera: 50MP Main Camera with Sony IMX890 (OIS supported), `,
      delivery_details: {
        is_free: "true",
        estimated_tod: "2023-05-22T02:09 PM",
      },
      supplier_details: {
        name: "Darshita Electronics",
        email: "darshita@gmail.com",
        phNo: "34324343434",
        ratings: "4.5",
        about: "Darshita Electronics is committed to providing each customer with the highest standard of customer service.",
        stock: "In Stock",
      }
    },
    is_active: 'Y',
  }

  let tempObj = {
    id: "10",
    account_id: getToken().account_id,
    partner_id: "1",
    name: "orders_assign",
    type: "costing",
    is_active: "Y",
    is_deleted: "N"
  }

  let tempCreateObj = {
    template_id: "1",
    account_id: getToken().account_id,
    partner_id: "1",
    catagory: "1",
    model: "is_active",
    label: "Is Active",
    placeholder: "Is Active",
    type: "Checkbox",
    model_type: "string",
    validation_type: "String",
    validations: {
      validations: [
        {
          type: "required",
          params: [
            "Field required"
          ]
        }
      ],
    },
    readonly: "N",
    disabled: "N",
    required: "Y",
    multiple: "N",
    link: {
      is_link: "N",
      link_type: "",
      linked_to: "",
      link_property: {
        isShow: "N",
        isShowvalue: "",
        value: {}
      }
    },
    values: {
      values: [],
    },
    is_delete: 'N'
  }

  const createProd = () => {
    createProduct(prodObj)
      .then((res) => {
        
      })
      .catch((err) => {
        console.log(err);
      })
  }
  const createTemp = () => {
    createTemplateFld(tempObj)
      .then((res) => {
        
      })
      .catch((err) => {
        console.log(err);
      })
  }
  const router = useNavigate()


  const [isopen, setisopen] = useState(false)
  const [deleteData, setdeleteData] = useState({})

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [count, setcount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    filterPageData(page, limit)
  }, [page, limit])

  const handlePageChange = (event, newPage) => {
    
    setPage(newPage + 1)
  }

  const handleRowsPerPageChange = (event) => {
    
    // setRowsPerPage(event.target.value)
    // setLimit(parseInt(event.target.value, 10))

    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(1);
  }

  // const paginatedData = useMemo(() => {
  //   const startIndex = page * rowsPerPage;
  //   const endIndex = startIndex + rowsPerPage;
  //   return products.slice(startIndex, endIndex);
  // }, [products, page, rowsPerPage]);

  // const usersIds = useMemo(() => {
  //   paginatedData.map(a => a._id)
  // }, [paginatedData])

  // const handlePageChange = (event, value) => {
  //   
  //   if (value !== 0) {
  //     filterData(rowsPerPage * value, search)
  //   } else {
  //     filterData(value, search)
  //   }
  //   setPage(value);
  // }

  // const handleRowsPerPageChange = (event) => {
  //   setRowsPerPage(event.target.value);
  //   setPage(0)
  //   filterData(0, search, event.target.value)
  // }

  // const filterData = async (pageNo, search, rows) => {
  //   try {
  //     
  //     let reqFilter = {
  //       filters: {
  //         page: pageNo === undefined ? 1 : pageNo,
  //         limit: rowsPerPage,
  //       }
  //     }
  //     // page 1 -- limit 40

  //     if (search !== '') {
  //       reqFilter.search = search
  //     }
  //   }
  //   catch (err) {
  //     
  //   }
  // }

  // const getsearchdata = (value) => {
  //   setPage(0)
  //   filterData(0, value)
  //   setsearch(value)
  // }
  const filterPageData = (page, limit) => {
    let reqFilter = {
      filters: {
      },
      page: page,
      limit: limit
    }
    filterProducts(reqFilter)
      .then((res) => {
        let dataArray = res.records.map(item => {
          if (item.details) {
            item.details = JSON.parse(item.details);
          }
          if (item.additional_info) {
            item.additional_info = JSON.parse(item.additional_info);
          }
          return item;
        });
        
        if (dataArray.length > 0) {
          setcount(dataArray.length)
          setProducts(dataArray);
        } else if (dataArray.length === 0) {
          setcount(0)
          setPage(1)
          setProducts([]);
        }
      })
      .catch((err) => {
        console.log(err);
      })

  }

  const tableActions = {
    edit: (e) => {
      
      setTemplateFlds({
        ...templateFlds,
        initialValues: {},
        is_edit: false
      })
      getProducts({
        id: e.id.toString()
      }).then((res) => {
        let dataArray = res.records[0]
        
        // let details = dataArray[0].details
        // let additional_info = dataArray[0].additional_info
        // let supp_details = additional_info.supplier_details
        // let del_details = additional_info.delivery_details

        // delete additional_info.supplier_details
        delete dataArray.details.id
        if (dataArray.details) {
          dataArray.details = JSON.parse(dataArray.details);
        }

        setTemplateFlds({
          initialValues: {
            id: dataArray.id,
            is_active: dataArray.is_active,
            ...dataArray.details,
            // ...additional_info,
            // ...del_details,
            // ...supp_details
          },
          data: { ...templateFlds.data },
          is_edit: true
        })
        setDrawerOpen(true)
      })
        .catch((err) => {
          console.log(err);
        })

    },
    delete: (e, n) => {
      setSelectedData(e)
      setOpenDialog(true)
    },
  }



  const deleteSelectedData = () => {
    
    deleteProduct({
      id: selectedData.id.toString(),
      is_active: 'N'
    })
      .then((res) => {
        
        if (res.statusCode == 200) {
          setOpenDialog(false)
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }


  const close = async (value) => {
    if (value === 'save') {
      // let categoriesdelete = await dispatch(deletecategories(deleteData._id))

      // if (categoriesdelete.status === 200) {
      //   setdeleteData({})
      //   setisopen(false)
      //   getsearchdata('')
      // }

    } else {
      setdeleteData({})
      setisopen(false)
    }

  }

  // const handleChangeProducts = (obj) => {
  //   filterProducts(obj)
  //     .then((res) => {
  //       let dataArray = res.records.map(item => {
  //         if (item.details) {
  //           item.details = JSON.parse(item.details);
  //         }
  //         if (item.additional_info) {
  //           item.additional_info = JSON.parse(item.additional_info);
  //         }
  //         return item;
  //       });
  //       setProducts(dataArray)
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  // }

  const fetchProducts = (obj) => {
    getProducts(obj)
      .then((res) => {
        // 
        // let dataArray =  parseStringToValidJSON(res.records)
        let dataArray = res.records.map(item => {
          if (item.details) {
            item.details = JSON.parse(item.details);
          }
          if (item.additional_info) {
            item.additional_info = JSON.parse(item.additional_info);
          }
          return item;
        });
        setProducts(dataArray)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const fetAllTemplates = () => {
    const allTemplates = findTemplate({})
    const allCategories = findCategories({})
    allCategories
      .then((catRes) => {
        
        catRes.records.map((item) => {
          if (item.category_name == "Ecommerce") {
            if (item.sub_category) {
              item.sub_category = JSON.parse(item.sub_category);
            }
            setCategories(item.sub_category.items)
          }
        })
        // Fetch Templates 
        allTemplates
          .then((tempRes) => {
            let templatesObj = {}
            let sort = [{
              column: "position",
              order: 'asc'
            }]
            const allTemplateFlds = findTemplateFlds({
              template_id: tempRes.records[0].id,
              page: 1,
              limit: 30,
              sort
            })

            allTemplateFlds
              .then((res) => {
                let dataArray = res.records.map(item => {
                  if (item.validations) {
                    item.validations = JSON.parse(item.validations);
                  }
                  if (item.values) {
                    item.values = JSON.parse(item.values);
                  }
                  if (item["model"] == "in_stock") {
                    let stockObj = [
                      {
                        name: "in_stock",
                        value: "In Stock",
                      },
                      {
                        name: "out_of_stock",
                        value: "Out of Stock",
                      },
                    ]
                    item.values = stockObj
                  }
                  if (item["model"] == "is_free") {
                    let stockObj = [
                      {
                        name: "is_free",
                        value: "Is Free",
                      },
                    ]
                    item.values = stockObj
                  }
                  if (item["model"] == "sub_category_id") {
                    
                    item.values = categories
                  }
                  return item;
                });
                // eslint-disable-next-line react-hooks/exhaustive-deps
                tempCreateObj = {
                  fields: [
                    {
                      name: tempRes.records[0].name,
                      heading: tempRes.records[0].name,
                      fields: dataArray
                    }
                  ]
                }
                setTemplateFlds(tempCreateObj)
                
              })
              .catch((err) => {
                console.log(err);
              })
          })
          .catch((err) => {
            console.log(err);
          })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  useEffect(() => {
    // createProd()
    // createTemp()
    fetAllTemplates()
  }, [])


  useEffect(() => {
    fetchProducts({})
  }, [])

  return (
    <>
      <Helmet>
        <title>Products</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Products
          </Typography>
          <Button onClick={() => {
            setTemplateFlds({
              ...templateFlds,
              initialValues: {},
              is_edit: false
            })
            fetAllTemplates()
            setDrawerOpen(true)
          }} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Product
          </Button>
        </Stack>

        <AppTable
          header={pageinfo.Headers}
          actionsButtons={tableActions}
          count={count}
          items={products}
          page={page - 1}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        // onDeselectAll={usersSelection.handleDeselectAll}
        // onDeselectOne={usersSelection.handleDeselectOne}
        // onSelectAll={usersSelection.handleSelectAll}
        // onSelectOne={usersSelection.handleSelectOne}
        // selected={usersSelection.selected} 
        />

        {/* <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack> */}

        {/* <ProductList products={PRODUCTS} /> */}
        {/* <ProductCartWidget /> */}
      </Container>
      <AppDialog
        dialogTitle={"Confirm"}
        dialogContent={"Are you Sure want to Proceed ?"}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleDelete={() => deleteSelectedData()}
      />
      <AppDrawer
        children={
          <AppForm
            formSchema={templateFlds}
          />
        }
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
    </>
  );
}
