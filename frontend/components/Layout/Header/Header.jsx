import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

// "dark" = classic solid dark green bar. "light" = white bar (the logo then sits on a small dark plate).
const HEADER_STYLE = "dark";

const THEMES = {
  dark: {
    bg: "#0b3a31",
    border: "rgba(255,255,255,0.12)",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.78)",
    divider: "rgba(255,255,255,0.28)",
    accent: "#5be0a1", // underline under the project name
    logoPlate: false,
    // status text colours on the dark bar
    status: {
      live: { dot: "#4ade80", text: "#ffffff", pulse: true },
      stale: { dot: "#fbbf24", text: "#fde68a" },
      offline: { dot: "#f87171", text: "#fecaca" },
      connecting: { dot: "#cbd5e1", text: "#e2e8f0" },
    },
  },
  light: {
    bg: "#ffffff",
    border: "#e3e8ee",
    text: "#0f1f1b",
    muted: "#5b6773",
    divider: "rgba(15,31,27,0.22)",
    accent: "#17806a",
    logoPlate: true,
    status: {
      live: { dot: "#22c55e", text: "#166534", pulse: true },
      stale: { dot: "#f59e0b", text: "#92400e" },
      offline: { dot: "#ef4444", text: "#991b1b" },
      connecting: { dot: "#94a3b8", text: "#475569" },
    },
  },
};

/* ISO week number (Mon-start), e.g. 08 Oct 2026 -> 41 */
const getWeekNumber = (d) => {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
};

/* "Wed, 08 Oct 2026" */
const formatDate = (d) => {
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  return `${weekday}, ${day} ${month} ${d.getFullYear()}`;
};

/* "10:30 AM" */
const formatTime = (d) =>
  d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

// Soft ring that pulses out of the green "live" dot.
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.55); }
  70% { box-shadow: 0 0 0 7px rgba(74, 222, 128, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
`;

// The project name fades in each time it changes (the dashboard rotates projects).
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-3px); }
  to { opacity: 1; transform: translateY(0); }
`;

const reducedMotion = "@media (prefers-reduced-motion: reduce)";

/*
  Props (all optional):
    title        text in the middle
    projectName  shown after the title, underlined like the active item of a menu
    status       "live" | "stale" | "offline" | "connecting"  (default "live")
    updatedAt    when data was last loaded (Date or timestamp); without it the current time is shown
  Used on its own, with no props, it works as before. The indicator also turns red by itself
  when the browser loses its network connection.
*/
export default function Header({
  title = "PRODUCT DEVELOPMENT",
  projectName,
  status = "live",
  updatedAt,
}) {
  const t = THEMES[HEADER_STYLE] || THEMES.dark;
  const [now, setNow] = useState(new Date());
  const [online, setOnline] = useState(true);

  // Refresh the clock every 30 seconds
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  // Notice when the browser goes offline / comes back
  useEffect(() => {
    const update = () => setOnline(navigator.onLine !== false);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const state = online ? status : "offline";
  const st = t.status[state] || t.status.live;
  const time = formatTime(updatedAt ? new Date(updatedAt) : now);
  const label = !online
    ? "Offline – no network connection"
    : state === "stale"
      ? `Stale – last updated ${time}`
      : state === "offline"
        ? "Offline – cannot reach the server"
        : state === "connecting"
          ? "Connecting…"
          : `Live – Updated ${time}`;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: t.bg,
        color: t.text,
        borderBottom: `1px solid ${t.border}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "64px !important",
          px: { xs: "12px !important", md: "32px !important" },
          py: { xs: 1, md: 0 },
          display: "grid",
          // wide screens: brand | title | info. Narrow screens: stacked and centred.
          gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
          justifyItems: { xs: "center", md: "stretch" },
          alignItems: "center",
          gap: { xs: 1, md: 2 },
        }}
      >
        {/* LEFT — logo and tagline */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
            gap: "2px",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              ...(t.logoPlate && {
                bgcolor: "#0b2b24",
                borderRadius: 1.5,
                px: 1.25,
                py: 0.5,
              }),
            }}
          >
            <Box
              component="img"
              src="/logo.svg"
              alt="Eigenstate AI"
              sx={{
                height: 30,
                width: "auto",
                display: "block",
                objectFit: "contain",
              }}
            />
          </Box>
          <Typography sx={{ fontSize: 13, fontWeight: 400, color: t.muted }}>
            Edge Vision. Industrial Intelligence.
          </Typography>
        </Box>

        {/* CENTER — title, then the project as the "active" item */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            columnGap: 2,
            minWidth: 0,
            maxWidth: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.06em",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>

          {projectName && (
            <>
              <Box
                aria-hidden
                sx={{
                  width: "1px",
                  height: 28,
                  bgcolor: t.divider,
                  display: { xs: "none", md: "block" },
                }}
              />
              <Typography
                key={projectName}
                sx={{
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 30,
                  fontWeight: 900,
                  lineHeight: 1.15,
                  pb: "2px",
                  borderBottom: `3px solid ${t.accent}`,
                  animation: `${fadeIn} 0.5s ease-out`,
                  [reducedMotion]: { animation: "none" },
                }}
              >
                {projectName}
              </Typography>
            </>
          )}
        </Box>

        {/* RIGHT — date and week, then connection status */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-end" },
            gap: "4px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: t.muted,
            }}
          >
            <CalendarTodayRoundedIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: 14 }}>{formatDate(now)}</Typography>
            <Box sx={{ width: "1px", height: 14, bgcolor: t.divider, mx: 1 }} />
            <Typography sx={{ fontSize: 14 }}>
              Week {getWeekNumber(now)}
            </Typography>
          </Box>

          <Box
            role="status"
            aria-live="polite"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: st.text,
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: st.dot,
                animation: st.pulse ? `${pulse} 2s ease-out infinite` : "none",
                [reducedMotion]: { animation: "none" },
              }}
            />
            <Typography
              sx={{ fontSize: 13, fontVariantNumeric: "tabular-nums" }}
            >
              {label}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
