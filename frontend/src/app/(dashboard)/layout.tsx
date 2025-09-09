'use client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth is now handled globally by AuthMiddleware in providers
  return <>{children}</>;
}
