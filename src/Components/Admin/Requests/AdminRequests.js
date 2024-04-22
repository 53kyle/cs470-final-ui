import React, { useState, useEffect, Fragment } from 'react';
import API from "../../../API/API_Interface";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { FcSettings } from "react-icons/fc";

const requestsTableAttributes = [
    {
        title: 'Name',
        attributeDBName: 'name',
        align: 'left'
    },
    {
        title: 'Start',
        attributeDBName: 'start_time',
        align: 'left'
    },
    {
        title: 'End',
        attributeDBName: 'end_time',
        align: 'left'
    },
    {
        title: 'Reason',
        attributeDBName: 'reason',
        align: 'left'
    },
    {
        title: '',
        align: 'right'
    }
];

const RequestTable = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const api = new API();
                const requestsJSONString = await api.allRequests();
                setRequests(requestsJSONString.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleOpenPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleApprove = () => {
        handleClosePopover();
    };

    const handleDeny = () => {
        handleClosePopover();
    };

    const open = Boolean(anchorEl);

    // Function to format date in desired format
    const formatDate = (dateString) => {
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const renderTableRow = (requestObject, index) => (
        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            {requestsTableAttributes.map((attr, idx) => (
                <TableCell key={idx} align={attr.align}>
                    {attr.attributeDBName ? (attr.attributeDBName.includes('time') ? formatDate(requestObject[attr.attributeDBName]) : requestObject[attr.attributeDBName]) : null}
                </TableCell>
            ))}
            <TableCell align="right">
                <IconButton onClick={handleOpenPopover}>
                    <FcSettings />
                </IconButton>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <MenuList>
                        <MenuItem onClick={handleApprove}>
                            <ListItemIcon sx={{ color: 'green' }}>
                                <CheckIcon />
                            </ListItemIcon>
                            Approve
                        </MenuItem>
                        <MenuItem onClick={handleDeny}>
                            <ListItemIcon sx={{ color: 'red' }}>
                                <ClearIcon />
                            </ListItemIcon>
                            Deny
                        </MenuItem>
                    </MenuList>
                </Popover>
            </TableCell>
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
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="requests table">
                    <TableHead>
                        <TableRow>
                            {requestsTableAttributes.map((attr, idx) => (
                                <TableCell key={idx} align={attr.align}>
                                    {attr.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request, idx) => renderTableRow(request, idx))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>
    );
};

export default RequestTable;
