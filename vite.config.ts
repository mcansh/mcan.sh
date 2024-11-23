import { svgSprite } from "@mcansh/vite-plugin-svg-sprite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	build: { cssMinify: "lightningcss" },
	plugins: [tailwindcss(), svgSprite(), reactRouter()],
});
