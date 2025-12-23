import { cookies } from "next/headers";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/uuid";
import { DynamicAuthCheck } from "@/components/auth-check-dynamic";
import { DynamicChat } from "@/components/chat-dynamic";

export default async function Page() {
  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");
  const initialChatModel = modelIdFromCookie?.value || DEFAULT_CHAT_MODEL;

  return (
    <>
      <DynamicAuthCheck />
      <DynamicChat
        autoResume={false}
        id={id}
        initialChatModel={initialChatModel}
        initialMessages={[]}
        initialVisibilityType="private"
        isReadonly={false}
        key={id}
      />
      <DataStreamHandler />
    </>
  );
}
