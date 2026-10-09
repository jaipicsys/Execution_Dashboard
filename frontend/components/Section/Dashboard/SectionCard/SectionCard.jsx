import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { COLORS } from "../theme/colors";

/* Standard white panel with an icon + title row and an optional right-side action */
export default function SectionCard({
    title,
    subtitle,
    icon,
    titleColor = COLORS.navy,
    action,
    children,
    sx,
}) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                height: "100%",
                borderRadius: 2,
                borderColor: COLORS.border,
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                ...sx,
            }}
        >
            {(title || action) && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        mb: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            minWidth: 0,
                            color: titleColor,
                        }}
                    >
                        {icon}
                        <Typography
                            sx={{ fontWeight: 700, fontSize: 16, color: "inherit" }}
                        >
                            {title}
                            {subtitle && (
                                <Box component="span" sx={{ fontWeight: 400 }}>
                                    {" "}
                                    {subtitle}
                                </Box>
                            )}
                        </Typography>
                    </Box>
                    {action}
                </Box>
            )}
            {children}
        </Paper>
    );
}
