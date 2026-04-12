import { getValueInitiatives, getValueSnapshots, getWorkstreams, getUsers, getGrowthPriorities } from "@/lib/data";
import { getCurrentUser } from "@/lib/supabase/get-current-user";
import { ValueGainsContent } from "./value-gains-content";

export default async function GrowthPage() {
  const [initiatives, snapshots, workstreams, userOptions, currentUser, growthPriorities] = await Promise.all([
    getValueInitiatives(),
    getValueSnapshots(),
    getWorkstreams(),
    getUsers(),
    getCurrentUser(),
    getGrowthPriorities(),
  ]);

  return (
    <ValueGainsContent
      initiatives={initiatives}
      snapshots={snapshots}
      workstreams={workstreams}
      userOptions={userOptions}
      currentUser={currentUser}
      growthPriorities={growthPriorities}
    />
  );
}
