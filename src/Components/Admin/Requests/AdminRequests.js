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

const RequestTable = () => {
  const [timeoffRequests, setTimeoffRequests] = useState([]);
  const [availabilityRequests, setAvailabilityRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);

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
  }, []);

  const handleOpenPopover1 = (event, request) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenPopover2 = (event, request) => {
    setAnchorE2(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setAnchorE2(null);
  };

  const handleApprove = () => {
    handleClosePopover();
    const confirmed = window.confirm(
      "Are you sure you want to approve this request?"
    );
    if (confirmed) {
      // Perform the approve action
    }
  };

  const handleDeny = () => {
    handleClosePopover();
    const confirmed = window.confirm(
      "Are you sure you want to deny this request??"
    );
    if (confirmed) {
      // Perform the approve action
    }
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
      {requestObject.status === "Pending" && (
        <TableCell align="right">
          <IconButton
            onClick={(event) => handleOpenPopover1(event, requestObject)}
          >
            <FcSettings />
          </IconButton>
          <Popover
            open={Boolean(anchorEl)}
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
            PaperProps={{
              sx: {
                boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <MenuList>
              <MenuItem onClick={handleApprove}>
                <ListItemIcon sx={{ color: "green" }}>
                  <CheckIcon />
                </ListItemIcon>
                Approve
              </MenuItem>
              <MenuItem onClick={handleDeny}>
                <ListItemIcon sx={{ color: "red" }}>
                  <ClearIcon />
                </ListItemIcon>
                Deny
              </MenuItem>
            </MenuList>
          </Popover>
        </TableCell>
      )}
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
      {requestObject.status === "Pending" && (
        <TableCell align="right">
          <IconButton
            onClick={(event) => handleOpenPopover2(event, requestObject)}
          >
            <FcSettings />
          </IconButton>
          <Popover
            open={Boolean(anchorE2)}
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
            <MenuItem onClick={handleApprove}>
              <ListItemIcon sx={{ color: "green" }}>
                <CheckIcon />
              </ListItemIcon>
              Approve
            </MenuItem>
            <MenuItem onClick={handleDeny}>
              <ListItemIcon sx={{ color: "red" }}>
                <ClearIcon />
              </ListItemIcon>
              Deny
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
