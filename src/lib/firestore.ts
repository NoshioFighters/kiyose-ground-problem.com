import {
  getApps,
  initializeApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import type { Tweet } from "./twitter";

let adminApp: App | null = null;

function getAdminApp(): App | null {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  privateKey = privateKey.replace(/\\n/g, "\n");
  if (!getApps().length) {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    adminApp = getApps()[0]!;
  }
  return adminApp;
}

export function getAdminDb() {
  const app = getAdminApp();
  if (!app) return null;
  return getFirestore(app);
}

const CACHE_DOC = "cache/tweets";

export type TweetCachePayload = {
  tweets: Tweet[];
  updatedAt: Timestamp;
};

export async function getTweetCache(): Promise<TweetCachePayload | null> {
  const db = getAdminDb();
  if (!db) return null;
  const snap = await db.doc(CACHE_DOC).get();
  if (!snap.exists) return null;
  const data = snap.data();
  if (!data?.tweets || !data?.updatedAt) return null;
  return {
    tweets: data.tweets as Tweet[],
    updatedAt: data.updatedAt as Timestamp,
  };
}

export function isCacheFresh(updatedAt: Timestamp, maxAgeMs: number): boolean {
  const ms = updatedAt.toMillis();
  return Date.now() - ms < maxAgeMs;
}

export async function saveTweetCache(tweets: Tweet[]): Promise<void> {
  const db = getAdminDb();
  if (!db) return;
  await db.doc(CACHE_DOC).set({
    tweets,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function saveContact(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore is not configured");
  await db.collection("contacts").add({
    name: input.name,
    email: input.email,
    message: input.message,
    createdAt: FieldValue.serverTimestamp(),
  });
}

export type ContactRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp | null;
};

export async function listContacts(limitCount: number): Promise<ContactRow[]> {
  const db = getAdminDb();
  if (!db) return [];
  const snap = await db
    .collection("contacts")
    .orderBy("createdAt", "desc")
    .limit(limitCount)
    .get();
  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      name: typeof d.name === "string" ? d.name : "",
      email: typeof d.email === "string" ? d.email : "",
      message: typeof d.message === "string" ? d.message : "",
      createdAt: (d.createdAt as Timestamp | undefined) ?? null,
    };
  });
}

export type SupportMessageRow = {
  id: string;
  message: string;
  name: string;
  email: string;
  showOnLP: boolean;
  createdAt: Timestamp | null;
};

export async function saveSupportMessage(input: {
  message: string;
  name: string;
  email: string;
}): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore is not configured");
  await db.collection("support_messages").add({
    message: input.message,
    name: input.name,
    email: input.email,
    showOnLP: false,
    createdAt: FieldValue.serverTimestamp(),
  });
}

/** LP 表示承認済みのみ（createdAt 降順・最大 limitCount 件） */
export async function listApprovedSupportMessages(
  limitCount: number
): Promise<SupportMessageRow[]> {
  const db = getAdminDb();
  if (!db) return [];
  const snap = await db
    .collection("support_messages")
    .where("showOnLP", "==", true)
    .orderBy("createdAt", "desc")
    .limit(limitCount)
    .get();
  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      message: typeof d.message === "string" ? d.message : "",
      name: typeof d.name === "string" ? d.name : "",
      email: typeof d.email === "string" ? d.email : "",
      showOnLP: d.showOnLP === true,
      createdAt: (d.createdAt as Timestamp | undefined) ?? null,
    };
  });
}

export async function listAllSupportMessages(
  limitCount: number
): Promise<SupportMessageRow[]> {
  const db = getAdminDb();
  if (!db) return [];
  const snap = await db
    .collection("support_messages")
    .orderBy("createdAt", "desc")
    .limit(limitCount)
    .get();
  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      message: typeof d.message === "string" ? d.message : "",
      name: typeof d.name === "string" ? d.name : "",
      email: typeof d.email === "string" ? d.email : "",
      showOnLP: d.showOnLP === true,
      createdAt: (d.createdAt as Timestamp | undefined) ?? null,
    };
  });
}

export async function updateSupportMessageShowOnLP(
  id: string,
  showOnLP: boolean
): Promise<boolean> {
  const db = getAdminDb();
  if (!db) return false;
  const ref = db.collection("support_messages").doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.update({ showOnLP });
  return true;
}
