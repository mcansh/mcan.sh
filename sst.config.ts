import type { SSTConfig } from "sst";
import { RemixSite } from "sst/constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import type { SsrDomainProps } from "sst/constructs/SsrSite.js";

import { env } from "~/env.server";

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
        customDomain = {
          isExternalDomain: true,
          domainName: `www.${env.AWS_DOMAIN}`,
          alternateNames: [env.AWS_DOMAIN],
          cdk: {
            certificate: Certificate.fromCertificateArn(
              stack,
              "MyCert",
              env.AWS_CERTIFICATE_ARN
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
