import type { SSTConfig } from "sst";
import { RemixSite } from "sst/constructs";

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
      });
      stack.addOutputs({ url: site.url });
    });
  },
} satisfies SSTConfig;
