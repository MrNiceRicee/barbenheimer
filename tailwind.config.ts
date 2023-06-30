import { type Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "grain-jitter": {
          "0%, 100%": {
            backgroundPosition: "0 0",
            rotate: "0deg",
          },
          "25%": {
            backgroundPosition: "10px 10px",
            rotate: "185deg",
          },
          "50%": {
            backgroundPosition: "-10px -10px",
            rotate: "170deg",
          },
          "75%": {
            backgroundPosition: "-10px 10px",
            rotate: "180deg",
          },
        },
      },
      animation: {
        "grain-jitter": "grain-jitter .5s steps(1) infinite",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ".grain-overlay": {
          position: "relative",
          "&::before": {
            content: '""',
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('/images/grain.png')",
            backgroundSize: "100px 100px",
            pointerEvents: "none",
            transform: "scale(1.5)",
          },
        },
      });
    }),
  ],
} satisfies Config;
