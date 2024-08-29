/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                acidNormal: "Acid Grotesk Normal",
                acidRegular: "Acid Grotesk Regular",
                acidMedium: "Acid Grotesk Medium",
                acidBold: "Acid Grotesk Bold",
            }
        },
    },
    plugins: [],
}
