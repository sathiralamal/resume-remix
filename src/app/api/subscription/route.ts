import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/firestore-helpers";

/**
 * GET /api/subscription
 * Returns the current user's subscription status from the database.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await findUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const freeLimit = parseInt(process.env.FREE_REMIX_LIMIT || "2", 10);

    return NextResponse.json({
      isSubscribed: user.isSubscribed,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan || "free",
      currentPeriodEnd: user.currentPeriodEnd,
      cancelAtPeriodEnd: user.cancelAtPeriodEnd,
      remixCount: user.remixCount,
      freeLimit,
      remainingFreeRemixes: user.isSubscribed
        ? null // unlimited
        : Math.max(0, freeLimit - user.remixCount),
    });
  } catch (error: any) {
    console.error("Subscription status error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
