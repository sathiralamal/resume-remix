/**
 * OpenRouter provider configuration.
 *
 * For model options and details, refer to https://openrouter.ai/models
 * Examples:
 * - "openai/gpt-4o-mini"
 * - "openai/gpt-4o"
 * - "deepseek/deepseek-chat"
 * - "anthropic/claude-3.5-sonnet"
 * - "~openai/gpt-latest"
 */
export const openRouterConfig = {
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
  siteUrl: process.env.OPENROUTER_SITE_URL || process.env.NEXTAUTH_URL || "",
  appTitle: process.env.OPENROUTER_APP_TITLE || "Resume Remix",
} as const;
