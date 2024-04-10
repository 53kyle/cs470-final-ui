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
import SaveIcon from '@mui/icons-material/Save';

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
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState({});

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
        setSelectedEmployee(employee);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleClosePopover();
        setIsEditing(true);
        //Set the edited employee object with the selected employee's information
        setEditedEmployee(selectedEmployee);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = async () => {
        // Ensure selectedEmployee and editedEmployee are not null before proceeding
        if (!selectedEmployee || !editedEmployee) return;

        console.log(selectedEmployee);
        console.log(editedEmployee);
    
        try {
            const api = new API();
            await api.updateEmployee(selectedEmployee.employee_id, editedEmployee);
            // After successful update, you may want to update the employees list or perform any other actions
            console.log('Employee updated successfully!');
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error('Error updating employee:', error);
        }

        handleClosePopover();
        setIsEditing(false);
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
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>
                        <Typography variant="inherit">Edit</Typography>
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
    {employees.map((employee, idx) => (
        <Fragment key={idx}>
            {isEditing && employee.employee_id === selectedEmployee.employee_id ? (
                <TableRow>
                    {employeeTableAttributes.map((attr, idx) => (
                        attr.attributeDBName !== 'employee_id' ? (
                            <TableCell key={idx} align={attr.align}>
                                <input
                                    type={attr.attributeDBName === 'max_hours' ? 'number' : 'text'}
                                    name={attr.attributeDBName}
                                    value={editedEmployee[attr.attributeDBName] || ''}
                                    onChange={handleEditChange}
                                />
                            </TableCell>
                        ) : (
                            <TableCell key={idx} align={attr.align}>
                                {employee[attr.attributeDBName]}
                            </TableCell>
                        )
                    ))}
                    <TableCell align="right">
                        <IconButton onClick={() => handleSave(employee.employee_id)}>
                            <SaveIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ) : (
                renderTableRow(employee, idx)
            )}
        </Fragment>
    ))}
</TableBody>

                </Table>
            </TableContainer>
        </Fragment>
    );
};

export default EmployeeTable;
