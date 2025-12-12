import { describe, expect, it } from "vitest";
import { client_env_schema } from "./schema";

describe("client_env_schema", () => {
	describe("VITE_FATHOM_SITE_ID", () => {
		it("should accept valid site ID strings", () => {
			const validInputs = [
				{ VITE_FATHOM_SITE_ID: "ABC123", VITE_SENTRY_DSN: "https://example.com" },
				{
					VITE_FATHOM_SITE_ID: "MYSITE",
					VITE_SENTRY_DSN: "https://example.com",
				},
				{
					VITE_FATHOM_SITE_ID: "a1b2c3d4",
					VITE_SENTRY_DSN: "https://example.com",
				},
			];

			validInputs.forEach((input) => {
				const result = client_env_schema.parse(input);
				expect(result.VITE_FATHOM_SITE_ID).toBe(input.VITE_FATHOM_SITE_ID);
			});
		});

		it("should reject empty strings", () => {
			const input = {
				VITE_FATHOM_SITE_ID: "",
				VITE_SENTRY_DSN: "https://example.com",
			};

			expect(() => client_env_schema.parse(input)).toThrow();
		});

		it("should reject non-string values", () => {
			const invalidInputs = [
				{ VITE_FATHOM_SITE_ID: 123, VITE_SENTRY_DSN: "https://example.com" },
				{
					VITE_FATHOM_SITE_ID: null,
					VITE_SENTRY_DSN: "https://example.com",
				},
				{
					VITE_FATHOM_SITE_ID: undefined,
					VITE_SENTRY_DSN: "https://example.com",
				},
			];

			invalidInputs.forEach((input) => {
				expect(() => client_env_schema.parse(input)).toThrow();
			});
		});
	});

	describe("VITE_SENTRY_DSN", () => {
		it("should accept valid URLs", () => {
			const validInputs = [
				{
					VITE_FATHOM_SITE_ID: "ABC123",
					VITE_SENTRY_DSN: "https://sentry.io/my-project",
				},
				{
					VITE_FATHOM_SITE_ID: "ABC123",
					VITE_SENTRY_DSN: "https://example.com/path",
				},
				{
					VITE_FATHOM_SITE_ID: "ABC123",
					VITE_SENTRY_DSN: "http://localhost:9000",
				},
			];

			validInputs.forEach((input) => {
				const result = client_env_schema.parse(input);
				expect(result.VITE_SENTRY_DSN).toBe(input.VITE_SENTRY_DSN);
			});
		});

		it("should reject invalid URLs", () => {
			const invalidInputs = [
				{ VITE_FATHOM_SITE_ID: "ABC123", VITE_SENTRY_DSN: "not-a-url" },
				{ VITE_FATHOM_SITE_ID: "ABC123", VITE_SENTRY_DSN: "just-text" },
				{ VITE_FATHOM_SITE_ID: "ABC123", VITE_SENTRY_DSN: "" },
			];

			invalidInputs.forEach((input) => {
				expect(() => client_env_schema.parse(input)).toThrow();
			});
		});

		it("should reject non-string values", () => {
			const invalidInputs = [
				{ VITE_FATHOM_SITE_ID: "ABC123", VITE_SENTRY_DSN: 123 },
				{ VITE_FATHOM_SITE_ID: "ABC123", VITE_SENTRY_DSN: null },
				{ VITE_FATHOM_SITE_ID: "ABC123", VITE_SENTRY_DSN: undefined },
			];

			invalidInputs.forEach((input) => {
				expect(() => client_env_schema.parse(input)).toThrow();
			});
		});
	});

	describe("schema structure", () => {
		it("should require both fields", () => {
			const missingFathom = { VITE_SENTRY_DSN: "https://example.com" };
			const missingSentry = { VITE_FATHOM_SITE_ID: "ABC123" };

			expect(() => client_env_schema.parse(missingFathom)).toThrow();
			expect(() => client_env_schema.parse(missingSentry)).toThrow();
		});

		it("should parse valid complete objects", () => {
			const validInput = {
				VITE_FATHOM_SITE_ID: "ABC123",
				VITE_SENTRY_DSN: "https://sentry.io/project",
			};

			const result = client_env_schema.parse(validInput);
			expect(result).toEqual(validInput);
		});
	});
});
