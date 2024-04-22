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
import { Modal, Button } from '@mui/material';
import { FcFinePrint } from "react-icons/fc";
import { FcSettings } from "react-icons/fc";
import { FcReuse } from "react-icons/fc";
import { FcEditImage } from "react-icons/fc";
import { FcOk } from "react-icons/fc";

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
    const [availabilityData, setAvailabilityData] = useState([]);
    const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
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
    }, [isEditing]);

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
            await api.updateEmployee(editedEmployee);
            // After successful update, you may want to update the employees list or perform any other actions
            console.log('Employee updated successfully!');
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error('Error updating employee:', error);
        }



        handleClosePopover();
        setIsEditing(false);
    };

    const handleRemove = async () => {

        if (!selectedEmployee) return;

        //Display a confirmation dialog to the user
        const confirmed = window.confirm("Are you sure you want to delete this employee?");
        
        if (!confirmed) {
            handleClosePopover();
            return;
        }

        setIsEditing(true);

        try {
            const api = new API();
            await api.deleteEmployee(selectedEmployee.employee_id);
            // After successful update, you may want to update the employees list or perform any other actions
            console.log('Employee removed successfully!');
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error('Error deleting employee:', error);
        }

        handleClosePopover();
        setIsEditing(false);
    };


    const AvailabilityModal = ({ open, handleClose,}) => {

        console.log('availability data: ', availabilityData);
        const availabilityArray = availabilityData.data;
        if (!availabilityData.data || availabilityData.data.length === 0) {
            return (
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div>
                        <h2 id="modal-title">Availability</h2>
                        <p id="modal-description">No availability data available.</p>
                        <Button onClick={handleClose}>Close</Button>
                    </div>
                </Modal>
            );
        }

        return (
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                 <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                        <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <h2 id="modal-title">Availability</h2>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Day of Week
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Start Time
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        End Time
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {availabilityData.data.map((availability, index) => (
                                <TableRow key={index}>
                                    <TableCell>{availability.day_of_week}</TableCell>
                                    <TableCell>{availability.start_time}</TableCell>
                                    <TableCell>{availability.end_time}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button onClick={handleClose}>Close</Button>
            </div>
        </Modal>
        );
    };

    const handleOpenAvailabilityModal = async () => {

        handleClosePopover();

        if (!selectedEmployee) return;

        try {
            const api = new API();
            const fetchedAvailabilityData= await api.fetchAvailabilityByID(selectedEmployee.employee_id);
            setAvailabilityData(fetchedAvailabilityData);
            setIsAvailabilityModalOpen(true);
            // After successful update, you may want to update the employees list or perform any other actions
            console.log('Employee availability fetched successfully!');
        } catch (error) {
            console.error('Error fetching availibility:', error);
        }
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
                    <MenuItem onClick={handleOpenAvailabilityModal}>
                        <ListItemIcon>
                            {/* Add an icon for viewing availability */}
                            <FcFinePrint /> {/* Add your preferred icon for viewing availability */}
                        </ListItemIcon>
                        <Typography variant="inherit">View Availability</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <FcEditImage />
                        </ListItemIcon>
                        <Typography variant="inherit">Edit</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleRemove}>
                        <ListItemIcon>
                            <FcReuse />
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
            <AvailabilityModal
                open={isAvailabilityModalOpen}
                handleClose={() => setIsAvailabilityModalOpen(false)}
            />
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
                            <FcOk />
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
