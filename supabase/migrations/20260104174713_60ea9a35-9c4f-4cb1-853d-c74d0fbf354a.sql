-- Create storage bucket for manufacturer logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('manufacturer-logos', 'manufacturer-logos', true);

-- Create RLS policy for public read access
CREATE POLICY "Manufacturer logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'manufacturer-logos');

-- Create RLS policy for public upload (for admin)
CREATE POLICY "Allow public upload to manufacturer logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'manufacturer-logos');

-- Create RLS policy for public delete (for admin)
CREATE POLICY "Allow public delete from manufacturer logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'manufacturer-logos');

-- Create table to store manufacturer logo mappings
CREATE TABLE public.manufacturer_logos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manufacturer TEXT NOT NULL UNIQUE,
  logo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.manufacturer_logos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Manufacturer logos are publicly readable"
ON public.manufacturer_logos FOR SELECT
USING (true);

CREATE POLICY "Allow public insert on manufacturer logos"
ON public.manufacturer_logos FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update on manufacturer logos"
ON public.manufacturer_logos FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete on manufacturer logos"
ON public.manufacturer_logos FOR DELETE
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_manufacturer_logos_updated_at
BEFORE UPDATE ON public.manufacturer_logos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();