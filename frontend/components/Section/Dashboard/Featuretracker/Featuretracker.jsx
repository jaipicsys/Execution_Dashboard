import React, { useState } from "react";
import {
  Box,
  ButtonBase,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";

// Height of the table area. When there are more rows than fit, the table scrolls inside it.
const TABLE_HEIGHT = 200;

const dummyData = [
  {
    name: "Cycle Time Detection",
    owner: "Arjun",
    stage: "Development",
    progress: 80,
    status: "On Track",
    target: "10 Oct",
    milestone: "Complete testing",
  },
  {
    name: "Step & Sequence Validation",
    owner: "Rahul",
    stage: "Testing",
    progress: 60,
    status: "At Risk",
    target: "15 Oct",
    milestone: "Resolve false detections",
  },
  {
    name: "Operator Utilization",
    owner: "Priya",
    stage: "Development",
    progress: 70,
    status: "On Track",
    target: "20 Oct",
    milestone: "Integrate with dashboard",
  },
  {
    name: "Bottleneck Detection",
    owner: "Vikram",
    stage: "Design",
    progress: 40,
    status: "Blocked",
    target: "25 Oct",
    milestone: "Waiting for data sample",
  },
  {
    name: "Multi-Camera Management",
    owner: "Nikhil",
    stage: "Development",
    progress: 65,
    status: "On Track",
    target: "28 Oct",
    milestone: "Complete core implementation",
  },
  {
    name: "Analytics & Reports",
    owner: "Sneha",
    stage: "Testing",
    progress: 50,
    status: "At Risk",
    target: "30 Oct",
    milestone: "Validation and UI fixes",
  },
];

const GREEN = "#1f9d55";
const BLUE = "#2f7de1";
const RED = "#e8423f";
const INK = "#16212b";
const INK_SOFT = "#44505c";
const MUTED = "#8a96a3";
const LINE = "#e6ebf0";

// Filter tabs: label, test for a feature, and the colour of the selected tab.
const VIEWS = [
  {
    label: "Active Features",
    test: (f) => f.status !== "Completed",
    tone: BLUE,
  },
  { label: "On Track", test: (f) => f.status === "On Track", tone: GREEN },
  { label: "At Risk", test: (f) => f.status === "At Risk", tone: "#c26a00" },
  { label: "Blocked", test: (f) => f.status === "Blocked", tone: "#c62828" },
  { label: "Completed", test: (f) => f.status === "Completed", tone: GREEN },
];

// bg/fg = the status chip, edge = the thin colour bar at the left of the row.
const statusStyle = {
  "On Track": { bg: "#dcf3e3", fg: GREEN, edge: GREEN },
  "At Risk": { bg: "#fde8b5", fg: "#c26a00", edge: "#f5a623" },
  Blocked: { bg: "#fccfcf", fg: "#c62828", edge: RED },
  Completed: { bg: "#dcf3e3", fg: GREEN, edge: GREEN },
};
const styleOf = (s) => statusStyle[s] || statusStyle["On Track"];

// Small dot before the stage name: green = done, blue = being worked on, grey = not started.
const stageDot = (f) => {
  const s = (f.state || f.stage || "").toLowerCase();
  if (/done|complete/.test(s)) return GREEN;
  if (/progress|review|test|develop|design/.test(s)) return BLUE;
  return "#9aa7b5";
};

const headSx = {
  fontWeight: 700,
  color: INK_SOFT,
  bgcolor: "#f3f6fa",
  borderBottom: "1px solid #e1e7ee",
  whiteSpace: "nowrap",
  py: 1.25,
};
const cellSx = { color: INK, borderBottom: `1px solid ${LINE}`, py: 1.25 };

// Filter tab with a count badge.
const FilterTab = ({ view, count, selected, onSelect }) => (
  <ButtonBase
    role="tab"
    aria-selected={selected}
    onClick={onSelect}
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.75,
      px: 1.5,
      py: 0.5,
      borderRadius: 999,
      fontFamily: "inherit",
      fontSize: 14,
      fontWeight: 600,
      color: selected ? view.tone : INK_SOFT,
      bgcolor: selected ? "#fff" : "transparent",
      boxShadow: selected ? "0 1px 3px rgba(16,27,24,0.14)" : "none",
      transition: "background-color 0.15s ease, color 0.15s ease",
      "&:hover": { bgcolor: selected ? "#fff" : "rgba(16,27,24,0.05)" },
    }}
  >
    {view.label}
    <Box
      component="span"
      sx={{
        minWidth: 22,
        px: 0.75,
        borderRadius: 999,
        textAlign: "center",
        fontSize: 14,
        fontWeight: 700,
        color: selected ? view.tone : MUTED,
        bgcolor: selected ? `${view.tone}1f` : "rgba(16,27,24,0.06)",
      }}
    >
      {count}
    </Box>
  </ButtonBase>
);

