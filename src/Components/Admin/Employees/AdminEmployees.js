import React, { useState, useEffect, Fragment } from 'react';
import API from "../../../API/API_Interface";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const employeeTableAttributes = [
    {
        title: 'Employee ID',
        attributeDBName: 'employee_id',
        align: 'left'
    },
    {
        title: 'First Name',
        attributeDBName: 'first_name',
        align: 'left'
    },
    {
        title: 'Middle Initial',
        attributeDBName: 'middle_name',
        align: 'left'
    },
    {
        title: 'Last Name',
        attributeDBName: 'last_name',
        align: 'left'
    },
    {
        title: 'Max Hours',
        attributeDBName: 'max_hours',
        align: 'left'
    }
];

const EmployeeTable = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEmployee, setselectedEmployee] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const api = new API();
                const employeesJSONString = await api.allEmployees();
                setEmployees(employeesJSONString.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleGearClick = (event, employee) => {
        setAnchorEl(event.currentTarget);
        setselectedEmployee(employee);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleEditHours = () => {
        handleClosePopover();
        // Add your approve logic here
    };

    const handleRemove = () => {
        handleClosePopover();
        // Add your deny logic here
    };


    const renderTableRow = (employeeObject, index) => (
        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            {employeeTableAttributes.map((attr, idx) => (
                <TableCell key={idx} align={attr.align}>
                    {employeeObject[attr.attributeDBName]}
                </TableCell>
            ))}
           <TableCell align="right">
                <IconButton onClick={(event) => handleGearClick(event, employeeObject)}>
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
                    <MenuItem onClick={handleEditHours}>
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>
                        <Typography variant="inherit">Edit Hours</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleRemove}>
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        <Typography variant="inherit">Remove</Typography>
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
                <Table sx={{ minWidth: 650 }} aria-label="employees table">
                    <TableHead>
                        <TableRow>
                            {employeeTableAttributes.map((attr, idx) => (
                                <TableCell key={idx} align={attr.align}>
                                    {attr.title}
                                </TableCell>
                            ))}
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee, idx) => renderTableRow(employee, idx))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>
    );
};

export default EmployeeTable;
