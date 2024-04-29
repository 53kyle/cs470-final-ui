import React, { useState, useEffect, Fragment } from "react";
import API from "../../../API/API_Interface";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import ListItemIcon from "@mui/material/ListItemIcon";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { FcSettings } from "react-icons/fc";
import Typography from "@mui/material/Typography";
import notificationSound from "../../../Utils/notification.wav";
import {Dialog, DialogTitle, DialogActions, Button, Box, Modal} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddTimeOffRequest from "../../Employee/Requests/AddTimeOffRequest";
import AddAvailabilityRequest from "../../Employee/Requests/AddAvailabilityRequest";

const requestsTableAttributes = [
  {
    title: "Name",
    attributeDBName: "name",
    align: "left",
  },
  {
    title: "Start",
    attributeDBName: "start_time",
    align: "left",
  },
  {
    title: "End",
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
    title: "Name",
    attributeDBName: "name",
    align: "left",
  },
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
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const RequestTable = ( {user} ) => {
  const [timeoffRequests, setTimeoffRequests] = useState([]);
  const [availabilityRequests, setAvailabilityRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRow2, setSelectedRow2] = useState(null);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [addTimeOffOpen, setAddTimeOffOpen] = useState(false);
  const [addAvailabilityOpen, setAddAvailabilityOpen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const api = new API();
        const timeoffRequestsJSON = await api.allTimeoffRequests();
        const availabilityRequestsJSON = await api.allAvailabilityRequests();
        setTimeoffRequests(timeoffRequestsJSON.data);
        setAvailabilityRequests(availabilityRequestsJSON.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, [isEditing, addTimeOffOpen, addAvailabilityOpen]);

  const handleOpenAddTimeOff = () => {
    setAddTimeOffOpen(true);
  }

  const handleCloseAddTimeOff = () => {
    setAddTimeOffOpen(false);
  }

  const handleOpenAddAvailability = () => {
    setAddAvailabilityOpen(true);
  }

  const handleCloseAddAvailability = () => {
    setAddAvailabilityOpen(false);
  }

  const handleOpenPopover = (event, index, requestObject) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequest(requestObject);
    setSelectedRow(index);
  };

  const handleOpenPopover2 = (event, index, requestObject) => {
    setAnchorE2(event.currentTarget);
    setSelectedRequest(requestObject);
    setSelectedRow2(index);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setAnchorE2(null);
    setSelectedRow(null);
    setSelectedRow2(null);
  };

  const handleOpenApproveDialog = () => {
    playNotificationSound();
    handleClosePopover();
    setOpen(true);
  };

  const handleCloseApproveDialog = () => {
    setOpen(false);
  };

  const handleOpenDenyDialog = () => {
    playNotificationSound();
    handleClosePopover();
    setOpen1(true);
  };

  const handleCloseDenyDialog = () => {
    setOpen1(false);
  };

  const playNotificationSound = () => {
    const sound = new Audio(notificationSound);
    sound.play();
  };

  const handleApprove = async () => {
    handleCloseApproveDialog();
    setIsEditing(true);

    console.log("selected request:", selectedRequest);
    if (!selectedRequest.day_of_week) {
      try {
        const api = new API();
        selectedRequest.status = "Approved";
        const utcDate = new Date(selectedRequest.start_time);
        const localDate = new Date(
          utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
        );
        const formattedRequest = localDate
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")
          .trim();

        selectedRequest.start_time = formattedRequest;
        console.log("date:", formattedRequest);
        console.log("selected request:", selectedRequest);
        await api.updateTimeoff(selectedRequest);
        setIsEditing(false);
      } catch (error) {
        console.error("Error approving timeoff:", error);
      }
    } else {
      try {
        const api = new API();
        selectedRequest.status = "Approved";
        await api.updateAvailabilityRequest(selectedRequest);
        setIsEditing(false);
      } catch (error) {
        console.error("Error approving availability request:", error);
      }
    }

    handleClosePopover();
    setIsEditing(false);
  };

  const handleDeny = async () => {
    handleCloseDenyDialog();
    setIsEditing(true);

    if (!selectedRequest.day_of_week) {
      try {
        const api = new API();
        selectedRequest.status = "Denied";
        const utcDate = new Date(selectedRequest.start_time);
        const localDate = new Date(
          utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
        );
        const formattedRequest = localDate
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")
          .trim();

        selectedRequest.start_time = formattedRequest;
        console.log("date:", formattedRequest);
        console.log("selected request:", selectedRequest);
        await api.updateTimeoff(selectedRequest);
        setIsEditing(false);
      } catch (error) {
        console.error("Error denying timeoff:", error);
      }
    } else {
      try {
        const api = new API();
        selectedRequest.status = "Denied";
        await api.updateAvailabilityRequest(selectedRequest);
        setIsEditing(false);
      } catch (error) {
        console.error("Error denying availability request:", error);
      }
    }

    handleClosePopover();
    setIsEditing(false);
  };

  // Function to format date in desired format
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
      {requestsTableAttributes.map((attr, idx) => (
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
          ) : attr.attributeDBName && attr.attributeDBName.includes("time") ? (
            formatDate(requestObject[attr.attributeDBName])
          ) : (
            requestObject[attr.attributeDBName]
          )}
        </TableCell>
      ))}
      <TableCell align="right">
        {requestObject.status === "Pending" ? (
          <IconButton onClick={(event) => handleOpenPopover(event, index, requestObject)}>
            <FcSettings />
          </IconButton>
        ) : (
          <IconButton disabled>
            <FcSettings />
          </IconButton>
        )}
        <Popover
          open={selectedRow === index}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuList>
            <MenuItem onClick={handleOpenApproveDialog}>
              <ListItemIcon sx={{ color: "green" }}>
                <CheckIcon />
              </ListItemIcon>
              Approve
            </MenuItem>
            <MenuItem onClick={handleOpenDenyDialog}>
              <ListItemIcon sx={{ color: "red" }}>
                <ClearIcon />
              </ListItemIcon>
              Deny
            </MenuItem>
          </MenuList>
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
          ) : (
            requestObject[attr.attributeDBName]
          )}
        </TableCell>
      ))}
      <TableCell align="right">
        {requestObject.status === "Pending" ? (
          <IconButton onClick={(event) => handleOpenPopover2(event, index, requestObject)}>
            <FcSettings />
          </IconButton>
        ) : (
          <IconButton disabled>
            <FcSettings />
          </IconButton>
        )}
        <Popover
          open={selectedRow2 === index}
          anchorEl={anchorE2}
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
          <MenuItem onClick={handleOpenApproveDialog}>
            <ListItemIcon sx={{ color: "green" }}>
              <CheckIcon />
            </ListItemIcon>
            Approve
          </MenuItem>
          <MenuItem onClick={handleOpenDenyDialog}>
            <ListItemIcon sx={{ color: "red" }}>
              <ClearIcon />
            </ListItemIcon>
            Deny
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
          <AddTimeOffRequest employee_id={user.employee_id} setAddTimeOffOpen={setAddTimeOffOpen} sx={{

          }}/>
        </Box>
      </Modal>
      <Modal
          open={addAvailabilityOpen}
          onClose={handleCloseAddAvailability}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <AddAvailabilityRequest employee_id={user.employee_id} setAddAvailabilityOpen={setAddAvailabilityOpen} sx={{

          }}/>
        </Box>
      </Modal>
      <Dialog
        open={open}
        onClose={handleCloseApproveDialog}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">
          Are you sure you want to approve this request?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleApprove} color="success">
            Yes
          </Button>
          <Button onClick={handleCloseApproveDialog} color="error">
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open1}
        onClose={handleCloseDenyDialog}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">
          Are you sure you want to deny this request?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDeny} color="success">
            Yes
          </Button>
          <Button onClick={handleCloseDenyDialog} color="error">
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h6" gutterBottom component="div">
        Time Off Requests
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table sx={{ minWidth: 650 }} aria-label="requests table">
          <TableHead>
            <TableRow>
              {requestsTableAttributes.map((attr, idx) => (
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
            {timeoffRequests.map((request, idx) =>
              renderTimeOffTableRow(request, idx)
            )}
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
            </TableRow>
          </TableHead>
          <TableBody>
            {availabilityRequests.map((request, idx) =>
              renderAvailabilityTableRow(request, idx)
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default RequestTable;
