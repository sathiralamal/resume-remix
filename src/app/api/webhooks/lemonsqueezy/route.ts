import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { findUserByEmail, findUserById } from "@/lib/firestore-helpers";

/**
 * POST /api/webhooks/lemonsqueezy
 * Handles LemonSqueezy webhook events for subscription lifecycle.
 *
 * Events handled:
 * - subscription_created / subscription_updated / subscription_resumed
 * - subscription_cancelled
 * - subscription_expired / subscription_paused
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature");
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret || !signature) {
      console.error("Webhook: Missing secret or signature");
      return NextResponse.json(
        { error: "Missing secret or signature" },
        { status: 400 }
      );
    }

    // Verify HMAC-SHA256 signature
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    if (
      digest.length !== signatureBuffer.length ||
      !crypto.timingSafeEqual(digest, signatureBuffer)
    ) {
      console.error("Webhook: Invalid signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const eventName: string = payload.meta.event_name;
    const body = payload.data;
    const attributes = body.attributes;

    console.log(`[LemonSqueezy Webhook] Event: ${eventName}`);

    // --- Resolve user ---
    // Prefer custom_data.user_id (set during checkout), fall back to email
    const customData = payload.meta.custom_data || attributes.custom_data;
    const userId = customData?.user_id;
    const email = attributes.user_email;

    let user = null;

    if (userId) {
      user = await findUserById(userId);
    }

    if (!user && email) {
      user = await findUserByEmail(email);
    }

    if (!user) {
      console.error(
        `Webhook: User not found. userId=${userId}, email=${email}`
      );
      // Still acknowledge to avoid retries
      return NextResponse.json({ received: true });
    }

    // --- Handle events ---
    const subscriptionId = body.id?.toString();
    const customerId = attributes.customer_id?.toString();
    const status: string = attributes.status; // "active", "cancelled", "expired", "paused", etc.
    const renewsAt = attributes.renews_at
      ? new Date(attributes.renews_at)
      : null;
    const endsAt = attributes.ends_at ? new Date(attributes.ends_at) : null;

    const userRef = db.collection("users").doc(user.id);

    switch (eventName) {
      case "subscription_created":
      case "subscription_updated":
      case "subscription_resumed": {
        const isActive = status === "active";

        await userRef.update({
          isSubscribed: isActive,
          subscriptionStatus: status,
          subscriptionPlan: "pro",
          lemonSqueezyCustomerId: customerId,
          subscriptionId: subscriptionId,
          currentPeriodEnd: renewsAt || endsAt,
          cancelAtPeriodEnd: false,
          updatedAt: new Date(),
        });

        console.log(
          `[Webhook] ${eventName}: user=${user.id}, status=${status}, isActive=${isActive}`
        );
        break;
      }

      case "subscription_cancelled": {
        // Cancelled = still active until period end
        await userRef.update({
          subscriptionStatus: "cancelled",
          cancelAtPeriodEnd: true,
          // Keep isSubscribed true until period actually ends
          isSubscribed: true,
          currentPeriodEnd: endsAt || renewsAt,
          updatedAt: new Date(),
        });

        console.log(
          `[Webhook] subscription_cancelled: user=${user.id}, endsAt=${endsAt}`
        );
        break;
      }

      case "subscription_expired":
      case "subscription_paused": {
        await userRef.update({
          isSubscribed: false,
          subscriptionStatus: status,
          cancelAtPeriodEnd: false,
          updatedAt: new Date(),
        });

        console.log(
          `[Webhook] ${eventName}: user=${user.id}, access revoked`
        );
        break;
      }

      case "order_created": {
        // Log for one-time payments if needed in the future
        console.log(`[Webhook] order_created: user=${user.id}`);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error.message);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
