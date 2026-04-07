import { getRisks, getLinkedTasksMap } from "@/lib/data";
import { RisksContent } from "./risks-content";

export default async function RisksPage() {
  const [risks, linkedTasksMap] = await Promise.all([getRisks(), getLinkedTasksMap()]);
  return <RisksContent risks={risks} linkedTasksMap={linkedTasksMap} />;
}
