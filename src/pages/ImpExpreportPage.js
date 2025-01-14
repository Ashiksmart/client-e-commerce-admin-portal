import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { fDateTime } from "../utils/formatTime";
import ServiceProxy from "../services/serviceProxy";
import { Button, Box, Typography, Container, Stack } from "@mui/material";
import Link from "@mui/material/Link";
import Iconify from "../components/iconify";
import { useLocation, useNavigate } from "react-router-dom";
import { getTitle } from "../utils/getTitle";
import Upload from "../components/Upload";
import Modal from "@mui/material/Modal";
import { getToken } from "../services/AppService";
import AppSnacks from '../components/general/AppSnacks';
import { BackNav } from "../components/general/UtilComp";

const ImpExpreport = () => {
  const { state } = useLocation();
  let router = useNavigate();

  const [Items, setItems] = useState([]);
  const [uploadModal, setuploadModal] = useState(false);
  const [Uploadbutton, setUploadbutton] = useState(false);
  const [modeltype, setmodeltype] = useState("export");
  const [uploadFields, setuploadFields] = useState([]);
  const [typemode, settypemode] = useState("")
  const [mode, setmode] = useState({
    CREATE: "upload",
    UPDATE: "update",
    DELETE: "delete",
    EXPORT: "export"
  })
  const [snackProps, setSnackProps] = useState({
    snackOpen: false,
    setSnackOpen: () => { },
    severity: "",
    message: "",
  });
  // const [value, setValue] = useState(0);
  useEffect(() => {
    getApidata();

    if (state.type == "upload") {
      setUploadbutton(true);
      setmodeltype(state.type);
    }

    //   let validFieldName = elm?.name.split("_")
    //   if(validFieldName[1] == "CU"){

    //     let UploadFields = templatefields.records.map((itm)=>{
    //           return {
    //             name:itm.label,
    //             value:itm.model
    //           }
    //         })
    //     setuploadFields(UploadFields)
    //  }

    fetchfield(state.template_id);
  }, []);

  async function fetchfield(id) {
    let sort = [
      {
        column: "position",
        order: "asc",
      },
    ];
    let templatefields = await ServiceProxy.business.find(
      "b2b",
      "templates_field",
      "view",
      {
        template_id: { $eq: id.toString() },
        account_id: { $eq: getToken().account_id },
      },
      [],
      null,
      null,
      sort
    );
    if (templatefields.cursor.totalRecords > 0) {
      let UploadFields = templatefields.records.map((itm) => {
        return {
          name: itm.label,
          value: itm.model,
        };
      });
      setuploadFields(UploadFields);
    }
  }

  async function getApidata() {
    let value = state.type == "upload" ? 0 : 2;
    let result = await ServiceProxy.business.find(
      "b2b",
      "import_documents",
      "view",
      {
        account_id: { $eq: getToken().account_id },
        user: {
          "$.id": { $eq: getToken().id },
        },
        type: { $eq: value.toString() },
      },
      [],
      null,
      null
    );

    if (result?.cursor?.totalRecords > 0) {
      setItems(result.records);
    }
  }

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  //   let value = newValue == 0 ? 0 : 2;
  //   getApidata(value);
  // };

  let SampleFileDownload = (file_path, filetype) => {
    let query = {
      application: "b2b",
      filepath: file_path,
      type: filetype,
    };
    ServiceProxy.importExportDoc.downloadfile(query);
  };

  let SkipdataDownload = async (fileid, filetype) => {
    let result = await ServiceProxy.business.find(
      "b2b",
      "import_documents",
      "view",
      {
        account_id: { $eq: getToken().account_id },
        user: {
          "$.id": { $eq: getToken().id },
        },
        type: { $eq: "1" },
        skip_data_ref_id: { $eq: fileid }
      },
      [],
      1,
      1
    );
    if (result?.cursor?.totalRecords > 0) {
      SampleFileDownload(JSON.parse(result?.records[0]?.details)?.file?.file_path, "csv")
    } else {
      setSnackProps({
        snackOpen: true,
        severity: "success",
        message: "No Skip data"
      })
    }

  }

  let action = (type, payload) => {
    let { values, right, fileprops, alignment } = payload
    if (type == mode.CREATE) {
      let fields = Object.keys(values).map((itm) => {
        return {
          csv_field: itm,
          actual_field: values[itm],
        };
      });
      let DuplicateBool = right?.length > 0
      let DuplicateItem = []
      if (DuplicateBool) {
        DuplicateItem = right.map((itm) => itm.value)
      }
      ServiceProxy.importExportDoc
        .upload("b2b", state.model, fileprops, fields, DuplicateBool, DuplicateItem)
        .then((res) => {
          if (res?.status == 200) {
            getApidata();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (type == mode.DELETE) {
      ServiceProxy.importExportDoc
        .delete("b2b", state.model, fileprops, [])
        .then((res) => {
          if (res?.status == 200) {
            getApidata();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (type == mode.UPDATE) {
      ServiceProxy.importExportDoc
        .update("b2b", state.model, fileprops, [])
        .then((res) => {
          if (res?.status == 200) {
            getApidata();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (type == mode.EXPORT) {
      let fields = right.map((itm) => itm.value)
      ServiceProxy.importExportDoc
        .export("b2b", state.model, alignment, {}, fields)
        .then((res) => {
          if (res?.status == 200) {
            getApidata();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

  }

  let closepopup = () => {
    setuploadModal(false)
  }

  return (
    <>
      <Container maxWidth={false}>
        <Helmet>
          {getTitle(state.type)}
        </Helmet>

        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={10}>
          <Box sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "15px"
          }}>
            <BackNav router={router}
            />
            <Typography variant="h4">
              {getTitle(state.type)}
            </Typography>
          </Box>
          <Stack direction={"row"} gap={2}>
            {Uploadbutton && (
              <Button
                onClick={() => {
                  settypemode(mode.CREATE)
                  setuploadModal(true);
                }}
                variant="contained"
                startIcon={<Iconify icon="oui:ml-create-single-metric-job" />}
              >
                Create
              </Button>
            )}
            {Uploadbutton && (
              <Button
                onClick={() => {
                  settypemode(mode.UPDATE)
                  setuploadModal(true);
                }}
                variant="contained"
                startIcon={<Iconify icon="mingcute:edit-line" />}
              >
                Update
              </Button>
            )}
            {Uploadbutton && (
              <Button
                onClick={() => {
                  settypemode(mode.DELETE)
                  setuploadModal(true);
                }}
                variant="contained"
                startIcon={<Iconify icon="material-symbols:delete-outline" />}
              >
                Delete
              </Button>
            )}

            {!Uploadbutton && (
              <Button
                onClick={() => {
                  settypemode(mode.EXPORT)
                  setuploadModal(true);
                }}
                variant="contained"
                startIcon={<Iconify icon="ic:baseline-download" />}
              >
                Export
              </Button>
            )}
          </Stack>
        </Stack>

        <Grid sx={{
          paddingTop: 4
        }}>
          <Typography variant="h6" gutterBottom>
            Your History
          </Typography>
          <Grid xs={12}>
            {/* <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="disabled tabs example"
                >
                  <Tab label="Import"  />
                  <Tab label="Export"  />
                </Tabs> */}

            {Items.map(
              ({ details, created_at, total_count, completed_count, flag, id }) => {
                return (
                  <Stack>

                    <Box sx={{
                      padding: 2,
                      backgroundColor: "#f7f7f7",
                      border: '1px solid #e7e7e7',
                      marginBottom: 5,
                      borderRadius: 2,
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}>
                      <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}>
                        <Box sx={{
                          width: "80%",
                        }}>
                          <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 2
                          }}>
                            <div>
                              {fDateTime(created_at, "dd MMM yyyy p")}
                            </div>

                            <div>
                              {state?.type == "upload" &&
                                <>
                                  <span style={{
                                    fontWeight: 600,
                                    paddingRight: 5
                                  }}>
                                    Type:
                                  </span>
                                  <span style={{
                                    backgroundColor: "#dee7ff",
                                    color: "#0036c9",
                                    fontWeight: 600,
                                    borderRadius: 5,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    fontSize: 15,
                                  }}>
                                    {JSON.parse(details)?.type.substring(0).toUpperCase()}
                                  </span>
                                </>
                              }
                            </div>
                          </Box>
                          <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2
                          }}>
                            <Link
                              underline="hover"
                              sx={{
                                cursor: "pointer"
                              }}
                              onClick={() => {
                                SampleFileDownload(
                                  JSON.parse(details)?.file?.file_path,
                                  JSON.parse(details)?.filetype
                                );
                              }}
                            >
                              {JSON.parse(details)?.file?.filename}
                            </Link>
                            <div>
                              to
                            </div>
                            <div style={{
                              fontWeight: 600,
                            }}>
                              {JSON.parse(details).model.replaceAll("_", " ").substring(0).toUpperCase()}
                            </div>

                          </Box>
                        </Box>
                        <Box sx={{
                          position: "relative",
                          width: "20%"
                        }}>
                          <div style={{
                            position: "absolute",
                            right: 0,
                            top: -5
                          }}>
                            <span
                              style={{
                                backgroundColor: flag == 0 ? "#ffcc00" : "#2d7f2d",
                                borderRadius: 12,
                                paddingTop: 2,
                                paddingBottom: 2,
                                paddingLeft: 10,
                                paddingRight: 10,
                                color: flag == 0 ? "black" : "white",
                                fontSize: 15,
                              }}
                            >
                              {flag == 0 ? "In Progress" : "Completed"}
                            </span>
                          </div>

                        </Box>
                      </Box>

                      <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: "10px",
                        marginTop: 3,
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 1
                      }}>
                        <Box sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "15px"
                        }}>
                          <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "10px",
                            backgroundColor: "#dae9ff",
                            border: "1px solid #dae9ff",
                            padding: "3px 10px",
                            borderRadius: "10px"
                          }}>
                            <div style={{
                              fontWeight: "600"
                            }}>
                              Total Record
                            </div>
                            <div style={{
                              width: "auto",
                              padding: "4px 10px",
                              backgroundColor: "#0058dd",
                              color: "#ffffff",
                              borderRadius: "5px"
                            }}>
                              {total_count || "-"}
                            </div>
                          </Box>
                          <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "10px",
                            backgroundColor: "#ccfff2",
                            border: "1px solid #ccfff2",
                            padding: "3px 10px",
                            borderRadius: "10px"
                          }}>
                            <div style={{
                              fontWeight: "600"
                            }}>
                              Added
                            </div>
                            <div style={{
                              width: "auto",
                              padding: "4px 10px",
                              backgroundColor: "#00a57c",
                              color: "#ffffff",
                              borderRadius: "5px"
                            }}>
                              {completed_count || "-"}
                            </div>
                          </Box>
                          <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "10px",
                            backgroundColor: "#ffd8d2",
                            border: "1px solid #ffd8d2",
                            padding: "3px 10px",
                            borderRadius: "10px"
                          }}>
                            <div style={{
                              fontWeight: "600"
                            }}>
                              Skipped
                            </div>
                            <div style={{
                              width: "auto",
                              padding: "4px 10px",
                              backgroundColor: "#d84936",
                              color: "#ffffff",
                              borderRadius: "5px"
                            }}>
                              {"-"}
                            </div>
                          </Box>
                        </Box>

                        <Box>
                          {state?.type == "upload" && <>
                            <Box sx={{
                              width: 45,
                              height: 50,
                              backgroundColor: "#e4f0ff",
                              borderRadius: 2,
                              paddingTop: 1,
                              textAlign: "center",
                              cursor: "pointer"
                            }}
                              onClick={() => {
                                SkipdataDownload(
                                  id,
                                  "csv"
                                )
                              }}>
                              <Iconify
                                width="35px"
                                style={{
                                  color: "#0078ff"
                                }}
                                icon="mdi:file-download" />
                            </Box>
                          </>
                          }
                        </Box>
                      </Box>
                    </Box>

                  </Stack>

                );
              }
            )}
          </Grid>
        </Grid>

        <Modal open={uploadModal} onClose={() => setuploadModal(false)}>
          <>
            <Box
              sx={{
                position: "absolute",
                right: 10,
                height: 25,
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => setuploadModal(false)}
            >
              <Iconify
                icon="basil:cancel-solid"
                width="50px"
                style={{
                  color: "#ffffff",
                }}
              />
            </Box>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Upload templateid={state.template_id} uploadheader={uploadFields} type={modeltype} action={action} closepopup={closepopup} typemode={typemode} mode={mode} />
            </Box>
          </>
        </Modal>
        <AppSnacks
          snackProps={snackProps}
          setSnackProps={setSnackProps}
        />
      </Container>
    </>
  );
};

export default ImpExpreport;
