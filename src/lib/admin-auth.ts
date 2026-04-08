import { cookies } from "next/headers";

export function isAdminSession(): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const token = cookies().get("admin_token");
  return Boolean(
    adminPassword && token && token.value === adminPassword
  );
}
