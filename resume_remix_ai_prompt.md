# Resume Remxi — Master AI Prompt & Implementation Guide

---

## 📋 Project Overview

**Project Name:** Resume Remxi  
**Framework:** Next.js 14+ (App Router)  
**Purpose:** A SaaS-style application that lets users input their real experience & skills, paste a target job description, and click **Remix** to have an AI model rewrite and tailor their resume content to match that role.  
**AI Providers (Configurable):** Google Gemini | OpenAI GPT | Anthropic Claude  

---

## 🏗️ Architecture & Tech Stack

```
resume-remxi/
├── .env.local                      # All secrets (API keys) live here ONLY
├── next.config.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, globals, AuthProvider)
│   │   ├── page.tsx                # Public landing / redirect to login
│   │   ├── login/
│   │   │   └── page.tsx            # Login page
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Protected dashboard (main workspace)
│   │   └── api/
│   │       └── remix/
│   │           └── route.ts        # Server-side POST — calls AI, keeps keys safe
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx       # Email/password or OAuth login card
│   │   │   └── AuthGuard.tsx       # HOC / middleware that blocks unauthed access
│   │   ├── dashboard/
│   │   │   ├── ExperienceForm.tsx  # Textarea: user's real experience
│   │   │   ├── SkillsForm.tsx      # Textarea / tag input: user's real skills
│   │   │   ├── JobDescriptionForm.tsx  # Textarea: paste target JD here
│   │   │   ├── RemixButton.tsx     # The magic trigger button
│   │   │   └── RemixResult.tsx     # Displays AI-generated output
│   │   └── shared/
│   │       ├── Loader.tsx          # Reusable spinner / skeleton
│   │       └── Toast.tsx           # Success / error feedback
│   ├── config/
│   │   └── aiProviders.ts          # Factory that picks Gemini | OpenAI | Claude
│   ├── hooks/
│   │   └── useRemix.ts             # Encapsulates the API call + state logic
│   ├── types/
│   │   └── index.ts                # All shared TypeScript interfaces
│   └── utils/
│       └── promptBuilder.ts        # Assembles the prompt string sent to AI
└── package.json
```

### Dependencies to Install

```bash
npm install next@latest react@latest react-dom@latest typescript
npm install @nextauth/next-auth@latest   # or next-auth v5 beta (App-Router native)
npm install @google/generative-ai        # Gemini SDK
npm install openai                       # OpenAI SDK
npm install @anthropic-ai/sdk            # Anthropic SDK (optional third provider)
npm install axios                        # or use native fetch
npm install zod                          # Runtime validation on API routes
npm install lucide-react                 # Icons
npm install tailwindcss @tailwindcss/vite # Styling (or use CSS Modules)
```

---

## 🔐 Rule 1 — Security & Environment Variables

**Every** AI API key must live in `.env.local` and be consumed only inside `src/app/api/` (server-side routes). The browser must never see a key.

```env
# .env.local
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000

# AI provider keys — only ONE needs to be set, or set all for runtime switching
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
ANTHROPIC_API_KEY=sk-ant-...

# Which provider is active by default
AI_PROVIDER=gemini          # "gemini" | "openai" | "anthropic"
```

---

## 🧩 Rule 2 — AI Provider Factory (Configurable Core)

Create a single entry-point that reads `AI_PROVIDER` and delegates to the correct SDK. This keeps the rest of the app completely decoupled from whichever model is active.

```typescript
// src/config/aiProviders.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI                  from "openai";
import Anthropic               from "@anthropic-ai/sdk";

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
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const { text } = await (await model.generateContent(prompt)).response;
  return text ?? "";
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
    model:      "claude-sonnet-4-5-20250929",
    max_tokens: 2048,
    messages:   [{ role: "user", content: prompt }],
  });
  const block = res.content[0];
  return block.type === "text" ? block.text : "";
}
```

---

## ✍️ Rule 3 — Prompt Engineering (The Heart of Remix)

A well-structured prompt is what makes the output actually useful. Separate the prompt logic from everything else so it can be tuned independently.

```typescript
// src/utils/promptBuilder.ts
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
```

> **Why structured JSON output?** It lets the frontend parse and display each section independently, and makes validation trivial.

---

## 🛡️ Rule 4 — Server-Side API Route (Validation + Call)

The API route is the *only* place that touches AI. It validates input with Zod, calls the provider, and returns parsed JSON.

```typescript
// src/app/api/remix/route.ts
import { NextResponse } from "next/server";
import { z }           from "zod";
import { callAI }      from "@/config/aiProviders";

const schema = z.object({
  experience:     z.string().min(10, "Experience too short"),
  skills:         z.string().min(3,  "Add at least one skill"),
  jobDescription: z.string().min(20, "Job description too short"),
});

export async function POST(req: Request) {
  try {
    const body   = await req.json();
    const parsed = schema.parse(body);          // throws if invalid

    const raw    = await callAI(parsed);        // AI call (server-only)

    // Strip markdown code-fences if the model adds them
    const clean  = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    const status = err.name === "ZodError" ? 400 : 500;
    return NextResponse.json(
      { success: false, error: err.message ?? "Something went wrong" },
      { status }
    );
  }
}
```

---

## 🔄 Rule 5 — Client Hook (Clean State Management)

One custom hook owns the entire remix lifecycle: loading, error, and result state.

```typescript
// src/hooks/useRemix.ts
import { useState, useCallback } from "react";

interface RemixInput {
  experience: string;
  skills:     string;
  jobDescription: string;
}

interface RemixResult {
  remixedExperience: string;
  remixedSkills:     string;
  tips:              string;
}

export function useRemix() {
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [result,   setResult]   = useState<RemixResult | null>(null);

  const remix = useCallback(async (input: RemixInput) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res  = await fetch("/api/remix", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(input),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error);
      setResult(json.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { remix, loading, error, result };
}
```

