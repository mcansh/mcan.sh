import type { SSTConfig } from "sst";
import { RemixSite } from "sst/constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import type { SsrDomainProps } from "sst/constructs/SsrSite.js";
import { z } from "zod";

export default {
  config(_input) {
    return {
      name: "website",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      let customDomain: SsrDomainProps | undefined = undefined;

      if (stack.stage === "prod") {
        let envSchema = z.object({
          CLOUDINARY_CLOUD_NAME: z.string(),
          AWS_CERTIFICATE_ARN: z.string(),
          AWS_DOMAIN: z.string(),
        });

        let sst = envSchema.parse(process.env);
        customDomain = {
          isExternalDomain: true,
          domainName: `www.${sst.AWS_DOMAIN}`,
          alternateNames: [sst.AWS_DOMAIN],
          cdk: {
            certificate: Certificate.fromCertificateArn(
              stack,
              "MyCert",
              sst.AWS_CERTIFICATE_ARN
            ),
          },
        };
      }

      let site = new RemixSite(stack, "site", {
        runtime: "nodejs18.x",
        edge: true,
        customDomain,
      });

      stack.addOutputs({ url: site.customDomainUrl || site.url });
    });
  },
} satisfies SSTConfig;
