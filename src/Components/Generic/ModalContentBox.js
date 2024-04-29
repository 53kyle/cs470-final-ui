import {CircularProgress, Divider, IconButton, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

import CancelIcon from '@mui/icons-material/Cancel';

const ModalContentBox = ({title, content, handleClose}) => {
    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start",
        width: "100%"
    }}>
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            alignItems: "end",
            width: "100%"
        }}>
            <IconButton aria-label="delete" onClick={handleClose}>
                <CancelIcon />
            </IconButton>
        </Box>
        <Typography component="div" variant='h4' width="100%" textAlign="center">
            {
                title
            }
        </Typography>
        <Divider orientation="horizontal" flexItem sx={{ mt: 2, mb: 2 }} />
        {
            content == null &&
            <CircularProgress />
        }
        {
            content
        }
    </Box>
};

export default ModalContentBox;