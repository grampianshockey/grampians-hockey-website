
-- Role system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- News articles
CREATE TABLE public.news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date date NOT NULL,
  category text NOT NULL,
  excerpt text NOT NULL,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published news" ON public.news_articles
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can do everything with news" ON public.news_articles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Upcoming events
CREATE TABLE public.upcoming_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date date NOT NULL,
  time text,
  location text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.upcoming_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active events" ON public.upcoming_events
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can do everything with events" ON public.upcoming_events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Team info (single-row settings)
CREATE TABLE public.team_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition text NOT NULL DEFAULT 'Division 2',
  team_type text NOT NULL DEFAULT 'Open',
  game_day text NOT NULL DEFAULT 'Sunday',
  venue text NOT NULL DEFAULT 'Prince of Wales Park, Ballarat',
  training_ararat text NOT NULL DEFAULT 'TBA',
  training_ballarat text NOT NULL DEFAULT 'TBA',
  season_year text NOT NULL DEFAULT '2026',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.team_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read team info" ON public.team_info
  FOR SELECT USING (true);
CREATE POLICY "Admins can do everything with team info" ON public.team_info
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Committee members
CREATE TABLE public.committee_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  display_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read committee members" ON public.committee_members
  FOR SELECT USING (true);
CREATE POLICY "Admins can do everything with committee" ON public.committee_members
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Contact submissions
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read contact submissions" ON public.contact_submissions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Join submissions
CREATE TABLE public.join_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  date_of_birth date,
  interest text,
  experience text,
  message text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.join_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit join form" ON public.join_submissions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read join submissions" ON public.join_submissions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update join submissions" ON public.join_submissions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for team_info updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_team_info_updated_at
  BEFORE UPDATE ON public.team_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
