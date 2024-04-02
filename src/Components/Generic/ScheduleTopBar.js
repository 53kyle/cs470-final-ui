import React, {Fragment} from "react";
import {Box, Button, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function ScheduleTopBar({datesLabel, setPrevWeek, setNextWeek}) {
    return(
        <Fragment>
            <Box sx={{
                height: 30,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={setPrevWeek}>Prev Week</Button>

                <Typography variant="h6" align="center" component="div" m={2} width={240}>
                    {
                        datesLabel
                    }
                </Typography>

                <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={setNextWeek}>Next Week</Button>
            </Box>
        </Fragment>
    )
};

export default ScheduleTopBar;