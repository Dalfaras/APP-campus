"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Chargement de votre espace sécurisé…
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
