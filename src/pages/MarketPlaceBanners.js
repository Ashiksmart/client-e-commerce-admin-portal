import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useSelection, useMemo, useDispatch } from 'react';
// @mui
import { Container, Stack, Typography, Button } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';
import { AppTable } from '../components/general/AppTable'
import AppDialog from '../components/general/AppDialog'
import Iconify from '../components/iconify';
import ServiceProxy from '../services/serviceProxy';
import {  useNavigate } from 'react-router-dom'
import AppForm from './AppForm';
import AppDrawer from '../sections/@dashboard/app/AppDrawer';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { CustomFieldhandel } from '../utils/CustomformStr'
import AppSnacks from '../components/general/AppSnacks';
import Constants from '../constants/index'
import { SnackMess } from '../constants/SnackMessages';
import { getPermissions, getToken } from '../services/AppService';

export default function MarketPlaceBanners() {
  const [items, setitems] = useState([]);

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
  let [pageinfo, setpageinfo] = useState(
    {
      title: "Flow Page",
      Headers: [
        {
          title: "Id",
          checkbox: false,
          avatar: false,
          sort: false,
          value: 'app_id',
          action: false
        },
        {
          title: "Name",
          checkbox: false,
          avatar: false,
          sort: false,
          value: 'name',
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
            { name: "Edit", value: 'edit' }
          ]
        }
      ]
    })

  let router = useNavigate()
  let [isopen, setisopen] = useState(false)
  let [categoryData, setcategoryData] = useState([])
  let [deleteData, setdeleteData] = useState({})
  let [fieldDyanamicBind, setfieldDyanamicBind] = useState({})
  let [page, setPage] = useState(1);
  let [sort, setsort] = useState('asc');
  let [filter, setfilter] = useState({ page_type:{$eq: "client"},priority:{$eq: 1} })
  let [active, setactive] = useState('Y')
  let [count, setcount] = useState(0);
  let [search, setsearch] = useState('');
  let [rowsPerPage, setRowsPerPage] = useState(5);
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
  const [editdata, seteditdata] = useState({})

  useEffect(() => {
    fetchtemplate()
  }, [])

  useEffect(() => {
    getdataFromApi()
  }, [page, rowsPerPage, filter])

  let fetchtemplate = async () =>{
    try {
      let temp_type = "marketplace" ? "OSF_CU" :"PFLOW_CU"
      let template = await ServiceProxy.business.find(
        "b2b",
        "template",
        "view",
        {
          name: { $eq: temp_type },
          type: { $eq: "FLOW" },
        },
        [],
        1,
        1
      );

      if (template.cursor.totalRecords == 1) {
        let sort = [{
          column: "position",
          order: 'asc'
        }]
        template.records.forEach(async (elm) => {
          let templatefields = await ServiceProxy.business.find(
            "b2b",
            "templates_field",
            "view",
            {
              template_id: { $eq: elm.id },
              is_delete:{  $eq: "N" },
              account_id: { $eq: getToken().account_id }

            },
            [],
            null,
            null,
            sort
          );
          let {header} =await CustomFieldhandel(templatefields.records)
        });
      }

    } catch (error) {
        console.log(error)
    }
  }

  let getdataFromApi = async () => {
    try {
      let fetch =  await  ServiceProxy.business.find('b2b', 'workflow_status', 'view',filter ,[],page,rowsPerPage)
      if (fetch.cursor.totalRecords > 0) {
        setitems(fetch.records)
        setcount(fetch.cursor.totalRecords)
        setDrawerOpen(false)
      } else {
        setitems([])
        setcount(0)
        setDrawerOpen(false)
      }
    } catch (error) {
      console.log(error)
    }

  }



  // need
  const handlePageChange = (event, value) => {
    setPage(value + 1);
  }
  // need
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1)
    // getdataFromApi()
  }
  // need
  const tableActions = {
    edit: (e) => {
      router('/builder/workflow/view?type=client&app_id='+e.app_id)
    },
    delete: (e, n) => {
      // setid(e.id)
      // setOpenDialog(true)
    }
  }


  // need
  const deleteSelectedData = () => {
    action(id, mode.DELETE)
    setOpenDialog(false)
  }

  let Openpopup = () => {
    router('/builder/workflow/view?type=client&app_id='+(count+1))
  }

  let action = async (data, typeMode) => {
    try {

      if (typeMode == mode.CREATE) {

      } else if (typeMode == mode.UPDATE) {

      } else if (typeMode == mode.DELETE) {

      } else if (typeMode == mode.PASSWORD) {

      } else if (typeMode == mode.FILTER) {

      } else if (typeMode == mode.RESET) {

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
        initialValues: { ...filter },
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
      }else{
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

  const get_table_filter = async (val) => {

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
          {count < 3 && <Button onClick={() => {
            Openpopup()
          }} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New {pageinfo.title}
          </Button>}
        </Stack>

       

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
        />}

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
    </>
  );
}
