-- Pricing Engine V1.1
-- Dynamic market adjustment is intentionally configurable from the admin estimator panel.
-- Default 0% preserves the current pricing behavior.

ALTER TABLE public.estimator_settings
  ADD COLUMN IF NOT EXISTS market_adjustment_percent numeric NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.estimator_settings.market_adjustment_percent IS
  'Customer-facing market adjustment percentage applied after the core pricing calculation. Default 0 preserves existing pricing.';
