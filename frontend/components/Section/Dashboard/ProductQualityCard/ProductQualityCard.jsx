import React from "react";
import { Box, Typography } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WarningIcon from "@mui/icons-material/Warning";
import KpiCard from "../KpiCard/KpiCard";
import { COLORS } from "../theme/colors";

function SeverityTile({ value, label, color, bg }) {
    return (
        <Box
            sx={{
                flex: 1,
                py: 0.75,
                borderRadius: 1,
                bgcolor: bg,
                textAlign: "center",
            }}
        >
            <Typography sx={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1.2 }}>
                {value}
            </Typography>
            <Typography sx={{ fontSize: 12, color }}>{label}</Typography>
        </Box>
    );
}

export default function ProductQualityCard({ data }) {
    return (
        <KpiCard
            icon={<ShieldOutlinedIcon sx={{ fontSize: 26 }} />}
            title="Product Quality"
            value={data.openBugs}
            valueColor={COLORS.red}
            label="Open Bugs"
        >
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <SeverityTile value={data.critical} label="Critical" color={COLORS.red} bg="#fdecec" />
                <SeverityTile value={data.high} label="High" color="#f28c1e" bg="#fff1e0" />
                <SeverityTile value={data.medium} label="Medium" color={COLORS.blue} bg="#e8f1fd" />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.75,
                    color: COLORS.red,
                }}
            >
                <WarningIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: 13, color: COLORS.red }}>
                    {data.overdue} overdue
                </Typography>
            </Box>
        </KpiCard>
    );
}
