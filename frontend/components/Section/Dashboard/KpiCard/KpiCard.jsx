import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { COLORS } from "../theme/colors";

/* Top-row summary card: icon + title, big number, label, then any children */
export default function KpiCard({
    icon,
    title,
    value,
    valueColor = COLORS.navy,
    valueSize = 40,
    label,
    children,
}) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                height: "100%",
                borderRadius: 2,
                borderColor: COLORS.border,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: COLORS.navy,
                }}
            >
                {icon}
                <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
                    {title}
                </Typography>
            </Box>

            <Typography
                sx={{
                    fontWeight: 800,
                    fontSize: valueSize,
                    lineHeight: 1.15,
                    color: valueColor,
                    mt: 0.5,
                }}
            >
                {value}
            </Typography>
            <Typography sx={{ fontSize: 15, color: COLORS.muted, mb: 1.5 }}>
                {label}
            </Typography>

            <Box sx={{ width: "100%", mt: "auto" }}>{children}</Box>
        </Paper>
    );
}
