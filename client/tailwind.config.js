/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // --- 1. Backgrounds ---
        app: "#0B0B0A",
        "bg-secondary": "#141412",

        // --- 2. Surfaces ---
        surface: {
          DEFAULT: "#1C1C19",
          app: "#0B0B0A",
          secondary: "#141412",
          card: "#171714",
          elevated: "#22221E",
          hover: "#30302B",
        },

        // --- 3. Brand Colors (Charcoal + Terracotta) ---
        brand: {
          DEFAULT: "#FF6A3D",
          hover: "#E9562F",
          lavender: "#FFB08E",
          light: "#FFD1BB",
          subtle: "#261912",
          selection: "#422316",
        },
        violet: {
          50: "#FFF4EF",
          100: "#FFE5D9",
          200: "#FFD1BB",
          300: "#FFB08E",
          400: "#FF946B",
          500: "#FF6A3D",
          600: "#E9562F",
          700: "#C94827",
          800: "#9E3A23",
          900: "#6F2C1D",
          950: "#422316",
        },
        purple: {
          50: "#FFF4EF",
          100: "#FFE5D9",
          200: "#FFD1BB",
          300: "#FFB08E",
          400: "#FF946B",
          500: "#FF6A3D",
          600: "#E9562F",
          700: "#C94827",
          800: "#9E3A23",
          900: "#6F2C1D",
          950: "#422316",
        },

        // --- 4. Typography Scale ---
        primary: "#F2EFE6",
        secondary: "#AAA69B",
        muted: "#77756D",
        disabled: "#66645D",

        // --- 5. Borders ---
        border: {
          DEFAULT: "#30302B",
          hover: "#414139",
          focus: "#FF6A3D",
          selected: "#FFB08E",
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
          pending: "#AAA69B",
          easy: "#4ADE80",
          medium: "#FBBF24",
          hard: "#F87171",
        },

        // --- Compatibility Tokens (Mapped to exact new Black + Violet system) ---
        ink: {
          500: "#414139", // hover border
          600: "#30302B", // default border
          700: "#22221E", // elevated surface
          800: "#171714", // card background
          850: "#1C1C19", // standard surface
          900: "#141412", // secondary background
          950: "#0B0B0A", // main application background
        },
        verify: {
          DEFAULT: "#FF6A3D",
          hover: "#E9562F",
        },
        signal: {
          DEFAULT: "#FFB08E",
          light: "#FFD1BB",
        },
        mist: {
          100: "#F2EFE6", // primary text
          200: "#F2EFE6",
          300: "#AAA69B", // secondary text
          400: "#AAA69B",
          500: "#77756D", // muted text
          600: "#77756D",
          700: "#66645D", // disabled text
        },
      },
      fontFamily: {
        sans: ['"Manrope"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Manrope"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        violet: "0 2px 8px rgba(0, 0, 0, 0.18)",
        "violet-subtle": "0 1px 4px rgba(0, 0, 0, 0.14)",
        "violet-strong": "0 4px 12px rgba(0, 0, 0, 0.2)",
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
