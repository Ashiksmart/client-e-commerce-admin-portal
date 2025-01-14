import { useEffect, useState } from 'react';
import AppTogglebuilder from '../components/group-toggle/AppTogglebuilder';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup'
import Button from '@mui/material/Button';
import Iconify from '../components/iconify';
import { Box } from '@mui/material';
import AppFormBuilder from '../components/form-builder/AppFormBuilder';

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

const AppToggleGroup = (props) => {
  const {
    viewitems,
    formSchema,
    action,
    mode
  } = props

  let yupSchema = {}


  formSchema.fields.map((fld) => {
    yupSchema = { ...yupSchema, ...fld.fields.reduce(createYupSchema, {}) }
  })

  const validateSchema = Yup.object().shape(yupSchema);

  const formik = useFormik(({
    initialValues: formSchema.initialValues || {},
    validationSchema: validateSchema,
    onSubmit: (values, event) => {
      
      formSchema.skipped.forEach((elm)=>{
        delete values[elm]
    })
      action(values,formSchema.action)
    }
  }))


  return (
    <>
          <form
            onSubmit={formik.handleSubmit}
          >
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
                    padding: 5,
                    // height: '100%',
                    overflow: 'auto',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 60,
                    height: 'calc(100% - 100px)'
                  }}
                >
                 <AppFormBuilder
                    formikProp={formik}
                    formConfig={formSchema}
                  />
                  {formSchema.action !=="filter" && <AppTogglebuilder
                    formikProp={formik}
                    data={viewitems}
                  />}
                </Box>
                <Box sx={{
                  height: 60,
                  padding: 2,
                  paddingRight: 5,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 4,
                  alignItems: 'center',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0
                }}>
                  {mode.FILTER === formSchema.action && <Button onClick={()=>{action({},'reset')}} variant="contained" startIcon={<Iconify icon="carbon:zoom-reset" />}>
                    Reset
                  </Button>}
                  <Button type="submit" variant="contained" startIcon={<Iconify icon="fluent:save-28-filled" />}>
                    Save
                  </Button>
                </Box>
              </Box>
            </>
          </form>



    </>
  )
}

export default AppToggleGroup