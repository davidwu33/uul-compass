import { getValueInitiatives, getValueSnapshots, getWorkstreams, getUsers, getGrowthPriorities } from "@/lib/data";
import { getCurrentUser } from "@/lib/supabase/get-current-user";
import { FinanceContent } from "./finance-content";

export default async function FinancePage() {
  const [initiatives, snapshots, workstreams, userOptions, currentUser, growthPriorities] = await Promise.all([
    getValueInitiatives(),
    getValueSnapshots(),
    getWorkstreams(),
    getUsers(),
    getCurrentUser(),
    getGrowthPriorities(),
  ]);

  return (
    <FinanceContent
      initiatives={initiatives}
      snapshots={snapshots}
      workstreams={workstreams}
      userOptions={userOptions}
      currentUser={currentUser}
      growthPriorities={growthPriorities}
    />
  );
}
