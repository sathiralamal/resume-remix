/**
 * AI Guardrails for Resume Remxi
 *
 * Server-side, zero-latency heuristic checks applied to all three input
 * fields before any AI call is made. No external API required.
 *
 * Threats mitigated:
 *  - Prompt injection / instruction overriding
 *  - Jailbreak / role-play attacks
 *  - System prompt extraction attempts
 *  - Off-topic requests (code generation, creative writing, etc.)
 *  - Gibberish / keyboard spam
 *  - Model control token injection
 */

export type GuardrailField = "experience" | "skills" | "jobDescription";

export type GuardrailResult =
  | { ok: true }
  | { ok: false; field: GuardrailField; reason: string; code: string };

interface RemixInput {
  experience: string;
  skills: string;
  jobDescription: string;
}

// ─── Threat Pattern Libraries ─────────────────────────────────────────────────

const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above|earlier|initial)\s+(instructions?|prompts?|context|rules?|constraints?)/i,
  /disregard\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?)/i,
  /forget\s+(everything|all|your\s+instructions?|what\s+you\s+were\s+told)/i,
  /new\s+(instructions?|task|objective|goal|role|rules?|system\s+prompt)\s*:/i,
  /\[new\s+instruction\]/i,
  /\[system\]/i,
  /\[user\]/i,
  /\[assistant\]/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /\[INST\]/i,
  /<<SYS>>/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /pretend\s+(you\s+are|to\s+be|you're)\s+(a|an)\s+/i,
  /act\s+as\s+(if\s+you\s+are\s+)?(a|an)\s+/i,
  /roleplay\s+as\s+/i,
  /from\s+now\s+on\s+(you\s+are|be|act)/i,
  /your\s+(new\s+)?(role|persona|identity|name)\s+is/i,
  /override\s+(the\s+)?(system|safety|previous)\s+(prompt|instructions?)/i,
  /bypass\s+(the\s+)?(filter|safety|restrictions?|guardrails?)/i,
];

const JAILBREAK_PATTERNS: RegExp[] = [
  /\bDAN\b/,
  /jailbreak/i,
  /no\s+restrictions/i,
  /without\s+(any\s+)?(restrictions?|limits?|filters?|constraints?)/i,
  /remove\s+(all\s+)?(restrictions?|filters?|safety|constraints?)/i,
  /you\s+have\s+no\s+(restrictions?|limits?|rules?)/i,
  /imagine\s+(you\s+have\s+no|there\s+are\s+no)\s+(restrictions?|rules?|limits?)/i,
  /in\s+(developer|god|admin|maintenance|debug)\s+mode/i,
  /developer\s+mode\s*(enabled|on|activated)/i,
];

const EXTRACTION_PATTERNS: RegExp[] = [
  /repeat\s+(the\s+)?(system|your|this|above|initial)\s+(prompt|instructions?|message|context)/i,
  /print\s+(the\s+)?(system|your|this|above|initial)\s+(prompt|instructions?)/i,
  /show\s+(me\s+)?(your|the)\s+(system\s+)?(prompt|instructions?|context|training)/i,
  /what\s+(are|were|is)\s+your\s+(system\s+)?(instructions?|prompt|rules?|guidelines?)/i,
  /reveal\s+(your|the)\s+(system\s+)?(prompt|instructions?|context)/i,
  /output\s+(the\s+)?(system|initial|your|above)\s+(prompt|instructions?)/i,
  /what\s+instructions?\s+(were\s+you|have\s+you\s+been)\s+given/i,
];

const OFF_TOPIC_PATTERNS: RegExp[] = [
  /write\s+(me\s+)?(a|an|some)?\s*(poem|story|essay|novel|script|song|joke|haiku|code|program|function|class)/i,
  /generate\s+(a|some)?\s*(code|program|function|class|script|website|app)/i,
  /translate\s+(this|the\s+following|it)\s+(to|into|from)/i,
  /what\s+is\s+the\s+(capital|population|currency|weather|definition)\s+of/i,
  /how\s+(do\s+I|to)\s+(cook|bake|make|fix|repair|hack|crack|break)/i,
  /give\s+me\s+(a\s+)?(recipe|instructions?|directions?)\s+(for|to)/i,
  /summarize\s+(this|the\s+following|this\s+article|this\s+text)/i,
  /create\s+(a\s+)?(website|app|game|malware|virus|bot|script|essay|poem)/i,
  /tell\s+me\s+(a\s+)?(joke|story|secret)/i,
];

