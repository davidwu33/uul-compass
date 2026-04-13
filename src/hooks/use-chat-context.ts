"use client";

import { usePathname, useParams } from "next/navigation";
import { useMemo } from "react";
import type { PageContext } from "@/lib/ai/system-prompt";
import { usePageBridge } from "@/lib/ai/page-bridge";

/**
 * Reads the current Compass route and extracts entity + form context
 * for the AI chat API.
 */
export function useChatContext(): PageContext {
  const pathname = usePathname();
  const params = useParams();
  const bridge = usePageBridge();

  return useMemo(() => {
    const id = params?.id as string | undefined;
    let base: PageContext;

    if (pathname.match(/^\/tasks\/[^/]+$/) && id) {
      base = { route: pathname, entityType: "task", entityId: id };
    } else if (pathname === "/plan") {
      base = { route: pathname, entityType: "plan" };
    } else if (pathname === "/risks") {
      base = { route: pathname, entityType: "risks" };
    } else if (pathname === "/value-gains") {
      base = { route: pathname, entityType: "initiatives" };
    } else if (pathname === "/decisions") {
      base = { route: pathname, entityType: "decisions" };
    } else if (pathname === "/my-tasks") {
      base = { route: pathname, entityType: "plan" };
    } else if (pathname === "/settings") {
      base = { route: pathname, entityType: "settings" };
    } else if (pathname === "/") {
      base = { route: pathname, entityType: "dashboard" };
    } else {
      base = { route: pathname };
    }

    // Layer in PageBridge form fields if the current page registered any.
    if (bridge.route === pathname && bridge.fields.length > 0) {
      base = {
        ...base,
        formFields: bridge.fields.map((f) => ({
          name: f.name,
          label: f.label,
          type: f.type,
          value: f.value,
          options: f.options,
          placeholder: f.placeholder,
        })),
        formSummary: bridge.summary ?? undefined,
      };
    }

    return base;
  }, [pathname, params, bridge.route, bridge.fields, bridge.summary]);
}
