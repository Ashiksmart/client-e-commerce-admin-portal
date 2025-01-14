import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';

// ----------------------------------------------------------------------

NavSectionIco.propTypes = {
  data: PropTypes.object,
};

export function NavSectionIco({ data, ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        <NavItemIco key={data.title} item={data} />
      </List>
    </Box>
  );
}
// <Box {...other}>
//   <List disablePadding sx={{ p: 1 }}>
//     {data.map((item) => (
//       <NavItemIco key={item.title} item={item} />
//     ))}
//   </List>
// </Box>

NavSection.propTypes = {
  data: PropTypes.object,
};

export default function NavSection({ data = {}, ...other }) {
  return (
    data.hasOwnProperty("title") ?
      <Box {...other}>
        <List disablePadding sx={{ p: 1 }}>
          <NavItem key={data.title} item={data} />
        </List>
      </Box>
      : null
  );
}
// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        marginLeft: 4,
        '&:hover': {
          borderRadius: 1
        },
        '&.active': {
          '&::after': {
            content: '""',
            display: 'block',
            width: 3,
            height: 20,
            backgroundColor: 'primary.main',
            position: 'absolute',
            left: 0,
            top: 15,
            borderRadius: 10
          },
          color: 'primary.main',
          backgroundColor: 'primary.lighter',
          borderRadius: 1,

          fontWeight: 'fontWeightBold',
          '&:hover': {
            borderRadius: 1
          }
        },
      }}
    >

      <StyledNavItemIcon style={{
        opacity: 0.5
      }}>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}
NavItemIco.propTypes = {
  item: PropTypes.object,
};

function NavItemIco({ item }) {
  const { title, path, icon, info } = item;
  return (
    <StyledNavItem
      component={RouterLink}
      // to={path}
      sx={{
        paddingRight: 5,
        // marginBottom: 2,
        // width: 50,
        '&.active': {
          borderRadius: 1,
          color: 'primary.dark',
          fontWeight: 'fontWeightBold',
          borderBottomColor: 'primary.main',
          borderBottomWidth: 2,
          borderBottomStyle: 'solid',
        },
      }}
    >
      <StyledNavItemIcon>{item.icon}</StyledNavItemIcon>
      <ListItemText disableTypography primary={item.title} />

    </StyledNavItem>
  );
}
