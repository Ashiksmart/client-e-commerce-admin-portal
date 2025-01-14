import { Helmet } from 'react-helmet-async';
import AppList from "../components/MarketPlace/AppList";
import {
  Container,
  Stack,
  Typography,
  Grid,
  Divider
} from '@mui/material';
import '../App.css'
import { useEffect, useState } from 'react';
import ServiceProxy from '../services/serviceProxy'
import { AppInstall } from '../components/general/AppDialog';
import { getToken } from '../services/AppService';
import Constants from '../constants/index'

export const fetchMp = async () => {
  let reqFilter = {
    account_id: getToken().account_id
  } || {}
  const fetchRes = await ServiceProxy.business.find('b2b', 'market_place', 'view',
    reqFilter,
    [],
    1,
    null,
    [{
      column: "id",
      order: 'asc'
    }]
  )
  return fetchRes
}

const MarketPlace = (props) => {
  let { label } = props
  const [allModules, setAllModules] = useState([])
  const [noRecord, setNoRecord] = useState(false)
  const [appChanged, setAppChanged] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [appLoading, setAppLoading] = useState(true)

  useEffect(() => {
    const fetchAllData = async () => {
      const fetchRes = await fetchMp()
      setAllModules(fetchRes.records.filter(item => item.show_on_market == "Y"))
      // setAllModules(fetchRes.records)
      let allInstalled = fetchRes.records.filter(item => item.is_default == "N" && item.is_active == "Y")
      if (allInstalled.length < 1) {
        setNoRecord(true)
      }
    }
    setAppChanged(false)
    fetchAllData()
  }, [appChanged])


  return (
    <>
      <Helmet>
        <title> {label}  </title>
      </Helmet>

      <Container maxWidth={false}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            {label}
          </Typography>
        </Stack>
        <Container maxWidth={false} sx={{
          marginBottom: 5
        }}>
          <Typography variant="h6" gutterBottom>
            Installed
          </Typography>
          {!noRecord ?
            <Grid
              container
              spacing={15}
            >
              {allModules && allModules.map((item, index) => {
                return (
                  (item.is_active == "Y" && item.is_default == "N" ?
                    <Grid
                      key={index} item xs={12} sm={6} md={2}
                    >
                      <AppList box={item} setAppChanged={setAppChanged}
                        setDialogOpen={setDialogOpen}
                        setAppLoading={setAppLoading}
                        appLoading={appLoading}
                        allModules={allModules}
                        app_img={Constants.BASE_URL_WOP + item.app_icon.replace('/var/www/html', '')}
                      />
                    </Grid>
                    :
                    null
                  )
                )
              })}
            </Grid>
            : null}
          {noRecord ?
            <Container maxWidth={false} style={{
              minHeight: 100,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                backgroundColor: "#f0f0f0",
                padding: 10,
                borderRadius: 12
              }}>
                No Installed Applications
              </div>
            </Container>
            : null}
        </Container>
        <Divider />
        <Container maxWidth={false} sx={{
          paddingTop: 3
        }}>
          <Typography variant="h4" gutterBottom>
            All Applications
          </Typography>
          <Grid
            container
            spacing={5}
          >
            {allModules && allModules.map((item, index) => {
              return (
                (item.is_active == "Y" && item.is_default == "Y" ?
                  <Grid key={index} item xs={12} sm={4} md={2}>
                    <AppList
                      box={item}
                      setAppChanged={setAppChanged}
                      setDialogOpen={setDialogOpen}
                      setAppLoading={setAppLoading}
                      appLoading={appLoading}
                      allModules={allModules}
                      disable={item.is_install_permit}
                      app_img={Constants.BASE_URL_WOP + item.app_icon.replace('/var/www/html', '')}
                    />
                  </Grid>
                  : null)
              )
            })}
          </Grid>
        </Container>
        <AppInstall
          openDialog={dialogOpen}
          setOpenDialog={setDialogOpen}
          setAppLoading={setAppLoading}
          appLoading={appLoading}
        />
      </Container>
    </>
  );
};

export default MarketPlace;
