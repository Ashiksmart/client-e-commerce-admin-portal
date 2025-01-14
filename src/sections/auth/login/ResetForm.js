import { useState, useEffect, useMemo } from "react";
import { useNavigate , useLocation } from "react-router-dom";
import { Formik, Form, Field , useFormik } from "formik";
import * as Yup from "yup";
// @mui
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
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
import ServiceProxy , {serviceProxyUpdate}from "../../../services/serviceProxy";
import { TOKEN, APP, ACCOUNT_INFO } from "../../../constants/localstorage";
import jwt_decode from "jwt-decode";
import Constants from "../../../constants/index"



export default function ResetForm(props) {
  let {account_info} = props
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }
  const navigate = useNavigate();
  let query = useQuery();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [resetToken,setresetToken] = useState('')
  const [resetStatus,setresetStatus] = useState('initial')
  const [resetbtn,setresetbtn] = useState(true)
  const [schema , setschema] = useState({
    username: Yup.string().email("Invalid email").required("Username Required"),
    roles:  Yup.string().required("Roles Required")
  })
  const [isvalid,setisvalid] = useState(false)
  const [Msg,setMsg] = useState('')
  const [initalvalues,setinitalvalues] =useState( {
    username: "",
    password: "",
    cpassword:"",
    account:'brand',
    roles:''
  })
  const [domain,setdomain] = useState('')
  let [type,settype]= useState(query.get("type"))

useEffect(()=>{

  if(type != null && (type == "password" || type == "activate")){
    setisvalid(false)
    setresetStatus('password')
    setinitalvalues((set)=>{
      set.username = query.get("username")
      set.account = query.get("account")
      set.roles = query.get("roles")
      return set
    })
    setresetToken(query.get("token"))
    setschema({password:Yup.string().min(8, "Must be 8 characters").required('Password is required'),
              cpassword:Yup.string()
               .oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required')})
  }

  setdomain(window.location.protocol + "//" + window.location.host )
},[])

useEffect(() => {
  ServiceProxy.localStorage.setPrefixKey(APP)
  ServiceProxy.account.domain(Constants.DOMAIN).then((response)=>{
      if(response.status == 200){
        let account = {
          account:response.data.data.account_id,
          api:'http://' + response.data.data.api_domain.api,
          auth:'http://' + response.data.data.api_domain.auth
        }
        ServiceProxy.localStorage.setItem(ACCOUNT_INFO,account)
        Constants.ACCOUNT_ID = response.data.data.account_id
        serviceProxyUpdate()
      }
  }).catch((err)=>{
    console.log(err)
  })
}, [])






 
  const handleSubmit = async ({ username, password, account , roles }, helpers) => {
    try {
      if(account_info?.is_partner == "Y"){
      roles =  roles == "Superadmin" && account == "partner" ? 'SubSuperadmin' : roles == "Admin" && account == "partner" ? 'SubAdmin' : roles;
      }
      
      let payload = {roles,email:username}
      if(resetToken != "" && password !=""){
        payload.token = resetToken
        payload.password= password
      }
      let resetpass = await ServiceProxy.auth.resetpassword(payload)


      if(resetpass.response != undefined && (resetpass.response.status == 400 || resetpass.response.status == 401)){
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: resetpass.response.data.message });
        helpers.setSubmitting(false);
      }else if(resetpass.status == 200 && resetStatus == "initial"){
          let TokenDecode = jwt_decode(resetpass.data.data.token)
           await ServiceProxy.notification.send('b2b','user',
           { id:`${TokenDecode.id}`,
             operation:'create',
            email:username,
            account_id:TokenDecode.account_id,
            additional_info:{
              email_verification_link:`${domain}/reset?type=password&username=${username}&account=${account}&roles=${roles}&token=${resetpass.data.data.token}`
            }})
          setMsg(`We've sent a password reset link to your email ${username}`)
          setisvalid(true)
          setresetbtn(false)
          setresetStatus("")
      }else if(resetpass.status == 200 && resetStatus == "password"){
          if(type == "password"){
            setMsg(`Your password reset successfully`)
          }else if(type == "activate"){
            setMsg(`Your Account Activated successfully`)
          }
          setisvalid(true)
          setresetbtn(false)
          setresetStatus("")
      }
    } catch (error) {
      console.log(error);
      helpers.setStatus({ success: false });
      helpers.setErrors({ submit: error.message });
      helpers.setSubmitting(false);
    }
  };

  let handleChangebtn = (data,handelfn) =>{
    handelfn('account',data)
  }




  const children = [
    <ToggleButton id="brand" name="brand" value="brand" key="brand">
      BRAND
    </ToggleButton>,
    <ToggleButton id="partner" name="partner" value="partner" key="partner">
      PARTNER
    </ToggleButton>
  ];

  let loginScreen = () =>{
   navigate("/login");
  }

  const formik = useFormik(({
    initialValues: initalvalues || {},
    validationSchema: Yup.object().shape(schema),
    onSubmit: handleSubmit
  }))

  return (
        <>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>

              {resetStatus == "initial" && <>
              {account_info?.is_partner == "Y" && <ToggleButtonGroup name="account"  id="account" size="small" onChange={(e)=>{handleChangebtn(e.target.value,formik.setFieldValue)}}   value={formik.values.account}  exclusive={true}   aria-label="Small sizes">
              {children}
            </ToggleButtonGroup>}
            <FormControl fullWidth error={formik.touched.roles && formik.errors.roles}>
            <InputLabel id="rolesid">Roles</InputLabel>
              <Select
                labelId="rolesid"
                id="roles"
                name="roles"
                label="Roles"
                onChange={formik.handleChange}
                value={formik.values.roles}
                onBlur={formik.handleBlur}
                error={formik.touched.roles && formik.errors.roles}
                helperText={formik.touched.roles && formik.errors.roles}
              >
                <MenuItem value={'Superadmin'}>Superadmin</MenuItem>
                <MenuItem value={'Admin'}>Admin</MenuItem>
                <MenuItem value={'Employee'}>Employee</MenuItem>
              </Select>
              {formik.touched.roles && formik.errors.roles ? <FormHelperText> {formik.errors.roles}</FormHelperText> : null}
            </FormControl>
              <TextField
                id="username"
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && formik.errors.username}
                helperText={formik.touched.username && formik.errors.username}
              />
              </>}

           
             {resetStatus == "password"  && 
             <>
               <TextField
                id="password"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
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
              <TextField
                id="cpassword"
                name="cpassword"
                label="Confirm Password"
                type={showCPassword ? "text" : "password"}
                value={formik.values.cpassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cpassword && formik.errors.cpassword}
                helperText={formik.touched.cpassword && formik.errors.cpassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCPassword(!showCPassword)}
                        edge="end"
                      >
                        <Iconify
                          icon={
                            showCPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
             </> }
     
            </Stack>

           {isvalid && <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ my: 2 }}
            >
           
           {Msg}
            <Typography variant="subtitle2" gutterBottom>
           
          </Typography>
            </Stack>}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ my: 2 }}
            >
               {formik.errors.submit && (
              <Typography color="error" sx={{ mt: 3 }} variant="body2">
                {formik.errors.submit}
              </Typography>
            )}
            </Stack>

            {resetbtn  && <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              {type == "password" || type == null ?  "Reset Password" : "Activate" }
            </LoadingButton>}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{ my: 2 }}
            >
              <Link variant="subtitle2"  underline="hover" component="button"  onClick={() => loginScreen()}>
                
                Back to login
              </Link>
            </Stack>
          </form>
        </>
  );
}

  // const [otp, setOtp] = useState(['', '', '', '', '', '']);

