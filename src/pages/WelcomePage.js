import { Helmet } from 'react-helmet-async';
import { Typography, Container, Box, Stack } from '@mui/material';
import { getAccInfo } from '../services/AppService';

export default function Welcome() {
console.log("getAccInfo :",getAccInfo());

  return (
    <div>
      <Helmet>
        <title> Welcome To Admin </title>
      </Helmet>

      <Container sx={{ overflow: 'hidden' }}>
        <Stack sx={{ textAlign: 'center', alignItems: 'center' }}>

          <Box className='welcome_body'>
            <Typography variant="h3" paragraph>
              <div className='underlined underline-clip'>
                Welcome
              </div>
              <Box className='welcome_txt' sx={{ paddingTop: 2 }}>
              {getAccInfo() && JSON.parse(getAccInfo()).info?.name}

              </Box>
            </Typography>
          </Box>

        </Stack>
      </Container>
    </div>
  );
}
