import {CircularProgress, Divider, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

const ModalContentBox = ({title, content}) => {
    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start",
        width: "100%"
    }}>
        <Typography component="div" variant='h5'>
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