import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { callAI } from "@/config/aiProviders";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/firestore-helpers";
import { checkGuardrails } from "@/lib/aiGuardrails";
import { FieldValue } from "firebase-admin/firestore";

const schema = z.object({
  experience: z.string().min(10, "Experience too short"),
  skills: z.string().min(3, "Add at least one skill"),
  jobDescription: z.string().min(20, "Job description too short"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const parsed = schema.parse(body);

    // ── AI Guardrail Check ───────────────────────────────────────────────────
    const guardrail = checkGuardrails(parsed);
    if (!guardrail.ok) {
      console.warn(
        `[Guardrail] Blocked: code=${guardrail.code} field=${guardrail.field} user=${session.user.email}`
      );
      return NextResponse.json(
        {
          success: false,
          error: guardrail.reason,
          guardrailViolation: true,
          code: guardrail.code,
        },
        { status: 422 },
      );
    }
    // ────────────────────────────────────────────────────────────────────────

    // Limit Check
    const user = await findUserByEmail(session.user.email);
    if (!user)
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );

    const limit = parseInt(process.env.FREE_REMIX_LIMIT || "2", 10);
    if (!user.isSubscribed && user.remixCount >= limit) {
      return NextResponse.json(
        {
          success: false,
          error: "LIMIT_REACHED",
          limit,
        },
        { status: 403 },
      );
    }

    const raw = await callAI(parsed);

    // Increment Count using Firestore FieldValue.increment
    await db
      .collection("users")
      .doc(user.id)
      .update({
        remixCount: FieldValue.increment(1),
        updatedAt: new Date(),
      });

    // Strip markdown code-fences if the model adds them
    const clean = raw
      // remove markdown code fences
      .replace(/```json|```/gi, "")

      // remove BOM if exists
      .replace(/^\uFEFF/, "")

      // fix invalid newlines inside strings
      .replace(/:\s*"([^"]*?)"/gs, (match, content) => {
        const fixed = content
          .replace(/\r?\n/g, "\\n") // convert real line breaks → \n
          .replace(/\t/g, "\\t"); // optional: fix tabs too
          .replace(/\r?\n/g, "\\n")
          .replace(/\t/g, "\\t");
        return `: "${fixed}"`;
      })
      .trim();

      .trim();
    let result;
    let result: Record<string, unknown>;
    try {
      result = JSON.parse(clean);
    } catch (jsonError) {
      console.error("JSON parse error", jsonError, clean);
      throw new Error("AI returned invalid JSON");
    }

    // ── Model-level REFUSED response (second line of defense) ───────────────
    if ("error" in result && result.error === "REFUSED") {
      console.warn(
        `[Guardrail] Model refused: user=${session.user.email} reason=${result.reason}`
      );
      return NextResponse.json(
        {
          success: false,
          error:
            "Your input contains content that isn't suitable for resume tailoring. Please enter genuine work experience, skills, and a real job description.",
          guardrailViolation: true,
          code: "MODEL_REFUSED",
        },
        { status: 422 },
      );
    }
    // ────────────────────────────────────────────────────────────────────────

    // Only increment usage after a successful, non-refused AI response
    await db
      .collection("users")
      .doc(user.id)
      .update({
        remixCount: FieldValue.increment(1),
        updatedAt: new Date(),
      });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    const status = err.name === "ZodError" ? 400 : 500;
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.issues[0]?.message ?? "Validation failed" },
        { status: 400 },
      );
    }
    const message =
      err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json(
      { success: false, error: err.message ?? "Something went wrong" },
      { status },
      { success: false, error: message },
      { status: 500 },
    );
  }
}
