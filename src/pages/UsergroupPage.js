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
import { useHistory, useLocation, useNavigate } from 'react-router-dom'
import AppToggleGroup from './AppToggleGroup ';
import AppDrawer from '../sections/@dashboard/app/AppDrawer';
import { object } from 'prop-types';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { CustomFieldhandel } from '../utils/CustomformStr'
import { getTitle } from '../utils/getTitle';
import { getPermissions, getToken } from '../services/AppService';
import AppSnacks from '../components/general/AppSnacks';
import { useSelector } from "react-redux"
import { ALL_SCREENS } from "../constants/localstorage"

export default function UsergroupPage(props) {
  const {
    label,
    value,
    process
  } = props
  const currentPath = useLocation();
  let AppPerState = useSelector(state => state.permisson)
  const [permit, setPermit] = useState(getPermissions())
  const [permitEl, setPermitEl] = useState(false)
  const [items, setitems] = useState([]);
  const [templateFlds, setTemplateFlds] = useState({});
  const [partner_id, setpartner_id] = useState(getToken().partner_id)
  const [TemplateApiFlds, setTemplateApiFlds] = useState({})

  const [templatefilter, settemplatefilter] = useState({});

  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedData, setSelectedData] = useState({})
  const [openDialog, setOpenDialog] = useState(false);
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
  let [filter, setfilter] = useState({ active: { $eq: 'Y' }, partner_id: { $eq: partner_id } })
  let [active, setactive] = useState('Y')
  let [count, setcount] = useState(0);
  let [search, setsearch] = useState('');
  let [rowsPerPage, setRowsPerPage] = useState(5);
  let [permissiondata, setpermissiondata] = useState([])
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
  const [id, setid] = useState(0)
  const [snackProps, setSnackProps] = useState({
    snackOpen: false,
    setSnackOpen: () => { },
    severity: "",
    message: "",
  });
  const [AppPermission,SetAppPermission] = useState({
    create:false,
    update:true,
    delete:false
  })


  useEffect(() => {
    getpermission()
    checkPermissions()
    dynamicDropdownload()
    console.log(AppPerState,process,value,"SETPERMISSION")
    if(AppPerState?.permission.indexOf(`${process}_${value}:create`) != -1){
      SetAppPermission((set)=>{
        set.create = true
        return set
      })
    }
    if(AppPerState?.permission.indexOf(`${process}_${value}:update`) != -1){
      SetAppPermission((set)=>{
        set.update = true
        return set
      })
    }
    if(AppPerState?.permission.indexOf(`${process}_${value}:delete`) != -1){
      SetAppPermission((set)=>{
        set.delete = true
        return set
      })
    }
  }, [])
  useEffect(() => {
    getdataFromApi()
  }, [page, rowsPerPage, filter])


  const checkPermissions = () => {
    setPermitEl({
      ...permitEl,
      ...permit?.usergroup
    })
  }
  let dynamicDropdownload = async () => {
    let fetch = await ServiceProxy.business.find("b2b", "partner_account", "view",
      filter, [], page, rowsPerPage, sort)

    if (fetch.records.length > 0) {
      setfieldDyanamicBind((set) => {
        set.partner_id = fetch.records.map((elm) => {
          return { name: elm.name, value: elm.partner_id }
        })
        return set
      })

    }
    fetchtemplate()
    // ServiceProxy.partner.find(1, 100, "asc", { active: "Y" }).then((res) => {
    // })
  }

  const get_table_filter = async (val) => {
    console.log(val)
  }

  let fetchtemplate = async () => {
    try {
      let template = await ServiceProxy.business.find('b2b', 'template', 'view', {
        name: {
          "$in": ["USERGRP_CU"]
        }
      }, [], 1, 2)

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

            if (elm.name == 'USERGRP_CU') {

              CustomFieldhandel(templateData, fieldDyanamicBind)
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
                      ...(AppPermission.delete ?  [{ name: "Delete", value: 'delete' }] : [])
                    ]
                  })

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
            // else if (elm.name == "USERGRP_FILTER") {
            //   let templateFld = CustomFieldhandel(templatefields.records, fieldDyanamicBind, getToken().partner_id === null && getToken().roles !== 'Client' ? 'Brand' : getToken().partner_id !== null ? 'Partner' : '').field
            //   settemplatefilter({
            //     "template": elm,
            //     "fields": templateFld
            //   })
            // }
          }
        })
      }

    } catch (error) {
      console.log(error)
    }
  }

  async function getdataFromApi() {
    try {
      console.log(rowsPerPage, filter, page, sort)
      let fetch = await ServiceProxy.business.find("b2b", "usergroup", "view",
        filter, [], page, rowsPerPage, sort)

      if (fetch.records.length > 0) {
        fetch.records.forEach((item) => {
          if (item.permission_values) {
            item.permission_values = JSON.parse(item.permission_values);
          }
          return item
        })
        setitems(fetch.records)
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

  let getpermission = async () => {

    try {

        // let Navbar = AppPerState?.screens.filter(e=>e.show_on_market =="Y" && e.is_default =="N")
        // console.log(Navbar,"Navbar")
      // let fetch = await ServiceProxy.userGroup.permissions()
      // if (fetch.status == 200) {
      //   fetch.data.data.forEach((elm) => {
      //     elm.header = elm.category_name
      //     elm.options = elm.permission
      //     delete elm.permission
      //     delete elm.category_name

      //   })
      //   console.log(fetch.data.data,"fetch.data.data")
      //   let Navbar = AppPerState?.screens.map.filter(e=>e.show_on_market =="Y" && e.is_default =="N")
        setpermissiondata(AppPerState?.screens)
      // }
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
      console.log(e)
      setTemplateFlds((set) => {
        e.permission_values.forEach((elm, i) => {
          let { category_name, params } = elm
          e[category_name] = params
        })
        e.partner_id = e.partner_id == null ? "" : e.partner_id
        for (let i = 0; i < TemplateApiFlds.fields.length; i++) {
          const elm = TemplateApiFlds.fields[i];
          // if (elm.name == "Default Field") {
          elm.fields.forEach((elem, i) => {
            if (elem.model == "partner_id") {
              elem.disabled = true
            }
          })
          // }
        }
        return {
          ...TemplateApiFlds,
          initialValues: e,
          action: mode.UPDATE,
          skipped: ['account_id', 'created_at', 'created_by', 'permission_values', 'updated_at', 'updated_by', 'partner_id']
        }

      })
      setDrawerOpen(true)
    },
    delete: (e, n) => {
      setid(e.id)
      setOpenDialog(true)
    }
  }


  // need
  const deleteSelectedData = () => {
    action(id, mode.DELETE)
    setOpenDialog(false)
  }

  let Openpopup = () => {
    setTemplateFlds({
      ...TemplateApiFlds,
      initialValues: {},
      action: mode.CREATE,
      skipped: []
    })
    setDrawerOpen(true)
  }



  let action = async (InputValue, typeMode) => {
    try {
      let data = structuredClone(InputValue)
      if (typeMode == mode.CREATE) {
        let payload = {
          partner_id,
          name: data.name,
          description: data.description,
          permission_values: []
        }
        delete data.name
        delete data.description
        if (Object.keys(data).length > 0) {
          payload.permission_values = Object.keys(data).map((elm) => {
            return {
              category_name: elm,
              params: data[elm]
            }
          })
          let Create = await ServiceProxy.userGroup.create(payload)
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
        } else {
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "error",
            message: "At least one permission need to add"
          })
        }

      } else if (typeMode == mode.UPDATE) {
        let id = data.id
        let payload = {
          name: data.name,
          description: data.description,
          permission_values: []
        }
        delete data.name
        delete data.partner_id
        delete data.description
        delete data.id
        delete data.active

        if (Object.keys(data).length > 0) {
          payload.permission_values = Object.keys(data).map((elm) => {
            return {
              category_name: elm,
              params: data[elm]
            }
          })

          let Update = await ServiceProxy.userGroup.update(id, payload)
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
        } else {
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "error",
            message: "At least one permission need to add"
          })
        }
      } else if (typeMode == mode.DELETE) {
        let Delete = await ServiceProxy.userGroup.delete(id)
        if (Delete.status == 200) {
          getdataFromApi()
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "success",
            message: "Delete Record Successfully"
          })
        }
      } else if (typeMode == mode.FILTER) {
        setfilter((set) => {

          return {
            ...set,
            ...filter2apiobj(data)
          }
        })
      } else if (typeMode == mode.RESET) {
        setfilter({ active: { $eq: 'Y' }, partner_id: { $eq: partner_id } })
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
        dialogTitle={"Confirm"}
        dialogContent={"Are you Sure want to Proceed ?"}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleDelete={() => deleteSelectedData()}
      />
      <AppDrawer
        children={
          <AppToggleGroup
            viewitems={permissiondata}
            formSchema={templateFlds}
            action={action}
            mode={mode}
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
