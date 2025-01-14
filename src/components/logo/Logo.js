import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { ACCOUNT_INFO } from '../../constants/localstorage';
import ServiceProxy from "../../services/serviceProxy";

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();
  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;
  const [brandLogo, setBrandLogo] = useState()

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );
  useEffect(() => {
    if (ServiceProxy.localStorage.getItem(ACCOUNT_INFO) != "") {
      setBrandLogo(ServiceProxy.localStorage.getItem(ACCOUNT_INFO).brand_logo)
    }
  })

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 200,
        height: 150,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <img
        style={{
          width: 200,
          height: 120,
          objectFit: 'contain'
        }}
        src={brandLogo}
        // alt="company-logo"
      />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
