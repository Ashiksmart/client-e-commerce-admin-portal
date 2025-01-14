import ServiceProxy from "../services/serviceProxy";
import jwt_decode from "jwt-decode";
import { PARENT_SCREENS, ALL_SCREENS } from "../constants/localstorage";

// Auth Token Parse
export const getToken = () => {
  if (localStorage.getItem("b2b.token")) {
    return jwt_decode(localStorage["b2b.token"]);
  }else{

    ServiceProxy.localStorage.clear()
  }
};
export const getAccInfo = () => {
  if (localStorage.getItem("b2b.accountinfo")) {
    return localStorage["b2b.accountinfo"];
  }else{
    ServiceProxy.localStorage.clear()
  }
};
export const getPermissions = () => {
  if (localStorage.getItem("b2b.token")) {
    let permissionScope = jwt_decode(localStorage["b2b.token"]).scope;
    const permissionsObject = {};

    permissionScope.split(",").forEach((permission) => {
      const [category, action] = permission.split(":");
      permissionsObject[category] = permissionsObject[category] || {};
      permissionsObject[category][action] = true;
    });
    return permissionsObject;
  }else{
    ServiceProxy.localStorage.clear()
  }
};

export const loadAllScreens = async () => {
  // let reqFilter = {partner_id: getToken().partner_id}
  console.log(getToken());
  const fetchRes = await ServiceProxy.business.find(
    "b2b",
    "market_place",
    "view",
    { account_id: getToken().account_id },
    [],
    1,
    null,
    [
      {
        column: "id",
        order: "asc",
      },
    ]
  );

  if (fetchRes) {
    let ps = fetchRes.records.filter(
      (item) => item.is_default == "N" && item.is_active == "Y"
    );
    ps.forEach((element) => {
      element.catagory_id = JSON.parse(element.catagory_id);
    });

    ServiceProxy.localStorage.setItem(PARENT_SCREENS, ps);

    if (ServiceProxy.localStorage.getItem(PARENT_SCREENS)) {
      const childScreens = await ServiceProxy.business.find(
        "b2b",
        "market_place_nav",
        "view",
        { account_id: { $eq: getToken().account_id } },
        [],
        1,
        100
      );

      let parentScreens = ServiceProxy.localStorage.getItem(PARENT_SCREENS);
      const screensMap = new Map();
      childScreens.records.forEach((childScreen) => {
        let { app_id, operation } = childScreen;

        if (operation) {
          childScreen.operation = JSON.parse(operation);
        }
        if (!screensMap.has(app_id)) {
          screensMap.set(app_id, []);
        }

        screensMap.get(app_id).push(childScreen);
      });

      const combinedScreens = parentScreens.map((parentScreen) => ({
        ...parentScreen,
        children: screensMap.get(+parentScreen.app_id) || [],
      }));

      ServiceProxy.localStorage.setItem(ALL_SCREENS, combinedScreens);
      let updatedScreens = [...combinedScreens];
      return updatedScreens;
    }
  }
};

// Category
export const findCategories = async (obj) => {
  return await ServiceProxy.business.find("b2b", "category", "view", obj);
};

export const filterCategories = async (obj) => {
  return await ServiceProxy.business.find(
    "b2b",
    "category",
    "view",
    obj.filters,
    obj.fields,
    obj.page,
    obj.limit,
    obj.sort
  );
};

export const createCategory = async (obj) => {
  return await ServiceProxy.business.create("b2b", "category", obj);
};
export const updateCategory = async (obj) => {
  return await ServiceProxy.business.update("b2b", "category", obj);
};
export const deleteCategory = async (obj) => {
  return await ServiceProxy.business.update("b2b", "category", obj);
};

// Template
export const findTemplate = async (obj) => {
  return await ServiceProxy.business.find("b2b", "template", "view", obj);
};
export const findTemplateFlds = async (obj) => {
  obj.account_id = { $eq: getToken().account_id };
  return await ServiceProxy.business.find(
    "b2b",
    "templates_field",
    "view",
    obj
  );
};
export const createTemplate = async (obj) => {
  return await ServiceProxy.business.create("b2b", "template", obj);
};
export const createTemplateFld = async (obj) => {
  return await ServiceProxy.business.create("b2b", "templates_field", obj);
};

// product
export const getProducts = async (obj) => {
  return await ServiceProxy.business.find("b2b", "product", "view", obj);
};
export const filterProducts = async (obj) => {
  return await ServiceProxy.business.find(
    "b2b",
    "product",
    "view",
    obj.filters,
    obj.fields,
    obj.page,
    obj.limit,
    obj.sort
  );
};

export const createProduct = async (obj) => {
  return await ServiceProxy.business.create("b2b", "product", obj);
};
export const updateProduct = async (obj) => {
  return await ServiceProxy.business.update("b2b", "product", obj);
};
export const deleteProduct = async (obj) => {
  return await ServiceProxy.business.update("b2b", "product", obj);
};
export const Softdelete = async (obj, module, condition) => {
  return await ServiceProxy.business.update("b2b", module, obj, condition);
};
// Partners
export const getAllPartners = async (obj) => {
  return await ServiceProxy.Partner.find("b2b", "partner_account", "view", obj);
};

// Market Place
export const createMarketPlace = async (obj) => {
  return await ServiceProxy.business.create("b2b", "market_place", obj);
};
export const updateMarketPlace = async (obj) => {
  return await ServiceProxy.business.update("b2b", "market_place", obj);
};
export const createCustomHeader = async (obj) => {
  return await ServiceProxy.business.create("b2b", "custom_table_header", obj);
};
export const updateCustomHeader = async (obj) => {
  return await ServiceProxy.business.update("b2b", "custom_table_header", obj);
};
export const getCustomHeader = async (obj) => {
  return await ServiceProxy.business.find(
    "b2b",
    "custom_table_header",
    "view",
    obj
  );
};
// Common Utilities
export const parseStringToValidJSON = (arrObj) => {
  arrObj.map((item) => {
    if (item.details) {
      item.details = JSON.parse(item.details);
    }
    if (item.additionalInfo) {
      item.additionalInfo = JSON.parse(item.additionalInfo);
    }
    return item;
  });
};

export const delete_flow_config = async (obj, module) => {
  return await ServiceProxy.business.delete("b2b", module, obj);
};

export const fetchProxy = async (
  obj,
  model,
  fields = [],
  associated,
  page = 1,
  limit = 10,
  sort
) => {
  return await ServiceProxy.business.find(
    "b2b",
    model,
    "view",
    obj,
    fields,
    page,
    limit,
    sort,
    associated
  );
};

export const createProxy = async (obj, modele) => {
  return await ServiceProxy.business.create("b2b", modele, obj);
};

export const bulkCreateProxy = async (obj, modele) => {
  return await ServiceProxy.business.bulkCreate("b2b", modele, obj);
};

export const deleteProxy = async (obj, modele) => {
  return await ServiceProxy.business.delete("b2b", modele, obj);
};

export const updateProxy = async (obj, modele, criteria) => {
  return await ServiceProxy.business.update("b2b", modele, obj, criteria);
};
export const bulkDeleteProxy = async (obj, modele) => {
  return await ServiceProxy.business.bulkDelete("b2b", modele, obj);
};
