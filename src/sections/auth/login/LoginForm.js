import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
// @mui
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
  FormHelperText
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../../components/iconify";
import ServiceProxy from "../../../services/serviceProxy";
import { TOKEN } from "../../../constants/localstorage";
import { PARENT_SCREENS } from "../../../constants/localstorage";
import { getToken, loadAllScreens } from "../../../services/AppService";
import { SetPermission, SetSCREEN, getAllpermission } from '../../../redux/Permission/PermssionAction'
import { useDispatch } from "react-redux";
import { setColors } from "../../../utils/utils";

import { ToastContainer, toast } from 'react-toastify';


export default function LoginForm(props) {
  let { account_info } = props
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false);

  const SignSchema = Yup.object().shape({
    username: Yup.string().email("Invalid email").required("Username Required"),
    password: Yup.string().min(8, "Too Short!").required("Password Required"),
    roles: Yup.string().required("Roles Required")
  });
  const handleSubmit = async ({ username, password, account, roles }, helpers) => {
    try {
      if (account_info?.is_partner == "Y") {
        roles = roles == "Superadmin" && account == "partner" ? 'SubSuperadmin' : roles == "Admin" && account == "partner" ? 'SubAdmin' : roles;
      }
      let loginres = await ServiceProxy.auth.login(username, password, roles);
      let permission_data = []
      if (loginres.response != undefined && loginres.response.status == 401) {
        helpers.setStatus({ success: false });
        const errorMsg = loginres.response.data.message
        showError(errorMsg)
        helpers.setSubmitting(false);
      } else if (loginres.status == 200) {
        ServiceProxy.localStorage.setItem(TOKEN, loginres.data.token)
        ServiceProxy.localStorage.setItem("role", getToken().roles)

        const fetchRes = await ServiceProxy.business.find('b2b', 'market_place', 'view', { "is_default": "N", "is_active": "Y" })
        if (fetchRes) {
          const marketPlaceList = fetchRes.records
          marketPlaceList.forEach(m => {
            m.catagory_id = JSON.parse(m.catagory_id)
          });
          ServiceProxy.localStorage.setItem(PARENT_SCREENS, marketPlaceList)
          const allScrns = await loadAllScreens()
          if (roles !== "Superadmin" && roles != "SubSuperadmin") {
            const fetchPermission = await ServiceProxy.userGroup.findByid(getToken().user_group)
            if (fetchPermission.status == 200) {
              let scopeval = fetchPermission.data.data[0].permission_values.map((e) => {
                return e.params.map((elm) => {
                  return `${e.category_name}:${elm}`;
                });
              });
              permission_data = scopeval.flat()
              dispatch(SetPermission(scopeval.flat()))
              dispatch(SetSCREEN(allScrns))
            }
          } else if (roles == "Superadmin" || roles == "SubSuperadmin") {
            await dispatch(getAllpermission(allScrns)).then((res) => {
              permission_data = res
              dispatch(SetPermission(res))
            })
          }

          if (allScrns && allScrns.length > 0) {
            ServiceProxy.localStorage.setItem("navigate", true)
            let permit = permission_data.filter(permission => permission.includes(':view'));
            if (permit?.length > 0) {
              setColors()
              navigate("/user/welcome");
            } else {
              helpers.setStatus({ success: false });
              showError("User does not have a Permission")
              helpers.setSubmitting(false);
            }
            // }
          }
        }

      }
    } catch (error) {
      console.log(error);
      helpers.setStatus({ success: false });
      showError(error.message)
      helpers.setSubmitting(false);
    }
  };

  const showError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  let handleChangebtn = (data, handelfn) => {
    handelfn('account', data)
  }

  const children = [
    <ToggleButton id="brand" name="brand" value="brand" key="brand">
      BRAND
    </ToggleButton>,
    <ToggleButton id="partner" name="partner" value="partner" key="partner">
      PARTNER
    </ToggleButton>
  ];

  let ForgetScreen = () => {
    navigate("/reset");
  }

  return (
    <>
      <Formik
        initialValues={{
          username: "ashiksmart000@gmail.com",
          password: "Ashik15@123",
          account: 'brand',
          roles: 'Superadmin'
        }}
        validationSchema={SignSchema}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          touched,
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue
        }) => (
          <>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {account_info?.is_partner == "Y" && <ToggleButtonGroup name="account" id="account" size="small" onChange={(e) => { handleChangebtn(e.target.value, setFieldValue) }} value={values.account} exclusive={true} aria-label="Small sizes">
                  {children}
                </ToggleButtonGroup>}
                <FormControl fullWidth error={touched.roles && errors.roles}>
                  <InputLabel id="rolesid">Roles</InputLabel>
                  <Select
                    labelId="rolesid"
                    id="roles"
                    name="roles"
                    label="Roles"
                    onChange={handleChange}
                    value={values.roles}
                    onBlur={handleBlur}
                    error={touched.roles && errors.roles}
                    helperText={touched.roles && errors.roles}
                  >
                    <MenuItem value={'Superadmin'}>Superadmin</MenuItem>
                    <MenuItem value={'Admin'}>Admin</MenuItem>
                    <MenuItem value={'Employee'}>Employee</MenuItem>
                  </Select>
                  {touched.roles && errors.roles ? <FormHelperText> {errors.roles}</FormHelperText> : null}
                </FormControl>
                <TextField
                  id="username"
                  name="username"
                  label="Username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && errors.username}
                  helperText={touched.username && errors.username}
                />

                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              {errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {errors.submit}
                </Typography>
              )}

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                sx={{ my: 2 }}
              >
                {/* <Checkbox name="remember" label="Remember me" /> */}
                <Link variant="subtitle2" underline="hover" component="button" onClick={() => ForgetScreen()}>

                  Forgot password?
                </Link>
              </Stack>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Login
              </LoadingButton>
            </form>
          </>
        )}
      </Formik>
      <ToastContainer />
    </>
  );
}