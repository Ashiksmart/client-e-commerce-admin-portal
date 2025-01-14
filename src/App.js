import * as React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
// routes
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from "./redux/store";
import Router from './routes';
import { APP } from '../src/constants/localstorage'
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { HelmetProvider } from "react-helmet-async";
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import ServiceProxy from "./services/serviceProxy";
import { setColors } from './utils/utils';
import { useNavigate } from "react-router-dom";
export default function App() {
  // const history = useNavigate();

  const [isLoad, setIsLoad] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLocalStorageCleared, setIsLocalStorageCleared] = useState(false);



  useEffect(() => {
    const currentPath = window.location.pathname;
    const checkLocalStorageKeyExists = () => {
      const _prefixKey = localStorage.getItem("_prefixKey") === "" ? true : localStorage.getItem("_prefixKey") === null ? true : false;
      const isEmpty = Object.keys(localStorage).length === 0;
      const accountinfo = localStorage.getItem("b2b.accountinfo") === "" ? true : localStorage.getItem("b2b.accountinfo") === null ? true : false;
      const navigate = localStorage.getItem("b2b.navigate") === "" ? true : localStorage.getItem("b2b.navigate") === null ? true : false;
      const token = localStorage.getItem("b2b.token") === "" ? true : localStorage.getItem("b2b.token") === null ? true : false;
      const role = localStorage.getItem("b2b.role") === "" ? true : localStorage.getItem("b2b.role") === null ? true : false;
      const all_screens = localStorage.getItem("b2b.all_screens") === "" ? true : localStorage.getItem("b2b.all_screens") === null ? true : false;
      const parent_screens = localStorage.getItem("b2b.parent_screens") === "" ? true : localStorage.getItem("b2b.parent_screens") === null ? true : false;

console.log(currentPath,"currentPathcurrentPathcurrentPath",getpath())
      if ((getpath() !== "/login" && getpath() !== "/reset") && (isEmpty || accountinfo || navigate || all_screens || parent_screens || role || token || _prefixKey)) {
        return true;
      }
      else if ((currentPath === "/login" || currentPath === "/reset") && (accountinfo || navigate || _prefixKey)) {
        if (navigate || _prefixKey) {
          localStorage.setItem("_prefixKey", APP)
          localStorage.setItem(APP + ".navigate", false)
          return false;
        }
        return true

      }

      return false;
    };

    const checkLocalStorage = () => {
      console.log(isLocalStorageCleared);
      // setIsLocalStorageCleared(Object.keys(localStorage).length === 0);
      setIsLocalStorageCleared(checkLocalStorageKeyExists());
    };

    // checkLocalStorage();

    const intervalId = setInterval(checkLocalStorage, 1000); // Adjust the interval as needed

    return () => {
      clearInterval(intervalId)
    };
  }, [isLocalStorageCleared]);

  useEffect(() => {
    if (isLocalStorageCleared) {
      // history('/login');
      window.location.href = '/login';
    }

  }, [isLocalStorageCleared]);

  useEffect(() => {
    setColors()
    if (ServiceProxy.localStorage.getItem("navigate") != "") {
      ServiceProxy.localStorage.getItem("navigate") == "false" ?
        setIsLoad(ServiceProxy.localStorage.getItem("navigate") == "false" ? false : true) : setIsLoad(false)
    }
    // if (isLoad == false) {
    //   localStorage.setItem("navigate", "true")
    // }
  }, [])
let getpath=()=>{
return  window.location.pathname
}
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
              <ScrollToTop />
              <StyledChart />
              <React.Suspense fallback={<div>Loading...</div>}>
                {!isLoad ?
                  <>
                    <Router />
                  </>
                  :
                  <Routes>
                    <Route element={<LoginPage />} path='/login' />
                  </Routes>
                }
              </React.Suspense>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  );
}