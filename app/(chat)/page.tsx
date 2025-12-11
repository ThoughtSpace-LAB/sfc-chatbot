import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { AuthCheck } from "@/components/auth-check";

const Chat = dynamic(() => import("@/components/chat").then((mod) => mod.Chat), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export const runtime = "edge";

export default async function Page() {
  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");
  const initialChatModel = modelIdFromCookie?.value || DEFAULT_CHAT_MODEL;

  return (
    <>
      <AuthCheck />
      <Chat
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