const FeatureTracker = ({ features = dummyData }) => {
  const [viewLabel, setViewLabel] = useState(VIEWS[0].label);
  const view = VIEWS.find((v) => v.label === viewLabel);
  const rows = features.filter(view.test);

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
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
          pb: 1.5,
          borderBottom: "1px solid #eef2f6",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
            Feature Development Tracker
          </Typography>
        </Box>

        {/* Filter */}
        <Box
          role="tablist"
          aria-label="Filter features"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            p: 0.5,
            borderRadius: 999,
            bgcolor: "#eef2f7",
          }}
        >
          {VIEWS.map((v) => (
            <FilterTab
              key={v.label}
              view={v}
              count={features.filter(v.test).length}
              selected={v.label === viewLabel}
              onSelect={() => setViewLabel(v.label)}
            />
          ))}
        </Box>
      </Box>

      {/* Fixed-height area: rows scroll inside it, header stays in place */}
      <TableContainer
        sx={{
          height: TABLE_HEIGHT,
          overflow: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#c9d3df transparent",
          "&::-webkit-scrollbar": { width: 8, height: 8 },
          "&::-webkit-scrollbar-thumb": {
            background: "#c9d3df",
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-thumb:hover": { background: "#aebccb" },
        }}
      >
        {rows.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: MUTED,
            }}
          >
            <InboxRoundedIcon sx={{ fontSize: 28 }} />
            <Typography sx={{ fontSize: 14 }}>
              No features with this status.
            </Typography>
          </Box>
        ) : (
          <Table
            stickyHeader
            size="small"
            sx={{
              minWidth: 820,
              borderCollapse: "separate",
              borderSpacing: 0,
              "& thead th:first-of-type": {
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              },
              "& thead th:last-of-type": {
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              },
            }}
          >
            <TableHead>
              <TableRow>
                {[
                  "Feature / Module",
                  "Owner",
                  "Current Stage",
                  "Progress",
                  "Status",
                  "Target Date",
                  "Next Milestone",
                ].map((h) => (
                  <TableCell key={h} sx={headSx}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((f) => {
                const st = styleOf(f.status);
                const greenBar =
                  f.status === "On Track" || f.status === "Completed";
                return (
                  <TableRow
                    key={f.key || f.name}
                    hover
                    sx={{
                      transition: "background-color 0.15s ease",
                      "&:hover": { bgcolor: "#f6f9fe" },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    <TableCell
                      sx={{
                        ...cellSx,
                        fontWeight: 600,
                        boxShadow: `inset 3px 0 0 ${st.edge}`,
                      }}
                    >
                      {f.name}
                    </TableCell>
                    <TableCell sx={cellSx}>{f.owner}</TableCell>
                    <TableCell sx={cellSx}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: stageDot(f),
                            flexShrink: 0,
                          }}
                        />
                        {f.stage}
                      </Box>
                    </TableCell>
                    <TableCell sx={cellSx}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={f.progress}
                          sx={{
                            width: 80,
                            height: 10,
                            borderRadius: 5,
                            bgcolor: "#e8edf3",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 5,
                              background: greenBar
                                ? "linear-gradient(90deg, #3cbf78, #1f9d55)"
                                : "linear-gradient(90deg, #5a9cf0, #2f7de1)",
                            },
                          }}
                        />
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                          {f.progress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={cellSx}>
                      <Chip
                        label={f.status}
                        sx={{
                          bgcolor: st.bg,
                          color: st.fg,
                          border: `1px solid ${st.edge}33`,
                          fontWeight: 600,
                          borderRadius: 1,
                          height: 28,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        ...cellSx,
                        color: f.overdue ? RED : f.target === "—" ? MUTED : INK,
                        fontWeight: f.overdue ? 700 : 400,
                      }}
                    >
                      {f.target}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...cellSx,
                        color: f.milestone === "—" ? MUTED : INK,
                      }}
                    >
                      {f.milestone}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Paper>
  );
};

export default FeatureTracker;
