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
      // Option 1: Load from a JSON key file path (recommended)
      const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (keyPath) {
        const raw = fs.readFileSync(path.resolve(keyPath), "utf8");
        const serviceAccount = JSON.parse(raw);
        _app = initializeApp({ credential: cert(serviceAccount) });
      } else {
        // Option 2: Load from individual env vars
        _app = initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
            privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
          }),
        });
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
