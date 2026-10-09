import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import SectionCard from "./shared/SectionCard";
import DataTable from "./shared/DataTable";
import { COLORS, STATUS_COLOR } from "./shared/colors";

const STATUS_TEXT = {
    onTrack: { label: "On Track", color: COLORS.green },
    atRisk: { label: "At Risk", color: "#e8a317" },
    blocked: { label: "Blocked", color: COLORS.red },
};

const columns = [
    { key: "module", label: "Module / Feature" },
    {
        key: "progress",
        label: "Progress",
        render: (r) => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LinearProgress
                    variant="determinate"
                    value={r.progress}
                    aria-label={`${r.module} progress`}
                    sx={{
                        width: 52,
                        height: 8,
                        borderRadius: 1,
                        bgcolor: COLORS.border,
                        "& .MuiLinearProgress-bar": { bgcolor: COLORS.green },
                    }}
                />
                <Typography sx={{ fontSize: 12.5 }}>{r.progress}%</Typography>
            </Box>
        ),
    },
    {
        key: "status",
        label: "Status",
        render: (r) => {
            const s = STATUS_TEXT[r.status];
            return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <Box
                        sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: STATUS_COLOR[r.status],
                        }}
                    />
                    <Typography sx={{ fontSize: 12.5, color: s.color }}>
                        {s.label}
                    </Typography>
                </Box>
            );
        },
    },
    { key: "target", label: "Target Date" },
];

export default function ProductDevelopmentProgress({ rows }) {
    return (
        <SectionCard
            title="Product Development Progress"
            icon={<CodeIcon sx={{ fontSize: 24 }} />}
        >
            <DataTable columns={columns} rows={rows} />
        </SectionCard>
    );
}
