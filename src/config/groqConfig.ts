/**
 * Groq provider configuration.
 * Model limits reference (from Groq console):
 *
 * | Model                                    | Context Window | Max Completion |
 * |------------------------------------------|----------------|----------------|
 * | meta-llama/llama-prompt-guard-2-22m      |            512 |            512 |
 * | meta-llama/llama-prompt-guard-2-86m      |            512 |            512 |
 * | meta-llama/llama-4-scout-17b-16e-instruct|        131,072 |          8,192 |
 * | moonshotai/kimi-k2-instruct-0905         |        262,144 |         16,384 |
 * | openai/gpt-oss-safeguard-20b             |        131,072 |         65,536 |
 * | qwen/qwen3-32b                           |        131,072 |         40,960 |
 *
 * To switch models, update GROQ_MODEL and GROQ_MAX_COMPLETION_TOKENS in .env
 * to match the target model's limits from the table above.
 */
/**
 * Strips control characters that cause JSON parse errors when the Groq SDK
 * serialises the message payload. Keeps normal whitespace (\n \r \t) intact.
 */
export function sanitizeForGroq(text: string): string {
  // Remove C0 control chars (0x00–0x1F) except tab, newline, carriage-return
  // and the lone C1/DEL character (0x7F).
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ").trim();
}

export const groqConfig = {
  apiKey: process.env.GROQ_API_KEY ?? "",
  model: process.env.GROQ_MODEL ?? "llama-4-scout-17b-16e-instruct",

  // Generation parameters
  maxCompletionTokens: parseInt(process.env.GROQ_MAX_COMPLETION_TOKENS ?? "8192"),
  temperature: parseFloat(process.env.GROQ_TEMPERATURE ?? "1"),
  topP: parseFloat(process.env.GROQ_TOP_P ?? "1"),
} as const;
