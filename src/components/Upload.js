import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { EcomSelectFld } from "./form-builder/AppFormFields";
import { Formik, useFormik } from "formik";
import Button from "@mui/material/Button";
import Iconify from "../components/iconify";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import Link from "@mui/material/Link";

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';



import * as Yup from "yup";
import serviceProxy from "../services/serviceProxy";

import { getTitle } from "../utils/getTitle";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

const Upload = (props) => {
  let { uploadheader, type, action, closepopup, typemode, mode, templateid } = props;
  const [steps, Setstep] = useState([])
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());



  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);


  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = (formik, currentStep) => {
    console.log(currentStep, typemode, "currentStep");

    if ((currentStep + 1 === 4 && typemode == mode.CREATE)) {
      formik.submitForm();
    } else if (currentStep + 1 === 2 && (typemode === mode.DELETE || typemode === mode.UPDATE)) {
      let payload = {
        fileprops
      }
      action(typemode, payload)
    }



    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);


    if (currentStep + 1 === 2 && type == "export") {
      exportData()
    }

  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    // setActiveStep(0);
    closepopup()
  };

  const [alignment, setAlignment] = useState("");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const [Headers, setHeaders] = useState([]);
  const [appHeaders, appsetHeaders] = useState([]);
  const [schemavalidate, setschemavalidate] = useState({});
  const [fileprops, setfileprops] = useState([]);

  useEffect(() => {
    if (type == "export") {
      Setstep(["Select File", "Export Data"])
    } else if (type == "upload" && typemode == mode.CREATE) {
      Setstep(["Select File", "Upload File", "Match Fields", "Duplicate Check"])
    } else if (type == "upload" && (typemode == mode.UPDATE || typemode == mode.DELETE)) {
      Setstep(["Select File", "Upload File"])

    }
  }, [type, typemode])
  useEffect(() => {
    appsetHeaders(uploadheader);
    setLeft(uploadheader)
  }, [uploadheader]);
  const determineDelimiter = (filename) => {
    // Extract the file extension
    const extension = filename.split(".").pop().toLowerCase();

    // Determine the delimiter based on the file extension
    return extension === "csv" ? "," : "\t";
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setfileprops(file);

    Papa.parse(file, {
      complete: (result) => {
        // 'result.data' contains the parsed file data as an array of arrays
        // Extract headers from the first row
        const headers = result.data[0];
        setHeaders(headers);
        setschemavalidate((per) => {
          headers.forEach((itm) => {
            per[itm] = Yup.string().required("Required Field");
          });
          return per;
        });

        console.log(headers);
      },
      delimiter: determineDelimiter(file.name),
      header: false, // Since we are extracting headers, set this to false
      skipEmptyLines: true,
    });
  };

  let fieldRender = (formik, Headers) => {
    return Headers.map((header, index) => {
      if (formik.errors) {
        console.log(formik.errors, formik.touched, "formik.errors");
        var error =
          formik.errors.hasOwnProperty(header) && formik.errors[header];
        var touched =
          formik.touched.hasOwnProperty(header) && formik.touched[header];
      }
      return (
        <>
          <li key={index}>{header}</li>
          <div style={{ width: "90%" }}>
            <EcomSelectFld
              name={header}
              value={formik.values[header] || []}
              key={index}
              options={appHeaders}
              error={error}
              touched={touched}
              formikProp={formik}
            />
          </div>
        </>
      );
    });
  };







  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  const [title, settitle] = useState({ left: "Fields", right: "Check Field" })

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => {
    return (<Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          height: 400,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value.value}-label`;

          return (
            <ListItemButton
              key={value.value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.name}`} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>)
  };

  const formik = useFormik({
    initialValues: {},
    validationSchema: Yup.object().shape(schemavalidate),
    onSubmit: (values, event) => {
      let payload = {
        values,
        right,
        fileprops
      }
      action(typemode, payload)
    }
  });


  let SampleFileDownload = () => {
    let query = {
      application: "b2b",
      template_id: templateid.toString(),
      type: alignment
    }
    serviceProxy.importExportDoc.downloadfile(query)
  }

  async function exportData() {
    let payload = {
      right,
      alignment
    }
    action(typemode, payload)
  }
  return (
    <>
      <Box sx={{ width: "100%" }} className="upload-bgcolor scrolling-view">
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <>
            <Box sx={{
              height: "calc(100% - 100px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}>
              <Typography sx={{ mt: 2, mb: 1, textAlign: "center" }}>
                <h2>
                  {type.toUpperCase()} - Finished
                </h2>
              </Typography>
            </Box>
            <Box sx={{
              display: "flex", flexDirection: "row", pt: 2,
              borderTop: "1px solid #f0f0f0"
            }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Close</Button>
            </Box>
          </>
        ) : (
          <>
            <Typography sx={{ mt: 2, mb: 1, textAlign: "center" }}>
              <h2>
                Steps {activeStep + 1} -
                {(activeStep + 1 == 4) || (activeStep + 1 == 2 && type == "export")}{" "}
                Type{" "}
              </h2>
            </Typography>
            <Box sx={{
              height: "calc(100% - 180px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}>

              {activeStep + 1 == 1 && (
                <ToggleButtonGroup
                  color="primary"
                  value={alignment}
                  exclusive
                  onChange={handleChange}
                  aria-label="Platform"
                >
                  <ToggleButton value="csv">CSV</ToggleButton>
                  <ToggleButton value="txt">TXT</ToggleButton>
                </ToggleButtonGroup>
              )}
              {activeStep + 1 == 2 && type !== "export" && (
                <Box sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "20px"
                }}>
                  <input
                    className="profilepic__change__btn"
                    type="file"
                    accept={`.${alignment}`}
                    id="imageInput"
                    onChange={handleFileUpload}
                  />
                  <Link href="#" underline="hover" onClick={SampleFileDownload} >
                    {"Sample " + alignment}
                  </Link>
                </Box>
              )}
              {activeStep + 1 == 3 && Headers.length > 0 && type !== "export" && (
                <Grid sx={{
                  width: "100%",
                  overflow: "auto",
                  paddingBottom: "20px"
                }}>
                  <h2>File Headers:</h2>
                  <ul>{fieldRender(formik, Headers)}</ul>
                  {/* <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Iconify icon="fluent:save-28-filled" />}
                      onClick={() => {}}
                    >
                      {" "}
                      UPLOAD
                    </Button> */}
                </Grid>
              )}
              {((activeStep + 1 == 4) || (activeStep + 1 == 2 && type == "export")) &&
                <Grid container spacing={5} justifyContent="center" alignItems="center">
                  <Grid sx={{
                    width: "40%"
                  }} item>{customList(title.left, left)}</Grid>
                  <Grid item>
                    <Grid container direction="column" alignItems="center">
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                      >
                        &gt;
                      </Button>
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                      >
                        &lt;
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid sx={{
                    width: "40%"
                  }} item>{customList(title.right, right)}</Grid>
                </Grid>
              }
            </Box>

            <Box sx={{
              display: "flex", flexDirection: "row", pt: 2,
              borderTop: "1px solid #f0f0f0"
            }}>
              <Button
                type="submit"
                variant="contained"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                {" "}
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {/* {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )} */}

              <Button
                type="submit"
                variant="contained"
                onClick={() => handleNext(formik, activeStep)}
              >
                {" "}
                {activeStep === steps.length - 1 ? getTitle(type) : "Next"}
              </Button>
            </Box>

          </>
        )}
      </Box>
      {/* <div className='upload-bgcolor scrolling-view'>
             {Headers.length > 0 && (
                <div>
                <h2>File Headers:</h2>
                {JSON.stringify(appHeaders)}
                <form onSubmit={formik.handleSubmit}>
                <ul>
                {fieldRender(Headers)}
                </ul>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Iconify icon="fluent:save-28-filled" />}
                        onClick={() => {
                          
                        }}
                        > UPLOAD
                        </Button>
                </form>
                </div>
             )}
        </div> */}
    </>
  );
};

export default Upload;
