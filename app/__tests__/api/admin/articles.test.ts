import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, DELETE } from '@/app/api/admin/articles/route';
import { deleteArticle, loadArticleBySlug, loadAllArticles, saveArticle } from '@/lib/content';
import { v4 as uuidv4 } from 'uuid';

// Mock the modules
jest.mock('@/lib/content');
jest.mock('@/lib/rate-limit');
jest.mock('@/lib/adminAuth');
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Mock the URL class
const mockURL = {
  searchParams: new URLSearchParams(),
  toString: () => 'http://localhost/api/admin/articles',
};

// Mock the request object
const createMockRequest = (method: string, body?: any, searchParams?: URLSearchParams) => {
  const params = new URLSearchParams(searchParams);
  const queryString = params.toString();
  const baseUrl = 'http://localhost/api/admin/articles';
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  
  return {
    method,
    json: async () => body || {},
    headers: new Headers({ 'content-type': 'application/json' }),
    nextUrl: {
      searchParams: params,
      toString: () => url,
    },
    url,
  } as unknown as NextRequest;
};

describe('Admin Articles API', () => {
  // Create a fixed date for consistent testing
  const testDate = new Date('2023-01-01T00:00:00.000Z');
  
  const mockArticle = {
    id: uuidv4(),
    title: 'Test Article',
    slug: 'test-article',
    excerpt: 'Test excerpt',
    content: 'Test content',
    author: 'Test Author',
    publishedAt: testDate.toISOString(),
    tags: ['test'],
    readTime: 5,
    published: true,
    isPremium: false,
    likes: 0,
  };


  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock isAdminRequest to return true by default
    jest.spyOn(require('@/lib/adminAuth'), 'isAdminRequest').mockReturnValue(true);
    
    // Mock loadAllArticles to return test data
    (loadAllArticles as jest.Mock).mockReturnValue([{
      ...mockArticle,
      toJSON: () => ({
        ...mockArticle,
        publishedAt: mockArticle.publishedAt, // Already in ISO string format
      }),
    }]);
    
    // Mock saveArticle to return the input with proper formatting
    (saveArticle as jest.Mock).mockImplementation((input) => ({
      ...input,
      id: input.id || uuidv4(),
      publishedAt: input.publishedAt, // Keep as is (should already be ISO string)
    }));
    
    // Mock loadArticleBySlug for DELETE test
    (loadArticleBySlug as jest.Mock).mockImplementation((slug) => ({
      ...mockArticle,
      slug,
      objectID: 'test-article-id', // Add objectID for Algolia
    }));
    
    // Mock deleteArticle
    (deleteArticle as jest.Mock).mockResolvedValue(true);
    
    // Mock global.fetch for Algolia API calls
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve('OK'),
      })
    ) as jest.Mock;
  });

  describe('GET /api/admin/articles', () => {
    it('should return 401 if not authenticated', async () => {
      // Mock isAdminRequest to return false for this test
      jest.spyOn(require('@/lib/adminAuth'), 'isAdminRequest').mockReturnValue(false);
      
      const req = createMockRequest('GET');
      const response = await GET(req);
      expect(response.status).toBe(401);
    });

    it('should return list of articles', async () => {
      const mockArticles = [mockArticle];
      (loadAllArticles as jest.Mock).mockReturnValue(mockArticles);
      
      // Mock isAdminRequest to return true
      jest.spyOn(require('@/lib/adminAuth'), 'isAdminRequest').mockReturnValue(true);
      
      const req = createMockRequest('GET');
      const response = await GET(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.items)).toBe(true);
      expect(data.data.items[0].title).toBe(mockArticle.title);
    });
  });

  describe('POST /api/admin/articles', () => {
    it('should create a new article', async () => {
      const newArticle = { ...mockArticle, id: undefined };
      jest.spyOn(require('@/lib/adminAuth'), 'isAdminRequest').mockReturnValue(true);
      
      const req = createMockRequest('POST', newArticle);
      const response = await POST(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.message).toBe('Article saved successfully');
      expect(data.data.slug).toBe(newArticle.slug);
    });
  });

  describe('DELETE /api/admin/articles', () => {
    it('should delete an article', async () => {
      const slug = 'test-article';
      const searchParams = new URLSearchParams();
      searchParams.set('slug', slug);
      
      // Mock the deleteArticle function to return true
      (deleteArticle as jest.Mock).mockResolvedValueOnce(true);
      
      const req = createMockRequest('DELETE', undefined, searchParams);
      
      const response = await DELETE(req);
      const data = await response.json();
      
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.message).toBe('Article deleted successfully');
      expect(deleteArticle).toHaveBeenCalledWith(slug);
    });
    
    it('should return 400 if slug is missing', async () => {
      const req = createMockRequest('DELETE');
      const response = await DELETE(req);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Slug is required');
    });
  });
});
