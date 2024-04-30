import React, { useState, useEffect, Fragment } from "react";
import API from "../../../API/API_Interface";

import {
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Modal,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DateHelper from "../../../Utils/DateHelper";
import ModalContentBox from "../../Generic/ModalContentBox";
import CheckIcon from "@mui/icons-material/Check";
import dateFormat from "dateformat";
import AddIcon from "@mui/icons-material/Add";
import AddTraining from "./AddTraining";
import { FcCancel } from "react-icons/fc";
import notificationSound from "../../../Utils/notification.wav";

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

function EditTraining({ employee, setEditTrainingOpen }) {
  const [allDepartments, setAllDepartments] = useState([]);
  const [trainedDepartments, setTrainedDepartments] = useState([]);
  const [untrainedDepartments, setUntrainedDepartments] = useState([]);
  const [addedDepartments, setAddedDepartments] = useState([]);
  const [removedDepartments, setRemovedDepartments] = useState([]);
  const [departmentToAdd, setDepartmentToAdd] = useState("");
  const [addTrainingOpen, setAddTrainingOpen] = useState(false);
  const [removeDailogOpen, setRemoveDialogOpen] = useState(false);

  const handleOpenAddTraining = () => {
    setAddTrainingOpen(true);
  };

  const handleCloseAddTraining = () => {
    setAddTrainingOpen(false);
  };

  const handleOpenRemove = () => {
    playNotificationSound();
    setRemoveDialogOpen(true);
  };

  const handleCloseRemove = () => {
    setRemoveDialogOpen(false);
  };

  const playNotificationSound = () => {
    const sound = new Audio(notificationSound);
    sound.play();
  };

  useEffect(() => {
    if (departmentToAdd === "") {
      return;
    }
    if (
      !allDepartments.some(
        (trained) => trained.department === departmentToAdd
      ) &&
      !addedDepartments.some((trained) => trained === departmentToAdd)
    ) {
      setAddedDepartments([...addedDepartments, departmentToAdd]);
    }
    setDepartmentToAdd("");
  }, [departmentToAdd]);

  useEffect(() => {
    async function fetchData() {
      try {
        const api = new API();

        const allDepartmentsResponse = await api.getTrained();
        const allDepartments = allDepartmentsResponse.data.map(
          (trained) => trained.department
        );
        setAllDepartments(allDepartments);

        const trainedDepartmentsResponse = await api.trainedSummaryWithID(
          employee.employee_id
        );
        setTrainedDepartments(
          allDepartments.filter(
            (department) =>
              trainedDepartmentsResponse.data.some(
                (trained) => trained.department === department
              ) &&
              !removedDepartments.some(
                (removedDepartment) => removedDepartment === department
              )
          )
        );
        setUntrainedDepartments(
          allDepartments.filter(
            (department) =>
              !trainedDepartmentsResponse.data.some(
                (trained) => trained.department === department
              ) &&
              !addedDepartments.some(
                (addedDepartment) => addedDepartment === department
              )
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [addedDepartments, removedDepartments]);

  const saveTraining = async () => {
    try {
      const api = new API();

      removedDepartments.forEach(async (department) => {
        try {
          let trained = {
            employee_id: employee.employee_id,
            department: department,
          };

          console.log(trained);
          await api.removeTrained(trained.employee_id, trained.department);
        } catch (error) {
          console.error("Error saving training:", error);
        }
      });

      addedDepartments.forEach(async (department) => {
        try {
          let trained = {
            employee_id: employee.employee_id,
            department: department,
          };

          console.log(trained);
          await api.addTrained(trained.employee_id, trained.department);
        } catch (error) {
          console.error("Error saving training:", error);
        }
      });

      setEditTrainingOpen(false);
    } catch (error) {
      console.error("Error saving training:", error);
    }
  };

  return (
    employee && (
      <ModalContentBox
        handleClose={() => setEditTrainingOpen(false)}
        title={`Training for ${employee.first_name} ${employee.last_name}`}
        content={
          <Fragment>
            <Modal
              open={addTrainingOpen}
              onClose={handleCloseAddTraining}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <AddTraining
                  untrainedDepartments={untrainedDepartments}
                  setDepartmentToAdd={setDepartmentToAdd}
                  setAddTrainingOpen={setAddTrainingOpen}
                  sx={{}}
                />
              </Box>
            </Modal>
            {trainedDepartments.map((trained) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  zIndex: "tooltip",
                  width: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  align="start"
                  component="div"
                  width="100%"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {trained}
                </Typography>
                <IconButton aria-label="delete">
                  <FcCancel onClick={handleOpenRemove} />
                </IconButton>
                <Dialog
                  open={removeDailogOpen}
                  onClose={handleCloseRemove}
                  aria-labelledby="removal-dialog-title"
                  aria-describedby="removal-dialog-description"
                >
                  <DialogTitle id="removal-dialog-title">
                    Are you sure you want to remove this department?
                  </DialogTitle>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        setRemovedDepartments([...removedDepartments, trained]);
                        handleCloseRemove();
                      }}
                      color="success"
                    >
                      Yes
                    </Button>
                    <Button onClick={handleCloseRemove} color="error">
                      No
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            ))}
            {addedDepartments.map((trained, idx) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  zIndex: "tooltip",
                  width: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  align="start"
                  component="div"
                  width="100%"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {trained}
                </Typography>
                <IconButton aria-label="delete">
                  <FcCancel
                    onClick={() => {
                      setAddedDepartments([
                        ...addedDepartments.slice(0, idx),
                        ...addedDepartments.slice(
                          idx + 1,
                          addedDepartments.length
                        ),
                      ]);
                    }}
                  />
                </IconButton>
              </Box>
            ))}
            <Box flexDirection="row">
              <Button
                variant="contained"
                endIcon={<CheckIcon />}
                onClick={saveTraining}
                sx={{ mt: 2, mr: 2 }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                onClick={handleOpenAddTraining}
                sx={{ mt: 2 }}
              >
                Add Training
              </Button>
            </Box>
          </Fragment>
        }
      />
    )
  );
}

export default EditTraining;
