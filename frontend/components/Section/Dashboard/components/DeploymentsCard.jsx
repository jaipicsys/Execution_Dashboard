import React from "react";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import KpiCard from "./shared/KpiCard";
import SegmentedBar, { buildStatusSegments } from "./shared/SegmentedBar";
import Legend, { statusLegend } from "./shared/Legend";

export default function DeploymentsCard({ data }) {
    return (
        <KpiCard
            icon={<DnsOutlinedIcon sx={{ fontSize: 26 }} />}
            title="Deployments"
            value={data.total}
            label="In Deployment"
        >
            <SegmentedBar
                segments={buildStatusSegments(data.onTrack, data.atRisk, data.blocked)}
            />
            <Legend items={statusLegend("Blocked")} />
        </KpiCard>
    );
}
