
-- Create team_gallery table
CREATE TABLE public.team_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_gallery ENABLE ROW LEVEL SECURITY;

-- Public can view all gallery images
CREATE POLICY "Anyone can view gallery images"
ON public.team_gallery
FOR SELECT
USING (true);

-- Admins can do everything
CREATE POLICY "Admins can manage gallery"
ON public.team_gallery
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) VALUES ('team-gallery', 'team-gallery', true);

-- Public can view files in team-gallery bucket
CREATE POLICY "Anyone can view gallery files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'team-gallery');

-- Admins can upload gallery files
CREATE POLICY "Admins can upload gallery files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'team-gallery' AND public.has_role(auth.uid(), 'admin'));

-- Admins can update gallery files
CREATE POLICY "Admins can update gallery files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'team-gallery' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete gallery files
CREATE POLICY "Admins can delete gallery files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'team-gallery' AND public.has_role(auth.uid(), 'admin'));
