import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import { useNavigate, useLocation } from "react-router-dom";
import useResponsive from '../hooks/useResponsove';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { ResetForm } from '../sections/auth/login';
import ServiceProxy,{serviceProxyUpdate} from "../services/serviceProxy";
import { ACCOUNT_INFO, APP } from '../constants/localstorage';
import Constants from '../constants';

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
  flexDirection: 'column',
  justifyContent: 'center',
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

export default function ResetPage() {
  const mdUp = useResponsive('up', 'md');
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }
  let query = useQuery();
  const [Accountinfo, setAccountinfo] = useState()


  let [content, setcontent] = useState({
    title: "",
    main_header: "",
    secondary_header: ""
  })
  useEffect(() => {

    if (query.get("type") == null || query.get("type") == "password") {
      setcontent({
        title: "Reset Password",
        main_header: "Forget",
        secondary_header: " Your Password ?"
      })
    } else if (query.get("type") != null && query.get("type") == "activate") {
      setcontent({
        title: "SignUp Account",
        main_header: "SignUp",
        secondary_header: "Your Password"
      })
    }
  }, [])

  useEffect(() => {

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
  const loadPageConfig = (data) => {
    if (data) {
      setAccountinfo(data)
      document.documentElement.style.setProperty('--primary', data.info.primay_color)
      document.documentElement.style.setProperty('--secondary', data.info.secondary_color)
    }
  }

  return (
    <>
      <Helmet>
        <title> {content.title} </title>
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
            <Stack gap={5}>
              <Typography variant="h3" sx={{ textAlign: 'left', py: 5, }} color={"#0e4c88"}>
                Hi, Welcome Back
              </Typography>
              <img src={require("../assets/login-illustration.jpg")} alt="login" />
            </Stack>
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" sx={{mb:3}} gutterBottom>
              {content.main_header}
            </Typography>
            <Typography variant="h4" gutterBottom>
              {content.secondary_header}
            </Typography>

            <ResetForm account_info={Accountinfo?.info} />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
