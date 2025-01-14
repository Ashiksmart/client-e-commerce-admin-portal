import { useEffect, useState } from 'react';
import AppFormBuilder from '../components/form-builder/AppFormBuilder';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Iconify from '../components/iconify';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { string } from 'prop-types';
import { useLocation } from 'react-router-dom'
import { saveProduct } from './ProductsPage';

export function createYupSchema(schema, config) {
  const { model, validationType, validations = [], label } = config;

  if (!Yup[validationType]) {
    return schema;
  }
  let validator = Yup[validationType]();
  validations.forEach((validation) => {
    const { params, type } = validation;
    if (!validator[type]) {
      return;
    }
    validator = validator[type](...params);
  });

  schema[model] = validator;
  return schema;
}

const AppForm = (props) => {
  const [onsubmit_, setonsubmit] = useState(false)

  const {
    Dynamicfield,
    formSchema,
    subform,
    action,
    handleFileUpload,
    indexvalue, index,
    uiBuilder,
    mode,
    allObj
  } = props
  const { pathname } = useLocation();


  let yupSchema = {}

  let initialValues = {};
  if (formSchema && Object.keys(formSchema).length > 0 && formSchema != null) {
    formSchema?.fields?.map((fld) => {
      yupSchema = { ...yupSchema, ...fld.fields.reduce(createYupSchema, {}) }
      fld.fields.map((eachFld) => {
        initialValues[eachFld.model] = eachFld.value || ""
      })
    })
  }
  initialValues = formSchema && formSchema != null ? formSchema.initialValues : {}
  console.log(initialValues);

  console.log(yupSchema);
  const validateSchema = Yup.object().shape(yupSchema);
  console.log(validateSchema);
  // const validateSchema = Yup.object({
  //   first_name: Yup.string()
  //     .required('sdsd Required')
  // })
  // 
  // 

  // const handleSubmit = (e, props) => {
  //   e.preventDefault()
  //   
  // } 
  const formik = useFormik(({
    initialValues: initialValues || {},
    validationSchema: validateSchema,
    onSubmit: (values, event) => {
      //SAN

      if (!allObj) {
        Object.keys(values).forEach((elm) => {
          if (!yupSchema.hasOwnProperty(elm) && elm !== "id") {
            delete values[elm]
          }
        })
      }
      else { }
      formSchema.skipped.forEach((elm) => [
        delete values[elm]
      ])
      action(values, formSchema.action, onsubmit_, formSchema)
    }
  }))

  console.log(formik);

  return (
    <>
      <Formik
        initialValues={formik.initialValues}
        validationSchema={formik.validationSchema}
        onSubmit={formik.handleSubmit}
      >
        {props => (
          <form
            onSubmit={formik.handleSubmit}>
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    paddingRight: uiBuilder === true ? 0 : subform === true ? 5 : 5,
                    paddingLeft: uiBuilder === true ? 0 : subform === true ? 5 : 5,
                    paddingTop: uiBuilder === true ? 0 : subform === true ? 1 : 5,
                    paddingBottom: uiBuilder === true ? 0 : subform === true ? 1 : 5,
                    width: '100%',
                    // height: '100%',
                    overflow: subform === true ? 'hidden' : 'auto',
                    position: (subform === true || uiBuilder === true) ? 'static' : 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 60,
                    height: 'calc(100% - 100px)'
                  }}
                >
                  <AppFormBuilder
                    Dynamicfield={Dynamicfield}
                    formikProp={formik}
                    formConfig={formSchema}
                    handleFileUpload={handleFileUpload}
                  />
                </Box>
                <Box sx={{
                  height: 60,
                  padding: 2,
                  paddingRight: 5,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 4,
                  alignItems: 'center',
                  position: (subform === true || uiBuilder === true) ? 'static' : 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: uiBuilder === true ? '#f7f7f7' : '#ffffff',
                  borderRadius: uiBuilder === true ? 3 : 0
                }}>
                  {subform !== true && <>
                    {(mode.FILTER === formSchema.action) && <Button onClick={() => { action({}, 'reset') }} variant="contained" startIcon={<Iconify icon="carbon:zoom-reset" />}
                    >
                      Reset
                    </Button>}
                    <Button type="submit" variant="contained" startIcon={<Iconify icon="fluent:save-28-filled" />}>
                      Save
                    </Button>
                  </>}

                  {
                    subform === true && <>
                      {/* {formSchema.action === mode.CREATE && <>
                      <Button onClick={() => { action({}, mode.DELETE) }} variant="contained" startIcon={<Iconify icon="carbon:zoom-reset" />}
                      >
                        Delete
                      </Button>
                      <Button type="submit" variant="contained" startIcon={<Iconify icon="fluent:save-28-filled" />}>
                        Add
                      </Button>
                      
                    </>} */}
                      {formSchema.action === mode.UPDATE && <>
                        <Button type="submit" variant="contained" startIcon={<Iconify icon="fluent:save-28-filled" />}>
                          {indexvalue.length === 1 ? "Add" : (indexvalue.length - 1) === (index) ? "Save" : "Save Edit"}
                        </Button>
                        {indexvalue.length > 1 && <Button onClick={() => { action({}, mode.DELETE) }} variant="contained" startIcon={<Iconify icon="carbon:zoom-reset" />}
                        >
                          Delete
                        </Button>}
                        {(indexvalue.length - 1) === (index) && <Button type="submit" onClick={() => { setonsubmit(true) }} variant="contained" startIcon={<Iconify icon="fluent:save-28-filled" />}>
                          Submit
                        </Button>}
                      </>}
                    </>
                  }

                </Box>
              </Box>
            </>
          </form>
        )}

      </Formik>

    </>
  )
}

export default AppForm