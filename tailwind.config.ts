import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import tailwindScrollbar from "tailwind-scrollbar";
import daisyuiThemes from "daisyui/src/theming/themes";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#a8b3ef",
          DEFAULT: "#7140FD",
        },
        secondary: {
          light: "#cdece0",
          DEFAULT: "#3D96A5",
        },
        orange: {
          light: "#FFF1E9",
          DEFAULT: "#FF8F6B",
        },
        card: "#505050",
        cardBg: "#FFFFFF",
        backgroundColor: "var(--background-color)",
        icon: "#C0C0C0",
        yellow: "var(--yellow)",
        success: "#C1FF14",
      },
      fontFamily: {
        openSans: ["var(--font-open-sans)"]
      },
    },
  },

  daisyui: {
    themes: [
      {
        light: {
          ...daisyuiThemes.light,
          primary: "#7140FD",
          secondary: "#3D96A5",
          warning: "#FF8D4C",
          info: "#61DFFF",
          success: "#C1FF14",
        },
      },
    ],
  },
  plugins: [daisyui, tailwindScrollbar],
};

export default config;
