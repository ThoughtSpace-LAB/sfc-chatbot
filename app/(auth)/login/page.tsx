"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { type LoginActionState, login } from "../actions";
import { LoaderIcon } from "@/components/icons";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <form action={formAction} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1
              className="text-[36px] font-medium leading-[42px] tracking-[0.4px] text-[var(--greengreen-4)]"
              style={{
                fontFamily: "var(--headline-xlarge-font-family)",
                fontSize: "var(--headline-xlarge-font-size)",
                fontStyle: "var(--headline-xlarge-font-style)",
                fontWeight: "var(--headline-xlarge-font-weight)",
                letterSpacing: "var(--headline-xlarge-letter-spacing)",
                lineHeight: "var(--headline-xlarge-line-height)",
              }}
            >
              Welcome Back
            </h1>
            <p
              className="text-[14px] font-normal leading-[22px] tracking-[0.4px] text-[var(--greengreen-6)]"
              style={{
                fontFamily: "var(--text-medium-font-family)",
                fontSize: "var(--text-medium-font-size)",
                fontStyle: "var(--text-medium-font-style)",
                fontWeight: "var(--text-medium-font-weight)",
                letterSpacing: "var(--text-medium-letter-spacing)",
                lineHeight: "var(--text-medium-line-height)",
              }}
            >
              Please login to your account
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-[14px] font-normal leading-[22px] tracking-[0.4px] text-[var(--greengreen-4)]"
                style={{
                  fontFamily: "var(--text-medium-font-family)",
                  fontSize: "var(--text-medium-font-size)",
                  fontStyle: "var(--text-medium-font-style)",
                  fontWeight: "var(--text-medium-font-weight)",
                  letterSpacing: "var(--text-medium-letter-spacing)",
                  lineHeight: "var(--text-medium-line-height)",
                }}
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-[var(--greennew-color)] rounded-lg text-[12px] font-normal leading-[22px] tracking-[0.4px] text-[var(--greengreen-4)] placeholder:text-[var(--greennew-color)] focus:outline-none focus:border-[var(--greengreen-6)] focus:ring-1 focus:ring-[var(--greengreen-6)]"
                style={{
                  fontFamily: "var(--textbox-regular-font-family)",
                  fontSize: "var(--textbox-regular-font-size)",
                  fontStyle: "var(--textbox-regular-font-style)",
                  fontWeight: "var(--textbox-regular-font-weight)",
                  letterSpacing: "var(--textbox-regular-letter-spacing)",
                  lineHeight: "var(--textbox-regular-line-height)",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-[14px] font-normal leading-[22px] tracking-[0.4px] text-[var(--greengreen-4)]"
                style={{
                  fontFamily: "var(--text-medium-font-family)",
                  fontSize: "var(--text-medium-font-size)",
                  fontStyle: "var(--text-medium-font-style)",
                  fontWeight: "var(--text-medium-font-weight)",
                  letterSpacing: "var(--text-medium-letter-spacing)",
                  lineHeight: "var(--text-medium-line-height)",
                }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-[var(--greennew-color)] rounded-lg text-[12px] font-normal leading-[22px] tracking-[0.4px] text-[var(--greengreen-4)] placeholder:text-[var(--greennew-color)] focus:outline-none focus:border-[var(--greengreen-6)] focus:ring-1 focus:ring-[var(--greengreen-6)]"
                style={{
                  fontFamily: "var(--textbox-regular-font-family)",
                  fontSize: "var(--textbox-regular-font-size)",
                  fontStyle: "var(--textbox-regular-font-style)",
                  fontWeight: "var(--textbox-regular-font-weight)",
                  letterSpacing: "var(--textbox-regular-letter-spacing)",
                  lineHeight: "var(--textbox-regular-line-height)",
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border border-[var(--greennew-color)] rounded cursor-pointer accent-[var(--greengreen-6)]"
              />
              <label
                htmlFor="remember"
                className="text-[11px] font-normal leading-[20px] tracking-[0.4px] text-[var(--greengreen-6)] cursor-pointer"
                style={{
                  fontFamily: "var(--text-small-font-family)",
                  fontSize: "var(--text-small-font-size)",
                  fontStyle: "var(--text-small-font-style)",
                  fontWeight: "var(--text-small-font-weight)",
                  letterSpacing: "var(--text-small-letter-spacing)",
                  lineHeight: "var(--text-small-line-height)",
                }}
              >
                Remember me
              </label>
            </div>
            <Link
              href="#"
              className="text-[11px] font-normal leading-[20px] tracking-[0.4px] text-[var(--greengreen-6)] hover:text-[var(--greengreen-4)] underline"
              style={{
                fontFamily: "var(--text-small-font-family)",
                fontSize: "var(--text-small-font-size)",
                fontStyle: "var(--text-small-font-style)",
                fontWeight: "var(--text-small-font-weight)",
                letterSpacing: "var(--text-small-letter-spacing)",
                lineHeight: "var(--text-small-line-height)",
              }}
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isPending || isSuccessful}
            className="w-full px-6 py-3 bg-[var(--greengreen-6)] hover:bg-[var(--greengreen-4)] active:bg-[var(--greengreen)] text-white rounded-lg text-[14px] font-medium leading-[24px] tracking-[0.6px] transition-colors duration-200 relative disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: "var(--button-medium-font-family)",
              fontSize: "var(--button-medium-font-size)",
              fontStyle: "var(--button-medium-font-style)",
              fontWeight: "var(--button-medium-font-weight)",
              letterSpacing: "var(--button-medium-letter-spacing)",
              lineHeight: "var(--button-medium-line-height)",
            }}
          >
            {isPending ? (
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <LoaderIcon className="animate-spin" />
              </span>
            ) : (
              "Login"
            )}
          </button>

          <div className="text-center">
            <p
              className="text-[11px] font-normal leading-[20px] tracking-[0.4px] text-[var(--greengreen-6)]"
              style={{
                fontFamily: "var(--text-small-font-family)",
                fontSize: "var(--text-small-font-size)",
                fontStyle: "var(--text-small-font-style)",
                fontWeight: "var(--text-small-font-weight)",
                letterSpacing: "var(--text-small-letter-spacing)",
                lineHeight: "var(--text-small-line-height)",
              }}
            >
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[var(--greengreen-6)] hover:text-[var(--greengreen-4)] underline font-medium"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
