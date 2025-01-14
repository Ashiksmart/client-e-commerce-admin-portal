import { useEffect, useState, useMemo } from "react";
import AppTogglebuilder from "../components/group-toggle/AppTogglebuilder";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import Iconify from "../components/iconify";
import { Box, Container, Typography, Stack, TextField } from "@mui/material";
import AppformTrack from "../components/form-builder/AppformTrack";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import ServiceProxy from "../services/serviceProxy";
import { CustomFieldhandel } from "../utils/CustomformStr";
import AppDialog from "../components/general/AppDialog";
import { getToken } from "../services/AppService";
import AppForm from "./AppForm";
import AppDrawer from "../sections/@dashboard/app/AppDrawer";
import AppSnacks from "../components/general/AppSnacks";
import Constants from "../constants/index";
import { ConnectingAirportsOutlined } from "@mui/icons-material";
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const AppTextLink = (props) => {
  const { state } = useLocation();
  const { lable } = props
  const [items, setitems] = useState([]);

  const [templateFlds, setTemplateFlds] = useState({});

  const [TemplateApiFlds, setTemplateApiFlds] = useState({});

  const [flowdata, setflowdata] = useState([]);

  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [uploadIds, setUploadIds] = useState([]);
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
  let [saveflag,setsaveflag]=useState(false)
  let [deleteIds, setdeleteIds] = useState([]);
  const [id, setid] = useState(0);
  const [editdata, seteditdata] = useState({});
  const [initialvalue, setinitialvalue] = useState({})
  let [flowname, Setflowname] = useState("")
  let query = useQuery();
  useEffect(() => {
    fetchtemplate();
  }, []);

  let fetchtemplate = async () => {
    try {

      let temp_type = (state.type == "marketplace" ||state.type == "pipeline") ? "OSF_CU" : "PFLOW_CU"
      let template = await ServiceProxy.business.find(
        "b2b",
        "template",
        "view",
        {
          name: { $eq: temp_type },
          type: { $eq: "FLOW" }
        },
        [],
        1,
        1
      );

      if (template.cursor.totalRecords == 1) {
        let sort = [{
          column: "position",
          order: 'asc'
        }]
        template.records.forEach(async (elm) => {
          let templatefields = await ServiceProxy.business.find(
            "b2b",
            "templates_field",
            "view",
            {
              account_id: { $eq: getToken().account_id },
              template_id: { $eq: elm.id },
              is_delete: { $eq: "N" }
            },
            [],
            null,
            null,
            sort
          );
          let { field, initialvalue } = await CustomFieldhandel(templatefields.records)
          setinitialvalue(initialvalue)
          setTemplateApiFlds({
            template: elm,
            fields: field,
          });
        });
      }

      getdatafromapi()
    } catch (error) {
      console.log(error);
    }
  };

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
        ['color', 'default_status', 'display_name', 'icon', 'id', 'link_to', 'link_type', 'priority', 'status_name', 'type', 'account_id', 'app_id', 'page_type', 'name', 'content'],
        1,
        100
      );

      if (flow_status.cursor.totalRecords > 0) {
        Setflowname(flow_status.records[0].name)
        setflowdata(flow_status.records);
      }
      setdeleteIds([])
    } catch (error) {
      console.log(error);
    }
  }
  let router = useNavigate();
  const formik = useFormik({
    initialValues: {},
    // validationSchema: validateSchema,
    onSubmit: (values, event) => { },
  });

  let action = async (data, typeMode) => {

    if (typeMode == mode.CANCEL) {
      router(-1);
    } else if (typeMode == mode.ADD) {
      Openpopup();
    } else if (typeMode == mode.CREATE) {
      if (flowdata.find(e => e.status_name == data.status_name) == undefined || state.type === "client") {
        setflowdata((set) => {
          // if(state.type === "pipeline"){
          //   data.type =1
          // }
          data.account_id = Constants.ACCOUNT_ID;
          data.app_id = state.app_id;
          data.page_type = state.type
          set.push(data);
          return set;
        });
        setDrawerOpen(false);
      } else {
        setSnackProps({
          ...snackProps,
          snackOpen: true,
          severity: "warning",
          message: `Status Name  : '${data.status_name}' is Already Exist`
        })
      }

    } else if (typeMode == mode.EDIT) {
      let TemplateApiFldsClone = structuredClone(TemplateApiFlds)
      TemplateApiFldsClone.fields.forEach((elm) => {
        elm.fields.forEach((elem, i) => {
          if(state.type == "pipeline"){
            if (elem.model == "link_to"||elem.model == "link_type"||elem.model == "default_status") {
              console.log(elem.model, "elem.model")
              delete elm.fields[i]
            }
           
          }
          if(elem.model == "color"||elem.model == "icon"){
            delete elm.fields[i]
          }
          if (elem.model == "type") {
            if (data.priority == 1) {
              elem.values = [{ name: "Open", value: 1 }];
            } else if (data.type == 2 || (data.type == 3 && flowdata[flowdata.length - 1].type == 3 && data.link_type == elem.link_type)) {
              elem.values = [
                {
                  name: "Partially",
                  value: 3,
                },
                {
                  name: "Closed",
                  value: 2,
                },
              ];
            } else if (data.type == 3) {
              elem.values = [
                {
                  name: "Partially",
                  value: 3,
                },
              ];
            }
          }
          if(elem.model == "link_to"){
            elem.disabled=true
          }
          if (elem.model == "link_type") {
            if(data.index===0){
              elem.disabled=true
            }
            if (data["link_type"] == "child") {
              elem.values = [{ name: "Child", value: "child" }];
            } else {
              elem.values = [{ name: "Parent", value: "parent" }];
            }
          }
          if (elem.model == "priority") {
            elem.values = [{ name: `Step  ${data.priority}`, value: data.priority }];
          }
          if (elem.model == "status_name" && state.type != "client") {
            elem.disabled = true
          }
          if (data.index > 0) {
            if (elem.model == "default_status") {
              delete elm.fields[i]
            }
          }
        });
      });
      setTemplateFlds({
        ...TemplateApiFldsClone,
        initialValues: data,
        action: mode.UPDATE,
        skipped: [],
      });
      setDrawerOpen(true);
    } else if (typeMode == mode.UPDATE) {
      setflowdata((set) => {
        setdeleteIds((delset) => {
          if (set[data.index].id != undefined) {
            delset.push(set[data.index].id)
          }
          return delset
        })
        set[data.index] = data;
        delete set[data.index].index;
        return set;
      });
      setDrawerOpen(false);
    } else if (typeMode == mode.DELETE) {
      setflowdata((set) => {

        let remove_statusvalue = [];
        remove_statusvalue.push(data.index);
        let link_data = set.filter((elm) => elm.link_to == data.status_name);
        if (link_data.length > 0) {
          link_data.forEach((elem) => {
            let link_index = set
              .map((elm) => elm.status_name)
              .indexOf(elem.status_name);
            remove_statusvalue.push(link_index);
          });
        }

        if (remove_statusvalue.length > 0) {
          for (let i = remove_statusvalue.length; i > 0; i--) {
            const element = remove_statusvalue[i - 1];
            setdeleteIds((set) => {
              if (flowdata[element].id != undefined) {
                set.push(flowdata[element].id)
              }
              return set
            })
            set.splice(element, 1);
          }
        }
        // set.splice(data.index, 1);
        if (set.length > 0) {
          set.forEach((elm, i) => {
            if (i == 0) {
              elm.priority = i + 1;
              elm.type = 1;
            } else {
              elm.priority = i + 1;
            }
          });
        }

        return set;
      });
    } else if (typeMode == mode.SUB_ADD) {
      let steps = flowdata.filter(
        (elm) => elm.link_to == data.status_name && elm.link_type == "child"
      );
      let subflow = steps;
      steps = steps.length;

      let template = TemplateApiFlds;
      template.fields.forEach((elm) => {
        elm.fields.forEach((elem, i) => {
          // if (elem.model == "priority") {
          //   elem.values = [{ name: "Step 1", value: 1 }];
          // }

          if (elem.model == "link_type") {
            elem.values = [{ name: "Child", value: "child" }];
          }
          if (elem.model == "priority") {
            elem.values = [{ name: `Step  ${steps + 1}`, value: steps + 1 }];
          }
          if (steps > 0) {
            if (elem.model == "type" && subflow[steps - 1].type != 2) {
              elem.values = [
                {
                  name: "Partially",
                  value: 3,
                },
                {
                  name: "Closed",
                  value: 2,
                },
              ];
            }
          } else if (steps == 0) {
            if (elem.model == "type") {
              elem.values = [{ name: "Open", value: 1 }];
            }
          }
        });
      });

      setTemplateFlds({
        ...template,
        initialValues: {
          ...initialvalue,
          link_type: "child",
          link_to: data.status_name,
          priority: steps + 1,
        },
        action: mode.CREATE,
        skipped: [],
      });
      setDrawerOpen(true);
    } else if (typeMode === mode.SAVE) {
      let remove_ids = []
      flowdata.forEach((etd) => {
        // if (state.type == "client" || state.type == "pipeline") {
        //   etd.name = flowname
        // }
        etd.name = flowname
        if (etd.default_status == "") {
          etd.default_status = "N"
        }
        if (etd.id != undefined) {
          console.log(etd.id,"etd.priorityv1")
          remove_ids.push(etd.id)
          delete etd.id
        }
        console.log(etd.priority,"etd.priorityv")
      })
      console.log(remove_ids,"etd.priorityv")
      remove_ids = remove_ids.concat(deleteIds)

      if (state.type == "client" && flowname == "") {
        setSnackProps({
          ...snackProps,
          snackOpen: true,
          severity: "warning",
          message: `Flow Name is Required`
        })
        setsaveflag(false)
      } else {
        if(flowdata.find((elm)=>elm.priority === 2) === undefined){
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "warning",
            message: `Flow Need to close properly`
          })
          setsaveflag(false)
        }else{
          if (remove_ids.length > 0) {
            await ServiceProxy.business.bulkDelete("b2b", "workflow_status", remove_ids)
          }
          let saveItems = await ServiceProxy.business.bulkCreate(
            "b2b",
            "workflow_status",
            flowdata
          );
          if (saveItems.statusCode == 201) {
            setsaveflag(false)
            if (state.type == "client") {
              router(-1)
            } else {
              router(-1)
              getdatafromapi()
            }
          }
        }

      }

    }
  };

  const deleteSelectedData = () => {
    action(id, mode.DELETE);
    setOpenDialog(false);
  };

  let Openpopup = () => {
    setImageList([]);
    let steps = flowdata.filter(
      (elm) => elm.link_type == "" || elm.link_type == "parent"
    );
    TemplateApiFlds.fields.forEach((elm) => {
      elm.fields.forEach((elem, i) => {
        if (elem.model == "link_type") {
          elem.values = [{ name: "Parent", value: "parent" }];
        }
        if (elem.model == "priority") {
          elem.values = [{ name: `Step  ${steps.length + 1}`, value: steps.length + 1 }];
        }
        if(state.type == "pipeline"){
          if (elem.model == "link_to"||elem.model == "link_type"||elem.model == "default_status"||elem.model == "color"||elem.model == "icon") {
            console.log(elem.model, "elem.model")
            delete elm.fields[i]
          }
          
        }
        if(elem.model == "color"||elem.model == "icon"){
          delete elm.fields[i]
        }
        if(elem.model == "link_to"){
          elem.disabled=true
        }
        if (steps.length > 0) {
          if (elem.model == "type" && steps[steps.length - 1].type != 2) {
            elem.values = [
              {
                name: "Partially",
                value: 3,
              },
              {
                name: "Closed",
                value: 2,
              },
            ];
          }
          if (elem.model == "default_status") {
            console.log(elem.model, "elem.model")
            delete elm.fields[i]
          }
        } else if (steps.length == 0) {
          if (elem.model == "type") {
            elem.values = [{ name: "Open", value: 1 }];
          }
        }
      });
    });

    console.log(steps.length, "stepsstepsstepssteps")
    setTemplateFlds({
      ...TemplateApiFlds,
      initialValues: {
        ...initialvalue,
        priority: steps.length + 1,
      },
      action: mode.CREATE,
      skipped: [],
    });
    setDrawerOpen(true);
  };

  let CheckParent = (data, type) => {
    if (type == "child") {
      let steps = flowdata.filter(
        (elm) => elm.link_to == data.status_name && elm.link_type == "child"
      );

      if (
        (steps.length > 0 && steps[steps.length - 1].type != 2) ||
        steps.length == 0
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      let steps = flowdata.filter(
        (elm) =>
          elm.link_type == "parent" ||
          elm.link_type == "" ||
          elm.link_type == null
      );

      if (
        (steps.length > 0 && steps[steps.length - 1].type != 2) ||
        steps.length == 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <>
          <Helmet>
            <title>{lable}</title>
          </Helmet>

          <Container maxWidth='none'
            sx={{
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              left: '400px',
              top: '50px',
              right: '0px',
              bottom: '60px',
              overflow: 'auto',
              paddingBottom: '10px'
            }}>
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
                  mb={5}
                >
                  <Typography variant="h4" gutterBottom>
                    {lable}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    marginBottom: 5,
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label="Flow Name"
                    variant="outlined"
                    disabled={state?.mode == "UPDATE" ? true : false}
                    value={flowname}
                    onChange={(e) => {
                      Setflowname(e.target.value)
                    }}
                  />
                </Box>

                <AppformTrack
                  formikProp={formik}
                  action={action}
                  mode={mode}
                  data={flowdata}
                  CheckParent={CheckParent}
                />
              </Box>
            </div>

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
                borderTop: '1px solid #f0f0f0'
              }}
            >
              <Button
                onClick={() => {
                  action(undefined, mode.CANCEL);
                }}
                variant="contained"
                startIcon={<Iconify icon="carbon:zoom-reset" />}
              >
                Back
              </Button>
              <Button
                disabled={flowdata.length === 0 || saveflag}
                type="submit"
                variant="contained"
                startIcon={<Iconify icon="fluent:save-28-filled" />}
                onClick={() => {
                  setsaveflag(true)
                  action(undefined, mode.SAVE);
                }}
              >
                Save
              </Button>
            </Box>

          </Container>
        </>
      </form>
      <AppDialog
        dialogTitle={"Confirm"}
        dialogContent={"Are you Sure want to Proceed ?"}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleDelete={() => deleteSelectedData()}
      />
      <AppDrawer
        children={
          <AppForm
            formSchema={templateFlds}
            action={action}
            mode={mode}
            allObj={true}
            imageList={imageList}
          />
        }
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
      <AppSnacks snackProps={snackProps} setSnackProps={setSnackProps} />
    </>
  );
};

export default AppTextLink;
