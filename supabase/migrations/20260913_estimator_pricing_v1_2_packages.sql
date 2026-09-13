ALTER TABLE public.estimator_settings
  ADD COLUMN IF NOT EXISTS basic_rate numeric NOT NULL DEFAULT 22500;

COMMENT ON COLUMN public.estimator_settings.basic_rate IS
  'Customer-facing Basic package rate per m². Custom projects do not use an automatic rate.';
