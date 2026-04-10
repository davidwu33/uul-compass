import { getRisks, getLinkedTasksMap, getWorkstreams, getUsers } from "@/lib/data";
import { getCurrentUser } from "@/lib/supabase/get-current-user";
import { RisksContent } from "./risks-content";

export default async function RisksPage() {
  const [risks, linkedTasksMap, workstreams, userOptions, currentUser] = await Promise.all([
    getRisks(),
    getLinkedTasksMap(),
    getWorkstreams(),
    getUsers(),
    getCurrentUser(),
  ]);

  return (
    <RisksContent
      risks={risks}
      linkedTasksMap={linkedTasksMap}
      workstreams={workstreams}
      userOptions={userOptions}
      currentUser={currentUser}
    />
  );
}
