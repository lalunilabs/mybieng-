'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { BlogPost } from '@/lib/blog';

interface BlogManagerProps {
  blogs: BlogPost[];
  onCreateBlog: (blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateBlog: (id: string, blog: Partial<BlogPost>) => void;
  onDeleteBlog: (id: string) => void;
  onTogglePublished: (id: string) => void;
}

export function BlogManager({ blogs, onCreateBlog, onUpdateBlog, onDeleteBlog, onTogglePublished }: BlogManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    imageUrl: '',
    published: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const blogData = {
      ...formData,
      slug: generateSlug(formData.title),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      authorId: 'admin',
      author: 'MyBeing Research',
      publishedAt: new Date(),
      readTime: Math.ceil(formData.content.split(' ').length / 200)
    };

    if (editingId) {
      onUpdateBlog(editingId, blogData);
      setEditingId(null);
    } else {
      onCreateBlog(blogData);
      setIsCreating(false);
    }

    setFormData({
      title: '',
      excerpt: '',
      content: '',
      tags: '',
      imageUrl: '',
      published: false
    });
  };

  const handleEdit = (blog: BlogPost) => {
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      tags: blog.tags.join(', '),
      imageUrl: blog.imageUrl || '',
      published: blog.published
    });
    setEditingId(blog.id);
    setIsCreating(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        
        if (result.success) {
          setFormData(prev => ({ ...prev, imageUrl: result.imageUrl }));
        } else {
          alert('Upload failed: ' + result.error);
        }
      } catch (error) {
        alert('Upload failed: ' + error);
      }
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div className="space-y-6">
      {/* Create/Edit Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
            <CardDescription>
              {editingId ? 'Update your blog post details' : 'Add a new blog post to your platform'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="psychology, self-awareness, research"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Image
                  </Button>
                  {formData.imageUrl && (
                    <span className="text-sm text-gray-600">
                      Image selected: {formData.imageUrl.split('/').pop()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-3">
                <Button type="submit">
                  {editingId ? 'Update Post' : 'Create Post'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    setFormData({
                      title: '',
                      excerpt: '',
                      content: '',
                      tags: '',
                      imageUrl: '',
                      published: false
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Create Button */}
      {!isCreating && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Blog Posts</h3>
          <Button onClick={() => setIsCreating(true)}>
            <span className="mr-2">✍️</span>
            New Blog Post
          </Button>
        </div>
      )}

      {/* Blog Posts List */}
      <div className="space-y-4">
        {blogs.map((blog) => (
          <Card key={blog.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{blog.title}</CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      blog.published 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <CardDescription>{blog.excerpt}</CardDescription>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>📅 {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Not published'}</span>
                    <span>🏷️ {blog.tags.join(', ')}</span>
                    {blog.imageUrl && <span>🖼️ Has image</span>}
                  </div>
                </div>
                {blog.imageUrl && (
                  <div className="ml-4 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🖼️</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEdit(blog)}
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onTogglePublished(blog.id)}
                >
                  {blog.published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteBlog(blog.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {blogs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600 mb-4">Create your first blog post to get started</p>
            <Button onClick={() => setIsCreating(true)}>
              Create First Post
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
