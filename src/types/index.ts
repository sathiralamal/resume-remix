export interface User {
  id:    string;
  email: string;
  name:  string;
}

export interface RemixInput {
  experience:     string;
  skills:         string;
  jobDescription: string;
}

export interface RemixResult {
  remixedExperience: string;
  remixedSkills:     string;
  tips:              string;
}

export type AIProvider = "gemini" | "openai" | "anthropic";
