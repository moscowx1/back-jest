import { z } from 'zod';

export const configSchema = z.object({
  dbConnection: z.string(),
  port: z.coerce.number().gt(0).lte(65_535),
  jwtSecret: z.string().min(64),
});

export type Config = z.infer<typeof configSchema>;
