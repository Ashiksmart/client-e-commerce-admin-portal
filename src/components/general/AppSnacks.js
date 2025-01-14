import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AppSnacks(props) {
    const {
        snackProps,
        setSnackProps
    } = props
    const handleClose = () => {
        console.log("sd");
        setSnackProps((prevSnackProps) => {
            return {
                ...prevSnackProps,
                snackOpen: false
            };
        });
    };
    // const handleClose = () => {
    //     
    //     setSnackProps((prevSnackProps) => {
    //         prevSnackProps.snackOpen = false
    //         return prevSnackProps
    //     })
    //     
    // }

    return (
        <>
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar onClose={handleClose}
                    open={snackProps.snackOpen} autoHideDuration={4000}>
                    <Alert onClose={handleClose} severity={snackProps.severity} sx={{ width: '100%' }}>
                        {snackProps.message}
                    </Alert>
                </Snackbar>
            </Stack>
        </>
    );
}
