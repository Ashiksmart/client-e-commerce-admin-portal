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
import { fetchProxy, createProxy, bulkCreateProxy, deleteProxy, updateProxy, bulkDeleteProxy } from '../services/AppService';
import { setdata } from "../redux/DynamicData/DataAction"
import { useDispatch, useSelector } from "react-redux"
export default function EmployeeGroupPage(props) {
  const { label, screen, value, process } = props
  const dispatch = useDispatch()
  const currentPath = useLocation();
  let AppPerState = useSelector(state => state.permisson.permission)
  const [permit, setPermit] = useState(getPermissions())
  const [permitEl, setPermitEl] = useState(false)
  const [bind_to, setbind_to] = useState([])
  const [bind_topayload, setbind_topayload] = useState([])
  const [associated, setassociated] = useState([
    {
      "model": "user",
      "bindAs": {
        "name": "employee_id",
        "value": "first_name"
      },
      "key": {
        "foreign": "employee_id.employee_id",
        "primary": "id"
      },
      "fields": [
        "first_name", "last_name"
      ]
    },
    {
      "model": "user",
      "bindAs": {
        "name": "team_leader",
        "value": "first_name"
      },
      "key": {
        "foreign": "team_leader.team_leader",
        "primary": "id"
      },

      "fields": [
        "first_name", "last_name"
      ]
    }
    , {
      "model": "market_place",
      "bindAs": {
        "name": "app_id",
        "value": "label"
      },
      "key": {
        "foreign": "app_id",
        "primary": "app_id"
      },
      "fields": [
        "process", "label"
      ]
    }, {
      "model": "teams",
      "bindAs": {
        "name": "teams",
        "value": "name"
      },
      "key": {
        "foreign": "teams",
        "primary": "id"
      },

      "fields": [
        "name"
      ]
    }
  ])
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
  let [pageinfo, setpageinfo] = useState({ title: label })

  let router = useNavigate()
  let [isopen, setisopen] = useState(false)
  let [categoryData, setcategoryData] = useState([])
  let [deleteData, setdeleteData] = useState({})
  let [page, setPage] = useState(1);
  let [sort, setsort] = useState([{
    column: "id",
    order: 'asc'
  }]);
  let [def_filter, setdef_filter] = useState({ partner_id: { $eq: getToken().partner_id }, account_id: { $eq: getToken().account_id } })
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
  const [AppPermission, SetAppPermission] = useState({
    create: false,
    update: false,
    delete: false
  })

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

      let fetch = await ServiceProxy.business.find("b2b", "employee_master", "view",
        filter, [], page, rowsPerPage, sort, associated)

      if (fetch.records.length > 0) {

        let fetch_data = []

        for (let i = 0; i < fetch.records.length; i++) {
          setbind_to(fetch.bind_to)
          fetch.records[i].employee_id = JSON.parse(fetch.records[i].employee_id)
          fetch.records[i].team_leader = JSON.parse(fetch.records[i].team_leader)
          fetch.records[i].app_id = JSON.parse(fetch.records[i].app_id)

          fetch_data.push(fetch.records[i])
        }
        console.log(fetch_data, "yyyyyyyyyyyyyyyyyyyyy");
        setitems(fetch_data)
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





  let dynamicDropdownload = async (model, value) => {
    if (model === undefined) {
      let reqFilter = { account_id: getToken().account_id, is_default: "N", show_on_market: 'Y', is_default: 'N', is_active: 'Y' }
      const fetchRes = await ServiceProxy.business.find('b2b', 'market_place', 'view', reqFilter,
        [],
        1,
        null,
        [{
          column: "id",
          order: 'asc'
        }])
      fetchRes.records.map((item) => {

        setfieldDyanamicBind((set) => {
          set.app_id = fetchRes.records.map((elm) => {
            return { id: elm.app_id, name: `${elm.label}`, value: elm.app_id }
          })

          return set
        })
      })
      ServiceProxy.business.find('b2b', 'user', 'view', {
        active: { $eq: 'Y' },
        partner_id: { $eq: getToken().partner_id },
        roles: { $eq: 'Employee' }
      }, [], 1, 1000000)
        .then((res) => {
          res.records.map((item) => {

            setfieldDyanamicBind((set) => {
              set.employee_id = res.records.map((elm) => {
                return { id: elm.id, name: `${elm.first_name}${elm.last_name}`, value: elm.id }
              })
              return set
            })
          })
        })
        .catch((err) => {
          console.error(err);
        })


      await fetchtemplate()
    }

    if (model === 'team_leader') {
      await ServiceProxy.business.find('b2b', 'user', 'view', {
        id: { $in: value },
        account_id: { $eq: getToken().account_id },
        partner_id: { $eq: getToken().partner_id }
      }, [], null, null).then((res) => {
        let values = []
        if (res.cursor.totalRecords > 0) {
          values = res.records.map((elm) => {
            return { id: elm.id, name: `${elm.first_name}${elm.last_name}`, value: elm.id }
          })
        }
        dispatch(setdata({ [model]: values }))
      })
    }

    if (model === "teams") {
      await ServiceProxy.business.find('b2b', 'teams', 'view', {
        app_id: { $eq: value },
        account_id: { $eq: getToken().account_id },
        partner_id: { $eq: getToken().partner_id }
      }, [], null, null).then((res) => {
        let values = []
        if (res.cursor.totalRecords > 0) {
          values = res.records.map((elm) => {

            return { id: elm.id, name: `${elm.name}`, value: elm.id }

          })
        }
        dispatch(setdata({ ["teams"]: values }))
      })
    }

  }

  let fetchtemplate = async () => {
    try {
      let template = await ServiceProxy.business.find('b2b', 'template', 'view', {
        name: {
          "$in": ["EMPGRP_CU"]
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
          }, [], null, null, sort)

          if (templatefields.cursor.totalRecords > 0) {
            let templateData = templatefields.records

            if (elm.name == 'EMPGRP_CU') {

              CustomFieldhandel(templateData)
                .then((res) => {

                  setTemplateApiFlds({
                    "template": elm,
                    "fields": res.field
                  })
                  // let header = res.header

                  let tableFlds = res.header
                  let header = tableFlds.map((item) => {
                    return {
                      ...item,
                      value: item.value == "employee_id" ? `employee_id.${item.value}` : item.value == "team_leader" ? `team_leader.${item.value}` : `${item.value}`
                    }
                  })

                  console.log(header, "yyyyyyyyyyyyyyyyyyyyy")
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
                    ]
                  })
                  console.log(header, "headerheaderheader")
                  setpageinfo({
                    title: getTitle(label),
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
    edit: async (e) => {
      // console.log(e,)
      let fetch = await ServiceProxy.business.find("b2b", "employee_master", "view",
        { id: { $eq: e.id } }, [], null, null, sort, associated)

      if (fetch.records.length > 0) {
        let obj = {
          id: e.id,
          employee_id: JSON.parse(fetch.records[0].employee_id).employee_id,
          team_leader: JSON.parse(fetch.records[0].team_leader).team_leader,
          name: fetch.records[0].name,
          app_id: fetch.records[0].app_id,
          teams: fetch.records[0].teams
        }
        console.log(obj);
        setTemplateFlds((set) => {

          return {
            ...TemplateApiFlds,
            initialValues: obj,
            action: mode.UPDATE,
            skipped: [],
            lazyDataApi: lazyDataApi
          }

        })
        setDrawerOpen(true)
      }

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

  }


  // need
  const deleteSelectedData = (modetype) => {
    if (modetype == mode.DELETE) {
      action(id, mode.DELETE)
    }

  }
  let lazyDataApi = async (childmodel, parentmodel, parentvalue) => {
    await dynamicDropdownload(childmodel, parentvalue)
  }
  let Openpopup = () => {
    setTemplateFlds(() => {


      return {
        ...TemplateApiFlds,
        initialValues: {},
        action: mode.CREATE,
        skipped: [],
        lazyDataApi: lazyDataApi
      }
    })
    setDrawerOpen(true)
  }
  let restructure_data = async (data) => {
    let data_arr = []
    let employee_id = []
    for (let i = 0; i < data.employee_id.length; i++) {
      let obj = {
        partner_id: getToken().partner_id,
        account_id: getToken().account_id,
      }
      const employee = data.employee_id[i].toString();
      employee_id.push(employee)
      obj['employee_id'] = employee
      data_arr.push(obj)

    }
    return { data_arr, employee_id }
  }
  let action = async (data, typeMode) => {
    try {
      if (typeMode == mode.CREATE) {
        let apiobj = await restructure_data(data)
        console.log(apiobj, data)

        let verify_employees = await fetchProxy({ "employee_id": { $in: apiobj.employee_id } }, screen, [])

        let obj = {
          partner_id: getToken().partner_id,
          account_id: getToken().account_id,
          employee_id: { employee_id: data.employee_id },
          team_leader: { team_leader: data.team_leader },
          name: data.name,
          teams: data.teams,
          app_id: data.app_id
        }

        console.log(verify_employees, "verify_employeesverify_employeesverify_employees", obj)
        if (verify_employees.records.length === 0) {
          let master_employees = await createProxy(obj, "employee_master")
          if (master_employees.data.length > 0) {
            let data_obj = []
            for (let j = 0; j < apiobj.data_arr.length; j++) {
              const data_arr__ = apiobj.data_arr[j];
              data_arr__['employee_master_id'] = master_employees.data[0].toString()
              data_obj.push(data_arr__)
            }

            let child_employees = await bulkCreateProxy(data_obj, screen)
            if (child_employees.statusCode === 201) {
              setSnackProps({
                ...snackProps,
                snackOpen: true,
                severity: "success",
                message: `Create Record Successfully`
              })
              setDrawerOpen(false)
              getdataFromApi()
            }
            console.log(child_employees, "data_objdata_objdata_obj")
          }


        } else {
          let name_arr = []
          for (let i = 0; i < verify_employees.records.length; i++) {
            let employee_id = verify_employees.records[i].employee_id
            console.log(employee_id, "yyyyyyyyyyyyyyyyy")
            for (let j = 0; j < fieldDyanamicBind.employee_id.length; j++) {
              console.log(employee_id, fieldDyanamicBind.employee_id[j], "yyyyyyyyyyyyyyyyy")
              if (employee_id == fieldDyanamicBind.employee_id[j].id) {
                const full_name = fieldDyanamicBind.employee_id[j].name;
                name_arr.push(full_name)
              }


            }

          }
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "error",
            message: `${name_arr.toString()} Already Exit in another Team`
          })
        }

      } else if (typeMode == mode.UPDATE) {
        let id = data.id
        let apiobj = await restructure_data(data)

        let verify_employees = await fetchProxy({ "employee_id": { $in: apiobj.employee_id }, "employee_master_id": { $ne: id.toString() } }, screen, [])

        let obj = {
          id: id,
          // partner_id: getToken().partner_id,
          account_id: getToken().account_id,
          employee_id: { employee_id: data.employee_id },
          team_leader: { team_leader: data.team_leader },
          name: data.name,
          teams: data.teams,
          app_id: data.app_id
        }

        console.log(verify_employees, "verify_employeesverify_employeesverify_employees", obj)
        if (verify_employees.records.length === 0) {
          let master_employees = await updateProxy(obj, "employee_master")

          if (master_employees.modifiedCount > 0) {
            let sub_employeedata = await fetchProxy({ "employee_master_id": { $eq: id.toString() } }, screen, ["id"])

            let ids = []

            for (let j = 0; j < sub_employeedata.records.length; j++) {
              const element = sub_employeedata.records[j].id;
              ids.push(element)

            }
            console.log(ids, "3333333333333333333")
            let delete_sub_employeedata = await bulkDeleteProxy(ids, screen)
            console.log(delete_sub_employeedata, "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
            if (delete_sub_employeedata.statusCode === 200) {
              let data_obj = []
              for (let j = 0; j < apiobj.data_arr.length; j++) {
                const data_arr__ = apiobj.data_arr[j];
                data_arr__['employee_master_id'] = id.toString()
                data_obj.push(data_arr__)
              }

              let child_employees = await bulkCreateProxy(data_obj, screen)
              if (child_employees.statusCode === 201) {
                setSnackProps({
                  ...snackProps,
                  snackOpen: true,
                  severity: "success",
                  message: "Update Record Successfully"
                })
                setDrawerOpen(false)
                getdataFromApi()
              }
            }
          }


        } else {
          let name_arr = []
          for (let i = 0; i < verify_employees.records.length; i++) {
            let employee_id = verify_employees.records[i].employee_id
            console.log(employee_id, "yyyyyyyyyyyyyyyyy")
            for (let j = 0; j < fieldDyanamicBind.employee_id.length; j++) {
              console.log(employee_id, fieldDyanamicBind.employee_id[j], "yyyyyyyyyyyyyyyyy")
              if (employee_id == fieldDyanamicBind.employee_id[j].id) {
                const full_name = fieldDyanamicBind.employee_id[j].name;
                name_arr.push(full_name)
              }


            }

          }
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "error",
            message: `${name_arr.toString()} Already Exit in another Team`
          })
        }

      } else if (typeMode == mode.DELETE) {
        let delete_employeedata = await deleteProxy(data, "employee_master")
        if (delete_employeedata.statusCode === 200) {
          let sub_employeedata = await fetchProxy({ "employee_master_id": { $eq: data.toString() } }, screen, ["id"])

          let ids = []

          for (let j = 0; j < sub_employeedata.records.length; j++) {
            const element = sub_employeedata.records[j].id;
            ids.push(element)

          }
          let delete_sub_employeedata = await bulkDeleteProxy(ids, screen)
          if (delete_sub_employeedata.statusCode === 200) {
            setSnackProps({
              ...snackProps,
              snackOpen: true,
              severity: "success",
              message: "Delete Record Successfully"
            })
            setOpenDialog(false)
            setappDialog({
              header: "",
              content: "",
              action: ""
            })
            getdataFromApi()

          }
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
  let handleOnChangeSel = () => {

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
          bind_to={bind_to}
          bind_topayload={associated}
          actionsButtons={tableActions}
          count={count}
          items={items}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={page - 1}
          hidefilter={true}
          rowsPerPage={rowsPerPage}
          get_table_filter={get_table_filter}
          module={screen}
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
            handleOnChangeSel={handleOnChangeSel}
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
