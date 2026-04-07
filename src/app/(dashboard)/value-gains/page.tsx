import { getValueInitiatives, getValueSnapshots } from "@/lib/data";
import { ValueGainsContent } from "./value-gains-content";

export default async function GrowthPage() {
  const [initiatives, snapshots] = await Promise.all([
    getValueInitiatives(),
    getValueSnapshots(),
  ]);
  return <ValueGainsContent initiatives={initiatives} snapshots={snapshots} />;
}
