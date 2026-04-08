import { cache } from "react";
import {
  countSupportMessagesTotal,
  listApprovedSupportMessages,
} from "@/lib/firestore";

/** 管理画面の応援メッセージ読み込み件数と揃える */
export const LP_APPROVED_SUPPORT_LIMIT = 200;

/** 同一リクエスト内で SupportMessages と page の判定を共有 */
export const getApprovedSupportMessagesCached = cache(async () => {
  try {
    return await listApprovedSupportMessages(LP_APPROVED_SUPPORT_LIMIT);
  } catch (err) {
    console.error("[getApprovedSupportMessagesCached]", err);
    return [];
  }
});

/** 同一リクエスト内で件数取得を共有（集計クエリ 1 回） */
export const getSupportMessagesTotalCountCached = cache(async () => {
  try {
    return await countSupportMessagesTotal();
  } catch (err) {
    console.error("[getSupportMessagesTotalCountCached]", err);
    return 0;
  }
});
