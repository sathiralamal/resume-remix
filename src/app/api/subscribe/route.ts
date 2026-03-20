import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/firestore-helpers";
import { createCheckoutSession } from "@/lib/lemonsqueezy";

/**
 * POST /api/subscribe
 * Creates a LemonSqueezy checkout session and returns the checkout URL.
 * The user is redirected to this URL to complete payment.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log("Calling /api/subscribe");
      console.log(session);

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Calling findUserByEmail");
    const user = await findUserByEmail(session.user.email);
    console.log(user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If already subscribed, don't create a new checkout
    if (user.isSubscribed) {
      return NextResponse.json(
        { error: "Already subscribed", isSubscribed: true },
        { status: 400 },
      );
    }

    const checkout = await createCheckoutSession({
      userId: user.id,
      userEmail: user.email,
      userName: user.name || undefined,
    });

    console.log("generate checkout url");
    const checkoutUrl = checkout.data?.data?.attributes?.url;

    if (!checkoutUrl) {
      console.error("Checkout creation failed:", checkout);
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 },
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error: any) {
    console.error("Subscribe error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
