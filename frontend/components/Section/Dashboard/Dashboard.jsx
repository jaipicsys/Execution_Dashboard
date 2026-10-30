import React, { useEffect, useState } from "react";
import { Alert, Box, Fade, Grid, Skeleton, Stack } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import Header from "../../Layout/Header/Header";
import KpiCards from "./Kpicards/Kpicards";
import FeatureTracker from "./Featuretracker/Featuretracker";
import TopBlockers from "./Topblockers/Topblockers";
import TaskStatusDistribution from "./Taskstatusdistribution/Taskstatusdistribution";
import TestingReleaseReadiness from "./Testingreleasereadiness/Testingreleasereadiness";
import CompletedThisWeek from "./Completedthisweek/Completedthisweek";

// Vite: set VITE_API_URL (and optionally VITE_ROTATE_SECONDS) in .env.
// Create React App: use process.env.REACT_APP_... instead.
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
const ROTATE_MS = Number(import.meta.env?.VITE_ROTATE_SECONDS || 10) * 1000;
const REFRESH_MS = 15000;

const fill = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

const Dashboard = () => {
  const [items, setItems] = useState(null); // one entry per project
  const [index, setIndex] = useState(0);
  const [error, setError] = useState(null);

  // Load all projects, and refresh every minute.
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboards`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || `Server returned ${res.status}`);
        }
        const json = await res.json();
        if (alive) {
          setItems(json);
          setError(null);
        }
      } catch (e) {
        if (alive) setError(e.message);
      }
    };
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  // Move to the next project every ROTATE_MS (only when there is more than one).
  const count = items ? items.length : 0;
  useEffect(() => {
    if (count < 2) return undefined;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % count),
      ROTATE_MS,
    );
    return () => clearInterval(timer);
  }, [count]);

  if (!items || items.length === 0) {
    return (
      <>
        <Header />
        <Box sx={{ minHeight: "100vh", p: 2, bgcolor: "#f3f6f9" }}>
          {error ? (
            <Alert severity="error">
              Could not load the dashboard: {error}
            </Alert>
          ) : items ? (
            <Alert severity="info">
              No projects to show. A project appears here once it has an epic
              named “Development”.
            </Alert>
          ) : (
            <Stack spacing={2}>
              <Skeleton variant="rounded" height={110} />
              <Skeleton variant="rounded" height={130} />
              <Skeleton variant="rounded" height={400} />
            </Stack>
          )}
        </Box>
      </>
    );
  }

  const data = items[index % items.length];

  return (
    <>
      <Header projectName={data.meta?.name} />
      {data.error ? (
        <Box sx={{ minHeight: "100vh", p: 2, bgcolor: "#f3f6f9" }}>
          <Alert severity="error">{data.error}</Alert>
        </Box>
      ) : (
        <Fade in appear key={data.meta.project} timeout={600}>
          <div>
            {/* Thin bar that fills while the current project is on screen */}
            {items.length > 1 && (
              <Box sx={{ height: 4, bgcolor: "#d5dbe3" }}>
                <Box
                  key={index}
                  sx={{
                    height: "100%",
                    bgcolor: "#5be0a1",
                    animation: `${fill} ${ROTATE_MS}ms linear forwards`,
                  }}
                />
              </Box>
            )}

            <Box sx={{ minHeight: "100vh", p: 2, bgcolor: "#f3f6f9" }}>
              {error && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Showing the last loaded data. Refresh failed: {error}
                </Alert>
              )}
              <Grid container spacing={2}>
                <Grid size={12}>
                  <KpiCards data={data.kpis} />
                </Grid>

                <Grid size={{ xs: 12, lg: 8 }}>
                  <Stack spacing={2}>
                    <FeatureTracker features={data.features} />
                    <TopBlockers blockers={data.blockers} />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                  <Stack spacing={2}>
                    <TaskStatusDistribution data={data.taskStatus} />
                    <TestingReleaseReadiness data={data.readiness} />
                    <CompletedThisWeek items={data.completed} />
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </div>
        </Fade>
      )}
    </>
  );
};

export default Dashboard;
