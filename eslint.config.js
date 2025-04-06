import { fixupPluginRules } from "@eslint/compat";
import eslint from "@eslint/js";
import gitignore from "eslint-config-flat-gitignore";
import importPlugin from "eslint-plugin-import";
import preferLet from "eslint-plugin-prefer-let";
import reactCompiler from "eslint-plugin-react-compiler";
import tseslint from "typescript-eslint";

export default tseslint.config(
	gitignore(),
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	importPlugin.flatConfigs.recommended,
	importPlugin.flatConfigs.typescript,
	{
		linterOptions: {
			reportUnusedDisableDirectives: "error",
		},
		plugins: {
			"prefer-let": fixupPluginRules(preferLet),
			"react-compiler": reactCompiler,
		},
		rules: {
			"react-compiler/react-compiler": "error",
			"prefer-const": "off",
			"prefer-let/prefer-let": "error",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_" },
			],
			"import/newline-after-import": "error",
			"import/consistent-type-specifier-style": ["error", "prefer-top-level"],
			"import/no-unresolved": ["error", { ignore: ["^virtual:"] }],
			"import/no-named-as-default-member": "off",
			// prettier-plugin-organize-impoets
			"sort-imports": "off",
			"import/order": "off",
		},
		settings: {
			"import/resolver": {
				typescript: { alwaysTryTypes: true },
			},
		},
	},
);
