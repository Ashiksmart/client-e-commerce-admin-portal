import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    TextField,
    Stack,
    Container,
    Select,
    MenuItem,
    InputLabel,
    Checkbox,
    Radio,
    FormControlLabel,
    Switch,
    FormGroup,
    FormLabel,
    RadioGroup,
    Autocomplete,
    Button, Input, FormHelperText, FormControl, Menu,
    ListItemText,
} from '@mui/material';
import { ColorPicker, ColorInput } from 'material-ui-color';
import { formik, useformik } from 'formik';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import FileUpload from 'react-material-file-upload';
import { UndoRounded } from '@mui/icons-material';
import { useSelector, useDispatch } from "react-redux"
import { setdata } from "../../redux/DynamicData/DataAction"

export const EcomTextFld = (props) => {
    const {
        type, name, label, options, errors, disable, formikProp, ...rest
    } = props
    return (
        <>
            <TextField
                fullWidth
                error={formikProp.touched[name] && formikProp.errors[name]}
                helperText={formikProp.touched[name] && formikProp.errors[name]}
                label={label}
                name={name}
                disabled={disable}
                onBlur={formikProp.handleBlur}
                onChange={formikProp.handleChange}
                value={formikProp.values[name]}
                required={formikProp.errors[name]}
            />

        </>
    )
}
export const EcomTextAreaFld = (props) => {
    const {
        type, name, label, options, errors, disable, formikProp, ...rest
    } = props
    return (
        <>
            <TextField
                multiline
                minRows={4}
                fullWidth
                disabled={disable}
                error={formikProp.touched[name] && formikProp.errors[name]}
                helperText={formikProp.touched[name] && formikProp.errors[name]}
                label={label}
                name={name}
                onBlur={formikProp.handleBlur}
                onChange={formikProp.handleChange}
                value={formikProp.values[name]}
                required={formikProp.errors[name]}
            />

        </>
    )
}

export const EcomDateFld = (props) => {
    const {
        type,
        name,
        label,
        options,
        errors,
        disable,
        formikProp,
        required,
        ...rest
    } = props
    return (
        <>
            <FormControl
                required={formikProp.errors[name]}
                error={formikProp.touched[name] && formikProp.errors[name]}
                variant="standard"
                sx={{
                    width: '100%'
                }}
            >
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                >
                    <DatePicker
                        sx={{
                            width: '100%'
                        }}
                        fullWidth
                        label={label}
                    />
                </LocalizationProvider>
            </FormControl>
        </>
    )
}

export const EcomTimeFld = (props) => {
    const {
        type,
        name,
        label,
        options,
        errors,
        disable,
        formikProp,
        required,
        ...rest
    } = props
    return (
        <>
            <FormControl
                required={formikProp.errors[name]}
                error={formikProp.touched[name] && formikProp.errors[name]}
                variant="standard"
                sx={{
                    width: '100%'
                }}
            >

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopTimePicker
                        label={label}
                        defaultValue={dayjs('2022-04-17T15:30')}
                    />
                </LocalizationProvider>
            </FormControl>
        </>
    )
}

export const EcomDateTimeFld = (props) => {
    const {
        type,
        name,
        label,
        options,
        errors,
        disable,
        formikProp,
        required,
        ...rest
    } = props
    return (
        <>
            <FormControl
                required={formikProp.errors[name]}
                error={formikProp.touched[name] && formikProp.errors[name]}
                variant="standard"
                sx={{
                    width: '100%'
                }}
            >
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                >
                    <DateTimePicker
                        label={label}
                        fullWidth
                        disabled={disable}
                        error={errors}
                        helperText={formikProp.touched[name] && formikProp.errors[name]}
                        name={name}
                        onChange={(date) => {
                            formikProp.setFieldValue(name, date);
                        }}
                        onBlur={formikProp.handleBlur}
                        value={formikProp.values[name]}
                    />
                </LocalizationProvider>
            </FormControl>
        </>
    )
}

