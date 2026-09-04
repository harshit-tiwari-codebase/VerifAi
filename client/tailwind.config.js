/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark surface scale — used for backgrounds, cards, borders
        ink: {
          500: "#2A3441", // pending/inactive state dots
          600: "#1C2430", // hairline borders
          800: "#0D121B", // card/panel surface
          900: "#070A10", // page background
          950: "#040609", // deepest surface (e.g. primary button text-on-verify)
        },
        // Primary accent — was teal-green, now purple per request.
        // Keeping the token name "verify" (not renaming it) so every
        // existing bg-verify / text-verify / border-verify / shadow-verify
        // usage across the app picks up the new color automatically,
        // without touching every component file.
        verify: "#9333EA",
        // Secondary accent — a lighter violet, still distinct enough from
        // the new purple "verify" to read as a separate tone in LiveDemo.
        signal: "#C084FC",
        // Foreground text scale, light-on-dark
        mist: {
          100: "#F4F6FA", // primary text
          300: "#C7CEDA", // secondary text
          400: "#A6AEBD", // secondary/body copy on dashboard-style pages
          500: "#8B93A3", // muted text
          700: "#586173", // dim/pending text
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Outfit"', '"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      spacing: {
        section: "6rem",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: 0.6 },
          "80%": { transform: "scale(1.4)", opacity: 0 },
          "100%": { transform: "scale(1.4)", opacity: 0 },
        },
        rise: {
          "0%": { transform: "translateY(12px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "type-in": {
          from: { width: "0%" },
          to: { width: "100%" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.2,0.6,0.4,1) infinite",
        rise: "rise 0.6s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
