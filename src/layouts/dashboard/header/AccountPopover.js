import { useEffect, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import { useNavigate } from "react-router-dom";
import account from '../../../_mock/account';
import ServiceProxy from "../../../services/serviceProxy";
import { APP } from '../../../constants/localstorage';
// ----------------------------------------------------------------------
import AppDrawer from "../../../sections/@dashboard/app/AppDrawer";
import AppForm from "../../../pages/AppForm";
import { CustomFieldhandel } from '../../../utils/CustomformStr'
import Credits from './Credits'
import { getToken } from '../../../services/AppService'
import ImagePicker from './ImagePicker';
import Constants from "../../../constants/index"
import { ALL_SCREENS } from "../../../constants/localstorage";
let MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    value: "home"
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    value: "profile"
  },
  // {
  //   label: 'Settings',
  //   icon: 'eva:settings-2-fill',
  // },
];

export default function AccountPopover(props) {
  let { allscreen } = props


  const [open, setOpen] = useState(null);
  const [templateFlds, setTemplateFlds] = useState({ template: "", type: "", fields: [] });
  const [mode, setmode] = useState({
    CREATE: "create",
    VIEW: "view",
    UPDATE: "update",
    DELETE: "delete",
    FILTER: "filter",
    RESET: "reset",
    APPROVAL: "approval",
    CREDITS: 'credits',
    UPLOAD: "upload"
  });
  const [imageurl, setimageurl] = useState(null)
  const [Screen, setScreen] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userdata, setUserdata] = useState({})
  const [roles, setrole] = useState(getToken()?.roles == "SubSuperadmin" ? "Superadmin" : getToken()?.roles == "SubAdmin" ? "Admin" : getToken()?.roles)
  const [credits_info, Setcredits_info] = useState({})
  const navigate = useNavigate();
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const [upload_data, setupload_data] = useState([])
  const [credit_permit, Setcredits_permit] = useState({
    product: false,
    partner: false
  })

  const handleClose = (value) => {
    setOpen(null);
    if (value == "profile") {
      action(undefined, mode.VIEW)
    } else if (value == "credits") {
      action(undefined, mode.CREDITS)
    }
  };

  useEffect(() => {
    permitCredits(allscreen)
    getTemplates()
    getdatafromApi()
    Accountinfo()
    return () => {
      MENU_OPTIONS.forEach((elm, i) => {
        if (elm.value == "credits") {
          delete MENU_OPTIONS[i]
        }
      })
    }
  }, [])

  let permitCredits = (screens) => {
    // let Scrrenroles =  ServiceProxy.localStorage.getItem(ALL_SCREENS)
    let filterdata = structuredClone(screens.filter((elm) => ["ecommerce", "user"].includes(elm.process)))

    if (filterdata?.length > 0) {
      filterdata.forEach(element => {
        if (element.children.find((elm) => elm.value == 'product' && elm?.operation?.roles?.includes(getToken().roles))) {
          Setcredits_permit((set) => {
            set.product = true
            return set
          })
        } else if (element.children.find((elm) => elm.value == 'partner' && elm?.operation?.roles?.includes(getToken().roles))) {
          Setcredits_permit((set) => {
            set.partner = true
            return set
          })
        }
      });
      console.log(credit_permit.product, (getToken().roles == "SubSuperadmin" || getToken().roles == "Superadmin"), "credit_permit")
    }
  }

  let Accountinfo = async () => {
    if ((getToken().roles == "SubSuperadmin" || getToken().roles == "Superadmin") && (credit_permit.product || credit_permit.partner)) {
      MENU_OPTIONS.push({
        label: 'Settings',
        icon: 'eva:person-fill',
        value: "credits"
      })
      let model = ""
      let filter = {}
      if (getToken().roles == 'Superadmin') {
        model = "project_account"
        filter = filter2apiobj({ account_id: getToken().account_id })
      } else if (getToken().roles == 'SubSuperadmin') {
        model = 'partner_account'
        filter = filter2apiobj({ account_id: getToken().account_id, partner_id: getToken().partner_id })
      }
      let account_info = await ServiceProxy.business.find('b2b', model, 'view', filter, [], 1, 1)
      if (account_info.cursor.totalRecords > 0) {
        Setcredits_info(account_info.records[0])
      }

    }
  }

  let getTemplates = async () => {
    let template = await ServiceProxy.business.find('b2b', 'template', 'view', {
      name: { "$in": ["USR_CU"] }
    }, [], 1, 1)
    if (template.cursor.totalRecords > 0) {
      let sort = [{
        column: "position",
        order: 'asc'
      }]
      template.records.forEach(async (elm) => {
        let templatefields = await ServiceProxy.business.find('b2b', 'templates_field', 'view', {
          template_id: { $eq: elm.id.toString() }, account_id: { $eq: getToken().account_id }
        }, [], null, null, sort)
        if (templatefields.cursor.totalRecords > 0) {
          let field_data = templatefields.records
          let { field } = await CustomFieldhandel(field_data)
          setTemplateFlds((set) => {
            field.forEach((elm) => {
              elm.fields.forEach((elem, i) => {
                if (elem.model == "roles") {
                  elem.values = [
                    {
                      "name": roles,
                      "value": roles
                    }
                  ]
                }
                if (elem.model == "email" || elem.model == "roles") {
                  elem.disabled = true
                }
                if (elem.model == "password" || elem.model == "user_group") {
                  delete elm.fields[i]
                }
              })
            })
            set.fields = field
            return set
          })
        }
      })
    }
  }

  let getdatafromApi = async () => {
    let userdata = await ServiceProxy.user.find()
    if (userdata.status == 200) {
      userdata.data.data[0].roles = roles
      let pro_url = userdata.data.data[0].avatar_url
      if (pro_url != "") {
        userdata.data.data[0].avatar_url = pro_url !== "" && pro_url !== null ? JSON.parse(pro_url) : ""
        setimageurl(Constants.BASE_URL_WOP + userdata.data.data[0].avatar_url.file_path.replace('/var/www/html', ''))
      }
      setUserdata(userdata.data.data[0])
    }
  }

  const logout = async () => {
    let loginres = await ServiceProxy.auth.logout()
    if (loginres.status == 200 || loginres?.response?.status == 401) {
      ServiceProxy.localStorage.setPrefixKey(APP)
      ServiceProxy.localStorage.setItem("navigate", "false")
      ServiceProxy.localStorage.clear()
      navigate('/login')
    }
  }

  let uploadfile = async (data, modetype) => {
    let fileUpload
    if (modetype == mode.CREATE) {
      fileUpload = await ServiceProxy.fileUpload
        .upload(
          'b2b', 'user', data
        )
    } else if (modetype == mode.DELETE) {
      fileUpload = await ServiceProxy.fileUpload
        .delete('b2b', 'user', [data.file_path], [data.docId])
    }
    return fileUpload

  }

  let action = async (data, typeMode) => {
    console.log(typeMode, data)
    if (mode.VIEW === typeMode) {
      setScreen(1)
      setTemplateFlds((set) => {
        set.initialValues = structuredClone(userdata)
        set.action = mode.UPDATE
        set.skipped = ['roles', 'email']
        return set
      })
      setDrawerOpen(true)
    } else if (mode.UPDATE == typeMode) {
      console.log(userdata, "userdatauserdatauserdatauserdata")
      if (userdata.avatar_url !== "" && (upload_data.length > 0)) {
        if (userdata.avatar_url.docId != undefined) {
          await uploadfile(userdata.avatar_url, mode.DELETE)
        }
      }
      let user_profile = {}
      if (upload_data.length > 0) {
        let uploadresponse = await uploadfile(upload_data, mode.CREATE)
        if (uploadresponse.status == 200) {
          user_profile.docId = uploadresponse.data[0].docId
          user_profile.file_path = uploadresponse.data[0].file_path
          data.avatar_url = JSON.stringify(user_profile)
        }
      } else {
        data.avatar_url = ""
      }

      let id = data.id
      delete data.id
      let UserUpdate = await ServiceProxy.user.update(id, data)
      if (UserUpdate.status == 200) {
        setUserdata((set) => {
          return {
            ...set,
            ...data
          }
        })
        getdatafromApi()
        setDrawerOpen(false)
      }
    } else if (mode.CREDITS == typeMode) {
      setScreen(2)
      setDrawerOpen(true)
    } else if (mode.UPLOAD == typeMode) {
      if (data.length > 0) {
        setupload_data([data[0]])
      } else {
        setupload_data(data)
      }
      //  let uploadresponse = await uploadfile([data[0]])
      //   console.log(uploadresponse,"uploadresponse")
      //   if(uploadresponse.status == 200){
      //     // uploadresponse.data[0].docId
      //     // uploadresponse.data[0].file_path

      //   }
    }
  }


  let Comp_Render = () => {
    if (Screen == 1) {
      return (
        <div className="container-profile">
          <div className="img-container">
            <ImagePicker
              mode={mode}
              action={action}
              data={imageurl}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              top: 170
            }}
          >
            <AppForm
              formSchema={templateFlds}
              mode={mode}
              allObj={false}
              action={action}
            />
          </div>
        </div>

      )
    } else {
      return (
        <Credits credits_info={credits_info} credit_permit={credit_permit} />
      )
    }
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

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        {/* <Avatar  /> */}
        <img
          style={{
            width: "50px",
            height: "50px"
          }}
          src={require("./../../../assets/user-profile-icon.png")}
          // src={require(account.photoURL)}
          alt="photoURL"
        />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={() => { handleClose("home") }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => { handleClose(option.value) }}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={logout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>

      <AppDrawer
        children={Comp_Render()}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
    </>
  );
}
