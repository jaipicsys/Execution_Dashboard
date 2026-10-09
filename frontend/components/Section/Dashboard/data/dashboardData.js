/*
 * Mock data for the Execution Dashboard.
 * Replace each section with your API response — components only read these shapes.
 */
const dashboardData = {
    productDevelopment: { total: 18, onTrack: 11, atRisk: 4, overdue: 3 },

    productQuality: {
        openBugs: 32,
        critical: 7,
        high: 12,
        medium: 13,
        overdue: 5,
    },

    pilots: { total: 3, onTrack: 2, atRisk: 1, blocked: 0 },

    deployments: { total: 0, onTrack: 0, atRisk: 0, blocked: 0 },

    commercial: { total: 6, pilot: 2, prospect: 4 },

    release: {
        version: "V1.4",
        target: "15 Oct 2026",
        overall: 72,
        items: [
            { label: "Core Features", value: 90, status: "onTrack" },
            { label: "AI Models", value: 80, status: "atRisk" },
            { label: "Testing", value: 60, status: "atRisk" },
            { label: "Documentation", value: 50, status: "blocked" },
        ],
    },

    managementAttention: [
        { issue: "Cycle detection misses", area: "AI/ML", owner: "Arjun", age: "3 days", nextAction: "Validate model with GT", status: "Blocked" },
        { issue: "Camera/network access", area: "Pilot", owner: "Priya", age: "5 days", nextAction: "Follow up with customer", status: "Blocked" },
        { issue: "Step & sequence validation", area: "Product", owner: "Rahul", age: "4 days", nextAction: "Complete testing", status: "At Risk" },
        { issue: "Server configuration", area: "Deployment", owner: "Vikram", age: "2 days", nextAction: "Finalize setup", status: "At Risk" },
        { issue: "Commercial proposal follow-up", area: "Sales", owner: "Sharath", age: "10 days", nextAction: "Customer meeting", status: "At Risk" },
    ],

    developmentProgress: [
        { module: "LinePulse Core – Cycle Time", progress: 95, status: "onTrack", target: "Done" },
        { module: "LinePulse Core – Throughput", progress: 90, status: "onTrack", target: "10 Oct" },
        { module: "LinePulse Process – Step Detection", progress: 75, status: "atRisk", target: "15 Oct" },
        { module: "LinePulse Process – Sequence Validation", progress: 65, status: "atRisk", target: "18 Oct" },
        { module: "LinePulse Flow – Bottleneck Detection", progress: 50, status: "atRisk", target: "25 Oct" },
        { module: "Platform – Multi-camera Management", progress: 30, status: "blocked", target: "30 Oct" },
        { module: "Analytics – Loss Tree & Reports", progress: 60, status: "atRisk", target: "28 Oct" },
    ],

    qualityDashboard: {
        openBugs: 32,
        severity: [
            { label: "Critical", value: 7 },
            { label: "High", value: 12 },
            { label: "Medium", value: 13 },
            { label: "Low", value: 6 },
        ],
        stats: {
            createdThisWeek: 18,
            closedThisWeek: 14,
            overdue: 5,
            avgCloseTime: "4.6 days",
        },
        accuracy: [
            { label: "Cycle Detection", value: 96.0 },
            { label: "Step Detection", value: 88.5 },
            { label: "Sequence", value: 85.2 },
        ],
    },

    pilotTracker: [
        { code: "B517", industry: "Automotive Tier-1", type: "Pilot", stage: "Validation", health: "atRisk", milestone: "Accuracy validation", owner: "Priya" },
        { code: "T528", industry: "Textile – Loom", type: "Pilot", stage: "Deployment", health: "onTrack", milestone: "30-loom trial", owner: "Arjun" },
        { code: "H635", industry: "Heavy Industry", type: "Pilot", stage: "Data Collection", health: "onTrack", milestone: "Baseline report", owner: "Vikram" },
    ],

    pilotFunnel: [
        { stage: "Leads", value: 22 },
        { stage: "Qualified", value: 15 },
        { stage: "Pilot Proposed", value: 10 },
        { stage: "Pilot Approved", value: 6 },
        { stage: "Installation", value: 5 },
        { stage: "Data Collection", value: 5 },
        { stage: "Validation", value: 4 },
        { stage: "Results Shared", value: 3 },
        { stage: "Commercial Discussion", value: 2 },
        { stage: "Deployment", value: 1 },
    ],

    customerPipeline: [
        { code: "B563", industry: "Automotive Tier-1", type: "Pilot", stage: "Qualified", health: "atRisk", target: "Nov '26", owner: "Rahul" },
        { code: "T641", industry: "Textile – Garment Folding/Packing", type: "Prospect", stage: "Initial Discussion", health: "pending", target: "Dec '26", owner: "Priya" },
        { code: "E368", industry: "Electronics / EMS", type: "Pilot", stage: "Qualified", health: "atRisk", target: "Nov '26", owner: "Arjun" },
        { code: "A518", industry: "Automotive OEM – EV", type: "Prospect", stage: "Initial Discussion", health: "pending", target: "Dec '26", owner: "Vikram" },
        { code: "B739", industry: "Automotive Tier-1", type: "Prospect", stage: "Qualified", health: "atRisk", target: "Nov '26", owner: "Rahul" },
        { code: "F586", industry: "Automotive Fabrication / Welding", type: "Prospect", stage: "Initial Discussion", health: "pending", target: "Dec '26", owner: "Sharath" },
    ],

    deploymentTracker: [
        { code: "B517", hardware: "complete", installation: "complete", configuration: "complete", calibration: "pending", status: "Not Started", target: "TBD", owner: "Priya" },
        { code: "T528", hardware: "complete", installation: "inProgress", configuration: "pending", calibration: "pending", status: "Planned", target: "TBD", owner: "Arjun" },
        { code: "H635", hardware: "pending", installation: "pending", configuration: "pending", calibration: "pending", status: "Not Started", target: "TBD", owner: "Vikram" },
    ],

    aiModelPerformance: {
        "Overall (All Pilots)": {
            metrics: [
                { label: "Cycle Detection Accuracy", value: "96.0%", tone: "good" },
                { label: "Missed Cycles", value: "7", tone: "bad" },
                { label: "False Cycles", value: "2", tone: "neutral" },
                { label: "Step Detection Accuracy", value: "88.5%", tone: "good" },
                { label: "Sequence Accuracy", value: "85.2%", tone: "good" },
            ],
            labels: ["Oct 1", "Oct 2", "Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7"],
            series: [
                { name: "Cycle Detection", color: "#1565c0", values: [82, 87, 91, 93, 92, 94, 95] },
                { name: "Step Detection", color: "#1fa64a", values: [80, 80, 82, 84, 85, 87, 88] },
            ],
        },
    },

    engineeringPulse: {
        completed: ["Cycle-time validation V1", "Dashboard calibration", "New model deployed"],
        next: ["Step detection validation", "Regression testing", "Pilot reports"],
        blocked: ["Customer RTSP access", "Model tuning", "Sequence validation testing"],
        decisions: [
            { text: "Approve server architecture (deployment)", due: "10 Oct" },
            { text: "Freeze V1.4 feature scope", due: "10 Oct" },
            { text: "Decide on cloud vs on-prem for next deployment", due: "15 Oct" },
        ],
    },
};

export default dashboardData;
