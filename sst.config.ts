import type { SSTConfig } from "sst";
import { Config, RemixSite } from "sst/constructs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cdk from "aws-cdk-lib";
import * as cf from "aws-cdk-lib/aws-cloudfront";
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
      let CLOUDINARY_CLOUD_NAME = new Config.Secret(
        stack,
        "CLOUDINARY_CLOUD_NAME"
      );

      let customDomain: SsrDomainProps | undefined = undefined;

      if (stack.stage === "prod") {
        let envSchema = z.object({
          AWS_CERTIFICATE_ARN: z.string(),
          AWS_DOMAIN: z.string(),
        });

        let sst = envSchema.parse(process.env);
        customDomain = {
          isExternalDomain: true,
          domainName: `www.${sst.AWS_DOMAIN}`,
          alternateNames: [sst.AWS_DOMAIN],
          cdk: {
            certificate: acm.Certificate.fromCertificateArn(
              stack,
              "MyCert",
              sst.AWS_CERTIFICATE_ARN
            ),
          },
        };
      }

      let serverCachePolicy = new cf.CachePolicy(stack, "ServerCache", {
        queryStringBehavior: cf.CacheQueryStringBehavior.all(),
        headerBehavior: cf.CacheHeaderBehavior.allowList("Vary"),
        cookieBehavior: cf.CacheCookieBehavior.all(),
        defaultTtl: cdk.Duration.days(0),
        maxTtl: cdk.Duration.days(365),
        minTtl: cdk.Duration.days(0),
        enableAcceptEncodingBrotli: true,
        enableAcceptEncodingGzip: true,
      });

      let site = new RemixSite(stack, "site", {
        runtime: "nodejs18.x",
        customDomain,
        bind: [CLOUDINARY_CLOUD_NAME],
        cdk: {
          serverCachePolicy,
        },
      });

      stack.addOutputs({ url: site.customDomainUrl || site.url });
    });
  },
} satisfies SSTConfig;
