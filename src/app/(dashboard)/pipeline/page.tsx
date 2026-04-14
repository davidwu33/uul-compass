import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/get-current-user";
import {
  getDemandSignals,
  getDemandAggregates,
  getCarrierContracts,
  getPipelineSummary,
} from "@/lib/data/pipeline";
import { getSalesData } from "@/lib/data";
import { PipelineContent } from "./pipeline-content";

/**
 * /pipeline — Sales → Demand → Fulfillment → Carrier Contracts.
 *
 * The commercial loop, end-to-end. Reading scoped by accessibleEntityIds.
 * David: style the content component; this page just loads data.
 */
export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const tab = params.tab ?? "sales";

  const entityIds = user.accessibleEntityIds;

  const [summary, signals, aggregates, contracts] = await Promise.all([
    getPipelineSummary(entityIds),
    getDemandSignals(entityIds),
    getDemandAggregates(entityIds),
    getCarrierContracts(entityIds),
  ]);

  return (
    <PipelineContent
      initialTab={tab}
      summary={summary}
      signals={signals}
      aggregates={aggregates}
      contracts={contracts}
      salesData={getSalesData()}
      user={{ id: user.id, fullName: user.fullName, role: user.role }}
    />
  );
}
