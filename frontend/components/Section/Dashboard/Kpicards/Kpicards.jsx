import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";

const dummyData = {
  active: { total: 6, onTrack: 4, atRisk: 1, blocked: 1 },
  completed: { thisWeek: 2, vsLastWeek: 1 },
  atRiskOverdue: { total: 3, atRisk: 2, overdue: 1 },
  blocked: { total: 1, note: "Requires management support" },
};

const GREEN = "#1f9d55";
const AMBER = "#f5a623";
const RED = "#e8423f";
const BLUE = "#2f7de1";

const tones = {
  blue: { bg: "#fff", border: "#e6ebf0", badgeBg: "#e3effd", badgeFg: BLUE },
  green: { bg: "#eef9f2", border: "#d4eedd", badgeBg: "#d5f0de", badgeFg: GREEN },
  amber: { bg: "#fff8ea", border: "#fbe7bd", badgeBg: "#fde8b5", badgeFg: AMBER },
  red: { bg: "#fff0f0", border: "#fad4d4", badgeBg: "#fccfcf", badgeFg: RED },
};

// One card: round icon, title, big number, details on the right.
const KpiCard = ({ title, value, tone, icon, children }) => {
  const t = tones[tone];
  return (
    <Paper
      variant="outlined"
      sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 2.5, height: "100%", bgcolor: t.bg, borderColor: t.border, borderRadius: 3 }}
    >
      <Box
        sx={{
          width: 76,
          height: 76,
          flexShrink: 0,
          borderRadius: "50%",
          bgcolor: t.badgeBg,
          color: t.badgeFg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& svg": { fontSize: 38 },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 110 }}>
        <Typography sx={{ fontWeight: 800, textTransform: "uppercase", fontSize: 15, lineHeight: 1.2, whiteSpace: "pre-line" }}>
          {title}
        </Typography>
        <Typography sx={{ fontWeight: 700, fontSize: 52, lineHeight: 1.1 }}>{value}</Typography>
      </Box>
      <Box sx={{ fontSize: 15 }}>{children}</Box>
    </Paper>
  );
};

const Dot = ({ color, children }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, py: 0.25 }}>
    <Box sx={{ width: 11, height: 11, borderRadius: "50%", bgcolor: color }} />
    <Typography sx={{ fontSize: 15 }}>{children}</Typography>
  </Box>
);

const KpiCards = ({ data = dummyData }) => (
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
      <KpiCard title="Active Features" value={data.active.total} tone="blue" icon={<LayersRoundedIcon />}>
        <Dot color={GREEN}>{data.active.onTrack} On Track</Dot>
        <Dot color={AMBER}>{data.active.atRisk} At Risk</Dot>
        <Dot color={RED}>{data.active.blocked} Blocked</Dot>
      </KpiCard>
    </Grid>

    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
      <KpiCard title={"Completed\nThis Week"} value={data.completed.thisWeek} tone="green" icon={<CheckRoundedIcon />}>
        <Box sx={{ display: "flex", alignItems: "center", color: data.completed.vsLastWeek < 0 ? RED : GREEN, fontWeight: 500 }}>
          {data.completed.vsLastWeek > 0 && <ArrowDropUpRoundedIcon />}
          {data.completed.vsLastWeek < 0 && <ArrowDropDownRoundedIcon />}
          <Typography sx={{ fontSize: 15 }}>
            {data.completed.vsLastWeek > 0 ? "+" : ""}
            {data.completed.vsLastWeek} vs last week
          </Typography>
        </Box>
      </KpiCard>
    </Grid>

    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
      <KpiCard title="At Risk / Overdue" value={data.atRiskOverdue.total} tone="amber" icon={<WarningAmberRoundedIcon />}>
        <Dot color={AMBER}>{data.atRiskOverdue.atRisk} at risk</Dot>
        <Dot color={RED}>{data.atRiskOverdue.overdue} overdue</Dot>
      </KpiCard>
    </Grid>

    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
      <KpiCard title="Blocked" value={data.blocked.total} tone="red" icon={<CloseRoundedIcon />}>
        <Dot color={RED}>{data.blocked.note}</Dot>
      </KpiCard>
    </Grid>
  </Grid>
);

export default KpiCards;