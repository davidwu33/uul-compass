import { getTasks, getWorkstreams, getUsers } from "@/lib/data";
import { getCurrentUser } from "@/lib/supabase/get-current-user";
import { MyTasksContent } from "./my-tasks-content";

export default async function MyTasksPage() {
  const [currentUser, allTasks, workstreams, userOptions] = await Promise.all([
    getCurrentUser(),
    getTasks(),
    getWorkstreams(),
    getUsers(),
  ]);

  const tasks = currentUser
    ? allTasks.filter((t) => t.assigneeId === currentUser.id)
    : [];

  return (
    <MyTasksContent
      tasks={tasks}
      currentUser={currentUser}
      workstreams={workstreams}
      userOptions={userOptions}
    />
  );
}
