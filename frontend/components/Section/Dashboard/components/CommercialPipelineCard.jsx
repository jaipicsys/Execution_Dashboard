import React from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
import KpiCard from "./shared/KpiCard";
import SegmentedBar from "./shared/SegmentedBar";
import Legend from "./shared/Legend";
import { COLORS } from "./shared/colors";

export default function CommercialPipelineCard({ data }) {
    return (
        <KpiCard
            icon={<BarChartIcon sx={{ fontSize: 26 }} />}
            title="Commercial / Pipeline"
            value={data.total}
            label="Active Opportunities"
        >
            <SegmentedBar
                segments={[
                    { value: data.pilot, color: "#1450b8" },
                    { value: data.prospect, color: COLORS.lightBlue },
                ]}
            />
            <Legend
                items={[
                    { label: "Pilot", color: "#1450b8" },
                    { label: "Prospect", color: COLORS.lightBlue },
                ]}
            />
        </KpiCard>
    );
}
