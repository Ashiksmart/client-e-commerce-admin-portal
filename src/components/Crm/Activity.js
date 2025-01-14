import React, { useEffect, useState, useMemo } from 'react';
import AppForm from '../../pages/AppForm';
import AppSnacks from '../general/AppSnacks';
import ServiceProxy from '../../services/serviceProxy';
import jwt_decode from 'jwt-decode';
import Button from '@mui/material/Button';
import { CustomFieldhandel } from '../../utils/CustomformStr';
import AppDialog from '../../components/general/AppDialog'
import {
    getPermissions,
    getToken, fetchProxy, updateProxy, createProxy
} from '../../services/AppService';
import { Box, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'
import { setdata } from '../../redux/DynamicData/DataAction';
import AppDrawer from '../../sections/@dashboard/app/AppDrawer';
import ErrorIcon from '@mui/icons-material/Error';
export default function Activity(props) {
    let { value, process } = props
    let AppPerState = useSelector(state => state.permisson.permission)
    const [AppPermission, SetAppPermission] = useState({
        create: false,
        update: false,
        delete: false
    })
    const [appDialog, setappDialog] = useState({
        header: "",
        content: "",
        action: ""
    })
    const [id, setid] = useState(0)
    const [openDialog, setOpenDialog] = useState(false);
    let [fieldDyanamicBind, setfieldDyanamicBind] = useState({})
    let [ActivityType, setActivityType] = useState([{ name: 'Note', value: "note", active: true }, { name: 'Call', value: "call", active: false }, { name: 'Meeting', value: "meeting", active: false }])
    const [templateFlds, setTemplateFlds] = useState({});
    const [TemplateApiFlds, setTemplateApiFlds] = useState({})
    const [imageList, setImageList] = useState([]);
    const [mode, setmode] = useState({
        CREATE: "create",
        UPDATE: "update",
        DELETE: "delete",
        PASSWORD: "password",
        FILTER: "filter",
        SEARCH: "search",
        RESET: "reset",
        APPROVAL: "approval"
    });
    const dispatch = useDispatch()
    const [drawerOpen, setDrawerOpen] = useState(false);
    let [initialvalue, setinitialvalue] = useState([])
    const [showNoteKeys, setShowNoteKeys] = useState(["note"])
    const [showCallKeys, setShowCallKeys] = useState(["callname", "calltype", "comments"])
    const [showMeetKeys, setShowMeetKeys] = useState(["name", "description", "meeting_time", "meeting_end_time"])
    useEffect(() => {
        dynamicDropdownload()
        getApidata()
        SetAppPermission({
            create: true,
            update: true,
            delete: true
        })
        // SetAppPermission((set) => {
        //     if (AppPerState.indexOf(`${process}_${value}:create`) != -1) {
        //         set.create = true;
        //     }
        //     if (AppPerState.indexOf(`${process}_${value}:update`) != -1) {
        //         set.update = true;
        //     }
        //     if (AppPerState.indexOf(`${process}_${value}:delete`) != -1) {
        //         set.delete = true;
        //     }
        //     return set;
        // });
    }, [])
    let getApidata = async () => {

        let fetch = await fetchProxy({ ...props.filter, is_active: { $eq: "Y" } }, "crm_activity", [])
        if (fetch.records.length > 0) {
            let arr = []
            for (let i = 0; i < fetch.records.length; i++) {
                const element = fetch.records[i];
                let details = JSON.parse(element.details)
                delete element.details
                arr.push({
                    ...details, ...element

                })
            }


            setinitialvalue(arr)
        } else {
            setinitialvalue([])
        }
    }
    let dynamicDropdownload = async () => {
        await ServiceProxy.partner.find(1, 100, "asc", { active: "Y" }).then((res) => {
            if (res.status == 200) {
                setfieldDyanamicBind((set) => {
                    set.partner_id = res.data.data.map((elm) => {
                        return { name: elm.name, value: elm.partner_id }
                    })
                    return set
                })
            }

        })

        await ServiceProxy.userGroup.find(1, 100, "asc", { active: 'Y', partner_id: getToken().partner_id }).then((res) => {
            if (res.status == 200) {
                console.log("sssssssssssssssssssssssssssss", res.status)
                setfieldDyanamicBind((set) => {
                    set.user_group = res.data.data.map((elm) => {
                        return { name: elm.name, value: elm.id }
                    })
                    return set
                })
            }
            // fetchtemplate()
        })

    }
    let fetchtemplate = async (filter, models, value__) => {
        console.log(value__, "value__value__value__")
        try {
            let template = await ServiceProxy.business.find('b2b', 'template', 'view', {
                name: { "$in": ["CRM_ACTIVITY_CU"] }
            }, [], 1, 3)

            if (template.cursor.totalRecords == 1) {
                template.records.forEach(async (elm) => {
                    let templatefields = await ServiceProxy.business.find('b2b', 'templates_field', 'view', {
                        ...filter
                        , template_id: { $eq: elm.id.toString() }, account_id: { "$eq": getToken().account_id }
                    }, [], 1, 100)

                    if (templatefields.cursor.totalRecords > 0) {
                        let templateData = templatefields.records
                        if (elm.name == 'CRM_ACTIVITY_CU') {
                            CustomFieldhandel(templateData, fieldDyanamicBind)
                                .then((res) => {

                                    setTemplateApiFlds({
                                        "template": elm,
                                        "fields": res.field
                                    })

                                    setTemplateFlds({

                                        ...{
                                            "template": elm,
                                            "fields": res.field
                                        },
                                        initialValues: value__,
                                        action: models,
                                        skipped: [],
                                        lazyDataApi: lazyDataApi
                                    })
                                    setDrawerOpen(true)


                                })
                        }
                    }
                })
            }

        } catch (error) {
            console.log(error)
        }
    }
    let action = async (data, typeMode) => {
        console.log(data, "value__value__value__")
        try {
            if (typeMode == mode.UPDATE) {
                let payload = {
                    id: data.id,
                    account_id: getToken().account_id,
                    partner_id: getToken().partner_id,
                    details: {},
                    type: templateFlds.initialValues.type
                }

                if (props.default_module === "contacts") {
                    payload["contact_id"] = props.filter.contact_id[`$eq`]
                }
                if (props.default_module === "account") {
                    payload["company_id"] = props.filter.company_id[`$eq`]
                }
                if (props.default_module === "leads") {
                    payload["lead_id"] = props.filter.lead_id[`$eq`]
                }
                if (props.default_module === "deals") {
                    payload["deal_id"] = props.filter.deal_id[`$eq`]
                }
                delete data.id
                payload.details = data
                // data.avatar_url = uploadIds.length > 0 ? uploadIds[0].toString() : ""
                let Update = await updateProxy(payload, "crm_activity")
                if (Update.modifiedCount > 0) {
                    setDrawerOpen(false)
                    getApidata()

                }
            }
            if (typeMode == mode.DELETE) {
                let Update = await updateProxy({ id: data, is_active: "N" }, "crm_activity")
                if (Update.modifiedCount > 0) {
                    setOpenDialog(false)
                    getApidata()

                }
            }
            if (typeMode == mode.CREATE) {
                let payload = {
                    account_id: getToken().account_id,
                    partner_id: getToken().partner_id,
                    details: {},
                    type: templateFlds.initialValues.type
                }

                if (props.default_module === "contacts") {
                    payload["contact_id"] = props.filter.contact_id[`$eq`]
                }
                if (props.default_module === "account") {
                    payload["company_id"] = props.filter.company_id[`$eq`]
                }
                if (props.default_module === "leads") {
                    payload["lead_id"] = props.filter.lead_id[`$eq`]
                }
                if (props.default_module === "deals") {
                    payload["deal_id"] = props.filter.deal_id[`$eq`]
                }

                payload.details = data
                // data.avatar_url = uploadIds.length > 0 ? uploadIds[0].toString() : ""
                let Create = await createProxy(payload, "crm_activity")
                if (Create.data.length > 0) {
                    setDrawerOpen(false)
                    getApidata()

                }
            }

        } catch (err) {
            console.log(err)
        }
    }
    const deleteSelectedData = async (modetype) => {
        if (modetype == mode.DELETE) {
            action(id, mode.DELETE)
        }
    }
    const delete_ = async (e) => {
        setappDialog({
            header: "Confirm",
            content: "Are you Sure want to Proceed ?",
            action: mode.DELETE
        })
        setid(e.id)
        setOpenDialog(true)

    }
    const handleFileUpload = async (name, e) => { }
    let lazyDataApi = async (childmodel, parentmodel, parentvalue) => {

        await dynamicDropdownload(childmodel, parentvalue)

    }
    let selectActioncreate = async (value) => {
        let arr = []
        console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", value)
        for (let i = 0; i < ActivityType.length; i++) {
            const element = ActivityType[i];
            if (value.value === element.value) {
                element.active = true
            } else {
                element.active = false
            }
            arr.push(element)
        }
        setActivityType(arr)
        if (value.value === "note") {
            console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
            fetchtemplate({ model: { $in: ["note"] } }, mode.CREATE, { type: value.value })
        } if (value.value === "call") {
            fetchtemplate({ model: { $in: ["callname", "calltype", "comments"] } }, mode.CREATE, { type: value.value })
        } if (value.value === "meeting") {
            fetchtemplate({ model: { $in: ["name", "meeting_time", "description", "meeting_end_time"] } }, mode.CREATE, { type: value.value })
        }
    }
    const edit = async (value, intvalue) => {
        if (value.value === "note") {
            fetchtemplate({ model: { $in: ["note"] } }, mode.UPDATE, intvalue)
        } if (value.value === "call") {
            fetchtemplate({ model: { $in: ["callname", "calltype", "comments"] } }, mode.UPDATE, intvalue)
        } if (value.value === "meeting") {
            fetchtemplate({ model: { $in: ["name", "meeting_time", "description", "meeting_end_time"] } }, mode.UPDATE, intvalue)
        }
    }
    const formatKey = (key) => {
        const words = key.split('_');

        const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

        return capitalizedWords.join(' ');
    };
    return (
        <div>
            {ActivityType.map((value) => (
                <div key={value.value}>
                    <Stack className='crm_view_head'>
                        <h4>{value.name}</h4>
                        {AppPermission.create && (
                            <Button variant="contained" type="button" onClick={() => selectActioncreate(value)}>
                                Create {value.name}
                            </Button>
                        )}
                    </Stack>
                    {initialvalue.length > 0 && (
                        <div>
                            {initialvalue.map((initvalue) => (
                                <>
                                    {initvalue.type === value.value ?
                                        <Box className='crm_view_box'>
                                            {(AppPermission.update || AppPermission.delete) ?
                                                <Stack key={initvalue.id} className='crm_btn_row'>
                                                    {initvalue.type === value.value && (
                                                        <Stack className='crm_view_hsec'>
                                                            {AppPermission.update && (
                                                                <Button type="button" onClick={() => edit(value, initvalue)}>
                                                                    Edit
                                                                </Button>
                                                            )}
                                                            {AppPermission.delete && (
                                                                <Button color='error' className='crm_btn' type="button" onClick={() => delete_(initvalue)}>
                                                                    Delete
                                                                </Button>
                                                            )}
                                                        </Stack>
                                                    )}
                                                </Stack>
                                                : null}
                                            {initvalue && Object.keys(initvalue)
                                                .filter(key => (initvalue.type == "note" ? showNoteKeys
                                                    : initvalue.type == "call" ? showCallKeys
                                                        : showMeetKeys)
                                                    .includes(key))
                                                .map((key) => (
                                                    <Stack key={key} className='crm_dtl_box'>
                                                        <div className='crm_dtl_lft' style={{
                                                            color: "#707070"
                                                        }}>
                                                            {formatKey(key)}:
                                                        </div>
                                                        <div className='crm_dtl_rgt'>
                                                            {(initvalue[key])}
                                                        </div>
                                                    </Stack>
                                                ))
                                            }
                                        </Box>
                                        : null}

                                </>
                            ))}
                        </div>
                    )}

                    {initialvalue.length === 0 && (
                        <Box className="no_records">
                            <div>
                                <ErrorIcon sx={{ fontSize: "35px" }} />
                            </div>
                            <div>No {value.name} Found</div>
                        </Box>
                    )}

                    {initialvalue.length > 0 && !initialvalue.some(item => item.type === value.value) && (
                        <Box className="no_records">
                            <div>
                                <ErrorIcon sx={{ fontSize: "35px" }} />
                            </div>
                            <div>No {value.name} Found</div>
                        </Box>
                    )}
                </div>
            ))}
            <AppDrawer
                children={
                    <AppForm
                        formSchema={templateFlds}
                        action={action}
                        mode={mode}
                        allObj={false}
                        handleFileUpload={handleFileUpload}
                        imageList={imageList}
                    />
                }
                drawerOpen={drawerOpen}
                setDrawerOpen={() => {
                    dispatch(setdata({ ['deal_status']: [] }));
                    setDrawerOpen(false);
                }}
            />

            <AppDialog
                dialogTitle={appDialog.header}
                dialogContent={appDialog.content}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                handleDelete={() => deleteSelectedData(appDialog.action)}
            />
        </div>
    );

}
