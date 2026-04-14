// TODO: Superseded by homepage (/) Project Tasks section.
// Remove this page once stakeholders confirm no direct links remain.
import {
  getTasks,
  getWorkstreams,
  getPhases,
  getGates,
  getMilestones,
  getCurrentDay,
  getUsers,
} from "@/lib/data";
import { getCurrentUser } from "@/lib/supabase/get-current-user";
import { PlanContent } from "./plan-content";

export default async function PlanPage() {
  const [tasks, workstreams, phases, gates, milestones, currentDay, currentUser, userOptions] =
    await Promise.all([
      getTasks(),
      getWorkstreams(),
      getPhases(),
      getGates(),
      getMilestones(),
      getCurrentDay(),
      getCurrentUser(),
      getUsers(),
    ]);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const directivesPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <PlanContent
      tasks={tasks}
      workstreams={workstreams}
      phases={phases}
      gates={gates}
      milestones={milestones}
      currentDay={currentDay}
      totalTasks={totalTasks}
      doneTasks={doneTasks}
      directivesPct={directivesPct}
      currentUser={currentUser}
      userOptions={userOptions}
    />
  );
}
