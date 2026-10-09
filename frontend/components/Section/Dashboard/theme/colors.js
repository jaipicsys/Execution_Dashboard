export const COLORS = {
    green: "#1fa64a",
    amber: "#f6b42c",
    red: "#e53935",
    blue: "#1565c0",
    lightBlue: "#64a8f0",
    grey: "#9e9e9e",
    navy: "#0d2a4d",
    text: "#1b2a3a",
    muted: "#5b6b7c",
    border: "#e3e8ef",
    headBg: "#f3f6fa",
    pageBg: "#eef2f7",
    paper: "#ffffff",
};

/* One lookup for every status / health dot in the dashboard */
export const STATUS_COLOR = {
    onTrack: COLORS.green,
    complete: COLORS.green,
    atRisk: COLORS.amber,
    inProgress: COLORS.amber,
    blocked: COLORS.red,
    overdue: COLORS.red,
    pending: "#bdbdbd",
    notStarted: "#bdbdbd",
    planned: COLORS.blue,
};
