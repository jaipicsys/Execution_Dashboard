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
const AMBER_DARK = "#c26a00";
const RED = "#e8423f";
const BLUE = "#2f32e1";
const INK = "#16212b";
const INK_SOFT = "#44505c";

// Colors for each card: background, border, accent (top strip) and the icon badge.
const tones = {
  blue: {
    bg: "linear-gradient(135deg, #ffffff 0%, #efefff 100%)",
    border: "#dbe2f7",
    accent: BLUE,
    badgeFrom: "#e9f2ff",
    badgeTo: "#cfe2fb",
    badgeFg: BLUE,
  },
  green: {
    bg: "linear-gradient(135deg, #ffffff 0%, #effaf3 100%)",
    border: "#cfeadb",
    accent: GREEN,
    badgeFrom: "#e3f6ea",
    badgeTo: "#c4ebd2",
    badgeFg: GREEN,
  },
  amber: {
    bg: "linear-gradient(135deg, #ffffff 0%, #fff7e8 100%)",
    border: "#f6e2b5",
    accent: AMBER,
    badgeFrom: "#fff0cd",
    badgeTo: "#fbdd9b",
    badgeFg: AMBER_DARK,
  },
  red: {
    bg: "linear-gradient(135deg, #ffffff 0%, #fff1f1 100%)",
    border: "#f6cccc",
    accent: RED,
    badgeFrom: "#ffe3e3",
    badgeTo: "#fbc3c3",
    badgeFg: RED,
  },
};

// Thin strip along the top edge of a card. Solid color, or split by proportion (segments).
const Strip = ({ color, segments }) => {
  const total = segments ? segments.reduce((sum, s) => sum + s.value, 0) : 0;
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        display: "flex",
        bgcolor: segments && total === 0 ? "#dfe5ec" : color,
      }}
    >
      {total > 0 &&
        segments.map(
          (s) =>
            s.value > 0 && (
              <Box key={s.color} sx={{ flex: s.value, bgcolor: s.color }} />
            ),
        )}
    </Box>
  );
};

// One card: round icon, title, big number, and details on the right.
// valueColor changes only the colour of the big number. segments splits the top strip by proportion.
const KpiCard = ({
  title,
  value,
  valueColor = INK,
  tone,
  icon,
  segments,
  children,
}) => {
  const t = tones[tone];
  return (
    <Paper
      variant="outlined"
      sx={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        gap: 2.5,
        px: 1.5,
        pt: 1.25,
        pb: 1,
        height: "100%",
        background: t.bg,
        borderColor: t.border,
        borderRadius: 3,
        // boxShadow:
        //   "0 1px 2px rgba(16,27,24,0.05), 0 6px 16px rgba(16,27,24,0.06)",
        // transition: "transform 0.2s ease, box-shadow 0.2s ease",
        // "&:hover": {
        //   transform: "translateY(-2px)",
        //   boxShadow:
        //     "0 2px 4px rgba(16,27,24,0.06), 0 10px 22px rgba(16,27,24,0.10)",
        // },
      }}
    >
      <Strip color={t.accent} segments={segments} />

      <Box
        sx={{
          width: 60,
          height: 60,
          flexShrink: 0,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${t.badgeFrom}, ${t.badgeTo})`,
          color: t.badgeFg,
          boxShadow: `0 0 0 4px ${t.badgeFrom}, 0 4px 10px rgba(16,27,24,0.08)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ml: 0.5,
          "& svg": { fontSize: 38 },
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 110 }}>
        <Typography
          sx={{
            fontWeight: 800,
            textTransform: "uppercase",
            fontSize: 15,
            lineHeight: 1.2,
            whiteSpace: "pre-line",
            color: INK_SOFT,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 52,
            lineHeight: 1.1,
            color: valueColor,
          }}
        >
          {value}
        </Typography>
      </Box>

      <Box
        sx={{
          fontSize: 15,
          color: INK,
          borderLeft: `1px solid ${t.border}`,
          pl: 2,
          py: 0.5,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

// A detail line with a colored dot. Pass n to show a bold count before the label.
const Dot = ({ color, n, children }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, py: 0.25 }}>
    <Box
      sx={{
        width: 11,
        height: 11,
        borderRadius: "50%",
        bgcolor: color,
        boxShadow: `0 0 0 3px ${color}26`,
      }}
    />
    <Typography sx={{ fontSize: 15 }}>
      {n !== undefined && (
        <Box component="span" sx={{ fontWeight: 700 }}>
          {n}{" "}
        </Box>
      )}
      {children}
    </Typography>
  </Box>
);

const KpiCards = ({ data = dummyData }) => {
  const diff = data.completed.vsLastWeek;
  const trendColor = diff < 0 ? RED : GREEN;
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
        <KpiCard
          title="Active Features"
          value={data.active.total}
          tone="blue"
          icon={<LayersRoundedIcon />}
          // segments={[
          //   { value: data.active.onTrack, color: GREEN },
          //   { value: data.active.atRisk, color: AMBER },
          //   { value: data.active.blocked, color: RED },
          // ]}
        >
          <Dot color={GREEN} n={data.active.onTrack}>
            On Track
          </Dot>
          <Dot color={AMBER} n={data.active.atRisk}>
            At Risk
          </Dot>
          <Dot color={RED} n={data.active.blocked}>
            Blocked
          </Dot>
        </KpiCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
        <KpiCard
          title={"Completed\nThis Week"}
          value={data.completed.thisWeek}
          valueColor={GREEN}
          tone="green"
          icon={<CheckRoundedIcon />}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              color: trendColor,
              bgcolor: `${trendColor}1a`,
              borderRadius: 5,
              pr: 1,
              pl: diff === 0 ? 1.5 : 0.25,
              py: 0.25,
              fontWeight: 600,
            }}
          >
            {diff > 0 && <ArrowDropUpRoundedIcon />}
            {diff < 0 && <ArrowDropDownRoundedIcon />}
            <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
              {diff > 0 ? "+" : ""}
              {diff} vs last week
            </Typography>
          </Box>
        </KpiCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
        <KpiCard
          title="At Risk / Overdue"
          value={data.atRiskOverdue.total}
          valueColor={data.atRiskOverdue.total > 0 ? AMBER_DARK : GREEN}
          tone="amber"
          icon={<WarningAmberRoundedIcon />}
        >
          <Dot color={AMBER} n={data.atRiskOverdue.overdue}>
            at risk
          </Dot>
        </KpiCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
        <KpiCard
          title="Blocked"
          value={data.blocked.total}
          valueColor={data.blocked.total > 0 ? RED : GREEN}
          tone="red"
          icon={<CloseRoundedIcon />}
        >
          <Dot color={data.blocked.total > 0 ? RED : GREEN}>
            {data.blocked.note}
          </Dot>
        </KpiCard>
      </Grid>
    </Grid>
  );
};

export default KpiCards;
