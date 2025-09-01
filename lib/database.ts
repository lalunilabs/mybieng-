import { createClient } from '@supabase/supabase-js';

// Database configuration
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema interfaces
export interface DbBlogPost {
  id: string;
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
    let query = supabase.from('blog_posts').select('*');
    
    if (!includeUnpublished) {
      query = query.eq('published', true);
    }
    
    const { data, error } = await query.order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getBlogBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
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
    let query = supabase.from('quizzes').select('*');
    
    if (!includeUnpublished) {
      query = query.eq('published', true);
    }
    
    const { data, error } = await query.order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getQuizBySlug(slug: string) {
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
    const { data, error } = await supabase
      .from('user_feedback')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
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
}