// const [isotp,setisotp] = useState(false)
// setschema((set)=>{
//   set.otp =  Yup.string()
//   .required('OTP is required')
//   .test('is-valid-otp', 'Invalid OTP', value => value === `${otpdata.data.data.otp}`);
//   return set
// })

// setisotp(true)
// setresetStatus('otp')
  // const handleInputChange = (e, index , handelfn) => {
  //   const value = e.target.value;
  //   console.log(value,index )
  //   if (value.length <= 1) {
     
  //     const newOtp = [...otp];
  //     newOtp[index] = value;
  //     setOtp(newOtp);
  //     handelfn('otp',newOtp.join(''))
  //     // Move to the next input if a single character is entered
  //     if (value !== '' && index < otp.length - 1) {
  //       document.getElementById(`otp-input-${index + 1}`).focus();
  //     }
  //     if(value == '' && (index - 1) !== -1){
  //       document.getElementById(`otp-input-${index - 1}`).focus();
  //     }
  //   }
  // };

//      otp: '' inital value

// {isotp && <>
//   <InputLabel id="rolesid">Enter OTP Code</InputLabel>
//      <Stack
//          direction="row"
//          alignItems="center"
//          justifyContent="space-between"
//          sx={{ my: 2 }}
//          spacing={3}
//      >

//       {otp.map((value,index)=>{
//         return (
//          <TextField
//           key={index}
//           id={`otp-input-${index}`}
//           variant="outlined"
//           size="small"
//           margin="dense"
//           fullWidth
//           autoFocus={index === 0}
//           type="text"
//           value={value}
//           onChange={(e) => handleInputChange(e, index, formik.setFieldValue)}
//           inputProps={{
//           style: { textAlign: 'center' },
//           maxLength: 1,
//      }}
//    />
//      )
//    })}
   
//    </Stack>
//    {formik.touched.otp && formik.errors.otp ? <FormHelperText error={true}> {formik.errors.otp}</FormHelperText> : null}
//   </>}