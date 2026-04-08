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
