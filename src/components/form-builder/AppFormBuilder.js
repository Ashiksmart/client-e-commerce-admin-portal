import React, { useState, useMemo, useEffect } from "react";

import { useSelector } from "react-redux";
import { Typography, Box } from "@mui/material";

import {
    EcomTextFld,
    EcomTextAreaFld,
    EcomDateFld,
    EcomImgPickerFld,
    EcomRadioFld,
    EcomCheckFld,
    EcomSelectFld,
    EcomToggleFld,
    EcomTimeFld,
    EcomDateTimeFld,
    EcomMultiSelectFld,
    EcomTagSelectFld,
    NoField,
    EcomColorPicker
} from '../form-builder/AppFormFields'

const AppFormBuilder = React.forwardRef((props, ref) => {
    const {
        formikProp,
        Dynamicfield,
        formConfig,
        handleFileUpload,
        imageList
    } = props;

    const [formV, setFormView] = useState(false);

    React.useImperativeHandle(ref, () => ({
    }));

    const renderFormElements = (section) =>

        (section.fields).map((item, index) => {
            const fieldMap = {
                TextInput: EcomTextFld,
                LongTextInput: EcomTextAreaFld,
                Checkbox: EcomCheckFld,
                DatetimePicker: EcomDateTimeFld,
                DatePicker: EcomDateFld,
                TimePicker: EcomTimeFld,
                RadioButton: EcomRadioFld,
                SelectList: EcomSelectFld,
                MultiSelectList: EcomMultiSelectFld,
                TagSelectLsit: EcomTagSelectFld,
                // toggle: EcomToggleFld,
                imgpicker: EcomImgPickerFld,
                ColorPicker: EcomColorPicker,
                NOFIELD: NoField
            };
            const Component = fieldMap[item.type];
            if (formikProp.errors) {
                var error =
                    formikProp.errors.hasOwnProperty(item.model) && formikProp.errors[item.model];
                var touched =
                    formikProp.touched.hasOwnProperty(item.model) && formikProp.touched[item.model];
            }
            if (item) {
                return (
                    <Box
                        sx={{
                            width: '100%',
                            marginBottom: 3
                        }}
                    >
                        <Component
                            key={index}
                            label={item.label}
                            name={item.model}
                            placeholder={item.placeholder}
                            value={formikProp.values[item.model] || []}
                            onChange={formikProp.handleChange(item.model)}
                            error={error}
                            options={item.values}
                            validations={item.validations}
                            multiSelect={item.multiSelect}
                            disable={item.disabled}
                            setFieldValue={formikProp.setFieldValue}
                            touched={touched}
                            required={item.required}
                            submithandle={() => { }}
                            formikProp={formikProp}
                            handleFileUpload={handleFileUpload}
                            multiple={item.multiple}
                            link={item.link}
                            lazyapidata={formConfig.lazyDataApi}
                        />
                    </Box>
                );
            }
            return null;
        });

    const handleSubmit = (values, actions) => { };

    return (
        <>
            {Object.keys(formConfig).length > 0 && formConfig.fields.map((section) => {
                return (
                    <Box sx={{
                        width: '100%',
                        marginBottom: 5
                    }}>
                        <Box
                            sx={{
                                marginBottom: 2
                            }}
                        >
                            <Typography variant="h6" component="h5">
                                {section.heading}
                            </Typography>
                        </Box>
                        <Box>
                            {renderFormElements(section)}
                        </Box>
                    </Box>
                )
            })}
            {Dynamicfield !== undefined &&Dynamicfield.length > 0 && Dynamicfield.map((section) => {
                return (
                    <Box sx={{
                        width: '100%',
                        marginBottom: 5
                    }}>
                        <Box
                            sx={{
                                marginBottom: 2
                            }}
                        >
                            <Typography variant="h6" component="h5">
                                {section.heading}
                            </Typography>
                        </Box>
                        <Box>
                            {renderFormElements(section)}
                        </Box>
                    </Box>
                )
            })}
        </>
    );
});
export default AppFormBuilder;
