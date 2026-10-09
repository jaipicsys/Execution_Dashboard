import React from "react";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import KpiCard from "../KpiCard/KpiCard";
import SegmentedBar, { buildStatusSegments } from "../SegmentedBar/SegmentedBar";
import Legend, { statusLegend } from "../Legend/Legend";

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
