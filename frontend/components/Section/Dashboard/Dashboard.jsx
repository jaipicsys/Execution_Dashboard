import React from "react";
import { Box, Grid, Skeleton } from "@mui/material";
import Header from "../../Layout/Header/Header";
import dashboardData from "./data/dashboardData";
import useDashboardCards from "./hooks/useDashboardCards";
import { COLORS } from "./theme/colors";
import CardError from "./CardError/CardError";

// Row 1 — KPI cards (live data from the Flask backend)
import ProductDevelopmentCard from "./ProductDevelopmentCard/ProductDevelopmentCard";
import ProductQualityCard from "./ProductQualityCard/ProductQualityCard";
import PilotsCard from "./PilotsCard/PilotsCard";
import DeploymentsCard from "./DeploymentsCard/DeploymentsCard";
import CommercialPipelineCard from "./CommercialPipelineCard/CommercialPipelineCard";
import ProductReleaseCard from "./ProductReleaseCard/ProductReleaseCard";

// Row 2
import ManagementAttention from "./ManagementAttention/ManagementAttention";
import ProductDevelopmentProgress from "./ProductDevelopmentProgress/ProductDevelopmentProgress";
import QualityDashboard from "./QualityDashboard/QualityDashboard";

// Row 3
import PilotOpportunityTracker from "./PilotOpportunityTracker/PilotOpportunityTracker";
import PilotFunnel from "./PilotFunnel/PilotFunnel";
import CustomerOpportunityPipeline from "./CustomerOpportunityPipeline/CustomerOpportunityPipeline";

// Row 4
import DeploymentTracker from "./DeploymentTracker/DeploymentTracker";
import AIModelPerformance from "./AIModelPerformance/AIModelPerformance";
import EngineeringPulse from "./EngineeringPulse/EngineeringPulse";

// key = property name in the /api/cards response
const KPI_CARDS = [
    { key: "productDevelopment", title: "Product Development", Component: ProductDevelopmentCard },
    { key: "productQuality", title: "Product Quality", Component: ProductQualityCard },
    { key: "pilots", title: "Pilots", Component: PilotsCard },
    { key: "deployments", title: "Deployments", Component: DeploymentsCard },
    { key: "commercial", title: "Commercial / Pipeline", Component: CommercialPipelineCard },
    { key: "release", title: "Product Release", Component: ProductReleaseCard },
];

const Dashboard = () => {
    const d = dashboardData; // rows 2-4 still use mock data
    const { cards, loading, error } = useDashboardCards();

    const renderKpi = ({ key, title, Component }) => {
        if (loading && !cards) {
            return <Skeleton variant="rounded" height={230} />;
        }
        if (!cards) {
            return <CardError title={title} message={error || "No response"} />;
        }
        const data = cards[key];
        if (!data || data.error) {
            return <CardError title={title} message={data?.error || "No data"} />;
        }
        return <Component data={data} />;
    };

    return (
        <>
            <Header />

            <Box sx={{ bgcolor: COLORS.pageBg, minHeight: "100vh", p: 2 }}>
                <Grid container spacing={2}>
                    {/* ROW 1 — KPI cards */}
                    {KPI_CARDS.map((card) => (
                        <Grid key={card.key} size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>
                            {renderKpi(card)}
                        </Grid>
                    ))}

                    {/* ROW 2 */}
                    <Grid size={{ xs: 12, lg: 5 }}>
                        <ManagementAttention rows={d.managementAttention} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <ProductDevelopmentProgress rows={d.developmentProgress} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 3 }}>
                        <QualityDashboard data={d.qualityDashboard} />
                    </Grid>

                    {/* ROW 3 */}
                    <Grid size={{ xs: 12, lg: 5 }}>
                        <PilotOpportunityTracker
                            pilots={d.pilotTracker}
                            opportunities={d.customerPipeline}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 3 }}>
                        <PilotFunnel stages={d.pilotFunnel} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <CustomerOpportunityPipeline rows={d.customerPipeline} />
                    </Grid>

                    {/* ROW 4 */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <DeploymentTracker rows={d.deploymentTracker} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <AIModelPerformance views={d.aiModelPerformance} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <EngineeringPulse data={d.engineeringPulse} />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Dashboard;
