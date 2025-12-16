import { describe, expect, it } from "vitest";
import { envSchema } from "./env";

describe("envSchema", () => {
	describe("extends client_env_schema", () => {
		it("should include VITE_FATHOM_SITE_ID validation", () => {
			const input = {
				VITE_FATHOM_SITE_ID: "",
				VITE_SENTRY_DSN: "https://example.com",
				CLOUDINARY_CLOUD_NAME: "test-cloud",
				SENTRY_REPORT_URL: "https://sentry.io/report",
			};

			expect(() => envSchema.parse(input)).toThrow();
		});

		it("should include VITE_SENTRY_DSN validation", () => {
			const input = {
				VITE_FATHOM_SITE_ID: "ABC123",
				VITE_SENTRY_DSN: "not-a-url",
				CLOUDINARY_CLOUD_NAME: "test-cloud",
				SENTRY_REPORT_URL: "https://sentry.io/report",
			};

			expect(() => envSchema.parse(input)).toThrow();
		});
	});

	describe("CLOUDINARY_CLOUD_NAME", () => {
		it("should accept valid cloud names", () => {
			const validInputs = [
				{
					VITE_FATHOM_SITE_ID: "ABC123",
					VITE_SENTRY_DSN: "https://example.com",
					CLOUDINARY_CLOUD_NAME: "my-cloud",
					SENTRY_REPORT_URL: "https://sentry.io/report",
				},
				{
					VITE_FATHOM_SITE_ID: "ABC123",
					VITE_SENTRY_DSN: "https://example.com",
					CLOUDINARY_CLOUD_NAME: "test-cloud-123",
					SENTRY_REPORT_URL: "https://sentry.io/report",
				},
			];

			validInputs.forEach((input) => {
				const result = envSchema.parse(input);
				expect(result.CLOUDINARY_CLOUD_NAME).toBe(input.CLOUDINARY_CLOUD_NAME);
			});
		});

		it("should reject empty strings", () => {
			const input = {
				VITE_FATHOM_SITE_ID: "ABC123",
				VITE_SENTRY_DSN: "https://example.com",
				CLOUDINARY_CLOUD_NAME: "",
				SENTRY_REPORT_URL: "https://sentry.io/report",
			};

			expect(() => envSchema.parse(input)).toThrow();
		});

		it("should reject non-string values", () => {
			const invalidInputs = [
				{
					VITE_FATHOM_SITE_ID: "ABC123",
					VITE_SENTRY_DSN: "https://example.com",
					CLOUDINARY_CLOUD_NAME: 123,
					SENTRY_REPORT_URL: "https://sentry.io/report",
				},
				{
					VITE_FATHOM_SITE_ID: "ABC123",
					VITE_SENTRY_DSN: "https://example.com",
					CLOUDINARY_CLOUD_NAME: null,
					SENTRY_REPORT_URL: "https://sentry.io/report",
				},
			];

			invalidInputs.forEach((input) => {
				expect(() => envSchema.parse(input)).toThrow();
			});
		});
	});

	describe("SENTRY_REPORT_URL", () => {
		it("should accept valid URLs", () => {
			const validInputs = [
				{
					VITE_FATHOM_SITE_ID: "ABC123",
					VITE_SENTRY_DSN: "https://example.com",
					CLOUDINARY_CLOUD_NAME: "test-cloud",
					SENTRY_REPORT_URL: "https://sentry.io/api/report",
				},
				{
					VITE_FATHOM_SITE_ID: "ABC123",
					VITE_SENTRY_DSN: "https://example.com",
					CLOUDINARY_CLOUD_NAME: "test-cloud",
					SENTRY_REPORT_URL: "https://example.com/sentry",
				},
			];

			validInputs.forEach((input) => {
				const result = envSchema.parse(input);
				expect(result.SENTRY_REPORT_URL).toBe(input.SENTRY_REPORT_URL);
			});
		});

		it("should reject invalid URLs", () => {
			const invalidInputs = [
				{
					VITE_FATHOM_SITE_ID: "ABC123",
					VITE_SENTRY_DSN: "https://example.com",
					CLOUDINARY_CLOUD_NAME: "test-cloud",
					SENTRY_REPORT_URL: "not-a-url",
				},
				{
					VITE_FATHOM_SITE_ID: "ABC123",
					VITE_SENTRY_DSN: "https://example.com",
					CLOUDINARY_CLOUD_NAME: "test-cloud",
					SENTRY_REPORT_URL: "",
				},
			];

			invalidInputs.forEach((input) => {
				expect(() => envSchema.parse(input)).toThrow();
			});
		});
	});

	describe("complete schema", () => {
		it("should require all four fields", () => {
			const missingOne = {
				VITE_FATHOM_SITE_ID: "ABC123",
				VITE_SENTRY_DSN: "https://example.com",
				CLOUDINARY_CLOUD_NAME: "test-cloud",
			};

			expect(() => envSchema.parse(missingOne)).toThrow();
		});

		it("should parse valid complete objects", () => {
			const validInput = {
				VITE_FATHOM_SITE_ID: "ABC123",
				VITE_SENTRY_DSN: "https://example.com",
				CLOUDINARY_CLOUD_NAME: "test-cloud",
				SENTRY_REPORT_URL: "https://sentry.io/report",
			};

			const result = envSchema.parse(validInput);
			expect(result).toEqual(validInput);
		});
	});
});
