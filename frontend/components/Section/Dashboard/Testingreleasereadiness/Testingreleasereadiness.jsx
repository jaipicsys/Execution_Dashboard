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

const GREEN = "#1f9d55";
const BLUE = "#2f7de1";
const RED = "#e8423f";
const AMBER = "#f5a623";
const INK = "#16212b";
const INK_SOFT = "#44505c";
const MUTED = "#5b6773";
const LINE = "#e6ebf0";
const TRACK = "#d5dbe3";

const labelColor = { done: GREEN, current: BLUE, todo: MUTED };
const fillColor = { done: GREEN, current: BLUE, todo: TRACK };

const nodeBase = {
  width: 50,
  height: 50,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  zIndex: 1,
};

// Circle for one stage: green tick = finished, blue = in progress, grey = not started.
const StageNode = ({ state }) => {
  if (state === "done")
    return (
      <Box
        sx={{
          ...nodeBase,
          background: "linear-gradient(135deg, #3cbf78, #1f9d55)",
          color: "#fff",
          // boxShadow: "0 0 0 3px #e3f6ea",
        }}
      >
        <CheckRoundedIcon sx={{ fontSize: 18 }} />
      </Box>
    );
  if (state === "current")
    return (
      <Box
        sx={{
          ...nodeBase,
          background: "linear-gradient(135deg, #5a9cf0, #2f7de1)",
          // boxShadow: "0 0 0 4px #e3effd",
        }}
      >
        <Box
          sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#fff" }}
        />
      </Box>
    );
  return <Box sx={{ ...nodeBase, bgcolor: TRACK }} />;
};

// "3/8" -> 0.375. Returns null when the value is not a fraction (for example "—").
const ratioOf = (value) => {
  const m = /^(\d+)\s*\/\s*(\d+)$/.exec(value || "");
  return m && Number(m[2]) > 0 ? Number(m[1]) / Number(m[2]) : null;
};

// Colour of the line from stage i to the next one.
const connector = (state) =>
  state === "done"
    ? GREEN
    : state === "current"
      ? `linear-gradient(90deg, ${BLUE}, ${TRACK})`
      : TRACK;

const BugLine = ({ color, n, children }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
    <Box component="span" sx={{ fontWeight: 700, minWidth: 14 }}>
      {n}
    </Box>
    {children}
  </Box>
);

const boxSx = {
  border: `1px solid ${LINE}`,
  // borderRadius: 2,
  p: 1.5,
};

const TestingReleaseReadiness = ({ data = dummyData }) => {
  const { stages, openBugs, release } = data;
  const long = (release.title || "").length > 10;
  const bugColor = openBugs.total ? RED : GREEN;

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
          <ScienceOutlinedIcon sx={{ color: BLUE, fontSize: 28 }} />
        </Box>
        <Typography
          sx={{ fontWeight: 800, textTransform: "uppercase", fontSize: 18 }}
        >
          Testing & Release Readiness
        </Typography>
      </Box>

      {stages.length === 0 ? (
        <Typography sx={{ color: MUTED, fontSize: 14, mb: 2 }}>
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
          {/* line between circles: green after a finished stage, fading blue after one in progress */}
          {stages.slice(0, -1).map((s, i) => (
            <Box
              key={`line-${s.label}`}
              sx={{
                position: "absolute",
                top: 42.5,
                left: `${((i + 0.5) / stages.length) * 100}%`,
                width: `${100 / stages.length}%`,
                height: 3,
                borderRadius: 2,
                background: connector(s.state),
              }}
            />
          ))}

          {stages.map((s) => {
            const ratio = ratioOf(s.value);
            return (
              <Box
                key={s.label}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                  px: 0.5,
                  pt: 2.5,
                }}
              >
                <StageNode state={s.state} />
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: labelColor[s.state],
                    mt: 2,
                    lineHeight: 1.2,
                    minHeight: 50,
                  }}
                >
                  {s.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 22,
                    fontWeight: 700,
                    lineHeight: 1,
                    mt: 1,
                    color: INK,
                  }}
                >
                  {s.value}
                </Typography>
                {ratio !== null && (
                  <Box
                    sx={{
                      width: "70%",
                      maxWidth: 56,
                      height: 4,
                      borderRadius: 2,
                      bgcolor: "#e3e8ee",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${Math.round(ratio * 100)}%`,
                        height: "100%",
                        borderRadius: 2,
                        bgcolor: fillColor[s.state],
                      }}
                    />
                  </Box>
                )}
                <Typography sx={{ fontSize: 12, color: MUTED }}>
                  {s.caption}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 1.5 }}>
        {/* Open bugs: green when none, red when there are some */}
        <Box
          sx={{
            ...boxSx,
            display: "flex",
            alignItems: "center",
            gap: 2,
            background: openBugs.total
              ? "linear-gradient(135deg, #ffffff, #fff3f3)"
              : "linear-gradient(135deg, #ffffff, #effaf3)",
            boxShadow: `inset 3px 0 0 ${bugColor}`,
          }}
        >
          <Box sx={{ textAlign: "center", pl: 0.5 }}>
            <Typography
              sx={{
                fontSize: 40,
                fontWeight: 700,
                lineHeight: 1,
                color: bugColor,
              }}
            >
              {openBugs.total}
            </Typography>
            <Typography sx={{ fontSize: 14, color: INK_SOFT }}>
              Open Bugs
            </Typography>
          </Box>
          <Box
            sx={{
              borderLeft: `1px solid ${LINE}`,
              pl: 5,
              fontSize: 13,
              lineHeight: 1.6,
              color: INK,
            }}
          >
            <BugLine color={RED} n={openBugs.critical}>
              Critical
            </BugLine>
            <BugLine color="#f0703a" n={openBugs.high}>
              High
            </BugLine>
            <BugLine color={AMBER} n={openBugs.medium}>
              Medium
            </BugLine>
            <BugLine color="#9aa7b5" n={openBugs.low}>
              Low
            </BugLine>
          </Box>
        </Box>

        {/* Target release / next milestone */}
        <Box
          sx={{
            ...boxSx,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "linear-gradient(135deg, #ffffff, #f3f8ff)",
            boxShadow: `inset 3px 0 0 ${BLUE}`,
          }}
        >
          <Typography sx={{ fontSize: 13, color: INK_SOFT }}>
            {release.label}
          </Typography>
          <Typography
            sx={{
              fontSize: long ? 17 : 26,
              fontWeight: 800,
              lineHeight: 1.2,
              color: INK,
            }}
          >
            {release.title}
          </Typography>
          {release.date && (
            <Typography
              sx={{
                fontSize: 12,
                color: INK_SOFT,
                bgcolor: "#e3effd",
                px: 1,
                py: 0.25,
                mt: 0.5,
                borderRadius: 999,
                alignSelf: "center",
              }}
            >
              {release.date}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default TestingReleaseReadiness;
