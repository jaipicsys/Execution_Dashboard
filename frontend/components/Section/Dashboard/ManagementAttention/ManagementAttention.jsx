import React from "react";
import { Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import SectionCard from "../SectionCard/SectionCard";
import DataTable from "../DataTable/DataTable";
import StatusChip from "../StatusChip/StatusChip";
import { COLORS } from "../theme/colors";

const columns = [
    { key: "issue", label: "Issue / Risk" },
    { key: "area", label: "Area" },
    { key: "owner", label: "Owner" },
    {
        key: "age",
        label: "Age",
        render: (r) => (
            <Typography component="span" sx={{ fontSize: 12.5, fontWeight: 700, color: COLORS.red }}>
                {r.age}
            </Typography>
        ),
    },
    { key: "nextAction", label: "Next Action" },
    {
        key: "status",
        label: "Status",
        render: (r) => <StatusChip status={r.status} />,
    },
];

export default function ManagementAttention({ rows }) {
    return (
        <SectionCard
            title="Management Attention"
            titleColor={COLORS.red}
            icon={<WarningIcon sx={{ fontSize: 24 }} />}
        >
            <DataTable columns={columns} rows={rows} />
        </SectionCard>
    );
}
