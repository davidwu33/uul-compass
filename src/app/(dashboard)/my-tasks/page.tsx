import { getTasksByAssignee } from "@/lib/data";
import { MyTasksContent } from "./my-tasks-content";

// TODO: replace with session user once auth is wired
const CURRENT_USER = "Jerry Shi";

export default async function MyTasksPage() {
  const tasks = await getTasksByAssignee(CURRENT_USER);
  return <MyTasksContent tasks={tasks} />;
}
