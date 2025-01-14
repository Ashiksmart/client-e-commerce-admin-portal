import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useSelection, useMemo } from 'react';
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
import { useHistory, useLocation, useNavigate } from 'react-router-dom'
import AppForm from './AppForm';
import AppDrawer from '../sections/@dashboard/app/AppDrawer';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { CustomFieldhandel } from '../utils/CustomformStr'
import { getTitle } from '../utils/getTitle';
import { getPermissions, getToken } from '../services/AppService';
import jwt_decode from "jwt-decode";
import AppSnacks from '../components/general/AppSnacks';
import { useDispatch, useSelector } from "react-redux"
import { setdata } from "../redux/DynamicData/DataAction"
export default function ProductsPage(prop) {
  let {
    label,    
    value,
    process} = prop
  const dispatch = useDispatch()
  const currentPath = useLocation();
  let AppPerState = useSelector(state => state.permisson.permission)
  const [permit, setPermit] = useState(getPermissions())
  const [permitEl, setPermitEl] = useState(false)
  const [bind_to, setbind_to] = useState([])
  const [items, setitems] = useState([]);
  const [templateFlds, setTemplateFlds] = useState({});
  const [TemplateApiFlds, setTemplateApiFlds] = useState({})
  const [templatefilter, settemplatefilter] = useState({})

  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedData, setSelectedData] = useState({})
  const [openDialog, setOpenDialog] = useState(false);
  const [appDialog, setappDialog] = useState({
    header: "",
    content: "",
    action: ""
  })
  const [partnerLimit, SetpartnerLimit] = useState(0)
  const [ispartner_limit,setispartner_limit] = useState(false)

  let [pageinfo, setpageinfo] = useState({ title: label})

  let router = useNavigate()
  let [isopen, setisopen] = useState(false)
  let [categoryData, setcategoryData] = useState([])
  let [deleteData, setdeleteData] = useState({})
  let [page, setPage] = useState(1);
  let [sort, setsort] = useState([{
    column: "id",
    order: 'asc'
  }]);
  let [def_filter, setdef_filter] = useState({ active: { $eq: "Y" }, account_id: { $eq: getToken().account_id } })
  let [filter, setfilter] = useState({ ...def_filter })
  let [count, setcount] = useState(0);
  let [search, setsearch] = useState('');
  let [rowsPerPage, setRowsPerPage] = useState(5);

  const [limit, setLimit] = useState(5);
  const [productLimit, SetproductLimit] = useState(0)
  const [accountinfo, Setaccountinfo] = useState({})
  let [ispro_limit, setispro_limit] = useState(false)
  const [mode, setmode] = useState({
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete",
    FILTER: "filter",
    RESET: "reset",
    APPROVAL: "approval"
  });
  const [id, setid] = useState(0)
  const [editdata, seteditdata] = useState({})
  let [fieldDyanamicBind, setfieldDyanamicBind] = useState({})
  const [snackProps, setSnackProps] = useState({
    snackOpen: false,
    setSnackOpen: () => { },
    severity: "",
    message: "",
  });
  const [domain, setdomain] = useState('')
  const [AppPermission,SetAppPermission] = useState({
    create:false,
    update:false,
    delete:false
  })
  const [associated, setassociated] = useState([

    
      {
        "model": "location_city",
        "bindAs": {
            "name": "city",
            "value": "city_name"
        },
        "key": {
            "foreign": "city",
            "primary": "city_code",
            "rules":{account_id: { $eq: getToken().account_id }}
        },
        "fields": [
            "city_name"
        ]
    },
    {
        "model": "location_state",
        "bindAs": {
            "name": "state",
            "value": "state_name"
        },
        "key": {
            "foreign": "state",
            "primary": "state_code",
            "rules":{account_id: { $eq: getToken().account_id }}
        },
        "fields": [
            "state_name"
        ]
    },
])
  const get_table_filter = async (val) => {
    var filterObj = {};
    setfilter(def_filter)
    if (val.items.length > 0 && val.items[0].field) {
      if (val.items[0].value && val.items[0].value != "") {
        generateFilterObj(val, filterObj)
        setfilter({ ...def_filter, ...filterObj })
      }
      else {
        setfilter(def_filter)
      }
    }
    else {
      setfilter(def_filter)
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

  useEffect(() => {
    getdataFromApi()
  }, [page, rowsPerPage, filter])

  let getdataFromApi = async () => {
    try {
      console.log(rowsPerPage)
      let fetch = await ServiceProxy.business.find("b2b", "partner_account", "view",
        filter, [], page, rowsPerPage, sort,associated)
      console.log(fetch, "fetch")
      if (fetch.records.length > 0) {
        setbind_to(fetch.bind_to)
        setitems(fetch.records)
        setcount(fetch.cursor.totalRecords)
      } else if (fetch.records.length == 0) {
        setitems([])
        setcount(0)
      }
      setDrawerOpen(false)
    } catch (error) {
      console.log(error)
    }

  }
  useEffect(() => {
    checkPermissions()
    dynamicDropdownload()
    Account()
    setdomain(window.location.protocol + "//" + window.location.host)
    console.log(AppPerState,"SETPERMISSION")
    if(AppPerState.indexOf(`${process}_${value}:create`) != -1){
      SetAppPermission((set)=>{
        set.create = true
        return set
      })
    }
    if(AppPerState.indexOf(`${process}_${value}:update`) != -1){
      SetAppPermission((set)=>{
        set.update = true
        return set
      })
    }
    if(AppPerState.indexOf(`${process}_${value}:delete`) != -1){
      SetAppPermission((set)=>{
        set.delete = true
        return set
      })
    }
  }, [])


  let Account = async () => {
    let pro_limit = false
    let partner_limit = false
    let account_info = await ServiceProxy.account.find()
    if (account_info.status == 200) {
      SetproductLimit(account_info.data.data[0].product_limit - account_info.data.data[0].product_utilize)
      Setaccountinfo(account_info.data.data[0])
      pro_limit = account_info.data.data[0].is_product_limit == "N" ? false : true
      setispro_limit(pro_limit)
      partner_limit = account_info.data.data[0].is_partner_limit == "N" ? false : true
      setispartner_limit(partner_limit)
      SetpartnerLimit(account_info.data.data[0].partner_limit - account_info.data.data[0].partner_utilize)

    }
  }

  let UpdateAccount = async (modetype) => {
    let operation = modetype === mode.CREATE ? 1 : -1;
    if (getToken().roles == 'Superadmin') {
      let account_update = await ServiceProxy.business.update('b2b', 'project_account', { id: accountinfo.id, partner_utilize: operation + Number(accountinfo.partner_utilize) })
      return 1
    }
  }


  let dynamicDropdownload = async (model, value) => {

    if (model == undefined) {
      await ServiceProxy.business.find('b2b', 'location_state', 'view', {
        account_id: { "$eq": getToken().account_id }, is_active: { $eq: "Y" }
      }, [], 1, 100000).then((res) => {
        if (res.cursor.totalRecords > 0) {
          setfieldDyanamicBind((set) => {
            set.state = res.records.map((elm) => {
              return {
                name: elm.state_name
                , value: elm.state_code
              }
            })
            return set
          })
        }
      })
      await fetchtemplate()

    }
    if (model == 'city') {
      await ServiceProxy.business.find('b2b', 'location_city', 'view', {
        account_id: { "$eq": getToken().account_id },
        state_code: { $eq: value },
        is_active: { $eq: "Y" }
      }, [], null, null).then((res) => {
        let values = []
        if (res.cursor.totalRecords > 0) {
          values = res.records.map((elm) => {
            return {
              name: elm.city_name, value: elm.city_code
            }
          })
        }
        dispatch(setdata({ [model]: values }))
      })
    }

  }

  let fetchtemplate = async () => {
    try {
      let template = await ServiceProxy.business.find('b2b', 'template', 'view', {
        name: {
          "$in": ["PART_CU"]
        }
      }, [], 1, 2)

      if (template.cursor.totalRecords == 1) {
        let sort = [{
          column: "position",
          order: 'asc'
        }]
        template.records.forEach(async (elm) => {
          let templatefields = await ServiceProxy.business.find('b2b', 'templates_field', 'view', {
            template_id: { $eq: elm.id.toString() }, account_id: { $eq: getToken().account_id }
          }, [], null, null,sort)

          if (templatefields.cursor.totalRecords > 0) {
            let templateData = templatefields.records

            if (elm.name == 'PART_CU') {

              CustomFieldhandel(templateData)
                .then((res) => {

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
                      ...(AppPermission.delete ?  [{ name: "Delete", value: 'delete' }] : []),
                      { name: "Approval", value: 'approval', condition: { prop: "account_license", value: "N" } },
                    ]
                  })
                  console.log(header, "headerheaderheader")
                  setpageinfo({
                    title: label,
                    Headers: header
                  })
                })

              CustomFieldhandel(templateData, fieldDyanamicBind, getToken().partner_id === null && getToken().roles !== 'Client' ? 'Brand' : getToken().partner_id !== null ? 'Partner' : '')
                .then((res) => {

                  settemplatefilter({
                    template: elm,
                    fields: res.field
                  })
                })
            }
            // else if (elm.name == "PART_FILTER") {
            //   settemplatefilter({
            //     "template": elm,
            //     "fields": CustomFieldhandel(templatefields.records, getToken().partner_id === null && getToken().roles !== 'Client' ? 'Brand' : getToken().partner_id !== null ? 'Partner' : '').field
            //   })
            // }
          }
        })
      }

    } catch (error) {
      console.log(error)
    }
  }
  const checkPermissions = () => {
    setPermitEl({
      ...permitEl,
      ...permit?.usergroup
    })
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
        TemplateApiFlds.fields.forEach((elm) => {
          elm.fields.forEach((elem) => {
            if (elem.model == "username" || elem.model == "email") {
              elem.disabled = 'Y'
            }
            if (elem.model == "product_limit" && ispro_limit) {
              elem.validations = [...elem.validations,
              {
                "type": "min",
                "params": [productLimit == 0 ? 0 : 1,
                  `Minimum aleast ${productLimit == 0 ? 0 : 1}`
                ]
              },
              {
                "type": "max",
                "params": [productLimit,
                  `Maximum Limit ${productLimit}`
                ]
              }
              ]
            }
          })
        })
        return {
          ...TemplateApiFlds,
          initialValues: e,
          action: mode.UPDATE,
          skipped: ['username', 'email'],
          lazyDataApi: lazyDataApi
        }

      })
      setDrawerOpen(true)
    },
    delete: (e, n) => {
      // action(e.id,mode.DELETE)
      setid(e.id)
      setappDialog({
        header: "Confirm",
        content: "Are you Sure want to Proceed ?",
        action: mode.DELETE
      })
      setOpenDialog(true)
    },
    approval: (e) => {
      seteditdata(e)
      setappDialog({
        header: "Confirm",
        content: "Are you Approved to Proceed ?",
        action: mode.APPROVAL
      })
      setOpenDialog(true)
    }
  }


  // need
  const deleteSelectedData = (modetype) => {
    if (modetype == mode.DELETE) {
      action(id, mode.DELETE)
    } else if (modetype == mode.APPROVAL) {
      action(editdata, mode.APPROVAL)
      seteditdata({})
    }
    setOpenDialog(false)
    setappDialog({
      header: "",
      content: "",
      action: ""
    })
  }

  let Openpopup =  () => {
    if(ispartner_limit && partnerLimit == 0){
      setSnackProps({
        ...snackProps,
        snackOpen: true,
        severity: "error",
        message: `${label} Add Limit Reached`
      })
    }else {

      setTemplateFlds(() => {

        TemplateApiFlds.fields.forEach((elm) => {
            elm.fields.forEach((elem) => {
              if (elem.model == "product_limit" && ispro_limit) {
                elem.validations = [...elem.validations,
                  {
                    "type": "min",
                    "params": [productLimit == 0 ? 0 : 1,
                      `Minimum aleast ${productLimit == 0 ? 0 : 1}`
                    ]
                  },
                  {
                    "type": "max",
                    "params": [productLimit,
                      `Maximum Limit ${productLimit}`
                    ]
                  }
                ]
              }
            })
        })
        return {
          ...TemplateApiFlds,
          initialValues: {},
          action: mode.CREATE,
          skipped: [],
          lazyDataApi:lazyDataApi
        }
      })
      setDrawerOpen(true)
    }
    
  }


  let lazyDataApi = async (childmodel, parentmodel, parentvalue) => {
    await dynamicDropdownload(childmodel, parentvalue)
  }

  let action = async (data, typeMode) => {
    try {
      if (typeMode == mode.CREATE) {
        if (ispro_limit) {
          let account_update = await ServiceProxy.business.update('b2b', 'project_account', { id: accountinfo.id, product_utilize: Number(data.product_limit) + Number(accountinfo.product_utilize) })
          if (account_update.statusCode == 200) {
            Account()
          }
        }
        if(ispartner_limit){
          console.log(typeMode,"typeModetypeModetypeModetypeMode")
          let update_status = await UpdateAccount(typeMode)
          if(update_status == 1){
            Account()
          }
        }
        let Create = await ServiceProxy.partner.create(data)
        if (Create.status == 201) {
          setDrawerOpen(false)
          getdataFromApi()
        }
      } else if (typeMode == mode.UPDATE) {
        let id = data.id
        delete data.id
        let Update = await ServiceProxy.partner.update(id, data)
        if (Update.status == 200) {
          setDrawerOpen(false)
          getdataFromApi()
          if (ispro_limit) {
            Account()
          }
        }
      } else if (typeMode == mode.DELETE) {
        if(ispartner_limit){
          let update_status = await UpdateAccount(typeMode)
          if(update_status == 1){
            Account()
          }
        }
        let Delete = await ServiceProxy.partner.delete(data)
        if (Delete.status == 200) {
          getdataFromApi()
        }
      } else if (typeMode == mode.FILTER) {
        setfilter((set) => {
          return {
            ...def_filter,
            ...filter2apiobj(data)
          }
        })
        setDrawerOpen(false)
      } else if (typeMode == mode.RESET) {
        setfilter(def_filter)
        setDrawerOpen(false)
      } else if (typeMode == mode.APPROVAL) {
        let partner_update = await ServiceProxy.business.update('b2b', 'partner_account', { id: data.id, account_license: "Y" })
        if (partner_update.statusCode && partner_update.modifiedCount == 1 && partner_update.statusCode == 200) {
          let payload = {
            email: data.email,
            roles: "SubSuperadmin"
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
      }

    } catch (err) {
      console.log(err)
    }
  }

  const handleFilterByName = (typeMode, event) => {
    if (typeMode == mode.FILTER) {
      setTemplateFlds({
        ...templatefilter,
        initialValues: {},
        action: mode.FILTER,
        skipped: [],
        lazyDataApi: lazyDataApi
      })
      setDrawerOpen(true)
    } else if (typeMode == mode.SEARCH) {

    }
  };


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
          {AppPermission.create && <Button onClick={() => {
            Openpopup()
          }} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New {pageinfo.title}
          </Button>}
        </Stack>
        <UserListToolbar numSelected={[]} onFilterName={handleFilterByName} mode={mode} />
        {pageinfo.Headers !== undefined && <AppTable
          header={pageinfo.Headers}
          actionsButtons={tableActions}
          bind_to={bind_to}
          bind_topayload={associated}
          count={count}
          items={items}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={page - 1}
          rowsPerPage={rowsPerPage}
          get_table_filter={get_table_filter}
          module={'partner'}
          permitEl={AppPermission}
        />}
        {/* <AppTable
          header={pageinfo.Headers}
          actionsButtons={tableActions}
          count={count}
          items={items}
          // onDeselectAll={usersSelection.handleDeselectAll}
          // onDeselectOne={usersSelection.handleDeselectOne}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          // onSelectAll={usersSelection.handleSelectAll}
          // onSelectOne={usersSelection.handleSelectOne}
          page={page-1}
          rowsPerPage={rowsPerPage}
        // selected={usersSelection.selected} 
        /> */}

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
          />
        }
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
      <AppSnacks
        snackProps={snackProps}
        setSnackProps={setSnackProps}
      />
    </>
  );
}
