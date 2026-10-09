import React, { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import SectionCard from "./shared/SectionCard";
import DataTable from "./shared/DataTable";
import HealthDot from "./shared/HealthDot";
import { COLORS } from "./shared/colors";

const columns = [
    { key: "code", label: "Project Code" },
    { key: "industry", label: "Industry" },
    { key: "type", label: "Type" },
    { key: "stage", label: "Stage" },
    { key: "health", label: "Health", render: (r) => <HealthDot status={r.health} /> },
    { key: "target", label: "Target Date" },
    { key: "owner", label: "Owner" },
];

export default function CustomerOpportunityPipeline({ rows }) {
    const [filter, setFilter] = useState("All");

    const count = (type) => rows.filter((r) => r.type === type).length;
    const options = [
        { value: "All", label: `All (${rows.length})` },
        { value: "Pilot", label: `Pilot (${count("Pilot")})` },
        { value: "Prospect", label: `Prospect (${count("Prospect")})` },
    ];
    const visible = filter === "All" ? rows : rows.filter((r) => r.type === filter);

    return (
        <SectionCard
            title="Customer Opportunity Pipeline"
            icon={<BusinessCenterOutlinedIcon sx={{ fontSize: 24 }} />}
            action={
                <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={filter}
                    onChange={(_, v) => v && setFilter(v)}
                    aria-label="Filter opportunities"
                    sx={{
                        "& .MuiToggleButton-root": {
                            textTransform: "none",
                            fontSize: 12,
                            py: 0.25,
                            px: 1.25,
                            color: COLORS.muted,
                        },
                        "& .Mui-selected": {
                            bgcolor: "#dbe9fb !important",
                            color: `${COLORS.blue} !important`,
                        },
                    }}
                >
                    {options.map((o) => (
                        <ToggleButton key={o.value} value={o.value}>
                            {o.label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            }
        >
            <DataTable columns={columns} rows={visible} rowKey="code" />
        </SectionCard>
    );
}
