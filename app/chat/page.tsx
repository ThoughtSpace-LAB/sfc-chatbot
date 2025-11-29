"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Card } from "@heroui/react";
import { LanhuGlyph } from "@/components/lanhu-glyph";

const LANHU_BACKGROUND =
  "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNGae4d43719dc4d2bac848cead745fcb87.png";

export default function ChatLandingPage() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    router.push(`/chat/session?query=${encodeURIComponent(trimmed)}`);
  };
  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-[#37BFA5] text-white">
      <div className="relative flex h-full w-full max-w-[1440px] items-center justify-center overflow-hidden bg-[#37BFA5] shadow-[0_4px_100px_rgba(0,0,0,0.05)]">
        <div className="pointer-events-none absolute inset-0">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[2982px] w-[2912px] -translate-x-[58%] -translate-y-[58%] bg-cover bg-no-repeat opacity-80"
            style={{ backgroundImage: `url(${LANHU_BACKGROUND})` }}
          />
        </div>
        <div className="relative z-10 flex w-full flex-col items-center justify-center gap-12 px-6">
          <div className="absolute left-8 top-8 h-10 w-10">
            <LanhuGlyph />
          </div>
          <div className="absolute right-8 top-8 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.25)]" />
          <h1 className="mb-2 text-center text-4xl font-semibold tracking-tight">Hello Phil, welcome</h1>
          <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Card
                key={i}
                className="h-[140px] rounded-[18px] border border-white/5 bg-black/25 px-5 py-4 text-left shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-[30px]"
              >
                <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-white">
                  Today&apos;s Energy Field
                </div>
                <div className="text-[13px] leading-5 text-white/80">
                  A quick reading of the currents surrounding you, revealing the dominant energy shaping your
                </div>
              </Card>
            ))}
          </div>
          <form
            className="mt-4 flex w-full max-w-4xl flex-col items-center"
            onSubmit={handleSubmit}
          >
            <div className="w-full rounded-[44px] border border-white/25 bg-white/35 px-7 pt-5 pb-4 shadow-[0_40px_120px_rgba(0,0,0,0.4)] backdrop-blur-[60px]">
              <div className="flex items-center gap-4">
                <div className="flex-1 rounded-[34px] bg-white/80 px-7 py-3 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.8)]">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Anything"
                    className="w-full bg-transparent text-[17px] leading-none text-[#0A394B] outline-none placeholder:text-[#0A394B]/55"
                  />
                </div>
                <button
                  type="submit"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/65 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.4)] text-[#0A394B]"
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 22 22">
                    <path d="M4 11l15-6-6 15-2-7-7-2z" fill="currentColor" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 flex w-full justify-start">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full bg-white px-5 py-1.5 text-sm font-medium text-[#0A394B] shadow-[0_18px_45px_rgba(0,0,0,0.32)]"
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="7" stroke="#0A394B" strokeWidth="2" />
                    <path d="M8 4v4l2 2" stroke="#0A394B" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Web Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
