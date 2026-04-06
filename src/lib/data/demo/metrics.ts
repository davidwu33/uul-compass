import type { MetricData } from "../types";

// Top scorecard metrics shown on Dashboard
// These are the 4 key metrics from the 100-Day Plan Success Scorecard
export const demoScorecard: MetricData[] = [
  {
    id: "metric-dso",
    name: "Collection Speed",
    value: "47 days",
    target: "< 45 days",
    status: "amber",
    trend: "flat",
    category: "financial",
  },
  {
    id: "metric-sop",
    name: "SOP Adoption",
    value: "12%",
    target: "> 80%",
    status: "red",
    trend: "up",
    category: "operations",
  },
  {
    id: "metric-ai",
    name: "AI Pilots Running",
    value: "1",
    target: "≥ 3",
    status: "amber",
    trend: "up",
    category: "technology",
  },
  {
    id: "metric-rev-person",
    name: "Revenue / Person",
    value: "$178K",
    target: "+20%",
    status: "gray",
    trend: "flat",
    category: "people",
  },
];

// Extended metrics for potential future KPI page
export const demoAllMetrics: MetricData[] = [
  ...demoScorecard,
  { id: "metric-gm", name: "Gross Margin", value: "22%", target: "15-30%", status: "green", category: "financial" },
  { id: "metric-ebitda", name: "Profit Margin", value: "9%", target: "8-15%", status: "green", category: "financial" },
  { id: "metric-otif", name: "On-Time Delivery", value: "93%", target: "> 95%", status: "amber", category: "operations" },
  { id: "metric-retention", name: "Customer Retention", value: "96%", target: "> 90%", status: "green", category: "operations" },
  { id: "metric-volume", name: "Shipment Volume", value: "1,240", target: "Track MoM", status: "green", trend: "up", category: "operations" },
  { id: "metric-newcust", name: "New Customers", value: "3", target: "Monthly pipeline", status: "green", trend: "up", category: "operations" },
  { id: "metric-winrate", name: "RFP Win Rate", value: "28%", target: "> 30%", status: "amber", category: "operations" },
  { id: "metric-headcount", name: "Net Headcount", value: "0", target: "Flat or reduced", status: "green", category: "people" },
];
