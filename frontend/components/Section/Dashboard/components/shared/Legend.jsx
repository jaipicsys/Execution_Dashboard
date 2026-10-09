import React from "react";
import { Box, Typography } from "@mui/material";
import { COLORS } from "./colors";

export const statusLegend = (third) => [
    { label: "On Track", color: COLORS.green },
    { label: "At Risk", color: COLORS.amber },
    { label: third, color: COLORS.red },
];

export default function Legend({ items }) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 2,
            }}
        >
            {items.map((item) => (
                <Box
                    key={item.label}
                    sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                >
                    <Box
                        sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "2px",
                            bgcolor: item.color,
                        }}
                    />
                    <Typography sx={{ fontSize: 12, color: COLORS.text }}>
                        {item.label}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}
