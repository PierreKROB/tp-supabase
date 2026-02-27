-- Ajouter colonne image_url à la table posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Créer un bucket pour les images de posts
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy : Tout le monde peut lire les images
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');

-- Policy : Seuls les utilisateurs connectés peuvent upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images');

-- Policy : Seuls les propriétaires peuvent supprimer leurs images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);
