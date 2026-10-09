import React, { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import SectionCard from "../SectionCard/SectionCard";
import { COLORS } from "../theme/colors";

const SEVERITY_COLOR = {
    Critical: COLORS.red,
    High: COLORS.amber,
    Medium: "#5aa0f0",
    Low: COLORS.grey,
};

function Donut({ segments, centerValue, centerLabel }) {
    const R = 42;
    const C = 2 * Math.PI * R;
    const total = segments.reduce((s, x) => s + x.value, 0);
    let offset = 0;

    return (
        <Box sx={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
            <svg viewBox="0 0 120 120" width="100%" height="100%" role="img" aria-label="Open bugs by severity">
                {segments.map((s) => {
                    const len = (s.value / total) * C;
                    const circle = (
                        <circle
                            key={s.label}
                            cx="60"
                            cy="60"
                            r={R}
                            fill="none"
                            stroke={s.color}
                            strokeWidth="16"
                            strokeDasharray={`${len} ${C - len}`}
                            strokeDashoffset={-offset}
                            transform="rotate(-90 60 60)"
                        />
                    );
                    offset += len;
                    return circle;
                })}
            </svg>
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography sx={{ fontSize: 24, fontWeight: 800, lineHeight: 1, color: COLORS.navy }}>
                    {centerValue}
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: COLORS.muted }}>
                    {centerLabel}
                </Typography>
            </Box>
        </Box>
    );
}

function Stat({ value, label, color = COLORS.navy }) {
    return (
        <Box sx={{ flex: 1, textAlign: "center", py: 1, px: 0.5 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1.2 }}>
                {value}
            </Typography>
            <Typography sx={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.3 }}>
                {label}
            </Typography>
        </Box>
    );
}

export default function QualityDashboard({ data }) {
    const [tab, setTab] = useState(0);
    const segments = data.severity.map((s) => ({
        ...s,
        color: SEVERITY_COLOR[s.label],
    }));

    return (
        <SectionCard
            title="Quality Dashboard"
            icon={<DonutLargeIcon sx={{ fontSize: 24 }} />}
        >
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="fullWidth"
                sx={{
                    minHeight: 36,
                    mb: 2,
                    bgcolor: COLORS.headBg,
                    borderRadius: 1,
                    "& .MuiTab-root": {
                        minHeight: 36,
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: 13,
                    },
                }}
            >
                <Tab label="Product Bugs" />
                <Tab label="AI/ML Accuracy" />
            </Tabs>

            {tab === 0 ? (
                <>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
                        <Donut
                            segments={segments}
                            centerValue={data.openBugs}
                            centerLabel="Open Bugs"
                        />
                        <Box sx={{ flex: 1 }}>
                            {segments.map((s) => (
                                <Box
                                    key={s.label}
                                    sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5 }}
                                >
                                    <Box sx={{ width: 12, height: 12, borderRadius: "2px", bgcolor: s.color }} />
                                    <Typography sx={{ flex: 1, fontSize: 13 }}>{s.label}</Typography>
                                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{s.value}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 1,
                            mt: "auto",
                            "& > :not(:last-child)": { borderRight: `1px solid ${COLORS.border}` },
                        }}
                    >
                        <Stat value={data.stats.createdThisWeek} label="Created This Week" />
                        <Stat value={data.stats.closedThisWeek} label="Closed This Week" />
                        <Stat value={data.stats.overdue} label="Overdue" color={COLORS.red} />
                        <Stat value={data.stats.avgCloseTime} label="Avg. Close Time" />
                    </Box>
                </>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {data.accuracy.map((a) => (
                        <Box
                            key={a.label}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 1.5,
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: 1,
                            }}
                        >
                            <Typography sx={{ fontSize: 13.5 }}>{a.label}</Typography>
                            <Typography sx={{ fontSize: 20, fontWeight: 800, color: COLORS.green }}>
                                {a.value.toFixed(1)}%
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </SectionCard>
    );
}
