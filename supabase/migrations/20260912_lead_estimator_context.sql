ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS estimator_project_type text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS estimator_design_level text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS estimator_area numeric;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS estimator_estimated_min numeric;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS estimator_estimated_max numeric;
