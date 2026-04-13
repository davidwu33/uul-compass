/**
 * Parses `json-proposal` fenced code blocks out of Compass AI's streamed text.
 *
 * Format AI is instructed to emit (see system-prompt.ts):
 *   ```json-proposal
 *   {"field":"status","value":"in_progress","reasoning":"..."}
 *   ```
 *
 * Returns the cleaned text (fences stripped) plus extracted proposals,
 * so the assistant message renders plain prose while proposals surface as
 * separate ProposalCard messages.
 */

export type ParsedProposal = {
  field: string;
  value: string;
  reasoning?: string;
};

const FENCE_RE = /```json-proposal\s*\n([\s\S]*?)\n```/g;

export function extractProposals(text: string): {
  cleaned: string;
  proposals: ParsedProposal[];
} {
  const proposals: ParsedProposal[] = [];
  FENCE_RE.lastIndex = 0;

  const cleaned = text.replace(FENCE_RE, (_match, body: string) => {
    const trimmed = body.trim();
    if (!trimmed) return "";
    try {
      const parsed = JSON.parse(trimmed);
      if (
        parsed &&
        typeof parsed.field === "string" &&
        typeof parsed.value === "string"
      ) {
        proposals.push({
          field: parsed.field,
          value: parsed.value,
          reasoning:
            typeof parsed.reasoning === "string" ? parsed.reasoning : undefined,
        });
        return "";
      }
    } catch {
      return _match;
    }
    return _match;
  });

  return {
    cleaned: cleaned.replace(/\n{3,}/g, "\n\n").trimEnd(),
    proposals,
  };
}
