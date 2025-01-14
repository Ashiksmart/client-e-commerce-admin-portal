// // component
// import { useEffect } from 'react';
// import SvgColor from '../../../components/svg-color';

// // ----------------------------------------------------------------------

// // const icon = (name) => <img alt='icon' src={require(`/assets/icons/navbar/${name}.png`)} sx={{ width: 1, height: 1 }} />;

// const icon = (name) => <img src={require(`../../../assets/icons/navbar/${name}.png`)}
//   style={{ width: 35, height: 35 }}
//   alt='icon'
// />;

// const userParentEntry = {
//   title: "User",
//   path: "/user",
//   icon: icon("user"),
//   children: [

//     {
//       title: "User",
//       path: "/user/user",
//       icon: icon("menu"),
//     },
//     {
//       title: "User Group",
//       path: "/user/usergroup",
//       icon: icon("menu"),
//     },
//     {
//       title: "Market Place",
//       path: "/user/market_place",
//       icon: icon("menu"),
//     },
//     {
//       title: "Parner",
//       path: "/user/partner",
//       icon: icon("menu"),
//     },
//   ],
// };


// let allScreens = JSON.parse(localStorage.getItem("all_screens"))
// let navConfig = ""

// if (allScreens || allScreens != null) {

//   navConfig = allScreens.reduce((acc, parentScreen) => {
//     // Generate the parent entry in the navigation configuration
//     const parentEntry = {
//       title: parentScreen.process,
//       path: `/${parentScreen.process}`,
//       icon: icon(`${parentScreen.process}`),
//     };

//     // Generate child entries for the parent entry
//     const childEntries = parentScreen.children.map((childScreen) => {
//       return {
//         title: childScreen.label,
//         path: `/${parentScreen.process}/${childScreen.value}`,
//         icon: icon("menu"),
//         // icon: icon(`ic_${childScreen.value}`),
//       };
//     });

//     // Combine the parent entry with its child entries
//     parentEntry.children = childEntries;

//     // Add the combined entry to the navigation configuration
//     acc.push(parentEntry);

//     return acc;
//   }, []);

// }
// if (typeof navConfig == "object") {
//   navConfig.push(userParentEntry)
// }


// // const navConfig = [
// //   {
// //     title: 'user',
// //     path: '/ecommerce/user',
// //     icon: icon('ic_user'),
// //   },
// //   {
// //     title: 'product',
// //     path: '/ecommerce/products',
// //     icon: icon('ic_cart'),
// //   },
// //   {
// //     title: 'category',
// //     path: '/ecommerce/category',
// //     icon: icon('ic_cart'),
// //   },
// //   {
// //     title: 'MarketPlace',
// //     path: '/ecommerce/MarketPlace',
// //     icon: icon('ic_blog'),
// //   },
// //   {
// //     title: 'Partner',
// //     path: '/ecommerce/partner',
// //     icon: icon('ic_blog'),
// //   },
// //   {
// //     title: 'UserGroup',
// //     path: '/ecommerce/usergroup',
// //     icon: icon('ic_analytics'),
// //   },
// //   // {
// //   //   title: 'ecommerce',
// //   //   path: '/ecommerce/app',
// //   //   icon: icon('ic_analytics'),
// //   // },
// //   // {
// //   //   title: 'blog',
// //   //   path: '/ecommerce/blog',
// //   //   icon: icon('ic_blog'),
// //   // },
// //   // {
// //   //   title: 'login',
// //   //   path: '/login',
// //   //   icon: icon('ic_lock'),
// //   // },
// //   // {
// //   //   title: 'Not found',
// //   //   path: '/404',
// //   //   icon: icon('ic_disabled'),
// //   // },

// // ];

// export default navConfig;
