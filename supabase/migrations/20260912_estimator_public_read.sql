-- Public estimator configuration is readable only through the public estimator API.
-- Writes remain blocked by RLS; admin writes use the server-side service role.

create policy "public can read estimator settings"
on public.estimator_settings
for select
to anon, authenticated
using (true);
