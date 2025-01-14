import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useSelection, useMemo, useDispatch } from 'react';
// @mui
import { Container, Stack, Typography, Button } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';
import { AppTable } from '../components/general/AppDataGrid'
import AppDialog from '../components/general/AppDialog'
import Iconify from '../components/iconify';
import ServiceProxy from '../services/serviceProxy'
import { useHistory, useNavigate } from 'react-router-dom'
import AppSubDialog from '../components/general/SubformDialog';
import AppDrawer from '../sections/@dashboard/app/AppDrawer';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { CustomFieldhandel } from '../utils/CustomformStr'
import AppSnacks from '../components/general/AppSnacks';

import {
  getPermissions,
  getToken,

} from '../services/AppService'
import { Loop } from '@mui/icons-material';
export default function AppSubForm(props) {
  const { templateApiFlds,
    handleSubFormSubmit } = props
  // const [TemplateApiFlds, setTemplateApiFlds] = useState({})
  const [openDialog, setOpenDialog] = useState(true);
  const [editData, setEditData] = useState([])
  const [snackProps, setSnackProps] = useState({
    snackOpen: false,
    setSnackOpen: () => { },
    severity: "",
    message: "",
  });


  let [fieldDyanamicBind, setfieldDyanamicBind] = useState({})
  const [mode, setmode] = useState({
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete",
    PASSWORD: "password",
    FILTER: "filter",
    SEARCH: "search",
    RESET: "reset"
  });


  useEffect(() => {
    // dynamicDropdownload()
  }, [])

  let dynamicDropdownload = async () => {
    await ServiceProxy.partner.find(1, 100, "asc", { active: "Y" }).then((res) => {
      if (res.status == 200) {
        setfieldDyanamicBind((set) => {
          set.partner_id = res.data.data.map((elm) => {
            return { name: elm.name, value: elm.partner_id }
          })
          return set
        })
      }

    })

    await ServiceProxy.userGroup.find(1, 100, "asc", { active: 'Y', partner_id: getToken().partner_id }).then((res) => {
      if (res.status == 200) {
        console.log("sssssssssssssssssssssssssssss", res.status)
        setfieldDyanamicBind((set) => {
          set.user_group = res.data.data.map((elm) => {
            return { name: elm.name, value: elm.id }
          })
          return set
        })
      }
      fetchtemplate()
    })

  }

  let fetchtemplate = async () => {
    try {
      let template = await ServiceProxy.business.find('b2b', 'template', 'view', {
        name: { "$in": ["USR_CU"] }
      }, [], 1, 3)

      if (template.cursor.totalRecords == 1) {
        let sort = [{
          column: "position",
          order: 'asc'
        }]
        template.records.forEach(async (elm) => {
          let templatefields = await ServiceProxy.business.find('b2b', 'templates_field', 'view', {
            template_id: { $eq: elm.id.toString() },
            account_id: { $eq: getToken().account_id }
          }, [], null, null,sort)

          if (templatefields.cursor.totalRecords > 0) {
            let templateData = templatefields.records
            if (elm.name == 'USR_CU') {
              CustomFieldhandel(templateData, fieldDyanamicBind)
                .then((res) => {

                  // setTemplateApiFlds({
                  //   "template": elm,
                  //   "fields": res.field
                  // })
                  let header = res.header
                  header.push({
                    filterable: false,
                    title: "Actions",
                    checkbox: true,
                    avatar: false,
                    sort: false,
                    value: "actions",
                    actionValue: [
                      { name: "Edit", value: 'edit' },
                      { name: "Delete", value: 'delete' },
                      { name: "Password", value: 'password' }
                    ]
                  })


                })

            }
          }
        })
      }

    } catch (error) {
      console.log(error)
    }
  }

  let confirm = async (data) => {
    console.log(data, "eeeeeeeeeeeeeeeeeeeeeeeeee")
    setOpenDialog(false)
    handleSubFormSubmit(data)
  }

  return (
    <>
      <Button onClick={() => {
        setEditData([])
        setOpenDialog(true)
      }} >Create</Button>
      <Button onClick={() => {
        setOpenDialog(true)
        setEditData([
          {
            "first_name": "ragul",
            "last_name": "raghavan",
            "roles": "Employee",
            "email": "mail2hariharan99@gmail.com",
            "phone_number": "904255044990",
            "password": "wwwwwww44",
            "user_group": "1"
          },
          {
            "first_name": "ragul",
            "last_name": "raghavan",
            "roles": "Admin",
            "email": "ragulraghavan75066@gmail.com",
            "phone_number": "9042044990",
            "password": "wwwwwww44",
            "user_group": "1"
          },
          {
            "first_name": "ragul",
            "last_name": "raghavan",
            "roles": "Admin",
            "email": "ragulraghavan75066@gmail.com",
            "phone_number": "9042044990",
            "password": "wwwwwww44",
            "user_group": "13"
          }]
        )
      }}>Edit</Button>
      {openDialog && <AppSubDialog
        dialogTitle={"Confirm"}
        editData={editData}
        dialogContent={"Are you Sure want to Proceed ?"}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        mode={mode}
        confirm={confirm}
        TemplateApiFlds={templateApiFlds}
      />}

      <AppSnacks
        snackProps={snackProps}
        setSnackProps={setSnackProps}
      />
    </>
  );
}
