import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

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

export interface SubscriptionStatus {
  isSubscribed: boolean;
  subscriptionStatus: string | null;
  subscriptionPlan: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  remixCount: number;
  freeLimit: number;
  remainingFreeRemixes: number | null;
}
