import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
    Avatar,
    Box,
    Card,
    Checkbox,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    ButtonGroup,
    Button
} from '@mui/material';
import { useEffect, useState } from 'react';
import _ from 'lodash'
// import CustomizedDialogs from '../common/DialogLgBox'

import { useNavigate } from 'react-router-dom';

export const AppTable = (props) => {
    const {
        header = [],
        count = 0,
        items = [],
        onDeselectAll,
        onDeselectOne,
        onPageChange = () => { },
        onRowsPerPageChange,
        onSelectAll,
        onSelectOne,
        page = 0,
        rowsPerPage = 0,
        selected = [],
        onClick = () => { },
        actionsButtons = {},
        getImageFromDocId
    } = props;
    const route = useNavigate()

    if (route == '/customForm') {
        route = 'form'

        //delete, form
        //update, formfield
    }
    else if (route == '/assessment') {
        route = 'formdata'
    }
    else if (route == 'withdraw-requests') {
        route = 'withdraw'
    }

    const [childrenData, setChildrenData] = useState()
    const [open, setOpen] = useState(false);

    const selectedSome = (selected.length > 0) && (selected.length <
        items.length);
    const selectedAll = (items.length > 0) && (selected.length === items.length);
    let [commonindex, setcommonindex] = useState({
        action: {
            index: 0,
            active: false
        },
        avatar: {
            index: 0,
            active: false
        },
        checkbox: {
            index: 0,
            active: false
        }
    })
    const handleEdit = (data, type) => {
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
        }
        else {
            setChildrenData(data)
            setOpen(true)
        }
    }

    // const loadImages = (data) => {
    //     
    //     getImageFromDocId(data.icon[0])
    //         .then((res) => {
    //             return res.records.filter(item => item.id == data.icon[0])[0].file_path
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // }

    return (
        <Card>
            <Box sx={{
                minWidth: 800,
                overflow: 'auto'
            }} >
                <Table size='small'>

                    <TableHead>
                        <TableRow>
                            {header.map((item, i) => {
                                return (
                                    <>
                                        {item.checkbox ? <TableCell key={i} padding="checkbox">
                                            <Checkbox
                                                checked={selectedAll}
                                                indeterminate={selectedSome}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        onSelectAll?.();
                                                    } else {
                                                        onDeselectAll?.();
                                                    }
                                                }}
                                            />
                                        </TableCell> : <TableCell>
                                            {item.title}
                                        </TableCell>}
                                    </>

                                )
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((data, i) => {
                            const isSelected = selected.includes(data.id);
                            return (
                                <TableRow
                                    hover
                                    key={data.id}
                                    selected={isSelected}
                                    onClick={onClick}
                                >
                                    {header.map((hitem, i) => {
                                        return (
                                            <>
                                                {hitem.checkbox &&
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onChange={(event) => {
                                                                if (event.target.checked) {
                                                                    onSelectOne?.(data.id);
                                                                } else {
                                                                    onDeselectOne?.(data.id);
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>}
                                                {hitem.action && <TableCell>
                                                    <ButtonGroup
                                                        disableElevation
                                                        variant="contained"
                                                        aria-label="Disabled elevation buttons"
                                                    >
                                                        {hitem.actionValue.map((v) => {

                                                            return (
                                                                (

                                                                    ((v.name == 'Edit'
                                                                    )
                                                                        &&

                                                                        <Button
                                                                            id={data.id}
                                                                            variant='outlined'
                                                                            onClick={() => handleEdit(data, v.value)}
                                                                        >

                                                                            {v.name}
                                                                        </Button>) ||
                                                                    ((v.name == 'Edit')

                                                                        &&

                                                                        <Button
                                                                            id={data.id}
                                                                            variant='outlined'
                                                                            onClick={() => handleEdit(data, v.value)}
                                                                        >

                                                                            {v.name}
                                                                        </Button>) ||
                                                                    ((v.name == 'Delete')

                                                                        &&
                                                                        <Button
                                                                            id={data.id}
                                                                            variant='outlined'
                                                                            onClick={() => handleEdit(data, v.value)}
                                                                        >
                                                                            {v.name}
                                                                        </Button>) ||
                                                                    ((v.name == 'Password' || v.name === 'View')
                                                                        &&
                                                                        <>
                                                                            {JSON.stringify(v)}
                                                                            {/* <Button
                                                                                id={data.id}
                                                                                variant='outlined'
                                                                                onClick={() => handleEdit(data, v.value)}
                                                                            >
                                                                                {v.name}
                                                                            </Button> */}
                                                                        </>
                                                                    )
                                                                )
                                                            )
                                                        })}
                                                    </ButtonGroup>
                                                    {/* {JSON.stringify(data)} */}

                                                </TableCell>}
                                                {hitem.avatar && <TableCell>
                                                    <Stack
                                                        alignItems="center"
                                                        direction="row"
                                                        spacing={2}
                                                    >
                                                        <img
                                                            alt={hitem.icon}
                                                        // src={loadImages(data)}
                                                        />

                                                        <Typography variant="subtitle2">
                                                            {/* {data.details} */}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                }
                                                {/* {JSON.stringify(hitem)} */}
                                                {!hitem.checkbox &&
                                                    !hitem.action &&
                                                    !hitem.avatar &&
                                                    <TableCell style={hitem.style}>
                                                        {_.get(data, hitem.value)}
                                                    </TableCell>
                                                }
                                            </>
                                        );
                                    })}
                                </TableRow>
                            )

                        })}
                    </TableBody>
                </Table>
            </Box>
            <TablePagination
                component="div"
                count={count}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelDisplayedRows={({ from, to, count }) => {
                    return `${from} to ${to} of ${count}`;
                }}
            />

            {/* <CustomizedDialogs
                childrenData={childrenData}
                open={open}
                setOpen={setOpen}
                type={'bank'}
            /> */}
        </Card>
    );
};

AppTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
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
