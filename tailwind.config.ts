import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("daisyui")],
  // @ts-expect-error - daisyui theme config is valid but not in types
  daisyui: {
    themes: [
      {
        bazardor: {
          primary: "#16a34a",
          "primary-content": "#ffffff",
          secondary: "#f59e0b",
          accent: "#0ea5e9",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          info: "#3b82f6",
          success: "#22c55e",
          warning: "#facc15",
          error: "#ef4444",
        },
      },
    ],
  },
};

export default config;