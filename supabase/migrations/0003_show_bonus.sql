-- Toggles independientes para secciones bonus.
-- DEFAULT false: opt-in. Los datos no se borran al desactivar, solo se ocultan en la UI.

alter table public.profiles
  add column if not exists show_bonus_coca_cola boolean not null default false;

alter table public.profiles
  add column if not exists show_bonus_mcdonalds boolean not null default false;

-- IMPORTANTE: agregar p.show_bonus_coca_cola y p.show_bonus_mcdonalds al SELECT
-- de la vista public_album_stats en Supabase Dashboard → SQL Editor manualmente,
-- ya que la vista no esta versionada en migraciones.
