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
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { FcSettings } from "react-icons/fc";
import { green, orange, red } from "@mui/material/colors";

const punchTableAttributes = [
  {
    title: "Name",
    attributeDBName: "name",
    align: "left",
  },
  {
    title: "Punch",
    attributeDBName: "punchin",
    align: "left",
  },
  {
    title: "Type",
    attributeDBName: "punch_type",
    align: "left",
  },
  {
    title: "Status",
    attributeDBName: "approved",
    align: "left",
  },
];

const PunchTable = () => {
  const [punches, setPunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPunch, setSelectedPunch] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
  }, [isEditing]);

  const handleOpenPopover = (event, punch) => {
    setAnchorEl(event.currentTarget);
    setSelectedPunch(punch);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleApprove = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this punch?"
    );
    if (!confirmed) {
      handleClosePopover();
      return;
    }
    setIsEditing(true);

    try {
      const api = new API();
      const utcDate = new Date(selectedPunch.punchin);
      const localDate = new Date(
        utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
      );
      const formattedPunchin = localDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")
        .trim();
      await api.setPunchApproved(selectedPunch.employee_id, formattedPunchin);
      console.log("Punch approved successfully!");
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error approving punch:", error);
    }

    handleClosePopover();
    setIsEditing(false);
  };

  const handleDeny = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to deny this punch?"
    );
    if (!confirmed) {
      handleClosePopover();
      return;
    }
    setIsEditing(true);

    try {
      const api = new API();
      const utcDate = new Date(selectedPunch.punchin);
      const localDate = new Date(
        utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
      );
      const formattedPunchin = localDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")
        .trim();
      await api.setPunchDenied(selectedPunch.employee_id, formattedPunchin);
      console.log("Punch denied successfully!");
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error denying punch:", error);
    }

    handleClosePopover();
    setIsEditing(false);
  };

  const formatPunchin = (punchin) => {
    const date = new Date(punchin);
    const month = date.getMonth() + 1; //Month is zero-based, so add 1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; //Convert 0 to 12 for 12-hour format
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes; //Add leading zero if minutes less than 10
    return `${month}/${day} at ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const renderTableRow = (punchObject, index) => (
    <TableRow
      key={index}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      {punchTableAttributes.map((attr, idx) => (
        <TableCell key={idx} align={attr.align}>
          {attr.attributeDBName === "approved" ? (
            punchObject[attr.attributeDBName] === 1 ? (
              <Typography
                variant="body1"
                style={{ color: green[500], fontSize: "0.9rem" }}
              >
                Approved
              </Typography>
            ) : punchObject[attr.attributeDBName] === 0 &&
              punchObject["pending"] === 0 ? (
              <Typography
                variant="body1"
                style={{ color: red[500], fontSize: "0.9rem" }}
              >
                Denied
              </Typography>
            ) : (
              <Typography
                variant="body1"
                style={{ color: orange[700], fontSize: "0.9rem" }}
              >
                Pending
              </Typography>
            )
          ) : attr.attributeDBName === "punchin" ? (
            formatPunchin(punchObject[attr.attributeDBName])
          ) : (
            punchObject[attr.attributeDBName]
          )}
        </TableCell>
      ))}
      <TableCell align="right">
        {punchObject.pending === 1 ? (
          <IconButton
            onClick={(event) => handleOpenPopover(event, punchObject)}
          >
            <FcSettings />
          </IconButton>
        ) : (
          <IconButton disabled>
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
          PaperProps={{
            sx: {
              boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.08)", // Customize the boxShadow property
            },
          }}
        >
          <MenuItem onClick={handleApprove}>
            <ListItemIcon sx={{ color: "green" }}>
              <CheckIcon />
            </ListItemIcon>
            <Typography variant="inherit">Approve</Typography>
          </MenuItem>
          <MenuItem onClick={handleDeny}>
            <ListItemIcon sx={{ color: "red" }}>
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
                  <Typography variant="subtitle1" fontWeight="bold">
                    {attr.title}
                  </Typography>
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
