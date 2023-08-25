import type { SSTConfig } from "sst";
import { RemixSite } from "sst/constructs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cf from "aws-cdk-lib/aws-cloudfront";
import type { SsrDomainProps } from "sst/constructs/SsrSite.js";
import { z } from "zod";

export default {
	config(_input) {
		return {
			name: "personal-website",
			region: "us-east-1",
		};
	},
	stacks(app) {
		app.stack(({ stack }) => {
			let customDomain: SsrDomainProps | undefined = undefined;

			let envSchema = z.object({
				CLOUDINARY_CLOUD_NAME: z.string().min(1),
				SENTRY_DSN: z.string().min(1),
				SENTRY_REPORT_URL: z.string().url(),
			});

			let environment = envSchema.parse(process.env);

			if (stack.stage === "prod") {
				let productionEnvSchema = z.object({
					AWS_CERTIFICATE_ARN: z.string(),
					AWS_DOMAIN: z.string(),
				});

				let env = productionEnvSchema.parse(process.env);

				customDomain = {
					isExternalDomain: true,
					domainName: `www.${env.AWS_DOMAIN}`,
					alternateNames: [env.AWS_DOMAIN],
					cdk: {
						certificate: acm.Certificate.fromCertificateArn(
							stack,
							"MyCert",
							env.AWS_CERTIFICATE_ARN,
						),
					},
				};
			}

			let site = new RemixSite(stack, "site", {
				runtime: "nodejs18.x",
				customDomain,
				cdk: { serverCachePolicy: cf.CachePolicy.CACHING_DISABLED },
				nodejs: {
					format: "esm",
					minify: process.env.NODE_ENV === "production",
					sourcemap: true,
				},
				edge: true,
				environment,
			});

			stack.addOutputs({
				url: site.customDomainUrl || site.url || "localhost",
			});
		});
	},
} satisfies SSTConfig;
