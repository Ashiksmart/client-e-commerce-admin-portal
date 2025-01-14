import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Leads from '../Crm/leads';
import Deals from '../Crm/Deals';
import Contacts from '../Crm/Contact';
import Accounts from '../Crm/Account';
import Activity from '../Crm/Activity';
import { useSelector } from 'react-redux'
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            style={{
                width: "100%"
            }}
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{
                    paddingLeft: 2,
                    paddingRight: 2,
                    width: "100%"
                }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export default function VerticalTabs(props) {
    let { value, process,selected_data } = props
    let AppPerState = useSelector(state => state.permisson.permission)
    const [tabvalue, setTabValue] = React.useState({});
    React.useEffect(() => {
        setTabValue(props.TabValue);
    }, [props.TabValue]);

    const handleChange = (event, newValue) => {
        console.log(newValue, "vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
        props.tabhandleChange(newValue);
        setTabValue((prev) => ({ ...prev, default: newValue }));
    };
    console.log(props);
    console.log(tabvalue);
    let permitCheck = (value) => {
        return AppPerState.indexOf(`${value}:view`) != -1
    }
    return (
        <Box
            sx={{
                width: "100%",
                flexGrow: 3,
                bgcolor: 'background.paper',
                display: 'flex',
            }}
        >
            {Object.keys(tabvalue).length > 0 && (
                <>
                    <Tabs
                        orientation="vertical"
                        variant="fullWidth"
                        value={tabvalue.default}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                        >
                        {tabvalue.tab.map((tabdata) => (
                            <Tab
                                key={tabdata.index}
                                label={tabdata.name}
                                {...{
                                    id: `vertical-tab-${tabdata.index}`,
                                    'aria-controls': `vertical-tabpanel-${tabdata.index}`,
                                }}
                            />
                        ))}
                    </Tabs>
                    {tabvalue.tab.map((tabdata ) => (
                        <TabPanel key={tabdata.index} value={tabvalue.default} index={tabdata.index}>
                            {tabdata.value === "leads" && permitCheck(`${process}_${"crm_leads"}`) && <Leads value={'crm_leads'} process={process} handleClose={(() => {
                                props.handleClose()
                            })} default_module={tabvalue.default_module} filter={tabdata.filter} tabdata={tabdata}></Leads>}
                            {tabdata.value === "contacts" && permitCheck(`${process}_${'crm_leads'}`) && <Contacts selected_data={selected_data } tabdata={tabdata} value={'crm_leads'} process={process} handleClose={(() => {
                                props.handleClose()
                            })} default_module={tabvalue.default_module} filter={tabdata.filter}></Contacts>}
                            {tabdata.value === "deals" && permitCheck(`${process}_${'crm_deals'}`) && <Deals value={'crm_deals'} tabdata={tabdata} process={process} handleClose={(() => {
                                props.handleClose()
                            })} default_module={tabvalue.default_module} filter={tabdata.filter}></Deals>}
                            {tabdata.value === "account" && permitCheck(`${process}_${"crm_company"}`) && <Accounts value={'crm_company'} tabdata={tabdata} process={process} handleClose={(() => {
                                props.handleClose()
                            })} default_module={tabvalue.default_module} filter={tabdata.filter} model={tabdata.model}></Accounts>}
                            {tabdata.value === "activity" && <Activity tabdata={tabdata} value={'crm_activity'} process={process} handleClose={(() => {
                                props.handleClose()
                            })} default_module={tabvalue.default_module} filter={tabdata.filter}></Activity>}
                            {/* {tabdata.value==="history"&&<div>444444444444444</div>} */}

                        </TabPanel>
                    ))}
                </>
            )}
        </Box>
    );
}
