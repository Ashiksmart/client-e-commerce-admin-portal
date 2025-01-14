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

export default function NoInternet() {
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
        <title> No Internet </title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            No Internet
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            No Internet , Please Try Again !!!
          </Typography>

          <Box
            component="img"
            src={require("../assets/no-internet.png")}
            sx={{
              height: 260, mx: 'auto',
              my: { xs: 5, sm: 10 },
              opacity: 0.5
            }}
          />

          <Button onClick={() => window.location.reload()} size="large" variant="contained"
            component={RouterLink}>
            Try Again
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}
