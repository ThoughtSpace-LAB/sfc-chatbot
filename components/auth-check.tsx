"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function AuthCheck() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/api/auth/guest";
    }
  }, [status]);

  return null;
}
