import React from "react";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import SectionCard from "./shared/SectionCard";
import DataTable from "./shared/DataTable";
import HealthDot from "./shared/HealthDot";
import StatusChip from "./shared/StatusChip";

const dot = (key) => (r) => <HealthDot status={r[key]} />;

const columns = [
    { key: "code", label: "Project Code" },
    { key: "hardware", label: "Hardware", align: "center", render: dot("hardware") },
    { key: "installation", label: "Installation", align: "center", render: dot("installation") },
    { key: "configuration", label: "Configuration", align: "center", render: dot("configuration") },
    { key: "calibration", label: "Calibration", align: "center", render: dot("calibration") },
    { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
    { key: "target", label: "Target Date" },
    { key: "owner", label: "Owner" },
];

export default function DeploymentTracker({ rows }) {
    return (
        <SectionCard
            title="Deployment Tracker"
            icon={<DnsOutlinedIcon sx={{ fontSize: 24 }} />}
        >
            <DataTable columns={columns} rows={rows} rowKey="code" />
        </SectionCard>
    );
}
