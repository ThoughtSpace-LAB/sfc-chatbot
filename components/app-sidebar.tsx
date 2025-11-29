"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { LanhuGlyph } from "@/components/lanhu-glyph";
import { GlobeIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { SidebarHistory, getChatHistoryPaginationKey } from "@/components/sidebar-history";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { mutate } = useSWRConfig();
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  const handleDeleteAll = () => {
    const deletePromise = fetch("/api/history", {
      method: "DELETE",
    });

    toast.promise(deletePromise, {
      loading: "Deleting all chats...",
      success: () => {
        mutate(unstable_serialize(getChatHistoryPaginationKey));
        router.push("/");
        setShowDeleteAllDialog(false);
        return "All chats deleted successfully";
      },
      error: "Failed to delete all chats",
    });
  };

  return (
    <>
      <Sidebar className="group-data-[side=left]:border-r-0 sfc-sidebar">
        <SidebarHeader className="space-y-6 px-5 pt-8">
          <div className="flex flex-col gap-6">
            <Link
              className="flex items-center gap-3"
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
            >
              <span className="grid size-9 place-items-center rounded-full border border-white/30 bg-white/10">
                <LanhuGlyph />
              </span>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.4em] text-white/60">
                  Serena
                </span>
                <span className="text-base font-semibold text-white">
                  Control Center
                </span>
              </div>
            </Link>

            <div className="flex flex-col gap-2">
              <Button
                className="sfc-sidebar-link justify-start gap-3"
                onClick={() => {
                  setOpenMobile(false);
                  router.push("/");
                  router.refresh();
                }}
                type="button"
                variant="ghost"
              >
                <PlusIcon />
                New Chat
              </Button>
              <Button
                className="sfc-sidebar-link justify-start gap-3"
                onClick={() => toast.info("Search history coming soon")}
                type="button"
                variant="ghost"
              >
                <GlobeIcon size={16} />
                Search History
              </Button>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-5">
          <div className="mt-2 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.4em] text-white/55">Recent</p>
            <SidebarHistory user={user} />
          </div>
        </SidebarContent>
        <SidebarFooter className="px-5 pb-6">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Button className="sfc-sidebar-link justify-center" type="button" variant="ghost">
                General
              </Button>
              <Button className="sfc-sidebar-link justify-center" type="button" variant="ghost">
                Upgrade
              </Button>
            </div>
            {user && <SidebarUserNav user={user} />}
            {user && (
              <Button
                className="sfc-sidebar-link justify-center gap-2 border border-red-300/60 text-red-200 hover:text-red-50"
                onClick={() => setShowDeleteAllDialog(true)}
                type="button"
                variant="ghost"
              >
                <TrashIcon />
                Delete All
              </Button>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>

      <AlertDialog onOpenChange={setShowDeleteAllDialog} open={showDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all chats?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your
              chats and remove them from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAll}>
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
