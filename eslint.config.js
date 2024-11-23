import Fs from "node:fs";

import { fixupPluginRules } from "@eslint/compat";
import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import preferLet from "eslint-plugin-prefer-let";
import { globifyGitIgnore } from "globify-gitignore";
import tseslint from "typescript-eslint";

let gitignoreContent = Fs.readFileSync(".gitignore", "utf-8");
let globs = await globifyGitIgnore(gitignoreContent);
let ignores = globs.map((glob) => glob.glob);

export default tseslint.config(
	{ ignores },
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
		},
		rules: {
			"prefer-const": "off",
			"prefer-let/prefer-let": "error",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_" },
			],
			"import/consistent-type-specifier-style": ["error", "prefer-top-level"],
			"import/order": [
				"error",
				{
					alphabetize: { caseInsensitive: true, order: "asc" },
					groups: ["builtin", "external", "internal", "parent", "sibling"],
					"newlines-between": "always",
				},
			],
			"import/no-unresolved": ["error", { ignore: ["^virtual:"] }],
		},
		settings: {
			"import/resolver": {
				typescript: { alwaysTryTypes: true },
			},
		},
	},
);
