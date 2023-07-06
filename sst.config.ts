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

			if (stack.stage === "prod") {
				let envSchema = z.object({
					AWS_CERTIFICATE_ARN: z.string(),
					AWS_DOMAIN: z.string(),
				});

				let env = envSchema.parse(process.env);

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
				nodejs: { format: "cjs" },
			});

			stack.addOutputs({ url: site.customDomainUrl || site.url });
		});
	},
} satisfies SSTConfig;
