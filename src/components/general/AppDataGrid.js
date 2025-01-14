import PropTypes from 'prop-types';
import { useEffect, useState, useSelection, useMemo, useDispatch } from 'react';
import { format } from 'date-fns';
import { fDateTime } from '../../utils/formatTime'
import {
    Avatar,
    Box,
    Card,
    Stack,
    Typography,
    Button,
    Badge,
    ButtonGroup
} from '@mui/material';
import _, { max } from 'lodash'
// import CustomizedDialogs from '../common/DialogLgBox'
import ServiceProxy from '../../services/serviceProxy'
import {
    getToken, createCustomHeader, updateCustomHeader, getCustomHeader

} from '../../services/AppService'
import { json, useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar, getGridStringOperators } from '@mui/x-data-grid';


export const AppTable = (props) => {
    const {
        header = [],
        bind_to = [],
        bind_topayload = [],
        count = 0,
        items = [],
        onPageChange = () => { },
        get_table_filter,
        onRowsPerPageChange,
        actionsButtons = {},
        module,
        checkSelection,
        hidefilter,
        permitEl = { update: true, delete: true, attributes: true }
    } = props;
    let get_table_head = {
        user_id: { "$in": [getToken().id] }, module: { "$in": [module] }
    }
    const [mode, setmode] = useState({
        CREATE: "create",
        UPDATE: "update",
        DELETE: "delete",
        PASSWORD: "password",
        FILTER: "filter",
        SEARCH: "search",
        RESET: "reset"
    });
    const [rows, setrows] = useState();
    const [columnVisible_, setcolumnVisible_] = useState({});
    const [columns, setcolumns] = useState([]);
    const [tablevalues, settablevalues] = useState([]);

    function getNestedValue(obj, keys) {
        return keys.split('.').reduce((acc, key) => (acc && acc[key] !== 'undefined' ? acc[key] : undefined), obj);
    }

    useEffect(() => {
        if (items.length > 0) {
            let fetch_data = []
            if (bind_to.length > 0) {


                let fetch_data = [];

                for (let i = 0; i < items.length; i++) {
                    let bind_data_arr = bind_to[i];
                    let transformedObject = {};

                    if (bind_data_arr) {
                        transformedObject = bind_data_arr.reduce((result, obj) => {
                            for (const key in obj) {
                                result[key] = result[key]
                                    ? `${result[key]},${obj[key]}`
                                    : obj[key];
                            }
                            return result;
                        }, {});
                    }

                    let updatedItem = { ...items[i] }; // Create a new object based on the existing item

                    for (let x = 0; x < bind_topayload.length; x++) {
                        const bind_topayloadelm = bind_topayload[x];
                        let key = bind_topayloadelm.key.foreign;
                        let value = bind_topayloadelm.bindAs.name;
                        let keys = key.split('.');
                        let current = updatedItem;

                        for (let j = 0; j < keys.length - 1; j++) {
                            current = current[keys[j]] = { ...current[keys[j]] }; // Create a new object for nested properties
                        }

                        current[keys[keys.length - 1]] = transformedObject[value];
                    }

                    fetch_data.push(updatedItem);
                }

                settablevalues(fetch_data);



            } else {
                settablevalues(items)
            }

            let header_arr = []
            for (let i = 0; i < header.length; i++) {
                let obj = {}
                if (header[i].title === "Actions") {
                    obj = {
                        filterable: false,
                        field: 'actions',
                        headerName: header[i].title,
                        width: 300,
                        sortable: header[i].sort,
                        renderCell: (params) => (
                            <>
                                <ButtonGroup
                                    disableElevation
                                    variant="contained"
                                    aria-label="Disabled elevation buttons"
                                    size='small'
                                    sx={{
                                        overflow: 'hidden'
                                    }}
                                >
                                    {header[i].actionValue.map((item, index) => (
                                        <>
                                            {/* <Button
                                                color='primary'
                                                variant='contained'
                                                onClick={() => handleEdit(params.row, item.value)}
                                            >
                                                {item.name}
                                            </Button> */}
                                            {item.value == "edit" && permitEl?.update &&
                                                params?.row?.icon !== "false" ?
                                                <Button
                                                    color='primary'
                                                    variant='contained'
                                                    onClick={() => handleEdit(params.row, item.value)}
                                                >
                                                    {item.name}
                                                </Button>
                                                : null}
                                            {item.value == "contact_create"
                                                ?
                                                <Button
                                                    color='primary'
                                                    variant='contained'
                                                    onClick={() => handleEdit(params.row, item.value)}
                                                >
                                                    {item.name}
                                                </Button>
                                                : null}
                                            {item.value == "view"
                                                ?
                                                <Button
                                                    color='primary'
                                                    variant='contained'
                                                    onClick={() => handleEdit(params.row, item.value)}
                                                >
                                                    {item.name}
                                                </Button>
                                                : null}
                                            {item.value == "configuration" &&
                                                params.row.page_type !== "pipeline"
                                                ?
                                                <Button
                                                    color='primary'
                                                    variant='contained'
                                                    disabled={params.row.page_type === "client" ? false : true}
                                                    onClick={() => handleEdit(params.row, item.value)}
                                                >
                                                    {item.name}
                                                </Button>
                                                : null}
                                            {item.value == "delete" && permitEl?.delete
                                                ?
                                                <Button
                                                    color='primary'
                                                    variant='contained'
                                                    onClick={() => handleEdit(params.row, item.value)}
                                                >
                                                    {item.name}
                                                </Button>
                                                : null}

                                            {item.value == "password" &&
                                                (params.row?.additional_info ? JSON.parse(params.row?.additional_info).auth_req == "Y" : false)
                                                ?
                                                <>
                                                    <Button
                                                        color='primary'
                                                        variant='contained'
                                                        onClick={() => handleEdit(params.row, item.value)}
                                                    >
                                                        {item.name}
                                                    </Button>
                                                </>
                                                : null
                                            }
                                            {item.value == "add_attr" && permitEl?.attributes
                                                ? <Button
                                                    color='primary'
                                                    variant='contained'
                                                    onClick={() => handleEdit(params.row, item.value)}
                                                >
                                                    {item.name}
                                                </Button>
                                                : null
                                            }
                                            {item.value == "approval" && valueGetformObject(item.condition.prop, params.row) == item.condition.value
                                                ? <Button
                                                    color='primary'
                                                    variant='contained'
                                                    onClick={() => handleEdit(params.row, item.value)}
                                                >
                                                    {item.name}
                                                </Button>
                                                : null
                                            }
                                            {(item.value == "viewmore" || item.value == "assign")
                                                ? <Button
                                                    color='primary'
                                                    variant='contained'
                                                    onClick={() => handleEdit(params.row, item.value)}
                                                >
                                                    {item.name}
                                                </Button>
                                                : null
                                            }
                                            {(item.value == "status")
                                                ? <Button
                                                    color='primary'
                                                    variant='contained'
                                                    disabled={((params.row.work_status === "completed" || params.row.work_status === "close")) ? true : false}
                                                    onClick={() => handleEdit(params.row, item.value)}
                                                >
                                                    {item.name}
                                                </Button>
                                                : null
                                            }
                                        </>

                                    ))}
                                </ButtonGroup>
                            </>

                        ),
                    }
                }
                else {
                    obj = {
                        filterable: header[i].filterable,
                        field: header[i].value,
                        headerName: header[i].title,
                        width: 150,
                        sortable: header[i].sort,
                        filterOperators: getGridStringOperators().filter(
                            (operator) => {
                                if (operator.value === 'equals') {
                                    return operator
                                }
                            },
                        ),
                        valueGetter: (params) => {
                            if (header[i].type == "datetime") {
                                return fDateTime(_.get(params.row, header[i].value))
                            }
                            return _.get(params.row, header[i].value)
                        }
                    }
                }
                // 
                if (header[i].badge) {
                    obj = {
                        filterable: header[i].filterable,
                        field: header[i].value,
                        headerName: header[i].title,
                        width: 150,
                        sortable: header[i].sort,
                        filterOperators: getGridStringOperators().filter(
                            (operator) => {
                                if (operator.value === 'equals') {
                                    return operator
                                }
                            },
                        ),
                        renderCell: (params) => (
                            <div style={{
                                margin: 'auto'
                            }}>
                                <Badge
                                    color={_.get(params.row, header[i].value) == "Y" ? "success" : "error"}
                                >
                                    {_.get(params.row, header[i].value) == "Y" ?
                                        <span style={{
                                            backgroundColor: '#2d7f2d',
                                            borderRadius: 12,
                                            paddingLeft: 10,
                                            paddingRight: 10,
                                            color: 'white',
                                            fontSize: 13
                                        }}>
                                            {header[i].title == "Stock" ? "InStock" : "Yes"}
                                        </span>
                                        :
                                        <span style={{
                                            backgroundColor: '#d34f4f',
                                            borderRadius: 12,
                                            paddingLeft: 10,
                                            paddingRight: 10,
                                            color: 'white',
                                            fontSize: 13
                                        }}>
                                            {header[i].title == "Stock" ? "Out of Stock" : "No"}
                                        </span>
                                    }
                                </Badge>
                            </div>
                        ),
                    }
                }
                if (header[i].badge) {

                }
                if (header[i].avatar) {
                    obj["renderCell"] = (params) => (
                        <>
                            <Stack
                                alignItems="flex-start"
                                justifyContent={"flex-start"}
                                direction="row"
                                spacing={2}
                                flexWrap={'wrap'}
                                gap={2}
                                key={i}
                            >
                                <Button
                                    variant='outlined'
                                    onClick={() => handleEdit(params.row, "view_img")}
                                >
                                    View Images
                                </Button>
                                {/* {params.row.icon_file_path && params.row.icon_file_path.map((img, index) => (
                                    <img
                                        key={index}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 4,
                                            marginLeft: 0
                                        }}
                                        alt={`Icon ${index}`}
                                        src={img}
                                    />
                                ))}
                                {params.row.details && params.row.details.icon_file_path &&
                                    params.row.details.icon_file_path.map((img, index) => (
                                        <img
                                            key={index}
                                            style={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 4,
                                                marginLeft: 0
                                            }}
                                            alt={`Icon ${index}`}
                                            src={img}
                                        />
                                    ))} */}
                                {/* <Typography variant="subtitle2">
                                {_.get(data, hitem.value)} 
                            </Typography> */}
                            </Stack>

                        </>

                    )
                }
                header_arr.push(obj)

            }
            setcolumns(header_arr)
            setrows(items)
            getcolumn()
        } else {
            settablevalues(items)
        }
    }, [items])

    function AvatarCell(params) {
        return <Avatar>{params.value}</Avatar>;
    }

    const handlePaginationModelChange = (pagination) => {
        onPageChange(pagination.page)
        onRowsPerPageChange(pagination.pageSize)
    };
    const handleSelectionModelChange = (value) => {
        console.log(value, "dddddddddddddddddd")
    };
    const getfilter = async (value) => {
        get_table_filter(value)
    };

    const handleEdit = (selectedvalue, type) => {
        let data
        for (let i = 0; i < items.length; i++) {
            if (selectedvalue.id === items[i].id) {
                data = items[i]
            }
        }
        console.log(selectedvalue, items, "uuuuuuuuuuuuuuuuuuuuuuu")
        if (type === 'edit') {
            actionsButtons.edit(data)
        } else if (type === 'approval') {
            actionsButtons.approval(data)
        } else if (type === 'read') {
            actionsButtons.read(data)
        } else if (type === 'delete') {
            actionsButtons.delete(data)
        } else if (type === 'password') {
            actionsButtons.password(data)
        } else if (type === 'configuration') {
            actionsButtons.configuration(data)
        } else if (type === 'add_attr') {
            actionsButtons.addAttr(data)
        }
        else if (type === 'view') {
            actionsButtons.viewRecord(data)
        }
        else if (type === 'contact_create') {
            actionsButtons.createContact(data)
        }
        else if (type === 'view_img') {
            actionsButtons.viewImg(data)
        }
        else if (type === 'viewmore') {
            actionsButtons.viewmore(data)
        }
        else if (type === 'status') {
            actionsButtons.status(data)
        }
        else if (type === 'download_invoice') {
            actionsButtons.download_invoice(data)
        }
        else if (type === 'assign') {
            actionsButtons.assign(data)
        }

    }
    const getcolumn = async (value) => {
        let get_custom_table_header = await getCustomHeader(get_table_head)
        if (get_custom_table_header && get_custom_table_header.records.length > 0) {
            setcolumnVisible_(JSON.parse(get_custom_table_header.records[0].header))
        }
    }
    const columnVisible = async (value) => {
        let createObj = {
            account_id: getToken().account_id,
            user_id: getToken().id,
            header: value,
            module: module
        }
        let get_custom_table_header = await getCustomHeader(get_table_head)
        if (get_custom_table_header.cursor.totalRecords > 0) {
            createObj['id'] = get_custom_table_header.records[0].id
            updateCustomHeader(createObj)
            setcolumnVisible_(value)
        } else {
            createCustomHeader(createObj)
            setcolumnVisible_(value)
        }

    }
    function valueGetformObject(keys, object) {
        var keys = keys.split(".");
        var result = object;
        for (var i = 0; i < keys.length; i++) {
            if (keys.length > 1 && i == 0 && typeof result[keys[i]] == "string") {
                result = JSON.parse(result[keys[i]]);
            } else {
                result = result[keys[i]] || {};
            }
        }
        return result;
    }

    return (
        <Card>
            <Box sx={{
                minWidth: 800,
                overflow: 'auto'
            }} >
                <DataGrid
                    pagination
                    checkboxSelection={checkSelection}
                    rows={tablevalues}
                    columns={columns}
                    onPaginationModelChange={handlePaginationModelChange}
                    rowCount={count}
                    filterMode={'server'}
                    paginationMode="server"
                    columnVisibilityModel={columnVisible_}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    // onRowSelectionModelChange={handleSelectionModelChange}
                    onColumnVisibilityModelChange={columnVisible}
                    onFilterModelChange={getfilter}
                    localeText={{
                        noRowsLabel: 'No Records Found.'
                    }}
                    disableColumnFilter={hidefilter}
                //future use
                // slots={{ toolbar: GridToolbar }}

                // disableDensitySelector
                // disableExport={true}
                //future use
                />


            </Box>
        </Card>
    );
};

AppTable.propTypes = {
    get_table_filter: PropTypes.func,
    count: PropTypes.number,
    items: PropTypes.array,
    bind_to: PropTypes.array,
    bind_topayload: PropTypes.array,
    onDeselectAll: PropTypes.func,
    onDeselectOne: PropTypes.func,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    onSelectAll: PropTypes.func,
    onSelectOne: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    selected: PropTypes.array,
    onClick: PropTypes.func,
    actionsButtons: PropTypes.object
};
