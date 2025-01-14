/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
import Constants from "../../../constants/index"
// mock
import account from '../../../_mock/account';
// hooks

import useResponsive from '../../../hooks/useResponsove';
// components
import Logo from '../../../components/logo';
import NavSection from '../../../components/nav-section';
//
// import navConfig from './config';
import { NavSectionIco } from '../../../components/nav-section/NavSection';
import { useTheme } from '@mui/material/styles';
import ServiceProxy from "../../../services/serviceProxy";
import { ALL_SCREENS } from "../../../constants/localstorage";
import { getToken, loadAllScreens } from '../../../services/AppService';
import { SetSCREEN } from '../../../redux/Permission/PermssionAction'
import { useDispatch, useSelector } from "react-redux";

const icon = (name) => <img src={`${name}`}
  style={{ width: 35, height: 35 }}
  alt='icon'
/>;

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  let AppPerState = useSelector(state => state.permisson.permission)
  const { pathname } = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch()
  const [allScreens, setAllScreens] = useState([])
  const [role, setRole] = useState(getToken()?.roles)
  const [ispresent, setispresent] = useState(false)
  let permitCheck = (value) => {
    return AppPerState.indexOf(`${value}:view`) != -1
  }
  const [navConfig, setNavConfig] = useState()

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    const test = async () => {

      let roles = getToken().roles


      if (roles === "Employee") {
        let emp_group = await ServiceProxy.business.find(
          'b2b',
          "employee_master",
          'view',
          { employee_id: { "$.employee_id": getToken().id } },

          [],
          null, null
        )

        if (emp_group.records.length > 0) {
          let teamleader = JSON.parse(emp_group.records[0].team_leader)

          for (let i = 0; i < teamleader.team_leader.length; i++) {
            if (getToken().id === teamleader.team_leader[i]) {
              setispresent(true)
            }
          }


        }
      }

    }
    test()
    const storedScreens = ServiceProxy.localStorage.getItem(ALL_SCREENS);

    if (storedScreens) {
      setAllScreens(storedScreens);
    }

  }, []);

  useEffect(() => {
    if (allScreens && allScreens.length > 0) {

      setNavConfig(allScreens.reduce((acc, parentScreen) => {
        // Generate the parent entry in the navigation configuration
        let parentEntry = {
          title: parentScreen.label,
          path: `/${parentScreen.process}`,
          icon: icon(parentScreen.app_icon),
        };

        // Generate child entries for the parent entry
        const childEntries = parentScreen.children.map((childScreen) => {

          const navOperateRoles = typeof operation == "string" ? JSON.parse(childScreen.operation).roles : childScreen.operation.roles
          if (navOperateRoles.includes(role) && childScreen.value != "workflow" && permitCheck(`${parentScreen.process}_${childScreen.value}`)) {

            return {
              title: childScreen.label,
              path: `/${parentScreen.process}/${childScreen.value}`,
              icon: icon(childScreen.app_icon),
              // icon: icon(`ic_${childScreen.value}`),
            };
          }
          else {
            return {}
          }
        });
        // Combine the parent entry with its child entries
        parentEntry.children = childEntries.filter((it) => Object.keys(it).length > 0);
        // Add the combined entry to the navigation configuration
        if (parentEntry.children.length > 0) {
          acc.push(parentEntry);
        }
        return acc;
      }, []))
    }

  }, [allScreens])



  const loadNav = async () => {
    // set nav - arj
    const allScrns = await loadAllScreens()
    setAllScreens(allScrns)
    dispatch(SetSCREEN(allScrns))
    //set nav - arj
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadNav()
  }, [])

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  console.log("navConfig: ",navConfig);
  

  const renderContent = (
    <>
      <div
        sx={{
          overflow: 'auto',
          minWidth: 300,
          '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
        }}
      >

        <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
          <Logo />
        </Box>
        <Box sx={{ mb: 5, mx: 2.5 }}>
          <Link underline="none">
            <StyledAccount>
              <Avatar src={account.photoURL} alt="photoURL" />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  {account.displayName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {account.role}
                </Typography>
              </Box>
            </StyledAccount>
          </Link>
        </Box>
        {/* Render parent sections and their child sections */}
        {navConfig && navConfig.map((parentItem, parentIndex) => (
          <div key={parentIndex}>
            <div
              style={{
                width: 'auto',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '20px',
                borderRightColor: theme.palette.grey[300],
                borderRightStyle: 'solid',
                borderRightWidth: 1,
              }}
            >
              <NavSectionIco data={parentItem} />
            </div>

            {/* Render the child sections within the parent section */}
            {parentItem.children &&
              parentItem.children.map((childItem, childIndex) => {
                if ((childItem.path === "/delivery_tracking/taskbacklog" && ispresent)) {
                  return <NavSection key={childIndex} data={childItem} />;
                } else if ((childItem.path !== "/delivery_tracking/taskbacklog") && childItem.path !== "/user/welcome" && childItem.path !== "/user/impexp") {
                  
                  return <NavSection key={childIndex} data={childItem} />;
                }
                // eslint-disable-next-line no-lone-blocks
                {/* if (childItem.title !== "Welcome" && childItem.title !== "Import Export") {
                  return (
                    <NavSection key={childIndex} data={childItem} />
                  )
                } */}

              }

              )}
          </div>
        ))}

      </div>
    </>

  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >

          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
