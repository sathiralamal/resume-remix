import { NextResponse } from "next/server";
import { z }           from "zod";
import { getServerSession } from "next-auth";
import { callAI }      from "@/config/aiProviders";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/firestore-helpers";
import { FieldValue } from "firebase-admin/firestore";

const schema = z.object({
  experience:     z.string().min(10, "Experience too short"),
  skills:         z.string().min(3,  "Add at least one skill"),
  jobDescription: z.string().min(20, "Job description too short"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body   = await req.json();
    const parsed = schema.parse(body);

    // Limit Check
    const user = await findUserByEmail(session.user.email);
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const limit = parseInt(process.env.FREE_REMIX_LIMIT || "2", 10);
    if (!user.isSubscribed && user.remixCount >= limit) {
      return NextResponse.json({ 
        success: false, 
        error: "LIMIT_REACHED", 
        limit 
      }, { status: 403 });
    }

    const raw    = await callAI(parsed);
    
    // Increment Count using Firestore FieldValue.increment
    await db.collection("users").doc(user.id).update({
      remixCount: FieldValue.increment(1),
      updatedAt: new Date(),
    });

    // Strip markdown code-fences if the model adds them
    const clean  = raw.replace(/```json|```/g, "").trim();
    let result;
    try {
       result = JSON.parse(clean);
    } catch (jsonError) {
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
