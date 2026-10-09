import React, { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import SectionCard from "./shared/SectionCard";
import DataTable from "./shared/DataTable";
import HealthDot from "./shared/HealthDot";
import { COLORS } from "./shared/colors";

const health = (r) => <HealthDot status={r.health} />;

const pilotColumns = [
    { key: "code", label: "Project Code" },
    { key: "industry", label: "Industry" },
    { key: "type", label: "Type" },
    { key: "stage", label: "Stage" },
    { key: "health", label: "Health", render: health },
    { key: "milestone", label: "Next Milestone" },
    { key: "owner", label: "Owner" },
];

const opportunityColumns = [
    { key: "code", label: "Project Code" },
    { key: "industry", label: "Industry" },
    { key: "type", label: "Type" },
    { key: "stage", label: "Stage" },
    { key: "health", label: "Health", render: health },
    { key: "target", label: "Target Date" },
    { key: "owner", label: "Owner" },
];

export default function PilotOpportunityTracker({ pilots, opportunities }) {
    const [tab, setTab] = useState(0);

    return (
        <SectionCard
            title="Pilot & Opportunity Tracker"
            icon={<ScienceOutlinedIcon sx={{ fontSize: 24 }} />}
        >
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{
                    minHeight: 36,
                    mb: 1.5,
                    borderBottom: `1px solid ${COLORS.border}`,
                    "& .MuiTab-root": {
                        minHeight: 36,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: 13,
                    },
                }}
            >
                <Tab label={`Active Pilots (${pilots.length})`} />
                <Tab label={`Opportunities (${opportunities.length})`} />
            </Tabs>

            {tab === 0 ? (
                <DataTable columns={pilotColumns} rows={pilots} rowKey="code" />
            ) : (
                <DataTable columns={opportunityColumns} rows={opportunities} rowKey="code" />
            )}
        </SectionCard>
    );
}
