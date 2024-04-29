import React, { useState, useEffect, Fragment } from "react";
import API from "../../../API/API_Interface";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import {
  Modal,
  Button,
  Dialog,
  DialogTitle,
  DialogActions, Box,
} from "@mui/material";
import {
  FcFinePrint,
  FcPlanner,
  FcSettings,
  FcEditImage,
  FcOk, FcDepartment,
  FcCancel,
  FcAcceptDatabase,
} from "react-icons/fc";
import notificationSound from "../../../Utils/notification.wav";
import AddShift from "../Shifts/AddShift";
import addEmployee from "./AddEmployee";
import AddEmployee from "./AddEmployee";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckIcon from "@mui/icons-material/Check";
import EditTraining from "./EditTraining";

const employeeTableAttributes = [
  {
    title: "Employee ID",
    attributeDBName: "employee_id",
    align: "left",
  },
  {
    title: "First Name",
    attributeDBName: "first_name",
    align: "left",
  },
  {
    title: "Middle Initial",
    attributeDBName: "middle_name",
    align: "left",
  },
  {
    title: "Last Name",
    attributeDBName: "last_name",
    align: "left",
  },
  {
    title: "Max Hours",
    attributeDBName: "max_hours",
    align: "left",
  },
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState({});
  const [availabilityData, setAvailabilityData] = useState([]);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [availabilityRequestsData, setAvailabilityRequestsData] = useState([]);
  const [timeOffData, setTimeOffData] = useState([]);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [editTrainingOpen, setEditTrainingOpen] = useState(null);


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
  }, [isEditing, addEmployeeOpen]);

  const handleOpenAddEmployee = () => {
    setAddEmployeeOpen(true);
  }

  const handleCloseAddEmployee = () => {
    setAddEmployeeOpen(false);
  }

  const handleCloseEditTraining = () => {
    setEditTrainingOpen(false);
  };

  const handleGearClick = (event, index, employeeObject) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(index);
    setSelectedEmployee(employeeObject);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleOpenDialog = () => {
    playNotificationSound();
    handleClosePopover();
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleEdit = () => {
    handleClosePopover();
    setIsEditing(true);
    //Set the edited employee object with the selected employee's information
    setEditedEmployee(selectedEmployee);
  };

  const handleEditTraining = () => {
    handleClosePopover();

    setEditTrainingOpen(true);
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const playNotificationSound = () => {
    const sound = new Audio(notificationSound);
    sound.play();
  };

  const handleSave = async () => {
    // Ensure selectedEmployee and editedEmployee are not null before proceeding
    if (!selectedEmployee || !editedEmployee) return;

    try {
      const api = new API();
      await api.updateEmployee(editedEmployee);
      console.log("Employee updated successfully!");
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error updating employee:", error);
    }

    handleClosePopover();
    setIsEditing(false);
  };

  const handleRemove = async () => {
    handleCloseDialog();

    if (!selectedEmployee) return;

    setIsEditing(true);

    try {
      const api = new API();
      await api.deleteEmployee(selectedEmployee.employee_id);
      console.log("Employee removed successfully!");
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error deleting employee:", error);
    }

    handleClosePopover();
    setIsEditing(false);
  };

  const AvailabilityModal = ({ open, handleClose }) => {
    if (!availabilityData.data || availabilityData.data.length === 0) {
      return (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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

  const RequestsModal = ({ open, handleClose }) => {
    if (
      (!timeOffData.data && !availabilityRequestsData.data) ||
      (timeOffData.data.length <= 0 &&
        availabilityRequestsData.data.length <= 0)
    ) {
      return (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <h2 id="modal-title">Requests</h2>
            <p id="modal-description">No requests available.</p>
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          {timeOffData.data && timeOffData.data.length > 0 && (
            <TableContainer component={Paper} style={{ marginBottom: "16px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="h6">Time Off Requests</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
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
                  {timeOffData.data.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(request.start_time).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" }
                        )}{" "}
                        -{" "}
                        {new Date(request.start_time).toLocaleTimeString(
                          "en-US",
                          { hour: "numeric", minute: "2-digit" }
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(request.end_time).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" }
                        )}{" "}
                        -{" "}
                        {new Date(request.end_time).toLocaleTimeString(
                          "en-US",
                          { hour: "numeric", minute: "2-digit" }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {availabilityRequestsData.data &&
            availabilityRequestsData.data.length > 0 && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="h6">
                          Availability Requests
                        </Typography>
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
                    {availabilityRequestsData.data.map((request, index) => (
                      <TableRow key={index}>
                        <TableCell>{request.day_of_week}</TableCell>
                        <TableCell>{request.start_time}</TableCell>
                        <TableCell>{request.end_time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

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
      const fetchedAvailabilityData = await api.fetchAvailabilityByID(
        selectedEmployee.employee_id
      );
      setAvailabilityData(fetchedAvailabilityData);
      setIsAvailabilityModalOpen(true);
      console.log("Employee availability fetched successfully!");
    } catch (error) {
      console.error("Error fetching availibility:", error);
    }
  };

  const handleOpenRequestsModal = async () => {
    handleClosePopover();

    if (!selectedEmployee) return;

    try {
      const api = new API();
      const fetchedTimeOffData = await api.timeOffRequestByID(
        selectedEmployee.employee_id
      );
      const fetchedAvailabilityRequestData = await api.availabilityRequestsByID(
        selectedEmployee.employee_id
      );
      setTimeOffData(fetchedTimeOffData);
      setAvailabilityRequestsData(fetchedAvailabilityRequestData);
      setIsRequestsModalOpen(true);
      console.log("Employee Requests fetched successfully!");
    } catch (error) {
      console.error("Error fetching requests modal:", error);
    }
  };

  const renderTableRow = (employeeObject, index) => (
    <TableRow
      key={index}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      {employeeTableAttributes.map((attr, idx) => (
        <TableCell key={idx} align={attr.align}>
          {employeeObject[attr.attributeDBName]}
        </TableCell>
      ))}
      <TableCell align="right">
        <IconButton onClick={(event) => handleGearClick(event, index, employeeObject)}>
          <FcSettings />
        </IconButton>
        <Popover
          open={selectedRow === index}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleOpenAvailabilityModal}>
            <ListItemIcon style={{ fontSize: "26px"}}>
              <FcFinePrint />
            </ListItemIcon>
            <Typography variant="inherit">View Availability</Typography>
          </MenuItem>
          <MenuItem onClick={handleOpenRequestsModal}>
            <ListItemIcon style={{ fontSize: "26px"}}>
              <FcPlanner />
            </ListItemIcon>
            <Typography variant="inherit">View Requests</Typography>
          </MenuItem>
          <MenuItem onClick={handleEditTraining}>
            <ListItemIcon style={{ fontSize: "26px" }}>
              <FcAcceptDatabase  />
            </ListItemIcon>
            <Typography variant="inherit">View Training</Typography>
          </MenuItem>
          <MenuItem onClick={handleEdit}>
            <ListItemIcon style={{ fontSize: "26px"}}>
              <FcEditImage  />
            </ListItemIcon>
            <Typography variant="inherit">Edit</Typography>
          </MenuItem>
          <MenuItem onClick={handleOpenDialog}>
            <ListItemIcon style={{ fontSize: "26px"}}>
              <FcCancel />
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
      <Modal
          open={editTrainingOpen}
          onClose={handleCloseEditTraining}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <EditTraining employee={selectedEmployee} setEditTrainingOpen={setEditTrainingOpen} sx={{

          }}/>
        </Box>
      </Modal>
      <Modal
          open={addEmployeeOpen}
          onClose={handleCloseAddEmployee}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <AddEmployee setAddEmployeeOpen={setAddEmployeeOpen} sx={{

          }}/>
        </Box>
      </Modal>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">
          Are you sure you want to delete this employee?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleRemove} color="success">
            Yes
          </Button>
          <Button onClick={handleCloseDialog} color="error">
            No
          </Button>
        </DialogActions>
      </Dialog>
      <AvailabilityModal
        open={isAvailabilityModalOpen}
        handleClose={() => setIsAvailabilityModalOpen(false)}
      />
      <RequestsModal
        open={isRequestsModalOpen}
        handleClose={() => setIsRequestsModalOpen(false)}
      />
      <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={handleOpenAddEmployee}
          sx={{ mb: 3 }}
      >
        Add Employee
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="employees table">
          <TableHead>
            <TableRow>
              {employeeTableAttributes.map((attr, idx) => (
                <TableCell key={idx} align={attr.align}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {attr.title}
                  </Typography>
                </TableCell>
              ))}
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee, idx) => (
              <Fragment key={idx}>
                {isEditing &&
                employee.employee_id === selectedEmployee.employee_id ? (
                  <TableRow>
                    {employeeTableAttributes.map((attr, idx) =>
                      attr.attributeDBName !== "employee_id" ? (
                        <TableCell key={idx} align={attr.align}>
                          <input
                            type={
                              attr.attributeDBName === "max_hours"
                                ? "number"
                                : "text"
                            }
                            name={attr.attributeDBName}
                            value={editedEmployee[attr.attributeDBName] || ""}
                            onChange={handleEditChange}
                          />
                        </TableCell>
                      ) : (
                        <TableCell key={idx} align={attr.align}>
                          {employee[attr.attributeDBName]}
                        </TableCell>
                      )
                    )}
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleSave(employee.employee_id)}
                      >
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
