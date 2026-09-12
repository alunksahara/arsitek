ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS estimator_land_area numeric;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS estimator_floors integer;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS estimator_condition text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS estimator_needs text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS estimator_city text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS estimator_province text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS estimator_timeline text;
