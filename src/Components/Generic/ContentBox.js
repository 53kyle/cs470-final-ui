import {CircularProgress, Divider, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

const ContentBox = ({title, content}) => {
    return <Paper elevation={3} sx={{ mb: 2 , width: "100%"}}>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            m: 3
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
    </Paper>
};

export default ContentBox;