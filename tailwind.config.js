/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0070f3",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#111111",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "shimmer": "shimmer 2s linear infinite",
        "border-beam": "border-beam 15s linear infinite",
      },
      keyframes: {
        shimmer: {
          from: { "backgroundPosition": "0 0" },
          to: { "backgroundPosition": "-200% 0" }
        },
        "border-beam": {
          "100%": { "offset-distance": "100%" }
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
