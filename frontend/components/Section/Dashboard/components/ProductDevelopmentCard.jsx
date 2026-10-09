import React from "react";
import CodeIcon from "@mui/icons-material/Code";
import KpiCard from "./shared/KpiCard";
import SegmentedBar, { buildStatusSegments } from "./shared/SegmentedBar";
import Legend, { statusLegend } from "./shared/Legend";

export default function ProductDevelopmentCard({ data }) {
    return (
        <KpiCard
            icon={<CodeIcon sx={{ fontSize: 26 }} />}
            title="Product Development"
            value={data.total}
            label="Active Features"
        >
            <SegmentedBar
                segments={buildStatusSegments(data.onTrack, data.atRisk, data.overdue)}
            />
            <Legend items={statusLegend("Overdue")} />
        </KpiCard>
    );
}
