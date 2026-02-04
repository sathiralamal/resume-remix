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
    let result;
    try {
       result = JSON.parse(clean);
    } catch (jsonError) {
       // if plain text, try to wrap or just return as is in a fallback structure?
       // The prompt says "Return ONLY valid JSON". If it fails, strictly it's an error from AI.
       // But let's be robust
       console.error("JSON parse error", jsonError, clean);
       throw new Error("AI returned invalid JSON");
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    const status = err.name === "ZodError" ? 400 : 500;
    return NextResponse.json(
      { success: false, error: err.message ?? "Something went wrong" },
      { status }
    );
  }
}
