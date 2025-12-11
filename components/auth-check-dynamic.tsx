"use client";

import dynamic from "next/dynamic";

export const DynamicAuthCheck = dynamic(
  () => import("@/components/auth-check").then((mod) => mod.AuthCheck),
  {
    ssr: false,
  }
);
