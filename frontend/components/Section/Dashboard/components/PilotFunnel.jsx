import React from "react";
import { Box, Typography } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import SectionCard from "./shared/SectionCard";
import { COLORS } from "./shared/colors";

// Strong blue at the top of the funnel, fading toward the bottom
const shade = (i, n) => {
    const t = i / Math.max(n - 1, 1);
    const l = 48 + t * 38; // lightness 48% -> 86%
    return `hsl(213, 80%, ${l}%)`;
};

export default function PilotFunnel({ stages }) {
    const max = Math.max(...stages.map((s) => s.value), 1);

    return (
        <SectionCard
            title="Pilot Funnel"
            subtitle="(All Opportunities)"
            icon={<BarChartIcon sx={{ fontSize: 24 }} />}
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.9 }}>
                {stages.map((s, i) => (
                    <Box key={s.stage} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography
                            sx={{
                                width: 120,
                                flexShrink: 0,
                                fontSize: 12.5,
                                color: COLORS.text,
                                lineHeight: 1.2,
                            }}
                        >
                            {s.stage}
                        </Typography>
                        <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 0.75 }}>
                            <Box
                                role="img"
                                aria-label={`${s.stage}: ${s.value}`}
                                sx={{
                                    width: `${(s.value / max) * 90}%`,
                                    minWidth: 6,
                                    height: 14,
                                    borderRadius: "2px",
                                    bgcolor: shade(i, stages.length),
                                }}
                            />
                            <Typography sx={{ fontSize: 12, color: COLORS.text }}>
                                {s.value}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </SectionCard>
    );
}
