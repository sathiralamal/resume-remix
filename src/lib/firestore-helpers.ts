import { db } from "@/lib/db";

export interface UserDoc {
  id: string;
  email: string;
  password: string;
  name: string | null;
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
