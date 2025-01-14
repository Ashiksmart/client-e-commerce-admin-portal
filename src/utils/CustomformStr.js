export const CustomFieldhandel = async (data, dynamicbind = {}, filter, showField) => {
    try {
        const field = [];
        const catagory_obj = {};
        const header = [];
        let initialvalue = {}


        await Promise.all(
            data.map(async (elm, i) => {
                const header_obj = {};
                initialvalue[elm.model] = ""
                Object.keys(elm).forEach((elmdata) => {
                    if (typeof elm[elmdata] === "string" && (elm[elmdata] === "N" || elm[elmdata] === "Y")) {
                        elm[elmdata] = elm[elmdata] === "Y" ? true : false;
                    }
                });

                if (elm.show_in_table) {
                    header_obj.filterable = elm.search_filter;
                    header_obj.title = elm.label;
                    header_obj.checkbox = true;
                    header_obj.avatar = elm.type === "imgpicker";
                    header_obj.sort = true;
                    header_obj.value = elm.model;
                    header_obj.badge = elm.is_badge;
                    header_obj.type = elm.model_type

                    header.push(header_obj);
                }

                if (elm.validation_type) {
                    elm.validationType = elm.validation_type;
                }
                if ('string' === typeof elm.validations) {
                    elm.validations = JSON.parse(elm.validations).validations;
                }

                if ('string' === typeof elm.values) {
                    elm.values = JSON.parse(elm.values).values;
                }

                if (dynamicbind[elm.model] !== undefined) {
                    elm.values = dynamicbind[elm.model];
                }

                if ('string' === typeof elm.link) {
                    elm.link = JSON.parse(elm.link);
                    elm.link.is_link = elm.link.is_link === "Y" ? true : false;
                    elm.link.link_property.isShow = elm.link.link_property.isShow === "Y" ? true : false;
                }

                if (catagory_obj[elm.catagory] === undefined) {
                    catagory_obj[elm.catagory] = {
                        id: i,
                        heading: elm.catagory,
                        name: elm.catagory,
                        fields: [],
                    };
                }

                if ((filter !== undefined && filter !== "") ||
                    (showField !== undefined && showField !== "")) {
                    if ((filter !== undefined && filter !== "")) {
                        if (elm.filter_role.includes(filter)) {
                            catagory_obj[elm.catagory].fields.push({
                                ...elm,
                                validations: [],
                                required: false,
                            });
                        }
                    }
                    if ((showField !== undefined && showField !== "")) {
                        if (elm.show_on.includes(showField)) {
                            catagory_obj[elm.catagory].fields.push({
                                ...elm,
                            });
                        }
                    }
                }
                else {
                    catagory_obj[elm.catagory].fields.push(elm);
                }
            })
        );

        Object.keys(catagory_obj).forEach((elem) => {
            field.push(catagory_obj[elem]);
        });

        return { field, header, initialvalue };
    } catch (error) {
        console.log(error);
    }
};