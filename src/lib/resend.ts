import { Resend } from "resend";

type SupportNotifyParams = {
  name: string;
  email: string;
  message: string;
  receivedAtIso: string;
};

/** メール送信に失敗しても呼び出し元の処理は継続する */
export async function sendSupportMessageNotification(
  params: SupportNotifyParams
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.RESEND_NOTIFY_TO?.trim();
  if (!apiKey || !from || !to) {
    return;
  }

  const body = [
    "応援メッセージが届きました。",
    "",
    `名前: ${params.name}`,
    `メール: ${params.email || "（未入力）"}`,
    `受信日時: ${params.receivedAtIso}`,
    "",
    "--- メッセージ ---",
    params.message,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: [to],
      subject: "【kiyose-ground-problem.com】応援メッセージが届きました",
      text: body,
    });
  } catch {
    // Firestore 保存は完了させる
  }
}