export const EcomCheckFld = (props) => {
    const {
        type, name, label, options, errors, disable, formikProp, ...rest
    } = props

    const handleSelect = (name, value, e) => {

        if (e == true) {
            formikProp.setFieldValue(name, 'Y');
        }
        else {
            formikProp.setFieldValue(name, 'N');
        }
    }

    return (
        <>
            <FormControl
                required={formikProp.errors[name]}
                error={formikProp.touched[name] && formikProp.errors[name]}
                component="fieldset"
                sx={{ m: 3 }}
                variant="standard"
            >
                <FormLabel component="legend">{label}</FormLabel>
                {options &&
                    options.map((option) => {
                        return (
                            <>

                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                // checked={formikProp.values[name].includes(option.value)}
                                                disabled={disable}
                                                onChange={(e) => handleSelect(name, formikProp.values[name], e.target.checked)}
                                                name={option.name}
                                            />
                                        }
                                        label={option.value}
                                    />
                                </FormGroup>
                            </>
                        )
                    }
                    )}

                <FormHelperText>{formikProp.touched[name] && formikProp.errors[name]}</FormHelperText>
            </FormControl>

        </>
    )
}

export const EcomRadioFld = (props) => {
    const {
        type, name, label, options, errors, disable, formikProp, ...rest
    } = props
    return (
        <>
            <FormControl
                error={formikProp.touched[name] && formikProp.errors[name]}
                variant="standard"
                required={formikProp.errors[name]}
            >
                <FormLabel id="demo-error-radios">{label}</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-error-radios"
                    name={name}
                    // value={}
                    onChange={formikProp.handleChange}
                >
                    {options &&
                        options.map((option) => {
                            return (
                                <>
                                    <FormControlLabel
                                        value={option.value}
                                        control={<Radio />}
                                        label={option.name}
                                    />
                                </>
                            )
                        })
                    }
                </RadioGroup>
                <FormHelperText>{formikProp.touched[name] && formikProp.errors[name]}</FormHelperText>
            </FormControl>
            {/* <TextField
                type={type}
                fullWidth
                error={formikProp.touched[name] && formikProp.errors[name]}
                helperText={formikProp.touched[name] && formikProp.errors[name]}
                label={label}
                name={name}
                disabled={disable}
                onBlur={formikProp.handleBlur}
                onChange={formikProp.handleChange}
                value={formikProp.values[name]}
                assign

            /> */}

        </>
    )
}

