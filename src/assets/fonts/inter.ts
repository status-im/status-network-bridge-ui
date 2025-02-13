import localFont from "next/font/local";

const interFont = localFont({
    display: "swap",
    src: [
        {
            path: "../../../public/fonts/Inter/Inter_18pt-Light.ttf",
            weight: "300",
            style: "normal",
        },
        {
            path: "../../../public/fonts/Inter/Inter_18pt-LightItalic.ttf",
            weight: "300",
            style: "italic",
        },
        {
            path: "../../../public/fonts/Inter/Inter_18pt-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../../public/fonts/Inter/Inter_18pt-Italic.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../../../public/fonts/Inter/Inter_18pt-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../../../public/fonts/Inter/Inter_18pt-MediumItalic.ttf",
            weight: "500",
            style: "italic",
        },
        {
            path: "../../../public/fonts/Inter/Inter_18pt-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../../public/fonts/Inter/Inter_18pt-SemiBoldItalic.ttf",
            weight: "600",
            style: "italic",
        },
        {
            path: "../../../public/fonts/Inter/Inter_18pt-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../../../public/fonts/Inter/Inter_18pt-BoldItalic.ttf",
            weight: "700",
            style: "italic",
        },
    ],
    variable: "--font-inter"
})

export default interFont