import type { SSTConfig } from "sst";
import { RemixSite } from "sst/constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { z } from "zod";

let config = z.object({
  AWS_DOMAIN: z.string(),
  AWS_CERTIFICATE_ARN: z.string(),
});

let result = config.parse(process.env);

export default {
  config(_input) {
    return {
      name: "website",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      let site = new RemixSite(stack, "site", {
        runtime: "nodejs18.x",
        customDomain:
          stack.stage === "prod"
            ? {
                isExternalDomain: true,
                domainName: `www.${result.AWS_DOMAIN}`,
                alternateNames: [result.AWS_DOMAIN],
                cdk: {
                  certificate: Certificate.fromCertificateArn(
                    stack,
                    "MyCert",
                    result.AWS_CERTIFICATE_ARN
                  ),
                },
              }
            : undefined,
      });
      stack.addOutputs({ url: site.customDomainUrl || site.url });
    });
  },
} satisfies SSTConfig;
