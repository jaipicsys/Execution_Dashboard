import React from "react";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import KpiCard from "./shared/KpiCard";
import SegmentedBar, { buildStatusSegments } from "./shared/SegmentedBar";
import Legend, { statusLegend } from "./shared/Legend";

export default function PilotsCard({ data }) {
    return (
        <KpiCard
            icon={<ScienceOutlinedIcon sx={{ fontSize: 26 }} />}
            title="Pilots"
            value={data.total}
            label="Active Pilots"
        >
            <SegmentedBar
                segments={buildStatusSegments(data.onTrack, data.atRisk, data.blocked)}
            />
            <Legend items={statusLegend("Blocked")} />
        </KpiCard>
    );
}
