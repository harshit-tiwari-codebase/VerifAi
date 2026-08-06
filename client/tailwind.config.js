/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070A10",
          900: "#0A0E14",
          800: "#10151F",
          700: "#161C29",
          600: "#1E2530",
          500: "#2A3242",
        },
        mist: {
          100: "#E8ECF1",
          300: "#B7C0CE",
          500: "#7A8699",
          700: "#4C5566",
        },
        verify: {
          DEFAULT: "#00D9A0",
          soft: "#00D9A022",
          dim: "#0A8F6B",
        },
        signal: {
          DEFAULT: "#7C6FFF",
          soft: "#7C6FFF22",
          dim: "#5B4FDB",
        },
        flag: {
          DEFAULT: "#FF6B5E",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(7,10,16,0) 0%, #070A10 100%)",
      },
      boxShadow: {
        verify: "0 0 0 1px #00D9A033, 0 0 24px 0 #00D9A022",
        signal: "0 0 0 1px #7C6FFF33, 0 0 24px 0 #7C6FFF22",
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
