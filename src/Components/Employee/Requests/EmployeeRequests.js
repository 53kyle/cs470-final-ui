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
import SettingsIcon from "@mui/icons-material/Settings";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { FcSettings } from "react-icons/fc";
import { FcFullTrash } from "react-icons/fc";
import { FcEditImage } from "react-icons/fc";
import { FcOk } from "react-icons/fc";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Modal,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import AddEmployee from "../../Admin/Employees/AddEmployee";
import AddTimeOffRequest from "./AddTimeOffRequest";
import AddAvailabilityRequest from "./AddAvailabilityRequest";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import notificationSound from "../../../Utils/notification.wav";

const timeOffTableAttributes = [
  {
    title: "Start Time",
    attributeDBName: "start_time",
    align: "left",
  },
  {
    title: "End Time",
    attributeDBName: "end_time",
    align: "left",
  },
  {
    title: "Reason",
    attributeDBName: "reason",
    align: "left",
  },
  {
    title: "Status",
    attributeDBName: "status",
    align: "left",
  },
];

const availabilityRequestsTableAttributes = [
  {
    title: "Day",
    attributeDBName: "day_of_week",
    align: "left",
  },
  {
    title: "Start Time",
    attributeDBName: "start_time",
    align: "left",
  },
  {
    title: "End Time",
    attributeDBName: "end_time",
    align: "left",
  },
  {
    title: "Status",
    attributeDBName: "status",
    align: "left",
  },
];

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const RequestsTable = ({ user }) => {
  const [timeOffRequests, setTimeOff] = useState([]);
  const [availabilityRequests, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequest, setselectedRequest] = useState(null);
  const [editedRequest, setEditedRequest] = useState({});
  const [addTimeOffOpen, setAddTimeOffOpen] = useState(false);
  const [addAvailabilityOpen, setAddAvailabilityOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [liveEditing, setLiveEditing] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  useEffect(() => {
    const fetchTimeOff = async () => {
      try {
        const api = new API();
        const requestsJSONString = await api.timeOffRequestByID(
          user.employee_id
        );
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
        const requestsJSONString = await api.availabilityRequestsByID(
          user.employee_id
        );
        setAvailability(requestsJSONString.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTimeOff();
    fetchAvailability();
  }, [addTimeOffOpen, addAvailabilityOpen, isEditing]);

  function formatTime(time) {
    const utcDate = new Date(time);
    const localDate = new Date(
      utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
    );
    const formattedTime = localDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")
      .trim();

    return formattedTime;
  }

  const formatDisplayTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const handleOpenAddTimeOff = () => {
    setAddTimeOffOpen(true);
  };

  const handleCloseAddTimeOff = () => {
    setAddTimeOffOpen(false);
  };

  const handleOpenAddAvailability = () => {
    setAddAvailabilityOpen(true);
  };

  const handleCloseAddAvailability = () => {
    setAddAvailabilityOpen(false);
  };

  const handleOpenRemoveDialog = () => {
    playNotificationSound();
    handleClosePopover();
    setRemoveOpen(true);
  };

  const handleCloseDialog = () => {
    setRemoveOpen(false);
  };

  const playNotificationSound = () => {
    const sound = new Audio(notificationSound);
    sound.play();
  };

  const handleGearClick = (event, request) => {
    setAnchorEl(event.currentTarget);
    setselectedRequest(request);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditedRequest(selectedRequest);
    setIsEditing(true);
    setLiveEditing(true);
    handleClosePopover();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!editedRequest) return;

    if (!editedRequest.day_of_week) {
      try {
        const api = new API();
        editedRequest.start_time = formatTime(editedRequest.start_time);
        editedRequest.end_time = formatTime(editedRequest.end_time);
        console.log("edited request:", editedRequest);
        await api.updateTimeoff(
          editedRequest,
          formatTime(selectedRequest.start_time)
        );
        setIsEditing(false);
      } catch (error) {
        console.error("Error editing timeoff request:", error);
      }
    } else {
      try {
        const api = new API();
        await api.updateAvailabilityRequest(editedRequest);
        setIsEditing(false);
      } catch (error) {
        console.error("Error editing availability request:", error);
      }
    }

    setIsEditing(false);
    setLiveEditing(false);
    handleClosePopover();
  };

  const handleRemove = async () => {
    handleCloseDialog();

    if (!selectedRequest) return;

    setIsEditing(true);

    if (!selectedRequest.day_of_week) {
      try {
        const api = new API();
        selectedRequest.start_time = formatTime(selectedRequest.start_time);
        selectedRequest.end_time = formatTime(selectedRequest.end_time);
        console.log("selected request:", selectedRequest);
        await api.removeTimeoffRequest(
          selectedRequest.employee_id,
          selectedRequest.start_time,
          selectedRequest.end_time,
          selectedRequest.reason
        );
        setIsEditing(false);
      } catch (error) {
        console.error("Error deleting timeoff request:", error);
      }
    } else {
      try {
        const api = new API();
        await api.removeAvailabilityRequest(
          selectedRequest.employee_id,
          selectedRequest.day_of_week
        );
        setIsEditing(false);
      } catch (error) {
        console.error("Error deleting availability request:", error);
      }
    }

    handleClosePopover();
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Pending":
        return "orange";
      case "Denied":
        return "red";
      default:
        return "inherit";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Approved":
        return "Approved";
      case "Pending":
        return "Pending";
      case "Denied":
        return "Denied";
      default:
        return "Unknown";
    }
  };

  const renderTimeOffTableRow = (requestObject, index) => (
    <TableRow
      key={index}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      {timeOffTableAttributes.map((attr, idx) => (
        <TableCell key={idx} align={attr.align}>
          {attr.attributeDBName === "status" ? (
            <Typography
              variant="body1"
              style={{
                color: getStatusColor(requestObject[attr.attributeDBName]),
                fontSize: "0.9rem",
              }}
            >
              {getStatusText(requestObject[attr.attributeDBName])}
            </Typography>
          ) : attr.attributeDBName ? (
            attr.attributeDBName.includes("time") ? (
              formatDate(requestObject[attr.attributeDBName])
            ) : (
              requestObject[attr.attributeDBName]
            )
          ) : null}
        </TableCell>
      ))}
      <TableCell align="right">
        {requestObject.status === "Pending" ? (
          <IconButton
            onClick={(event) => handleGearClick(event, requestObject)}
          >
            <FcSettings />
          </IconButton>
        ) : (
            <IconButton
                onClick={(event) => handleGearClick(event, requestObject)}
            >
              <FcSettings />
            </IconButton>
        )}
        <Popover
          open={Boolean(anchorEl)}
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
    </TableRow>
  );

  const renderAvailabilityTableRow = (requestObject, index) => (
    <TableRow
      key={index}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      {availabilityRequestsTableAttributes.map((attr, idx) => (
        <TableCell key={idx} align={attr.align}>
          {attr.attributeDBName === "start_time" ||
          attr.attributeDBName === "end_time" ? (
            <Typography
              variant="body1"
              style={{
                fontSize: "0.9rem",
              }}
            >
              {formatDisplayTime(requestObject[attr.attributeDBName])}
            </Typography>
          ) : attr.attributeDBName === "status" ? (
            <Typography
              variant="body1"
              style={{
                color: getStatusColor(requestObject[attr.attributeDBName]),
                fontSize: "0.9rem",
              }}
            >
              {getStatusText(requestObject[attr.attributeDBName])}
            </Typography>
          ) : (
            requestObject[attr.attributeDBName]
          )}
        </TableCell>
      ))}
      <TableCell align="right">
        {requestObject.status === "Pending" ? (
          <IconButton
            onClick={(event) => handleGearClick(event, requestObject)}
          >
            <FcSettings />
          </IconButton>
        ) : (
          <IconButton style={{ opacity: 0.5 }} disabled>
            <FcSettings />
          </IconButton>
        )}
        <Popover
          open={Boolean(anchorEl)}
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
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <FcEditImage />
            </ListItemIcon>
            <Typography variant="inherit">Edit</Typography>
          </MenuItem>
          <MenuItem onClick={handleOpenRemoveDialog}>
            <ListItemIcon>
              <FcFullTrash />
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
      <Box flexDirection="row">
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={handleOpenAddTimeOff}
          sx={{ mb: 3, mr: 2 }}
        >
          Request Time Off
        </Button>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={handleOpenAddAvailability}
          sx={{ mb: 3 }}
        >
          Request Availability
        </Button>
      </Box>
      <Modal
        open={addTimeOffOpen}
        onClose={handleCloseAddTimeOff}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <AddTimeOffRequest
            employee_id={user.employee_id}
            setAddTimeOffOpen={setAddTimeOffOpen}
            sx={{}}
          />
        </Box>
      </Modal>
      <Modal
        open={addAvailabilityOpen}
        onClose={handleCloseAddAvailability}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <AddAvailabilityRequest
            employee_id={user.employee_id}
            setAddAvailabilityOpen={setAddAvailabilityOpen}
            sx={{}}
          />
        </Box>
      </Modal>
      <Dialog
        open={removeOpen}
        onClose={handleCloseDialog}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">
          Are you sure you want to remove this request?
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
      <Typography variant="h6" gutterBottom component="div">
        Time Off Requests
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table sx={{ minWidth: 650 }} aria-label="time-off requests table">
          <TableHead>
            <TableRow>
              {timeOffTableAttributes.map((attr, idx) => (
                <TableCell key={idx} align={attr.align}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {attr.title}
                  </Typography>
                </TableCell>
              ))}
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeOffRequests.map((request, idx) => (
              <Fragment key={idx}>
                {liveEditing &&
                !selectedRequest.day_of_week &&
                request.employee_id === selectedRequest.employee_id &&
                request.start_time === selectedRequest.start_time &&
                request.end_time === selectedRequest.end_time &&
                request.status === selectedRequest.status ? (
                  <TableRow key={idx}>
                    {timeOffTableAttributes.map((attr, attrIdx) =>
                      attr.attributeDBName !== "name" &&
                      attr.attributeDBName !== "status" ? (
                        <TableCell key={attrIdx} align={attr.align}>
                          <TextField
                            id={attr.attributeDBName}
                            type={
                              attr.attributeDBName === "start_time" ||
                              attr.attributeDBName === "end_time"
                                ? "datetime-local"
                                : "text"
                            }
                            name={attr.attributeDBName}
                            value={
                              attr.attributeDBName === "start_time"
                                ? formatTime(editedRequest.start_time)
                                : attr.attributeDBName === "end_time"
                                ? formatTime(editedRequest.end_time)
                                : editedRequest[attr.attributeDBName] || ""
                            }
                            onChange={handleEditChange}
                            sx={{ width: "100%" }}
                          />
                        </TableCell>
                      ) : (
                        <TableCell key={attrIdx} align={attr.align}>
                          {request[attr.attributeDBName]}
                        </TableCell>
                      )
                    )}
                    <TableCell align="right">
                      <IconButton onClick={() => handleSave()}>
                        <FcOk />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ) : (
                  renderTimeOffTableRow(request, idx)
                )}
              </Fragment>
            ))}
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
                  <Typography variant="subtitle1" fontWeight="bold">
                    {attr.title}
                  </Typography>
                </TableCell>
              ))}
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {availabilityRequests.map((request, idx) => (
              <Fragment key={idx}>
                {liveEditing &&
                request.day_of_week === selectedRequest.day_of_week &&
                request.employee_id === selectedRequest.employee_id &&
                request.start_time === selectedRequest.start_time &&
                request.end_time === selectedRequest.end_time &&
                request.status === selectedRequest.status ? (
                  <TableRow key={idx}>
                    {availabilityRequestsTableAttributes.map((attr, attrIdx) =>
                      attr.attributeDBName !== "name" &&
                      attr.attributeDBName !== "status" ? (
                        <TableCell key={attrIdx} align={attr.align}>
                          {attr.attributeDBName === "day_of_week" ? (
                            <Select
                              value={editedRequest.day_of_week || ""}
                              onChange={(e) =>
                                handleEditChange(e.target.value, "day_of_week")
                              }
                              sx={{ width: "100%" }}
                            >
                              <MenuItem value={"Sunday"}>Sunday</MenuItem>
                              <MenuItem value={"Monday"}>Monday</MenuItem>
                              <MenuItem value={"Tuesday"}>Tuesday</MenuItem>
                              <MenuItem value={"Wednesday"}>Wednesday</MenuItem>
                              <MenuItem value={"Thursday"}>Thursday</MenuItem>
                              <MenuItem value={"Friday"}>Friday</MenuItem>
                              <MenuItem value={"Saturday"}>Saturday</MenuItem>
                            </Select>
                          ) : (
                            <TextField
                              id={attr.attributeDBName}
                              type={
                                attr.attributeDBName === "start_time" ||
                                attr.attributeDBName === "end_time"
                                  ? "time"
                                  : "text"
                              }
                              name={attr.attributeDBName}
                              value={editedRequest[attr.attributeDBName] || ""}
                              onChange={handleEditChange}
                              InputLabelProps={{
                                shrink: true, // Ensures that the label is always displayed
                              }}
                              sx={{ width: "100%" }}
                            />
                          )}
                        </TableCell>
                      ) : (
                        <TableCell key={attrIdx} align={attr.align}>
                          {request[attr.attributeDBName]}
                        </TableCell>
                      )
                    )}
                    <TableCell align="right">
                      <IconButton onClick={() => handleSave()}>
                        <FcOk />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ) : (
                  renderAvailabilityTableRow(request, idx)
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default RequestsTable;
