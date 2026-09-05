import { db } from "@/lib/db";

export interface UserDoc {
  id: string;
  email: string;
  password?: string;
  name: string | null;
  profileImage?: string | null;
  provider?: string;
  googleId?: string | null;
  status?: string;
  createdAt: Date;
  lastLoginAt?: Date | null;
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
 * Find a user by their stable Google provider ID (sub / googleId).
 * Returns null if no user is found.
 */
export async function findUserByGoogleId(
  googleId: string,
): Promise<UserDoc | null> {
  const snap = await db
    .collection("users")
    .where("googleId", "==", googleId)
    .limit(1)
    .get();

  if (snap.empty) return null;

  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as UserDoc;
}

/**
 * Find a user by their email address.
 * Normalizes email to lowercase and falls back to raw lookup for legacy records.
 * Returns null if no user is found.
 */
export async function findUserByEmail(email: string): Promise<UserDoc | null> {
  const normalized = email.toLowerCase().trim();
  const snap = await db
    .collection("users")
    .where("email", "==", normalized)
    .limit(1)
    .get();

  if (!snap.empty) {
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() } as UserDoc;
  }

  // Fallback check for case-sensitive legacy entries
  if (normalized !== email) {
    const fallbackSnap = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (!fallbackSnap.empty) {
      const doc = fallbackSnap.docs[0];
      return { id: doc.id, ...doc.data() } as UserDoc;
    }
  }

  return null;
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
 * Update the user's last login timestamp.
 */
export async function updateUserLastLogin(id: string): Promise<void> {
  const now = new Date();
  await db.collection("users").doc(id).update({
    lastLoginAt: now,
    updatedAt: now,
  });
}

/**
 * Authenticates or provisions a Google user in Firestore.
 * 1. Checks Firestore using stable Google ID (sub).
 * 2. If not found, checks Firestore by verified email.
 * 3. Validates account status (active).
 * 4. Updates lastLoginAt and identity metadata for existing users.
 * 5. Auto-provisions a new user record if no matching account exists.
 */
export async function findOrCreateGoogleUser({
  email,
  name,
  googleId,
  profileImage,
}: {
  email: string;
  name: string | null;
  googleId: string;
  profileImage?: string | null;
}): Promise<UserDoc> {
  const now = new Date();

  // 1. Look up by stable Google provider ID
  const userByGoogleId = await findUserByGoogleId(googleId);

  if (userByGoogleId) {
    // Validate account status
    if (userByGoogleId.status && userByGoogleId.status !== "active") {
      throw new Error("ACCOUNT_INACTIVE");
    }

    const updates: Record<string, unknown> = {
      lastLoginAt: now,
      updatedAt: now,
    };

    if (profileImage && userByGoogleId.profileImage !== profileImage) {
      updates.profileImage = profileImage;
    }
    if (name && !userByGoogleId.name) {
      updates.name = name;
    }

    await db.collection("users").doc(userByGoogleId.id).update(updates);
    return { ...userByGoogleId, ...updates } as UserDoc;
  }

  // 2. Fall back to look up by verified email
  const userByEmail = await findUserByEmail(email);

  if (userByEmail) {
    // Validate account status
    if (userByEmail.status && userByEmail.status !== "active") {
      throw new Error("ACCOUNT_INACTIVE");
    }

    // Link Google ID to the existing account
    const updates: Record<string, unknown> = {
      googleId,
      lastLoginAt: now,
      updatedAt: now,
    };

    if (!userByEmail.provider) {
      updates.provider = "google";
    }
    if (profileImage && !userByEmail.profileImage) {
      updates.profileImage = profileImage;
    }
    if (name && !userByEmail.name) {
      updates.name = name;
    }

    await db.collection("users").doc(userByEmail.id).update(updates);
    return { ...userByEmail, ...updates } as UserDoc;
  }

  // 3. Auto-provision new user record
  const normalizedEmail = email.toLowerCase().trim();
  const newUserData = {
    name: name ?? null,
    email: normalizedEmail,
    googleId,
    profileImage: profileImage ?? null,
    provider: "google",
    status: "active",
    createdAt: now,
    lastLoginAt: now,
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

  const ref = await db.collection("users").add(newUserData);
  return {
    id: ref.id,
    ...newUserData,
  };
}
