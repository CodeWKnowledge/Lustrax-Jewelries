/*
  LUSTRAX STORAGE CONFIGURATION
  
  This file sets up the Supabase Storage buckets and the restricted 
  access policies for product media assets.
*/

-- ==========================================
-- 1. BUCKET INITIALIZATION
-- ==========================================

-- 'product-images': A public-read bucket for hosting product catalog photos.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 2. SECURITY HELPER FUNCTIONS
-- ==========================================

-- Helper to check admin status within storage policies 
-- (Storage logic runs in the 'storage' schema, but needs to check 'public.profiles').
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ==========================================
-- 3. STORAGE POLICIES
-- ==========================================

-- Anyone (even unauthenticated) can view/download images from the public bucket.
CREATE POLICY "Public Read Access to Product Images bucket"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Admins Only: Restrict file uploads to the management team.
CREATE POLICY "Admins can upload Product Images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' AND public.is_admin() );

-- Admins Only: Restrict file replacements/updates to the management team.
CREATE POLICY "Admins can update Product Images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'product-images' AND public.is_admin() );

-- Admins Only: Restrict file deletions to the management team.
CREATE POLICY "Admins can delete Product Images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'product-images' AND public.is_admin() );
