import { db } from "@/lib/db";

export interface UserDoc {
  id: string;
  email: string;
  password?: string;
  name: string | null;
  provider?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
  remixCount: number;
  isSubscribed: boolean;
  lemonSqueezyCustomerId: string | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

/**
 * Find a user by their email address.
 * Returns null if no user is found.
 */
export async function findUserByEmail(email: string): Promise<UserDoc | null> {
  const snap = await db
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (snap.empty) return null;

  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as UserDoc;
}

/**
 * Find a user by their Firestore document ID.
 * Returns null if no user is found.
 */
export async function findUserById(id: string): Promise<UserDoc | null> {
  const doc = await db.collection("users").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as UserDoc;
}

/**
 * Find or create a user from a Google OAuth sign-in.
 * If the email already exists (credentials account), links the Google ID.
 * Otherwise creates a new user document.
 */
export async function findOrCreateGoogleUser({
  email,
  name,
  googleId,
}: {
  email: string;
  name: string | null;
  googleId: string;
}): Promise<UserDoc> {
  const existing = await findUserByEmail(email);

  if (existing) {
    // Link Google ID if not already set
    if (!existing.googleId) {
      await db.collection("users").doc(existing.id).update({
        googleId,
        provider: existing.provider ?? "google",
        updatedAt: new Date(),
      });
    }
    return { ...existing, googleId };
  }

  const now = new Date();
  const ref = await db.collection("users").add({
    name,
    email,
    googleId,
    provider: "google",
    createdAt: now,
    updatedAt: now,
    remixCount: 0,
    isSubscribed: false,
    lemonSqueezyCustomerId: null,
    subscriptionId: null,
    subscriptionStatus: null,
    subscriptionPlan: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  });

  return {
    id: ref.id,
    name,
    email,
    googleId,
    provider: "google",
    createdAt: now,
    updatedAt: now,
    remixCount: 0,
    isSubscribed: false,
    lemonSqueezyCustomerId: null,
    subscriptionId: null,
    subscriptionStatus: null,
    subscriptionPlan: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  };
}
