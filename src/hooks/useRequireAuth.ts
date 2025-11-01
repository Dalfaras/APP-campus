"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";

interface RequireAuthResult {
  user: User | null;
  isLoading: boolean;
}

export function useRequireAuth(): RequireAuthResult {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [checked, setChecked] = useState<boolean>(!!auth.currentUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setChecked(true);
        router.replace("/login");
        return;
      }

      setUser(firebaseUser);
      setChecked(true);
    });

    return () => unsub();
  }, [router]);

  return { user, isLoading: !checked };
}
