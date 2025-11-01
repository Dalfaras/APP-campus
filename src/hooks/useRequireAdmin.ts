"use client";

import { useEffect, useState } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";

interface RequireAdminResult {
  ready: boolean;
}

export function useRequireAdmin(): RequireAdminResult {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setReady(false);
        router.replace("/login");
        return;
      }

      const token = await user.getIdTokenResult(true);
      if (!token.claims?.admin) {
        setReady(false);
        router.replace("/");
        return;
      }

      setReady(true);
    });

    return () => unsubscribe();
  }, [router]);

  return { ready };
}
