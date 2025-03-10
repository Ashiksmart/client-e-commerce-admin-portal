import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
import { useEffect } from 'react';
import ServiceProxy from "../services/serviceProxy";
import { getToken } from '../services/AppService';
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------

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

export default function Page404() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("navigate") == "true") {
      if (getToken().roles != "Employee") {
        navigate("/user/users");
      } else {
        navigate("/ecommerce/assign");
      }
    }
  }, [])

  return (
    <>
      <Helmet>
        <title> 404 Page Not Found  </title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            Sorry, page not found!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your
            spelling.
          </Typography>

          <Box
            component="img"
            src={require("../assets/404.png")}
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />

          <Button to="/" size="large" variant="contained" component={RouterLink}>
            Go to Home
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}
