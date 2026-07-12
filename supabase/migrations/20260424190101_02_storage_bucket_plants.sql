-- Bereits angewendet (version 20260424190101).
-- HINWEIS: Die Policies kodieren user_id im Pfadprefix. Fuer das Households-Feature
-- bleibt das bewusst so — Uploads sind weiterhin pro User, Lesen ist public im Bucket.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'plants',
  'plants',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/heic']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "plants_upload_own" on storage.objects;
create policy "plants_upload_own"
  on storage.objects for insert
  with check (
    bucket_id = 'plants'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "plants_update_own" on storage.objects;
create policy "plants_update_own"
  on storage.objects for update
  using (
    bucket_id = 'plants'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "plants_delete_own" on storage.objects;
create policy "plants_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'plants'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "plants_read_all" on storage.objects;
create policy "plants_read_all"
  on storage.objects for select
  using (bucket_id = 'plants');
