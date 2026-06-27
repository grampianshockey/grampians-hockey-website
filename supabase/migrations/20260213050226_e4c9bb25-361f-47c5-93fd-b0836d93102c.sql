
-- Fix user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Fix committee_members
DROP POLICY IF EXISTS "Admins can do everything with committee" ON public.committee_members;
DROP POLICY IF EXISTS "Anyone can read committee members" ON public.committee_members;
CREATE POLICY "Admins can do everything with committee" ON public.committee_members FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can read committee members" ON public.committee_members FOR SELECT USING (true);

-- Fix contact_submissions
DROP POLICY IF EXISTS "Admins can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Admins can read contact submissions" ON public.contact_submissions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Fix join_submissions
DROP POLICY IF EXISTS "Admins can read join submissions" ON public.join_submissions;
DROP POLICY IF EXISTS "Admins can update join submissions" ON public.join_submissions;
DROP POLICY IF EXISTS "Anyone can submit join form" ON public.join_submissions;
CREATE POLICY "Admins can read join submissions" ON public.join_submissions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update join submissions" ON public.join_submissions FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can submit join form" ON public.join_submissions FOR INSERT WITH CHECK (true);

-- Fix news_articles
DROP POLICY IF EXISTS "Admins can do everything with news" ON public.news_articles;
DROP POLICY IF EXISTS "Anyone can read published news" ON public.news_articles;
CREATE POLICY "Admins can do everything with news" ON public.news_articles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can read published news" ON public.news_articles FOR SELECT USING (is_published = true);

-- Fix team_info
DROP POLICY IF EXISTS "Admins can do everything with team info" ON public.team_info;
DROP POLICY IF EXISTS "Anyone can read team info" ON public.team_info;
CREATE POLICY "Admins can do everything with team info" ON public.team_info FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can read team info" ON public.team_info FOR SELECT USING (true);

-- Fix upcoming_events
DROP POLICY IF EXISTS "Admins can do everything with events" ON public.upcoming_events;
DROP POLICY IF EXISTS "Anyone can read active events" ON public.upcoming_events;
CREATE POLICY "Admins can do everything with events" ON public.upcoming_events FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can read active events" ON public.upcoming_events FOR SELECT USING (is_active = true);