---

## 🎨 Rule 6 — Dashboard Page (Wiring Everything Together)

```tsx
// src/app/dashboard/page.tsx
"use client";
import { useSession, signOut } from "next-auth/react";
import { redirect }            from "next/navigation";
import { useState }            from "react";
import ExperienceForm          from "@/components/dashboard/ExperienceForm";
import SkillsForm              from "@/components/dashboard/SkillsForm";
import JobDescriptionForm      from "@/components/dashboard/JobDescriptionForm";
import RemixButton             from "@/components/dashboard/RemixButton";
import RemixResult             from "@/components/dashboard/RemixResult";
import Loader                  from "@/components/shared/Loader";
import { useRemix }            from "@/hooks/useRemix";

export default function Dashboard() {
  const { data: session, status } = useSession();
  if (status === "loading") return <Loader />;
  if (!session)             redirect("/login");

  const [experience,     setExperience]     = useState("");
  const [skills,         setSkills]         = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const { remix, loading, error, result } = useRemix();

  const handleRemix = () => {
    remix({ experience, skills, jobDescription });
  };

  return (
    <div className="dashboard-layout">
      <header>
        <h1>Resume Remxi</h1>
        <button onClick={() => signOut({ callbackUrl: "/login" })}>Logout</button>
      </header>

      <main>
        <ExperienceForm     value={experience}     onChange={setExperience} />
        <SkillsForm         value={skills}         onChange={setSkills} />
        <JobDescriptionForm value={jobDescription} onChange={setJobDescription} />

        <RemixButton onClick={handleRemix} disabled={loading} />

        {loading && <Loader message="Remixing your resume…" />}
        {error   && <p className="error">{error}</p>}
        {result  && <RemixResult data={result} />}
      </main>
    </div>
  );
}
```

---

## 🔒 Rule 7 — Auth Setup (next-auth)

### 7a — Auth Config (server-side)

```typescript
// src/app/api/auth/[...nextauth]/route.ts  (Pages Router compat)
// OR use the App Router "NextAuth" approach depending on your next-auth version.

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Replace with real DB lookup (Prisma, Mongoose, etc.)
        if (credentials?.email === "user@example.com" && credentials?.password === "password") {
          return { id: "1", email: "user@example.com", name: "Demo User" };
        }
        return null;
      },
    }),
  ],
  pages: { signIn: "/login" },
});
```

### 7b — Login Page

```tsx
// src/app/login/page.tsx
"use client";
import { signIn }  from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email, password,
      redirect: false,
    });
    if (res?.error) setError("Invalid credentials");
    else             window.location.href = "/dashboard";
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <input type="email"    value={email}    onChange={e => setEmail(e.target.value)}    placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
```

### 7c — Auth Guard (Middleware)

```typescript
// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  matcher: ["/dashboard"],   // only this route is protected
});
```

---

## 📝 Rule 8 — TypeScript Interfaces (Single Source of Truth)

```typescript
// src/types/index.ts

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
```

---

## ✅ Rule 9 — Coding Best Practices Checklist

| # | Practice | Where It Applies |
|---|----------|-----------------|
| 1 | **Never expose API keys to the browser** | `.env.local` + `api/` routes only |
| 2 | **Validate all input** | Zod schema in every API route |
| 3 | **Single Responsibility** | Each component / hook / util does one thing |
| 4 | **Typed everything** | `types/index.ts` — no `any` in production code |
| 5 | **Configurable AI** | Factory pattern in `aiProviders.ts` |
| 6 | **Prompt as data** | `promptBuilder.ts` is easy to tune without touching logic |
| 7 | **Structured AI output** | Request JSON → parse → display. Avoids fragile string parsing |
| 8 | **Graceful errors** | Every async boundary has try/catch + user-facing message |
| 9 | **Auth middleware** | One line in `middleware.ts` protects all dashboard routes |
| 10 | **Clean imports** | Use `@/` path aliases configured in `tsconfig.json` |

---

## 🚀 Rule 10 — Quick-Start Commands

```bash
# 1. Scaffold
npx create-next-app@latest resume-remxi --typescript --tailwind --app-router
cd resume-remxi

# 2. Install dependencies
npm install next-auth @google/generative-ai openai @anthropic-ai/sdk zod lucide-react

# 3. Create .env.local (fill in your keys)
cp .env.example .env.local

# 4. Run
npm run dev   # → http://localhost:3000
```

---

## 🔧 Switching AI Providers at Runtime

Change one line in `.env.local`:

```env
AI_PROVIDER=openai       # switch to OpenAI
AI_PROVIDER=gemini       # switch to Gemini
AI_PROVIDER=anthropic    # switch to Anthropic
```

No code change needed. The factory in `aiProviders.ts` handles the rest.

---

## 📌 Summary — What Each File Is Responsible For

| File | Responsibility |
|------|---------------|
| `.env.local` | Secrets & provider selection |
| `aiProviders.ts` | SDK routing (Gemini / OpenAI / Anthropic) |
| `promptBuilder.ts` | Assembles the AI prompt from user input |
| `api/remix/route.ts` | Validates input, calls AI, returns JSON |
| `useRemix.ts` | Client-side loading / error / result state |
| `dashboard/page.tsx` | Composes all forms + button + result display |
| `middleware.ts` | Protects `/dashboard` from unauthenticated access |
| `types/index.ts` | Shared TypeScript types used across the project |
