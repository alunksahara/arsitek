# Production Security Checklist

- [ ] Supabase RLS enabled and reviewed for every table.
- [ ] No service-role key is exposed to the browser or `NEXT_PUBLIC_*` variables.
- [ ] Turnstile sitekey/secret configured and production hostname restricted.
- [ ] Lead API rate limiting enabled; `RATE_LIMIT_SALT` is a long random secret.
- [ ] Admin users use strong passwords and MFA where appropriate.
- [ ] Storage bucket only permits staff uploads and image MIME types.
- [ ] Production site uses HTTPS and HSTS.
- [ ] Vercel environment variables are configured separately for Production/Preview as needed.
- [ ] Search Console ownership is verified and `/sitemap.xml` submitted.
- [ ] Domain DNS and canonical `NEXT_PUBLIC_SITE_URL` match the production hostname.
- [ ] `npm audit --omit=dev` is clean or reviewed before release.
