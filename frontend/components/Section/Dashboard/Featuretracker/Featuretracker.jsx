import React, { useState } from "react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";

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

const VIEWS = [
  "Active Features",
  "On Track",
  "At Risk",
  "Blocked",
  "Completed",
];

const chipColors = {
  "On Track": { bg: "#dcf3e3", fg: "#1f9d55" },
  "At Risk": { bg: "#fde8b5", fg: "#c26a00" },
  Blocked: { bg: "#fccfcf", fg: "#c62828" },
  Completed: { bg: "#dcf3e3", fg: "#1f9d55" },
};
const colorOf = (s) => chipColors[s] || chipColors["On Track"];

const headSx = {
  fontWeight: 700,
  bgcolor: "#f5f7fa",
  borderBottom: "1px solid #e6ebf0",
  whiteSpace: "nowrap",
  py: 1.25,
};
const cellSx = { borderBottom: "1px solid #e6ebf0", py: 1.25 };

const FeatureTracker = ({ features = dummyData }) => {
  const [view, setView] = useState(VIEWS[0]);
  const rows =
    view === "Active Features"
      ? features.filter((f) => f.status !== "Completed")
      : features.filter((f) => f.status === view);

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2.5, borderColor: "#e6ebf0", borderRadius: 3 }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <GridViewRoundedIcon sx={{ color: "#2f7de1", fontSize: 28 }} />
          <Typography
            sx={{ fontWeight: 800, textTransform: "uppercase", fontSize: 18 }}
          >
            Feature Development Tracker
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 190 }}>
          <InputLabel id="tracker-view">View</InputLabel>
          <Select
            labelId="tracker-view"
            label="View"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            {VIEWS.map((v) => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer>
        <Table size="small" sx={{ minWidth: 820 }}>
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
            {rows.map((f) => (
              <TableRow
                key={f.name}
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                  {f.name}
                </TableCell>
                <TableCell sx={cellSx}>{f.owner}</TableCell>
                <TableCell sx={cellSx}>{f.stage}</TableCell>
                <TableCell sx={cellSx}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <LinearProgress
                      variant="determinate"
                      value={f.progress}
                      sx={{
                        width: 80,
                        height: 10,
                        borderRadius: 5,
                        bgcolor: "#e2e8f0",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 5,
                          bgcolor:
                            f.status === "On Track" || f.status === "Completed"
                              ? "#1f9d55"
                              : "#2f7de1",
                        },
                      }}
                    />
                    <Typography sx={{ fontSize: 14 }}>{f.progress}%</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={cellSx}>
                  <Chip
                    label={f.status}
                    sx={{
                      bgcolor: colorOf(f.status).bg,
                      color: colorOf(f.status).fg,
                      fontWeight: 600,
                      borderRadius: 1,
                      height: 28,
                    }}
                  />
                </TableCell>
                <TableCell sx={cellSx}>{f.target}</TableCell>
                <TableCell sx={cellSx}>{f.milestone}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ py: 4, color: "#5b6773" }}
                >
                  No features with this status.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FeatureTracker;
