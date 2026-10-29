import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";

// List of { name, value }. Colors are picked by name below.
const dummyData = [
  { name: "To Do", value: 25 },
  { name: "In Progress", value: 10 },
  { name: "Done", value: 17 },
];

const COLORS = {
  "To Do": "#94a3b8",
  "In Progress": "#2f7de1",
  Done: "#1f9d55",
  "On Track": "#1f9d55",
  "At Risk": "#f5a623",
  Blocked: "#e8423f",
};
const FALLBACK = "#a78bfa";

// Donut drawn with plain SVG (no chart library needed).
const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 76;
const STROKE = 40;
const CIRC = 2 * Math.PI * RADIUS;

const TaskStatusDistribution = ({ data = dummyData }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);

  let offset = 0;
  const segments = data.map((d) => {
    const len = total ? (d.value / total) * CIRC : 0;
    const mid = ((offset + len / 2) / CIRC) * 2 * Math.PI; // angle clockwise from top
    const seg = {
      ...d,
      color: COLORS[d.name] || FALLBACK,
      len,
      offset,
      lx: CENTER + RADIUS * Math.sin(mid),
      ly: CENTER - RADIUS * Math.cos(mid),
    };
    offset += len;
    return seg;
  });

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2.5, borderColor: "#e6ebf0", borderRadius: 3 }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <GridViewRoundedIcon sx={{ color: "#2f7de1", fontSize: 28 }} />
        <Typography
          sx={{ fontWeight: 800, textTransform: "uppercase", fontSize: 18 }}
        >
          Task Status Distribution
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ position: "relative", width: SIZE, height: SIZE }}>
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label="Task status distribution"
          >
            {total === 0 && (
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={STROKE}
              />
            )}
            <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
              {segments.map((s) => (
                <circle
                  key={s.name}
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${s.len} ${CIRC - s.len}`}
                  strokeDashoffset={-s.offset}
                />
              ))}
            </g>
            {segments
              .filter((s) => s.value > 0)
              .map((s) => (
                <text
                  key={s.name}
                  x={s.lx}
                  y={s.ly}
                  fill="#fff"
                  fontSize="14"
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {s.value}
                </text>
              ))}
          </svg>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <Typography sx={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>
              {total}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#5b6773" }}>
              Total Tasks
            </Typography>
          </Box>
        </Box>

        <Box>
          {segments.map((s) => (
            <Box
              key={s.name}
              sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.9 }}
            >
              <Box
                sx={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  bgcolor: s.color,
                }}
              />
              <Typography sx={{ width: 90, fontSize: 15 }}>{s.name}</Typography>
              <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
                {s.value} ({pct(s.value)}%)
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default TaskStatusDistribution;
