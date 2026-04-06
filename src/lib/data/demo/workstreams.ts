import type { WorkstreamData } from "../types";

// targetCompletion = expected % done by current day (Day 1 baseline)
export const demoWorkstreams: WorkstreamData[] = [
  { id: "ws-finance", name: "Finance", color: "#ef4444", taskCount: 19, completed: 0, targetCompletion: 5 },
  { id: "ws-operations", name: "Operations", color: "#f97316", taskCount: 21, completed: 0, targetCompletion: 5 },
  { id: "ws-sales", name: "Sales", color: "#3b82f6", taskCount: 13, completed: 0, targetCompletion: 3 },
  { id: "ws-marketing", name: "Brand & Marketing", color: "#8b5cf6", taskCount: 13, completed: 3, targetCompletion: 15 },
  { id: "ws-tech", name: "Technology & AI", color: "#06b6d4", taskCount: 20, completed: 0, targetCompletion: 5 },
  { id: "ws-org", name: "Organization & HR", color: "#22c55e", taskCount: 16, completed: 2, targetCompletion: 10 },
];
