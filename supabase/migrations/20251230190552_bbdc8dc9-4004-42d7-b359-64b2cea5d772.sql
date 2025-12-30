-- Allow public uploads to the documents bucket
CREATE POLICY "Allow public uploads to documents bucket"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'documents');

-- Allow public updates to documents bucket
CREATE POLICY "Allow public updates to documents bucket"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');

-- Allow public deletes from documents bucket
CREATE POLICY "Allow public deletes from documents bucket"
ON storage.objects
FOR DELETE
USING (bucket_id = 'documents');