import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理画面",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full min-w-0 bg-slate-100 text-slate-900 antialiased">
      {children}
    </div>
  );
}
