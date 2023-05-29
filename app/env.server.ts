import { z } from "zod";

let envSchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string(),
  AWS_CERTIFICATE_ARN: z.string(),
  AWS_DOMAIN: z.string(),
});

export let env = envSchema.parse(process.env);
