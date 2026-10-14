import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { COLORS } from "../theme/colors";

/* Shown in place of a KPI card when its data could not be loaded */
export default function CardError({ title, message }) {
    return (
        <Paper
            variant="outlined"
            role="alert"
            sx={{
                p: 2,
                height: "100%",
                minHeight: 200,
                borderRadius: 2,
                borderColor: COLORS.border,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
            }}
        >
            <ErrorOutlineIcon sx={{ color: COLORS.red, fontSize: 28 }} />
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: COLORS.navy }}>
                {title}
            </Typography>
            <Box sx={{ fontSize: 12.5, color: COLORS.muted, wordBreak: "break-word" }}>
                Couldn't load data: {message}
            </Box>
        </Paper>
    );
}
