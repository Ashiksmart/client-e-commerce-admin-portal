import { useEffect, useState, useMemo } from "react";
import { Box, Container, Typography, Stack, TextField, Button, Modal } from "@mui/material";
import AppformTrack from "../components/form-builder/AppFormConfig";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import ServiceProxy from "../services/serviceProxy";
import AppSnacks from "../components/general/AppSnacks";
import { getToken } from "../services/AppService";
import Iconify from "../components/iconify";
import { PreviewComp } from "../components/general/PreviewComp";
import { BackNav } from "../components/general/UtilComp";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const AppConfig = () => {
  let router = useNavigate();
  const { state } = useLocation();
  const [Apidata, setApidata] = useState([]);
  const [loader, setloader] = useState(false)
  const [prevModal, setPrevModal] = useState(false)

  const [flowdata, setflowdata] = useState([]);
  const [snackProps, setSnackProps] = useState({
    snackOpen: false,
    setSnackOpen: () => { },
    severity: "",
    message: "",
  });

  const [mode, setmode] = useState({
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete",
    PASSWORD: "password",
    FILTER: "filter",
    SEARCH: "search",
    RESET: "reset",
    ADD: "add",
    EDIT: "edit",
    SUB_ADD: "subadd",
    SAVE: "save",
    CANCEL: "cancel",
  });
  let [flowname, Setflowname] = useState("")
  let [modalPrevType, setModalPrevType] = useState("")
  let [modelPrevTitle, setModelPrevTitle] = useState("")

  let query = useQuery();
  useEffect(() => {
    getdatafromapi()


  }, [])

  const setapidatas = async () => {
    await setloader(false)
    let arr = []
    for (let i = 0; i < flowdata.length; i++) {
      let element = flowdata[i];

      if (element.filter === undefined || element.filter === null ||
        element.content === undefined || element.content === null) {
        element.filter = []
        element.content = []
      }
      else {
        if (typeof element.filter === "string") {
          element.filter = JSON.parse(element.filter)
        }
        if (typeof element.content === "string") {
          element.content = JSON.parse(element.content)
        }

      }
      arr.push(element)
    }
    console.log(arr);
    await setApidata(arr)
    await setloader(true)
  }

  let getdatafromapi = async () => {
    try {
      let flow_status = await ServiceProxy.business.find(
        "b2b",
        "workflow_status",
        "view",
        {
          app_id: { $eq: state.app_id },
          account_id: { $eq: getToken().account_id },
          page_type: { $eq: state.type }
        },
        ['filter', 'color', 'default_status', 'display_name', 'icon', 'id', 'link_to', 'link_type', 'priority', 'status_name', 'type', 'account_id', 'app_id', 'page_type', 'name', 'content'],
        1,
        100
      );

      if (flow_status.cursor.totalRecords > 0) {
        Setflowname(flow_status.records[0].name)
        setflowdata(flow_status.records);
      }

    } catch (error) {
      console.log(error);
    }
  }

  const checkTCPP = () => {
    if (!flowdata || flowdata.length === 0 || !flowdata[0]) {
      return false;
    }
    return flowdata[0].app_id === "-1" || flowdata[0].app_id === "-2"
  }

  const preview = () => {
    setapidatas()
    setPrevModal(true)
  }

  useEffect(() => {
    console.log(Apidata);
  }, [Apidata, modalPrevType])

  return (
    <>

      <>
        <Helmet>
          <title>{flowname}</title>
        </Helmet>

        <Container maxWidth={false}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={10}
              pb={2}
              sx={{
                borderBottom: '1px solid #e3e3e3',
              }}
            >
              <Stack sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px"
              }}>
                <BackNav router={router}
                />
                <Typography variant="h4">
                  {flowname}
                </Typography>
              </Stack>
              <Button
                variant="contained"
                startIcon={<Iconify icon="iconoir:eye-solid" />}
                onClick={() => preview()}
              >
                Preview
              </Button>
            </Stack>

            <Stack mt={10}>
              {<AppformTrack
                flowname={flowname}
                mode={mode}
                flowData={flowdata}
                fetchdata={getdatafromapi}
                module={'flow_config'}     //table name
              />}
            </Stack>
            <Box
              sx={{
                height: 60,
                padding: 2,
                paddingRight: 5,
                display: "flex",
                justifyContent: "flex-end",
                gap: 4,
                alignItems: "center",
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              {/* <Button
                onClick={() => {
                  action(undefined, mode.CANCEL);
                }}
                variant="contained"
                startIcon={<Iconify icon="carbon:zoom-reset" />}
              >
                Back
              </Button> */}

            </Box>
          </Box>
          <Modal
            open={prevModal}
            onClose={() => setPrevModal(false)}
          >
            <>
              <Box
                sx={{
                  position: 'absolute',
                  right: 10,
                  height: 25,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onClick={() => setPrevModal(false)}
              >
                <Iconify
                  icon="basil:cancel-solid"
                  width="50px"
                  style={{
                    color: '#1f1e1e'
                  }}
                />
              </Box>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  overflow: 'auto'
                }}
              >
                <div className="prev_container">
                  <PreviewComp
                    data={Apidata}
                    title={flowname}
                  />
                </div>
              </Box>
            </>
          </Modal>
        </Container>
      </>
      <AppSnacks snackProps={snackProps} setSnackProps={setSnackProps} />
    </>
  );
};

export default AppConfig;
