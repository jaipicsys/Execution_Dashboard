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

const pill = {
  high: { bg: "#fccfcf", fg: "#c62828" },
  medium: { bg: "#fde8b5", fg: "#c26a00" },
};

const headSx = {
  fontWeight: 700,
  bgcolor: "#f5f7fa",
  borderBottom: "1px solid #e6ebf0",
  whiteSpace: "nowrap",
  py: 1.25,
};
const cellSx = { borderBottom: "1px solid #e6ebf0", py: 1.25 };

const TopBlockers = ({ blockers = dummyData }) => (
  <Paper
    variant="outlined"
    sx={{ p: 2.5, borderColor: "#e6ebf0", borderRadius: 3 }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
      <WarningRoundedIcon sx={{ color: "#e8423f", fontSize: 28 }} />
      <Typography
        sx={{ fontWeight: 800, textTransform: "uppercase", fontSize: 18 }}
      >
        Top Blockers & Risks
      </Typography>
    </Box>

    <TableContainer>
      <Table size="small" sx={{ minWidth: 820 }}>
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
          {blockers.map((b) => (
            <TableRow
              key={b.issue}
              sx={{ "&:last-child td": { borderBottom: 0 } }}
            >
              <TableCell sx={cellSx}>{b.issue}</TableCell>
              <TableCell sx={cellSx}>{b.feature}</TableCell>
              <TableCell sx={cellSx}>{b.owner}</TableCell>
              <TableCell
                align="center"
                sx={{
                  ...cellSx,
                  fontWeight: 700,
                  color: b.daysOpen >= 4 ? "#c62828" : "#c26a00",
                }}
              >
                {b.daysOpen}
              </TableCell>
              <TableCell sx={cellSx}>{b.nextAction}</TableCell>
              <TableCell sx={cellSx}>
                {b.requiredFrom && b.requiredFrom !== "—" ? (
                  <Chip
                    label={b.requiredFrom}
                    sx={{
                      bgcolor: pill[b.severity].bg,
                      color: pill[b.severity].fg,
                      fontWeight: 600,
                      borderRadius: 1,
                      height: 28,
                    }}
                  />
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
          ))}
          {blockers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                sx={{ py: 4, color: "#5b6773" }}
              >
                No open blockers.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default TopBlockers;
