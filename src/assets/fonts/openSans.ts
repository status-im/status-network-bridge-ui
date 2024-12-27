import localFont from "next/font/local";

const openSansFont = localFont({
  display: "swap",
  src: [
    {
      path: "../../../public/fonts/OpenSans/OpenSans-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../public/fonts/OpenSans/OpenSans-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../../public/fonts/OpenSans/OpenSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/OpenSans/OpenSans-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../../public/fonts/OpenSans/OpenSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/OpenSans/OpenSans-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../../public/fonts/OpenSans/OpenSans-Semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/OpenSans/OpenSans-SemiboldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../../public/fonts/OpenSans/OpenSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/OpenSans/OpenSans-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-open-sans",
});

export default openSansFont;