export const EcomSelectFld = (props) => {
    const dispatch = useDispatch()
    let data = useSelector(state => state.Dynamicdata.data)
    let {
        type, name, label, options, errors, disable, formikProp, lazyapidata, link, ...rest
    } = props

    let [optionsvalue, setoptionsvalue] = useState([])
    const handleSelect = async (name, event) => {
        formikProp?.setFieldValue(name, event.target.dataset.value);
        if ((link?.is_link && link?.link_type == "parent" || formikProp?.values[name]) && lazyapidata) {
            if (lazyapidata) {
                formikProp.setFieldValue(link.linked_to, "");
                await lazyapidata(link?.linked_to, name, event.target.dataset.value)
            }
        }
    }
    useEffect(() => {
        setoptionsvalue(options)
        if (data[name] != undefined && link?.is_link && link?.link_type == "child") {
            setoptionsvalue(data[name])
        }
    }, [data])

    useEffect(() => {
        if ((link?.is_link && link?.link_type == "parent" || formikProp?.values[name]) && lazyapidata) {
            if (lazyapidata) {
                lazyapidata(link?.linked_to, name, formikProp?.values[name])
            }
        }
    }, [])

    return (
        <>
            {/* <FormControl
                fullWidth
            // error={formikProp.touched[name] && formikProp.errors[name]}
            >
                <Autocomplete
                    name={name}
                    disablePortal
                    getOptionLabel={(option) => option.value}
                    autoHighlight
                    id="combo-box-demo"
                    options={options}
                    sx={{ width: '100%' }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            variant="outlined"
                            name={name}
                            disabled={disable}
                            onBlur={formikProp.handleBlur}
                            error={formikProp.touched[name] && Boolean(formikProp.errors[name])}
                            value={formikProp.values[name]}
                        />
                    )}
                />
            </FormControl> */}
            <FormControl
                fullWidth
                error={formikProp.touched[name] && formikProp.errors[name]}
                required={formikProp.errors[name]}
            >
                <InputLabel id={name}>
                    {label}
                </InputLabel>
                <Select
                    labelId={name}
                    label={label}
                    name={name}
                    disabled={disable}
                    style={{ width: '100%' }}
                    onBlur={formikProp?.handleBlur}
                    // onSelect={handleSelect}
                    // onChange={handleSelect}
                    // onChange={(e) => handleSelect(name, formikProp.values[name], e.target.value)}
                    // error={formikProp.touched[name] && formikProp.errors[name]}
                    value={formikProp?.values[name] || []}
                    assign
                    MenuProps={{
                        style: {
                            maxHeight: 300
                        }
                    }}
                >
                    {optionsvalue &&
                        optionsvalue.map((opt) => {
                            return (
                                <MenuItem
                                    id={opt.id}
                                    key={opt.name}
                                    value={opt.value}
                                    style={{ width: '100%' }}
                                    onClick={(event) => handleSelect(name, event)}
                                >
                                    {opt.name}
                                </MenuItem>
                            );
                        })}
                </Select>
                <FormHelperText>
                    {formikProp.touched[name] && formikProp.errors[name]}
                </FormHelperText>
            </FormControl>
            {/* <FormControl
                fullWidth
                error={formikProp.touched[name] && formikProp.errors[name]}
            >

                <InputLabel id={name}>
                    {label}
                </InputLabel>
                <Select
                    labelId={name}
                    label={label}
                    name={name}
                    disabled={disable}
                    style={{ width: '100%' }}
                    onBlur={formikProp.handleBlur}
                    onSelect={handleSelect}
                    // onChange={(e) => handleSelect(name, formikProp.values[name], e.target.value)}
                    value={formikProp.values[name]}
                    error={formikProp.touched[name] && formikProp.errors[name]}
                    {...rest}
                >
                    {options &&
                        options.map((option) => {
                            return (
                                <MenuItem
                                    id={option.name}
                                    key={option.name}
                                    value={option.value || ''}
                                    style={{ width: '100%' }}
                                >
                                    {option.name}
                                </MenuItem>
                            );
                        })}
                </Select>
                <FormHelperText>
                    {formikProp.touched[name] && formikProp.errors[name]}
                </FormHelperText>
            </FormControl> */}


        </>
    )
}

export const EcomMultiSelectFld = (props) => {
    let data = useSelector(state => state.Dynamicdata.data)
    const {
        type, name, label, options, errors, disable, formikProp, lazyapidata, link, ...rest
    } = props

    let [optionsvalue, setoptionsvalue] = useState([])
    const [selectedNames, setSelectedNames] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


    const handleSelect = async (event_value) => {
        formikProp.setFieldValue(name, event_value);
        if (link.is_link && link.link_type == "parent" || formikProp.values[name]) {
            if (lazyapidata) {
                await lazyapidata(link.linked_to, name, event_value)
            }
        }
    }

    useEffect(() => {
        console.log(data);
        setoptionsvalue(options)
        if (data[name] != undefined && link.is_link && link.link_type == "child") {
            // setSelectedNames(data[name].filter(item => formikProp.values[name].includes(item.id)))
            setoptionsvalue(data[name])
        }
    }, [data])

    useEffect(() => {
        if (link.is_link && link.link_type == "parent" || formikProp.values[name]) {
            console.log(lazyapidata);
            if (lazyapidata) {
                lazyapidata(link.linked_to, name, formikProp.values[name])
            }
        }
    }, [])

    const handleChange = (event, newValue) => {
        const cityCodes = newValue.map((item) => item.id);
        formikProp.setFieldValue(name, cityCodes);
        handleSelect(cityCodes)
        setSelectedNames(newValue);
    };

    useEffect(() => {
        if (formikProp.values[name]) {
            console.log(formikProp.values[name]);
            setSelectedNames(options.filter(item => formikProp.values[name].includes(item.id)))
            if (name === "city") {
                console.log(optionsvalue);
                setSelectedNames(optionsvalue.filter(item => formikProp.values[name].includes(item.id)))
            }
        }
    }, [optionsvalue, options])

    console.log(selectedNames);

    return (
        <>
            <FormControl
                fullWidth
                error={formikProp.touched[name] && formikProp.errors[name]}
                required={formikProp.errors[name]}
            >
                <Autocomplete
                    multiple
                    name={name}
                    disabled={disable}
                    options={optionsvalue}
                    getOptionLabel={(option) => option.name}
                    onChange={handleChange}
                    value={selectedNames}
                    onBlur={formikProp.handleBlur}
                    disableCloseOnSelect
                    isOptionEqualToValue={(option, value) => option === value}
                    // error={formikProp.touched[name] && formikProp.errors[name]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label={label}
                            name={name}
                            placeholder={label}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                            }}
                            error={formikProp.touched[name] && formikProp.errors[name]}
                        />
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <span {...getTagProps({ index })} key={index}>
                                {option.name},
                            </span>
                        ))
                    }
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox checked={selected} />
                            {option.name}
                        </li>
                    )}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 300,
                            },
                        },
                    }}
                />
                <FormHelperText>
                    {formikProp.touched[name] && formikProp.errors[name]}
                </FormHelperText>
            </FormControl>
        </>
    )
}

