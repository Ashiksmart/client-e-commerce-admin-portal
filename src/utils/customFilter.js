export const generateFilter = (screen, filterObject, data) => {
    if (screen == "product") {
        filterObject = {
            sub_category_id: { $eq: data.sub_category_id },
            details: {}
        };
        for (const key in data) {
            if (key !== "sub_category_id") {
                filterObject.details["$." + key] = data[key];
            }
        }

        return cleanFilterObject(filterObject)
    }
    if (screen == "crm_leads") {
        filterObject = {
            phone_number: { $eq: data.phone_number },
            email: { $eq: data.email },
            user: { $eq: data.user },
            details: {}
        };
        for (const key in data) {
            if (key !== "user") {
                filterObject.details["$." + key] = data[key];
            }
        }

        return cleanFilterObject(filterObject)
    }
    if (screen == "crm_deals") {
        filterObject = {
            details: {}
        };
        for (const key in data) {
            if (key !== "contact_id") {
                filterObject.details["$." + key] = data[key];
            }
        }

        return cleanFilterObject(filterObject)
    }
    if (screen == "crm_company") {
        filterObject = {
            details: {}
        };
        for (const key in data) {
            filterObject.details["$." + key] = data[key];
        }

        return cleanFilterObject(filterObject)
    }
    if (screen == "crm_contact") {
        filterObject = {
            phone_number: { $eq: data.phone_number },
            email: { $eq: data.email },
            user: { $eq: data.user },
            contact_details: {}
        };
        for (const key in data) {
            if (key !== "user" && key !== "phone_number" && key !== "email") {
                filterObject.contact_details["$." + key] = data[key];
            }
        }

        return cleanFilterObject(filterObject)
    }

}

function cleanFilterObject(filterObject) {
    for (const key in filterObject) {
        if (filterObject[key].hasOwnProperty("$eq") && (filterObject[key].$eq === "" || filterObject[key].$eq === undefined)) {
            delete filterObject[key];
        }
    }
    if (filterObject.details) {
        for (const key in filterObject.details) {
            if (filterObject.details[key] === "") {
                delete filterObject.details[key];
            }
        }
        if (Object.keys(filterObject.details).length === 0) {
            delete filterObject.details;
        }

    }
    if (filterObject.contact_details) {
        for (const key in filterObject.contact_details) {
            if (filterObject.contact_details[key] === "") {
                delete filterObject.contact_details[key];
            }
        }
        if (Object.keys(filterObject.contact_details).length === 0) {
            delete filterObject.contact_details;
        }

    }
    return filterObject;
}