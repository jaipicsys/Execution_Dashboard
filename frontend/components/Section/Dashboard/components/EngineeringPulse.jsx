import React from "react";
import { Box, Typography } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import CancelIcon from "@mui/icons-material/Cancel";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import SectionCard from "./shared/SectionCard";
import { COLORS } from "./shared/colors";

function PulseColumn({ title, color, Icon, items }) {
    return (
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color, mb: 0.75 }}>
                {title}
            </Typography>
            {items.map((item) => (
                <Box key={item} sx={{ display: "flex", alignItems: "flex-start", gap: 0.75, py: 0.3 }}>
                    <Icon sx={{ fontSize: 14, color, mt: "2px", flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 12.5, lineHeight: 1.3 }}>{item}</Typography>
                </Box>
            ))}
        </Box>
    );
}

export default function EngineeringPulse({ data }) {
    const PURPLE = "#6a3fc4";

    return (
        <SectionCard
            title="This Week – Engineering Pulse"
            icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 24 }} />}
        >
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <PulseColumn title="Completed" color={COLORS.green} Icon={CheckCircleIcon} items={data.completed} />
                <PulseColumn title="Next" color={COLORS.blue} Icon={ArrowCircleRightIcon} items={data.next} />
                <PulseColumn title="Blocked" color={COLORS.red} Icon={CancelIcon} items={data.blocked} />
            </Box>

            <Box
                sx={{
                    mt: "auto",
                    p: 1.5,
                    borderRadius: 1.5,
                    bgcolor: "#f3eefc",
                    border: "1px solid #ddd0f4",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75, color: PURPLE }}>
                    <FlagOutlinedIcon sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: PURPLE }}>
                        Management Decisions Required
                    </Typography>
                </Box>
                {data.decisions.map((d, i) => (
                    <Box key={d.text} sx={{ display: "flex", gap: 1, py: 0.3, fontSize: 12.5 }}>
                        <Typography sx={{ fontSize: 12.5, width: 14 }}>{i + 1}</Typography>
                        <Typography sx={{ fontSize: 12.5, flex: 1 }}>{d.text}</Typography>
                        <Typography sx={{ fontSize: 12.5, color: COLORS.muted, whiteSpace: "nowrap" }}>
                            Due: {d.due}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </SectionCard>
    );
}
