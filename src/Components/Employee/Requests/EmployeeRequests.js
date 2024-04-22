import React, { useState, useEffect, Fragment } from 'react';
import API from "../../../API/API_Interface";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { FcSettings } from "react-icons/fc";
import { FcFullTrash } from "react-icons/fc";
import { FcEditImage } from "react-icons/fc";

const timeOffTableAttributes = [
    {
        title: 'Start Time',
        attributeDBName: 'start_time',
        align: 'left'
    },
    {
        title: 'End Time',
        attributeDBName: 'end_time',
        align: 'left'
    },
    {
        title: 'Reason',
        attributeDBName: 'reason',
        align: 'left'
    },
    {
        title: 'Status',
        attributeDBName: 'status',
        align: 'left'
    }
];

const availabilityRequestsTableAttributes = [
    {
        title: 'Day',
        attributeDBName: 'day_of_week',
        align: 'left'
    },
    {
        title: 'Start Time',
        attributeDBName: 'start_time',
        align: 'left'
    },
    {
        title: 'End Time',
        attributeDBName: 'end_time',
        align: 'left'
    },
    {
        title: 'Status',
        attributeDBName: 'status',
        align: 'left'
    }
];

const RequestsTable = ({ user }) => {
    const [timeOffRequests, setTimeOff] = useState([]);
    const [availabilityRequests, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRequest, setselectedRequest] = useState(null);

    useEffect(() => {
        const fetchTimeOff = async () => {
            try {
                const api = new API();
                const requestsJSONString = await api.timeOffRequestByID(user.employee_id);
                setTimeOff(requestsJSONString.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        const fetchAvailability = async () => {
            try {
                const api = new API();
                const requestsJSONString = await api.availabilityRequestsByID(user.employee_id);
                setAvailability(requestsJSONString.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchTimeOff();
        fetchAvailability();
    }, []);

    const handleGearClick = (event, request) => {
        setAnchorEl(event.currentTarget);
        setselectedRequest(request);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleClosePopover();
        // Add your approve logic here
    };

    const handleRemove = () => {
        handleClosePopover();
        // Add your deny logic here
    };

    const formatDate = (dateString) => {
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const renderTimeOffTableRow = (requestObject, index) => (
        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            {timeOffTableAttributes.map((attr, idx) => (
                <TableCell key={idx} align={attr.align}>
                    {attr.attributeDBName ? (attr.attributeDBName.includes('time') ? formatDate(requestObject[attr.attributeDBName]) : requestObject[attr.attributeDBName]) : null}
                </TableCell>
            ))}
            {requestObject.status === 'pending' && (
            <TableCell align="right">
                <IconButton onClick={(event) => handleGearClick(event, requestObject)}>
                    <FcSettings />
                </IconButton>
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <FcEditImage />
                        </ListItemIcon>
                        <Typography variant="inherit">Edit</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleRemove}>
                        <ListItemIcon>
                            <FcFullTrash />
                        </ListItemIcon>
                        <Typography variant="inherit">Remove</Typography>
                    </MenuItem>
                </Popover>
            </TableCell>
            )}
        </TableRow>
    );

    const renderAvailabilityTableRow = (requestObject, index) => (
        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            {availabilityRequestsTableAttributes.map((attr, idx) => (
                <TableCell key={idx} align={attr.align}>
                    {requestObject[attr.attributeDBName]}
                </TableCell>
            ))}
            {requestObject.status === 'Pending' && (
            <TableCell align="right">
            <IconButton onClick={(event) => handleGearClick(event, requestObject)}>
                    <FcSettings />
                </IconButton>
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >

                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <FcEditImage />
                        </ListItemIcon>
                        <Typography variant="inherit">Edit</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleRemove}>
                        <ListItemIcon>
                            <FcFullTrash />
                        </ListItemIcon>
                        <Typography variant="inherit">Remove</Typography>
                    </MenuItem>
                </Popover>
            </TableCell>
            )}
        </TableRow>
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Fragment>
            <Typography variant="h6" gutterBottom component="div">
                Time off Requests
            </Typography>
            <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
                <Table sx={{ minWidth: 650 }} aria-label="time-off requests table">
                    <TableHead>
                        <TableRow>
                            {timeOffTableAttributes.map((attr, idx) => (
                                <TableCell key={idx} align={attr.align}>
                                    {attr.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timeOffRequests.map((request, idx) => renderTimeOffTableRow(request, idx))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h6" gutterBottom component="div">
                Availability Requests
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="availability requests table">
                    <TableHead>
                        <TableRow>
                            {availabilityRequestsTableAttributes.map((attr, idx) => (
                                <TableCell key={idx} align={attr.align}>
                                    {attr.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {availabilityRequests.map((request, idx) => renderAvailabilityTableRow(request, idx))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>
    );
};

export default RequestsTable;
