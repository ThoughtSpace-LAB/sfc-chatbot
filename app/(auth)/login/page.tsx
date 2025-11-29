"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Card, CardBody } from "@heroui/react";
import { SiFacebook } from "@icons-pack/react-simple-icons";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { type LoginActionState, login } from "../actions";
import { LoaderIcon } from "@/components/icons";
import { LanhuGlyph } from "@/components/lanhu-glyph";

const LANHU_BACKGROUND =
  "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNGae4d43719dc4d2bac848cead745fcb87.png";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction, isPending] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    }
  );

  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === "failed") {
      toast.error("Invalid credentials!");
    } else if (state.status === "invalid_data") {
      toast.error("Failed validating your submission!");
    } else if (state.status === "success") {
      setIsSuccessful(true);
      updateSession();
      router.refresh();
    }
  }, [state.status, updateSession, router]);

  const isSubmitting = isPending || isSuccessful;

  const Field = ({
    id,
    label,
    type,
    value,
    onChange,
    autoComplete,
  }: {
    id: string;
    label: string;
    type: string;
    value: string;
    autoComplete: string;
    onChange: (next: string) => void;
  }) => (
    <label className="flex w-full max-w-[360px] flex-col gap-2">
      <span className="text-[12px] text-white">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className="h-[24px] border-b border-white/30 bg-transparent text-[14px] text-white outline-none transition focus:border-white/70"
      />
    </label>
  );
  const socialButtons = [0, 1, 2];

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

        <Card className="relative z-10 h-[560px] w-[440px] rounded-[13px] border border-white/15 bg-black/25 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
          <CardBody className="flex h-full flex-col items-center gap-7 px-10 pb-10 pt-[40px]">
            <LanhuGlyph />

            <form action={formAction} className="flex w-full flex-col items-center gap-6">
              <div className="flex w-full flex-col items-center gap-4">
                <Field
                  id="email"
                  label="Mail Box"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                />

                <Field
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  autoComplete="current-password"
                />
              </div>

              <div className="flex w-full max-w-[360px] justify-end">
                <Link
                  href="#"
                  className="text-[12px] text-white/80 underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disableRipple
                isDisabled={isSubmitting}
                isLoading={isPending}
                spinner={<LoaderIcon size={18} />}
                className="h-12 w-full max-w-[360px] rounded-[12px] bg-white/40 text-[15px] font-medium tracking-[0.6px] text-white transition hover:bg-white/55"
              >
                Log in
              </Button>

              <p className="text-[12px] text-white/90">
                Don&apos;t have an account yet?{" "}
                <Link className="underline" href="/register">
                  Register for free
                </Link>
              </p>

              <div className="grid w-full max-w-[360px] grid-cols-3 gap-3">
                {socialButtons.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="flex h-12 items-center justify-center rounded-[999px] border border-white/40 bg-white text-[#0A394B] shadow-[0_8px_25px_rgba(2,51,68,0.2)] transition hover:-translate-y-0.5"
                  >
                    <SiFacebook aria-label="Continue with Facebook" size={20} />
                  </button>
                ))}
              </div>

              <Link
                href="#"
                className="text-[12px] text-white underline underline-offset-4"
              >
                or continue as tourist
              </Link>

              <p className="text-center text-[10px] leading-4 text-white/80">
                By continuing, you agree to Serena&apos;s <Link className="underline" href="#">
                  Terms of Service
                </Link>{" "}
                and confirm that you have read Serena&apos;s <Link className="underline" href="#">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}

