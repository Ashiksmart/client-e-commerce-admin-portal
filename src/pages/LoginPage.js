import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Stack } from '@mui/material';
// hooks

import useResponsive from '../hooks/useResponsove';
// components
import Logo from '../components/logo';
// sections
import { LoginForm } from '../sections/auth/login';
import { useEffect, useState } from 'react';
import ServiceProxy,{serviceProxyUpdate} from "../services/serviceProxy";

import { ACCOUNT_INFO, APP } from '../constants/localstorage';
import Constants from "../constants/index";
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  paddingTop: 15,
  paddingBottom: 15,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const [Accountinfo, setAccountinfo] = useState()


  useEffect(() => {
    ServiceProxy.localStorage.clear()
    ServiceProxy.localStorage.setPrefixKey(APP)
    ServiceProxy.localStorage.setItem("navigate", false)

    ServiceProxy.account.domain(getDomainFromSubdomain(Constants.DOMAIN)).then((response) => {
      if (response.status == 200) {
        let account = {
          info: response.data.data,
          account: response.data.data.account_id,
          api: 'http://' + response.data.data.api_domain.api,
          auth: 'http://' + response.data.data.api_domain.auth,
          brand_logo: response.data.data.primay_logo
        }

        ServiceProxy.localStorage.setItem(ACCOUNT_INFO, account)
        Constants.ACCOUNT_ID = response.data.data.account_id
         serviceProxyUpdate()
        loadPageConfig(account)
      }
    }).catch((err) => {
      console.log(err)
    })
  }, [])
  const loadPageConfig = (data) => {
    if (data) {
      setAccountinfo(data)
      document.documentElement.style.setProperty('--primary', data.info.primay_color)
      document.documentElement.style.setProperty('--secondary', data.info.secondary_color)
    }
    // setBrandLogo(ServiceProxy.localStorage.getItem(ACCOUNT_INFO).brand_logo)
    // if (ServiceProxy.localStorage.getItem(ACCOUNT_INFO) != "") {
    //   document.documentElement.style.setProperty('--primary', ServiceProxy.localStorage.getItem(ACCOUNT_INFO).info.primay_color)
    //   document.documentElement.style.setProperty('--secondary', ServiceProxy.localStorage.getItem(ACCOUNT_INFO).info.secondary_color)
    // }
  }
  function getDomainFromSubdomain(subdomain) {
    // Use a regular expression to extract the domain
    const domainMatch = subdomain.match(/(?:[^.]+\.)?([^.]+\.[^.]+)$/);

    // Check if the match is found
    if (domainMatch && domainMatch.length === 2) {
      // Return the extracted domain
      return domainMatch[1];
    } else {
      // Return null if no domain is found
      return 'localhost';
    }
  }
console.log("Accountinfo :" ,Accountinfo);

  return (
    <>
      <Helmet>
        <title> Login  </title>
      </Helmet>
      <StyledRoot>
        {mdUp && (
          <StyledSection sx={{
            paddingLeft: 5,
            paddingRight: 5
          }}>
            <Logo
              sx={{
                top: { xs: 16, sm: 24, md: 40 },
                left: { xs: 16, sm: 24, md: 40 },
              }}
              brandLogo={Accountinfo?.brand_logo}
            />
            <Stack>
              <Typography variant="h3" sx={{ textAlign: 'left', py: 5, }} color = { "#0e4c88"}>
                Hi, Welcome Back
              </Typography>
            <img src={require("../assets/login-illustration.jpg")} alt="login" />
          </Stack>
          </StyledSection>
        )}

      <Container maxWidth="sm" justifyContent="flex-start">
        <StyledContent>
          {!mdUp && (
            <>
              <Logo
                sx={{
                  top: { xs: 16, sm: 24, md: 40 },
                  left: { xs: 16, sm: 24, md: 40 },
                }}
                brandLogo={Accountinfo?.brand_logo}
              />
              <Stack gap={5}>
                <Typography variant="h3" sx={{ py: 5 }} color={"#0e4c88"}>
                  Hi, Welcome Back
                </Typography>
              </Stack>
            </>
          )}
          <Typography variant="h4" gutterBottom>
            Sign In
          </Typography>
          {/* 
            <Typography variant="body2" sx={{ mb: 5 }}>
              Don’t have an account? {''}
              <Link variant="subtitle2">Get started</Link>
            </Typography> */}
          {/* 
            <Stack direction="row" spacing={2}>
              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
              </Button>

              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
              </Button>

              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
              </Button>
            </Stack> */}
          {/* 
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider> */}

          <LoginForm account_info={Accountinfo?.info}/>
        </StyledContent>
      </Container>
    </StyledRoot >
    </>
  );
}
