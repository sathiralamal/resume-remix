import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { findUserByEmail } from "@/lib/firestore-helpers";
import { configureLemonSqueezy } from "@/lib/lemonsqueezy";
import { listSubscriptions } from "@lemonsqueezy/lemonsqueezy.js";

/**
 * POST /api/subscription/verify
 * Checks LemonSqueezy API directly for an active subscription,
 * updates Firestore accordingly, and returns the updated status.
 * Used after checkout redirect instead of relying on webhooks.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Already subscribed — no need to check again
    if (user.isSubscribed) {
      return NextResponse.json({ isSubscribed: true, updated: false });
    }

    // Query LemonSqueezy for subscriptions matching this user's email
    configureLemonSqueezy();

    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    if (!storeId) {
      return NextResponse.json({ error: "Store not configured" }, { status: 500 });
    }

    const response = await listSubscriptions({
      filter: {
        storeId: Number(storeId),
        userEmail: session.user.email,
      },
    });

    const subscriptions = response.data?.data;

    // Find the first active subscription
    const activeSub = subscriptions?.find(
      (sub: any) => sub.attributes.status === "active"
    );

    if (!activeSub) {
      return NextResponse.json({ isSubscribed: false, updated: false });
    }

    // Found an active subscription — update Firestore
    const attributes = activeSub.attributes;
    const renewsAt = attributes.renews_at ? new Date(attributes.renews_at) : null;
    const endsAt = attributes.ends_at ? new Date(attributes.ends_at) : null;

    await db.collection("users").doc(user.id).update({
      isSubscribed: true,
      subscriptionStatus: "active",
      subscriptionPlan: "pro",
      lemonSqueezyCustomerId: attributes.customer_id?.toString() || null,
      subscriptionId: activeSub.id?.toString() || null,
      currentPeriodEnd: renewsAt || endsAt,
      cancelAtPeriodEnd: false,
      updatedAt: new Date(),
    });

    return NextResponse.json({ isSubscribed: true, updated: true });
  } catch (error: any) {
    console.error("Subscription verify error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
