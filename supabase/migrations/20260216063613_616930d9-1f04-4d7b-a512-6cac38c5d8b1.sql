
-- Add input validation constraints to contact_submissions
ALTER TABLE public.contact_submissions
ADD CONSTRAINT contact_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT contact_name_length CHECK (length(name) BETWEEN 1 AND 200),
ADD CONSTRAINT contact_email_length CHECK (length(email) BETWEEN 5 AND 255),
ADD CONSTRAINT contact_subject_length CHECK (length(subject) BETWEEN 1 AND 500),
ADD CONSTRAINT contact_message_length CHECK (length(message) BETWEEN 1 AND 5000);

-- Add input validation constraints to join_submissions
ALTER TABLE public.join_submissions
ADD CONSTRAINT join_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT join_name_length CHECK (length(name) BETWEEN 1 AND 200),
ADD CONSTRAINT join_email_length CHECK (length(email) BETWEEN 5 AND 255),
ADD CONSTRAINT join_phone_length CHECK (phone IS NULL OR length(phone) BETWEEN 1 AND 30),
ADD CONSTRAINT join_message_length CHECK (message IS NULL OR length(message) BETWEEN 1 AND 5000);
