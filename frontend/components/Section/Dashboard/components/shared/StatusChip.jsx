import React from "react";
import { Chip } from "@mui/material";
import { COLORS } from "./colors";

const STYLES = {
    Blocked: { bgcolor: COLORS.red, color: "#fff" },
    "At Risk": { bgcolor: COLORS.amber, color: "#3a2b00" },
    "Not Started": { bgcolor: "#eceff3", color: COLORS.muted },
    Planned: { bgcolor: "#dbe9fb", color: COLORS.blue },
};

export default function StatusChip({ status }) {
    const style = STYLES[status] || STYLES["Not Started"];
    return (
        <Chip
            label={status}
            size="small"
            sx={{
                height: 22,
                borderRadius: "4px",
                fontWeight: 700,
                fontSize: 12,
                ...style,
            }}
        />
    );
}
