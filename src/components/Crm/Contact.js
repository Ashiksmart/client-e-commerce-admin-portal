import React, { useEffect, useState, useMemo } from 'react';
import AppForm from '../../pages/AppForm';
import AppSnacks from '../general/AppSnacks';
import ServiceProxy from '../../services/serviceProxy';
import jwt_decode from 'jwt-decode';
import Button from '@mui/material/Button';
import Asynchronous from '../general/Search';
import { CustomFieldhandel } from '../../utils/CustomformStr';
import ErrorIcon from '@mui/icons-material/Error';
import {
    getPermissions,
    getToken, fetchProxy, updateProxy, createProxy
} from '../../services/AppService';
import { useDispatch, useSelector } from 'react-redux'
import { setdata } from '../../redux/DynamicData/DataAction';
import AppDrawer from '../../sections/@dashboard/app/AppDrawer';
import { idID } from '@mui/material/locale';
import { Stack,Box } from '@mui/material';
import { AppLoader } from '../general/AppLoader';
export default function Contacts(props) {
    let { value, process } = props
    let AppPerState = useSelector(state => state.permisson.permission)
    const [snackProps, setSnackProps] = useState({
        snackOpen: false,
        setSnackOpen: () => { },
        severity: "",
        message: "",
    });
    const [AppPermission, SetAppPermission] = useState({
        create: false,
        update: false,
        delete: false
    })
    let [fieldDyanamicBind, setfieldDyanamicBind] = useState({})
    const dispatch = useDispatch()
    let [initialvalue, setinitialvalue] = useState([])
    const [templateFlds, setTemplateFlds] = useState({});
    const [asyncFilter, setasyncFilter] = useState([
        { label: 'Email', value: "email" },
        { label: 'Phone Number', value: "phone_number" },
    ])
    const [TemplateApiFlds, setTemplateApiFlds] = useState({})
    const [imageList, setImageList] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [mode, setmode] = useState({
        CREATE: "create",
        UPDATE: "update",
        DELETE: "delete",
        PASSWORD: "password",
        FILTER: "filter",
        SEARCH: "search",
        RESET: "reset",
        APPROVAL: "approval",
        MERGE: "merge",
        DEMERGE: "demerge"
    });
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
                "foreign": "contact_details.city",
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
                "foreign": "contact_details.state",
                "primary": "state_code"
            },
            "fields": [
                "state_name"
            ]
        },
    ])
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
        console.log(props.filter);
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
                arr.push({
                    phone_number: element.phone_number,
                    email: element.email,
                    user: element.user,
                    id: element.id,
                    bind_to: fetch.bind_to[i],
                    ...JSON.parse(element.contact_details)
                })
            }
            console.log(arr, "arrarrarrarrarrarrarrarrarr")

            setinitialvalue(arr)
        } else {
            if (props.filter.id) {
                setinitialvalue([{ id: props.filter.id[`$eq`] }])
            } else {
                setinitialvalue([])
            }

        }
    }
    const dynamicDropdownload = async (model, value) => {
        if (model == undefined) {


            let state = await ServiceProxy.business.find('b2b', 'location_state', 'view', {
                account_id: { "$eq": getToken().account_id },
                is_active: {
                    "$eq": "Y"
                }
            })


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
                name: { "$in": ["CRM_CONTACT_CU"] }
            }, [], 1, 3)

            if (template.cursor.totalRecords == 1) {
                template.records.forEach(async (elm) => {
                    let templatefields = await ServiceProxy.business.find('b2b', 'templates_field', 'view', {
                        template_id: { $eq: elm.id.toString() }, account_id: { "$eq": getToken().account_id }
                    }, [], 1, 100)

                    if (templatefields.cursor.totalRecords > 0) {
                        let templateData = templatefields.records
                        if (elm.name == 'CRM_CONTACT_CU') {
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
        try {
            if (typeMode == mode.MERGE) {
                let payload = {
                    id: data,
                    company_id: props.filter.company_id[`$eq`]
                }

                // data.avatar_url = uploadIds.length > 0 ? uploadIds[0].toString() : ""
                let Update = await updateProxy(payload, "crm_leads")
                if (Update.modifiedCount > 0) {

                    getApidata()

                }
            }
            else if (typeMode == mode.DEMERGE) {
                let payload = {
                    id: data,
                    is_contact: "N"
                }

                // data.avatar_url = uploadIds.length > 0 ? uploadIds[0].toString() : ""
                let Update = await updateProxy(payload, "crm_leads")
                if (Update.modifiedCount > 0) {

                    getApidata()

                }
            }
            else if (typeMode == mode.CREATE) {
                console.log(data,"datadatadatadatadatadatadata",props.selected_data)
                let payload = {
                    account_id: getToken().account_id,
                    partner_id: getToken().partner_id,
                    is_contact: "Y",
                    is_lead:'N',
                    email: data.email,
                    phone_number: data.phone_number,
                    contact_details: {},
                    company_id: props.selected_data.company_id
                }
                if ((data.phone_number === "" || data.phone_number == null) &&
                    (data.email === "" || data.email == null)) {
                    console.log("please enter email or phone number")
                }
                else {


                    payload.contact_details = data
                    
                    if(props.default_module!=="account"){
                        payload.associate_to_lead=props.selected_data.id
                    }else{
                        payload.company_id=props.selected_data.id
                    }
                    // delete data.email
                    // delete data.phone_number
                    let Create = await createProxy(payload, "crm_leads")
                    if (Create.data.length > 0) {
                        setDrawerOpen(false)
                        getApidata()

                    }
                }

            }
            else if (typeMode == mode.UPDATE && initialvalue.length > 0) {
                let payload = {
                    id: data.id,
                    is_contact: "Y",
                    contact_details: {}
                }

                delete data.id

                payload.contact_details = data
                // data.avatar_url = uploadIds.length > 0 ? uploadIds[0].toString() : ""
                let Update = await updateProxy(payload, "crm_leads")
                if (Update.modifiedCount > 0) {
                    setDrawerOpen(false)
                    getApidata()

                }
            } else {
                let payload = {
                    account_id: getToken().account_id,
                    partner_id: getToken().partner_id,
                    is_contact: "Y",
                    contact_details: {}
                }



                payload.contact_details = data
                // data.avatar_url = uploadIds.length > 0 ? uploadIds[0].toString() : ""
                let Create = await createProxy(payload, "crm_leads")
                if (Create.data.length > 0) {
                    setDrawerOpen(false)
                    getApidata()

                }
            }

        } catch (err) {
            console.log(err)
        }
    }
    const handleFileUpload = async (name, e) => { }
    let lazyDataApi = async (childmodel, parentmodel, parentvalue) => {

        await dynamicDropdownload(childmodel, parentvalue)

    }

    const edit = async (value) => {
        setTemplateFlds((set) => {
            set.action = mode.UPDATE
            set.initialValues = value
            return set
        })
        setDrawerOpen(true)

    }
    const create = async () => {

        let fields = []
        for (let i = 0; i < templateFlds.fields.length; i++) {
            const templateFldsheader = templateFlds.fields[i];
            for (let j = 0; j < templateFldsheader.fields.length; j++) {
                const fld = templateFldsheader.fields[j];
                if (fld.model === "email" || fld.model === "phone_number") {
                    fld.disabled = false
                }

            }
            fields.push(templateFldsheader)
        }
        setTemplateFlds((set) => {
            set.action = mode.CREATE
            set.initialValues = {}
            set.fields = fields
            return set
        })
        setDrawerOpen(true)

    }
    const merge = async (id) => {
        action(id, mode.MERGE)
    }
    const demerge = async (id) => {
        action(id, mode.DEMERGE)
    }
    const UserSelectedData = async (value) => {
        merge(value.id)
    }
    const passApidata = async (value, type) => {
        console.log(props, "eeeeeeeeeeeeeeeeeeeeeeeeee")
        
        let filter = { account_id: { $eq: getToken().account_id }, partner_id: { $eq: getToken().partner_id }, is_contact: { $eq: "Y" } }
        if(props.default_module!=="account"){
            filter.associate_to_lead={ $eq: null }
        }
        filter[`${type}`] = value
        let fetch = await fetchProxy(filter, "crm_leads", [])
        if (fetch.records.length > 0) {
            let arr = []
            for (let i = 0; i < fetch.records.length; i++) {
                const element = fetch.records[i];
                let apiResponseobj = {
                    id: element.id,

                }
                apiResponseobj[`${type}`] = element[`${type}`]
                arr.push(apiResponseobj)
            }

            return arr
        } else {
            return []
        }
    }
    return (
        <>
            <>
                {Object.keys(templateFlds).length === 0 && <AppLoader />}
            </>
            <>

                {Object.keys(templateFlds).length > 0 && initialvalue.length > 0 && <>
                    {(props.default_module !== "contacts" &&props.default_module !== "account" ) &&<Button className="crm_act_btn" type="button" onClick={() => create({})}>
                            Create {props.tabdata.name} And Merge 
                        </Button>}

                    {initialvalue.map((value, index) => {

                        return (
                            <>

                                {templateFlds.fields.map((fields) => {
                                    return (
                                        <div>
                                            <Stack className='crm_view_head'>
                                                <h3>{fields.heading}</h3>
                                                <Stack className='crm_view_hsec'>
                                                    {AppPermission.update && <Button variant='contained' type="button" onClick={() => edit(value)}>
                                                        Edit
                                                    </Button>}
                                                    {/* {props.default_module === "leads" && <Button type="button" onClick={() => demerge(value.id)}>
                                                        DeMerge
                                                    </Button>} */}
                                                </Stack>
                                            </Stack>
                                            {fields.fields.map((fields_) => {
                                                let obj = {}
                                                let mergedArray = {}
                                                if (value.bind_to) {
                                                    for (let x = 0; x < value.bind_to.length; x++) {
                                                        const element = value.bind_to[x];
                                                        if (element[`${fields_.model}`]) {
                                                            obj[`${fields_.model}`] = element[`${fields_.model}`]
                                                        }
                                                    }
                                                    mergedArray = { ...value, ...obj }
                                                }

                                                console.log(mergedArray, "yyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
                                                return (
                                                    <Stack className='crm_dtl_box'>
                                                        <div className='crm_dtl_lft'>
                                                            {fields_.label}:
                                                        </div>
                                                        <div className='crm_dtl_rgt'>
                                                            {mergedArray[`${fields_.model}`] === undefined ? "-" : mergedArray[`${fields_.model}`]}
                                                        </div>
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

                {/* {props.default_module === "leads" && Object.keys(templateFlds).length > 0 && initialvalue.length === 0 && <Button type="button" onClick={() => edit({})}>
                    Convert To contact
                </Button>} */}

                {(props.default_module === "leads" ) && Object.keys(templateFlds).length > 0 && initialvalue.length === 0 && <>
                    <h4>Search {props.tabdata.name} And Merge</h4>
                    <Asynchronous filterParam={asyncFilter} types={{ label: 'Email', value: "email" }} UserSelectedData={UserSelectedData} passApidata={passApidata}>
                    </Asynchronous>
                    <Stack className='crm_sep'></Stack>
                    <Stack sx={{
                        marginTop: 3,
                        textAlign: "center"
                    }}>
                        <Button className="crm_act_btn" type="button" onClick={() => create({})}>
                            Create {props.tabdata.name} And Merge
                        </Button>
                    </Stack>
                </>
                }
                {props.default_module !== "leads" && Object.keys(templateFlds).length > 0 && initialvalue.length === 0 &&
                    <Box className="no_records">
                        <div>
                            <ErrorIcon sx={{ fontSize: "35px" }} />
                        </div>
                        <div>
                            No {props.tabdata.name} Found
                        </div>
                    </Box>
                }
                {/* {props.default_module !== "leads"&&Object.keys(templateFlds).length > 0 && initialvalue.length === 0 && <Button type="button" >
                    No  Contact link with Account
                </Button>} */}

            </>
            <AppSnacks
                snackProps={snackProps}
                setSnackProps={setSnackProps}
            />
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
