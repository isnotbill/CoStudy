"use client";

export function ScribbleUnderline() {
  return (
    <svg
      className="absolute -bottom-2 left-0 w-full h-6 text-yellow-400/80 -z-10"
      viewBox="0 0 200 25"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0 15C50 15 50 5 100 5C150 5 150 20 200 20"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="10 15"
      />
    </svg>
  );
}
