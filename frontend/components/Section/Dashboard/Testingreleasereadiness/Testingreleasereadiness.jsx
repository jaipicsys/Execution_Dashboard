import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

const dummyData = {
  stages: [
    {
      label: "Pilot Review",
      value: "7/7",
      caption: "tasks done",
      state: "done",
    },
    {
      label: "Scope Freeze",
      value: "1/6",
      caption: "tasks done",
      state: "current",
    },
    {
      label: "Accuracy Validation",
      value: "0/6",
      caption: "tasks done",
      state: "current",
    },
    {
      label: "Production Readiness",
      value: "1/8",
      caption: "tasks done",
      state: "current",
    },
    { label: "Go / No-Go", value: "0/4", caption: "tasks done", state: "todo" },
  ],
  openBugs: { total: 0, critical: 0, high: 0, medium: 0, low: 0 },
  release: {
    label: "Next Milestone",
    title: "Model Freeze",
    date: "29 Oct 2026",
  },
};

const labelColor = { done: "#1f9d55", current: "#2f7de1", todo: "#5b6773" };

const nodeBase = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  zIndex: 1,
};

const StageNode = ({ state }) => {
  if (state === "done")
    return (
      <Box
        sx={{
          ...nodeBase,
          bgcolor: "#fff",
          border: "2px solid #1f9d55",
          color: "#1f9d55",
        }}
      >
        <CheckRoundedIcon sx={{ fontSize: 18 }} />
      </Box>
    );
  if (state === "current")
    return (
      <Box
        sx={{ ...nodeBase, bgcolor: "#2f7de1", boxShadow: "0 0 0 4px #e3effd" }}
      />
    );
  return <Box sx={{ ...nodeBase, bgcolor: "#d5dbe3" }} />;
};

const boxSx = {
  border: "1px solid #e6ebf0",
  bgcolor: "#fafbfc",
  borderRadius: 2,
  p: 1.5,
};

const TestingReleaseReadiness = ({ data = dummyData }) => {
  const { stages, openBugs, release } = data;
  const long = (release.title || "").length > 10;

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2.5, borderColor: "#e6ebf0", borderRadius: 3 }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <ScienceOutlinedIcon sx={{ color: "#2f7de1", fontSize: 28 }} />
        <Typography
          sx={{ fontWeight: 800, textTransform: "uppercase", fontSize: 18 }}
        >
          Testing & Release Readiness
        </Typography>
      </Box>

      {stages.length === 0 ? (
        <Typography sx={{ color: "#5b6773", fontSize: 14, mb: 2 }}>
          No stages found.
        </Typography>
      ) : (
        <Box
          sx={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: `repeat(${stages.length}, 1fr)`,
            textAlign: "center",
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 13,
              left: `${50 / stages.length}%`,
              right: `${50 / stages.length}%`,
              height: 2,
              bgcolor: "#d5dbe3",
            }}
          />
          {stages.map((s) => (
            <Box
              key={s.label}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                px: 0.5,
              }}
            >
              <StageNode state={s.state} />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: labelColor[s.state],
                  mt: 0.5,
                  lineHeight: 1.2,
                  minHeight: 30,
                }}
              >
                {s.label}
              </Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
                {s.value}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "#5b6773" }}>
                {s.caption}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 1.5 }}>
        <Box sx={{ ...boxSx, display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: 40,
                fontWeight: 700,
                lineHeight: 1,
                color: openBugs.total ? "#e8423f" : "#1f9d55",
              }}
            >
              {openBugs.total}
            </Typography>
            <Typography sx={{ fontSize: 13 }}>Open Bugs</Typography>
          </Box>
          <Box
            sx={{
              borderLeft: "1px solid #e6ebf0",
              pl: 2,
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            <div>
              <span style={{ color: "#e8423f" }}>{openBugs.critical}</span>{" "}
              Critical
            </div>
            <div>
              <span style={{ color: "#e8423f" }}>{openBugs.high}</span> High
            </div>
            <div>
              <span style={{ color: "#f5a623" }}>{openBugs.medium}</span> Medium
            </div>
            <div>
              <span style={{ color: "#5b6773" }}>{openBugs.low}</span> Low
            </div>
          </Box>
        </Box>

        <Box
          sx={{
            ...boxSx,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontSize: 13 }}>{release.label}</Typography>
          <Typography
            sx={{ fontSize: long ? 17 : 26, fontWeight: 800, lineHeight: 1.2 }}
          >
            {release.title}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#5b6773" }}>
            {release.date}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default TestingReleaseReadiness;
