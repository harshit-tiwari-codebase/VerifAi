/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // --- 1. Backgrounds ---
        app: "#09090B",
        "bg-secondary": "#0D0D12",

        // --- 2. Surfaces ---
        surface: {
          DEFAULT: "#14141B",
          app: "#09090B",
          secondary: "#0D0D12",
          card: "#18181F",
          elevated: "#20202A",
          hover: "#27272A",
        },

        // --- 3. Brand Colors (Black + Electric Violet) ---
        brand: {
          DEFAULT: "#8B5CF6", // primary violet
          hover: "#7C3AED",   // primary violet hover
          lavender: "#A78BFA",// secondary lavender
          light: "#C4B5FD",   // light lavender
          subtle: "#211635",  // subtle violet background
          selection: "#38245C",// violet selection background
        },

        // --- 4. Typography Scale ---
        primary: "#FAFAFA",
        secondary: "#A1A1AA",
        muted: "#71717A",
        disabled: "#52525B",

        // --- 5. Borders ---
        border: {
          DEFAULT: "#27272A",
          hover: "#3F3F4A",
          focus: "#8B5CF6",
          selected: "#A78BFA",
        },

        // --- 6. Semantic Status Colors ---
        status: {
          accepted: "#34D399",
          success: "#34D399",
          wrong: "#F87171",
          error: "#F87171",
          runtime: "#FB7185",
          warning: "#FBBF24",
          tle: "#FBBF24",
          info: "#60A5FA",
          running: "#60A5FA",
          pending: "#A1A1AA",
          easy: "#4ADE80",
          medium: "#FBBF24",
          hard: "#F87171",
        },

        // --- Compatibility Tokens (Mapped to exact new Black + Violet system) ---
        ink: {
          500: "#3F3F4A", // hover border
          600: "#27272A", // default border
          700: "#20202A", // elevated surface
          800: "#18181F", // card background
          850: "#14141B", // standard surface
          900: "#0D0D12", // secondary background
          950: "#09090B", // main application background
        },
        verify: {
          DEFAULT: "#8B5CF6",
          hover: "#7C3AED",
        },
        signal: {
          DEFAULT: "#A78BFA",
          light: "#C4B5FD",
        },
        mist: {
          100: "#FAFAFA", // primary text
          200: "#FAFAFA",
          300: "#A1A1AA", // secondary text
          400: "#A1A1AA",
          500: "#71717A", // muted text
          600: "#71717A",
          700: "#52525B", // disabled text
        },
      },
      fontFamily: {
        sans: ['"Geist"', '"Poppins"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Montserrat"', '"Geist"', '"Poppins"', "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', '"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        violet: "0 0 24px rgba(139, 92, 246, 0.16)",
        "violet-subtle": "0 0 16px rgba(139, 92, 246, 0.10)",
        "violet-strong": "0 0 32px rgba(139, 92, 246, 0.25)",
      },
      borderRadius: {
        card: "14px",
        button: "10px",
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
