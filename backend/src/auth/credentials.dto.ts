import { z } from 'nestjs-zod/z';

const credentialScheme = z.object({
  login: z.string().min(5),
  password: z.string().min(5),
});

export type Credential = z.infer<typeof credentialScheme>;