export const EcomTagSelectFld = (props) => {
    let data = useSelector(state => state.Dynamicdata.data)

    const {
        type, name, label, options, errors, disable, lazyapidata, link, formikProp, ...rest
    } = props

    let [optionsvalue, setoptionsvalue] = useState([])
    // const handleSelect = (event, value) => {
    //     const uniqueNewValues = Array.from(new Set(value))
    //     formikProp.setFieldValue(name, uniqueNewValues);
    // }
    console.log(data);
    const handleSelect = async (event, event_value) => {
        console.log(event_value);
        formikProp.setFieldValue(name, event_value);
        if (link.is_link && link.link_type == "parent" || formikProp.values[name]) {
            if (lazyapidata) {
                await lazyapidata(link.linked_to, name, event_value)
            }

        }
    }
    useEffect(() => {
        console.log(data);
        console.log(formikProp);
        console.log(options);
        // if (Object.keys(data).length > 0) {
        //     formikProp.setFieldValue(name, [])
        // }
        setoptionsvalue(options)
        if (data[name] != undefined && link.is_link && link.link_type == "child") {
            console.log(data[name]);
            setoptionsvalue(data[name])
        }
    }, [data])

    useEffect(() => {
        if (link.is_link && link.link_type == "parent" || formikProp.values[name]) {
            console.log(lazyapidata);
            if (lazyapidata) {
                lazyapidata(link.linked_to, name, formikProp.values[name])
            }
        }
    }, [])

    const [selectedNames, setSelectedNames] = useState([]);
    // const [searchTerm, setSearchTerm] = useState('');
    // const handleChange = (event, newValue) => {
    //     const cityCodes = newValue.map((item) => item.id);
    //     formikProp.setFieldValue(name, cityCodes);
    //     handleSelect(cityCodes)
    //     setSelectedNames(newValue);
    // };

    // useEffect(() => {
    //     if (formikProp.values[name]) {
    //         console.log(options);
    //         console.log(optionsvalue);
    //         if (name === "tags") {
    //             setSelectedNames(optionsvalue)
    //         } else {
    //             setSelectedNames(options.filter(item => formikProp.values[name].includes(item.id)))
    //         }
    //     }
    // }, [optionsvalue])

    return (
        <>
            <FormControl
                fullWidth
                error={formikProp.touched[name] && formikProp.errors[name]}
                required={formikProp.errors[name]}
            >
                {/* <InputLabel id="demo-multiple-chip-label">{label}</InputLabel> */}
                <Autocomplete
                    multiple
                    freeSolo
                    id={name}
                    name={name}
                    options={optionsvalue}
                    onChange={(event, newval) => {
                        handleSelect(event, newval);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label={label}
                            placeholder={label}
                            error={formikProp.touched[name] && formikProp.errors[name]}
                            onKeyDown={(e) => {
                                if (e.keyCode === 13 && e.target.value) {
                                    handleSelect(e, formikProp.values[name]);
                                    // formikProp.setFieldValue(name,
                                    //     formikProp.values[name] ? [...formikProp.values[name],
                                    //     e.target.value] : formikProp.values[name]);
                                }
                            }}
                        />
                    )}
                    labelId={name}
                    label={label}
                    disabled={disable}
                    style={{ width: '100%' }}
                    onBlur={formikProp.handleBlur}
                    value={formikProp.values[name] || []}
                    autoComplete={formikProp.values[name] || []}
                    // error={formikProp.touched[name] && formikProp.errors[name]}
                    assign
                />
                <FormHelperText>
                    {formikProp.touched[name] && formikProp.errors[name]}
                </FormHelperText>
            </FormControl>
            {/* <FormControl
                fullWidth
            >
                <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={[formikProp.values[name]]}
                    onChange={handleSelect}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                >
                    {options &&
                        options.map((item) => (
                            <MenuItem
                                key={item.name}
                                value={item.value}
                            >
                                {item.name}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl> */}
        </>
    )
}

