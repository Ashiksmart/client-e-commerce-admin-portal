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
  fetchProxy
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
import { updateProxy } from '../services/AppService';
import CrmFullOrderDialog from '../components/OrderTracking/dialog';

export default function Products(props) {
  const {
    label,
    screen,
    Mrkapp_id,
    value,
    process,
    is_costing
  } = props
  let AppPerState = useSelector(state => state.permisson.permission)
  const currentPath = useLocation();
  let router = useNavigate();

  const [items, setitems] = useState([]);
  const [tempItems, setTempItems] = useState();
  const [snackOpen, setSnackOpen] = useState(false);
  const [imageList, setImageList] = useState([]);


  const [imagePrev, setImagePrev] = useState([])

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
  const [bind_to, setbind_to] = useState([])
  const [bind_topayload, setbind_topayload] = useState([])
  const [templatefilter, settemplatefilter] = useState({})
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
  let [attributeGroup, setattributeGroup] = useState([])
  let [Multiselectbox, setMultiselectbox] = useState([])
  let [pageinfo, setpageinfo] = useState({ title: label })

  let [page, setPage] = useState(1);
  let [sort, setsort] = useState([{
    column: "id",
    order: 'asc'
  }]);

  let [filter, setfilter] = useState({})
  let [allAttrGrp, setAllAttrGrp] = useState({})
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
  let [fieldSubDyanamicBind, setSubfieldDyanamicBind] = useState({})
  let [subEditData, setSubEditData] = useState([])
  let [app_id, setapp_id] = useState()
  let [ispro_limit, setispro_limit] = useState(false)

  const [taskpage, settaskpage] = useState(false);
  let [openorderdetail, setorderdetail] = useState([])
  let [employee, setemployee] = useState([])
  let [taskdetail, settaskdetail] = useState({})

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
    attributes: false
  })


  useEffect(() => {
    setfilter({})
    fetAllTemplates()
    ProductLimitation()
    SetAppPermission({
      create: false,
      update: false,
      delete: false,
      attributes: false
    })
    SetAppPermission((set) => {
      if (AppPerState.indexOf(`${process}_${value}:create`) != -1) {
        console.log("3333333333333333", `${process}_${value}`, AppPerState)
        set.create = true;
      }
      if (AppPerState.indexOf(`${process}_${value}:update`) != -1) {
        console.log("3333333333333333")
        set.update = true;
      }
      if (AppPerState.indexOf(`${process}_${value}:delete`) != -1) {
        console.log("3333333333333333")
        set.delete = true;
      }
      if (AppPerState.indexOf(`${process}_${value}:attributes`) != -1) {
        console.log("3333333333333333")
        set.attributes = true;
      }
      return set;
    });
  }, [screen, Mrkapp_id])



  let ProductLimitation = async () => {
    let pro_limit = false
    let account_info = await ServiceProxy.account.find()
    if (account_info.status == 200) {
      pro_limit = account_info.data.data[0].is_product_limit == "N" ? false : true
      setispro_limit(pro_limit)
    }
    if (screen == "product" && (getToken().roles == 'Superadmin' || getToken().roles == 'Admin') && pro_limit) {
      // let account_info = await ServiceProxy.account.find()
      // if(account_info.status==200){

      SetproductLimit(account_info.data.data[0].product_limit - account_info.data.data[0].product_utilize)
      SetAccountinfo(account_info.data.data[0])
      // }
    } else if (screen == "product" && (getToken().roles == 'SubSuperadmin' || getToken().roles == 'SubAdmin')) {
      let partnerAccountInfo = await ServiceProxy.partner.find(1, 1, 'desc', { partner_id: getToken().partner_id })

      if (partnerAccountInfo.status == 200) {
        pro_limit = partnerAccountInfo.data.data[0].is_product_limit == "N" ? false : true
        setispro_limit(pro_limit)
        if (pro_limit) {
          SetproductLimit(partnerAccountInfo.data.data[0].product_limit - partnerAccountInfo.data.data[0].product_utilize)
          SetAccountinfo(partnerAccountInfo.data.data[0])
        }
      }
    }
  }

  let UpdateAccount = async (modetype) => {
    let operation = modetype === mode.CREATE ? 1 : -1;
    if (screen == "product" && getToken().roles == 'Superadmin') {
      let account_update = await ServiceProxy.business.update('b2b', 'project_account', { id: Accountinfo.id, product_utilize: operation + Number(Accountinfo.product_utilize) })
      console.log(account_update, "account_update")
      return 1
    } else if (screen == "product" && getToken().roles == 'SubSuperadmin') {
      let account_update = await ServiceProxy.business.update('b2b', 'partner_account', { id: Accountinfo.id, product_utilize: operation + Number(Accountinfo.product_utilize) })
      return 1
    }
  }

  const generateFilterObj = (val, filterObj) => {
    const field = val.items[0].field;
    const fieldKeys = field.includes('.') ? field.split('.') : [field];

    if (screen == "product") {
      var currentLevel = filterObj;

      for (var i = 0; i < fieldKeys.length; i++) {
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
    else if (screen == "category") {
      const [subCategory, subField] = field.split('.');

      filterObj["sub_category"] = {
        [`$.items[*].${subCategory}`]: val.items[0].value
      };
    }
    else {
      var currentLevel = filterObj;

      for (var i = 0; i < fieldKeys.length; i++) {
        var key = i === fieldKeys.length - 1 && fieldKeys[i]

        if (i === fieldKeys.length - 1) {
          currentLevel[key] = val.items[0].value;
        } else {
          currentLevel[key] = currentLevel[key] || {};
          currentLevel = currentLevel[key];
        }
      }
    }
  }

  const get_table_filter = async (val) => {
    if (screen != "category") {

      var filterObj = {};
      setfilter({})
      if (val.items.length > 0 && val.items[0].field) {
        if (val.items[0].value && val.items[0].value != "") {
          generateFilterObj(val, filterObj)
          setfilter(filterObj)
        }
        else {
          delete filterObj.details
          setfilter({})
        }
      }
    }
    else {
      const condition = (val.items.length !== 0 && val.items[0].hasOwnProperty("value")) ? val.items[0] : null;
      if (condition) {
        const filteredItems = tempItems?.filter(item => {
          switch (condition.operator) {
            case "equals":
              let fieldValue
              let conditionValue
              if (condition.value) {
                if (item && item.hasOwnProperty(condition.field)) {
                  fieldValue = typeof item[condition.field] == "string" ? item[condition.field].toLowerCase() : []
                  conditionValue = condition.value.toLowerCase();
                  if (conditionValue !== "") {
                    return fieldValue?.includes(conditionValue);
                  }
                  else {
                    return true;
                  }
                }
              }
            default:
              return true;
          }
        });

        setitems(filteredItems);
      } else {

        setitems(tempItems);
      }
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
    // getdataFromApi()
    // setTableShow(true)
    // ProductLimitation()
  }, [page, filter])

  useEffect(() => {
    getdataFromApi()
  }, [filter])

  useEffect(() => {
    setTableShow(true)
  }, [items])

  useEffect(() => {
    dynamicDropdownload()
  }, [screen, Mrkapp_id])

  useEffect(() => {
    setitems([])
    setpageinfo({
      title: getTitle(currentPath.pathname),
      Headers: colHeaders
    })
    getdataFromApi()
    // ProductLimitation()
    // setTableShow(true)
  }, [colHeaders, rowsPerPage])

  useEffect(() => {
    console.log(pageinfo);
    setTableShow(true)
  }, [pageinfo])

  let lazyDataApi = async (childmodel, parentmodel, parentvalue) => {
    console.log(childmodel);
    if (screen != "attributes") {
      await dynamicDropdownload(childmodel, parentvalue)
    }
    else {
      changeTypeFld(childmodel, parentvalue)
    }
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

  const dynamicDropdownload = async (model, value) => {

    if (model == undefined) {

      if ("product" === screen) {
        loadCategories()
        loadStates()
        // loadCities()
        loadBrands()
        loadAttrGrps()
      }
      if ("brand" === screen) {
        loadCategories()
      }
      if ("teams" === screen) {
        loadMarkerPlaces()
      }
      if ("attributes_group" === screen) {
        loadCategories()
      }
      if ("attributes" === screen) {
        loadAttrGrps()
      }
      // if (["product", "category", "crm_status", "crm_disposition"].includes(screen)) {
      // }
      // if (screen === "assign") {
      //   loadUsers()
      // }
    }
    if (model == 'prod_attr_val') {
      let attrReq = {
        attr_id: { $eq: value },
        active: { $eq: 'Y' }
      }
      let fetch = await fetchProxy(attrReq, "attributes", [], null)
      if (fetch.records.length > 0) {
        let values = []
        if (fetch.cursor.totalRecords > 0) {
          values = fetch.records.map((elm) => {
            return {
              id: elm.id.toString(), name: elm.attr_value, value: elm.id.toString()
            }
          })
        }
        dispatch(setdata({ [model]: values }))
      }
      // await ServiceProxy.business.find('b2b', 'attributes', 'view', {
      // }, [], 1, null).then((res) => {
      //   let values = []
      //   if (res.cursor.totalRecords > 0) {
      //     values = res.records.map((elm) => {
      //       return {
      //         id: elm.id.toString(), name: elm.attr_value, value: elm.id.toString()
      //       }
      //     })

      //   }
      //   dispatch(setdata({ [model]: values }))
      // })
    }
    console.log(value);
    if (model == 'city' && value != undefined) {
      console.log(value);
      loadCities(model, value)
    }
    console.log(model);
    if (model == 'tags') {
      console.log(allCategory);
      console.log(value);
      let filteredData = allCategory.filter((item) => item.id === +value)
      console.log(filteredData);
      let values = []
      values = filteredData.length > 0 ? filteredData[0].tags : []
      console.log(values);

      dispatch(setdata({ [model]: values }))
    }

  }

  const loadMarkerPlaces = async () => {
    let marketReq = {
      is_default: {
        "$eq": "N"
      }, is_active: {
        "$eq": "Y"
      }, show_on_market: {
        "$eq": "Y"
      }, account_id: {
        "$eq": getToken().account_id
      }
    }
    let mFetch = await fetchProxy(marketReq, "market_place", [], null)
    if (mFetch.records.length > 0) {
      setfieldDyanamicBind((set) => {
        set.app_id = mFetch.records.map((elm) => {
          return { id: +elm.app_id, name: elm.label, value: elm.app_id }
        })
        return set;
      });
    }
    // ServiceProxy.business.find('b2b', 'market_place', 'view',)
    //   .then((res) => {
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   })
  }

  const loadAttrGrps = async () => {
    let aGrpFilt = { account_id: { $eq: getToken().account_id } }
    if (screen == "attributes") {
      aGrpFilt = {
        account_id: { $eq: getToken().account_id },
        app_id: {
          "$eq": +Mrkapp_id
        },
        is_active: {
          "$eq": "Y"
        }
      }
    }
    let attrGrpetch = await fetchProxy(aGrpFilt, "attributes_group", [], null)
    if (attrGrpetch.records.length > 0) {
      setAllAttrGrp(attrGrpetch.records)
      attrGrpetch.records.map((item) => {
        if (item) {
          item.attr_id = item;
        }
        // setCategories(item.sub_category.items)
        setfieldDyanamicBind((set) => {
          set.attr_id = attrGrpetch.records.map((elm) => {
            return { id: elm.id, name: elm.name, value: elm.id, field: elm.field }
          })
          setAllAttr(set.attr_id)
          return set
        })
      })
    }
    // ServiceProxy.business.find('b2b', 'attributes_group', 'view', aGrpFilt, [], 1, null
    // )
    //   .then((res) => {
    //     // fetAllTemplates()
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   })
  }

  const loadBrands = async () => {


    let brandFetch = await fetchProxy({
      account_id: { $eq: getToken().account_id },
      app_id: {
        "$eq": +Mrkapp_id
      },
      is_active: { $eq: "Y" }
    }, 'brand', [], null, null, null, sort)
    if (brandFetch.records.length > 0) {
      brandFetch.records.map((item) => {
        if (item) {
          item.brand = item;
        }
        // setCategories(item.sub_category.items)
        setfieldDyanamicBind((set) => {
          set.brand = brandFetch.records.map((elm) => {
            return { id: elm.id, name: elm.brand_name, value: elm.id }
          })
          return set
        })
      })
    }
    // ServiceProxy.business.find('b2b', 'brand', 'view', {
    // }, [], 1, null
    // )
    //   .then((res) => {
    //     // fetAllTemplates()
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   })
  }

  const loadUsers = async () => {
    let usersFetch = await fetchProxy({
      active: { $eq: 'Y' },
      partner_id: { $eq: getToken().partner_id },
      roles: { $eq: 'Employee' }
    }, 'user', [], null, null, null, sort)

    if (usersFetch.records.length > 0) {
      usersFetch.records.map((item) => {
        if (item) {
          item.user = item;
        }
        setUsers(usersFetch.records)
        setfieldDyanamicBind((set) => {
          set.user_id = usersFetch.records.map((elm) => {
            return { id: elm.id, name: `${elm.first_name}${elm.last_name}`, value: elm.id }
          })
          return set
        })
      })
    }
    // ServiceProxy.business.find('b2b', 'user', 'view', , [], 1, null)
    //   .then((res) => {

    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   })
  }

  const loadCities = async (model, valuedata) => {
    let cityFetch = await fetchProxy({
      account_id: { "$eq": getToken().account_id },
      is_active: { $eq: "Y" },
      state_code: { $eq: valuedata }
    }, 'location_city', [], null, null, null, sort)
    let values = []
    if (cityFetch.records.length > 0) {
      values = cityFetch.records.map((elm) => {
        return {
          id: elm.city_code, name: elm.city_name, value: elm.city_code
        }
      })
      dispatch(setdata({ [model]: values }))
    } else {
      dispatch(setdata({ [model]: [] }))

    }
    // ServiceProxy.business.find('b2b', 'location_city', 'view', {
    //   state_code: { $eq: value }
    // }, [], 1, 10000).then((res) => {
    //   console.log(res);
    //   // fetAllTemplates()
    // })
    //   .catch((err) => {
    //     console.error(err);
    //   })
  }

  const loadStates = async () => {
    let stateFetch = await fetchProxy({
      account_id: { "$eq": getToken().account_id }, is_active: { $eq: "Y" }
    }, 'location_state', [], null, null, null, [])
    if (stateFetch.records.length > 0) {
      stateFetch.records.map((item) => {
        if (item) {
          item.state = item;
        }
        // setCategories(item.sub_category.items)
        setfieldDyanamicBind((set) => {
          set.state = stateFetch.records.map((elm) => {
            return { id: elm.state_code, name: elm.state_name, value: elm.state_code }
          })
          return set
        })
      })
    }
    // ServiceProxy.business.find('b2b', 'location_state', 'view', {
    // }, [], 1, null
    // )
    //   .then((res) => {

    //     // fetAllTemplates()
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   })
  }

  const loadCategories = async () => {

    let catgFetch = await fetchProxy({
      app_id: {
        "$eq": +Mrkapp_id
      },
      account_id: { $eq: getToken().account_id },
      is_active: { $eq: "Y" }
    }, 'category_new', [], null, null, null, [])
    if (catgFetch.records.length > 0) {
      catgFetch.records.map((item) => {

        if (item.details) {
          item.details = JSON.parse(item.details);
        }
        setfieldDyanamicBind((set) => {
          set.sub_category_id = catgFetch.records.map((elm) => {
            return { id: +elm.id, name: elm.name, value: elm.id, tags: elm.details.tags }
          })
          set.category_id = catgFetch.records.map((elm) => {
            return { id: +elm.id, name: elm.name, value: elm.id, tags: elm.details.tags }
          })
          setAllCategory(set.category_id);
          return set;
        });
      })
    }
    // ServiceProxy.business.find('b2b', 'category_new', 'view', {
    //   app_id: {
    //     "$eq": +Mrkapp_id
    //   }
    // })
    //   .then((res) => {

    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   })
  }

  const GetInvoice = async (ids) => {
    let fetch = await ServiceProxy.business.find(
      'b2b',
      "invoice",
      'view',
      { id: { $in: ids }, partner_id: { $eq: getToken().partner_id }, account_id: { $eq: getToken().account_id } },
      [], null, null
    )

    if (fetch.records.length > 0) {
      return fetch.records
    } else {
      return []
    }
  }

  const categoryGet = async (ids) => {
    let fetch = await ServiceProxy.business.find(
      'b2b',
      "category_new",
      'view',
      { id: { $in: [ids] }, account_id: { $eq: getToken().account_id }, is_active: { $eq: "Y" } },
      [], null, null
    )

    if (fetch.records.length > 0) {
      return fetch.records
    } else {
      return []
    }
  }

  const discount = (offerPercents, originalValue, tax, quantity) => {
    const offerPercent = parseInt(offerPercents);
    const originalPrice = parseInt(originalValue);
    const gstPercent = parseInt(tax);
    const qty = parseInt(quantity);

    // Calculate discount value
    const discountValue = Math.round((offerPercent / 100) * originalPrice);

    // Calculate discounted price per item
    let discountedPricePerItem = originalPrice - discountValue;

    // Ensure discounted price per item is not negative (make the product free)
    discountedPricePerItem = Math.max(discountedPricePerItem, 0);

    // Calculate GST amount per item
    const gstAmountPerItem = discountedPricePerItem > 0 ? Math.round((discountedPricePerItem * (gstPercent / 100))) : 0;

    // Calculate total discounted price
    const totalDiscountedPrice = discountedPricePerItem * qty;

    // Calculate total GST amount
    const totalGstAmount = gstAmountPerItem * qty;

    // Object to store the results
    const resultObject = {
      gst: {
        gstPercent: gstPercent,
        gstAmountPerItem: gstAmountPerItem,
        totalGstAmount: totalGstAmount
      },
      product: {
        originalPrice: originalPrice,
        "offerPercent%": offerPercent,
        discountedPricePerProduct: discountedPricePerItem,
        totalDiscountedPriceWithoutTax: totalDiscountedPrice,
        totalDiscountedPriceWithTax: totalDiscountedPrice + totalGstAmount,
        quantity: qty,
      },


    };

    // If you need the final price, you can calculate it as:
    resultObject.finalPrice = totalDiscountedPrice + totalGstAmount;
    console.log(resultObject, "rrrrrrrrrrrrr88888888888888rrrrrrrrrrrrrrrrr")
    // Display the results as an object
    return resultObject;
  }


  const viewmoredetails = async (e) => {
    let invoice_ids
    console.log(e, "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
    if (e.hasOwnProperty('teams')) {
      invoice_ids = { ids: [e.id] }
    } else if (e.hasOwnProperty('work_status')) {
      invoice_ids = { ids: [e.invoice_id] }
    } else {
      invoice_ids = JSON.parse(e.invoice_id)
    }

    let invoiceData = await GetInvoice(invoice_ids.ids)
    let invoiceDetails = []
    let totalvalue = {
      totalprice: 0,
      discountedprice: 0,
      totaltax: 0
    }
    for (let i = 0; i < invoiceData.length; i++) {
      const element = invoiceData[i];

      element.address_info = JSON.parse(element.address_info)
      element.product_details = JSON.parse(element.product_details)
      element.product_details.details = JSON.parse(element.product_details.details)
      let cat_id = element.product_details.sub_category_id
      let tax_percentage = await categoryGet(cat_id)
      let tax = JSON.parse(tax_percentage[0]?.tax_details)


      element.pricecalculation = await discount(element.product_details.details.offer_percent, element.product_details.details.price, tax.gst, element?.product_details?.quantity)
      totalvalue = {
        totalprice: ((element.pricecalculation.product.originalPrice) * element.pricecalculation.product.quantity) + totalvalue.totalprice,
        discountedprice: (element.pricecalculation.product.totalDiscountedPriceWithoutTax + totalvalue.discountedprice),
        totaltax: (element.pricecalculation.gst.totalGstAmount + totalvalue.totaltax),
        deliverycharges: e.delivery_charges,

      }
      totalvalue["grandtotal"] = (totalvalue.discountedprice + totalvalue.totaltax + parseInt(totalvalue.deliverycharges))
      invoiceDetails.push(element)
    }
    let orderpayload

    if (e.hasOwnProperty('teams') || e.hasOwnProperty('work_status')) {
      let fetch = await ServiceProxy.business.find(
        'b2b', "order_detail",
        'view',
        { id: { $eq: e.order_id } },
        [],

      )
      orderpayload = { "order_details": fetch.records[0], "products": invoiceDetails }
    } else {
      e.billdetails = totalvalue
      orderpayload = { "order_details": e, "products": invoiceDetails }
    }

    setorderdetail([orderpayload])
  }

  let getdataFromApi = async () => {
    let ispresent = false
    setTableShow(false)

    try {
      let reqFilter
      let associated

      if (screen == "category") {
        reqFilter = {
          app_id: {
            "$eq": +Mrkapp_id
          },
          is_active: {
            "$eq": "Y"
          },
          ...filter
        }
      }
      else if (screen == "product") {
        reqFilter =
        {
          category_id: {
            "$eq": +Mrkapp_id
          },
          partner_id: {
            "$eq": getToken().partner_id
          },
          is_active: {
            "$eq": "Y"
          },
          ...filter
        }
        associated = [
          {
            "model": "location_city",
            "bindAs": {
              "name": "city",
              "value": "city_name"
            },
            "key": {
              "foreign": "details.city",
              "primary": "city_code",
              "rules": { account_id: getToken().account_id }
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
              "primary": "state_code",
              "rules": { account_id: getToken().account_id }
            },
            "fields": [
              "state_name"
            ]
          }, {
            "model": "category_new",
            "bindAs": {
              "name": "sub_category_id",
              "value": "name"
            },
            "key": {
              "foreign": "sub_category_id",
              "primary": "id"
            },
            "fields": [
              "name"
            ]
          }]
        setbind_topayload(associated)
      }
      else if (screen == "brand") {
        reqFilter =
        {
          app_id: {
            "$eq": +Mrkapp_id
          },
          account_id: {
            "$eq": getToken().account_id
          },
          is_active: {
            "$eq": "Y"
          },
          ...filter
        }
        associated = [
          {
            "model": "category_new",
            "bindAs": {
              "name": "category_id",
              "value": "name"
            },
            "key": {
              "foreign": "category_id",
              "primary": "id"
            },
            "fields": [
              "name"
            ]
          }]
        setbind_topayload(associated)
      }
      else if (screen == "attributes_group") {
        reqFilter =
        {
          app_id: {
            "$eq": +Mrkapp_id
          },
          account_id: {
            "$eq": getToken().account_id || "0"
          },
          is_active: {
            "$eq": "Y"
          },
          ...filter
        }
        associated = [{
          "model": "category_new",
          "bindAs": {
            "name": "category_id",
            "value": "name"
          },
          "key": {
            "foreign": "category_id",
            "primary": "id"
          },
          "fields": [
            "name"
          ]
        }]
        setbind_topayload(associated)
      }
      else if (screen == "teams") {
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuu")
        reqFilter =
        {
          account_id: {
            "$eq": getToken().account_id || "0"
          },
          partner_id: {
            "$eq": getToken().partner_id
          },
          is_active: {
            "$eq": "Y"
          },
          ...filter
        }
        associated = [
          {
            "model": "market_place",
            "bindAs": {
              "name": "app_id",
              "value": "label"
            },
            "key": {
              "foreign": "app_id",
              "primary": "app_id"
            },
            "fields": [

            ]
          }]
        setbind_topayload(associated)
      }
      else if (screen == "attributes") {
        reqFilter =
        {
          app_id: {
            "$eq": +Mrkapp_id
          },
          // partner_id: {
          //   "$eq": getToken().partner_id || "0"
          // },
          is_active: {
            "$eq": "Y"
          },
          ...filter
        }
        associated = [
          {
            "model": "attributes_group",
            "bindAs": {
              "name": "attr_id",
              "value": "name"
            },
            "key": {
              "foreign": "attr_id",
              "primary": "id"
            },
            "fields": [

            ]
          },]
        setbind_topayload(associated)
      }
      // else if (screen == "lead_tracking") {
      //   reqFilter =
      //   {
      //     category_id: {
      //       "$eq": +Mrkapp_id
      //     },
      //     partner_id: {
      //       "$eq": getToken().partner_id
      //     },
      //     ...filter
      //   }
      // }
      else if (screen == "crm_status") {
        reqFilter =
        {
          account_id: {
            "$eq": getToken().account_id
          },
          module: {
            "$eq": "lead_status"
          },
          "is_active": {
            "$eq": "Y"
          },
          ...filter
        }
      }
      else if (screen == "crm_disposition") {
        reqFilter =
        {
          account_id: {
            "$eq": getToken().account_id
          },
          module: {
            "$eq": "disposition"
          },
          "is_active": {
            "$eq": "Y"
          },
          ...filter
        }
      }
      else if (screen == "orders" || screen === "taskbacklog" || screen == 'task') {

        reqFilter =
        {
          // partner_id: {
          //   "$.partner_id": getToken().partner_id
          // },
          account_id: {
            "$eq": getToken().account_id
          },

          ...filter
        }
        if (screen === "taskbacklog" || screen == 'task') {
          let roles = getToken().roles
          console.log(roles, "emp_groupemp_group")

          if (roles === "Employee" && screen === "taskbacklog") {
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
              setemployee(employee_)
              for (let i = 0; i < teamleader.team_leader.length; i++) {
                if (getToken().id === teamleader.team_leader[i]) {
                  ispresent = true
                }
              }
              if (ispresent && screen === "task") {
                reqFilter.teams = { $eq: emp_group.records[0].teams }
              }

            } else {
              setemployee([])
            }
          } else if (roles === "Employee" && screen === "task") {
            reqFilter.user = { "$.user": getToken().id }
          }
        }
        if (!screen === "task") {
          associated = [
            {
              "model": "teams",
              "bindAs": {
                "name": "teams",
                "value": "name"
              },
              "key": {
                "foreign": "teams",
                "primary": "id"
              },
              "fields": [
                "name"
              ]
            }]
        } else {
          associated = [
            {
              model: 'user',
              bindAs: {
                name: 'user',
                value: 'first_name',
              },
              key: {
                foreign: 'user.user',
                primary: 'id',
              },
              fields: ['first_name'],
            }]
        }

        setbind_topayload(associated)
      }
      else {
        reqFilter = { ...filter }
      }

      let fetch = await fetchProxy(reqFilter, screen === "task" ? "task_log" :
        screen == "taskbacklog" ? "invoice" : screen == "category" ? "category_new" : ["orders"].includes(screen) ? "order_detail" :
          screen == "crm_disposition" ? "crm_status" : screen, [], associated, page, rowsPerPage, sort)

      // let fetch = await ServiceProxy.business.find(
      //   'b2b', screen === "task" ? "task_log" :
      //   screen == "taskbacklog" ? "invoice" : screen == "category" ? "category_new" : ["orders"].includes(screen) ? "order_detail" :
      //     screen == "crm_disposition" ? "crm_status" : screen,
      //   'view',
      //   reqFilter,
      //   [],
      //   screen != "category" ? page : 1,
      //   rowsPerPage,
      //   sort, associated
      // )

      // let fetch = await ServiceProxy.business.find(
      //   'b2b',
      //   screen == "category" ? "category_new" : ["assign", "lead_tracking"].includes(screen) ? "invoice" :
      //     screen == "crm_disposition" ? "crm_status" : screen,
      //   'view',
      //   reqFilter,
      //   [],
      //   screen != "category" ? page : 1,
      //   rowsPerPage,
      //   sort, associated
      // )

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
          if (item.tax_details) {
            item.tax_details = JSON.parse(item.tax_details);
          }
          return item
        })
        console.log(dataArray);
        setitems(dataArray)
      }
      else {
        console.log("nodata")
        setitems([])
      }

      if (screen != "category") {
        setcount(fetch.cursor.totalRecords)
      }

    } catch (error) {
      console.error(error)
    }
  }

  // const loadAssignDataGrid = async (dataArray, fetch) => {

  //   try {
  //     const invIDs = [...new Set(fetch.records.filter(item => item.id).map(item => item.id))];
  //     // const invIDs = [fetch.records.filter(item => item.id).map(item => item.id)];
  //     const userRecords = await getInvoiceOd(invIDs);

  //     const lastOccurrenceIndexes = {};
  //     userRecords.status.forEach((invoice, index) => {
  //       const { invoice_id } = invoice;
  //       lastOccurrenceIndexes[invoice_id] = index;
  //     });

  //     const resultArray = Object.values(lastOccurrenceIndexes).map((index) => userRecords.status[index]);

  //     resultArray.forEach((invoice, index) => {
  //       const { invoice_id } = invoice;
  //       lastOccurrenceIndexes[invoice_id] = index;
  //     });

  //     const userIDs = resultArray.map((invoice) => userRecords.users.find((user) => user.invoice_id === invoice.invoice_id) || "");
  //     const filteredUsers = userIDs.map((userID) => {
  //       const user = (users && users).find((u) => u.id === userID.user_id);
  //       return user ? { user_id: user.id, user_name: user.first_name + " " + user.last_name, invoice_id: userID.invoice_id } : "";
  //     });

  //     const nonEmptyFilteredUsers = filteredUsers.filter(user => typeof user === 'object' && user !== null);

  //     const updatedDataArray = fetch.records.map(item => {
  //       if (item.id && item.user_id) {
  //         const matchedUser = nonEmptyFilteredUsers.find(user => +user.invoice_id === item.id);
  //         const matchedSts = resultArray.find(inv => +inv.invoice_id === item.id)
  //         item.user_id = matchedUser ? matchedUser.user_name : ""
  //         item.user_name = matchedUser ? matchedUser.user_id : ""
  //         item.status = matchedSts ? matchedSts.status : ""
  //       }
  //       if (item.product_details) {
  //         item.product_details = JSON.parse(item.product_details);
  //         if (item.product_details.details) {
  //           item.product_details.details = JSON.parse(item.product_details.details);
  //         }
  //       }

  //       if (item.address_info) {
  //         item.address_info = JSON.parse(item.address_info);
  //       }
  //       return item;
  //     });

  //     return updatedDataArray;

  //   } catch (error) {
  //     console.error(error);
  //     return dataArray;
  //   }
  // };
  // need
  const handlePageChange = (value) => {
    setPage(value + 1);
  }
  // need
  const handleRowsPerPageChange = (event, value) => {
    setRowsPerPage(event);
  }


  let fetAllTemplates = async () => {
    setTableShow(false)
    console.log(Mrkapp_id);
    try {
      const screenMappings = {
        product: ["PROD_CU", "PROD_ATTR_CU", "SERV_CU"],
        category: ["PROD_CAT"],
        brand: ["BRAND_CU"],
        teams: ["TEAMS"],
        attributes_group: ["ATTR_GRP_CU"],
        attributes: ["ATTR_CU"],
        crm_status: ["CRM_STATUS_CU"],
        crm_disposition: ["CRM_STATUS_CU"],
        orders: ["ORDER"],
        taskbacklog: ["INVOICE"],
        task: ["TASK"]
      };
      
      let callTemp = screenMappings[screen] || [];

      let template = await fetchProxy({ name: { "$in": callTemp }, }, 'template', [], null, 1, 100, sort)
      if (template.records.length > 0) {
        let sort = [{
          column: "position",
          order: 'asc'
        }]
        template.records.forEach(async (elm) => {
          let templatefields = await ServiceProxy.business.find('b2b', 'templates_field', 'view', { template_id: { $eq: elm.id.toString() }, account_id: { $eq: getToken().account_id }, app_id: { "$.app_id": Mrkapp_id } }, [], null, null, sort )

          if (templatefields.cursor.totalRecords > 0) {
            if (screen == "product") {

              if (elm.name == 'PROD_CU') {

                const {partner_id, roles} = getToken()
                const type = partner_id === null ? (roles !== 'Client' ? 'Brand' : '') : 'Partner';

                const filtTempData = templatefields.records
                CustomFieldhandel(filtTempData, fieldDyanamicBind, type)
                  .then((res) => {
                    settemplatefilter({ template: elm, fields: res.field })
                  })
                console.log(templatefields);
                CustomFieldhandel(filtTempData, fieldDyanamicBind, {}, type)
                  .then((res) => {
                    setTemplateApiFlds({ template: elm, fields: res.field, skipped: [], })
                    console.log(res);
                    let header = res.header.map((h) => ({ ...h, value: h.value == "sub_category_id" ? h.value : `details.${h.value}` }))

                    header.push({
                      filterable: false,
                      title: "Actions",
                      checkbox: true,
                      avatar: false,
                      sort: false,
                      value: "actions",
                      actionValue: [
                        { name: "Edit", value: 'edit' },
                        { name: "Delete", value: 'delete' },
                        { name: "Attributes", value: 'add_attr' },
                      ]
                    })
                    setColHeaders(header)
                    setTableShow(true)
                  })
              }
              if (elm.name == 'SERV_CU') {
                CustomFieldhandel(templatefields.records, fieldDyanamicBind, {},
                  getToken().partner_id === null && getToken().roles !== 'Client' ? 'Brand' : getToken().partner_id !== null ? 'Partner' : '')
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
                        value: item.value == "id" || item.value == "created_at" ? item.value : `details.${item.value}`
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
                        { name: "Delete", value: 'delete' },
                        { name: "Attributes", value: 'add_attr' },
                      ]
                    })
                    setColHeaders(header)
                  })


                CustomFieldhandel(templatefields.records, fieldDyanamicBind, getToken().partner_id === null && getToken().roles !== 'Client' ? 'Brand' : getToken().partner_id !== null ? 'Partner' : '')
                  .then((res) => {

                    settemplatefilter({
                      template: elm,
                      fields: res.field
                    })
                  })

                // setpageinfo({
                //   title: getTitle(currentPath.pathname),
                //   Headers: header
                // })
              }
            }
          }
          if (screen == "category") {

            if (elm.name == "PROD_CAT") {
              console.log(templatefields);
              CustomFieldhandel(templatefields.records, fieldDyanamicBind)
                .then((res) => {
                  console.log(res);

                  setTemplateApiFlds({
                    template: elm,
                    fields: res.field,
                    skipped: []
                  })
                  let tableFlds = res.header
                  let header = tableFlds.map((item) => {
                    return {
                      ...item,
                      value: (item.value === "tax" ? `tax_details.gst` :
                        item.value === "tags" ? `details.${item.value}` :
                          item.value)
                    }
                  })
                  console.log(header);

                  header.push({
                    filterable: false,
                    title: "Actions",
                    checkbox: true,
                    avatar: false,
                    sort: false,
                    value: "actions",
                    actionValue: [
                      { name: "Edit", value: 'edit' },
                      { name: "Delete", value: 'delete' },
                    ]
                  })
                  setColHeaders(header)
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
          if (["orders", "taskbacklog", "task"].includes(screen)) {
            CustomFieldhandel(templatefields.records)
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
                    value: `${item.value}`
                  }
                })
                header.push({
                  filterable: false,
                  title: "Actions",
                  checkbox: true,
                  avatar: false,
                  sort: false,
                  value: "actions",
                  actionValue: screen === "task" ? [{ name: "Task Status", value: 'status' }, { name: "View More", value: 'viewmore' }] : screen === "orders" ? [
                    { name: "View More", value: 'viewmore' },

                  ] : [
                    { name: "Assign User", value: 'assign' }, { name: "View More", value: 'viewmore' },

                  ]
                })
                setColHeaders(header)
              })
            CustomFieldhandel(templatefields.records, fieldDyanamicBind, getToken().partner_id === null && getToken().roles !== 'Client' ? 'Brand' : getToken().partner_id !== null ? 'Partner' : '')
              .then((res) => {

                settemplatefilter({
                  template: elm,
                  fields: res.field
                })
              })
          }
          if (!["category", "product", "orders", "taskbacklog", "task"].includes(screen)) {
            CustomFieldhandel(templatefields.records)
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
                    value: `${item.value}`
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
                    { name: "Delete", value: 'delete' },
                  ]
                })
                setColHeaders(header)
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
        )
      }

    } catch (error) {
      console.error(error)
    }
  }

  const handleSubFormSubmit = (subData) => {

    let obj = {
      id: (selectedData && selectedData.hasOwnProperty("id")) ? selectedData.id.toString() : "0",
      category_id: +Mrkapp_id,
      account_id: getToken().account_id,
      partner_id: getToken().partner_id,
      sub_category_id: (selectedData && Object.keys(selectedData).length > 0 && selectedData.sub_category_id) ? selectedData.sub_category_name.toString() : "",
      is_active: selectedData.is_active || "Y",
      details: {
        ...selectedData.details,
        attributes: subData
      },
      additional_info: {
      }
    }
    apiCall(mode.UPDATE, obj, {}, {})
  }

  // need
  const tableActions = {
    edit: (e) => {

      console.log(e);
      if (screen === "category") {
        if (e.details && e.details != null && e.details.icon && e.details.icon.length > 0) {
          setTemplateFlds((set) => {
            templateApiFlds.fields.forEach((elm) => {
              elm.fields.forEach((elem) => {
                if (elem.model == "image") {
                  elem.disabled = 'Y'
                }
                console.log(e);
                if (e.tax_details && typeof (e.tax_details) == "string") {
                  e.tax_details = JSON.parse(e.tax_details)
                }
              })
            })
            return {
              ...templateApiFlds,
              initialValues: {
                ...e,
                tags: e.details?.tags,
                tax: e.tax_details?.gst,
                image: e.details?.icon
              },
              action: mode.UPDATE,
              skipped: [],
              lazyDataApi: lazyDataApi
            }
          })
        }
      }
      else {
        if (e && screen == "product") {
          e.details.sub_category_id = +e.sub_category_id
        }
        if (e && e.id && e.details) {
          e.details.id = e.id
        }
        if (screen !== "category") {
          console.log(e);
          setTemplateFlds((set) => {
            templateApiFlds.fields.forEach((elm) => {
            })
            return {
              ...templateApiFlds,
              initialValues: {
                ...e.details || e,
                tags: e.details?.tags,
              },
              action: mode.UPDATE,
              skipped: [],
              lazyDataApi: lazyDataApi
            }
          })
          setSelectedData(e)
        }
      }
      setDrawerOpen(true)

    },
    delete: (e, n) => {
      setid(e.id)
      setSingle_data(e)
      setOpenDialog(true)
    },
    addAttr: (e) => {
      if (e) {
        if (e?.details?.hasOwnProperty("attributes")) {

          setSubEditData(e?.details?.attributes)
        }
        else {
          setSubEditData([])
        }
      }
      setSelectedData(e)
      fetchAttrPopValues(e)


      // fetchAttrPop()
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
    },
    assign: async (e) => {
      setTimeout(() => {
        viewmoredetails(e)
      }, 1000);
      settaskpage(true);

    },
    viewmore: async (e) => {
      setTimeout(() => {
        viewmoredetails(e)
      }, 1000);
      if (screen === "task") {
        settaskdetail(e)
        settaskpage(true);
      } else {
        settaskpage(false);
      }
    },
    status: (e) => {
      setTemplateFlds((set) => {
        let a = templateApiFlds.fields.map((elm) => {
          elm.fields = elm.fields.filter((elem) => {
            if (elem.model == "work_status") {
              return elem;
            }
          });
          return elm; // Return the modified element
        });
        console.log(a, "eeeeeeeeeeeeeeawefse", templateApiFlds);

        return {
          ...templateApiFlds,
          initialValues: e,
          action: mode.UPDATE,
          skipped: [],
          lazyDataApi: lazyDataApi
        }
      })

      setSelectedData(e)
      setDrawerOpen(true)
    },
  }


  const fetchAttrPopValues = async (e) => {
    let attrProps = await fetchProxy({
      is_active: "Y", app_id: { $eq: e.category_id }, category_id: { $eq: e.sub_category_id },
      account_id: { $eq: getToken().account_id }
    }, 'attributes_group', [], null, null, null, sort)
    if (attrProps.records.length > 0) {
      if (attrProps.cursor.totalRecords > 0) {
        let attributeGroup__ = attrProps.records.map((elm) => {
          return { label: elm.name, value: elm.id, data: elm }
        })
        setattributeGroup(attributeGroup__)
        setAttrDrawerOpen(true)
      }
    }
    // await ServiceProxy.business.find('b2b', 'attributes_group', 'view',
    //   {
    //     is_active: "Y", app_id: { $eq: e.category_id }, category_id: { $eq: e.sub_category_id },
    //     account_id: { $eq: getToken().account_id }
    //   }, [], null, null).then((res) => {

    //     // fetchAttrPop()
    //   })
  }

  const getInvoiceOd = async (arrInvIds) => {

    const invoiceData = await ServiceProxy.business.find('b2b', 'task_log', 'view', {
      invoice_id: {
        "$in": arrInvIds
      }
    })
    const orderTrackData = await ServiceProxy.business.find('b2b', 'order_track', 'view', {
      invoice_id: {
        "$in": arrInvIds
      }
    })
    let formEdit = {
      users: invoiceData.records.length > 0 ? invoiceData.records : [],
      status: orderTrackData.records.length > 0 ? orderTrackData.records : []
    }
    return formEdit
  }

  // need
  const deleteSelectedData = () => {
    action__(id, mode.DELETE, Single_data)
  }

  let Openpopup = () => {

    if (screen == "product" && productLimit == 0 && ispro_limit) {
      setSnackProps({
        snackOpen: true,
        severity: "error",
        message: `Product Add Limit Reached`
      })
    } else {
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

  }

  const handleFileUpload = async (name, e, deletedfiles) => {
    let existfiles = selectedData.details


    if (existfiles === undefined || existfiles.image === undefined) {
      if (screen == "category") {

        if (e.length == 0) {

          setTemplateFlds((set) => {
            templateFlds.fields.forEach((elm) => {
              elm.fields.forEach((elem) => {
                if (elem.model == "image") {
                  elem.disabled = false
                }
              })
            })
            return templateFlds
          })
        }
        else {
          setTemplateFlds((set) => {
            templateFlds.fields.forEach((elm) => {
              elm.fields.forEach((elem) => {
                if (elem.model == "image") {
                  elem.disabled = 'Y'
                }
              })
            })
            return templateFlds
          })
          setstorefile(e)
          let merge = Removestorefile.concat(deletedfiles)
          setRemovestorefile(merge)
        }
      }
      if (screen == "product") {

        if (e.length > 5) {
          setTemplateFlds((set) => {
            templateFlds.fields.forEach((elm) => {
              elm.fields.forEach((elem) => {
                if (elem.model == "image") {
                  elem.disabled = "Y"
                }
              })
            })
            return templateFlds
          })
          setSnackProps({
            snackOpen: true,
            severity: "warning",
            message: SnackMess.UPLOAD_LIMIT_5
          })
          return
        }
        else if (e.length <= 5) {
          if (e.length < 5) {
            setTemplateFlds((set) => {
              templateFlds.fields.forEach((elm) => {
                elm.fields.forEach((elem) => {
                  if (elem.model == "image") {
                    elem.disabled = false
                  }
                })
              })
              return templateFlds
            })
          }
          else {
            setTemplateFlds((set) => {
              templateFlds.fields.forEach((elm) => {
                elm.fields.forEach((elem) => {
                  if (elem.model == "image") {
                    elem.disabled = "Y"
                  }
                })
              })
              return templateFlds
            })

          }
          setstorefile(e)
          let merge = Removestorefile.concat(deletedfiles)
          setRemovestorefile(merge)
        }

      }
      else {
        setstorefile(e)
        let merge = Removestorefile.concat(deletedfiles)
        setRemovestorefile(merge)
      }
    }
    else {
      let arr = []
      let deletearr = []
      for (let i = 0; i < e.length; i++) {
        const element = e[i];
        let count = 0
        for (let j = 0; j < existfiles.image.length; j++) {
          const element1 = existfiles.image[j];
          if (element.path === element1.path) {
            count += 1
            deletearr.push(element)
          }
        }
        if (count === 0) {
          arr.push(element)
        }
      }
      let merge = Removestorefile.concat(deletedfiles)
      setRemovestorefile(merge)
      setstorefile(arr)
    }
  }

  const checkIfProdAssign = async (data) => {
    let taskLogs = await ServiceProxy.business
      .find('b2b', 'task_log', 'view', {
        invoice_id: {
          "$in": [data.id]
        }
      })
    return taskLogs.records.length > 0 ? "update" : "create"
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

  let action__ = async (data, typeMode, filedata) => {
    console.log(data, typeMode, filedata, "iiiiiiiiiiiii", Removestorefile)
    // if (screen == "product" || screen == 'category') {if (typeMode == mode.CREATE) {

    if (typeMode == mode.CREATE) {
      if (screen == "product" && ispro_limit) {
        await UpdateAccount(mode.CREATE)
      }
      console.log(data);
      if (screen == "product" || screen == "category") {
        if (storefile.length > 0) {
          let fileUpload = await uploadfile()
          if (fileUpload.status == 200) {
            action(data, typeMode, fileUpload.data)
          }
        } else {
          setSnackProps({
            snackOpen: true,
            severity: "error",
            message: `Upload Atlease One Image file`
          })
        }
      }
      else {
        action(data, typeMode, {})
      }

    }
    else if (typeMode == mode.UPDATE) {
      if (screen == "product") {
        let fileUpload
        if (storefile.length > 0) {
          fileUpload = await ServiceProxy.fileUpload
            .upload(
              'b2b', screen, storefile
            )
        }
        if (Removestorefile.length > 0) {
          await deleteimage(Removestorefile)
          setRemovestorefile([])
        }

        let uniquefile = []
        for (let i = 0; i < data.image.length; i++) {
          const element = data.image[i];
          let count = 0
          for (let j = 0; j < storefile.length; j++) {
            const element1 = storefile[j];
            if (element.path === element1.path) {
              count += 1
            }
          }
          if (count === 0) {
            uniquefile.push(element)
          }

        }

        if (fileUpload !== undefined && fileUpload.status == 200) {
          action(data, typeMode, fileUpload.data.concat(uniquefile))
        } else if (storefile.length === 0) {
          action(data, typeMode, data.image)
        }
      }
      else {
        action(data, typeMode, {})
      }
    }
    else if (typeMode == mode.FILTER || typeMode == mode.RESET) {
      action(data, typeMode)
    }
    else if (mode.DELETE === typeMode) {
      action_delete(data, typeMode)
    }

  }
  let action_delete = async (data, typeMode, fileUpload) => {

    console.log("werr", typeMode);
    if (typeMode == mode.DELETE) {

      if (screen == "product") {
        if (ispro_limit) {
          await UpdateAccount(mode.DELETE)
        }
        // await deleteimage(fileUpload.details.image) //hold background script need to work
        Softdelete({
          id: data.toString(),
          is_active: 'N'
        }, screen)
          .then((res) => {
            if (res.statusCode == 200) {
              setOpenDialog(false)
              setSnackProps({
                snackOpen: true,
                severity: "success",
                message: SnackMess.U_SUCC
              })
              getdataFromApi()
              ProductLimitation()
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
      else {
        Softdelete({
          id: data.toString(),
          is_active: 'N'
        }, screen == "category" ? "category_new" : screen)
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
  }
  let action = async (data, typeMode, fileUpload) => {

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
    if (screen == "product") {
      delete data?.is_costing
      delete data?.is_verified
      console.log(data);
      obj = {
        id: (selectedData && selectedData.hasOwnProperty("id")) ? selectedData.id.toString() : "0",
        category_id: Mrkapp_id.toString(),
        account_id: getToken().account_id,
        partner_id: getToken().partner_id == null ? undefined : getToken().partner_id,
        sub_category_id: (data && Object.keys(data).length > 0 && data.sub_category_id) ? data.sub_category_id.toString() : "",
        is_active: selectedData.is_active || "Y",
        details: {
          is_costing: Mrkapp_id === 2 ? "N" : "Y",
          is_verified: "Y",
          is_attributed: data?.is_attributed != "" ? data?.is_attributed : "N",
          ...data
        },
        additional_info: {
        }
      }
      console.log(obj);
      console.log(data);
      console.log(Mrkapp_id);
    }
    else if (screen == "category") {
      obj = {
        id: data.id ? data.id : "0",
        account_id: getToken().account_id,
        name: data.name,
        description: data.description,
        tax_details: { gst: +data.tax },
        is_active: data.is_active,
        details: {
          icon: data.image,
          tags: data.tags,
        },
        app_id: Mrkapp_id.toString(),
      }

      apiCall(typeMode, obj, data, orderTrackObj)

    }
    // else if (screen == "assign") {

    //   let isCreate = await checkIfProdAssign(data)
    //   if (typeMode != mode.FILTER) {
    //     typeMode = isCreate
    //   }
    //   // costing == "Y"
    //   if (!isFilter) {

    //     obj = {
    //       id: (selectedData && selectedData.hasOwnProperty("id")) ? selectedData.id.toString() : "0",
    //       // category_id: selectedData.category_id || "1",
    //       account_id: getToken().account_id,
    //       partner_id: getToken().partner_id == null ? undefined : getToken().partner_id,
    //       user_id: data.user_id ? data.user_id.toString() : "",
    //       costing: 'Y',
    //       order_detail_id: "1",
    //       invoice_id: data.id.toString(),
    //       // product_id: data.product_id,
    //     }
    //     orderTrackObj = {
    //       order_id: data.order_id,
    //       invoice_id: data.id.toString(),
    //       status: data.status
    //     }
    //   }

    // }
    else if (screen == "brand") {
      obj = {
        id: data.id || "0",
        account_id: getToken().account_id,
        app_id: Mrkapp_id.toString(),
        category_id: data.category_id,
        brand_name: data.brand_name,
        brand_des: data.brand_des,
        brand_verify: data.brand_verify
      }
    }
    else if (screen == "attributes_group") {
      obj = {
        id: data.id || "0",
        account_id: getToken().account_id,
        app_id: Mrkapp_id.toString(),
        category_id: data.category_id,
        name: data.name,
        units: data.units || "",
        field: data.field,
      }
    }
    else if (screen == "attributes") {
      let grpUnit = allAttrGrp.filter((grp) => grp.id === +data.attr_id)[0]
      obj = {
        id: data.id || "0",
        attr_id: data.attr_id || "0",
        account_id: getToken().account_id,
        partner_id: getToken().partner_id == null ? undefined : getToken().partner_id,
        app_id: Mrkapp_id.toString(),
        category_id: grpUnit.category_id,
        attr_value: data.attr_value,
        units: grpUnit.units,
      }
    }
    else if (screen == "crm_status") {
      obj = {
        id: data.id || "0",
        account_id: getToken().account_id,
        partner_id: getToken().partner_id == null ? undefined : getToken().partner_id,
        name: data.name,
        description: data.description,
        module: "lead_status",
        is_active: data.is_active || "Y"
      }
    }
    else if (screen == "teams") {
      obj = {
        id: data.id || "0",
        account_id: getToken().account_id,
        partner_id: getToken().partner_id == null ? undefined : getToken().partner_id,
        name: data.name,
        description: data.description,
        app_id: data.app_id,
        is_active: data.is_active || "Y"
      }
    }
    else if (screen == "crm_disposition") {
      obj = {
        id: data.id || "0",
        account_id: getToken().account_id,
        partner_id: getToken().partner_id == null ? undefined : getToken().partner_id,
        name: data.name,
        description: data.description,
        module: "disposition",
        is_active: data.is_active || "Y"
      }
    }
    else if (screen === "task") {
      obj = {
        id: data.id || "0",
        account_id: getToken().account_id,
        partner_id: getToken().partner_id,
        work_status: data.work_status,
      }
    }
    if (screen != "category") {
      apiCall(typeMode, obj, data, orderTrackObj)
    }
  }

  const apiCall = async (typeMode, obj, data, orderTrack) => {
    try {

      if (typeMode == mode.CREATE) {
        if (screen != "category") {
          data.additional_info = {}
        }

        let Create = await ServiceProxy.business
          .create('b2b', orderTrack === "order_track" ? "order_track" : screen == "category" ? "category_new" :
            screen == "crm_disposition" ? "crm_status" : screen, obj)

        // let Create = await ServiceProxy.business
        //   .create('b2b', orderTrack === "order_track" ? "order_track" : screen == "category" ? "category_new" :
        //     screen == "crm_disposition" ? "crm_status" : screen, obj)


        // if (screen == "assign") {

        //   try {
        //     let CreateOrderTrack = await ServiceProxy.business
        //       .create('b2b', "order_track", orderTrack)


        //     if (CreateOrderTrack.statusCode == 201) {
        //       setSnackProps({
        //         snackOpen: true,
        //         severity: "success",
        //         message: SnackMess.C_SUCC
        //       })
        //       setDrawerOpen(false)
        //       getdataFromApi()
        //     }
        //     else {
        //       setSnackProps({
        //         snackOpen: true,
        //         severity: "error",
        //         message: `${SnackMess.ORDER_DUP}--${CreateOrderTrack.message}`
        //       })
        //     }
        //   }
        //   catch (err) {
        //     setSnackProps({
        //       snackOpen: true,
        //       severity: "error",
        //       message: `${SnackMess.ORDER_DUP}--${err.message}`
        //     })
        //     setDrawerOpen(false)
        //   }
        // }

        if (Create.statusCode == 201) {
          setSnackProps({
            snackOpen: true,
            severity: "success",
            message: SnackMess.C_SUCC
          })
          setDrawerOpen(false)
          getdataFromApi()
          ProductLimitation()

        } else if (Create?.response?.data?.statusCode == 409) {
          setSnackProps({
            snackOpen: true,
            severity: "error",
            message: "Data Already Existing"
          })
        }
      }
      else if (typeMode == mode.UPDATE) {
        delete obj.created_by
        delete obj.created_at
        delete obj.updated_by
        delete obj.updated_at
        if (screen == "category") {
          delete obj.costing
        }
        // if (screen == "assign") {

        //   try {
        //     let CreateOrderTrack = await ServiceProxy.business
        //       .create('b2b', "order_track", orderTrackObj)

        //     if (CreateOrderTrack) {

        //       if (CreateOrderTrack.statusCode == 201) {
        //         setSnackProps({
        //           snackOpen: true,
        //           severity: "success",
        //           message: SnackMess.C_SUCC
        //         })
        //         setDrawerOpen(false)
        //         getdataFromApi()
        //       }
        //       else if (CreateOrderTrack.statusCode == 409) {
        //         setSnackProps({
        //           snackOpen: true,
        //           severity: "error",
        //           message: `${SnackMess.ORDER_DUP}--${CreateOrderTrack.message}`
        //         })
        //       }
        //     }
        //     else {
        //       setSnackProps({
        //         snackOpen: true,
        //         severity: "error",
        //         message: CreateOrderTrack.message
        //       })
        //       return
        //     }
        //   }
        //   catch (err) {
        //     setSnackProps({
        //       snackOpen: true,
        //       severity: "error",
        //       message: `${SnackMess.ORDER_DUP}--${err.message}`
        //     })
        //     setDrawerOpen(false)
        //   }
        // }
        if (obj.created_at) {
          delete obj.created_at
        }
        try {

          let Update = await ServiceProxy.business
            .update('b2b',
              screen == "task" ? "task_log" :
                screen == "category" ? "category_new" :
                  screen == "crm_disposition" ? "crm_status" : screen, obj)

          //       let Update = await ServiceProxy.business
          // .update('b2b',
          // screen == "task" ? "task_log" :
          //   screen == "category" ? "category_new" :
          //     screen == "crm_disposition" ? "crm_status" : screen, obj)


          if (Update.statusCode == 200 && Update.modifiedCount != 0) {
            if (screen == "task") {
              if (obj.work_status === "completed" && selectedData.work_status !== 'completed') {

                console.log(selectedData, "rrrrrrrrrrrrr3rrrrrrrrrrrrrrrrrrrrrrr")
                let filter = {
                  app_id: { $eq: selectedData.app_id },
                  account_id: { $eq: getToken().account_id },
                  page_type: { $eq: 'marketplace' },
                  status_name: { $eq: selectedData.status },
                }

                let fetch = await ServiceProxy.business.find(
                  'b2b',
                  'workflow_status',
                  'view',
                  filter,
                  [],
                  null,
                  null,
                )
                if (fetch.records[0].type !== 2) {
                  delete filter.status_name
                  filter.priority = { $eq: fetch.records[0].priority + 1 }
                  filter.link_to = { $eq: fetch.records[0].link_to }
                  let fetch__ = await ServiceProxy.business.find(
                    'b2b',
                    'workflow_status',
                    'view',
                    filter,
                    [],
                    null,
                    null,
                  )
                  if (fetch__.records.length > 0) {
                    let order_tracking_payload = {
                      order_id: selectedData.order_id,
                      invoice_id: selectedData.invoice_id,
                      status: fetch__.records[0].status_name,
                      link_to: fetch__.records[0].link_to
                    }
                    apiCall("create", order_tracking_payload, {}, "order_track")
                  }


                }


              }
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
        if (screen == "product") {
          filterObject = generateFilter(screen, filterObject, data)
        }
        else if (screen == "teams") {
          delete data?.status
          filterObject = {
            ...data
          };
        }

        else if (screen === "task" || screen === "taskbacklog" || screen === "orders" || screen === "brand" || screen === "attributes_group" || screen === "attributes") {
          filterObject = {
            ...data
          };
        }

        else if (screen == "category") {
          filterObject = { ...data }
          let tax_details = {
            '$.gst': data.tax
          }
          delete filterObject.image
          delete filterObject.id
          delete filterObject.tax 

          const convertedObject = {
            ...filterObject,
            tax_details
            // sub_category_id: {
            //   items: Object.assign({}, ...Object.entries(filterObject)
            //     .filter(([key, value]) => value !== "" && value !== null && value !== undefined)
            //     .map(([key, value]) => ({ ["$." + key]: value })))
            // }
          };

          filterObject = { ...convertedObject }

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

  const closetab = () => {
    setorderdetail([

    ])
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
  const addData = async () => {
    let arr = await subEditData
    await arr.push({})
    await setSubEditData(arr)

  }
  const finalResult = async (result) => {

    let arr = []
    for (let i = 0; i < result.length; i++) {
      let bind = {
        size: {
          width: 45,
          height: 45
        },
      }
      const autocompleteValue = result[i].autocompleteValue;
      const values = result[i].values
      bind.values = values
      bind.value = values[0].value
      bind.autocompleteValue = autocompleteValue
      bind.name = autocompleteValue.label
      bind.displayName = autocompleteValue.label
      if (autocompleteValue.data.field === "TXT") {
        bind.isColor = false
        bind.isImage = false
      } else {
        bind.isColor = true
        bind.isImage = false
        bind.variant = "circle"
      }
      arr.push(bind)
    }

    let payload = selectedData
    delete payload.created_by
    delete payload.created_at
    delete payload.updated_by
    delete payload.updated_at
    payload.additional_info = JSON.parse(payload.additional_info)
    payload.details.attributes = arr
    payload.details.is_attributed = "Y"
    let Update = await updateProxy(payload, "product")


    if (Update.modifiedCount > 0) {
      setSnackProps({
        snackOpen: true,
        severity: "success",
        message: SnackMess.U_SUCC
      })
      setAttrDrawerOpen(false)
      setSelectedData({})
      getdataFromApi()
    }
    console.log()



  }
  const getMultiselectValue = async (data_, idx) => {
    const { data } = data_
    await ServiceProxy.business.find('b2b', 'attributes', 'view', { attr_id: { $eq: data.id }, is_active: "Y", app_id: { $eq: data.app_id }, category_id: { $eq: data.category_id }, account_id: { $eq: getToken().account_id }, partner_id: { $eq: getToken().partner_id } }, [], null, null).then((res) => {
      if (res.cursor.totalRecords > 0) {
        let attribute = res.records.map((elm) => {
          return { label: elm.attr_value + " " + elm.units, value: elm.attr_value + " " + elm.units, data: elm }
        })
        setMultiselectbox(attribute)
        let subEditDataarr = []
        for (let i = 0; i < subEditData.length; i++) {
          const element = subEditData[i];
          if (idx === i) {
            element["Multiselectbox"] = attribute
          }

          subEditDataarr.push(element)
        }

        setSubEditData(subEditDataarr)
      } else {
        let subEditDataarr = []
        for (let i = 0; i < subEditData.length; i++) {
          const element = subEditData[i];
          if (idx === i) {
            element["Multiselectbox"] = []
          }

          subEditDataarr.push(element)
        }

        setSubEditData(subEditDataarr)
      }


      // fetchAttrPop()
    })
  }

  return (
    <>
      <Helmet>
        <title>{pageinfo.title}</title>
        {/* <title>{pageinfo.title.toLowerCase().replaceAll('_', ' ').replace(/(^|\s)(\w)/g, (match) => match.toUpperCase())}</title> */}
      </Helmet>

      <Container maxWidth={false}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={10}>
          <Typography variant="h4" gutterBottom>
            {label}
          </Typography>
          <Stack direction={"row"} gap={2}>
            {(screen !== "task" && screen !== "orders" && screen !== "taskbacklog") && AppPermission.create ?
              <Button onClick={() => Openpopup()}
                variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                New {label}
              </Button> : ""
            }
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
          <UserListToolbar numSelected={0} onFilterName={() => handleFilterByName(mode.FILTER)} mode={mode} />
        </Stack>
        {tableShow ?
          (
            pageinfo.Headers != undefined &&
            <AppTable
              header={colHeaders}
              actionsButtons={tableActions}
              bind_topayload={bind_topayload}
              bind_to={bind_to}
              count={count}
              items={items}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page - 1}
              rowsPerPage={rowsPerPage}
              get_table_filter={get_table_filter}
              module={screen}
              checkSelection={false}
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
      <AppDrawer
        children={
          <AppSubForm
            section={subEditData}
            addData={addData}
            finalResult={finalResult}
            getMultiselectValue={getMultiselectValue}
            Multiselectbox={Multiselectbox}
            selectbox={attributeGroup}
            islive={attrDrawerOpen}
          />
        }
        drawerOpen={attrDrawerOpen}
        setDrawerOpen={() => { setAttrDrawerOpen(false) }}
      />
      <AppSnacks
        snackProps={snackProps}
        setSnackProps={setSnackProps}
      />
      <CrmFullOrderDialog taskdetail={taskdetail} employee={employee} taskpage={taskpage} screen={screen} openorderdetail={openorderdetail} closetab={closetab} />
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
    </>
  );
}