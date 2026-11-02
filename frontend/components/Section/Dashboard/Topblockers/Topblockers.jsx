import React from "react";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

// Height of the table area. When there are more rows than fit, the table scrolls inside it.
const TABLE_HEIGHT = 100;

const dummyData = [
  {
    issue: "Customer RTSP access pending",
    feature: "Bottleneck Detection",
    owner: "Vikram",
    daysOpen: 5,
    nextAction: "Follow up with customer",
    requiredFrom: "Customer / Management",
    severity: "high",
  },
  {
    issue: "False detections in low light",
    feature: "Step Validation",
    owner: "Rahul",
    daysOpen: 4,
    nextAction: "Test with new dataset",
    requiredFrom: "CTO (Model support)",
    severity: "high",
  },
  {
    issue: "GPU server setup",
    feature: "Multi-Camera",
    owner: "Nikhil",
    daysOpen: 2,
    nextAction: "Finalize configuration",
    requiredFrom: "IT / Management",
    severity: "medium",
  },
];

const GREEN = "#1f9d55";
const RED = "#e8423f";
const AMBER = "#f5a623";
const INK = "#16212b";
const INK_SOFT = "#44505c";
const MUTED = "#8a96a3";
const LINE = "#e6ebf0";

// bg/fg = the "Required From" chip, edge = the thin colour bar at the left of the row.
const pill = {
  high: { bg: "#fccfcf", fg: "#c62828", edge: RED },
  medium: { bg: "#fde8b5", fg: "#c26a00", edge: AMBER },
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

const TopBlockers = ({ blockers = dummyData }) => (
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
          background: "linear-gradient(135deg, #ffe9e9, #fbc9c9)",
          // boxShadow: "0 0 0 3px #fff3f3",
        }}
      >
        <WarningRoundedIcon sx={{ color: RED, fontSize: 28 }} />
      </Box>
      <Typography
        sx={{ fontWeight: 800, textTransform: "uppercase", fontSize: 18 }}
      >
        Top Blockers & Risks
      </Typography>
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
      {blockers.length === 0 ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            color: GREEN,
          }}
        >
          <CheckCircleRoundedIcon sx={{ fontSize: 28 }} />
          <Typography sx={{ fontSize: 14, color: INK_SOFT }}>
            No open blockers.
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
                "Issue / Blocker",
                "Feature",
                "Owner",
                "Days Open",
                "Next Action",
                "Required From",
              ].map((h) => (
                <TableCell
                  key={h}
                  sx={headSx}
                  align={h === "Days Open" ? "center" : "left"}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {blockers.map((b, i) => {
              const sev = pill[b.severity] || pill.medium;
              const dayColor = b.daysOpen >= 4 ? "#c62828" : "#c26a00";
              return (
                <TableRow
                  key={b.key || `${b.issue}-${i}`}
                  hover
                  sx={{
                    transition: "background-color 0.15s ease",
                    "&:hover": { bgcolor: "#fff8f8" },
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell
                    sx={{
                      ...cellSx,
                      fontWeight: 600,
                      boxShadow: `inset 3px 0 0 ${sev.edge}`,
                    }}
                  >
                    {b.issue}
                  </TableCell>
                  <TableCell sx={cellSx}>{b.feature}</TableCell>
                  <TableCell sx={cellSx}>{b.owner}</TableCell>
                  <TableCell align="center" sx={cellSx}>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        minWidth: 32,
                        px: 1.25,
                        py: 0.25,
                        borderRadius: 999,
                        fontWeight: 700,
                        color: dayColor,
                        bgcolor: `${dayColor}1a`,
                      }}
                    >
                      {b.daysOpen}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      ...cellSx,
                      color: b.nextAction === "—" ? MUTED : INK,
                    }}
                  >
                    {b.nextAction}
                  </TableCell>
                  <TableCell sx={cellSx}>
                    {b.requiredFrom && b.requiredFrom !== "—" ? (
                      <Chip
                        label={b.requiredFrom}
                        sx={{
                          bgcolor: sev.bg,
                          color: sev.fg,
                          border: `1px solid ${sev.edge}33`,
                          fontWeight: 600,
                          borderRadius: 1,
                          height: 28,
                        }}
                      />
                    ) : (
                      <Box component="span" sx={{ color: MUTED }}>
                        —
                      </Box>
                    )}
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

export default TopBlockers;
