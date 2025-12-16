import { describe, expect, it } from "vitest";
import { getMugshotURL } from "./cloudinary";

describe("getMugshotURL", () => {
	it("should generate a valid Cloudinary URL with default transformations", () => {
		const cloudName = "test-cloud";
		const url = getMugshotURL(cloudName);

		expect(url).toBeInstanceOf(URL);
		expect(url.hostname).toBe("res.cloudinary.com");
		expect(url.pathname).toContain(cloudName);
		expect(url.pathname).toContain("website/cvdqj6qb6w7bszi9g8bxzbp3");
	});

	it("should include default quality and fetchFormat transformations", () => {
		const cloudName = "test-cloud";
		const url = getMugshotURL(cloudName);

		const pathname = url.pathname;
		expect(pathname).toContain("q_auto");
		expect(pathname).toContain("f_auto");
	});

	it("should apply custom transformations", () => {
		const cloudName = "test-cloud";
		const url = getMugshotURL(cloudName, {
			resize: { type: "scale", width: 500, height: 500 },
		});

		const pathname = url.pathname;
		expect(pathname).toContain("w_500");
		expect(pathname).toContain("h_500");
	});

	it("should merge custom transformations with defaults", () => {
		const cloudName = "test-cloud";
		const url = getMugshotURL(cloudName, {
			quality: "80",
		});

		const pathname = url.pathname;
		// Custom quality should override default
		expect(pathname).toContain("q_80");
		// But fetchFormat should still be auto
		expect(pathname).toContain("f_auto");
	});

	it("should work with different cloud names", () => {
		const cloudNames = ["cloud-one", "cloud-two", "my-custom-cloud"];

		cloudNames.forEach((cloudName) => {
			const url = getMugshotURL(cloudName);
			expect(url.pathname).toContain(cloudName);
		});
	});
});
