import React, { useEffect, useState } from "react";
import image from "../../assets/insta.png";
import { Card, Box, Button, ButtonGroup, Badge, Container } from "@mui/material";
import { createMarketPlace, getAllPartners, getToken, updateMarketPlace, loadAllScreens } from "../../services/AppService";
import { useDispatch } from "react-redux";
import { SetPermission, getAllpermission } from '../../redux/Permission/PermssionAction'

export const AppList = (props) => {
  const dispatch = useDispatch()
  const { box, setAppChanged, setDialogOpen, appLoading, setAppLoading, allModules, disable, app_img } = props;

  const [app, setApp] = useState({
    id: box.id,
    account_id: getToken().account_id,
    partner_id: getToken().partner_id,
    process: box.process,
    discription: box.discription,
  })

  const handleMarketCreate = (box) => {
    setDialogOpen(true)
    setAppChanged(true)
    setAppLoading(true)
    setApp((prevApp) => {
      prevApp.id = box.id;
      prevApp.is_default = "N";
      prevApp.is_active = "Y";
      return prevApp
    })
    checkMarketPlace()
    updateMarketPlace(app)
      .then((res) => {
        if (res.statusCode == 200) {
          permitCheck()
          setTimeout(() => {
            setAppLoading(false)
          }, 2000)
          setTimeout(() => {
            setDialogOpen(false)
            window.location.reload()
            window.location.reload()
            setAppLoading(true)
          }, 6000)
        }
      })

  }

  let permitCheck = async () => {
    const allScrns = await loadAllScreens()
    await dispatch(getAllpermission(allScrns)).then(async (res) => {
      await dispatch(SetPermission(res))
    })
  }
  const checkMarketPlace = () => {

  }
  const handleMarketUninstall = (box) => {
    setDialogOpen(true)
    setAppChanged(true)
    setAppLoading(true)

    setApp((prevApp) => {
      prevApp.id = box.id.toString();
      prevApp.is_default = "Y";
      prevApp.is_active = "Y";
      return prevApp
    })

    updateMarketPlace(app)
      .then((res) => {

        if (res.statusCode == 200) {
          permitCheck()
          setTimeout(() => {
            setAppLoading(false)
          }, 2000)
          setTimeout(() => {
            setDialogOpen(false)
            window.location.reload()
            window.location.reload()
            setAppLoading(true)
          }, 6000)
        }
      })
  }

  useEffect(() => {
    // getAllPartners({})
    //   .then((res) => {  })
    // console.log(getToken())
  })
  return (
    <>
      <Card
        sx={{
          overflow: 'visible',
          position: 'relative',
        }}
      >
        {box.is_costing == "Y" ?
          <div style={{
            position: "absolute",
            left: "10px",
            top: "10px",
            zIndex: 1
          }}
            className="bg_ripp">
            <img
              style={{
                width: "30px",
                height: "30px"
              }}
              src={require("../../assets/dollar.png")}
              alt="cost"
            />
          </div>
          : null}
        <Container sx={{
          textAlign: 'right',
          position: 'absolute',
          right: -80,
          top: 4
        }}>
          <Badge
            color="secondary" badgeContent={box.is_active == "Y" && box.is_default == 'N' ? "Installed" : null}>
          </Badge>
        </Container>
        <Box sx={{
          position: 'relative',
          width: 220,
        }}>
          <div
            style={{
              position: "relative",
              width: 220,
            }}
          >
            <div class="card">
              <div class="card-details">
                <div
                  style={{
                    padding: "0px 15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        margin: "auto",
                      }}
                    >
                      <img
                        src={app_img}
                        alt="App logo"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      ></img>
                    </div>
                    <div class="text-title">{box.label.toUpperCase()}</div>
                    <div class="text-body">
                      <div>{box.discription}</div>
                    </div>
                  </div>

                  <div className="apppublishtxt">
                    <span className="apppublish">App published</span>
                  </div>
                </div>

                <div className="card_sub_sec">
                  <div class="left-column">
                    <div className="heading">Owned by</div>
                    <div className="textcontent">Frienddey</div>
                  </div>

                  <div class="right-column">
                    <div className="heading">Modified on</div>
                    <div className="textcontent">{box.updatedAt}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -15,
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'space-evenly'
            }}>
              {/* <ButtonGroup
                disableElevation
                variant="contained"
                aria-label="Disabled elevation buttons"
              > */}
              <Button
                size="small"
                variant="contained"
                sx={{
                  minWidth: 100,
                  display: (box.is_active == "Y" && box.is_default == 'N') ? 'none' : 'block'
                }}
                disabled={(box.is_active == "Y" && box.is_default == 'N') || disable == "N" ? true : false}
                onClick={() => handleMarketCreate(box)}
              >
                Install
              </Button>
              {box.is_active == "Y" && box.is_default == 'N' ?
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    minWidth: 100
                  }}
                  color="warning"
                  onClick={() => handleMarketUninstall(box)}
                >
                  UnInstall
                </Button> :
                null}
              {/* </ButtonGroup> */}
            </div>
          </div>
        </Box>
      </Card>
    </>
  );
};

export default AppList;
