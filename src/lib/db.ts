import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import * as fs from "fs";
import * as path from "path";

let _app: App | undefined;
let _db: Firestore | undefined;

function getApp(): App {
  if (!_app) {
    if (getApps().length) {
      _app = getApps()[0];
    } else {
      try {
        // Option 1: Load from a JSON key file path (recommended)
        const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        if (keyPath) {
          console.log("[Firebase] Initializing with key file:", keyPath);
          const raw = fs.readFileSync(path.resolve(keyPath), "utf8");
          const serviceAccount = JSON.parse(raw);
          _app = initializeApp({ credential: cert(serviceAccount) });
          console.log("[Firebase] Successfully initialized from key file.");
        } else {
          // Option 2: Load from individual env vars
          const projectId = process.env.FIREBASE_PROJECT_ID;
          const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
          const privateKey = process.env.FIREBASE_PRIVATE_KEY;

          if (!projectId || !clientEmail || !privateKey) {
            const missing = [
              !projectId && "FIREBASE_PROJECT_ID",
              !clientEmail && "FIREBASE_CLIENT_EMAIL",
              !privateKey && "FIREBASE_PRIVATE_KEY",
            ].filter(Boolean);
            throw new Error(
              `Firebase credentials are not configured. Missing env vars: ${missing.join(", ")}. ` +
              "Set GOOGLE_APPLICATION_CREDENTIALS or provide all three env vars."
            );
          }

          console.log("[Firebase] Initializing with env vars for project:", projectId);
          _app = initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey: privateKey.replace(/\\n/g, "\n"),
            }),
          });
          console.log("[Firebase] Successfully initialized from env vars.");
        }
      } catch (error) {
        console.error("[Firebase] ❌ Failed to initialize Firebase app:", error);
        throw error;
      }
    }
  }
  return _app;
}

/**
 * Lazily initializes and returns the Firestore instance.
 */
export function getDb(): Firestore {
  if (!_db) {
    _db = getFirestore(getApp());
  }
  return _db;
}

/** Convenience alias — use `db` directly for cleaner call sites. */
export const db = new Proxy({} as Firestore, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
