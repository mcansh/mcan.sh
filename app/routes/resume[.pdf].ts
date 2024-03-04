import type { LoaderFunctionArgs } from "@remix-run/node";
import { chromium } from "playwright";
import { cacheHeader } from "pretty-cache-header";

export async function loader({ request }: LoaderFunctionArgs) {
	let url = new URL(request.url);

	let resume_url = new URL("resume", url.origin);

	let browser = await chromium.launch();
	let page = await browser.newPage();
	await page.goto(resume_url.toString());

	let pdf = await page.pdf({
		tagged: true,
		margin: "0",
		printBackground: true
	});
	await browser.close();

	return new Response(pdf, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": "inline; filename=resume.pdf",
			"Cache-Control": cacheHeader({
				private: true
			}),
		},
	});
}
