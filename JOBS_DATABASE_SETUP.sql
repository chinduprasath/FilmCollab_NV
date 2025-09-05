-- Jobs Database Setup for FilmCollab
-- Run this script in your Supabase SQL Editor

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    job_type VARCHAR(100) NOT NULL,
    experience_level VARCHAR(100) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    salary_range VARCHAR(255),
    skills TEXT,
    description TEXT NOT NULL,
    benefits TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all jobs" ON public.jobs
    FOR SELECT USING (true);

CREATE POLICY "Users can create jobs" ON public.jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs" ON public.jobs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs" ON public.jobs
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON public.jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON public.jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_industry ON public.jobs(industry);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);

-- Insert sample job data
INSERT INTO public.jobs (
    title, company, location, job_type, experience_level, 
    industry, salary_range, skills, description, benefits, user_id
) VALUES
('Senior Cinematographer', 'Netflix Studios', 'Los Angeles, CA', 'Full-time', 'Senior', 'Streaming', '₹80L - ₹1.2Cr', 'Cinematography, Lighting, Camera Operation, Color Grading', 'We''re looking for an experienced cinematographer to join our award-winning team. You''ll work on high-profile series and films with cutting-edge technology.', 'Health Insurance, 401k, Flexible Hours, Remote Options', (SELECT id FROM auth.users LIMIT 1)),
('Film Editor', 'Warner Bros. Pictures', 'Burbank, CA', 'Contract', 'Mid-level', 'Film', '₹55L - ₹85L', 'Video Editing, Avid Media Composer, DaVinci Resolve, Storytelling', 'Join our post-production team working on major motion pictures. Experience with Avid Media Composer and DaVinci Resolve required.', 'Project-based pay, creative freedom, networking opportunities', (SELECT id FROM auth.users LIMIT 1)),
('Sound Engineer', 'Disney Studios', 'Burbank, CA', 'Full-time', 'Mid-level', 'Film', '₹60L - ₹90L', 'Audio Mixing, Pro Tools, Sound Design, Foley', 'Create immersive sound experiences for our blockbuster films. Work with cutting-edge audio technology and collaborate with world-class directors.', 'Health benefits, 401k, creative collaboration, state-of-the-art equipment', (SELECT id FROM auth.users LIMIT 1)),
('Visual Effects Artist', 'Marvel Studios', 'Burbank, CA', 'Full-time', 'Senior', 'Film', '₹90L - ₹1.5Cr', 'VFX, Maya, Nuke, Compositing, Animation', 'Join our award-winning VFX team creating stunning visual effects for the biggest blockbusters in cinema.', 'Competitive salary, stock options, health benefits, unlimited PTO', (SELECT id FROM auth.users LIMIT 1)),
('Production Assistant', 'Independent Films', 'New York, NY', 'Part-time', 'Entry', 'Film', '₹25L - ₹40L', 'Organization, Communication, Problem Solving, Film Production', 'Gain hands-on experience in film production. Assist with daily operations and learn from industry professionals.', 'Learning opportunities, networking, potential full-time offer', (SELECT id FROM auth.users LIMIT 1));

-- Grant permissions
GRANT ALL ON public.jobs TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
