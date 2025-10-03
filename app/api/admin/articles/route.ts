import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ipRateLimit } from '@/lib/rate-limit';
import { requireAdminAuth } from '@/lib/auth/admin';
import { loadAllArticles, saveArticle, deleteArticle, loadArticleBySlug } from '@/lib/content';
import { articleSchema, type ArticleInput } from '@/lib/validations/article';

// Common headers for all responses
const jsonHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
};

export async function GET(req: NextRequest) {
  try {
    // Rate limiting - 20 requests per minute per IP
    await ipRateLimit.check(req, 20);

    // Authentication
    try {
      await requireAdminAuth(req);
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'Unauthorized',
          code: 'UNAUTHORIZED'
        }), 
        { status: 401, headers: jsonHeaders }
      );
    }

    try {
      const articles = loadAllArticles().map(a => {
        const publishedAt = a.publishedAt instanceof Date 
          ? a.publishedAt.toISOString() 
          : a.publishedAt;
        return {
          ...a,
          publishedAt,
        };
      });

      return new NextResponse(
        JSON.stringify({ 
          success: true, 
          data: { items: articles } 
        }),
        { headers: jsonHeaders }
      );
    } catch (error) {
      console.error('Failed to load articles:', error);
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to load articles',
          code: 'LOAD_ERROR'
        }), 
        { status: 500, headers: jsonHeaders }
      );
    }
  } catch (error: any) {
    // Handle rate limiting errors
    if (error.message?.includes('Rate limit exceeded')) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Please try again later.'
        }), 
        { 
          status: 429, 
          headers: { 
            ...jsonHeaders,
            'Retry-After': '60',
          } 
        }
      );
    }
    
    console.error('Unexpected error in GET /api/admin/articles:', error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      }), 
      { status: 500, headers: jsonHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - 10 requests per minute per IP
    await ipRateLimit.check(req, 10);

    // Authentication
    try {
      await requireAdminAuth(req);
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'Unauthorized',
          code: 'UNAUTHORIZED'
        }), 
        { status: 401, headers: jsonHeaders }
      );
    }

    // Parse and validate request body
    let body: ArticleInput;
    try {
      const json = await req.json();
      // Set default values
      const data = {
        ...json,
        published: json.published ?? true,
        isPremium: json.isPremium ?? false,
        readTime: json.readTime ?? 5,
        tags: Array.isArray(json.tags) ? json.tags : [],
        relatedQuizzes: Array.isArray(json.relatedQuizzes) ? json.relatedQuizzes : [],
        likes: json.likes ?? 0,
      };
      
      body = articleSchema.parse(data);
    } catch (error) {
      console.error('Validation error:', error);
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid request data',
          code: 'VALIDATION_ERROR',
          details: error instanceof z.ZodError ? error.format() : undefined
        }), 
        { status: 400, headers: jsonHeaders }
      );
    }

    try {
      // Save the article (this will also generate an ID if not provided)
      const savedArticle = saveArticle(body);
      
      // Optional: Update Algolia index if configured
      try {
        const appId = process.env.ALGOLIA_APP_ID;
        const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;
        const indexName = process.env.ALGOLIA_INDEX_NAME;
        
        if (appId && adminKey && indexName) {
          const endpoint = `https://${appId}.algolia.net/1/indexes/${encodeURIComponent(indexName)}/${encodeURIComponent('article:' + savedArticle.slug)}`;
          const record = {
            objectID: 'article:' + savedArticle.slug,
            docType: 'article',
            slug: savedArticle.slug,
            title: savedArticle.title,
            excerpt: savedArticle.excerpt || savedArticle.metaDescription || '',
            tags: savedArticle.tags || [],
            imageUrl: savedArticle.imageUrl || '',
            publishedAt: savedArticle.publishedAt,
            published: savedArticle.published,
            isPremium: savedArticle.isPremium,
            readTime: savedArticle.readTime,
            author: savedArticle.author,
          };
          
          const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Algolia-Application-Id': appId,
              'X-Algolia-API-Key': adminKey,
            },
            body: JSON.stringify(record),
          });
          
          if (!response.ok) {
            console.error('Failed to update Algolia index:', await response.text());
          }
        }
      } catch (algoliaError) {
        console.error('Error updating Algolia index:', algoliaError);
        // Continue even if Algolia update fails
      }

      // Revalidate relevant paths so updates show immediately
      try {
        revalidatePath('/blog');
        revalidatePath(`/blog/${savedArticle.slug}`);
        revalidatePath('/sitemap.xml');
        revalidatePath('/rss.xml');
      } catch (revalidateError) {
        console.error('Error revalidating paths:', revalidateError);
      }

      return new NextResponse(
        JSON.stringify({ 
          success: true, 
          data: { 
            slug: savedArticle.slug,
            id: savedArticle.id,
            message: 'Article saved successfully' 
          }
        }),
        { status: 200, headers: jsonHeaders }
      );
    } catch (error) {
      console.error('Failed to save article:', error);
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to save article',
          code: 'SAVE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }), 
        { status: 500, headers: jsonHeaders }
      );
    }
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/articles:', error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      }), 
      { status: 500, headers: jsonHeaders }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Rate limiting - 5 requests per minute per IP
    await ipRateLimit.check(req, 5);

    // Authentication
    try {
      await requireAdminAuth(req);
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'Unauthorized',
          code: 'UNAUTHORIZED'
        }), 
        { status: 401, headers: jsonHeaders }
      );
    }

    // Get and validate slug
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'Slug is required',
          code: 'VALIDATION_ERROR',
          details: { slug: ['Slug is required'] }
        }), 
        { status: 400, headers: jsonHeaders }
      );
    }

    try {
      // Check if article exists
      const article = loadArticleBySlug(slug);
      if (!article) {
        return new NextResponse(
          JSON.stringify({ 
            success: false, 
            error: 'Article not found',
            code: 'NOT_FOUND'
          }), 
          { status: 404, headers: jsonHeaders }
        );
      }

      // Delete the article
      deleteArticle(slug);

      // Optional: Remove from Algolia index
      try {
        const appId = process.env.ALGOLIA_APP_ID;
        const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;
        const indexName = process.env.ALGOLIA_INDEX_NAME;
        
        if (appId && adminKey && indexName) {
          const endpoint = `https://${appId}.algolia.net/1/indexes/${encodeURIComponent(indexName)}/${encodeURIComponent('article:' + slug)}`;
          const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
              'X-Algolia-Application-Id': appId,
              'X-Algolia-API-Key': adminKey,
            },
          });
          
          if (!response.ok) {
            console.error('Failed to remove from Algolia index:', await response.text());
          }
        }
      } catch (algoliaError) {
        console.error('Error removing from Algolia index:', algoliaError);
        // Continue even if Algolia update fails
      }

      // Revalidate relevant paths
      try {
        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);
        revalidatePath('/sitemap.xml');
        revalidatePath('/rss.xml');
      } catch (revalidateError) {
        console.error('Error revalidating paths:', revalidateError);
      }

      return new NextResponse(
        JSON.stringify({ 
          success: true, 
          data: { 
            slug,
            message: 'Article deleted successfully' 
          }
        }),
        { status: 200, headers: jsonHeaders }
      );
    } catch (error) {
      console.error('Failed to delete article:', error);
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to delete article',
          code: 'DELETE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }), 
        { status: 500, headers: jsonHeaders }
      );
    }
  } catch (error: any) {
    // Handle rate limiting errors
    if (error.message?.includes('Rate limit exceeded')) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Please try again later.'
        }), 
        { 
          status: 429, 
          headers: { 
            ...jsonHeaders,
            'Retry-After': '60',
          } 
        }
      );
    }
    
    console.error('Unexpected error in DELETE /api/admin/articles:', error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      }), 
      { status: 500, headers: jsonHeaders }
    );
  }
}

export const dynamic = 'force-dynamic';
