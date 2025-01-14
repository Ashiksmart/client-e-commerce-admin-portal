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
import { useDispatch, useSelector } from 'react-redux'
import { setdata } from '../../redux/DynamicData/DataAction';
import AppDrawer from '../../sections/@dashboard/app/AppDrawer';
import { Box, Stack } from '@mui/material';
import { AppLoader } from '../general/AppLoader';
import ErrorIcon from '@mui/icons-material/Error';
export default function Deals(props) {
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
    const [templateFlds, setTemplateFlds] = useState({});
    const [TemplateApiFlds, setTemplateApiFlds] = useState({})
    const [imageList, setImageList] = useState([]);
    const dispatch = useDispatch()
    const [drawerOpen, setDrawerOpen] = useState(false);
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
    const [associated, setassociated] = useState([

        {
            "model": "workflow_status",
            "bindAs": {
                "name": "pipeline",
                "value": "display_name"
            },
            "key": {
                "foreign": "details.pipeline",
                "primary": "app_id",
                "rules": {
                    "priority": "1",
                    "page_type": "pipeline"
                }
            },
            "fields": [
                "display_name"
            ]
        },
        {
            "model": "workflow_status",
            "bindAs": {
                "name": "deal_status",
                "value": "display_name"
            },
            "key": {
                "foreign": "details.deal_status",
                "primary": "status_name",
                "rules": {

                    "page_type": "pipeline"
                }
            },
            "fields": [
                "display_name"
            ]
        },
    ])
    let [initialvalue, setinitialvalue] = useState([])
    useEffect(() => {
        dynamicDropdownload()
        getApidata()
        SetAppPermission({
            create: false,
            update: false,
            delete: false
        })
        SetAppPermission((set) => {
            if (AppPerState.indexOf(`${process}_${value}:create`) != -1) {
                set.create = true;
            }
            if (AppPerState.indexOf(`${process}_${value}:update`) != -1) {
                set.update = true;
            }
            if (AppPerState.indexOf(`${process}_${value}:delete`) != -1) {
                set.delete = true;
            }
            return set;
        });
    }, [])
    let getApidata = async () => {
        let role = getToken().roles
        let ispresent = false
        if (role === "Employee") {
            let emp_group = await ServiceProxy.business.find(
                'b2b',
                "employee_master",
                'view',
                { employee_id: { "$.employee_id": getToken().id } },

                [],
                null, null
            )

            if (emp_group.records.length > 0) {
                let teamleader = JSON.parse(emp_group.records[0].team_leader)
                let employee_ = JSON.parse(emp_group.records[0].employee_id)
                for (let i = 0; i < teamleader.team_leader.length; i++) {
                    if (getToken().id === teamleader.team_leader[i]) {
                        ispresent = true
                        props.filter["user"] = {
                            $in: employee_.employee_id
                        }
                    }
                }

            }
            if (!ispresent) {
                props.filter["user"] = {
                    $eq: getToken().id
                }
            }


        }

        let fetch = await fetchProxy({ ...props.filter, is_active: { $eq: "Y" } }, "crm_deals", [], associated)
        console.log(fetch.records.length, "fetch.bind_to[i]fetch.bind_to[i]")
        if (fetch.records.length > 0) {
            let arr = []
            for (let i = 0; i < fetch.records.length; i++) {

                const element = fetch.records[i];
                console.log(element, "fetch.bind_to[i]fetch.bind_to[i]", fetch.bind_to[i])
                arr.push({
                    id: element.id,
                    bind_to: fetch.bind_to[i],
                    ...JSON.parse(element.details)
                })
            }


            setinitialvalue(arr)
            setDrawerOpen(false)
        } else {
            setinitialvalue([])
            setDrawerOpen(false)
        }
    }
    const dynamicDropdownload = async (model, value) => {
        console.log(value, "yyyyyyyyyyyyyyyyyyyyyyy")
        if (model == undefined) {


            let workflow = await ServiceProxy.business.find('b2b', 'workflow_status', 'view', {
                account_id: { $eq: getToken().account_id }, priority: { $eq: 1 }, page_type: { $eq: "pipeline" }
            })


            if (workflow.records.length > 0) {
                setfieldDyanamicBind((set) => {
                    set.pipeline = workflow.records.map((elm) => {
                        return { id: elm.app_id, name: elm.display_name, value: elm.app_id }
                    })
                    return set;
                });
            }




            fetchtemplate()

        }
        if (model == 'deal_status' && value) {

            await ServiceProxy.business.find('b2b', 'workflow_status', 'view', {
                account_id: { $eq: getToken().account_id }, page_type: { $eq: "pipeline" }, app_id: { $eq: value }
            }, [], null, null).then((res) => {
                let values = []
                if (res.cursor.totalRecords > 0) {
                    values = res.records.map((elm) => {
                        return {
                            id: elm.status_name, name: elm.display_name, value: elm.status_name
                        }
                    })

                }
                dispatch(setdata({ [model]: values }))
            })
        }



    }
    let fetchtemplate = async () => {
        try {
            let template = await ServiceProxy.business.find('b2b', 'template', 'view', {
                name: { "$in": ["CRM_DEALS_CU"] }
            }, [], 1, 3)

            if (template.cursor.totalRecords == 1) {
                template.records.forEach(async (elm) => {
                    let templatefields = await ServiceProxy.business.find('b2b', 'templates_field', 'view', {
                        template_id: { $eq: elm.id.toString() }, account_id: { "$eq": getToken().account_id }
                    }, [], 1, 100)

                    if (templatefields.cursor.totalRecords > 0) {
                        let templateData = templatefields.records
                        if (elm.name == 'CRM_DEALS_CU') {
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
                                        initialValues: {},
                                        action: mode.CREATE,
                                        skipped: [],
                                        lazyDataApi: lazyDataApi
                                    })



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
        try {
            if (typeMode == mode.DELETE) {
                let payload = {
                    id: data,
                    account_id: getToken().account_id,
                    partner_id: getToken().partner_id,
                    is_active: "N"
                }


                // data.avatar_url = uploadIds.length > 0 ? uploadIds[0].toString() : ""
                let Update = await updateProxy(payload, "crm_deals")
                if (Update.modifiedCount > 0) {
                    setOpenDialog(false)
                    getApidata()

                }
            }
            else if (typeMode == mode.UPDATE) {
                let payload = {
                    id: data.id,
                    account_id: getToken().account_id,
                    user: getToken().id.toString(),
                    partner_id: getToken().partner_id,
                    details: {}
                }

                delete data.id

                payload.details = data
                // data.avatar_url = uploadIds.length > 0 ? uploadIds[0].toString() : ""
                let Update = await updateProxy(payload, "crm_deals")
                if (Update.modifiedCount > 0) {

                    getApidata()


                }
            } else {
                let payload = {
                    account_id: getToken().account_id,
                    partner_id: getToken().partner_id,
                    user: getToken().id.toString(),
                    details: {}
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
                console.log(props.default_module, "props.default_moduleprops.default_module")
                payload.details = data
                // data.avatar_url = uploadIds.length > 0 ? uploadIds[0].toString() : ""
                let Create = await createProxy(payload, "crm_deals")
                if (Create.data.length > 0) {
                    getApidata()

                }
            }

        } catch (err) {
            console.log(err)
        }
    }
    const edit = async (value) => {
        setTemplateFlds((set) => {
            set.action = mode.UPDATE
            set.initialValues = value
            return set
        })
        setDrawerOpen(true)

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
    const create = async (value) => {
        setTemplateFlds((set) => {
            set.action = mode.CREATE
            set.initialValues = value
            return set
        })
        setDrawerOpen(true)

    }
    const handleFileUpload = async (name, e) => { }
    let lazyDataApi = async (childmodel, parentmodel, parentvalue) => {

        await dynamicDropdownload(childmodel, parentvalue)

    }
    const deleteSelectedData = async (modetype) => {
        if (modetype == mode.DELETE) {
            action(id, mode.DELETE)
        }
    }
    return (
        <>
            <>
                {Object.keys(templateFlds).length === 0 && <AppLoader />}
            </>
            <>
                <Box
                    sx={{
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end"
                    }}>
                    <Stack className='crm_view_hsec'>
                        {AppPermission.create && props.default_module !== "deals" && <Button type="button" variant='contained' onClick={() => create({})}>
                            Create Deals
                        </Button>}
                    </Stack>
                </Box>
                {Object.keys(templateFlds).length > 0 && initialvalue.length > 0 && <>
                    {initialvalue.map((value) => {
                        return (
                            <>
                                {templateFlds.fields.map((fields) => {
                                    return (
                                        <div>
                                            <Stack className='crm_view_head'>
                                                <h3>{fields.heading}</h3>
                                            </Stack>
                                            <Box className='crm_view_box'>
                                                <Stack className='crm_btn_row'>
                                                    {AppPermission.update && <Button type="button" onClick={() => edit(value)}>
                                                        Edit
                                                    </Button>}
                                                    {AppPermission.delete && props.default_module !== "deals" && <Button color='error' className='crm_btn' type="button" onClick={() => delete_(value)}>
                                                        Delete
                                                    </Button>}
                                                </Stack>
                                                {fields.fields.map((fields_) => {
                                                    let obj = {}
                                                    let mergedArray = {}
                                                    console.log(value.bind_to, "value.bind_tovalue.bind_to")
                                                    for (let x = 0; x < value.bind_to.length; x++) {
                                                        const element = value.bind_to[x];
                                                        if (element[`${fields_.model}`]) {
                                                            obj[`${fields_.model}`] = element[`${fields_.model}`]
                                                        }
                                                    }
                                                    mergedArray = { ...value, ...obj }

                                                    return (
                                                        <>

                                                            <Stack className='crm_dtl_box'>
                                                                <div className='crm_dtl_lft'>
                                                                    {fields_.label}:
                                                                </div>
                                                                <div className='crm_dtl_rgt'>
                                                                    {mergedArray[`${fields_.model}`] === undefined ? "-" : mergedArray[`${fields_.model}`]}
                                                                </div>
                                                            </Stack>
                                                        </>
                                                    )
                                                }
                                                )}
                                            </Box>

                                        </div>
                                    )
                                }
                                )}

                            </>

                        )
                    })}
                </>}
                {Object.keys(templateFlds).length > 0 && initialvalue.length === 0 &&
                    <Box className="no_records">
                        <div>
                            <ErrorIcon sx={{ fontSize: "35px" }} />
                        </div>
                        <div>
                            No {props.tabdata.name} Found
                        </div>
                    </Box>
                }

            </>
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
                    dispatch(setdata({ ['deal_status']: [] }))
                    setDrawerOpen(false)
                }}
            />
            <AppDialog
                dialogTitle={appDialog.header}
                dialogContent={appDialog.content}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                handleDelete={() => deleteSelectedData(appDialog.action)}
            />

        </>
    );
}
