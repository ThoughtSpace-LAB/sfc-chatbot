import Script from "next/script";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <DataStreamProvider>
        <SidebarProvider defaultOpen={true}>
          <div className="figma-shell">
            <main className="figma-main">{children}</main>
          </div>
        </SidebarProvider>
      </DataStreamProvider>
    </>
  );
}
