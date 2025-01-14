import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import SimpleLayout from "./layouts/simple";
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";
import ResetPage from "./pages/ResetPage";
import Page404 from "./pages/Page404";
import MarketPlace from "./pages/MarketPlace";
import PartnerPage from "./pages/PartnerPage";
import Products from "./pages/Products";
import UsergroupPage from "./pages/UsergroupPage";
import { useState } from "react";
import ServiceProxy from "./services/serviceProxy";
import { ALL_SCREENS, APP } from "./constants/localstorage";
import EmployeeGroupPage from "./pages/EmployeeGroupPage"
import FlowPage from "./pages/FlowPage";
import AppTextLink from "./pages/AppTextLink";
import AppConfig from "./pages/AppConfig";
import CRM from "./pages/CRM";
import ImpExpreport from "./pages/ImpExpreportPage";

// ----------------------------------------------------------------------
import AppSubForm from "./pages/AppSubForm";
import { useSelector } from "react-redux"
import Welcome from "./pages/WelcomePage";
import NoInternet from "./pages/NoInternet";

// export const generateRoutes = (rawRoutes) => {

// }

export default function Router() {
  let AppPerState = useSelector(state => state.permisson.permission)
  ServiceProxy.localStorage.setPrefixKey(APP);

  let permitCheck = (value) => {
    return AppPerState.indexOf(`${value}:view`) != -1
  }

  let role = ServiceProxy.localStorage.getItem("role");

  let allScreens = ["false", ""].includes(
    ServiceProxy.localStorage.getItem("navigate")
  )
    ? []
    : ServiceProxy.localStorage.getItem(ALL_SCREENS);



  const rawRoutes = allScreens.map((screen, i, allfield) => {
    const { process, app_id, children, catagory_id, is_costing } = screen;


    const childRoutes = children.map((child) => {
      const { label, value, operation, app_id } = child;

      const navOperateRoles =
        typeof operation == "string"
          ? JSON.parse(operation).roles
          : operation.roles;
      if (value == "welcome") {

        return {
          path: value,
          element: <Welcome />,
        };
      }
      if (value == "impexp") {
        return {
          path: value,
          element: <ImpExpreport />,
        };
      }
      if (value == "users") {
        if (
          navOperateRoles.includes(role) &&
          permitCheck(`${process}_${value}`)
        ) {
          return {
            path: value,
            element: <UserPage label={label} value={value} process={process} />,
          };
        } else {
          return {
            path: "",
            element: <div></div>,
          };
        }
      }
      if (value === 'employeegroup') {
        if (
          navOperateRoles.includes(role) &&
          permitCheck(`${process}_${value}`)
        ) {
          return {
            path: value,
            element: <EmployeeGroupPage screen={value} label={label} value={value} process={process} />,
          };
        } else {
          return {
            path: "",
            element: <div></div>,
          };
        }
      }
      if (value == "usersgroup") {
        if (
          navOperateRoles.includes(role) &&
          permitCheck(`${process}_${value}`)
        ) {
          return {
            path: value,
            element: <UsergroupPage label={label} value={value} process={process} />,
          };
        } else {
          return {
            path: "",
            element: <div></div>,
          };
        }
      }
      if (value == "marketplace") {
        if (
          navOperateRoles.includes(role)
        ) {
          return {
            path: value,
            element: <MarketPlace label={label} value={value} process={process} />,
          };
        } else {
          return {
            path: "",
            element: <div></div>,
          };
        }
      }
      if (value == "partner") {
        if (
          navOperateRoles.includes(role) &&
          permitCheck(`${process}_${value}`)
        ) {
          return {
            path: value,
            element: <PartnerPage label={label} value={value} process={process} />,
          };
        } else {
          return {
            path: "",
            element: <div></div>,
          };
        }
      }
      if (value == "pipeline" || value == "market" || value == "client") {
        if (navOperateRoles.includes(role) && permitCheck(`${process}_${value}`)) {
          return {
            path: value,
            element: <FlowPage label={label} Mrkapp_id={app_id} value={value} process={process} operation={operation} allscreen={allfield} />,
          };
        } else {
          return {
            path: "",
            element: <div></div>,
          };
        }
      }


      else {
        if (
          (value == "teams"
            //  &&
            //   navOperateRoles.includes(role) &&
            //   permitCheck(`${process}_${value}`)
          ) ||
          (value == "product" &&
            navOperateRoles.includes(role) &&
            permitCheck(`${process}_${value}`)) ||
          (value == "category" &&
            navOperateRoles.includes(role) &&
            permitCheck(`${process}_${value}`)) ||
          ((value == "orders" || value == "task" || value === "taskbacklog") &&
            navOperateRoles.includes(role) &&
            permitCheck(`${process}_${value}`) &&
            navOperateRoles.includes(role) &&
            permitCheck(`${process}_${value}`)) ||
          (value == "brand" &&
            navOperateRoles.includes(role) &&
            permitCheck(`${process}_${value}`)
            // &&
            // permit?.brand.hasOwnProperty("view") &&
            // permit?.brand?.view
          ) ||
          (value == "attributes_group" &&
            navOperateRoles.includes(role) &&
            permitCheck(`${process}_${value}`)
            // &&
            // permit?.brand.hasOwnProperty("view") &&
            // permit?.brand?.view
          ) ||
          (value == "attributes" &&
            navOperateRoles.includes(role) &&
            permitCheck(`${process}_${value}`)
            // &&
            // permit?.brand.hasOwnProperty("view") &&
            // permit?.brand?.view
          ) ||
          (value == "crm_status" &&
            navOperateRoles.includes(role) &&
            permitCheck(`${process}_${value}`)
          ) ||
          (value == "crm_disposition" &&
            navOperateRoles.includes(role) &&
            permitCheck(`${process}_${value}`)
          )
        ) {
          return {
            path: value,
            element: (
              <Products screen={value} is_costing={is_costing} module={catagory_id.id[0].toString()} label={label} Mrkapp_id={app_id} value={value} process={process} />
            ),
            module: catagory_id.id[0].toString(),
          };
        }
        else if (
          (value == "crm_leads" &&
            navOperateRoles.includes(role) &&
            permitCheck(`${process}_${value}`)
          ) ||
          (value == "crm_contact" &&
            navOperateRoles.includes(role) &&
            permitCheck(`${process}_${value}`)
          ) ||
          (value == "crm_deals" &&
            navOperateRoles.includes(role) &&
            permitCheck(`${process}_${value}`)
          ) ||
          (value == "crm_company" &&
            navOperateRoles.includes(role) &&
            permitCheck(`${process}_${value}`)
          )
        ) {
          return {
            path: value,
            element: (
              <CRM screen={value}
                module={catagory_id.id[0].toString()} label={label} children={children}
                Mrkapp_id={app_id} value={value} process={process}
                operation={operation}
              />
            ),
            module: catagory_id.id[0].toString(),
          };
        } else {
          return {
            path: "",
            element: "",
            module: "",
          };
        }
      }
    });

    return {
      path: `/${process}`,
      element: <DashboardLayout allscreen={allfield} />,
      children: childRoutes,
    };
  });
  rawRoutes.map((item) => {
    let label

    if (item.path == "/builder") {
      return {
        ...item,
        children: item.children.push({
          path: "workflow/view",
          element: <AppTextLink label={label} />,
        }),
        children: item.children.push({
          path: "workflow/configuration",
          element: <AppConfig label={label} />,
        }),
        children: item.children.push({
          path: "workflow/subform",
          element: <AppSubForm label={label} />,
        }),
      };
    }
  });
console.log("rawRoutes :",rawRoutes);


  const routes = useRoutes([
    ...rawRoutes,
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "reset",
      element: <ResetPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: "404", element: <Page404 /> },
        { path: "no-internet", element: <NoInternet /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}