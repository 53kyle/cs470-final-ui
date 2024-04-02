import React, {useState, useEffect, Fragment} from 'react';
import API from "../../../API/API_Interface";

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function EmployeeSummary({ user }) {
    const [mainSummary, setMainSummary] = useState(null);
    const [trainedSummary, setTrainedSummary] = useState(null);
    const [availabilitySummary, setAvailabilitySummary] = useState(null);
    const [requestsSummary, setRequestsSummary] = useState(null);


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

                console.log("Employee: " + JSON.stringify(user.employee_id))
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
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
            >
                <Typography component="div" variant="h3" mb={3}>
                    Employee Summary
                </Typography>
                {user && (
                    <Box mb={3}>
                        <Typography variant="h5">
                            Main Summary
                        </Typography>
                        <Typography variant="body1">
                            Employee ID: {user.employee_id}
                        </Typography>
                        <Typography variant="body1">
                            Name: {user.first_name} {user.middle_name} {user.last_name}
                        </Typography>
                        <Typography variant="body1">
                            Admin: {user.permission ? "Yes" : "No"}
                        </Typography>
                        <Typography variant="body1">
                            Max Hours: {user.max_hours}
                        </Typography>
                    </Box>
                )}
                {trainedSummary && (
                    <Box mb={3}>
                        <Typography variant="h5">
                            Trained Departments
                        </Typography>
                        <ol>
                            {trainedSummary.map((item, index) => (
                                <li key={index}>
                                    {item.department}
                                </li>
                            ))}
                        </ol>
                    </Box>
                )}
                {availabilitySummary && (
                    <Box mb={3}>
                        <Typography variant="h5">
                            Availability
                        </Typography>
                        <table>
                            <thead>
                            <tr>
                                <th>Day</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {availabilitySummary.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.day_of_week}</td>
                                    <td>{item.start_time}</td>
                                    <td>{item.end_time}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </Box>
                )}
                {requestsSummary && (
                    <Box mb={3}>
                        <Typography variant="h5">
                            Requests
                        </Typography>
                        <ol>
                            {requestsSummary.map((item, index) => (
                                <li key={index}>
                                    {item.request_description}
                                </li>
                            ))}
                        </ol>
                    </Box>
                )}
            </Box>
        </Fragment>
    );
}

export default EmployeeSummary;