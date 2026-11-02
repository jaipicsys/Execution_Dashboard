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

const BLUE = "#2f7de1";
const INK = "#16212b";
const INK_SOFT = "#44505c";
const MUTED = "#8a96a3";
const LINE = "#e6ebf0";

// Donut drawn with plain SVG (no chart library needed).
const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 60;
const STROKE = 25;
const CIRC = 2 * Math.PI * RADIUS;
const GAP = 3; // small white gap between segments

const TaskStatusDistribution = ({ data = dummyData }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
  const visible = data.filter((d) => d.value > 0).length;
  const gap = visible > 1 ? GAP : 0;

  let offset = 0;
  const segments = data.map((d) => {
    const len = total ? (d.value / total) * CIRC : 0;
    const mid = ((offset + len / 2) / CIRC) * 2 * Math.PI; // angle clockwise from top
    const seg = {
      ...d,
      color: COLORS[d.name] || FALLBACK,
      draw: Math.max(len - gap, 0),
      start: offset + gap / 2,
      lx: CENTER + RADIUS * Math.sin(mid),
      ly: CENTER - RADIUS * Math.cos(mid),
    };
    offset += len;
    return seg;
  });

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderColor: LINE,
        borderRadius: 3,
        background: "linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%)",
        // boxShadow:
        //   "0 1px 2px rgba(16,27,24,0.05), 0 6px 16px rgba(16,27,24,0.06)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 2,
          pb: 1.5,
          borderBottom: "1px solid #eef2f6",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #e9f2ff, #cfe2fb)",
            // boxShadow: "0 0 0 3px #f1f6fe",
          }}
        >
          <GridViewRoundedIcon sx={{ color: BLUE, fontSize: 28 }} />
        </Box>
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
            style={{ filter: "drop-shadow(0 4px 8px rgba(16,27,24,0.14))" }}
          >
            {/* light track behind the segments (also shown when there are no tasks) */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="#e8edf3"
              strokeWidth={STROKE}
            />
            <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
              {segments
                .filter((s) => s.value > 0)
                .map((s) => (
                  <circle
                    key={s.name}
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={STROKE}
                    strokeDasharray={`${s.draw} ${CIRC - s.draw}`}
                    strokeDashoffset={-s.start}
                  />
                ))}
            </g>
            {/* number on each segment; hidden on very thin segments so it never overflows */}
            {segments
              .filter((s) => s.value > 0 && pct(s.value) >= 5)
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
            <Typography
              sx={{ fontSize: 32, fontWeight: 700, lineHeight: 1, color: INK }}
            >
              {total}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#5b6773" }}>
              Total Tasks
            </Typography>
          </Box>
        </Box>

        {/* Legend: one soft row per status, tinted in the segment's colour */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          {segments.map((s) => (
            <Box
              key={s.name}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.5,
                py: 0.75,
                // borderRadius: 2,
                bgcolor: `${s.color}14`,
                boxShadow: `inset 3px 0 0 ${s.color}`,
              }}
            >
              <Box
                sx={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  bgcolor: s.color,
                  boxShadow: `0 0 0 3px ${s.color}26`,
                }}
              />
              <Typography sx={{ width: 90, fontSize: 15, color: INK_SOFT }}>
                {s.name}
              </Typography>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: INK }}>
                {s.value}{" "}
                <Box component="span" sx={{ fontWeight: 500, color: MUTED }}>
                  ({pct(s.value)}%)
                </Box>
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default TaskStatusDistribution;
