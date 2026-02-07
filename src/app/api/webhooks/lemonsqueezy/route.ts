import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature");
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret || !signature) {
      return NextResponse.json({ error: "Missing secret or signature" }, { status: 400 });
    }

    // Verify Signature
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const body = payload.data;

    // We assume the custom_data or email is passed to link to user.
    // Ideally pass user ID in custom data during checkout.
    // For now, let's try to match by email if available in attributes.
    const email = body.attributes.user_email; 
    
    // Better: Use custom data "userId" if we passed it in checkout.
    // But since we didn't implement checkout creation with custom info, 
    // let's rely on email for this simple flow.
    
    if (!email) {
       console.error("No email found in webhook payload");
       return NextResponse.json({ received: true });
    }
    
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
        console.error(`User not found for email: ${email}`);
        return NextResponse.json({ received: true }); // Acknowledge anyway
    }

    switch (eventName) {
      case "subscription_created":
      case "subscription_updated":
      case "subscription_resumed":
        if (body.attributes.status === "active") {
          await db.user.update({
            where: { email },
            data: { 
              isSubscribed: true,
              lemonSqueezyCustomerId: body.attributes.customer_id.toString(),
              subscriptionId: body.id.toString()
            },
          });
        }
        break;

      case "subscription_cancelled":
      case "subscription_expired":
        await db.user.update({
          where: { email },
          data: { isSubscribed: false },
        });
        break;
        
       case "order_created": 
         // If one-time payment logic needed
         break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
