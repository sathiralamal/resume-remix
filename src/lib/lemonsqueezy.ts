import {
  lemonSqueezySetup,
  createCheckout,
  getSubscription,
  cancelSubscription,
  type Checkout,
} from "@lemonsqueezy/lemonsqueezy.js";

/**
 * Initialize the LemonSqueezy SDK with the API key.
 * Must be called before any other LemonSqueezy function.
 */
export function configureLemonSqueezy() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    throw new Error("LEMONSQUEEZY_API_KEY is not set");
  }
  lemonSqueezySetup({ apiKey });
}

/**
 * Create a LemonSqueezy checkout URL for a user.
 */
export async function createCheckoutSession({
  userId,
  userEmail,
  userName,
}: {
  userId: string;
  userEmail: string;
  userName?: string;
}) {
  configureLemonSqueezy();

  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

  if (!storeId || !variantId) {
    throw new Error("LEMONSQUEEZY_STORE_ID or LEMONSQUEEZY_VARIANT_ID is not set");
  }

  // SDK expects numeric IDs, env vars are strings
  const checkout = await createCheckout(Number(storeId), Number(variantId), {
    checkoutData: {
      email: userEmail,
      name: userName || undefined,
      custom: {
        user_id: userId,
      },
    },
    productOptions: {
      redirectUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard?subscribed=true`,
    },
  });

  return checkout;
}

/**
 * Get a subscription by ID from LemonSqueezy.
 */
export async function getLemonSqueezySubscription(subscriptionId: string) {
  configureLemonSqueezy();
  return getSubscription(subscriptionId);
}

/**
 * Cancel a subscription on LemonSqueezy.
 */
export async function cancelLemonSqueezySubscription(subscriptionId: string) {
  configureLemonSqueezy();
  return cancelSubscription(subscriptionId);
}
