/** @type {import('prettier').Config} */
export default {
	plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-organize-imports"],
	useTabs: true,
	tabWidth: 2,
	htmlWhitespaceSensitivity: "ignore",
	tailwindAttributes: ["class", "className", "ngClass", ".*[cC]lassName"],
	tailwindFunctions: ["clsx", "cn", "cva"],
	overrides: [
		// formatting the package.json with anything other than spaces will cause
		// issues when running install...
		{
			files: ["**/package.json"],
			options: {
				useTabs: false,
			},
		},
	],
};
