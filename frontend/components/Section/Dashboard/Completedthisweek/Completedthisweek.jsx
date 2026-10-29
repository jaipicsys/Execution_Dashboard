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
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const dummyData = [
  {
    task: "Camera calibration module",
    owner: "Priya",
    date: "26 Oct",
    status: "Completed",
  },
  {
    task: "Model v1.3 deployed to test",
    owner: "Arjun",
    date: "25 Oct",
    status: "Completed",
  },
];

const headSx = {
  fontWeight: 700,
  fontSize: 13,
  bgcolor: "#f5f7fa",
  borderBottom: "1px solid #e6ebf0",
  whiteSpace: "nowrap",
  py: 1,
};
const cellSx = { fontSize: 13, borderBottom: "1px solid #e6ebf0", py: 1 };

const CompletedThisWeek = ({ items = dummyData }) => (
  <Paper
    variant="outlined"
    sx={{ p: 2.5, borderColor: "#e6ebf0", borderRadius: 3 }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
      <CheckCircleRoundedIcon sx={{ color: "#1f9d55", fontSize: 28 }} />
      <Typography
        sx={{ fontWeight: 800, textTransform: "uppercase", fontSize: 18 }}
      >
        Completed This Week
      </Typography>
    </Box>

    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {["Feature / Task", "Owner", "Date", "Status"].map((h) => (
              <TableCell key={h} sx={headSx}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((i) => (
            <TableRow
              key={i.task}
              sx={{ "&:last-child td": { borderBottom: 0 } }}
            >
              <TableCell sx={cellSx}>{i.task}</TableCell>
              <TableCell sx={cellSx}>{i.owner}</TableCell>
              <TableCell sx={cellSx}>{i.date}</TableCell>
              <TableCell sx={cellSx}>
                <Chip
                  label={i.status}
                  size="small"
                  sx={{
                    bgcolor: "#dcf3e3",
                    color: "#1f9d55",
                    fontWeight: 600,
                    borderRadius: 1,
                    height: 22,
                    fontSize: 12,
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                align="center"
                sx={{ py: 3, color: "#5b6773" }}
              >
                Nothing completed yet this week.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default CompletedThisWeek;
