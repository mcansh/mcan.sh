/** @type {import('prettier').Config} */
export default {
	plugins: [
		"prettier-plugin-tailwindcss",
		"prettier-plugin-organize-imports",
		"prettier-plugin-packagejson",
	],
	useTabs: true,
	tabWidth: 2,
	semi: false,
	htmlWhitespaceSensitivity: "ignore",
	tailwindAttributes: ["class", "className", ".*[cC]lassName"],
	tailwindFunctions: ["clsx", "cn", "cva"],
	overrides: [
		{
			files: ["**/package.json"],
			options: {
				useTabs: false,
			},
		},
		{
			files: ["pnpm-workspace.yaml"],
			options: {
				useTabs: false,
				singleQuote: true,
			},
		},
	],
}