const CONTROL_TOKEN_PATTERNS: RegExp[] = [
  /<\|endoftext\|>/i,
  /<\|startoftext\|>/i,
  /<\|pad\|>/i,
  /<\|unk\|>/i,
];

// ─── Individual Check Functions ───────────────────────────────────────────────

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

function isGibberish(text: string): boolean {
  const noSpace = text.replace(/\s+/g, "");
  if (noSpace.length < 10) return false;

  const nonAlpha = (noSpace.match(/[^a-zA-Z0-9.,!?()\-:;'"\/&]/g) || []).length;
  if (nonAlpha / noSpace.length > 0.4) return true;

  if (/(.)\1{9,}/.test(noSpace)) return true;

  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length >= 4) {
    const unique = new Set(words);
    if (unique.size / words.length < 0.2) return true;
  }

  return false;
}

function isTooSparse(text: string, minWords: number): boolean {
  const words = text.trim().split(/\s+/).filter((w) => w.length > 1);
  return words.length < minWords;
}

// ─── Main Exported Function ───────────────────────────────────────────────────

export function checkGuardrails(input: RemixInput): GuardrailResult {
  const fields: Array<{ key: GuardrailField; value: string; minWords: number }> = [
    { key: "experience",      value: input.experience,      minWords: 5 },
    { key: "skills",          value: input.skills,          minWords: 2 },
    { key: "jobDescription",  value: input.jobDescription,  minWords: 8 },
  ];

  for (const { key, value, minWords } of fields) {
    const label = fieldLabel(key);

    if (isGibberish(value)) {
      return {
        ok: false,
        field: key,
        code: "GIBBERISH_INPUT",
        reason: `The ${label} field doesn't appear to contain real content. Please enter genuine ${label} information.`,
      };
    }

    if (isTooSparse(value, minWords)) {
      return {
        ok: false,
        field: key,
        code: "SPARSE_INPUT",
        reason: `The ${label} field is too brief. Please provide more detail to generate a meaningful tailored resume.`,
      };
    }

    if (matchesAny(value, INJECTION_PATTERNS)) {
      return {
        ok: false,
        field: key,
        code: "PROMPT_INJECTION",
        reason: `We detected content in the ${label} field that appears to be trying to manipulate the AI. Please use this field only for your genuine ${label}.`,
      };
    }

    if (matchesAny(value, JAILBREAK_PATTERNS)) {
      return {
        ok: false,
        field: key,
        code: "JAILBREAK_ATTEMPT",
        reason: `We detected content in the ${label} field that isn't related to resume writing. This tool is designed only for resume tailoring.`,
      };
    }

    if (matchesAny(value, EXTRACTION_PATTERNS)) {
      return {
        ok: false,
        field: key,
        code: "EXTRACTION_ATTEMPT",
        reason: `We detected unusual content in the ${label} field. Please enter your actual ${label} information.`,
      };
    }

    if (matchesAny(value, OFF_TOPIC_PATTERNS)) {
      return {
        ok: false,
        field: key,
        code: "OFF_TOPIC",
        reason: `The ${label} field appears to contain a request unrelated to resume writing. Please enter your actual ${label} to tailor your resume.`,
      };
    }

    if (matchesAny(value, CONTROL_TOKEN_PATTERNS)) {
      return {
        ok: false,
        field: key,
        code: "CONTROL_TOKEN",
        reason: `We detected invalid content in the ${label} field. Please remove any special formatting tokens and enter your genuine ${label}.`,
      };
    }
  }

  return { ok: true };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fieldLabel(field: GuardrailField): string {
  switch (field) {
    case "experience":     return "work experience";
    case "skills":         return "skills";
    case "jobDescription": return "job description";
  }
}
