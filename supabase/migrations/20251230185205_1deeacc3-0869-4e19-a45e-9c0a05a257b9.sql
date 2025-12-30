-- Allow INSERT, UPDATE, DELETE on aircraft table (for admin use)
CREATE POLICY "Allow public insert on aircraft"
ON public.aircraft
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update on aircraft"
ON public.aircraft
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete on aircraft"
ON public.aircraft
FOR DELETE
USING (true);

-- Allow INSERT, UPDATE, DELETE on documents table (for admin use)
CREATE POLICY "Allow public insert on documents"
ON public.documents
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update on documents"
ON public.documents
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete on documents"
ON public.documents
FOR DELETE
USING (true);