import React, {useState, useEffect, Fragment} from 'react';
import API from "../../../API/API_Interface";
import {capitalize, CircularProgress, Divider, Paper, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import DateHelper from "../../../Utils/DateHelper";
import ScheduleHelper from "../../../Utils/ScheduleHelper";

const ContentBox = ({title, content}) => {
    return <Paper elevation={3} sx={{ mb: 2 , width: "100%"}}>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            m: 3
        }}>
            <Typography component="div" variant='h5'>
                {
                    title
                }
            </Typography>
            <Divider orientation="horizontal" flexItem sx={{ mt: 2, mb: 2 }} />
            {
                content == null &&
                <CircularProgress />
            }
            {
                content
            }
        </Box>
    </Paper>
}

function AdminSummary({ user }) {
    const [mainSummary, setMainSummary] = useState(null);
    const [trainedSummary, setTrainedSummary] = useState(null);
    const [availabilitySummary, setAvailabilitySummary] = useState(null);
    const [requestsSummary, setRequestsSummary] = useState(null);
    const [nextShift, setNextShift] = useState(null);
    const [lastPunch, setLastPunch] = useState(null);
    const [availabilityTimeOffPendingCount, setAvailabilityTimeOffPendingCount] = useState(null);
    const [punchInPendingCount, setPunchInPendingCount] = useState(null);

    const todaysDate = () => {
        const dateAsDate = new Date()

        return dateAsDate.getTime()
    }

    const availabilityForWeekday = (weekday) => {
        return availabilitySummary.filter((availability) => availability.day_of_week === weekday)
    }

    useEffect(() => {

        async function fetchData() {

            try {
                const api = new API();

                const trainedResponse = await api.trainedSummaryWithID(user.employee_id);
                setTrainedSummary(trainedResponse.data);

                const availabilityResponse = await api.availabilitySummaryWithID(user.employee_id);
                setAvailabilitySummary(availabilityResponse.data);

                const requestsResponse = await api.requestsSummaryWithID(user.employee_id);
                setRequestsSummary(requestsResponse.data);

                const nextShiftResponse = await api.nextShiftForEmployee(user.employee_id);
                setNextShift(nextShiftResponse.data)

                const lastPunchResponse = await api.lastPunchForEmployee(user.employee_id);
                setLastPunch(lastPunchResponse.data)

                const availabilityTimeOffPendingCountResponse = await api.availabilityTimeOffPendingCount();
                setAvailabilityTimeOffPendingCount(availabilityTimeOffPendingCountResponse.data);
                console.log(availabilityTimeOffPendingCountResponse.data);

                const punchInPendingCountResponse = await api.punchInPendingCount();
                setPunchInPendingCount(punchInPendingCountResponse.data);
                console.log(punchInPendingCountResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [user]);

    return (
        <Fragment>
            <Box
                display="flex"
                justifyContent="start"
                flexDirection="row"
                alignItems="start"
                textAlign="start"
            >
                <Box
                    width={400}
                    display="flex"
                    justifyContent="center"
                    flexDirection="column"
                    alignItems="start"
                    textAlign="start"
                >
                    {user && (
                        <Box mb={3}>
                            <Typography variant="h4">
                                {user.first_name} {user.middle_name} {user.last_name}
                            </Typography>
                            <Typography variant="h6">
                                Employee ID: {user.employee_id}
                            </Typography>
                        </Box>
                    )}
                    <ContentBox title="Trained Departments" content={
                        trainedSummary && (
                            trainedSummary.map((item, index) => (
                                <Typography key={index} variant="h6">
                                    {capitalize(item.department)}
                                </Typography>
                            ))
                        )}/>
                    <ContentBox title="Current Availability" content={
                        availabilitySummary && (
                            ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((item) => (
                                <Box key={item} width="100%">
                                    <Typography variant="h6">
                                        {capitalize(item)}
                                    </Typography>
                                    <Typography variant="body">
                                        {
                                            availabilityForWeekday(item) && availabilityForWeekday(item).length > 0 ? `${DateHelper.formatTime(availabilityForWeekday(item)[0].start_time)} - ${DateHelper.formatTime(availabilityForWeekday(item)[0].end_time)}` : "OFF"
                                        }
                                    </Typography>
                                    {
                                        item !== "Saturday" &&
                                        <Divider orientation="horizontal" flexItem sx={{ mt: 2, mb: 2 }} />
                                    }
                                </Box>
                            ))
                        )}/>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ ml: 2, mr: 2 }} />
                <Box
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="start"
                >
                    <Typography variant="h6">
                        {"Today's Date"}
                    </Typography>
                    <Typography variant="h4" fontWeight="medium" mb={3}>
                        {DateHelper.shortDateFormat(todaysDate())}
                    </Typography>
                    {
                        (availabilityTimeOffPendingCount || punchInPendingCount) &&
                        <ContentBox title="Needs Attention" content={
                            <Box
                                width="100%"
                                display="flex"
                                flexDirection="row"
                            >
                                <Box
                                    width="100%"
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                >
                                    <Typography variant="h6">
                                        {"Availability & Time Off Requests"}
                                    </Typography>
                                    <Typography variant="h4">
                                        {
                                            availabilityTimeOffPendingCount && availabilityTimeOffPendingCount.length > 0 &&
                                            availabilityTimeOffPendingCount[0].total_pending_count
                                        }
                                    </Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ ml: 2, mr: 2 }} />
                                <Box
                                    width="100%"
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                >
                                    <Typography variant="h6">
                                        {
                                            "Punches"
                                        }
                                    </Typography>
                                    <Typography variant="h4">
                                        {
                                            punchInPendingCount && punchInPendingCount.length > 0 &&
                                            punchInPendingCount[0].count
                                        }
                                    </Typography>
                                </Box>
                            </Box>
                        }/>
                    }
                    {
                        lastPunch &&
                        <ContentBox title="Last Punch" content={
                            lastPunch.length > 0 ?
                                <Box
                                    width="100%"
                                    display="flex"
                                    flexDirection="column"
                                >
                                    <Typography variant="h6">
                                        {`${DateHelper.shortDateFormat(DateHelper.textToDate(lastPunch[0].punchin))} at ${DateHelper.friendlyTimeFormat(DateHelper.textToDate(lastPunch[0].punchin))}${lastPunch[0].approved ? "" : "*"}`}
                                    </Typography>
                                    <Typography variant="body" mb={0.5}>
                                        {capitalize(lastPunch[0].punch_type)}
                                    </Typography>
                                </Box>
                                : "No Recent Punches"
                        }/>
                    }
                    {
                        nextShift &&
                        <ContentBox title="Next Upcoming Shift" content={
                            nextShift.length > 0 ?
                                <Box
                                    width="100%"
                                    display="flex"
                                    flexDirection="column"
                                >
                                    <Typography variant="h6">
                                        {`${DateHelper.shortDateFormat(DateHelper.textToDate(nextShift[0].start_time))} from ${ScheduleHelper.getTimesForShift(nextShift[0])}`}
                                    </Typography>
                                    <Typography variant="body" mb={0.5}>
                                        {`Meal: ${ScheduleHelper.getMealTimesForShift(nextShift[0])}`}
                                    </Typography>
                                    <Typography variant="body" mb={0.5}>
                                        {capitalize(nextShift[0].department)}
                                    </Typography>
                                    <Typography variant="body">
                                        {`${ScheduleHelper.getHoursForShift(nextShift[0])} hours`}
                                    </Typography>
                                </Box>
                                : "No Upcoming Shifts"
                        }/>
                    }
                    {
                        requestsSummary &&
                        <ContentBox title="Upcoming Time Off" content={
                            requestsSummary.filter((request) => request.status === "Approved").length > 0 ? (
                                requestsSummary.filter((request) => request.status === "Approved").map((item, index) => (
                                    <Box key={index} width="100%">
                                        <Typography variant="h6">
                                            {
                                                `${DateHelper.shortDateFormat(DateHelper.textToDate(item.start_time))} - ${DateHelper.shortDateFormat(DateHelper.textToDate(item.end_time))}`
                                            }
                                        </Typography>
                                        <Typography variant="body">
                                            {
                                                item.reason
                                            }
                                        </Typography>
                                        {
                                            index !== requestsSummary.filter((request) => request.status === "Approved").length - 1 &&
                                            <Divider orientation="horizontal" flexItem sx={{mt: 2, mb: 2}}/>
                                        }
                                    </Box>
                                ))
                            ) : "No Upcoming Time Off"}/>
                    }
                </Box>
            </Box>
        </Fragment>
    );
}

export default AdminSummary;