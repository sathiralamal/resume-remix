import { RemixInput } from "../types";

export function buildPrompt({ experience, skills, jobDescription }: RemixInput): string {
  return `You are an expert resume writer and career coach.

A candidate wants to tailor their resume for a specific job opening.

--- CANDIDATE'S ACTUAL EXPERIENCE ---
${experience}

--- CANDIDATE'S ACTUAL SKILLS ---
${skills}

--- TARGET JOB DESCRIPTION ---
${jobDescription}

--- YOUR TASK ---
1. Rewrite the candidate's experience bullet points so they directly mirror
   the language, keywords, and priorities found in the job description.
2. Reorder and reword the skills section to place the most relevant skills first.
3. Keep every claim truthful and grounded in the candidate's real experience —
   do NOT invent roles, companies, or achievements.
4. Use strong action verbs and quantifiable language where possible.
5. Return ONLY valid JSON in this exact shape — no markdown fences, no extra text:

{
  "remixedExperience": "<rewritten experience as a single string with \\n for line breaks>",
  "remixedSkills":     "<rewritten skills list as a single string with \\n for line breaks>",
  "tips":              "<2-3 short, actionable tips for this specific application>"
}`;
}
