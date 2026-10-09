import React, { useState } from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SectionCard from "./shared/SectionCard";
import { COLORS } from "./shared/colors";

const TONE_COLOR = {
    good: COLORS.green,
    bad: COLORS.red,
    neutral: COLORS.navy,
};

function LineChart({ labels, series, yMin = 70, yMax = 100 }) {
    const W = 420, H = 170, L = 42, R = 10, T = 12, B = 26;
    const iw = W - L - R;
    const ih = H - T - B;
    const x = (i) => L + (i / (labels.length - 1)) * iw;
    const y = (v) => T + ih - ((v - yMin) / (yMax - yMin)) * ih;
    const ticks = Array.from({ length: (yMax - yMin) / 10 + 1 }, (_, i) => yMin + i * 10);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Model accuracy over time">
            {ticks.map((t) => (
                <g key={t}>
                    <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke={COLORS.border} />
                    <text x={L - 6} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill={COLORS.muted}>
                        {t}
                    </text>
                </g>
            ))}
            <text
                x="10"
                y={T + ih / 2}
                textAnchor="middle"
                fontSize="10"
                fill={COLORS.muted}
                transform={`rotate(-90 10 ${T + ih / 2})`}
            >
                Accuracy (%)
            </text>
            {labels.map((l, i) => (
                <text key={l} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill={COLORS.muted}>
                    {l}
                </text>
            ))}
            {series.map((s) => (
                <g key={s.name}>
                    <polyline
                        fill="none"
                        stroke={s.color}
                        strokeWidth="2"
                        points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
                    />
                    {s.values.map((v, i) => (
                        <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={s.color} />
                    ))}
                </g>
            ))}
        </svg>
    );
}

export default function AIModelPerformance({ views }) {
    const keys = Object.keys(views);
    const [view, setView] = useState(keys[0]);
    const { metrics, labels, series } = views[view];

    return (
        <SectionCard
            title="AI Model Performance"
            subtitle="(Pilot Validation)"
            icon={<ShowChartIcon sx={{ fontSize: 24 }} />}
            action={
                <Select
                    size="small"
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    inputProps={{ "aria-label": "Pilot filter" }}
                    sx={{
                        fontSize: 12.5,
                        minWidth: 150,
                        "& .MuiSelect-select": { py: 0.5 },
                    }}
                >
                    {keys.map((k) => (
                        <MenuItem key={k} value={k} sx={{ fontSize: 13 }}>
                            {k}
                        </MenuItem>
                    ))}
                </Select>
            }
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 1,
                    mb: 1.5,
                }}
            >
                {metrics.map((m, i) => (
                    <Box
                        key={m.label}
                        sx={{
                            textAlign: "center",
                            p: 1,
                            borderLeft: i ? `1px solid ${COLORS.border}` : 0,
                        }}
                    >
                        <Typography sx={{ fontSize: 11.5, color: COLORS.muted, lineHeight: 1.25, minHeight: 28 }}>
                            {m.label}
                        </Typography>
                        <Typography sx={{ fontSize: 24, fontWeight: 800, color: TONE_COLOR[m.tone] }}>
                            {m.value}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 0.5 }}>
                {series.map((s) => (
                    <Box key={s.name} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Box sx={{ width: 16, height: 2, bgcolor: s.color }} />
                        <Typography sx={{ fontSize: 11.5 }}>{s.name}</Typography>
                    </Box>
                ))}
            </Box>

            <LineChart labels={labels} series={series} />
        </SectionCard>
    );
}
