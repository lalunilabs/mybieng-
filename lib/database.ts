import { createClient } from '@supabase/supabase-js';
import { fallbackBlogs, fallbackQuizzes } from '@/lib/fallbackData';

// Database configuration
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'placeholder-key'
);

// Check if we have valid Supabase credentials
const hasValidSupabaseCredentials = () => {
  return process.env.SUPABASE_URL && 
         process.env.SUPABASE_ANON_KEY && 
         process.env.SUPABASE_URL !== 'https://your-project.supabase.co' &&
         process.env.SUPABASE_ANON_KEY !== 'your-supabase-anon-key';
};

// Database types
interface DbBlogPost {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url?: string;
  tags: string[];
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author_id: string;
}

export interface DbQuiz {
  id: string;
  title: string;
  slug: string;
  description: string;
  questions: any[];
  scoring_bands: any[];
  published: boolean;
  created_at: string;
  updated_at: string;
  author_id: string;
  responses: number;
}

export interface DbUserFeedback {
  id: string;
  quiz_id: string;
  user_id: string;
  rating: number;
  comment: string;
  helpful: boolean;
  created_at: string;
}

export interface DbQuizResponse {
  id: string;
  quiz_slug: string;
  session_id: string;
  user_agent: string;
  responses: any[];
  score: number;
  band: string;
  completed_at: string;
}

// Database operations
export class DatabaseService {
  // Blog operations
  static async getAllBlogs(includeUnpublished = false) {
    // Use fallback data if no valid Supabase credentials
    if (!hasValidSupabaseCredentials()) {
      return fallbackBlogs.filter(blog => includeUnpublished || blog.published);
    }
    
    let query = supabase.from('blog_posts').select('*');
    
    if (!includeUnpublished) {
      query = query.eq('published', true);
    }
    
    const { data, error } = await query.order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getBlogBySlug(slug: string) {
    // Use fallback data if no valid Supabase credentials
    if (!hasValidSupabaseCredentials()) {
      return fallbackBlogs.find(blog => blog.slug === slug) || null;
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createBlog(blog: Omit<DbBlogPost, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(blog)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateBlog(id: string, updates: Partial<DbBlogPost>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteBlog(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Quiz operations
  static async getAllQuizzes(includeUnpublished = false) {
    // Use fallback data if no valid Supabase credentials
    if (!hasValidSupabaseCredentials()) {
      return fallbackQuizzes.filter(quiz => includeUnpublished || quiz.published);
    }
    
    let query = supabase.from('quizzes').select('*');
    
    if (!includeUnpublished) {
      query = query.eq('published', true);
    }
    
    const { data, error } = await query.order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getQuizBySlug(slug: string) {
    // Use fallback data if no valid Supabase credentials
    if (!hasValidSupabaseCredentials()) {
      return fallbackQuizzes.find(quiz => quiz.slug === slug && quiz.published) || null;
    }
    
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createQuiz(quiz: Omit<DbQuiz, 'id' | 'created_at' | 'updated_at' | 'responses'>) {
    const { data, error } = await supabase
      .from('quizzes')
      .insert({ ...quiz, responses: 0 })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateQuiz(id: string, updates: Partial<DbQuiz>) {
    const { data, error } = await supabase
      .from('quizzes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteQuiz(id: string) {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Feedback operations
  static async getAllFeedback() {
    // Use fallback data if no valid Supabase credentials
    if (!hasValidSupabaseCredentials()) {
      return [];
    }
    
    const { data, error } = await supabase.from('user_feedback').select('*').order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getFeedbackForQuiz(quizId: string) {
    const { data, error } = await supabase
      .from('user_feedback')
      .select('*')
      .eq('quiz_id', quizId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async addFeedback(feedback: Omit<DbUserFeedback, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('user_feedback')
      .insert(feedback)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteFeedback(id: string) {
    const { error } = await supabase
      .from('user_feedback')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Quiz response operations (for research)
  static async saveQuizResponse(response: Omit<DbQuizResponse, 'id'>) {
    const { data, error } = await supabase
      .from('quiz_responses')
      .insert(response)
      .select()
      .single();
    
    if (error) throw error;
    
    // Increment quiz response count
    await supabase.rpc('increment_quiz_responses', { quiz_slug: response.quiz_slug });
    
    return data;
  }

  static async getQuizAnalytics(quizSlug?: string) {
    let query = supabase.from('quiz_responses').select('*');
    
    if (quizSlug) {
      query = query.eq('quiz_slug', quizSlug);
    }
    
    const { data, error } = await query.order('completed_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Newsletter methods
  static async createNewsletterSubscription(data: { email: string; subscribed_at: string; active: boolean }) {
    // Use fallback for demo (just return success)
    if (!hasValidSupabaseCredentials()) {
      return { id: Date.now().toString(), ...data };
    }
    
    const { data: result, error } = await supabase
      .from('newsletter_subscriptions')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async getNewsletterSubscriptionByEmail(email: string) {
    // Use fallback for demo
    if (!hasValidSupabaseCredentials()) {
      return null;
    }

    const sanitized = email.toLowerCase().trim();
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('email', sanitized)
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error; // ignore not found
    return data || null;
  }

  static async upsertNewsletterSubscription(data: { email: string; subscribed_at?: string; active?: boolean }) {
    // Use fallback for demo (just return provided object with id)
    if (!hasValidSupabaseCredentials()) {
      return { id: Date.now().toString(), subscribed_at: new Date().toISOString(), active: !!data.active, email: data.email };
    }

    const payload = {
      email: data.email.toLowerCase().trim(),
      subscribed_at: data.subscribed_at || new Date().toISOString(),
      active: data.active ?? true,
    };

    const { data: result, error } = await supabase
      .from('newsletter_subscriptions')
      .upsert(payload, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async getNewsletterSubscriptions() {
    // Use fallback for demo
    if (!hasValidSupabaseCredentials()) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('active', true)
      .order('subscribed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async deactivateNewsletterSubscriptionByEmail(email: string) {
    // Use fallback for demo
    if (!hasValidSupabaseCredentials()) {
      return true;
    }

    const sanitized = email.toLowerCase().trim();
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update({ active: false })
      .eq('email', sanitized);

    if (error) throw error;
    return true;
  }

  static async activateNewsletterSubscriptionByEmail(email: string) {
    // Use fallback for demo
    if (!hasValidSupabaseCredentials()) {
      return true;
    }

    const sanitized = email.toLowerCase().trim();
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update({ active: true, subscribed_at: new Date().toISOString() })
      .eq('email', sanitized);

    if (error) throw error;
    return true;
  }
}
