---
name: Resume Remxi Development
description: Guidelines and instructions for developing the Resume Remxi Next.js application, including AI provider configurations, authentication, and directory structure.
---

# Resume Remxi Development Guidelines

## Project Overview
Resume Remxi is a Next.js (App Router) SaaS application that allows users to input their real experience, skills, and target job description to generate an AI-tailored resume.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS / PostCSS
- **Database / ORM:** PostgreSQL / Drizzle ORM
- **Authentication:** NextAuth
- **AI SDKs:** Google Generative AI (`@google/generative-ai`), OpenAI (`openai`), Anthropic (`@anthropic-ai/sdk`)
- **Payments:** LemonSqueezy (`@lemonsqueezy/lemonsqueezy.js`)

## Core Architecture Rules

### 1. Security & Environment Variables
- **NEVER** expose AI API keys to the browser.
- All secrets MUST live in `.env` or `.env.local` and be accessed ONLY in server-side routes (e.g., `src/app/api/`).

### 2. AI Provider Factory
- The application uses a single entry point for AI calls (e.g., `src/config/aiProviders.ts`).
- Providers are selected at runtime using the `AI_PROVIDER` environment variable (`gemini`, `openai`, `anthropic`).

### 3. Prompt Engineering
- The prompt logic is separated into a builder (e.g., `src/utils/promptBuilder.ts`).
- Output MUST be requested as structured JSON to facilitate frontend parsing and validation.

### 4. API Routes & Validation
- API routes (e.g., `src/app/api/remix/route.ts`) are the ONLY places that invoke the AI models.
- ALL incoming requests MUST be validated using `zod` schemas.

### 5. Authentication & Protected Routes
- NextAuth handles authentication.
- Dashboard and workspace routes are guarded by NextAuth middleware or API checks.
- Database operations for users and subscriptions leverage Drizzle ORM (migrated from Prisma).

### 6. Subscriptions (LemonSqueezy)
- The app handles subscription events via webhooks from LemonSqueezy.
- Users with successful subscriptions should receive a "Pro" badge.

## Development Workflow
- When adding new AI features, update the provider logic and the `zod` schemas.
- When creating UI components, ensure they reside in `src/components/` and are cleanly separated by domain (e.g., auth, dashboard, shared).
- Use `npm run lint` or `eslint` to maintain code standards.
- For database updates, use Drizzle-kit commands like `npm run db:push` or `npm run db:studio`.
