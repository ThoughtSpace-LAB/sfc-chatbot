"use client";

import dynamic from "next/dynamic";

export const DynamicChat = dynamic(
  () => import("@/components/chat").then((mod) => mod.Chat),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);
