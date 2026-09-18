import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        volt: "#42CE00",
        "ev-green": "#00A86B",
        lime: "#7DFF40",
        mist: "#F5F7F5",
        "soft-grey": "#EEF1EF",
        carbon: "#101412",
      },
      fontFamily: {
        display: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        fast: "180ms",
        standard: "400ms",
        product: "650ms",
        cinematic: "1000ms",
      },
    },
  },
  plugins: [],
} satisfies Config;
