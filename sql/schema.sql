-- MyBeing Platform Database Schema
-- Run this in your Supabase SQL editor or PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  author_id TEXT NOT NULL
);

-- Quizzes table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]',
  scoring_bands JSONB NOT NULL DEFAULT '[]',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  author_id TEXT NOT NULL,
  responses INTEGER DEFAULT 0
);

-- User feedback table
CREATE TABLE user_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  helpful BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz responses table (for research and analytics)
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_slug TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_agent TEXT,
  responses JSONB NOT NULL,
  score INTEGER NOT NULL,
  band TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat sessions table (for AI interactions)
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  quiz_title TEXT NOT NULL,
  quiz_slug TEXT NOT NULL,
  analysis JSONB NOT NULL,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published, updated_at DESC);
CREATE INDEX idx_quizzes_slug ON quizzes(slug);
CREATE INDEX idx_quizzes_published ON quizzes(published, updated_at DESC);
CREATE INDEX idx_user_feedback_quiz_id ON user_feedback(quiz_id);
CREATE INDEX idx_quiz_responses_slug ON quiz_responses(quiz_slug);
CREATE INDEX idx_quiz_responses_completed ON quiz_responses(completed_at DESC);
CREATE INDEX idx_chat_sessions_email ON chat_sessions(user_email);

-- Function to increment quiz response count
CREATE OR REPLACE FUNCTION increment_quiz_responses(quiz_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE quizzes 
  SET responses = responses + 1 
  WHERE slug = quiz_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO blog_posts (title, slug, excerpt, content, tags, published, published_at, author_id) VALUES
('Understanding Cognitive Dissonance', 'understanding-cognitive-dissonance', 
 'Explore the psychological phenomenon that affects our daily decisions and self-perception.',
 '# Understanding Cognitive Dissonance

Cognitive dissonance is the mental discomfort experienced when holding contradictory beliefs, values, or attitudes simultaneously...', 
 ARRAY['psychology', 'self-awareness', 'decision-making'], 
 true, NOW(), 'admin'),

('The Science of Self-Reflection', 'science-of-self-reflection',
 'How regular self-reflection can improve your mental health and decision-making abilities.',
 '# The Science of Self-Reflection

Research shows that people who engage in regular self-reflection have better emotional regulation...', 
 ARRAY['research', 'mental-health', 'reflection'], 
 true, NOW(), 'admin');

INSERT INTO quizzes (title, slug, description, questions, scoring_bands, published, author_id) VALUES
('The Mental Tug-of-War', 'cognitive-dissonance',
 'Explore patterns of cognitive dissonance in your daily life and decision-making.',
 '[
   {
     "id": "q1",
     "text": "How often do you find yourself making quick justifications when your actions don''t align with your values?",
     "type": "likert",
     "required": true
   },
   {
     "id": "q2", 
     "text": "When you notice a contradiction between what you believe and what you do, what''s your typical response?",
     "type": "multiple_choice",
     "options": ["I immediately try to change my behavior", "I look for reasons why the situation is different", "I question whether my belief is still valid", "I feel uncomfortable but don''t act on it", "I don''t usually notice these contradictions"],
     "required": true
   }
 ]'::jsonb,
 '[
   {"min": 0, "max": 20, "label": "Low Dissonance", "description": "You tend to maintain consistency between values and actions."},
   {"min": 21, "max": 40, "label": "Moderate Dissonance", "description": "Some tension exists between your beliefs and behaviors."},
   {"min": 41, "max": 60, "label": "High Dissonance", "description": "Frequent conflicts between values and actions may be causing stress."}
 ]'::jsonb,
 true, 'admin'),

('Stress Patterns Check-in', 'stress-patterns',
 'Identify your stress triggers and coping patterns for better self-management.',
 '[
   {
     "id": "q1",
     "text": "How has your sleep quality been over the past week?",
     "type": "likert",
     "required": true
   },
   {
     "id": "q2",
     "text": "What are your most common stress triggers?",
     "type": "multiple_choice", 
     "options": ["Work deadlines and pressure", "Relationship conflicts", "Financial concerns", "Health issues", "Social situations", "Uncertainty about the future"],
     "required": true
   }
 ]'::jsonb,
 '[
   {"min": 0, "max": 15, "label": "Low Stress", "description": "Your stress levels appear manageable."},
   {"min": 16, "max": 30, "label": "Moderate Stress", "description": "Some stress patterns worth monitoring."},
   {"min": 31, "max": 45, "label": "High Stress", "description": "Consider stress management strategies."}
 ]'::jsonb,
 true, 'admin');
