-- Create storage bucket for aircraft images
INSERT INTO storage.buckets (id, name, public)
VALUES ('aircraft-images', 'aircraft-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for aircraft images bucket
CREATE POLICY "Aircraft images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'aircraft-images');

CREATE POLICY "Allow public upload to aircraft images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'aircraft-images');

CREATE POLICY "Allow public update to aircraft images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'aircraft-images');

CREATE POLICY "Allow public delete from aircraft images"
ON storage.objects FOR DELETE
USING (bucket_id = 'aircraft-images');