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
import AppForm from './AppForm';
import AppDrawer from '../sections/@dashboard/app/AppDrawer';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { CustomFieldhandel } from '../utils/CustomformStr'
import AppSnacks from '../components/general/AppSnacks';
import Constants from '../constants/index'
import { SnackMess } from '../constants/SnackMessages';
import { useLocation } from 'react-router-dom';
import { getTitle } from '../utils/getTitle';
import jwt_decode from "jwt-decode";
import {
  getPermissions,
  getToken,

} from '../services/AppService'
import { useSelector } from "react-redux"
import CrmFullScreenDialog from '../components/Crm/crm-dialog'
export default function ProductsPage(props) {
  const {
    label,
    value,
    process
  } = props
  const currentPath = useLocation();
  const [domain, setdomain] = useState('')
  let AppPerState = useSelector(state => state.permisson.permission)

  const [permit, setPermit] = useState(getPermissions())
  const [permitEl, setPermitEl] = useState(false)
  const [items, setitems] = useState([]);
  const [openCrm, setopenCrm] = useState(false)
  const [filterName, setFilterName] = useState('');
  const [templateFlds, setTemplateFlds] = useState({});

  const [TemplateApiFlds, setTemplateApiFlds] = useState({})

  const [templatepass, settemplatepass] = useState({});

  const [templatefilter, settemplatefilter] = useState({});


  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedData, setSelectedData] = useState({})
  const [openDialog, setOpenDialog] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [uploadIds, setUploadIds] = useState([]);
  const [snackProps, setSnackProps] = useState({
    snackOpen: false,
    setSnackOpen: () => { },
    severity: "",
    message: "",
  });
  let [pageinfo, setpageinfo] = useState({ title: label }
  )
  const [appDialog, setappDialog] = useState({
    header: "",
    content: "",
    action: ""
  })
  let router = useNavigate()

  let [fieldDyanamicBind, setfieldDyanamicBind] = useState({})
  let [page, setPage] = useState(1);
  let [sort, setsort] = useState([{
    column: "id",
    order: 'asc'
  }]);
  let [roles, setroles] = useState(getToken().partner_id == null ? "Admin" : "SubAdmin")
  let [def_filter, setdef_filter] = useState({ account_id: { $eq: getToken().account_id }, partner_id: { $eq: getToken().partner_id }, active: { $eq: "Y" }, roles: { $in: ["Employee", roles] } })
  let [filter, setfilter] = useState(def_filter)
  let [active, setactive] = useState('Y')
  let [count, setcount] = useState(0);
  let [rowsPerPage, setRowsPerPage] = useState(5);
  const [mode, setmode] = useState({
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete",
    PASSWORD: "password",
    FILTER: "filter",
    SEARCH: "search",
    RESET: "reset",
    APPROVAL: "approval"
  });
  const [id, setid] = useState(0)
  const [editdata, seteditdata] = useState({})
  const [AppPermission, SetAppPermission] = useState({
    create: false,
    update: false,
    delete: false
  })
  useEffect(() => {
    dynamicDropdownload()
    checkPermissions()
    setdomain(window.location.protocol + "//" + window.location.host)
    if (AppPerState.indexOf(`${process}_${value}:create`) != -1) {
      SetAppPermission((set) => {
        set.create = true
        return set
      })
    }
    if (AppPerState.indexOf(`${process}_${value}:update`) != -1) {
      SetAppPermission((set) => {
        set.update = true
        return set
      })
    }
    if (AppPerState.indexOf(`${process}_${value}:delete`) != -1) {
      SetAppPermission((set) => {
        set.delete = true
        return set
      })
    }

  }, [])


  const checkPermissions = () => {
    setPermitEl({
      ...permitEl,
      ...permit?.usergroup
    })
  }
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
            template_id: { $eq: elm.id.toString() }, account_id: { "$eq": getToken().account_id }
          }, [], null, null, sort)

          if (templatefields.cursor.totalRecords > 0) {
            let templateData = templatefields.records
            if (elm.name == 'USR_CU') {
              CustomFieldhandel(templateData, fieldDyanamicBind)
                .then((res) => {

                  if (getToken().partner_id !== null && getToken().partner_id !== "") {
                    res.field.forEach((elm) => {
                      elm.fields.forEach((elem) => {
                        if (elem.model == "roles") {
                          elem.values = [
                            {
                              "name": "Admin",
                              "value": "SubAdmin"
                            },
                            {
                              "name": "Employee",
                              "value": "Employee"
                            }
                          ]
                        }
                      })
                    })
                  }

                  setTemplateApiFlds({
                    "template": elm,
                    "fields": res.field
                  })
                  let header = res.header
                  header.push({
                    filterable: false,
                    title: "Actions",
                    checkbox: true,
                    avatar: false,
                    sort: false,
                    value: "actions",
                    actionValue: [
                      ...(AppPermission.update ? [{ name: "Edit", value: 'edit' }] : []),
                      ...(AppPermission.delete ? [{ name: "Delete", value: 'delete' }] : []),
                      { name: "Password", value: 'password' },
                      { name: "Approval", value: 'approval', condition: { prop: "additional_info.auth_req", value: "N" } },
                    ]
                  })
                  console.log(header, "headerheaderheader")
                  setpageinfo({
                    title: label,
                    Headers: header
                  })


                  let find_password = templatefields.records.find((elm) => {
                    if (elm.model === 'password') {
                      return elm
                    }
                  })
                  CustomFieldhandel([find_password])
                    .then((res) => {
                      settemplatepass({
                        "template": elm,
                        "fields": res.field
                      })
                    })

                })
              CustomFieldhandel(templateData, fieldDyanamicBind, getToken().partner_id === null && getToken().roles !== 'Client' ? 'Brand' : getToken().partner_id !== null ? 'Partner' : '')
                .then((res) => {

                  if (getToken().partner_id !== null && getToken().partner_id !== "") {
                    res.field.forEach((elm) => {
                      elm.fields.forEach((elem) => {
                        if (elem.model == "roles") {
                          elem.type = "MultiSelectList"
                          elem.validationType = "array"
                          elem.values = [
                            {
                              "id": "SubAdmin",
                              "name": "Admin",
                              "value": "Admin"
                            },
                            {
                              "id": "Employee",
                              "name": "Employee",
                              "value": "Employee"
                            }
                          ]
                        }
                      })
                    })
                  }

                  settemplatefilter({
                    template: elm,
                    fields: res.field
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



  useEffect(() => {
    getdataFromApi()
  }, [page, rowsPerPage, filter])

  let getdataFromApi = async () => {
    try {
      let fetch = await ServiceProxy.business.find("b2b", "user", "view",
        filter, [], page, rowsPerPage, sort)
      if (fetch.records.length > 0) {
        console.log(fetch.records);
        setitems(fetch.records)
        console.log(fetch.records);
        setcount(fetch.cursor.totalRecords)
        setDrawerOpen(false)
      } else if (fetch.records.length == 0) {
        setitems([])
        setcount(0)
        setDrawerOpen(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // need
  const handlePageChange = (value) => {
    setPage(value + 1);
  }
  // need
  const handleRowsPerPageChange = (event, value) => {
    setRowsPerPage(event);
  }
  // need
  const tableActions = {
    edit: (e) => {

      setTemplateFlds((set) => {
        let template_data = structuredClone(TemplateApiFlds)
        template_data.fields.forEach((elm) => {
          // if (elm.name == "Default Field") {
          elm.fields.forEach((elem, i) => {
            if (elem.model == "email" || elem.model == "roles") {
              elem.disabled = true
            }
            if (elem.model == "password") {
              delete elm.fields[i]
            }
          })
          // }
        })
        let imgUrls = getImageFromDocId(e.avatar_url)
        imgUrls.then((res) => {
          setImageList(res.records)

        })
          .catch((err) => {
            console.log(err);
          })

        setSelectedData(e)
        return {
          ...template_data,
          initialValues: e,
          action: mode.UPDATE,
          skipped: ['roles', 'email']
        }

      })
      setDrawerOpen(true)
    },
    delete: (e, n) => {
      // action(e.id,mode.DELETE)
      setappDialog({
        header: "Confirm",
        content: "Are you Sure want to Proceed ?",
        action: mode.DELETE
      })
      setid(e.id)
      setOpenDialog(true)
    },
    password: (e, n) => {
      seteditdata(e)
      setTemplateFlds({
        ...templatepass,
        initialValues: {},
        action: mode.PASSWORD,
        skipped: []
      })
      setDrawerOpen(true)
    },
    approval: (e) => {
      console.log(e, "eeee")
      seteditdata(e)
      setappDialog({
        header: "Confirm",
        content: "Are you Approved to Proceed ?",
        action: mode.APPROVAL
      })
      setOpenDialog(true)
    }
  }

  let Openpopup__ = () => {
    router('/builder/workflow/subform')
  }

  // need

  const deleteSelectedData = async (modetype) => {
    if (modetype == mode.DELETE) {
      action(id, mode.DELETE)
    } else if (modetype == mode.APPROVAL) {
      console.log("COMMING")
      let authreq = JSON.parse(editdata.additional_info)
      authreq.auth_req = "Y"
      let userupdate = {
        id: editdata.id,
        additional_info: authreq
      }
      await action(userupdate, mode.UPDATE)
      await action(editdata, mode.APPROVAL)
      seteditdata({})
    }
    setOpenDialog(false)
    setappDialog({
      header: "",
      content: "",
      action: ""
    })
  }

  let Openpopup = () => {
    setImageList([])
    setTemplateFlds({
      ...TemplateApiFlds,
      initialValues: {},
      action: mode.CREATE,
      skipped: []
    })
    setDrawerOpen(true)
  }

  let action = async (data, typeMode) => {
    try {
      if (typeMode == mode.CREATE) {
        if (getToken().partner_id !== null && getToken().partner_id !== "") {
          data.partner_id = getToken().partner_id
        }
        let role = data.role
        delete data.role
        data.auth = "N"
        data.additional_info = { auth_req: "N" }
        console.log(uploadIds)
        data.avatar_url = uploadIds.length > 0 ? uploadIds[0].toString() : ""
        let Create = await ServiceProxy.user.create(role, data)
        if (Create.status == 201) {
          setDrawerOpen(false)
          getdataFromApi()
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "success",
            message: "Create Record Successfully"
          })
        }
      } else if (typeMode == mode.UPDATE) {
        let id = data.id
        delete data.id
        // data.avatar_url = uploadIds.length > 0 ? uploadIds[0].toString() : ""
        let Update = await ServiceProxy.user.update(id, data)
        if (Update.status == 200) {
          setDrawerOpen(false)
          getdataFromApi()
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "success",
            message: "Update Record Successfully"
          })
        }
      } else if (typeMode == mode.DELETE) {
        let Delete = await ServiceProxy.user.delete(data)
        if (Delete.status == 200) {
          getdataFromApi()
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "success",
            message: "Delete Record Successfully"
          })
        }
      } else if (typeMode == mode.PASSWORD) {
        console.log(editdata, "editdata")
        let payload = {
          id: editdata.id,
          password: data.password,
          roles: editdata.roles
        }
        let password = await ServiceProxy.auth.resetpassword(payload)
        if (password.status == 200) {
          setDrawerOpen(false)
          getdataFromApi()
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "success",
            message: "Password Updated Successfully"
          })
        }
      } else if (typeMode == mode.FILTER) {
        setfilter({
          ...def_filter,
          ...filter2apiobj(data)
        })
      } else if (typeMode == mode.RESET) {
        setfilter(def_filter)
      } else if (typeMode == mode.APPROVAL) {
        let payload = {
          email: data.email,
          roles: data.roles
        }
        let resetpass = await ServiceProxy.auth.resetpassword(payload)
        if (resetpass.response != undefined && (resetpass.response.status == 400 || resetpass.response.status == 401)) {
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "error",
            message: `${resetpass.response.data.message}`
          })
        } else if (resetpass.status == 200) {
          let TokenDecode = jwt_decode(resetpass.data.data.token)
          let mail_payload = {
            id: `${TokenDecode.id}`,
            operation: 'create',
            email: payload.email,
            account_id: TokenDecode.account_id,
            additional_info: {
              email_verification_link: `${domain}/reset?type=activate&username=${payload.email}&account=${TokenDecode.account_id}&roles=${payload.roles}&token=${resetpass.data.data.token}`
            }
          }
          await ServiceProxy.notification.send('b2b', 'user', mail_payload)
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "success",
            message: "Activation sent to Mail"
          })
          getdataFromApi()
        }
      }

    } catch (err) {
      console.log(err)
    }
  }

  const handleFilterByName = (typeMode, event) => {
    console.log("search", typeMode, event)

    if (typeMode == mode.FILTER) {
      setTemplateFlds({
        ...templatefilter,
        initialValues: {},
        action: mode.FILTER,
        skipped: []
      })
      setDrawerOpen(true)
    } else if (typeMode == mode.SEARCH) {

    }

  };

  const handleFileUpload = async (name, e) => {
    setImageList([])
    console.log(e)

    const docsFind = await ServiceProxy.business
      .find(
        'b2b', "document", "view", {
        id: {
          "$in": [(selectedData.hasOwnProperty("avatar_url") && selectedData.avatar_url != "") ? selectedData.avatar_url.toString() : null]
        }
      },
        [],
        1,
        1
      )
    if (docsFind.records.length > 0) {
      let fileUpdate = await ServiceProxy.fileUpload
        .update(
          'b2b', "user", e[0], docsFind.records[0].file_path
        )
      if (fileUpdate.status = 200) {
        let docObj = {
          id: docsFind.records[0].id,
          file_name: fileUpdate.data.data.filename,
          file_path: fileUpdate.data.data.file_path,
          content_type: fileUpdate.data.data.content_type,
          model: fileUpdate.data.data.model,
        }
        setImageList([
          {
            file_path: `${Constants.BASE_URL_WOP}/${fileUpdate.data.data.file_path.substring(14)}`
          }
        ])
        const documentUpdate = await ServiceProxy.business.update(
          "b2b", "document", docObj
        )

        let id = []

        id.push(docsFind.records[0].id)
        setUploadIds(id)
      }
    } else {
      let fileUpload = await ServiceProxy.fileUpload
        .upload(
          'b2b', 'user', e[0]
        )

      if (fileUpload.status == 200) {
        let docObj = {
          file_name: fileUpload.data.data.filename,
          file_path: fileUpload.data.data.file_path,
          content_type: fileUpload.data.data.content_type,
          model: fileUpload.data.data.model,
        }
        setImageList([
          {
            file_path: `${Constants.BASE_URL_WOP}/${fileUpload.data.data.file_path.substring(14)}`
          }
        ])
        const documentCreate = await ServiceProxy.business.create(
          "b2b", "document", docObj
        )
        setUploadIds(documentCreate.data)
      }
      else if (fileUpload.hasOwnProperty("response")) {
        if (fileUpload.response.status == 413) {
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "warning",
            message: SnackMess.C_FAIL + "--" + fileUpload.response.statusText
          })
        }
      }
    }
  }
  const get_table_filter = async (val) => {
    console.log(val)
    var filterObj = {};
    setfilter({ ...def_filter, active: { $eq: "Y" } })
    if (val.items.length > 0 && val.items[0].field) {
      if (val.items[0].value && val.items[0].value != "") {
        generateFilterObj(val, filterObj)
        setfilter((set) => {
          return {
            ...set,
            ...filterObj,
            active: { $eq: "Y" }
          }
        })
      }
      else {
        setfilter((set) => {
          return { ...set, active: { $eq: "Y" } }
        })
      }
    }
    else {
      setfilter((set) => {
        return { ...def_filter, active: { $eq: "Y" } }
      })
    }
  }
  const generateFilterObj = (val, filterObj) => {

    const field = val.items[0].field;
    const fieldKeys = field.includes('.') ? field.split('.') : [field];
    var currentLevel = filterObj;

    for (var i = 0; i < fieldKeys.length; i++) {
      var key = i === fieldKeys.length - 1 ? fieldKeys[i] : fieldKeys[i]

      if (i === fieldKeys.length - 1) {
        currentLevel[key] = val.items[0].value;
      } else {
        currentLevel[key] = currentLevel[key] || {};
        currentLevel = currentLevel[key];
      }
    }
  }

  const getImageFromDocId = async (docId) => {
    let imgUrl = await ServiceProxy.business
      .find('b2b', 'document', 'view', {
        id: {
          "$in": [docId]
        }
      })
    if (imgUrl.cursor.totalRecords && imgUrl.cursor.totalRecords != 0) {
      imgUrl.records.forEach((item) => {
        item.file_path = `${Constants.BASE_URL_WOP}/${item.file_path.substring(14)}`
      })
    }
    return imgUrl
  }

  let filter2apiobj = (data) => {
    let mergedObject = {}
    Object.keys(data).forEach((elm) => {
      if (Array.isArray(data[elm])) {
        mergedObject[elm] = { $in: data[elm] }
      } else {
        mergedObject[elm] = { $eq: data[elm] }
      }
    })
    return mergedObject
  }

  let closeCrm = () => {
    setopenCrm(false)
  }

  return (
    <>
      <Helmet>
        <title>{pageinfo.title}</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {pageinfo.title}
          </Typography>
          {AppPermission.create && <Stack direction={"row"} gap={2}>
            <Button onClick={() => {
              Openpopup()
            }} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              New {pageinfo.title}
            </Button>
            {false && <Button onClick={() => {
              setopenCrm(true)
            }} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              New Crm
            </Button>}
            {/* hidden <Button onClick={() => {
              Openpopup__()
            }} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              subform {pageinfo.title}
            </Button> hidden */}
          </Stack>}
        </Stack>

        <UserListToolbar numSelected={[]} onFilterName={handleFilterByName} mode={mode} />

        {pageinfo.Headers !== undefined && <AppTable
          header={pageinfo.Headers}
          actionsButtons={tableActions}
          count={count}
          items={items}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={page - 1}
          rowsPerPage={rowsPerPage}
          get_table_filter={get_table_filter}
          module={'user'}
          permitEl={AppPermission}
        />}


      </Container>
      <AppDialog
        dialogTitle={appDialog.header}
        dialogContent={appDialog.content}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleDelete={() => deleteSelectedData(appDialog.action)}
      />
      <AppDrawer
        children={
          <AppForm
            formSchema={templateFlds}
            action={action}
            mode={mode}
            allObj={false}
            handleFileUpload={handleFileUpload}
            imageList={imageList}
          />
        }
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
      <AppSnacks
        snackProps={snackProps}
        setSnackProps={setSnackProps}
      />
      {/* <CrmFullScreenDialog openCrm={openCrm} closeCrm={closeCrm} module={"contacts"} selected_data={
       {
        "id": 2,
        "account_id": "1792194d-d930-416e-91c3-85678d46157f",
        "partner_id": null,
        "company_id": "0",
        "phone_number": "8887676767",
        "email": "ragulraghavan75066@gmail.com",
        "user": null,
        "details": null,
        "contact_details": "{\"city\": \"3101\", \"state\": \"1\", \"address\": \"adas\", \"last_name\": \"R\", \"first_name\": \"aa\", \"alternate_no\": \"NNN\"}",
        "is_lead": "Y",
        "is_contact": "Y",
        "created_by": "brand_admin@brand.com",
        "updated_by": "brand_admin@brand.com",
        "created_at": "2024-01-02T11:17:09.000Z",
        "updated_at": "2024-01-02T11:17:09.000Z"
    }
      }></CrmFullScreenDialog> */}
    </>
  );
}
