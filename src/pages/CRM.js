/* eslint-disable react-hooks/exhaustive-deps */
import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useSelection, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// @mui
import { Container, Stack, Typography, Button, Box } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
import SimpleImageSlider from "react-simple-image-slider";
// mock
import PRODUCTS from '../_mock/products';
import { AppTable } from '../components/general/AppDataGrid'
import AppDialog from '../components/general/AppDialog'
import Iconify from '../components/iconify';
import ServiceProxy from '../services/serviceProxy'
import { useHistory, useNavigate } from 'react-router-dom'
import AppForm from './AppForm';
import AppDrawer from '../sections/@dashboard/app/AppDrawer';
import { UserListToolbar } from '../sections/@dashboard/user';
import Modal from '@mui/material/Modal';
import {
    getToken,
    deleteProduct, Softdelete,
    getPermissions,
    fetchProxy, updateProxy
} from '../services/AppService'
import { CustomFieldhandel } from '../../src/utils/CustomformStr'
import AppSnacks from '../components/general/AppSnacks';
import { SnackMess } from '../constants/SnackMessages';
import dayjs from 'dayjs';
import Constants from '../constants/index'
import { rest } from 'lodash';
import { getTitle } from '../utils/getTitle';
import { useLocation } from 'react-router-dom';
import { generateFilter } from '../utils/customFilter';
import AppDynamicSubForm from '../components/form-builder/AppDynamicSubForm';
import AppSubForm from './AppSubForm';
import { setdata } from '../redux/DynamicData/DataAction';
import CrmFullScreenDialog from '../components/Crm/crm-dialog'

