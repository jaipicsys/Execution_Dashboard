import React from "react";
import { Box, Grid } from "@mui/material";
import Header from "../../Layout/Header/Header";
import dashboardData from "./data/dashboardData";
import { COLORS } from "./theme/colors";

// Row 1 — KPI cards
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

const Dashboard = () => {
    const d = dashboardData;

    return (
        <>
            <Header />

            <Box sx={{ bgcolor: COLORS.pageBg, minHeight: "100vh", p: 2 }}>
                <Grid container spacing={2}>
                    {/* ROW 1 — KPI cards */}
                    <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>
                        <ProductDevelopmentCard data={d.productDevelopment} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>
                        <ProductQualityCard data={d.productQuality} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>
                        <PilotsCard data={d.pilots} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>
                        <DeploymentsCard data={d.deployments} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>
                        <CommercialPipelineCard data={d.commercial} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>
                        <ProductReleaseCard data={d.release} />
                    </Grid>

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
