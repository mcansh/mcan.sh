import etag from "etag";
import { chromium } from "playwright";
import { cacheHeader } from "pretty-cache-header";

import type * as Route from "./+types.resume[.pdf]";

export async function loader({ request }: Route.LoaderArgs) {
	console.info(`regenerating resume.pdf`);
	let url = new URL(request.url);
	let resume_url = new URL("resume", url.origin);

	let browser = await chromium.launch();
	let page = await browser.newPage();
	await page.goto(resume_url.toString());
	await page.waitForLoadState("domcontentloaded");

	let pdf = await page.pdf({
		tagged: true,
		margin: {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
		},
		printBackground: true,
	});

	let etagValue = etag(pdf);
	await browser.close();

	if (request.headers.get("If-None-Match") === etagValue) {
		return new Response(null, { status: 304 });
	}

	return new Response(pdf, {
		headers: {
			"Cache-Control": cacheHeader({
				sMaxage: "1 day",
				staleWhileRevalidate: "1 month",
				public: true,
			}),
			"Content-Disposition": "inline; filename=Logan McAnsh.pdf",
			"Content-Length": pdf.byteLength.toString(),
			"Content-Type": "application/pdf",
			ETag: etagValue,
		},
	});
}
