import type { LoaderFunctionArgs } from "@remix-run/node";
import { chromium } from "playwright";
import { cacheHeader } from "pretty-cache-header";

export async function loader({ request }: LoaderFunctionArgs) {
	console.info(`regenerating resume.pdf`);
	let url = new URL(request.url);
	let resume_url = new URL("resume", url.origin);

	let browser = await chromium.launch();
	let page = await browser.newPage();
	await page.goto(resume_url.toString());
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
	await browser.close();

	return new Response(pdf, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": "inline; filename=Logan McAnsh.pdf",
			"Cache-Control": cacheHeader({
				sMaxage: "1 day",
				staleWhileRevalidate: "1 month",
				public: true,
			}),
		},
	});
}
