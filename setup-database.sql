-- Create database tables for MyBeing platform
-- Run this in Supabase SQL Editor

-- Create User table (if not exists via Prisma)
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create QuizRun table
CREATE TABLE IF NOT EXISTS "QuizRun" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id TEXT NOT NULL,
    user_id TEXT REFERENCES "User"(id) ON DELETE SET NULL,
    quiz_slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total INTEGER NOT NULL,
    band_label TEXT NOT NULL,
    metadata TEXT,
    completed BOOLEAN DEFAULT false
);

-- Create QuizAnswer table
CREATE TABLE IF NOT EXISTS "QuizAnswer" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    run_id TEXT NOT NULL REFERENCES "QuizRun"(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    value INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Newsletter table
CREATE TABLE IF NOT EXISTS "Newsletter" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    source TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Create Feedback table
CREATE TABLE IF NOT EXISTS "Feedback" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    type TEXT NOT NULL, -- 'bug', 'feature', 'general'
    message TEXT NOT NULL,
    email TEXT,
    metadata TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Analytics table
CREATE TABLE IF NOT EXISTS "Analytics" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event TEXT NOT NULL,
    data TEXT,
    session_id TEXT,
    user_id TEXT REFERENCES "User"(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Bookmark table
CREATE TABLE IF NOT EXISTS "Bookmark" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT REFERENCES "User"(id) ON DELETE SET NULL,
    session_id TEXT,
    type TEXT NOT NULL, -- 'quiz' or 'article'
    item_id TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Like table
CREATE TABLE IF NOT EXISTS "Like" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT REFERENCES "User"(id) ON DELETE SET NULL,
    session_id TEXT,
    type TEXT NOT NULL, -- 'quiz' or 'article'
    item_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
CREATE INDEX IF NOT EXISTS "QuizRun_session_id_created_at_idx" ON "QuizRun"(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS "QuizRun_quiz_slug_created_at_idx" ON "QuizRun"(quiz_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS "QuizRun_user_id_created_at_idx" ON "QuizRun"(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS "QuizAnswer_run_id_idx" ON "QuizAnswer"(run_id);
CREATE INDEX IF NOT EXISTS "Newsletter_email_idx" ON "Newsletter"(email);
CREATE INDEX IF NOT EXISTS "Newsletter_active_created_at_idx" ON "Newsletter"(active, created_at DESC);
CREATE INDEX IF NOT EXISTS "Feedback_type_status_idx" ON "Feedback"(type, status);
CREATE INDEX IF NOT EXISTS "Feedback_created_at_idx" ON "Feedback"(created_at DESC);
CREATE INDEX IF NOT EXISTS "Analytics_event_created_at_idx" ON "Analytics"(event, created_at DESC);
CREATE INDEX IF NOT EXISTS "Analytics_session_id_idx" ON "Analytics"(session_id);
CREATE INDEX IF NOT EXISTS "Bookmark_user_id_type_idx" ON "Bookmark"(user_id, type);
CREATE INDEX IF NOT EXISTS "Bookmark_session_id_type_idx" ON "Bookmark"(session_id, type);
CREATE INDEX IF NOT EXISTS "Bookmark_type_item_id_idx" ON "Bookmark"(type, item_id);
CREATE INDEX IF NOT EXISTS "Like_user_id_type_idx" ON "Like"(user_id, type);
CREATE INDEX IF NOT EXISTS "Like_session_id_type_idx" ON "Like"(session_id, type);
CREATE INDEX IF NOT EXISTS "Like_type_item_id_idx" ON "Like"(type, item_id);

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "Like_user_type_item_unique" ON "Like"(user_id, type, item_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Like_session_type_item_unique" ON "Like"(session_id, type, item_id) WHERE session_id IS NOT NULL;

-- Insert a test user
INSERT INTO "User" (id, email, name, role) VALUES 
('admin_test', 'admin@mybeing.com', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Verify setup
SELECT 'Database setup complete!' as status, 
       (SELECT COUNT(*) FROM "User") as user_count,
       (SELECT COUNT(*) FROM "QuizRun") as quiz_run_count;
