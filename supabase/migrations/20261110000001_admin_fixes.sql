-- =============================================================================
-- Jelajah — Perbaikan untuk panel admin
-- Migration : 20261110000001_admin_fixes.sql
-- Run in    : Supabase SQL Editor, SETELAH 20261109000001_init.sql
-- Aman dijalankan ulang (idempoten).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Izinkan perubahan role dari jalur tepercaya.
--    Versi lama hanya mengizinkan bila is_admin() bernilai true. Akibatnya:
--      • update role dari SQL Editor gagal (tidak ada auth.uid()), dan
--      • update role dari server memakai service role key juga gagal.
--    auth.uid() IS NULL hanya terjadi pada akses langsung database / service role;
--    request anon tetap tidak bisa mengubah profiles karena diblok RLS.
-- -----------------------------------------------------------------------------
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  if new.role is distinct from old.role then
    raise exception 'You are not permitted to change the role field.'
      using errcode = 'insufficient_privilege';
  end if;

  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- 2. Index tambahan untuk analitik dashboard admin.
-- -----------------------------------------------------------------------------
create index if not exists idx_places_review_count on public.places (review_count desc);
create index if not exists idx_reviews_created     on public.reviews (created_at desc);

-- -----------------------------------------------------------------------------
-- 3. (Opsional) Jadikan akun Anda admin. Ganti email lalu hapus tanda komentar.
-- -----------------------------------------------------------------------------
-- update public.profiles
-- set role = 'admin'
-- where id = (select id from auth.users where email = 'admin@jelajah.id');
