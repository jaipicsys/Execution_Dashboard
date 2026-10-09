import React from "react";
import { Box } from "@mui/material";
import { STATUS_COLOR } from "../theme/colors";

export default function HealthDot({ status, size = 14 }) {
    return (
        <Box
            component="span"
            role="img"
            aria-label={status}
            sx={{
                display: "inline-block",
                width: size,
                height: size,
                borderRadius: "50%",
                bgcolor: STATUS_COLOR[status] || STATUS_COLOR.pending,
            }}
        />
    );
}
