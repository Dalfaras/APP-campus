import Header from "@/components/header";
import { AuthGate } from "@/components/auth-gate";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <AuthGate>
        <main className="flex-1">{children}</main>
      </AuthGate>
    </div>
  );
}
