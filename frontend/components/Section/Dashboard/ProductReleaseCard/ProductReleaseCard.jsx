import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import ViewInArOutlinedIcon from "@mui/icons-material/ViewInArOutlined";
import KpiCard from "../KpiCard/KpiCard";
import { COLORS, STATUS_COLOR } from "../theme/colors";

export default function ProductReleaseCard({ data }) {
    return (
        <KpiCard
            icon={<ViewInArOutlinedIcon sx={{ fontSize: 26, color: COLORS.green }} />}
            title="Product Release"
            value={data.version}
            valueSize={36}
            label={`Target: ${data.target}`}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <LinearProgress
                    variant="determinate"
                    value={data.overall}
                    aria-label="Overall release progress"
                    sx={{
                        flex: 1,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: COLORS.border,
                        "& .MuiLinearProgress-bar": { bgcolor: COLORS.green },
                    }}
                />
                <Typography sx={{ fontSize: 12, color: COLORS.muted }}>
                    {data.overall}%
                </Typography>
            </Box>

            {data.items.map((item) => (
                <Box
                    key={item.label}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        py: 0.25,
                    }}
                >
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: STATUS_COLOR[item.status],
                            flexShrink: 0,
                        }}
                    />
                    <Typography sx={{ flex: 1, fontSize: 12.5, textAlign: "left" }}>
                        {item.label}
                    </Typography>
                    <Typography sx={{ fontSize: 12.5, color: COLORS.muted }}>
                        {item.value}%
                    </Typography>
                </Box>
            ))}
        </KpiCard>
    );
}
