-- Create aircraft table
CREATE TABLE public.aircraft (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'commercial',
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aircraft_id UUID REFERENCES public.aircraft(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'manual',
  pdf_url TEXT NOT NULL,
  page_count INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_bookmarks table for optional user features
CREATE TABLE public.user_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, document_id)
);

-- Enable RLS on all tables
ALTER TABLE public.aircraft ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Aircraft and documents are publicly readable (admin-managed library)
CREATE POLICY "Aircraft are publicly readable"
ON public.aircraft FOR SELECT
USING (true);

CREATE POLICY "Documents are publicly readable"
ON public.documents FOR SELECT
USING (true);

-- User bookmarks are private to each user
CREATE POLICY "Users can view their own bookmarks"
ON public.user_bookmarks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
ON public.user_bookmarks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
ON public.user_bookmarks FOR DELETE
USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_aircraft_updated_at
BEFORE UPDATE ON public.aircraft
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true);

-- Create storage policy for public read access
CREATE POLICY "Document files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

-- Seed some sample aircraft data
INSERT INTO public.aircraft (manufacturer, model, type, description, image_url) VALUES
('Boeing', '737-800', 'commercial', 'The Boeing 737-800 is a short to medium-range twinjet narrow-body airliner.', 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800'),
('Boeing', '777-300ER', 'commercial', 'The Boeing 777-300ER is a long-range wide-body twin-engine jet airliner.', 'https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?w=800'),
('Airbus', 'A320neo', 'commercial', 'The Airbus A320neo is a member of the Airbus A320 family of narrow-body airliners.', 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800'),
('Airbus', 'A350-900', 'commercial', 'The Airbus A350 is a long-range, wide-body twin-engine jet airliner.', 'https://images.unsplash.com/photo-1529659644296-1fbb1bca4b58?w=800'),
('Bombardier', 'CRJ-900', 'regional', 'The Bombardier CRJ900 is a regional jet manufactured by Bombardier Aerospace.', 'https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?w=800'),
('Embraer', 'E195-E2', 'regional', 'The Embraer E195-E2 is a narrow-body short to medium-range jet airliner.', 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=800');

-- Seed some sample documents
INSERT INTO public.documents (aircraft_id, title, category, pdf_url, page_count, description)
SELECT 
  a.id,
  'Aircraft Operating Manual - ' || a.manufacturer || ' ' || a.model,
  'manual',
  'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf',
  120,
  'Complete operating manual for the ' || a.manufacturer || ' ' || a.model
FROM public.aircraft a;

INSERT INTO public.documents (aircraft_id, title, category, pdf_url, page_count, description)
SELECT 
  a.id,
  'Quick Reference Handbook - ' || a.manufacturer || ' ' || a.model,
  'quick-reference',
  'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf',
  45,
  'Quick reference guide for normal and emergency procedures'
FROM public.aircraft a;

INSERT INTO public.documents (aircraft_id, title, category, pdf_url, page_count, description)
SELECT 
  a.id,
  'Systems Manual - ' || a.manufacturer || ' ' || a.model,
  'systems',
  'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf',
  200,
  'Detailed systems descriptions and schematics'
FROM public.aircraft a;