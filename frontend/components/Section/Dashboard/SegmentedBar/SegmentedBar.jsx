import React from "react";
import { Box } from "@mui/material";
import { COLORS } from "../theme/colors";

export const buildStatusSegments = (onTrack, atRisk, third) => [
    { value: onTrack, color: COLORS.green, textColor: "#fff" },
    { value: atRisk, color: COLORS.amber, textColor: "#3a2b00" },
    { value: third, color: COLORS.red, textColor: "#fff" },
];

/* Horizontal bar split into labelled segments, sized by value */
export default function SegmentedBar({ segments }) {
    const total = segments.reduce((sum, s) => sum + s.value, 0);
    // Keep zero-value segments visible; equal widths when everything is zero
    const flexOf = (v) => (total === 0 ? 1 : Math.max(v, total * 0.1));

    return (
        <Box
            role="img"
            aria-label={segments.map((s) => s.value).join(", ")}
            sx={{
                display: "flex",
                height: 28,
                borderRadius: "4px",
                overflow: "hidden",
                mb: 1.5,
            }}
        >
            {segments.map((s, i) => (
                <Box
                    key={i}
                    sx={{
                        flex: flexOf(s.value),
                        bgcolor: s.color,
                        color: s.textColor || "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 14,
                    }}
                >
                    {s.value}
                </Box>
            ))}
        </Box>
    );
}
