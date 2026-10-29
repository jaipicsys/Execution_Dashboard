import React, { useEffect, useState } from "react";
import { Alert, Box, Grid, Skeleton, Stack } from "@mui/material";
import Header from "../../Layout/Header/Header";
import KpiCards from "./Kpicards/Kpicards";
import FeatureTracker from "./Featuretracker/Featuretracker";
import TopBlockers from "./Topblockers/Topblockers";
import TaskStatusDistribution from "./Taskstatusdistribution/Taskstatusdistribution";
import TestingReleaseReadiness from "./Testingreleasereadiness/Testingreleasereadiness";
import CompletedThisWeek from "./Completedthisweek/Completedthisweek";

// Vite: set VITE_API_URL in .env. (Create React App: use process.env.REACT_APP_API_URL instead.)
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
const REFRESH_MS = 60000;

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || `Server returned ${res.status}`);
        }
        const json = await res.json();
        if (alive) {
          setData(json);
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

  return (
    <>
      <Header />

      {!data ? (
        <Box sx={{ minHeight: "100vh", p: 2, bgcolor: "#f3f6f9" }}>
          {error ? (
            <Alert severity="error">
              Could not load the dashboard: {error}
            </Alert>
          ) : (
            <Stack spacing={2}>
              <Skeleton variant="rounded" height={110} />
              <Skeleton variant="rounded" height={130} />
              <Skeleton variant="rounded" height={400} />
            </Stack>
          )}
        </Box>
      ) : (
        <>
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
        </>
      )}
    </>
  );
};

export default Dashboard;
