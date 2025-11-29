"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import ChatLandingPage from "./chat/page";

export default function Home() {
  return (
    <ChatLandingPage />
  );
}
