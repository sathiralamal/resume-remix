import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI                  from "openai";
import Anthropic               from "@anthropic-ai/sdk";
import { buildPrompt } from "../utils/promptBuilder";

export type AIProvider = "gemini" | "openai" | "anthropic";

interface RemixInput {
  experience: string;
  skills:     string;
  jobDescription: string;
}

/**
 * Universal interface — every provider returns the same shape.
 */
export async function callAI(input: RemixInput): Promise<string> {
  const provider: AIProvider =
    (process.env.AI_PROVIDER as AIProvider) ?? "gemini";

  const prompt = buildPrompt(input);          // see promptBuilder.ts

  switch (provider) {
    case "gemini":    return callGemini(prompt);
    case "openai":    return callOpenAI(prompt);
    case "anthropic": return callAnthropic(prompt);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

/* ──── Gemini ──── */
async function callGemini(prompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL ?? "gemini-1.5-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text() ?? "";
}

/* ──── OpenAI ──── */
async function callOpenAI(prompt: string): Promise<string> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const res = await client.chat.completions.create({
    model:    "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });
  return res.choices[0]?.message?.content ?? "";
}

/* ──── Anthropic ──── */
async function callAnthropic(prompt: string): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const res = await client.messages.create({
    model:      "claude-3-5-sonnet-20240620", // Updated model name as per recent Anthropic changes or stick to prompt's recommendation
    max_tokens: 2048,
    messages:   [{ role: "user", content: prompt }],
  });
  const block = res.content[0];
  return block.type === "text" ? block.text : "";
}
