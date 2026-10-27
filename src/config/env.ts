import { z } from 'zod'

// The only file allowed to read process.env. Parsing at module load means a
// missing variable crashes at boot rather than at the first request.
export const env = z
  .object({
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    CORS_ORIGIN: z.string().url(),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    SHOPIFY_STORE_DOMAIN: z.string().min(1),
    SHOPIFY_ADMIN_TOKEN: z.string().min(1),
    SHOPIFY_API_VERSION: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().min(1),
    GEMINI_API_KEY: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    R2_ACCOUNT_ID: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    R2_BUCKET: z.string().min(1),
    R2_PUBLIC_BASE_URL: z.string().url(),
    PROMPT_FILE_KEY: z.string().regex(/^[0-9a-f]{64}$/, 'Expected 32 bytes as 64 hex characters'),
  })
  .parse(process.env)