export default function CRM(props) {
    const {
        label,
        screen,
        Mrkapp_id,
        module,
        value,
        process, children
    } = props
    let AppPerState = useSelector(state => state.permisson.permission)
    const currentPath = useLocation();
    let router = useNavigate();
    const [bind_to, setbind_to] = useState([])
    const [items, setitems] = useState([]);
    const [openCrm, setopenCrm] = useState(false)
    const [bind_topayload, setbind_topayload] = useState([])
    const [tempItems, setTempItems] = useState();
    const [snackOpen, setSnackOpen] = useState(false);
    const [imageList, setImageList] = useState([]);

    const [permit, setPermit] = useState(getPermissions())
    const [imagePrev, setImagePrev] = useState([])
    const [permitEl, setPermitEl] = useState(false)
    const [viewCRMData, setViewCRMData] = useState({})
    const [snackProps, setSnackProps] = useState({
        snackOpen: false,
        setSnackOpen: () => { },
        severity: "",
        message: "",
    });
    const [templateFlds, setTemplateFlds] = useState({});
    const [templateApiFlds, setTemplateApiFlds] = useState({});

    const [templateSubApiFlds, setTemplateSubApiFlds] = useState({});
    const [allAttr, setAllAttr] = useState([]);

    const [templatefilter, settemplatefilter] = useState({})
    const [templatecustomfilter, settemplatecustomfilter] = useState({})
    const [categories, setCategories] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [attrDrawerOpen, setAttrDrawerOpen] = useState(false);
    const [imgPrevModal, setImgPrevModal] = useState(false);

    const [selectedData, setSelectedData] = useState({})
    const [openDialog, setOpenDialog] = useState(false);
    const [colHeaders, setColHeaders] = useState();
    const [tableShow, setTableShow] = useState();
    const [storefile, setstorefile] = useState([]);
    const [Removestorefile, setRemovestorefile] = useState([]);

    let [pageinfo, setpageinfo] = useState({ title: label })

    let [page, setPage] = useState(1);
    let [sort, setsort] = useState([{
        column: "id",
        order: 'asc'
    }]);

    let [filter, setfilter] = useState({})
    let [showImagePrev, setShowImagePrev] = useState(false)
    let [filterVal, setfilterVal] = useState({})
    let [isFilter, setIsFilter] = useState(false)
    let [active, setactive] = useState('Y')
    let [search, setsearch] = useState('');
    let [count, setcount] = useState(0);
    let [rowsPerPage, setRowsPerPage] = useState(5);
    const [limit, setLimit] = useState(5);
    const [users, setUsers] = useState();
    const [productLimit, SetproductLimit] = useState(0);
    const [Accountinfo, SetAccountinfo] = useState({})
    const [uploadIds, setUploadIds] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [allCategory, setAllCategory] = useState([]);
    const [allCities, setAllCities] = useState([]);
    let [fieldDyanamicBind, setfieldDyanamicBind] = useState({})
    let [fieldCustomDyanamicBind, setfieldCustomDyanamicBind] = useState({})
    let [fieldSubDyanamicBind, setSubfieldDyanamicBind] = useState({})
    let [subEditData, setSubEditData] = useState([])
    let [app_id, setapp_id] = useState()
    let [ispro_limit, setispro_limit] = useState(false)

    const [mode, setmode] = useState({
        CREATE: "create",
        UPDATE: "update",
        DELETE: "delete",
        PASSWORD: "password",
        FILTER: "filter",
        SEARCH: "search",
        RESET: "reset"
    });

    const [id, setid] = useState(0)
    const [Single_data, setSingle_data] = useState({})
    const dispatch = useDispatch()
    const [AppPermission, SetAppPermission] = useState({
        create: false,
        update: false,
        delete: false,
        export: false,
        import: false
    })
    const [temp_id, settemp_id] = useState(0)
    const [expimpmudle, setexpimpmudle] = useState('')

    useEffect(() => {
        checkPermissions()
        setfilter({})
        fetAllTemplates()
        console.log(getToken()
            , "getToken()");
        SetAppPermission({
            create: false,
            update: false,
            delete: false,
            export: false,
            import: false
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
            if (AppPerState.indexOf(`${process}_${value}:export`) != -1) {
                set.export = true;
            }
            if (AppPerState.indexOf(`${process}_${value}:import`) != -1) {
                set.import = true;
            }
            setexpimpmudle(screen)
            return set;
        });
    }, [screen, Mrkapp_id])

    const checkPermissions = () => {

        if (screen == "crm_leads") {
            setPermitEl({
                ...permitEl,
                ...permit?.crm_leads
            })
        }
        if (screen == "crm_company") {
            setPermitEl({
                ...permitEl,
                ...permit?.crm_company
            })
        }
        if (screen == "crm_deals") {
            setPermitEl({
                ...permitEl,
                ...permit?.crm_deals
            })
        }
        if (screen == "crm_status") {
            setPermitEl({
                ...permitEl,
                ...permit?.crm_status
            })
        }
        if (screen == "crm_activity") {
            setPermitEl({
                ...permitEl,
                ...permit?.crm_activity
            })
        }
    }

    useEffect(() => {
        if (!drawerOpen) {

            setTemplateFlds((set) => {
                templateApiFlds?.fields?.forEach((elm) => {
                    elm.fields.forEach((elem) => {
                        if (elem.model == "image") {
                            elem.disabled = false
                        }
                    })
                })
                return {
                    ...templateApiFlds,
                    initialValues: {},
                    action: mode.CREATE,
                    skipped: [],
                    lazyDataApi: lazyDataApi
                }
            })
        }
    }, [drawerOpen])

    useEffect(() => {
        console.log(pageinfo);
        // getdataFromApi()
        // setTableShow(true)
    }, [page, filter])

    useEffect(() => {
        getdataFromApi()
    }, [filter])

    useEffect(() => {
        console.log(pageinfo);
        console.log(items);
        setTableShow(true)

    }, [items])

    useEffect(() => {
        dynamicDropdownload()
    }, [screen, Mrkapp_id])

    useEffect(() => {
        setitems([])
        console.log(colHeaders);

        setpageinfo({
            title: getTitle(label),
            Headers: colHeaders
        })
        getdataFromApi()
    }, [colHeaders, rowsPerPage])

    useEffect(() => {
        console.log(pageinfo);
        setTableShow(true)
    }, [pageinfo])

    let lazyDataApi = async (childmodel, parentmodel, parentvalue) => {
        console.log(childmodel, parentmodel, parentvalue);
        if (screen != "attributes") {
            await dynamicDropdownload(childmodel, parentvalue)
        }
        else {
            changeTypeFld(childmodel, parentvalue)
        }
    }
    let lazycustomDataApi = async (childmodel, parentmodel, parentvalue) => {

        await dynamiconditionDropdownload(childmodel, parentvalue)

    }
    let closeCrm = () => {
        setopenCrm(false)
        setViewCRMData({})
    }

    const changeTypeFld = (cMod, pVal) => {
        let attrGrp = [...allAttr];

        if (templateApiFlds && templateApiFlds.hasOwnProperty("fields")) {

            setTemplateFlds((prevState) => {
                const updatedFields = templateApiFlds.fields.map((elm) => {
                    const updatedElm = { ...elm };
                    updatedElm.fields.forEach((elem) => {

                        let typeAttr = attrGrp.filter((item) => item.id.toString() === pVal)[0];


                        if (typeAttr && typeAttr.field === "COL" && elem.model == "attr_value") {
                            elem.type = 'ColorPicker';
                        }
                        else if (typeAttr && typeAttr.field === "TXT" && elem.model == "attr_value") {
                            elem.type = 'TextInput';
                        }
                    });
                    return updatedElm;
                });

                return {
                    ...prevState,
                    fields: updatedFields,
                    template: { ...templateApiFlds.template },
                };
            });
        }
        // setTemplateFlds((set) => {
        //   templateApiFlds.fields.forEach((elm) => {
        //     elm.fields.forEach((elem) => {
        //       
        //       if (elem.model == cMod) {
        //         elem.disabled = 'Y'
        //       }
        //     })
        //   })
        //   return {
        //     ...templateFlds,
        //   }
        // })
    }

    const get_table_filter = (val) => {
        console.log(val);

        var filterObj = {};
        setfilter({})
        if (val.items.length > 0 && val.items[0].field) {
            if (val.items[0].value && val.items[0].value != "") {
                generateFilterObj(val, filterObj)
                console.log(filterObj);
                setfilter(filterObj)
            }
            else {
                delete filterObj.details
                setfilter({})
            }
        }
    }

    const generateFilterObj = (val, filterObj) => {
        const field = val.items[0].field;
        const fieldKeys = field.includes('.') ? field.split('.') : [field];

        if (screen == "crm_leads" || screen == "crm_contact" || screen == "crm_deals" || screen == "crm_company") {
            var currentLevel = filterObj;

            for (var i = 0; i < fieldKeys.length; i++) {
                console.log(fieldKeys);
                var key = i === fieldKeys.length - 1 && fieldKeys[i] != "sub_category_id" ?
                    '$.' + fieldKeys[i] : fieldKeys[i];

                if (i === fieldKeys.length - 1) {
                    currentLevel[key] = val.items[0].value;
                } else {
                    currentLevel[key] = currentLevel[key] || {};
                    currentLevel = currentLevel[key];
                }
            }
        }

    }
    const loadUser = () => {
        ServiceProxy.business.find("b2b", "user", "view", {
            account_id: {
                "$eq": getToken().account_id
            },
            partner_id: {
                "$eq": getToken().partner_id
            },
            "roles": {
                "$eq": "Employee"
            }
        }, [])
            .then((res) => {
                res.records.map((item) => {
                    setfieldDyanamicBind((set) => {
                        set.user = res.records.map((elm) => {
                            return { id: elm.id, name: elm.first_name + ' ' + elm.last_name, value: elm.first_name + elm.last_name }
                        })
                        return set
                    })
                })
                // fetAllTemplates()
            })
            .catch((err) => {
                console.error(err);
            })
    }
    const loadStateInit = () => {

        ServiceProxy.business.find('b2b', 'location_state', 'view', {
            account_id: { "$eq": getToken().account_id }, is_active: { $eq: "Y" }
        }, [], null, null
        )
            .then((res) => {
                res.records.map((item) => {
                    if (item) {
                        item.state = item;
                    }
                    // setCategories(item.sub_category.items)
                    setfieldDyanamicBind((set) => {
                        set.state = res.records.map((elm) => {
                            return { id: elm.state_code, name: elm.state_name, value: elm.state_code }
                        })
                        return set
                    })
                    setfieldCustomDyanamicBind((set) => {
                        set.state = res.records.map((elm) => {
                            return { id: elm.state_code, name: elm.state_name, value: elm.state_code }
                        })
                        return set
                    })

                })
                // fetAllTemplates()
            })
            .catch((err) => {
                console.error(err);
            })
    }


    const dynamiconditionDropdownload = async (model, value) => {
        console.log(model, value);

        if (model === "contact") {
            loadStateInit()
        }
        if (model == "city") {
            ServiceProxy.business.find('b2b', 'location_city', 'view', {
                account_id: { "$eq": getToken().account_id },
                state_code: { $eq: value },
                is_active: { $eq: "Y" }
            }, [], 1, 10000)
                .then((res) => {
                    let values = []
                    if (res.cursor.totalRecords > 0) {
                        values = res.records.map((elm) => {
                            return {
                                id: elm.city_code.toString(), name: elm.city_name, value: elm.city_code
                            }
                        })

                    }
                    dispatch(setdata({ [model]: values }))
                    // res.records.map((item) => {
                    //     setfieldDyanamicBind((set) => {
                    //         set.city_code = res.records.map((elm) => {
                    //             return { id: elm.city_code.toString(), name: elm.city_name, value: elm.city_code }
                    //         })
                    //         set.city = res.records.map((elm) => {
                    //             return { id: elm.city_code.toString(), name: elm.city_name, value: elm.city_code }
                    //         })
                    //         setAllCities(set.city_code);
                    //         return set
                    //     })
                    // })
                    // fetAllTemplates()
                })
                .catch((err) => {
                    console.error(err);
                })
        }

    }
    const dynamicDropdownload = async (model, value) => {
        console.log(model, value);

        if (model == undefined || model === "contact") {
            if (["crm_leads", "crm_contact", "crm_company", "crm_deals", "crm_status"].includes(screen)) {

                if (screen === "crm_leads") {
                    loadStateInit()
                    loadUser()
                    ServiceProxy.business.find('b2b', 'product', 'view', {
                        account_id: {
                            "$eq": getToken().account_id
                        },
                        partner_id: {
                            "$eq": getToken().partner_id
                        },
                        "is_active": {
                            "$eq": "Y"
                        }
                    }, [], null, null)
                        .then((res) => {
                            res.records.map((item) => {

                                setfieldDyanamicBind((set) => {
                                    set.product_id = res.records.map((elm) => {
                                        return { id: elm.id, name: elm.id, value: elm.id }
                                    })
                                    return set
                                })
                            })
                            // fetAllTemplates()
                        })
                        .catch((err) => {
                            console.error(err);
                        })
                    ServiceProxy.business.find('b2b', 'crm_status', 'view', {
                        account_id: {
                            "$eq": getToken().account_id
                        },
                        partner_id: {
                            "$eq": getToken().partner_id
                        },
                        module: {
                            "$eq": "lead_status"
                        },
                        "is_active": {
                            "$eq": "Y"
                        }
                    }, [], null, null)
                        .then((res) => {
                            res.records.map((item) => {

                                setfieldDyanamicBind((set) => {
                                    set.lead_status = res.records.map((elm) => {
                                        return { id: elm.module, name: elm.name, value: elm.description }
                                    })
                                    return set
                                })
                            })
                            // fetAllTemplates()
                        })
                        .catch((err) => {
                            console.error(err);
                        })
                    ServiceProxy.business.find('b2b', 'crm_status', 'view', {
                        account_id: {
                            "$eq": getToken().account_id
                        },
                        module: {
                            "$eq": "disposition"
                        },
                        "is_active": {
                            "$eq": "Y"
                        }
                    }, [], null, null)
                        .then((res) => {
                            res.records.map((item) => {

                                setfieldDyanamicBind((set) => {
                                    set.lead_disposition = res.records.map((elm) => {
                                        return { id: elm.module, name: elm.name, value: elm.description }
                                    })
                                    return set
                                })
                            })
                            // fetAllTemplates()
                        })
                        .catch((err) => {
                            console.error(err);
                        })
                    let teams = await ServiceProxy.business.find('b2b', 'teams', 'view', {
                        account_id: {
                            "$eq": getToken().account_id
                        },
                        partner_id: {
                            "$eq": getToken().partner_id
                        },
                        is_active: {
                            "$eq": "Y"
                        }
                    })
                    if (teams.records.length > 0) {
                        setfieldDyanamicBind((set) => {
                            set.teams = teams.records.map((elm) => {
                                return { id: elm.id, name: elm.name, value: elm.id }
                            })
                            return set
                        })
                    }


                }

                if (screen === "crm_contact") {
                    loadStateInit()
                }
                if (screen === "crm_company") {
                    loadStateInit()
                }

                if (screen === "crm_deals") {
                    loadUser()
                    ServiceProxy.business.find('b2b', 'workflow_status', 'view', {
                        account_id: {
                            "$eq": getToken().account_id
                        },
                        priority: {
                            "$eq": "1"
                        },
                        page_type: {
                            "$eq": "pipeline"
                        }
                    }, [], null, null)
                        .then((res) => {
                            res.records.map((item) => {

                                setfieldDyanamicBind((set) => {
                                    set.pipeline = res.records.map((elm) => {
                                        return { id: elm.app_id, name: elm.display_name, value: elm.app_id }
                                    })
                                    return set
                                })
                            })
                            // fetAllTemplates()
                        })
                        .catch((err) => {
                            console.error(err);
                        })

                }


            }
        }
        if (model == "city") {
            ServiceProxy.business.find('b2b', 'location_city', 'view', {
                account_id: { "$eq": getToken().account_id },
                state_code: { $eq: value },
                is_active: { $eq: "Y" }
            }, [], 1, 10000)
                .then((res) => {
                    let values = []
                    if (res.cursor.totalRecords > 0) {
                        values = res.records.map((elm) => {
                            return {
                                id: elm.city_code.toString(), name: elm.city_name, value: elm.city_code
                            }
                        })

                    }
                    dispatch(setdata({ [model]: values }))
                    // res.records.map((item) => {
                    //     setfieldDyanamicBind((set) => {
                    //         set.city_code = res.records.map((elm) => {
                    //             return { id: elm.city_code.toString(), name: elm.city_name, value: elm.city_code }
                    //         })
                    //         set.city = res.records.map((elm) => {
                    //             return { id: elm.city_code.toString(), name: elm.city_name, value: elm.city_code }
                    //         })
                    //         setAllCities(set.city_code);
                    //         return set
                    //     })
                    // })
                    // fetAllTemplates()
                })
                .catch((err) => {
                    console.error(err);
                })
        }
        if (model == 'deal_status') {

            await ServiceProxy.business.find('b2b', 'workflow_status', 'view', {
                account_id: {
                    "$eq": getToken().account_id
                },
                app_id: {
                    "$eq": value
                }
            }, [], null, null)
                .then((res) => {
                    let values = []
                    if (res.cursor.totalRecords > 0) {
                        values = res.records.map((elm) => {
                            return {
                                id: elm.status_name, name: elm.display_name, value: elm.display_name
                            }
                        })

                    }
                    dispatch(setdata({ [model]: values }))
                })
        }
    }

    let getdataFromApi = async () => {
        setTableShow(false)

        try {
            let reqFilter
            let user
            let associated = []
            // module == "ecommerce" ? filterParam = :
            console.log(filter);
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
                    user = { "$.user": getToken().id }
                } else {
                    user = { "$.teams": getToken().emp_group.records[0].teams }
                }
            }

            if (screen == "crm_leads") {
                associated = [
                    {
                        "model": "teams",
                        "bindAs": {
                            "name": "teams",
                            "value": "name"
                        },
                        "key": {
                            "foreign": "details.teams",
                            "primary": "id"
                        },
                        "fields": [
                            "name"
                        ]
                    }]
                setbind_topayload(associated)
                reqFilter = {
                    account_id: {
                        "$eq": getToken().account_id
                    },
                    partner_id: {
                        "$eq": getToken().partner_id
                    },
                    is_lead: {
                        $eq: "Y"
                    },
                    user,
                    ...filter
                }
            }
            else if (screen == "crm_contact") {
                reqFilter = {
                    account_id: {
                        "$eq": getToken().account_id
                    },
                    partner_id: {
                        "$eq": getToken().partner_id
                    },
                    is_contact: {
                        $eq: "Y"
                    },
                    user,

                    ...filter
                }
            }
            else if (screen == "crm_deals") {
                reqFilter = {
                    account_id: {
                        "$eq": getToken().account_id
                    },
                    partner_id: {
                        "$eq": getToken().partner_id
                    },
                    is_active: {
                        $eq: "Y"
                    },

                    ...filter
                }
                let ispresent = false
                if (role === "Employee") {

                    if (!ispresent) {
                        reqFilter.user = {
                            $eq: getToken().id
                        }
                    } else {
                        reqFilter["user"] = {
                            $in: employee_.employee_id
                        }
                    }

                }
            }
            else if (screen == "crm_company") {
                reqFilter = {
                    account_id: {
                        "$eq": getToken().account_id
                    },
                    partner_id: {
                        "$eq": getToken().partner_id
                    },
                    is_active: {
                        $eq: "Y"
                    },
                    ...filter
                }
            }
            else {
                reqFilter = { ...filter }
            }

            let fetch = await ServiceProxy.business.find(
                'b2b',
                screen == "crm_contact" ? "crm_leads" : screen,
                'view',
                reqFilter, [],
                page,
                rowsPerPage,
                sort, associated,
            )

            if (fetch.records.length > 0) {
                setbind_to(fetch.bind_to)
                let dataArray = []
                dataArray = fetch.records.map((item) => {
                    if (item.id) {
                        item.id = item.id.toString()
                    }
                    if (item.details) {
                        item.details = JSON.parse(item.details);
                    }
                    if (item.contact_details) {
                        item.contact_details = JSON.parse(item.contact_details);
                    }
                    return item
                })
                console.log(dataArray);
                if (["crm_company", "crm_leads", "crm_contact", "crm_deals"].includes(screen)) {
                    console.log(dataArray);
                    if (dataArray.length > 0 || dataArray[0].hasOwnProperty("details") ||
                        dataArray[0].hasOwnProperty("contact_details")) {
                        console.log(dataArray);
                        // setitems([{
                        //     ...dataArray[0],
                        //     ...dataArray[0].details
                        // }])
                        setitems(dataArray)
                    }
                    else {
                        setitems([])
                    }
                }
                else {
                    setitems(dataArray)
                }
            }
            else {
                setitems([])
            }

            if (screen != "category") {
                setcount(fetch.cursor.totalRecords)
            }

        } catch (error) {
            console.error(error)
        }
    }

    const handleFileUpload = () => {

    }

    // need
    const handlePageChange = (value) => {
        setPage(value + 1);
    }
    // need
    const handleRowsPerPageChange = (event, value) => {
        setRowsPerPage(event);
    }
    let fetAllContactTemplates = async (condition, e) => {
        await dynamiconditionDropdownload(condition)
        try {
            let callTemp = []

            if (condition === "contact") {
                callTemp.push("CRM_CONTACT_CU")
            }


            let template = await ServiceProxy.business.find('b2b', 'template', 'view', {
                name: {
                    "$in": callTemp
                },
            }, [], 1, 100
            )
            if (template.cursor.totalRecords != 0) {
                let sort = [{
                    column: "position",
                    order: 'asc'
                }]
                template.records.forEach(async (elm) => {
                    let templatefields = await ServiceProxy.business
                        .find('b2b', 'templates_field', 'view', {
                            template_id: { $eq: elm.id.toString() },
                            account_id: { $eq: getToken().account_id }
                        },
                            [],
                            null,
                            null,
                            sort
                        )

                    if (templatefields.cursor.totalRecords > 0) {


                        if (condition === "contact") {
                            CustomFieldhandel(templatefields.records, fieldCustomDyanamicBind)
                                .then((res) => {

                                    setTemplateFlds({
                                        ...{
                                            template: elm,
                                            fields: res.field,
                                            skipped: []
                                        },
                                        initialValues: {},
                                        action: mode.CREATE,
                                        skipped: [],
                                        condition: "contact",
                                        e: e,
                                        lazyDataApi: lazycustomDataApi
                                    })
                                    setDrawerOpen(true)

                                })
                        }
                    }
                }
                )
            }

        } catch (error) {
            console.error(error)
        }
    }
    let fetAllTemplates = async (condition) => {
        setTableShow(false)
        try {
            let callTemp = []

            if (screen == "crm_leads") {
                callTemp.push("CRM_LEADS_CU")
            }
            else if (screen == "crm_contact" || condition === "contact") {
                callTemp.push("CRM_CONTACT_CU")
            }
            else if (screen == "crm_company") {
                callTemp.push("CRM_ACCOUNT_CU")
            }
            else if (screen == "crm_deals") {
                callTemp.push("CRM_DEALS_CU")
            }
            else if (screen == "crm_status") {
                callTemp.push("CRM_STATUS_CU")
            }

            let template = await ServiceProxy.business.find('b2b', 'template', 'view', {
                name: {
                    "$in": callTemp
                },
            }, [], 1, 100
            )
            if (template.cursor.totalRecords != 0) {
                let sort = [{
                    column: "position",
                    order: 'asc'
                }]
                template.records.forEach(async (elm) => {
                    if (elm.name === "CRM_ACCOUNT_CU") {
                        settemp_id(elm.id)
                    }
                    let templatefields = await ServiceProxy.business
                        .find('b2b', 'templates_field', 'view', {
                            template_id: { $eq: elm.id.toString() },
                            account_id: { $eq: getToken().account_id }
                        },
                            [],
                            null,
                            null,
                            sort
                        )

                    if (templatefields.cursor.totalRecords > 0) {

                        if (screen == "crm_leads") {
                            if (elm.name == "CRM_LEADS_CU") {
                                CustomFieldhandel(templatefields.records, fieldDyanamicBind)
                                    .then((res) => {
                                        setTemplateApiFlds({
                                            template: elm,
                                            fields: res.field,
                                            skipped: []
                                        })
                                        let tableFlds = res.header
                                        let header = tableFlds.map((item) => {
                                            return {
                                                ...item,
                                                value: `details.${item.value}`
                                            }
                                        })
                                        let obj = {}
                                        for (let i = 0; i < children.length; i++) {
                                            obj[`${children[i].value}`] = children[i].label

                                        }
                                        header.push({
                                            filterable: false,
                                            title: "Actions",
                                            checkbox: true,
                                            avatar: false,
                                            sort: false,
                                            value: "actions",
                                            actionValue: [
                                                { name: "Edit", value: 'edit' },
                                                { name: `Create ` + obj[`crm_contact`], value: 'contact_create' },
                                                { name: "View", value: 'view' },
                                                { name: "Delete", value: 'delete' },
                                            ]
                                        })
                                        console.log(colHeaders);
                                        setColHeaders(header)
                                        setTableShow(true)
                                    })
                                CustomFieldhandel(templatefields.records, fieldDyanamicBind, getToken().partner_id === null && getToken().roles !== 'Client' ? 'Brand' : getToken().partner_id !== null ? 'Partner' : '')
                                    .then((res) => {
                                        settemplatefilter({
                                            template: elm,
                                            fields: res.field
                                        })
                                    })
                            }
                        }
                        if (!["crm_leads"].includes(screen)) {
                            CustomFieldhandel(templatefields.records)
                                .then((res) => {
                                    setTemplateApiFlds({
                                        template: elm,
                                        fields: res.field,
                                        skipped: []
                                    })
                                    let tableFlds = res.header
                                    let header = tableFlds.map((item) => {
                                        var fldVal = ""
                                        if (screen == "crm_contact") {
                                            fldVal = `contact_details.${item.value}`
                                        }
                                        else if (item.value == "phone_number" &&
                                            item.value == "email" && item.value == "user") {
                                            fldVal = `${item.value}`
                                        }
                                        else {
                                            fldVal = `details.${item.value}`
                                        }
                                        return {
                                            ...item,
                                            value: fldVal
                                        }
                                    })
                                    header.push({
                                        filterable: false,
                                        title: "Actions",
                                        checkbox: true,
                                        avatar: false,
                                        sort: false,
                                        value: "actions",
                                        actionValue: [
                                            { name: "Edit", value: 'edit' },
                                            { name: "View", value: 'view' },
                                            { name: "Delete", value: 'delete' },
                                        ]
                                    })
                                    console.log(header);
                                    setColHeaders(header)
                                    console.log(colHeaders);
                                })
                            CustomFieldhandel(templatefields.records, fieldDyanamicBind, getToken().partner_id === null && getToken().roles !== 'Client' ? 'Brand' : getToken().partner_id !== null ? 'Partner' : '')
                                .then((res) => {

                                    settemplatefilter({
                                        template: elm,
                                        fields: res.field
                                    })
                                })
                        }
                    }
                }
                )
            }

        } catch (error) {
            console.error(error)
        }
    }

    // need
    const tableActions = {
        edit: (e) => {

            if (e && e.id) {
                e.details.id = e.id
            }
            if (screen != "category") {

                setTemplateFlds((set) => {
                    templateApiFlds.fields.forEach((elm) => {
                    })
                    return {
                        ...templateApiFlds,
                        initialValues: e.details || e,
                        action: mode.UPDATE,
                        skipped: [],
                        lazyDataApi: lazyDataApi
                    }
                })
            }
            setSelectedData(e)
            setDrawerOpen(true)

        },
        delete: (e, n) => {
            setid(e.id)
            setSingle_data(e)
            setOpenDialog(true)
        },
        viewRecord: (e) => {
            console.log(e, value, "valuevaluevaluevaluevalue");
            setViewCRMData(e)
            setopenCrm(true)
        },
        createContact: async (e) => {
            await fetAllContactTemplates("contact", e)


        },
        viewImg: (e) => {

            setImgPrevModal(true)
            if (screen == "product") {
                if (e.details.image) {
                    setImagePrev(e.details.image.map((a) => `${Constants.BASE_URL_WOP}/${a.file_path.substring(14)}`))
                }
            }
            else if (screen == "category") {

                if (e.details) {
                    setImagePrev(e.details.icon.map((a) => `${Constants.BASE_URL_WOP}/${a.file_path.substring(14)}`))
                }
            }
        }
    }

    // useEffect(() => {
    //     console.log(viewCRMData);
    //     if (Object.keys(viewCRMData).length > 0) {
    //         setopenCrm(true)
    //     }
    // }, [viewCRMData])

    // need
    const deleteSelectedData = () => {
        action__(id, mode.DELETE, Single_data)
    }

    let Openpopup = () => {
        setIsFilter(false)
        setImageList([])
        setSelectedData({})
        setTemplateFlds({
            ...templateApiFlds,
            initialValues: {},
            action: mode.CREATE,
            skipped: [],
            lazyDataApi: lazyDataApi
        })
        setDrawerOpen(true)
    }

    let deleteimage = async (Removestorefile_) => {
        if (Removestorefile_.length > 0) {
            let path = []
            let ids = []
            for (let i = 0; i < Removestorefile_.length; i++) {
                path.push(Removestorefile_[i].file_path)
                ids.push(Removestorefile_[i].docId)
            }
            let filedelete = await ServiceProxy.fileUpload
                .delete(
                    'b2b', screen, path, ids
                )
            return filedelete
        }
    }
    let uploadfile = async () => {
        let fileUpload = await ServiceProxy.fileUpload
            .upload(
                'b2b', screen, storefile
            )
        return fileUpload
    }

    let action__ = async (data, typeMode, filedata, formSchema) => {
        console.log(data, typeMode, filedata, "iiiiiiiiiiiii", Removestorefile)
        console.log(screen);
        if ((screen === "crm_leads" || screen === "crm_contact") &&
            (typeMode === mode.CREATE || typeMode === mode.UPDATE)
        ) {
            const validated = formCustomValidation(data)
            if (validated) {
                action(data, typeMode, {}, formSchema)
            }
            else {
                setSnackProps({
                    snackOpen: true,
                    severity: "error",
                    message: SnackMess.MUSTONE
                })
            }
        }
        else {

            if (typeMode == mode.CREATE) {
                action(data, typeMode, {}, formSchema)
            }
            else if (typeMode == mode.UPDATE) {
                action(data, typeMode, {}, formSchema)
            }
            else if (typeMode == mode.FILTER || typeMode == mode.RESET) {
                action(data, typeMode)
            }
            else if (mode.DELETE === typeMode) {
                action_delete(data, typeMode)
            }
        }

    }
    let action_delete = async (data, typeMode, fileUpload) => {

        console.log("werr", typeMode);
        if (typeMode == mode.DELETE) {
            crmDel(data)
            // Softdelete({
            //     id: data.toString(),
            //     is_active: 'N'
            // }, screen == "category" ? "category_new" : screen)
            //     .then((res) => {
            //         if (res.statusCode == 200 || res.statusCode == 204) {
            //             setOpenDialog(false)
            //             setSnackProps({
            //                 snackOpen: true,
            //                 severity: "success",
            //                 message: SnackMess.U_SUCC
            //             })
            //             getdataFromApi()
            //             setOpenDialog(false)
            //         }
            //     })
            //     .catch((err) => {
            //         setSnackProps({
            //             snackOpen: true,
            //             severity: "error",
            //             message: `${SnackMess.SWWERR}::${err}`
            //         })
            //     })
        }
    }

    const crmDel = (data) => {
        let tablesToDel = []
        let delObj
        let anotherDelObj
        if (screen == "crm_leads") {
            delObj = {
                id: data.toString(),
                company_id: "0",
                is_lead: "N",
                is_contact: "N"
            }
            softDel(data, delObj, "", { id: data.toString() })
            softDel(data, delObj, "", { associate_to_lead: data.toString() })
            softDel(data, { is_active: "N" }, "crm_deals", { lead_id: data.toString() })
            softDel(data, { is_active: "N" }, "crm_activity", { lead_id: data.toString() })

        }
        else if (screen == "crm_contact") {
            delObj = {
                id: data.toString(),
                company_id: "0",
                is_contact: "N",
            }
            softDel(data, delObj, "", { id: data.toString() })
            softDel(data, { is_active: "N" }, "crm_deals", { contact_id: data.toString() })
            softDel(data, { is_active: "N" }, "crm_activity", { contact_id: data.toString() })

        }
        else if (screen == "crm_deals") {
            delObj = {
                id: data.toString(),
                is_active: "N",
            }
            softDel(data, delObj, "crm_deals", { id: data.toString(), })
            softDel(data, { is_active: "N" }, "crm_activity", { deals_id: data.toString() })

        }
        else if (screen == "crm_company") {
            delObj = {
                id: data.toString(),
                is_active: "N",
            }
            softDel(data, delObj, "crm_company", { id: data.toString() })
            softDel(data, { company_id: "0" }, "", { company_id: data.toString() })
            softDel(data, { is_active: "N" }, "crm_deals", { company_id: data.toString() })
            softDel(data, { is_active: "N" }, "crm_activity", { company_id: data.toString() })

        }
    }


    const softDel = (data, delObj, table, condition) => {
        if (table != "") {

            Softdelete(delObj, table, condition)
                .then((res) => {
                    if (res.statusCode == 200 || res.statusCode == 204) {
                        setOpenDialog(false)
                        setSnackProps({
                            snackOpen: true,
                            severity: "success",
                            message: SnackMess.U_SUCC
                        })
                        getdataFromApi()
                        setOpenDialog(false)
                    }
                })
                .catch((err) => {
                    setSnackProps({
                        snackOpen: true,
                        severity: "error",
                        message: `${SnackMess.SWWERR}::${err}`
                    })
                })
        } else {
            Softdelete(delObj, screen == "crm_contact" ? "crm_leads" : screen, condition)
                .then((res) => {
                    if (res.statusCode == 200 || res.statusCode == 204) {
                        setOpenDialog(false)
                        setSnackProps({
                            snackOpen: true,
                            severity: "success",
                            message: SnackMess.U_SUCC
                        })
                        getdataFromApi()
                        setOpenDialog(false)
                    }
                })
                .catch((err) => {
                    setSnackProps({
                        snackOpen: true,
                        severity: "error",
                        message: `${SnackMess.SWWERR}::${err}`
                    })
                })
        }
    }

    let action = async (data, typeMode, fileUpload, formSchema) => {
        console.log(data, typeMode, "jjjjjjjjjjjjjjjjjjj", formSchema)
        let obj;
        let orderTrackObj;
        if (typeMode != mode.FILTER && typeMode != mode.RESET) {
            if (fileUpload && fileUpload.length > 0) {

                let arr = []
                for (let i = 0; i < fileUpload.length; i++) {
                    const element = fileUpload[i];
                    if (element.filename !== undefined && element.content_type !== undefined) {
                        element["path"] = element.filename
                        element["type"] = element.content_type
                        delete element.filename
                        delete element.content_type
                    }
                    arr.push(element)

                }
                data.image = arr
            }
        }

        if (screen == "crm_leads" || screen == "crm_contact") {
            let userVals = []
            let userVal = {
                name: data.user,
                value: data.user
            }
            userVals.push(userVal)
            obj = {
                id: data.id || "0",
                account_id: getToken().account_id,
                partner_id: getToken().partner_id,
                company_id: formSchema.condition === "contact" ? formSchema.e.company_id : data.company_id || "0",
                phone_number: data.phone_number,
                email: data.email,
                user: {
                    user: data.user,
                    // user_value: userVals  --- NOT NEEDED NOW
                },
                details: formSchema.condition === "contact" ? {} : screen == "crm_leads" ? { ...data } : {},
                contact_details: formSchema.condition === "contact" ? { ...data } : screen == "crm_contact" ? { ...data } : {},
                is_lead: formSchema.condition === "contact" ? "N" : screen == "crm_leads" ? "Y" : "N",
                is_contact: formSchema.condition === "contact" ? "Y" : screen == "crm_contact" ? "Y" : "N",
            }
            if (getToken().roles === "Employee") {
                obj.user = { user: getToken().id }
            }
            if (formSchema.condition === "contact") {
                obj[`associate_to_lead`] = formSchema.e.id
            }
        }
        else if (screen == "crm_deals") {
            obj = {
                id: data.id || "0",
                account_id: getToken().account_id,
                partner_id: getToken().partner_id,
                lead_id: data.lead_id,
                user: getToken().id.toString(),
                company_id: data.company_id,
                details: { ...data }
            }
        }
        else if (screen == "crm_company") {
            obj = {
                id: data.id || "0",
                account_id: getToken().account_id,
                partner_id: getToken().partner_id,
                details: { ...data }
            }
        }
        else if (screen == "crm_status") {
            obj = {
                id: data.id || "0",
                account_id: getToken().account_id,
                partner_id: getToken().partner_id,
                name: data.name,
                description: data.description,
                module: data.module,
            }
        }

        apiCall(typeMode, obj, data, orderTrackObj)

    }

    const apiCall = async (typeMode, obj, data, orderTrackObj) => {

        try {

            if (typeMode == mode.CREATE) {


                let Create = await ServiceProxy.business
                    .create('b2b', screen == "crm_contact" ? "crm_leads" :
                        screen == "crm_disposition" ? "crm_status" : screen, obj)

                if (Create.statusCode == 201) {
                    setSnackProps({
                        snackOpen: true,
                        severity: "success",
                        message: SnackMess.C_SUCC
                    })
                    setDrawerOpen(false)
                    getdataFromApi()
                }
            }
            else if (typeMode == mode.UPDATE) {
                delete obj.created_by
                delete obj.created_at
                delete obj.updated_by
                delete obj.updated_at

                if (obj.created_at) {
                    delete obj.created_at
                }
                try {

                    let Update = await ServiceProxy.business
                        .update('b2b', screen == "crm_contact" ? "crm_leads" :
                            screen == "crm_disposition" ? "crm_status" : screen, obj)

                    if (Update.statusCode == 200 && Update.modifiedCount != 0) {
                        if (screen == "crm_leads") {
                            let fetch = await fetchProxy({ associate_to_lead: { $eq: obj.id } }, "crm_leads", [])

                            await updateProxy({ company_id: obj.company_id }, 'crm_leads', { associate_to_lead: obj.id })


                        }

                        setSnackProps({
                            snackOpen: true,
                            severity: "success",
                            message: SnackMess.U_SUCC
                        })
                        setDrawerOpen(false)
                        setSelectedData({})
                        getdataFromApi()
                    }
                }
                catch (err) {
                    console.log(err);
                    setSnackProps({
                        snackOpen: true,
                        severity: "error",
                        message: `${SnackMess.SWWERR}::${err}`
                    })
                }
            }
            else if (typeMode == mode.FILTER) {
                let filterObject = {}
                if (screen == "crm_leads") {
                    filterObject = generateFilter(screen, filterObject, data)
                }
                else if (screen == "crm_contact") {
                    filterObject = generateFilter(screen, filterObject, data)
                }
                else if (screen == "crm_deals") {
                    filterObject = generateFilter(screen, filterObject, data)
                }
                else if (screen == "crm_company") {
                    filterObject = generateFilter(screen, filterObject, data)
                }
                setfilter({
                    ...filterObject
                })
                setDrawerOpen(false)
            } else if (typeMode == mode.RESET) {

                setfilter({})
                setfilterVal({})
                setDrawerOpen(false)
            }
        } catch (err) {
            setSnackProps({
                snackOpen: true,
                severity: "error",
                message: `Invalid Input Data`
            })
        }
    }

    const formCustomValidation = (data) => {
        console.log(data);
        if ((data.phone_number === "" || data.phone_number == null) &&
            (data.email === "" || data.email == null)) {
            return false;
        }

        return true;
    }


    const handleFilterByName = (typeMode, event) => {
        if (typeMode == mode.FILTER) {
            setIsFilter(true)

            setTemplateFlds({
                ...templatefilter,
                initialValues: { ...filterVal },
                action: mode.FILTER,
                skipped: [],
                lazyDataApi: lazyDataApi
            });
            setDrawerOpen(true);

        } else if (typeMode == mode.SEARCH) {
        }
    };

    return (
        <>
            <Helmet>
                <title>{pageinfo.title}</title>
                {/* <title>{pageinfo.title.toLowerCase().replaceAll('_', ' ').replace(/(^|\s)(\w)/g, (match) => match.toUpperCase())}</title> */}
            </Helmet>

            <Container maxWidth={"none"}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={10}>
                    <Typography variant="h4" gutterBottom>
                        {label}
                    </Typography>
                    <Stack direction={"row"} gap={2}>
                        {AppPermission.create && screen != "crm_deals" ?
                            <Button onClick={() => Openpopup()}
                                variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                                New {label}
                            </Button> : ""
                        }
                        {AppPermission.import && <Button onClick={() => router('/user/impexp', { state: { type: "upload", template_id: temp_id, model: expimpmudle } })}
                            variant="contained" startIcon={<Iconify icon="ic:sharp-file-upload" />}>
                            Upload
                        </Button>}
                        {AppPermission.export && <Button onClick={() => router('/user/impexp', { state: { type: "export", template_id: temp_id, model: expimpmudle } })}
                            variant="contained" startIcon={<Iconify icon="ic:baseline-download" />}>
                            Export
                        </Button>}
                        {/* {screen == "category" &&
              <Button onClick={() => {
                router('/builder/workflow/view?app_id=' + app_id + '&type=' + 'marketplace')
              }}
                variant="contained" startIcon={<Iconify icon="ic:sharp-info" />}>
                Status Flow
              </Button>
            } */}
                    </Stack>

                </Stack>

                <Stack sx={{
                    padding: 2
                }}>
                    {screen != "category" ?
                        <UserListToolbar numSelected={0} onFilterName={() => handleFilterByName(mode.FILTER)} mode={mode} />
                        : null}
                </Stack>
                {tableShow ?
                    (
                        pageinfo.Headers != undefined &&
                        <AppTable
                            header={colHeaders}
                            bind_topayload={bind_topayload}
                            bind_to={bind_to}
                            actionsButtons={tableActions}
                            count={count}
                            items={items}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            page={page - 1}
                            rowsPerPage={rowsPerPage}
                            get_table_filter={get_table_filter}
                            module={screen}
                            checkSelection={module == "2" && screen == "assign" ? true : false}
                            permitEl={AppPermission}
                        />
                    )
                    : null}
                {/* <AppDynamicSubForm /> */}
                {/*         
                    <AppTable
                    header={pageinfo.Headers}
                    actionsButtons={tableActions}
                    count={count}
                    items={items}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    getImageFromDocId={getImageFromDocId}
                    // onDeselectAll={usersSelection.handleDeselectAll}
                    // onDeselectOne={usersSelection.handleDeselectOne}
                    // onSelectAll={usersSelection.handleSelectAll}
                    // onSelectOne={usersSelection.handleSelectOne}
                    // selected={usersSelection.selected} 
                    /> */}

                {/* <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
                    <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
                        <ProductFilterSidebar
                        openFilter={openFilter}
                        onOpenFilter={handleOpenFilter}
                        onCloseFilter={handleCloseFilter}
                        />
                        <ProductSort />
                    </Stack>
                    </Stack> */}

                {/* <ProductList products={PRODUCTS} /> */}
                {/* <ProductCartWidget /> */}
            </Container>
            <AppDialog
                dialogTitle={"Confirm"}
                dialogContent={"Are you Sure want to Proceed ?"}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                handleDelete={() => deleteSelectedData()}
            />
            <AppDrawer
                style={{
                    position: "relative",
                    zIndex: 1200
                }}
                children={
                    <AppForm
                        formSchema={templateFlds}
                        action={action__}
                        handleFileUpload={handleFileUpload}
                        imageList={imageList}
                        mode={mode}
                        allObj={true}
                    />
                }
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
            />

            <AppSnacks
                snackProps={snackProps}
                setSnackProps={setSnackProps}
            />
            <Modal
                open={imgPrevModal}
                onClose={() => setImgPrevModal(false)}
            >
                <>
                    <Box
                        sx={{
                            position: 'absolute',
                            right: 10,
                            height: 25,
                            cursor: 'pointer',
                            userSelect: 'none',
                        }}
                        onClick={() => setImgPrevModal(false)}
                    >
                        <Iconify
                            icon="basil:cancel-solid"
                            width="50px"
                            style={{
                                color: '#ffffff'
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <SimpleImageSlider
                            width={896}
                            height={504}
                            images={imagePrev}
                            showBullets={true}
                            showNavs={true}
                        />
                    </Box>
                </>
            </Modal>
            {Object.keys(viewCRMData).length > 0 && <CrmFullScreenDialog
                process={process}
                value={value} children={children}
                openCrm={openCrm} closeCrm={closeCrm} module={value}
                selected_data={viewCRMData}></CrmFullScreenDialog>}
        </>
    );
}