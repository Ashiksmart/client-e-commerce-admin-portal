import React, { useEffect, useState, useMemo } from 'react';
import AppForm from '../../pages/AppForm';
import AppSnacks from '../general/AppSnacks';
import ServiceProxy from '../../services/serviceProxy';
import jwt_decode from 'jwt-decode';
import Button from '@mui/material/Button';
import { CustomFieldhandel } from '../../utils/CustomformStr';
import {
    getPermissions,
    getToken, fetchProxy, updateProxy, createProxy
} from '../../services/AppService';
import { useDispatch, useSelector } from 'react-redux'
import { setdata } from '../../redux/DynamicData/DataAction';
import AppDrawer from '../../sections/@dashboard/app/AppDrawer';
import Asynchronous from '../general/Search';
import { Stack } from '@mui/material';
import { AppLoader } from '../general/AppLoader';

export default function Accounts(props) {
    let { value, process } = props
    const dispatch = useDispatch()
    let AppPerState = useSelector(state => state.permisson.permission)
    const [AppPermission, SetAppPermission] = useState({
        create: false,
        update: false,
        delete: false
    })
    const [asyncFilter, setasyncFilter] = useState([
        { label: 'Email', value: "company_email" },
        { label: 'Phone Number', value: "company_phone_no" },
        { label: "Company Name", value: 'company_name' }
    ])
    const [drawerOpen, setDrawerOpen] = useState(false);
    let [fieldDyanamicBind, setfieldDyanamicBind] = useState({})
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
    const [associated, setassociated] = useState([

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

        let fetch = await fetchProxy(props.filter, props.model, [], associated)
        console.log(fetch, "uuuuuuuuuuuuuuuuuuuuuuuuuu", props.model)
        if (fetch.records.length > 0) {
            let arr = []

            for (let i = 0; i < fetch.records.length; i++) {
                const element = fetch.records[i];
                if (props.model === "crm_company") {
                    arr.push({
                        id: element.id,
                        bind_to: fetch.bind_to[i],
                        ...JSON.parse(element.details)
                    })
                } else {
                    if (element.company_id !== "0") {
                        let fetch_company = await fetchProxy({ id: { $eq: element.company_id }, is_active: { $eq: "Y" } }, "crm_company", [], associated)
                        for (let i = 0; i < fetch_company.records.length; i++) {
                            const element__ = fetch_company.records[i];
                            arr.push({
                                id: element__.id,
                                bind_to: fetch_company.bind_to[i],
                                ...JSON.parse(element__.details)
                            })
                        }
                    }
                }



            }



            setinitialvalue(arr)
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
                name: { "$in": ["CRM_ACCOUNT_CU"] }
            }, [], 1, 3)

            if (template.cursor.totalRecords == 1) {
                template.records.forEach(async (elm) => {
                    let templatefields = await ServiceProxy.business.find('b2b', 'templates_field', 'view', {
                        template_id: { $eq: elm.id.toString() }, account_id: { "$eq": getToken().account_id }
                    }, [], 1, 100)

                    if (templatefields.cursor.totalRecords > 0) {
                        let templateData = templatefields.records
                        if (elm.name == 'CRM_ACCOUNT_CU') {
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
            if (typeMode == mode.UPDATE) {
                let payload = {
                    id: data.id,
                    account_id: getToken().account_id,
                    partner_id: getToken().partner_id,
                    details: {}
                }

                delete data.id

                payload.details = data
                // data.avatar_url = uploadIds.length > 0 ? uploadIds[0].toString() : ""
                let Update = await updateProxy(payload, "crm_company")
                if (Update.modifiedCount > 0) {
                    setDrawerOpen(false)
                    getApidata()

                }
            } else {
                let payload = {
                    account_id: getToken().account_id,
                    partner_id: getToken().partner_id,
                    details: {}
                }



                console.log(props.default_module, "props.default_moduleprops.default_module")
                payload.details = data
                // data.avatar_url = uploadIds.length > 0 ? uploadIds[0].toString() : ""
                let Create = await createProxy(payload, "crm_company")
                if (Create.data.length > 0) {
                    if (props.default_module === "contacts") {

                        let Update = await updateProxy({ id: props.filter.id[`$eq`], company_id: Create.data[0] }, "crm_leads")
                        setDrawerOpen(false)
                        getApidata()
                    } else {
                        setDrawerOpen(false)
                        getApidata()
                    }



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

    const create = async (value) => {
        setTemplateFlds((set) => {
            set.action = mode.CREATE
            set.initialValues = value
            return set
        })
        setDrawerOpen(true)

    }
    const handleFileUpload = async (name, e) => { }
    const mergeAccount = async (id) => {
        let Update = await updateProxy({ id: props.filter.id[`$eq`], company_id: id }, "crm_leads")

        getApidata()


    }
    const demergeAccount = async () => {

        let Update = await updateProxy({ id: props.filter.id[`$eq`], company_id: "0" }, "crm_leads")
        getApidata()


    }
    let lazyDataApi = async (childmodel, parentmodel, parentvalue) => {

        await dynamicDropdownload(childmodel, parentvalue)

    }
    const UserSelectedData = async (value) => {
        mergeAccount(value.id)
    }
    const passApidata = async (value, type) => {

        let filter = { details: {}, account_id: { $eq: getToken().account_id }, partner_id: { $eq: getToken().partner_id }, is_active: { $eq: "Y" } }
        filter.details[`$.${type}`] = value
        console.log(filter, "typetypetype")
        let fetch = await fetchProxy(filter, "crm_company", [])
        if (fetch.records.length > 0) {
            let arr = []
            for (let i = 0; i < fetch.records.length; i++) {
                const element = fetch.records[i];
                let details = JSON.parse(element.details)
                let apiResponseobj = {
                    id: element.id,

                }
                apiResponseobj[`${type}`] = details[`${type}`]
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
                    {initialvalue.map((value) => {
                        return (
                            <> {templateFlds.fields.map((fields) => {
                                return (
                                    <div>
                                        <Stack className='crm_view_head'>
                                            <h3>{fields.heading}</h3>
                                            <Stack className='crm_view_hsec'>
                                                {AppPermission.update && <Button type="button" onClick={() => edit(value)}>
                                                    Edit
                                                </Button>}
                                                {/* {(props.default_module === "contacts" ||props.default_module === "leads" ) && <Button color="warning" className='crm_btn' type="button" onClick={() => demergeAccount(value)}>
                                                    Demerge
                                                </Button>} */}
                                            </Stack>
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
                    <> <h4>Search {props.tabdata.name} And Merge</h4>
                        <Asynchronous types={{ label: 'Email', value: "company_email" }} filterParam={asyncFilter} UserSelectedData={UserSelectedData} passApidata={passApidata}></Asynchronous>
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
