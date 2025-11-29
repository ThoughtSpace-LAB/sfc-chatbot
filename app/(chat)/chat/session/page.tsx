import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { saveChat } from "@/lib/db/queries";
import type { VisibilityType } from "@/components/visibility-selector";
import { generateUUID } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ChatSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query: rawQuery } = await searchParams;
  const query = (rawQuery ?? "").trim();

  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/guest");
  }

  const chatId = generateUUID();

  const defaultVisibility: VisibilityType = "private";

  await saveChat({
    id: chatId,
    userId: session.user.id,
    title: query || "New Chat",
    visibility: defaultVisibility,
  });

  const querySuffix = query ? `?query=${encodeURIComponent(query)}` : "";

  redirect(`/chat/${chatId}${querySuffix}`);
}
