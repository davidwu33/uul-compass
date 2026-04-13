import type { ChatMessage, ProposalPayload } from "@/hooks/use-chat";

/**
 * Merge a newly-parsed proposal into the current message list.
 * At most one ProposalCard per field. If one already exists, update in place.
 */
export function mergeProposal(
  messages: ChatMessage[],
  proposal: ProposalPayload,
  parentAssistantId: string
): ChatMessage[] {
  const existingIdx = messages.findIndex(
    (m) => m.proposalPayload?.field === proposal.field
  );

  if (existingIdx >= 0) {
    const next = messages.slice();
    next[existingIdx] = {
      ...next[existingIdx],
      proposalPayload: proposal,
      proposalStatus: "pending",
    };
    return next;
  }

  const newCard: ChatMessage = {
    id: `proposal-${parentAssistantId}-${proposal.field}`,
    role: "assistant",
    content: "",
    proposalPayload: proposal,
    proposalStatus: "pending",
  };
  return [...messages, newCard];
}

/**
 * Mark a specific proposal message as regenerating.
 */
export function markProposalRegenerating(
  messages: ChatMessage[],
  messageId: string
): ChatMessage[] {
  return messages.map((m) =>
    m.id === messageId && m.proposalPayload
      ? { ...m, proposalStatus: "regenerating" }
      : m
  );
}
