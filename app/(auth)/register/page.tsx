"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Card, CardBody } from "@heroui/react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { type RegisterActionState, register } from "../actions";
import { LoaderIcon } from "@/components/icons";
import { LanhuGlyph } from "@/components/lanhu-glyph";

const LANHU_BACKGROUND =
  "https://lanhu-oss-2537-2.lanhuapp.com/FigmaDDSSlicePNGae4d43719dc4d2bac848cead745fcb87.png";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction, isPending] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    }
  );

  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === "user_exists") {
      toast.error("Account already exists!");
    } else if (state.status === "failed") {
      toast.error("Failed to create account!");
    } else if (state.status === "invalid_data") {
      toast.error("Failed validating your submission!");
    } else if (state.status === "success") {
      toast.success("Account created successfully!");
      setIsSuccessful(true);
      updateSession();
      router.refresh();
    }
  }, [state.status, updateSession, router]);

  const handleSubmit = (formData: FormData) => {
    const passwordValue = formData.get("password") as string;
    const repeatValue = formData.get("repeatPassword") as string;

    if (passwordValue !== repeatValue) {
      toast.error("Passwords do not match");
      return;
    }

    setEmail(formData.get("email") as string);
    formAction(formData);
  };

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
          <CardBody className="flex h-full flex-col items-center gap-7 px-10 pb-12 pt-[45px]">
            <LanhuGlyph />

            <form action={handleSubmit} className="flex w-full flex-col items-center gap-6">
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
                  autoComplete="new-password"
                />

                <Field
                  id="repeatPassword"
                  label="Repeat Password"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  autoComplete="new-password"
                />
              </div>

              <p className="w-full max-w-[352px] text-[12px] leading-4 tracking-[0.2px] text-white">
                Type your new strong password. Your password must include:
                <br />One capital letter &amp; one small letter at least
                <br />One special character
                <br />Minimum 8 digits long
              </p>

              <Button
                type="submit"
                disableRipple
                isDisabled={isSubmitting}
                isLoading={isPending}
                spinner={<LoaderIcon size={18} />}
                className="h-12 w-full max-w-[360px] rounded-[12px] bg-white/40 text-[15px] font-medium tracking-[0.6px] text-white transition hover:bg-white/55"
              >
                Create Account
              </Button>

              <p className="text-[12px] text-white/90">
                Already have an account?{" "}
                <Link className="underline" href="/login">
                  Log in
                </Link>
              </p>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
