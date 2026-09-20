/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#040C26",
          900: "#08184E", // Official BEST Blue from Logo
          850: "#0D226B",
          800: "#132D86",
          700: "#1A3BA6",
          600: "#244EC9",
          500: "#3264EB",
          200: "#D3DFF8",
          100: "#E8EEFA",
          50: "#F2F6FD",
        },
        dark: {
          950: "#FFF9ED", // Main Canvas Background (Warm Alabaster / Ivory)
          900: "#FFFFFF", // Card / Surface Background (Crisp White)
          850: "#FAF4E8", // Layered Surface / Inset
          800: "#F3EBD9", // Active / Hover Surface
          750: "#E8DEC8", // Light Divider
          700: "#DACDB4",
        },
        gold: {
          50: "#FAF6EE",
          100: "#F4ECDC",
          200: "#E8D7B5",
          300: "#DAC08B",
          400: "#CAA661",
          500: "#B89248", // Primary Architectural Gold (High Contrast)
          600: "#9C7A34", // Deep Architectural Gold
          700: "#7E6123",
          800: "#604816",
          900: "#43310B",
        },
        sand: {
          50: "#FFFDF9",
          100: "#FAF5EA",
          200: "#F2E8D3",
          300: "#E3D2B2",
          400: "#CFB88E",
          500: "#B59C6E",
        },
        steel: {
          50: "#FDFBF7",
          100: "#F5EFE3",
          200: "#2E2A24", // High-contrast warm charcoal for primary body
          300: "#4A443C", // Deep stone graphite
          400: "#6E665B", // Warm graphite secondary
          500: "#91887C", // Muted caption
          600: "#4A443C",
          700: "#332E27",
          800: "#1F1C18",
          900: "#141311",
        },
        charcoal: {
          950: "#141311",
          900: "#1A1815",
          800: "#2E2B27",
          700: "#4A453E",
          600: "#6E665B",
          500: "#91887C",
          400: "#B4ABA0",
          300: "#D3CBC1",
          200: "#E8E2D8",
          100: "#F4F0E8",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        serif: ["'Playfair Display'", "'Cormorant Garamond'", "Georgia", "serif"],
        headline: ["'Playfair Display'", "'Cinzel'", "Georgia", "serif"],
        display: ["'Montserrat'", "'Plus Jakarta Sans'", "sans-serif"],
        architectural: ["'Cinzel'", "'Montserrat'", "sans-serif"],
        logo: ["'Bebas Neue'", "'Montserrat'", "sans-serif"],
        mono: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xs: "2px",
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "22px",
        "3xl": "30px",
      },
      boxShadow: {
        "gold-glow": "0 0 25px -4px rgba(184, 146, 72, 0.35)",
        "gold-subtle": "0 10px 30px -10px rgba(184, 146, 72, 0.2)",
        "luxury-card": "0 20px 45px -12px rgba(60, 45, 25, 0.08), 0 0 0 1px rgba(184, 146, 72, 0.14)",
        "glass-elevated": "0 25px 60px -15px rgba(45, 35, 20, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.9)",
      },
      maxWidth: {
        container: "1440px",
      },
    },
  },
  plugins: [],
};
