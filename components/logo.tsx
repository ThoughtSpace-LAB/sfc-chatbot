import React from "react";

import { cn } from "@/lib/utils";

const PRIMARY_STROKE = "rgba(255,255,255,0.65)";

type LogoProps = {
  size?: number;
  className?: string;
};

export const Logo = ({ size = 129, className }: LogoProps): JSX.Element => {
  const dimension = `${size}px`;

  return (
    <figure
      className={cn("flex items-center justify-center", className)}
      role="img"
      aria-label="Serena Felix logo"
      style={{ width: dimension, height: dimension }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="logoGlow" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#7fbcd0" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#34be87" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#09101e" stopOpacity="0.3" />
          </radialGradient>
          <linearGradient id="logoStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ccf2ff" />
            <stop offset="55%" stopColor="#1a5d73" />
            <stop offset="100%" stopColor="#023344" />
          </linearGradient>
        </defs>

        <circle
          cx="80"
          cy="80"
          r="74"
          fill="url(#logoGlow)"
          opacity="0.65"
        />
        <circle
          cx="80"
          cy="80"
          r="68"
          fill="none"
          stroke="url(#logoStroke)"
          strokeWidth="3.5"
        />

        <path
          d="M40 62C56 44 104 40 122 58"
          fill="none"
          stroke={PRIMARY_STROKE}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M34 96C46 118 108 120 128 88"
          fill="none"
          stroke={PRIMARY_STROKE}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M82 28L90 50"
          stroke="#ccf2ff"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M46 118L56 134"
          stroke="#7fbcd0"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M100 112L112 130"
          stroke="#7fbcd0"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="72" cy="46" r="6" fill="#ccf2ff" />
        <circle cx="106" cy="40" r="4" fill="#1a5d73" />
        <circle cx="52" cy="108" r="5" fill="#34be87" />
      </svg>
    </figure>
  );
};