export const EcomToggleFld = (props) => {
    const {
        type, name, label, options, errors, disable, formikProp, ...rest
    } = props
    const handleToggle = (name, value) => {
        if (value === false) {
            formikProp.setFieldValue(name, true);
        }
        else {
            formikProp.setFieldValue(name, false);
        }
    }

    return (
        <>
            {/* <InputLabel id={name}>{label}</InputLabel>
            {options &&
                options.map((opt) => (
                    <FormControlLabel
                        key={opt.value}
                        disabled={disable}
                        checked={formikProp.values[name]}
                        onChange={(e) => handleToggle(name, formikProp.values[name])}
                        control={
                            <Switch
                                color="primary"
                            />
                        }
                        labelPlacement="end"
                    />
                ))}
            <div>{formikProp.touched[name] && formikProp.errors[name]}</div> */}

        </>
    )
}

export const NoField = (props) => {
}

export const EcomImgPickerFld = (props) => {
    const {
        type, name, label, options, errors, disable, multiple, formikProp, handleFileUpload, ...rest
    } = props
    const { values, setFieldValue, setFieldError, setFieldTouched } = formikProp;
    const [files, setfiles] = useState(formikProp.values[name] === undefined ? [] : formikProp.values[name] || [])
    const [Deletefiles, setDeletefiles] = useState([])

    console.log(formikProp.values);

    const removeitem = (event) => {
        let newinputfile = []
        let deletefile = []
        for (let i = 0; i < files.length; i++) {
            const element = files[i];
            console.log(element.path, event, 'filesfilesfilesfiles')
            if (element.path !== event) {
                newinputfile.push(element)
            } else {
                deletefile.push(element)
            }
        }

        console.log(newinputfile, 'filesfilesfilesfiles', files, event)
        setFieldValue(name, Array.from(newinputfile));
        let deletedfiles = Deletefiles.concat(deletefile)
        handleFileUpload(name, newinputfile, deletedfiles)
        setfiles(newinputfile)
        setDeletefiles(deletedfiles)
    }
    const handleChange = (event) => {
        let arr = []
        let selectedFiles
        for (let j = 0; j < event.length; j++) {
            let count = 0
            const element1 = event[j].path;
            for (let i = 0; i < files.length; i++) {
                const element = files[i].path;
                if (element === element1) {
                    count += 1
                }
            }
            if (count === 0) {
                arr.push(event[j])
            }
        }

        console.log(arr, "eeeeeeeeeeeeeeeeeeeee")
        if (arr.length > 0) {
            selectedFiles = files.concat(arr)
        } else {
            selectedFiles = event
        }
        // const uniqueNames = new Set(event.map(item => item.path));
        // const filteredArray1 = files.filter(item => !uniqueNames.has(item.path));
        // const selectedFiles = files.length>0 ? filteredArray1 : event;
        if (!selectedFiles || selectedFiles.length === 0) {
            setFieldValue(name, []);
            setFieldTouched(name, true);
            return;
        }

        // Check file types (allow only images)

        const invalidFiles = Array.from(selectedFiles).filter(
            (file) => !file.type.startsWith('image/')
        );


        // Check file size (limit to 5MB in this example)
        if (invalidFiles.length > 0) {
            setFieldValue(name, []);
            setFieldError(name, 'Please select only image files.');
            setFieldTouched(name, true);
            return;
        }

        // Check file sizes (limit to 5MB in this example)
        const maxSize = 5 * 1024 * 1024; // 5MB
        const oversizedFiles = Array.from(selectedFiles).filter(
            (file) => file.size > maxSize
        );

        if (oversizedFiles.length > 0) {
            setFieldValue(name, []);
            setFieldError(name, 'One or more files exceed the maximum size limit (5MB).');
            setFieldTouched(name, true);
            return;
        }

        // If files pass validation, set them in Formik
        setFieldValue(name, Array.from(selectedFiles));
        setFieldTouched(name, true);
        setfiles(selectedFiles)
        handleFileUpload(name, selectedFiles, [])
    };

    return (
        <>
            <FileUpload
                error={formikProp.touched[name] && formikProp.errors[name]}
                helperText={formikProp.touched[name] && formikProp.errors[name]}
                label={label}
                disabled={disable}
                name={name}
                onChange={(e) => handleChange(e)}
                multiple={multiple}
                required={formikProp.errors[name]}
            />
            <div style={{
                padding: 10,
                paddingTop: 25,
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 10,
                columnGap: 15
            }}>
                {formikProp.values[name] !== undefined && typeof formikProp.values[name] == "object" && formikProp.values[name].length > 0 && formikProp.values[name].map((item) => {
                    return (

                        <div
                            style={{
                                minWidth: 100,
                                // minHeight: 100,
                                position: 'relative',
                                backgroundColor: '#f0f0f0',
                                borderRadius: 12
                            }}>
                            <div style={{
                                overflow: 'hidden',
                                padding: 10,
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                            >
                                {item.path}
                            </div>
                            {/* <img
                                src={item.file_path ? Constants.BASE_URL_WOP + item.file_path.substring(13) : item.path}
                                alt='img_thumb'
                                width={100}
                                height={100}
                                style={{
                                    borderRadius: 10,
                                }}
                            /> */}
                            <div
                                className='close_btn'
                                onClick={() => { removeitem(item.path) }}>
                                <a href="#">
                                    <span class="left">
                                        <span class="circle-left"></span>
                                        <span class="circle-right"></span>
                                    </span>
                                    <span class="right">
                                        <span class="circle-left"></span>
                                        <span class="circle-right"></span>
                                    </span>
                                </a>
                            </div>
                        </div>

                    )
                })}
            </div>
        </>
    )
}

export const EcomColorPicker = (props) => {
    const {
        type, name, label, options, errors, disable, formikProp, ...rest
    } = props
    return (
        <>
            <TextField
                fullWidth
                error={formikProp.touched[name] && formikProp.errors[name]}
                helperText={formikProp.touched[name] && formikProp.errors[name]}
                label={label}
                name={name}
                disabled={disable}
                onBlur={formikProp.handleBlur}
                onChange={formikProp.handleChange}
                value={formikProp.values[name]}
                type='color'
                required={formikProp.errors[name]}
            />
            {/* <div
                className={"MuiInputBase-input MuiOutlinedInput-input css-n26ql7-MuiInputBase-input-MuiOutlinedInput-input"}>

                <ColorPicker
                    name={name}
                    defaultValue="black"
                    value={formikProp.values[name]}
                    onChange={(value) => formikProp.setFieldValue(name, "#" + value.hex)}
                />
            </div> */}
        </>
    )
}