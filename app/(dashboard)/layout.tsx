export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="dashboard-shell"
      style={{ background: "var(--ink-bg)", color: "var(--text-primary)", minHeight: "100vh" }}
    >
      {children}
    </div>
  );
}
