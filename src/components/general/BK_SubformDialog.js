import * as React from 'react';
import { useEffect, useState, useSelection, useMemo, useDispatch } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Lottie from 'lottie-react';
import appIntallAnim from "../../assets/loadingApp.json";
import appIntallDoneAnim from "../../assets/appInstallDone.json";
import AppForm from '../../pages/AppForm';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Stack } from '@mui/material';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AppSubDialog(props) {
    const {
        dialogTitle,
        dialogContent,
        openDialog,
        setOpenDialog,
        confirm, mode, TemplateApiFlds, editData,
        
    } = props
    const [LoopForm, setLoopForm] = useState([])
    const [Loader, setLoader] = useState(false)
    const [StoreApiData, setStoreApiData] = useState([])

    console.log(TemplateApiFlds);

    useEffect(() => {
        if (Object.keys(TemplateApiFlds).length > 0 && editData.length === 0) {
            let arr = LoopForm
            arr.push({
                ...TemplateApiFlds,
                initialValues: {},
                action: mode.UPDATE,
                skipped: [],
                index: 1

            })
            setLoopForm(arr)
            setLoader(true)
        } else if (Object.keys(TemplateApiFlds).length > 0 && editData.length > 0) {
            let arr = LoopForm
            for (let i = 0; i < editData.length; i++) {
                const element = editData[i];

                arr.push({
                    ...TemplateApiFlds,
                    initialValues: element,
                    action: mode.UPDATE,
                    skipped: [],
                    index: i

                })

            }

            setLoopForm(arr)
            setLoader(true)
        }

    }, [TemplateApiFlds, editData])

    let addformField = async (data_) => {
        await setLoader(false)
        let loopcount = LoopForm


        loopcount.push({
            ...TemplateApiFlds,
            initialValues: {},
            action: mode.UPDATE,
            skipped: [],
            index: (loopcount[loopcount.length - 1]["index"]) + 1

        })
        setLoopForm(loopcount)
        await setLoader(true)
    }
    let action = async (data, typeMode, index, onsubmit_) => {
        try {
            await setLoader(false)
            if (onsubmit_) {
                let arr = []
                let loopcount = []
                for (let i = 0; i < LoopForm.length; i++) {
                    if (LoopForm[i].index === index) {
                        LoopForm[i].initialValues = data
                        LoopForm[i].action = mode.UPDATE
                        loopcount.push(LoopForm[i])
                        arr.push(data)
                    } else {
                        loopcount.push(LoopForm[i])
                        arr.push(StoreApiData[i])
                    }

                }
                setLoopForm(loopcount)
                setStoreApiData(arr)
                confirm(arr)
            }
            // else if (typeMode == mode.CREATE) {
            //     // let arr = StoreApiData
            //     let loopcount = LoopForm
            //     // for (let i = 0; i < LoopForm.length; i++) {
            //     //     if (LoopForm[i].index === index) {
            //     //         LoopForm[i].initialValues = data
            //     //         LoopForm[i].action = mode.UPDATE
            //     //         loopcount.push(LoopForm[i])
            //     //     } else {
            //     //         loopcount.push(LoopForm[i])
            //     //     }

            //     // }
            //     // arr.push(data)
            //     loopcount.push({
            //         ...TemplateApiFlds,
            //         initialValues: {},
            //         action: mode.UPDATE,
            //         skipped: [],
            //         index: (loopcount[loopcount.length - 1]["index"]) + 1

            //     })
            //     setLoopForm(loopcount)
            //     // setStoreApiData(arr)
            // }
            else if (typeMode == mode.UPDATE) {
                let arr = []
                let loopcount = []
                for (let i = 0; i < LoopForm.length; i++) {
                    if (LoopForm[i].index === index) {
                        LoopForm[i].initialValues = data
                        LoopForm[i].action = mode.UPDATE
                        loopcount.push(LoopForm[i])
                        arr.push(data)
                    } else {
                        loopcount.push(LoopForm[i])
                        arr.push(StoreApiData[i])
                    }

                }
                if (LoopForm.length === 1) {
                    loopcount.push({
                        ...TemplateApiFlds,
                        initialValues: {},
                        action: mode.UPDATE,
                        skipped: [],
                        index: (loopcount[loopcount.length - 1]["index"]) + 1

                    })
                }
                setLoopForm(loopcount)
                setStoreApiData(arr)

            } else if (typeMode == mode.DELETE) {
                let arr = []
                let loopcount = []
                for (let i = 0; i < LoopForm.length; i++) {
                    if (LoopForm[i].index !== index) {
                        loopcount.push(LoopForm[i])
                        arr.push(StoreApiData[i])
                    }

                }
                setLoopForm(loopcount)
                setStoreApiData(arr)
            }
            await setLoader(true)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <>

            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={setOpenDialog}
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle>
                    <Stack sx={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        {dialogTitle}
                        <div>
                            {LoopForm.length > 1 && <Button onClick={() => { addformField() }} >Add</Button>}

                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() => openDialog ? setOpenDialog(false) : setOpenDialog(true)}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Stack>
                        {/* {JSON.stringify(LoopForm)} */}
                        {Loader && LoopForm.map((elm, i) => (
                            <>
                                {Object.keys(TemplateApiFlds).length > 0 && (
                                    <AppForm
                                        formSchema={elm}
                                        action={(data, typeMode, onsubmit_) => {
                                            action(data, typeMode, elm.index, onsubmit_)
                                        }}
                                        mode={mode}
                                        subform={true}
                                        allObj={false}
                                        indexvalue={LoopForm}
                                        index={i}
                                    />
                                )}

                            </>
                        ))}
                    </Stack>

                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={() => openDialog ? setOpenDialog(false) : setOpenDialog(true)}>Cancel</Button> */}
                    {/* <Button onClick={handleDelete}>Confirm</Button> */}
                </DialogActions>
            </Dialog>
        </>

    );
}