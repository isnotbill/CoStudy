import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        cedarville: ['var(--font-cedarville)']
      }
    },
  },

  safelist: [
    'main-bg',
    'work-phase',
    'short-break-phase',
    'long-break-phase',
  ],
  plugins: [],
} satisfies Config;
