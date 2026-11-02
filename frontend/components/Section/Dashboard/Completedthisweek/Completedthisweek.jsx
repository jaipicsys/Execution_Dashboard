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
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";

// Height of the table area. When there are more rows than fit, the table scrolls inside it.
const TABLE_HEIGHT = 115;

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

const GREEN = "#1f9d55";
const INK = "#16212b";
const INK_SOFT = "#44505c";
const MUTED = "#8a96a3";
const LINE = "#e6ebf0";

const headSx = {
  fontWeight: 700,
  fontSize: 13,
  color: INK_SOFT,
  bgcolor: "#f3f6fa",
  borderBottom: "1px solid #e1e7ee",
  whiteSpace: "nowrap",
  py: 1,
};
const cellSx = {
  fontSize: 13,
  color: INK,
  borderBottom: `1px solid ${LINE}`,
  py: 1,
};

const CompletedThisWeek = ({ items = dummyData }) => (
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
          background: "linear-gradient(135deg, #e3f6ea, #c4ebd2)",
          // boxShadow: "0 0 0 3px #effaf3",
        }}
      >
        <CheckCircleRoundedIcon sx={{ color: GREEN, fontSize: 28 }} />
      </Box>
      <Typography
        sx={{ fontWeight: 800, textTransform: "uppercase", fontSize: 18 }}
      >
        Completed This Week
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
      {items.length === 0 ? (
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
          <Typography sx={{ fontSize: 14, color: INK_SOFT }}>
            Nothing completed yet this week.
          </Typography>
        </Box>
      ) : (
        <Table
          stickyHeader
          size="small"
          sx={{
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
              {["Feature / Task", "Owner", "Date", "Status"].map((h) => (
                <TableCell key={h} sx={headSx}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((i, idx) => (
              <TableRow
                key={`${i.task}-${idx}`}
                hover
                sx={{
                  transition: "background-color 0.15s ease",
                  "&:hover": { bgcolor: "#f5fbf7" },
                  "&:last-child td": { borderBottom: 0 },
                }}
              >
                <TableCell
                  sx={{
                    ...cellSx,
                    fontWeight: 600,
                    boxShadow: `inset 3px 0 0 ${GREEN}`,
                  }}
                >
                  {i.task}
                </TableCell>
                <TableCell sx={cellSx}>{i.owner}</TableCell>
                <TableCell sx={{ ...cellSx, color: INK_SOFT }}>
                  {i.date}
                </TableCell>
                <TableCell sx={cellSx}>
                  <Chip
                    label={i.status}
                    size="small"
                    sx={{
                      bgcolor: "#dcf3e3",
                      color: GREEN,
                      border: `1px solid ${GREEN}33`,
                      fontWeight: 600,
                      borderRadius: 1,
                      height: 22,
                      fontSize: 12,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  </Paper>
);

export default CompletedThisWeek;
