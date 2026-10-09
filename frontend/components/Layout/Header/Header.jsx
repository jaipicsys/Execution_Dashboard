import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Box, Typography } from "@mui/material";

const NAV_ITEMS = [
    "Product",
    "Quality",
    "Pilots",
    "Deployments",
    "Commercial",
    "Team",
];

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

export default function Header({ title = "EXECUTION DASHBOARD" }) {
    const [now, setNow] = useState(new Date());

    // Refresh the clock every 30 seconds
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(id);
    }, []);

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background:
                    "linear-gradient(90deg, #101b18 0%, #42997f 50%, #101b18 100%)",
                boxShadow: "none",
                color: "#ffffff",
            }}
        >
            <Toolbar
                sx={{
                    minHeight: "76px !important",
                    px: { xs: "12px !important", md: "32px !important" },
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                {/* LEFT — brand */}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box
                        component="img"
                        src="/logo.svg"
                        alt="Eigenstate AI"
                        sx={{
                            height: 36,
                            width: "auto",
                            display: "block",
                            objectFit: "contain",
                            alignSelf: "flex-start",
                        }}
                    />
                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 400,
                            color: "#ffffff",
                            mt: "2px",
                        }}
                    >
                        Edge Vision. Industrial Intelligence.
                    </Typography>
                </Box>

                {/* CENTER — title + nav */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
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

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: "4px",
                        }}
                    >
                        {NAV_ITEMS.map((item, i) => (
                            <React.Fragment key={item}>
                                {i > 0 && (
                                    <Box
                                        sx={{
                                            width: "1px",
                                            height: 14,
                                            bgcolor: "rgba(255,255,255,0.6)",
                                            mx: 2,
                                        }}
                                    />
                                )}
                                <Typography sx={{ fontSize: 14 }}>
                                    {item}
                                </Typography>
                            </React.Fragment>
                        ))}
                    </Box>
                </Box>

                {/* RIGHT — date/week + live status */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "6px",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography sx={{ fontSize: 14 }}>
                            {formatDate(now)}
                        </Typography>
                        <Box
                            sx={{
                                width: "1px",
                                height: 14,
                                bgcolor: "rgba(255,255,255,0.6)",
                                mx: 2,
                            }}
                        />
                        <Typography sx={{ fontSize: 14 }}>
                            Week {getWeekNumber(now)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: "#6fcf3a",
                            }}
                        />
                        <Typography sx={{ fontSize: 13 }}>
                            Live – Updated {formatTime(now)}
                        </Typography>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}