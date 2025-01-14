import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Iconify from '../../../components/iconify';
import { Stack } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export default function AppDrawer(props) {
    const {
        children,
        setDrawerOpen,
        drawerOpen
    } = props

    return (
        <div>
            {['right'].map((anchor) => (
                <React.Fragment key={anchor} >
                    {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
                    <Drawer
                        anchor={anchor}
                        open={drawerOpen}
                        onClose={() => drawerOpen ? setDrawerOpen(false) : setDrawerOpen(true)}

                    >
                        <Stack
                            sx={{
                                height: 45,
                                backgroundColor: '#f8f8f8',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: 10,
                                    height: 25,
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    opacity: 0.8,
                                }}
                                onClick={() => setDrawerOpen(false)}
                            >
                                <Iconify
                                    icon="basil:cancel-solid"
                                    width="40px"
                                />
                            </Box>
                        </Stack>
                        <Box
                            sx={{
                                width: 'auto',
                                minWidth: 650,
                                maxWidth: 700,
                                overflow: 'hidden',
                            }}
                            role="presentation"
                        >
                            {children}
                        </Box>
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}
