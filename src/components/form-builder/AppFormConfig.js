import React, { useState, useMemo, useEffect } from "react";
import { Typography, Box, IconButton } from "@mui/material";
import Iconify from "../iconify";
import { TextField, Button } from "@mui/material";
import ServiceProxy from "../../services/serviceProxy";
import AppDialog from "../general/AppDialog";
import AppDrawer from "../../sections/@dashboard/app/AppDrawer";
import AppSnacks from "../general/AppSnacks";
import AppForm from "../../pages/AppForm";
import { getToken } from "../../services/AppService";
import { Await } from "react-router-dom";
import { CustomFieldhandel } from "../../utils/CustomformStr";
import { delete_flow_config } from "../../services/AppService";
import { useDispatch } from "react-redux";
import { setdata } from "../../redux/DynamicData/DataAction";
import { setSeconds } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import { SnackMess } from '../../constants/SnackMessages';
import Constants from "../../constants";
import SlickSlider from "../general/SlickSlider";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}



const AppFormConfig = React.forwardRef((props, ref) => {
  const { state } = useLocation();
  let query = useQuery();
  const dispatch = useDispatch()
  const [openDialog, setOpenDialog] = useState(false);
  const [selected_data, setselected_data] = useState({});
  const [TemplateApiFlds, setTemplateApiFlds] = useState({});
  let [fieldDyanamicBind, setfieldDyanamicBind] = useState({})
  const [Dynamicfield, setDynamicfield] = useState([])
  const [storefile, setstorefile] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [storeConfig, setstoreConfig] = useState({})
  const [loader, setloader] = useState(false)
  const [Removestorefile, setRemovestorefile] = useState([]);
  const [Apidata, setApidata] = useState([]);
  const [loadtemplateFlds, setloadTemplateFlds] = useState(true);
  const [changeFldVal, setChangeFldVal] = useState()
  const [snackProps, setSnackProps] = useState({
    snackOpen: false,
    setSnackOpen: () => { },
    severity: "",
    message: "",
  });
  const {
    flowname, allCategory,
    flowData,
    mode,
    module, fetchdata
  } = props;

  const checkTCPP = () => {
    if (!flowData || flowData.length === 0 || !flowData[0]) {
      return false;
    }
    return flowData[0].app_id === "-1" || flowData[0].app_id === "-2"
      || flowData[0].app_id === "-3" || flowData[0].app_id === "-4"
  }

  React.useImperativeHandle(ref, () => ({}));
  useEffect(() => {
    console.log(flowData, "77777777777777777777777777777777777")
    setapidatas()
    setstorefile([])
    setRemovestorefile([])
  }, [flowData])

  useEffect(() => {
    dynamicDropdownload();
  }, []);

  const setapidatas = async () => {
    await setloader(false)
    let arr = []
    for (let i = 0; i < flowData.length; i++) {
      let element = flowData[i];

      if (element.filter === undefined || element.filter === null ||
        element.content === undefined || element.content === null) {
        element.filter = []
        element.content = []
      }
      else {
        if (typeof element.filter === "string") {
          element.filter = JSON.parse(element.filter)
        }
        if (typeof element.content === "string") {
          element.content = JSON.parse(element.content)
        }

      }
      console.log(element, "element.filterelement.filter")
      arr.push(element)
    }
    console.log(arr);
    await setApidata(arr)
    await setloader(true)
  }
  const deleteSelectedData = () => {
    action__(storefile.id, mode.DELETE, storeConfig)
  }
  const config = async (section, event, value) => {
    console.log(value);
    console.log(section);
    await setloadTemplateFlds(false)
    let val = value
    val.id = value.id === undefined ? 0 : value.id
    await setstoreConfig(val)
    await setselected_data(section)

    let objvalue = {}
    if (event.action !== "create") {
      objvalue = value
    }

    await fetchtemplate(true, event.action, objvalue)

    if (event.action !== 'delete') {
      await setDrawerOpen(true)
    } else {
      await setOpenDialog(true)
    }
    await setloadTemplateFlds(true)
    console.log(TemplateApiFlds);
    // if (event.action == mode.UPDATE && value?.image && value?.image.length == 1) {

    //   if (Object.keys(TemplateApiFlds).length > 0) {

    //     setTemplateApiFlds((set) => {
    //       TemplateApiFlds.fields.forEach((elm) => {
    //         elm.fields.forEach((elem) => {
    //           if (elem.model == "image") {
    //             elem.disabled = "Y"
    //           }
    //         })
    //       })
    //       return TemplateApiFlds
    //     })
    //   }
    // }
    // else {
    //   if (Object.keys(TemplateApiFlds).length > 0) {
    //     setTemplateApiFlds((set) => {
    //       TemplateApiFlds.fields.forEach((elm) => {
    //         elm.fields.forEach((elem) => {
    //           if (elem.model == "image") {
    //             elem.disabled = false
    //           }
    //         })
    //       })
    //       return TemplateApiFlds
    //     })
    //   }
    // }
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
          'b2b', module, path, ids
        )
      return filedelete
    }
  }
  let uploadfile = async () => {
    let fileUpload = await ServiceProxy.fileUpload
      .upload(
        'b2b', module, storefile
      )
    return fileUpload
  }
  const handleFileUpload = async (name, e, deletedfiles) => {

    let e_ = e
    let existfiles = storeConfig
    console.log(name, e, deletedfiles, "77777777777777777777777777777777", storeConfig)
    console.log(existfiles);
    if (existfiles === undefined || existfiles.image === undefined) {
      console.log("asd");
      if (e.length == 1) {

        setTemplateApiFlds((set) => {
          TemplateApiFlds.fields.forEach((elm) => {
            elm.fields.forEach((elem) => {
              if (elem.model == "image") {
                elem.disabled = "Y"
              }
            })
          })
          return TemplateApiFlds
        })
      }
      else {
        setTemplateApiFlds((set) => {
          TemplateApiFlds.fields.forEach((elm) => {
            elm.fields.forEach((elem) => {
              if (elem.model == "image") {
                elem.disabled = false
              }
            })
          })
          return TemplateApiFlds
        })

      }
      setstorefile(e_)
      let merge = Removestorefile.concat(deletedfiles)
      setRemovestorefile(merge)
    } else {
      console.log(e);
      if (e.length == 1) {
        loadFiles(existfiles, e_, deletedfiles)
        setTemplateApiFlds((set) => {
          TemplateApiFlds.fields.forEach((elm) => {
            elm.fields.forEach((elem) => {
              if (elem.model == "image") {
                elem.disabled = "Y"
              }
            })
          })
          return TemplateApiFlds
        })

      }
      else {
        loadFiles(existfiles, e_, deletedfiles)

        setTemplateApiFlds((set) => {
          TemplateApiFlds.fields.forEach((elm) => {
            elm.fields.forEach((elem) => {
              if (elem.model == "image") {
                elem.disabled = false
              }
            })
          })
          return TemplateApiFlds
        })

      }

    }
  }
  const loadFiles = (existfiles, e_, deletedfiles) => {
    let arr = []
    let deletearr = []
    for (let i = 0; i < e_.length; i++) {
      const element = e_[i];
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
  let action = async (data, typeMode, fileUpload) => {
    console.log(data, typeMode, fileUpload);
    let obj = {}
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

    if (checkTCPP()) {

      obj = {
        id: (storeConfig && storeConfig.hasOwnProperty("id")) ? storeConfig.id.toString() : "0",
        content: {
          ...data
        },
      }
    }
    else {
      obj = {
        id: (storeConfig && storeConfig.hasOwnProperty("id")) ? storeConfig.id.toString() : "0",
        filter: {
          ...data
        },

      }

    }
    apiCall(typeMode, obj, data)

  }

  const apiCall = async (typeMode, obj, data__, orderTrackObj) => {
    try {
      console.log(typeMode, obj, data__);

      if (typeMode == mode.CREATE) {

        let payload = selected_data
        console.log(payload);
        if (checkTCPP()) {
          console.log(obj);
          obj.content["id"] = isNaN(payload.content.length + 1) ? "1" : payload.content.length + 1
          console.log(obj);
          payload && payload["content"].push(obj.content)
          console.log(payload);
        }
        else {
          obj.filter["id"] = payload.filter.length + 1
          obj.filter["apidata"] = restructureData(obj.filter)
          payload.filter.push(obj.filter)
        }
        console.log(payload, "objobjobjobjobjobjobjobjobjobjobj")

        let Create = await ServiceProxy.business
          .update('b2b',
            "workflow_status", payload)
        if (Create.modifiedCount > 0) {
          setDrawerOpen(false)
          fetchdata()
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "success",
            message: "SnackMess.C_SUCC"
          })
          setTemplateApiFlds({
            ...TemplateApiFlds,
            "initialValues": {}
          })
        }

        // if (Create.statusCode == 201) {
        //   setSnackProps({
        //     ...snackProps,
        //     snackOpen: true,
        //     severity: "success",
        //     message: "SnackMess.C_SUCC"
        //   })
        //   setDrawerOpen(false)
        //   fetchdata()
        // }
      }
      else if (typeMode == mode.UPDATE) {

        try {
          let payload
          let payload_filter = []

          if (!checkTCPP()) {


            for (let i = 0; i < selected_data.filter.length; i++) {
              const element = selected_data.filter[i];
              if (element.id === obj.filter.id) {
                payload_filter.push(obj.filter)
              } else {
                payload_filter.push(element)
              }
            }
            payload = selected_data

            for (let j = 0; j < payload_filter.length; j++) {
              const payload_filter_ = payload_filter[j];
              delete payload_filter_.apidata
              payload_filter_["apidata"] = restructureData(payload_filter_)
            }
            payload["filter"] = payload_filter
            console.log(payload);
          }
          else {

            for (let i = 0; i < selected_data.content.length; i++) {
              const element = selected_data.content[i];
              if (element.id === obj.content.id) {
                payload_filter.push(obj.content)
              } else {
                payload_filter.push(element)
              }
            }
            payload = selected_data
            payload["content"] = payload_filter
            console.log(payload);
          }

          let Update = await ServiceProxy.business
            .update('b2b', "workflow_status", payload)
          if (Update.modifiedCount > 0) {
            setSnackProps({
              ...snackProps,
              snackOpen: true,
              severity: "success",
              message: SnackMess.C_SUCC

            })
            setDrawerOpen(false)
            fetchdata()
          }

        }
        catch (err) {
          console.log(err);
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "error",
            message: `${"`SnackMess.SWWERR`"}::${err}`
          })
        }

      } else if (typeMode == mode.DELETE) {
        let payload_filter = []
        let payload
        if (!checkTCPP()) {

          for (let i = 0; i < selected_data.filter.length; i++) {
            const element = selected_data.filter[i];
            if (element.id !== obj.id) {
              payload_filter.push(element)
            }
          }
          payload = selected_data
          payload.filter = payload_filter
          console.log(payload, "666666666666666666666666666666666", data__.image === undefined)
          if (data__.image !== undefined) {
            await deleteimage(data__.image)
          }
        }
        else {
          for (let i = 0; i < selected_data.content.length; i++) {
            const element = selected_data.content[i];
            if (element.id !== obj.id) {
              payload_filter.push(element)
            }
          }
          payload = selected_data
          payload.content = payload_filter
          console.log(payload, "666666666666666666666666666666666", data__.image === undefined)
        }
        let Delete = await ServiceProxy.business
          .update('b2b',
            "workflow_status", payload)
        if (Delete.modifiedCount > 0) {
          setOpenDialog(false)
          fetchdata()
          setSnackProps({
            ...snackProps,
            snackOpen: true,
            severity: "success",
            message: "SnackMess.C_SUCC"
          })
        }
      }
    } catch (err) {
      setSnackProps({
        ...snackProps,
        snackOpen: true,
        severity: "error",
        message: `Invalid Input Data`
      })
    }
  }

  const restructureData = (inputData) => {
    const query = {};
    const details = {};
    for (const key in inputData) {
      if (inputData[key] && inputData[key] !== "" && inputData[key] !== undefined && inputData[key] !== null && key !== "image" && key !== "id" && key !== 'category_id' && key !== 'sub_category_id') {
        details[`$.${key}`] = inputData[key];
      }
      if (key === 'category_id' || key === 'sub_category_id') {
        query[`${key}`] = { $eq: inputData[key] };
      }

    }
    query.details = details
    return query;
  }




  let action_delete = async (data, typeMode, fileUpload) => {
    if (typeMode == mode.DELETE) {
      apiCall(typeMode, storeConfig, fileUpload)
    }
  }

  const action__ = async (data, type, filedata) => {
    console.log(data, type, "eeeeeeeeeeeeeeeeeeeeeeee", storefile)
    if (checkTCPP()) {
      callApiRec(type, data, filedata)
    }
    else {
      if (type == mode.DELETE) {
        callApiRec(type, data, filedata)

      }
      else {

        if (data && data.hasOwnProperty("image") && data?.image.length > 0) {
          callApiRec(type, data, filedata)
        }
        else {
          setSnackProps({
            snackOpen: true,
            severity: "error",
            message: `Upload Atlease One Image file`
          })
        }
      }
    }
  };

  const callApiRec = async (type, data, filedata) => {
    console.log(type, data, filedata);
    if (type === mode.CREATE) {

      if (storefile.length > 0) {
        let fileUpload = await uploadfile()
        if (Removestorefile.length > 0) {
          await deleteimage(Removestorefile)
          setRemovestorefile([])
        }
        if (fileUpload.status == 200) {
          setstoreConfig((set) => {
            set["filter"] = { 'images': fileUpload.data }
            return set
          })
          action(data, type, fileUpload.data)
        }
      } else {
        action(data, type)
      }

    }
    else if (type == mode.UPDATE) {
      if (!checkTCPP()) {


        let fileUpload
        if (storefile.length > 0) {
          fileUpload = await ServiceProxy.fileUpload
            .upload(
              'b2b', module, storefile
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
          action(data, type, fileUpload.data.concat(uniquefile))
        }
        else if (storefile.length === 0) {
          action(data, type, data.image)
        }
      }
      else {
        action(data, type, data.image)
      }

    } else {
      action_delete(data, type, filedata)
    }
    document.getElementById("add_new_btn").click()
  }


  let lazyDataApi = async (childmodel, parentmodel, parentvalue) => {
    console.log(childmodel, parentvalue, "444444444444444444444444444444444444444444", parentmodel);
    if (parentvalue !== undefined) {
      await dynamicDropdownload(childmodel, parentvalue, parentmodel)
    }

  }
  let DynamicForm = async (appid) => {
    let template = await ServiceProxy.business.find(
      "b2b",
      "template",
      "view",
      {
        type: { $eq: appid },
      },
      [],
      null,
      null
    );
    if (template.cursor.totalRecords > 0) {
      let template_arr = []
      let sort = [{
        column: "position",
        order: 'asc'
      }]
      for (let j = 0; j < template.records.length; j++) {
        const elm = template.records[j];
        let filterobj = {}

        filterobj = {
          model: { $in: ["name", "brand", "price", "offer_percent", "city_code"] },
          template_id: { $eq: elm.id }, account_id: { $eq: getToken().account_id },
        }

        // }
        let templatefields = await ServiceProxy.business.find(
          "b2b",
          "templates_field",
          "view",
          filterobj,
          [],
          null,
          null,
          sort
        );
        for (let i = 0; i < templatefields.records.length; i++) {
          const records_ = templatefields.records[i];
          if (records_.model === "city_code") {
            records_.type = "SelectList"
            records_.validation_type = "string"
          }
          records_.catagory = "Advance Filter"
          template_arr.push(records_)
        }

      }

      await CustomFieldhandel(template_arr, fieldDyanamicBind)
        .then((res) => {
          setDynamicfield(res.field)


        })
    }
  }
  let dynamicDropdownload = async (model, values, parentmodel) => {
    console.log(model, "tttttttttttttttttttttttttttttt", TemplateApiFlds);
    if (model == 'sub_category_id') {
      DynamicForm(values.toString())
      await ServiceProxy.business.find('b2b', 'category_new', 'view', {
        account_id: { $eq: getToken().account_id },
        app_id: { $eq: values && values != null ? values.toString() : {} },
        is_active: { $eq: "Y" }
      }, [], null, null)
        .then((res) => {
          let values = []
          if (res.cursor.totalRecords > 0) {
            values = res.records.map((elm) => {
              let tag = []
              if (typeof (elm.details) == "string" && elm.details !== "") {
                tag = JSON.parse(elm.details)?.tags
              }
              return {
                id: elm.id,
                name: elm.name,
                value: elm.id,
                tags: tag
              }
            })
            dispatch(setdata({ [model]: values }))

            // values = res.records.map((elm) => {
            //   if (elm.sub_category) {
            //     elm.sub_category = JSON.parse(elm.sub_category);
            //   }
            //   return res.records.reduce((accumulator, elm) => {
            //     // const innerItems = elm.sub_category.items.map((innerItem) => {

            //     //   return { id: innerItem.id, name: innerItem.name, value: innerItem.value, tags: innerItem.tags };
            //     // });
            //     const filteredItems = elm.sub_category.items
            //       .filter((innerItem) => innerItem.is_active === "Y")
            //       .map((innerItem) => ({
            //         id: innerItem.id,
            //         name: innerItem.name,
            //         value: innerItem.value,
            //         tags: innerItem.tags
            //       }));
            //     return accumulator.concat(filteredItems);
            //   }, []);
            // })
            // console.log(values);
          }
        })
        .catch((err) => {
          console.error(err);
        })
    }
    if (model === undefined) {
      await ServiceProxy.business.find('b2b', 'brand', 'view', {
        is_active: { $eq: "Y" }, account_id: { $eq: getToken().account_id }, is_active: { $eq: "Y" }
      })
        .then((res) => {
          console.log(res);
          if (res.cursor.totalRecords > 0) {
            setfieldDyanamicBind((set) => {
              set.brand = res.records.map((elm) => {
                return { id: elm.id, name: `${elm.brand_name}`, value: elm.id }
              })

              return set
            })
          }

        })
        .catch((err) => {
          console.error(err);
        })
      let marketplaceFilter = {
        is_default: { $eq: "N" }, is_active: { $eq: "Y" }, show_on_market: { $eq: "Y" }, account_id: { $eq: getToken().account_id },
        is_client_show: { $eq: "Y" }
      }
      if (state.app_id !== "0") {
        marketplaceFilter["app_id"] = { $eq: state.app_id }
      }
      await ServiceProxy.business.find('b2b', 'market_place', 'view', marketplaceFilter)
        .then((res) => {
          console.log(res);
          if (res.cursor.totalRecords > 0) {
            setfieldDyanamicBind((set) => {
              set.category_id = res.records.map((elm) => {
                return { id: elm.id, name: `${elm.label}`, value: elm.id }
              })

              return set
            })
          }
          // fetchtemplate()
        })
        .catch((err) => {
          console.error(err);
        })
      // await ServiceProxy.business.find('b2b', 'location_state', 'view', {
      //   is_active: { $eq: "Y" }
      // })
      //   .then((res) => {
      //     console.log(res);
      //     if (res.cursor.totalRecords > 0) {
      //       setfieldDyanamicBind((set) => {
      //         set.state = res.records.map((elm) => {
      //           return { id: elm.state_code, name: `${elm.state_name}`, value: elm.state_code }
      //         })

      //         return set
      //       })
      //     }
      //     // fetchtemplate()
      //   })
      //   .catch((err) => {
      //     console.error(err);
      //   })
      await ServiceProxy.business.find('b2b', 'location_city', 'view', {
        account_id: { "$eq": getToken().account_id },
        is_active: { $eq: "Y" }
      })
        .then((res) => {
          console.log(res);
          if (res.cursor.totalRecords > 0) {
            setfieldDyanamicBind((set) => {
              set.city_code = res.records.map((elm) => {
                return { id: elm.city_code, name: `${elm.city_name}`, value: elm.city_code }
              })

              return set
            })
          }
          // fetchtemplate()
        })
        .catch((err) => {
          console.error(err);
        })
    }

  }

  let fetchtemplate = async (image_need, type, objvalue) => {
    try {
      let temp
      if (checkTCPP()) {
        temp = {
          name: { $in: ["T&C_CONFIG"] },
        }
      }
      else {
        temp = {
          name: { $in: ["PFLOW_CONFIG"] },
        }
      }

      let template = await ServiceProxy.business.find(
        "b2b",
        "template",
        "view",
        {
          // name: { $in: ["PFLOW_CONFIG", 'PROD_CU'] },
          name: { $in: ["PFLOW_CONFIG", checkTCPP() ? "T&C_CONFIG" : ""] },
        },
        [],
        null,
        null
      );

      if (template.cursor.totalRecords > 0) {
        let template_arr = []
        let sort = [{
          column: "position",
          order: 'asc'
        }]
        if (checkTCPP()) {

          const elm = template.records[1];
          let filterobj = {}

          filterobj = {
            template_id: { $eq: elm.id },
            account_id: { $eq: getToken().account_id },
          }
          if (image_need === false) {
            filterobj.model = { $ne: "image" }
          }

          let templatefields = await ServiceProxy.business.find(
            "b2b",
            "templates_field",
            "view",
            filterobj,
            [],
            null,
            null,
            sort
          );
          for (let i = 0; i < templatefields.records.length; i++) {
            const records_ = templatefields.records[i];
            template_arr.push(records_)
          }
        }
        else {

          for (let j = 0; j < template.records.length; j++) {
            const elm = template.records[j];
            let filterobj = {}

            filterobj = {
              template_id: { $eq: elm.id },
              account_id: { $eq: getToken().account_id },
            }
            if (image_need === false) {
              filterobj.model = { $ne: "image" }
            }

            let templatefields = await ServiceProxy.business.find(
              "b2b",
              "templates_field",
              "view",
              filterobj,
              [],
              null,
              null,
              sort
            );
            for (let i = 0; i < templatefields.records.length; i++) {
              const records_ = templatefields.records[i];
              template_arr.push(records_)
            }
          }
        }

        await CustomFieldhandel(template_arr, fieldDyanamicBind)
          .then((res) => {
            console.log(template_arr, "yyyyyyyyyyyyyyyyttttttttttttttttttttt")
            console.log(template);

            if (checkTCPP()) {
              console.log(template.records[1]);
              setTemplateApiFlds({
                "template": template.records[1],
                "fields": res.field,
                "action": type,
                "initialValues": objvalue,
                "skipped": [],
                lazyDataApi: lazyDataApi
              })
            }
            else {

              setTemplateApiFlds({
                "template": template.records[0],
                "fields": res.field,
                "action": type,
                "initialValues": objvalue,
                "skipped": [],
                lazyDataApi: lazyDataApi
              })
            }

          })
      }


    } catch (error) {
      console.log(error);
    }
  };

  const generateSlider = (value) => {
    let url = Constants.BASE_URL_WOP
    console.log(value.image.map(item => url + `/${item.path}`));
    return value.image.map(item => url + `/${item.path}`)
  }

  return (
    <>
      <div className="layout_grid">

        <div className="layout_grid_inner">
          {loader && Apidata.map((section, i) => {
            return (
              <div className="drop_box">

                <div className="drop_box_sec">

                  <div className="drop_box_sts">
                    <span className="drop_box_txt">
                      {section?.display_name}
                    </span>
                    <span className="drop_box_stst">
                      {section?.status_name.toUpperCase()}
                    </span>
                    <Box sx={{
                    }}>
                      {<Button
                        id="add_new_btn"
                        type="submit"
                        variant="contained"
                        startIcon={<Iconify icon="tabler:add" />}
                        onClick={() => {
                          config(section, { index: i, action: mode.CREATE }, {});
                        }}
                      >
                        Add New
                      </Button>}
                    </Box>
                  </div>
                </div>
                <div className="drop_box_sec_ft">

                  {!checkTCPP()
                    ? section?.filter?.length > 0 && section?.filter?.map((value, i) => {
                      return (
                        <div className="drop_box_sec_inn">
                          <div>
                            {value?.status_name == "multiposter" ?
                              (value.image.map((itemInn) => {
                                return (
                                  <div className="list_banner_sec">
                                    <div className="list_banner_imgb">
                                      <img
                                        className="list_banner_img"
                                        src={`${Constants.BASE_URL_WOP}/${itemInn.file_path.substring(14)}`}
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                )
                              }))
                              :
                              (value.image.map((itemInn) => {
                                return (
                                  <div className="list_banner_cover" >
                                    <img
                                      className="list_banner_coverimg"
                                      src={`${Constants.BASE_URL_WOP}/${itemInn.file_path.substring(14)}`}
                                      alt=""
                                    />
                                  </div>
                                )
                              }))
                            }
                            <div className="drop_box_sec_conth">
                              <IconButton aria-label="edit"
                                onClick={() => {
                                  config(section, { index: i, action: mode.UPDATE }, value);
                                }}>
                                <EditIcon className="ico_white" />
                              </IconButton>
                              <IconButton aria-label="delete"
                                onClick={() => {
                                  config(section, { index: i, action: mode.DELETE }, value);
                                }}
                              >
                                <DeleteIcon className="ico_white" />
                              </IconButton>

                              {/* <Button
                                type="submit"
                                variant="outlined"
                                startIcon={<Iconify icon="tabler:edit" />}

                              >
                                edit
                              </Button>
                              <Button
                                type="submit"
                                variant="outlined"
                                color="error"
                                startIcon={<Iconify icon="tabler:edit" />}

                              >
                                delete
                              </Button> */}

                            </div>
                            {/* <SlickSlider details={value}
                              config={config}
                              section={section}
                              i={i}
                              value={value}
                              mode={mode}
                            /> */}
                          </div>
                        </div>
                      )
                    }) :
                    section?.content?.length > 0 && section?.content?.map((value, i) => {
                      return (
                        <div className="drop_box_sec_cont">
                          <div className="drop_box_sec_contb">
                            <div className="drop_box_sec_conth">
                              <IconButton aria-label="edit"
                                onClick={() => {

                                  config(section, { index: i, action: mode.UPDATE }, value);
                                }}>
                                <EditIcon className="ico_white" />
                              </IconButton>
                              <IconButton aria-label="delete"
                                onClick={() => {

                                  config(section, { index: i, action: mode.DELETE }, value);
                                }}
                              >
                                <DeleteIcon className="ico_white" />
                              </IconButton>
                              {/* <Button
                                type="submit"
                                variant="outlined"
                                startIcon={<Iconify icon="tabler:edit" />}

                              >
                                edit
                              </Button>
                              <Button
                                type="submit"
                                variant="outlined"
                                color="error"
                                startIcon={<Iconify icon="tabler:edit" />}

                              >
                                delete
                              </Button> */}
                            </div>
                            <div className="sec_box">
                              <div className="sec_txt">
                                {value?.title}
                              </div>
                              <div className="sub_txt">
                                {value?.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
                {
                  !checkTCPP() ?
                    (section?.filter?.length === 0
                      &&
                      <div className="no_records">No data</div>)
                    : (section?.content?.length === 0
                      &&
                      <div className="no_records">No data</div>)
                }
              </div>
            );
          })}
        </div>

        {loadtemplateFlds === true && Object.keys(TemplateApiFlds).length > 0 &&
          <div className="form_grid">
            <AppForm
              formSchema={TemplateApiFlds}
              action={action__}
              handleFileUpload={handleFileUpload}
              changeFldVal={changeFldVal}
              mode={mode}
              allObj={true}
              Dynamicfield={Dynamicfield}
              uiBuilder={true}
            />
          </div>
        }
      </div >

      <AppDialog
        dialogTitle={"Confirm"}
        dialogContent={"Are you Sure want to Proceed ?"}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleDelete={() => deleteSelectedData()}
      />
      {/* {loadtemplateFlds === true && Object.keys(TemplateApiFlds).length > 0 &&
        <AppDrawer
          children={
            <AppForm
              formSchema={TemplateApiFlds}
              action={action__}
              handleFileUpload={handleFileUpload}
              changeFldVal={changeFldVal}
              mode={mode}
              allObj={true}
              Dynamicfield={Dynamicfield}
            />
          }
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        />} */}

      <AppSnacks
        snackProps={snackProps}
        setSnackProps={setSnackProps}
      />

    </>
  );
});
export default AppFormConfig;
