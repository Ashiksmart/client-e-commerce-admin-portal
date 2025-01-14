import * as React from 'react';
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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function AppInstall(props) {
    const {
        dialogContent,
        openDialog,
        appLoading,
        setOpenDialog,
        handleDelete
    } = props
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgb(0 0 0 / 7%)',
                zIndex: 1000,
                display: openDialog ? 'flex' : 'none',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            {/* <Dialog
                open={true}
                TransitionComponent={Transition}
                keepMounted
                onClose={setOpenDialog}
                aria-describedby="alert-dialog-slide-description"
            > */}
            <div style={{
                width: 300,
                height: 300,
            }}>

                {
                    appLoading ?
                        <Lottie
                            animationData={appIntallAnim}
                            loop={true} />
                        : <Lottie
                            animationData={appIntallDoneAnim}
                            loop={true} />
                }
            </div>
            {/* </Dialog> */}
        </div>
    )
}

export default function AppDialog(props) {
    const {
        dialogTitle,
        dialogContent,
        openDialog,
        setOpenDialog,
        handleDelete
    } = props


    return (
        <div>
            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={setOpenDialog}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {dialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => openDialog ? setOpenDialog(false) : setOpenDialog(true)}>Cancel</Button>
                    <Button onClick={handleDelete}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}