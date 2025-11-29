"use client";

import { useRouter } from "next/navigation";
import { memo } from "react";
import { useWindowSize } from "usehooks-ts";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "./icons";
import { useSidebar } from "./ui/sidebar";
import { VisibilitySelector, type VisibilityType } from "./visibility-selector";

function PureChatHeader({
  chatId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex items-center justify-between gap-3 rounded-2xl sfc-glass-panel px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <SidebarToggle className="sfc-glass-chip flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-transparent p-0 text-white" />
        <span className="hidden text-sm font-medium text-white/80 md:inline">Conversation controls</span>
      </div>

      <div className="flex items-center gap-3">
        {(!open || windowWidth < 768) && (
          <Button
            className="sfc-glass-chip h-9 rounded-full border border-white/30 px-3 text-white transition"
            onClick={() => {
              router.push("/");
              router.refresh();
            }}
            variant="ghost"
          >
            <PlusIcon />
            <span className="md:sr-only">New Chat</span>
          </Button>
        )}

        {!isReadonly && (
          <VisibilitySelector
            chatId={chatId}
            className="[&>button]:sfc-glass-chip [&>button]:h-9 [&>button]:rounded-full [&>button]:border [&>button]:border-white/30 [&>button]:px-3 [&>button]:text-white"
            selectedVisibilityType={selectedVisibilityType}
          />
        )}
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatId &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});
