-- Pricing Engine V1.2
-- Adds the Basic package rate while preserving existing estimator data and V1.1 market adjustment.

ALTER TABLE public.estimator_settings
  ADD COLUMN IF NOT EXISTS basic_rate numeric NOT NULL DEFAULT 22500;

COMMENT ON COLUMN public.estimator_settings.basic_rate IS
  'Baseline customer-facing Basic package rate per m². Intended for entry/prarencana scope and remains admin-configurable.';
