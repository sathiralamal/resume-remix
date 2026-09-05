import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import * as fs from "fs";
import * as path from "path";

let _app: App | undefined;
let _db: Firestore | undefined;

interface ServiceAccountKey {
  project_id: string;
  client_email: string;
  private_key: string;
}

/**
 * Reads and parses a Firebase service account JSON key file.
 * Returns null if the path is not set or the file cannot be read.
 */
function loadKeyFile(keyFilePath: string): ServiceAccountKey | null {
  try {
    const resolved = path.resolve(keyFilePath);
    if (!fs.existsSync(resolved)) {
      console.warn(`[Firebase] Key file not found at: ${resolved}`);
      return null;
    }
    const raw = fs.readFileSync(resolved, "utf8");
    const parsed = JSON.parse(raw) as ServiceAccountKey;

    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      throw new Error(
        "Key file is missing required fields: project_id, client_email, or private_key",
      );
    }

    console.log(
      `[Firebase] Loaded credentials from key file for project: ${parsed.project_id}`,
    );
    return parsed;
  } catch (error) {
    console.error("[Firebase] ❌ Failed to load key file:", error);
    throw error;
  }
}

function getApp(): App {
  if (!_app) {
    if (getApps().length) {
      _app = getApps()[0];
    } else {
      try {
        // Option 1: Load from a JSON key file (FIREBASE_KEY_FILE or GOOGLE_APPLICATION_CREDENTIALS)
        const keyFilePath =
          process.env.FIREBASE_KEY_FILE ||
          process.env.GOOGLE_APPLICATION_CREDENTIALS;

        if (keyFilePath) {
          const key = loadKeyFile(keyFilePath);
          if (key) {
            _app = initializeApp({
              credential: cert({
                projectId: key.project_id,
                clientEmail: key.client_email,
                privateKey: key.private_key,
              }),
            });
            console.log("[Firebase] Successfully initialized from key file.");
            return _app;
          }
        }

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
              "Set FIREBASE_KEY_FILE pointing to your service account JSON, or provide all three env vars.",
          );
        }

        console.log(
          "[Firebase] Initializing with env vars for project:",
          projectId,
        );
        _app = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, "\n"),
          }),
        });
        console.log("[Firebase] Successfully initialized from env vars.");
      } catch (error) {
        console.error(
          "[Firebase] ❌ Failed to initialize Firebase app:",
          error,
        );
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
