# ATELIER Architecture Studio — V4 Production Launch

Next.js + Supabase architecture website with protected CRM/admin studio, portfolio CMS, production security controls and SEO deployment setup.

## V4 included
- V3 CRM/admin, audit log, pagination, export CSV/Excel, portfolio CMS.
- Middleware session refresh and production security headers.
- Supabase Storage `portfolio` bucket for direct admin image upload.
- Storage RLS: public read, staff-only upload/update/delete in their own folder.
- Cloudflare Turnstile on the public lead form with mandatory server-side Siteverify validation when configured.
- Atomic Supabase rate limiting for public lead submissions.
- Google Search Console verification metadata.
- Dynamic sitemap including published portfolio project URLs.
- JSON-LD ProfessionalService structured data.
- GitHub Actions CI: typecheck, build and dependency audit.
- Production security checklist.

## Local setup
1. Extract the project.
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill the values.
4. Run `supabase/schema.sql` in Supabase SQL Editor.
5. Create an admin user in Supabase Authentication and insert its UUID into `public.profiles`.
6. Create a Cloudflare Turnstile widget for your production hostname and set its sitekey/secret.
7. `npm run check`
8. `npm run dev`

## GitHub → Vercel
Create a GitHub repository and push this folder. In Vercel, import that repository. Configure these environment variables in Vercel Production (and Preview if desired):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET`
- `TURNSTILE_REQUIRED=true`
- `TURNSTILE_HOSTNAME`
- `RATE_LIMIT_SALT`
- `LEAD_RATE_LIMIT_PER_MINUTE=5`

Never add `TURNSTILE_SECRET` or a Supabase service-role key to `NEXT_PUBLIC_*` variables.

## Custom domain
After Vercel deploys the project, add the production domain in the Vercel project Domains settings, complete the DNS records Vercel provides, then set `NEXT_PUBLIC_SITE_URL` to the final HTTPS canonical URL and redeploy.

## Google Search Console
1. Add the production property using the final domain/URL.
2. Verify ownership. If using HTML-tag verification, put the provided token in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
3. Open `/sitemap.xml` on production and submit that sitemap in Search Console.
4. Inspect the homepage and important project URLs after deployment.

## Supabase Storage
The SQL migration creates a public `portfolio` bucket limited to image MIME types and 5 MB. Admin/editor users upload from the Portfolio CMS. Uploaded paths are scoped to the authenticated user's UUID.

## Final security audit
Run:
- `npm run typecheck`
- `npm run build`
- `npm run security:audit`

Then verify in production: HTTPS, HSTS, RLS, admin authorization, Turnstile rejection without a valid token, lead rate limiting, storage policies, no service-role key in client bundles, and Search Console sitemap discovery.
