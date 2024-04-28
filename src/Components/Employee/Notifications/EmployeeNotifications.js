import React, {useState, useEffect, Fragment} from 'react';
import API from "../../../API/API_Interface";
import ContentBox from "../../Generic/ContentBox";
import {capitalize, CircularProgress, Divider, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DateHelper from "../../../Utils/DateHelper";
import ScheduleHelper from "../../../Utils/ScheduleHelper";
import CircleIcon from '@mui/icons-material/Circle';
import ModalContentBox from "../../Generic/ModalContentBox";

function EmployeeNotifications({user}) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {

        async function fetchData() {

            try {
                const api = new API();

                const notificationsResponse = await api.getNotificationsForEmployee(user.employee_id);
                setNotifications(notificationsResponse.data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [user]);

    return (
        <ModalContentBox title="Notifications" content={
            notifications.length > 0 ? notifications.map((item, index) => (
                <Fragment key={index}>
                    <Box
                        display="flex"
                        justifyContent="start"
                        flexDirection="row"
                        alignItems="start"
                        textAlign="start"
                    >
                        {
                            item.unread === 1 &&
                            <CircleIcon fontSize="18pt" color="primary" sx={{
                                mr: 1
                            }}/>
                        }
                        <Typography variant="body">
                            {`${DateHelper.shortDateFormat(DateHelper.textToDate(item.time))} at ${DateHelper.friendlyTimeFormat(DateHelper.textToDate(item.time))}`}
                        </Typography>
                    </Box>
                    <Typography variant="h6">
                        {item.message}
                    </Typography>
                    {
                        index !== notifications.length - 1 &&
                        <Divider orientation="horizontal" flexItem sx={{mt: 2, mb: 2}}/>
                    }
                </Fragment>
            )) : "No Notifications"
        }/>
    )
}

export default EmployeeNotifications;