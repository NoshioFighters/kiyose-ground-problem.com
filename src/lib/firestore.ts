import {
  getApps,
  initializeApp,
  cert,
  type App,
} from "firebase-admin/app";
import {
  getFirestore,
  FieldValue,
  Timestamp,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import type { Tweet } from "./twitter";

let adminInitFailed = false;

function getAdminApp(): App | null {
  if (adminInitFailed) {
    return null;
  }
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

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

  try {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch {
    adminInitFailed = true;
    return null;
  }
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
  try {
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
  } catch {
    return [];
  }
}

export type SupportMessageRow = {
  id: string;
  message: string;
  name: string;
  email: string;
  showOnLP: boolean;
  createdAt: Timestamp | null;
  /** X（@kiyoseground 等）へ API 投稿した日時 */
  postedToXAt: Timestamp | null;
  xTweetId: string | null;
};

/** 管理画面や手動編集で型がずれても LP 反映判定に使う */
function readShowOnLP(raw: unknown): boolean {
  return raw === true || raw === "true" || raw === 1;
}

function readPostedToXAt(raw: unknown): Timestamp | null {
  if (
    raw != null &&
    typeof raw === "object" &&
    "toMillis" in raw &&
    typeof (raw as Timestamp).toMillis === "function"
  ) {
    return raw as Timestamp;
  }
  return null;
}

function mapSupportMessageDoc(
  doc: QueryDocumentSnapshot | DocumentSnapshot
): SupportMessageRow {
  const d = doc.data();
  if (!d) {
    throw new Error("empty document");
  }
  return {
    id: doc.id,
    message: typeof d.message === "string" ? d.message : "",
    name: typeof d.name === "string" ? d.name : "",
    email: typeof d.email === "string" ? d.email : "",
    showOnLP: readShowOnLP(d.showOnLP),
    createdAt: (d.createdAt as Timestamp | undefined) ?? null,
    postedToXAt: readPostedToXAt(d.postedToXAt),
    xTweetId: typeof d.xTweetId === "string" ? d.xTweetId : null,
  };
}

function mapSupportMessageDocSafe(
  doc: QueryDocumentSnapshot | DocumentSnapshot
): SupportMessageRow | null {
  try {
    if (!doc.exists) return null;
    return mapSupportMessageDoc(doc);
  } catch {
    return null;
  }
}

export async function getSupportMessageById(
  id: string
): Promise<SupportMessageRow | null> {
  const db = getAdminDb();
  if (!db) return null;
  const snap = await db.collection("support_messages").doc(id).get();
  return mapSupportMessageDocSafe(snap);
}

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

function sortSupportRowsByCreatedAtDesc(rows: SupportMessageRow[]): void {
  rows.sort((a, b) => {
    const ma =
      a.createdAt && typeof a.createdAt.toMillis === "function"
        ? a.createdAt.toMillis()
        : 0;
    const mb =
      b.createdAt && typeof b.createdAt.toMillis === "function"
        ? b.createdAt.toMillis()
        : 0;
    return mb - ma;
  });
}

/**
 * LP 表示承認済みのみ（createdAt 降順・最大 limitCount 件）。
 *
 * 管理画面のチェックは `readShowOnLP` で boolean / 文字列 "true" などを表示扱いにしているが、
 * Firestore の `where("showOnLP","==", true)` は**真偽値のみ**一致する。
 * コンソール編集や他クライアントで文字列が入ると管理では「表示中」でも LP クエリに出ないため、
 * 真偽 true と文字列 "true" の両方を取得してマージする。
 *
 * `orderBy("createdAt")` 付きクエリは createdAt 欠落ドキュメントを落とすため、
 * 最終的な並びは常にメモリソートに統一する。
 */
/** `support_messages` コレクションのドキュメント総数（LP 表示フラグに関係なく全件） */
export async function countSupportMessagesTotal(): Promise<number> {
  const db = getAdminDb();
  if (!db) return 0;
  try {
    const snap = await db.collection("support_messages").count().get();
    const n = snap.data().count;
    return typeof n === "number" && Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export async function listApprovedSupportMessages(
  limitCount: number
): Promise<SupportMessageRow[]> {
  const db = getAdminDb();
  if (!db) return [];
  const col = db.collection("support_messages");
  const byId = new Map<string, SupportMessageRow>();

  async function mergeQuery(
    value: boolean | string
  ): Promise<void> {
    try {
      const snap = await col.where("showOnLP", "==", value).get();
      for (const doc of snap.docs) {
        const row = mapSupportMessageDocSafe(doc);
        if (row?.showOnLP) {
          byId.set(doc.id, row);
        }
      }
    } catch {
      /* フィールド型がクエリと合わない場合など */
    }
  }

  await mergeQuery(true);
  await mergeQuery("true");

  const rows = Array.from(byId.values());
  sortSupportRowsByCreatedAtDesc(rows);
  return rows.slice(0, limitCount);
}

export async function listAllSupportMessages(
  limitCount: number
): Promise<SupportMessageRow[]> {
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snap = await db
      .collection("support_messages")
      .orderBy("createdAt", "desc")
      .limit(limitCount)
      .get();
    return snap.docs
      .map(mapSupportMessageDocSafe)
      .filter((r): r is SupportMessageRow => r !== null);
  } catch {
    return [];
  }
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

export async function markSupportMessagePostedToX(
  id: string,
  tweetId: string
): Promise<boolean> {
  const db = getAdminDb();
  if (!db) return false;
  const ref = db.collection("support_messages").doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.update({
    postedToXAt: FieldValue.serverTimestamp(),
    xTweetId: tweetId,
  });
  return true;
}
