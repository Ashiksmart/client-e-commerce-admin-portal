import React, { useEffect, useState, useMemo } from 'react';
import AppForm from '../../pages/AppForm';
import AppSnacks from '../../components/general/AppSnacks';
import ServiceProxy from '../../services/serviceProxy';
import jwt_decode from 'jwt-decode';
import {
    getPermissions,
    getToken, fetchProxy, updateProxy
} from '../../services/AppService';
import { useDispatch, useSelector } from 'react-redux'
import { setdata } from '../../redux/DynamicData/DataAction';
import AppDrawer from '../../sections/@dashboard/app/AppDrawer';
import { CustomFieldhandel } from '../../utils/CustomformStr';
import ErrorIcon from '@mui/icons-material/Error';
import { AppLoader } from '../general/AppLoader';
import Asynchronous from '../general/Search';
import Button from '@mui/material/Button';
import { Box, Stack } from '@mui/material';
export default function Leads(props) {
    let { value, process, default_id } = props
    const dispatch = useDispatch()
    let AppPerState = useSelector(state => state.permisson.permission)
    const [AppPermission, SetAppPermission] = useState({
        create: false,
        update: false,
        delete: false
    })
    let [fieldDyanamicBind, setfieldDyanamicBind] = useState({})
    let [initialvalue, setinitialvalue] = useState([])
    const [templateFlds, setTemplateFlds] = useState({});
    const [TemplateApiFlds, setTemplateApiFlds] = useState({})
    const [imageList, setImageList] = useState([]);
    const [associated, setassociated] = useState([
        {
            "model": "user",
            "bindAs": {
                "name": "user",
                "value": "first_name"
            },
            "key": {
                "foreign": "user.user",
                "primary": "id"
            },
            "fields": [
                "first_name"
            ]
        },
        {
            "model": "location_city",
            "bindAs": {
                "name": "city",
                "value": "city_name"
            },
            "key": {
                "foreign": "details.city",
                "primary": "city_code"
            },
            "fields": [
                "city_name"
            ]
        },
        {
            "model": "location_state",
            "bindAs": {
                "name": "state",
                "value": "state_name"
            },
            "key": {
                "foreign": "details.state",
                "primary": "state_code"
            },
            "fields": [
                "state_name"
            ]
        },
    ])
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

    const [drawerOpen, setDrawerOpen] = useState(false);
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
        let employee_ 
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
                 employee_ = JSON.parse(emp_group.records[0].employee_id)
                for (let i = 0; i < teamleader.team_leader.length; i++) {
                    if (getToken().id === teamleader.team_leader[i]) {
                        ispresent = true
                        
                    }
                }

            }
            
            if (!ispresent) {
                props.filter.user = { "$.user": getToken().id }
            }else{
                props.filter.user = { "$.teams": getToken().emp_group.records[0].teams }
            }
        }
        let fetch = await fetchProxy(props.filter, "crm_leads", [], associated)
        if (fetch.records.length > 0) {
            let arr = []
            for (let i = 0; i < fetch.records.length; i++) {
                const element = fetch.records[i];

                let userdata
                if (element.hasOwnProperty("user") && element.user !== null) {
                    userdata = JSON.parse(element.user)
                    console.log(userdata, "userdatauserdatauserdata")
                    if (userdata.hasOwnProperty("user")) {

                        userdata = userdata.user
                        console.log(userdata, "userdatauserdatauserdata")
                    } else {
                        userdata = []
                    }

                }
                let bind_arr = []
                const transformedObject = fetch.bind_to[i] && fetch.bind_to[i].reduce((result, obj) => {
                    for (const key in obj) {
                        result[key] = result[key]
                            ? `${result[key]},${obj[key]}`
                            : obj[key];
                    }
                    return result;
                }, {});
                bind_arr.push(transformedObject)

                arr.push({
                    phone_number: element.phone_number,
                    email: element.email,
                    user: userdata,
                    id: element.id,
                    bind_to: bind_arr,
                    ...JSON.parse(element.details)
                })
                console.log(arr, "userdatauserdatauserdata")
            }


            setinitialvalue(arr)
        }
    }

    const dynamicDropdownload = async (model, value) => {
        if (model == undefined) {

            let employee = await ServiceProxy.business.find('b2b', 'user', 'view', {
                roles: {
                    "$eq": "Employee"
                }, account_id: {
                    "$eq": getToken().account_id
                }, active: {
                    "$eq": "Y"
                }, partner_id: {
                    "$eq": getToken().partner_id
                }
            })
            let lead_status = await ServiceProxy.business.find('b2b', 'crm_status', 'view', {
                account_id: {
                    "$eq": getToken().account_id
                }, is_active: {
                    "$eq": "Y"
                }, module: {
                    "$in": ["lead_status", 'disposition']
                }, partner_id: {
                    "$eq": getToken().partner_id
                }
            })
            let state = await ServiceProxy.business.find('b2b', 'location_state', 'view', {
                account_id: { "$eq": getToken().account_id },
                is_active: {
                    "$eq": "Y"
                }
            })
            let status_lead = []
            let disposition = []
            for (let i = 0; i < lead_status.records.length; i++) {
                const element = lead_status.records[i];
                if (element.module === "lead_status") {
                    status_lead.push({
                        id: element.id, name: element.name, value: element.id
                    })
                } else {
                    disposition.push({
                        id: element.id, name: element.name, value: element.id
                    })
                }
            }

            setfieldDyanamicBind((set) => {
                if (disposition.length > 0) {
                    set.lead_disposition = disposition
                }
                if (status_lead.length > 0) {
                    set.lead_status = status_lead
                }

                return set;
            });



            if (employee.records.length > 0) {
                setfieldDyanamicBind((set) => {
                    set.user = employee.records.map((elm) => {
                        return { id: elm.id, name: elm.first_name, value: elm.id }
                    })

                    return set;
                });
            }





            if (state.records.length > 0) {
                setfieldDyanamicBind((set) => {
                    set.state = state.records.map((elm) => {
                        return { id: elm.state_code, name: elm.state_name, value: elm.state_code }
                    })
                    console.log(set.state, "set.stateset.stateset.stateset.state")
                    return set;
                });
            }




            fetchtemplate()

        }
        if (model == 'city' && value) {
            await ServiceProxy.business.find('b2b', 'location_city', 'view', {
                account_id: { "$eq": getToken().account_id },
                is_active: { $eq: "Y" }, state_code: { $eq: value }
            }, [], null, null).then((res) => {
                let values = []
                if (res.cursor.totalRecords > 0) {
                    values = res.records.map((elm) => {
                        return {
                            id: elm.city_code, name: elm.city_name, value: elm.city_code
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
                name: { "$in": ["CRM_LEADS_CU"] }
            }, [], 1, 3)

            if (template.cursor.totalRecords == 1) {
                template.records.forEach(async (elm) => {
                    let templatefields = await ServiceProxy.business.find('b2b', 'templates_field', 'view', {
                        template_id: { $eq: elm.id.toString() }, account_id: { "$eq": getToken().account_id }
                    }, [], 1, 100)

                    if (templatefields.cursor.totalRecords > 0) {
                        let templateData = templatefields.records
                        if (elm.name == 'CRM_LEADS_CU') {
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
        console.log("666666666666666666666666666666", data, typeMode)
        try {
            if (typeMode == mode.UPDATE) {
                let payload = {
                    id: data.id,
                    phone_number: data.phone_number,
                    email: data.email,
                    user: { user: data.user },
                    details: {}
                }
                let id = data.id
                delete data.id
                delete data.user
                delete data.phone_number
                delete data.email
                payload.details = data
                // data.avatar_url = uploadIds.length > 0 ? uploadIds[0].toString() : ""
                let Update = await updateProxy(payload, "crm_leads")
                if (Update.modifiedCount > 0) {
                    setDrawerOpen(false)
                    getApidata()

                }
            }

        } catch (err) {
            console.log(err)
        }
    }
    const handleFileUpload = async (name, e) => { }
    const edit = async (value) => {
        setTemplateFlds((set) => {
            set.action = mode.UPDATE
            set.initialValues = value
            return set
        })
        setDrawerOpen(true)
        console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
    }
    let lazyDataApi = async (childmodel, parentmodel, parentvalue) => {

        await dynamicDropdownload(childmodel, parentvalue)

    }
    return (
        <>
            <>

                {Object.keys(templateFlds).length === 0 && <AppLoader />}
            </>
            <>
                {Object.keys(templateFlds).length > 0 && initialvalue.length > 0 && <>
                    {initialvalue.map((value) => {
                        return (
                            <>
                                {templateFlds.fields.map((fields) => {
                                    return (
                                        <div>
                                            <Stack className='crm_view_head'>
                                                <h3>{fields.heading}</h3>
                                                {AppPermission.update && <Button variant="contained"
                                                    type="button" onClick={() => edit(value)}>
                                                    Edit
                                                </Button>}
                                            </Stack>

                                            {fields.fields.map((fields_) => {
                                                let obj = {}
                                                let mergedArray = {}
                                                for (let x = 0; x < value.bind_to.length; x++) {
                                                    const element = value.bind_to[x];
                                                    if (element[`${fields_.model}`]) {
                                                        obj[`${fields_.model}`] = element[`${fields_.model}`]
                                                    }
                                                }
                                                mergedArray = { ...value, ...obj }
                                                return (
                                                    <Stack className='crm_dtl_box'>
                                                        <div className='crm_dtl_lft'>
                                                            {fields_.label}:
                                                        </div>
                                                        <div className='crm_dtl_rgt'>
                                                            {mergedArray[`${fields_.model}`] === undefined ? "-" : mergedArray[`${fields_.model}`]}                                                        </div>
                                                    </Stack>
                                                )
                                            }
                                            )}
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
                    dispatch(setdata({ ['city']: [] }))
                    setDrawerOpen(false)
                }}
            />

        </>
    );
}
