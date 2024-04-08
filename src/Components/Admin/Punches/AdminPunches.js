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
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const punchTableAttributes = [
    {
        title: 'Name',
        attributeDBName: 'name',
        align: 'left'
    },
    {
        title: 'Punch',
        attributeDBName: 'punchin',
        align: 'left'
    },
    {
        title: 'Approved',
        attributeDBName: 'approved',
        align: 'left'
    },
    {
        title: 'Pending',
        attributeDBName: 'pending',
        align: 'left'
    },
    {
        title: 'Type',
        attributeDBName: 'punch_type',
        align: 'left'
    }
];

const PunchTable = () => {
    const [punches, setPunches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPunch, setSelectedPunch] = useState(null);

    useEffect(() => {
        const fetchPunches = async () => {
            try {
                const api = new API();
                const punchesJSONString = await api.allPunches();
                setPunches(punchesJSONString.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchPunches();
    }, []);

    const handleGearClick = (event, punch) => {
        setAnchorEl(event.currentTarget);
        setSelectedPunch(punch);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleApprove = () => {
        handleClosePopover();
        // Add your approve logic here
    };

    const handleDeny = () => {
        handleClosePopover();
        // Add your deny logic here
    };

    const formatPunchin = (punchin) => {
        const date = new Date(punchin);
        const month = date.getMonth() + 1; //Month is zero-based, so add 1
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12; //Convert 0 to 12 for 12-hour format
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; //Add leading zero if minutes less than 10
        return `${month}/${day} at ${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    const renderTableRow = (punchObject, index) => (
        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            {punchTableAttributes.map((attr, idx) => (
                <TableCell key={idx} align={attr.align}>
                    {attr.attributeDBName === 'punchin' ? formatPunchin(punchObject[attr.attributeDBName]) : punchObject[attr.attributeDBName]}
                </TableCell>
            ))}
            <TableCell align="right">
                <IconButton onClick={(event) => handleGearClick(event, punchObject)}>
                    <SettingsIcon />
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
                    <MenuItem onClick={handleApprove}>
                        <ListItemIcon sx={{ color: 'green' }}>
                            <CheckIcon />
                        </ListItemIcon>
                        <Typography variant="inherit">Approve</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleDeny}>
                        <ListItemIcon sx={{ color: 'red' }}>
                            <ClearIcon />
                        </ListItemIcon>
                        <Typography variant="inherit">Deny</Typography>
                    </MenuItem>
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
                <Table sx={{ minWidth: 650 }} aria-label="punches table">
                    <TableHead>
                        <TableRow>
                            {punchTableAttributes.map((attr, idx) => (
                                <TableCell key={idx} align={attr.align}>
                                    {attr.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {punches.map((punch, idx) => renderTableRow(punch, idx))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>
    );
};

export default PunchTable;
