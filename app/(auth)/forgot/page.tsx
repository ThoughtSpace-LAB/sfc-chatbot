"use client";

import { useState } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { toast } from "sonner";
import { LanhuGlyph } from "@/components/lanhu-glyph";
import Link from "next/link";

const LANHU_BACKGROUND =
  "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNGae4d43719dc4d2bac848cead745fcb87.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: wire up backend
    setTimeout(() => {
      toast.success("Reset link sent to your email");
      setIsSubmitting(false);
    }, 1200);
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
        <Card className="relative z-10 h-[340px] w-[440px] rounded-[13px] border border-white/15 bg-black/25 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
          <CardBody className="flex h-full flex-col items-center gap-8 px-10 pb-10 pt-[40px]">
            <h2 className="mb-2 text-center text-[22px] font-semibold text-white">Forget Password?</h2>
            <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-6">
              <label className="flex w-full max-w-[360px] flex-col gap-2">
                <span className="text-[12px] text-white">Mail Box</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="h-[24px] border-b border-white/30 bg-transparent text-[14px] text-white outline-none transition focus:border-white/70"
                />
              </label>
              <Button
                type="submit"
                disableRipple
                isDisabled={isSubmitting || !email}
                isLoading={isSubmitting}
                className="h-12 w-full max-w-[360px] rounded-[12px] bg-white/40 text-[15px] font-medium tracking-[0.6px] text-white transition hover:bg-white/55"
              >
                Send Reset Password Link
              </Button>
            </form>
            <Link href="/login" className="text-[12px] text-white underline underline-offset-4">Back to Login</Link>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
