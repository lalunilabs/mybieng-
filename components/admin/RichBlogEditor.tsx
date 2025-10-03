'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Eye, 
  Upload, 
  Tag, 
  Calendar,
  User,
  BookOpen,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  Quote,
  Code,
  Heading1,
  Heading2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';

interface ArticleData {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: 'psychology' | 'self-improvement' | 'research' | 'wellness' | 'productivity';
  tags: string[];
  published: boolean;
  isPremium: boolean;
  featured: boolean;
  imageUrl?: string;
  readTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relatedQuizzes: string[];
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

const CATEGORIES = [
  { id: 'psychology', name: 'Psychology', color: 'bg-purple-100 text-purple-700' },
  { id: 'self-improvement', name: 'Self-Improvement', color: 'bg-green-100 text-green-700' },
  { id: 'research', name: 'Research', color: 'bg-blue-100 text-blue-700' },
  { id: 'wellness', name: 'Wellness', color: 'bg-orange-100 text-orange-700' },
  { id: 'productivity', name: 'Productivity', color: 'bg-indigo-100 text-indigo-700' }
];

const TOOLBAR_BUTTONS = [
  { icon: Bold, action: 'bold', label: 'Bold' },
  { icon: Italic, action: 'italic', label: 'Italic' },
  { icon: Heading1, action: 'h1', label: 'Heading 1' },
  { icon: Heading2, action: 'h2', label: 'Heading 2' },
  { icon: List, action: 'list', label: 'List' },
  { icon: Quote, action: 'quote', label: 'Quote' },
  { icon: Code, action: 'code', label: 'Code' },
  { icon: LinkIcon, action: 'link', label: 'Link' }
];

export default function RichBlogEditor() {
  const [article, setArticle] = useState<ArticleData>({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    author: 'Admin',
    category: 'psychology',
    tags: [],
    published: false,
    isPremium: false,
    featured: false,
    readTime: 5,
    difficulty: 'intermediate',
    relatedQuizzes: [],
    seoTitle: '',
    seoDescription: '',
    keywords: []
  });

  const [newTag, setNewTag] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (article.title && !article.slug) {
      const slug = article.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setArticle(prev => ({ ...prev, slug }));
    }
  }, [article.title, article.slug]);

  // Auto-calculate read time
  useEffect(() => {
    const wordCount = article.content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
    setArticle(prev => ({ ...prev, readTime }));
  }, [article.content]);

  const handleAddTag = () => {
    if (newTag.trim() && !article.tags.includes(newTag.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleToolbarAction = (action: string) => {
    // Simple markdown formatting
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let replacement = '';

    switch (action) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'h1':
        replacement = `# ${selectedText || 'Heading 1'}`;
        break;
      case 'h2':
        replacement = `## ${selectedText || 'Heading 2'}`;
        break;
      case 'list':
        replacement = `- ${selectedText || 'List item'}`;
        break;
      case 'quote':
        replacement = `> ${selectedText || 'Quote text'}`;
        break;
      case 'code':
        replacement = `\`${selectedText || 'code'}\``;
        break;
      case 'link':
        replacement = `[${selectedText || 'link text'}](url)`;
        break;
    }

    const newContent = 
      textarea.value.substring(0, start) + 
      replacement + 
      textarea.value.substring(end);
    
    setArticle(prev => ({ ...prev, content: newContent }));
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  const handleSaveArticle = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      });
      
      if (response.ok) {
        alert('Article saved successfully!');
      } else {
        throw new Error('Failed to save article');
      }
    } catch (error) {
      alert('Error saving article. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderMarkdownPreview = (content: string) => {
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-headline font-bold text-gray-900 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-title font-bold text-gray-900 mb-3 mt-6">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-purple-500 pl-4 italic text-gray-600 my-4">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<[h|l|b])(.+)$/gm, '<p class="mb-4">$1</p>');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Editor Panel */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Write Article</h2>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isPreviewMode ? 'Edit' : 'Preview'}
                </Button>
                <Button
                  onClick={handleSaveArticle}
                  disabled={isSaving || !article.title || !article.content}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Article
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Article Metadata */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Article Title
                </label>
                <input
                  type="text"
                  placeholder="Enter compelling article title..."
                  value={article.title}
                  onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-xl font-bold"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={article.category}
                    onChange={(e) => setArticle(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={article.difficulty}
                    onChange={(e) => setArticle(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  placeholder="Brief summary that will appear in article previews..."
                  value={article.excerpt}
                  onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none h-24 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 cursor-pointer hover:bg-purple-200"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                  />
                  <Button onClick={handleAddTag} size="sm">
                    <Tag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            {!isPreviewMode && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Content (Markdown)
                  </label>
                  <div className="flex items-center space-x-1">
                    {TOOLBAR_BUTTONS.map(button => (
                      <Button
                        key={button.action}
                        onClick={() => handleToolbarAction(button.action)}
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        title={button.label}
                      >
                        <button.icon className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                </div>
                <textarea
                  name="content"
                  placeholder="Start writing your article using Markdown formatting..."
                  value={article.content}
                  onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none font-mono text-sm leading-relaxed resize-none"
                  style={{ minHeight: '400px' }}
                />
              </div>
            )}

            {/* Preview Mode */}
            {isPreviewMode && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Article Preview
                </label>
                <div 
                  className="prose-magazine border-2 border-gray-200 rounded-xl p-6 bg-gray-50 min-h-[400px]"
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdownPreview(article.content || 'Start writing to see preview...') 
                  }}
                />
              </div>
            )}

            {/* Article Settings */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing Options</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={article.published}
                    onChange={(e) => setArticle(prev => ({ ...prev, published: e.target.checked }))}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Published</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={article.isPremium}
                    onChange={(e) => setArticle(prev => ({ ...prev, isPremium: e.target.checked }))}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Premium Content</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={article.featured}
                    onChange={(e) => setArticle(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Article</span>
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Preview Panel */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Live Preview</h3>
            
            {/* Magazine-style preview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
              <div className="aspect-video bg-gray-200 relative">
                {article.imageUrl ? (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Featured Image</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-3">
                  <Badge className={CATEGORIES.find(c => c.id === article.category)?.color || 'bg-gray-100 text-gray-700'}>
                    {CATEGORIES.find(c => c.id === article.category)?.name || article.category}
                  </Badge>
                  {article.isPremium && (
                    <Badge className="bg-yellow-100 text-yellow-700">Premium</Badge>
                  )}
                  {article.featured && (
                    <Badge className="bg-red-100 text-red-700">Featured</Badge>
                  )}
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {article.title || 'Your Article Title'}
                </h1>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt || 'Your article excerpt will appear here...'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {article.author}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.readTime} min read
                    </span>
                  </div>
                  <span className="capitalize">{article.difficulty}</span>
                </div>
              </div>
            </div>

            {/* SEO Preview */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-2">SEO Preview</h4>
              <div className="text-sm">
                <div className="text-blue-600 font-medium mb-1">
                  {article.seoTitle || article.title || 'Article Title'}
                </div>
                <div className="text-green-600 text-xs mb-1">
                  mybeing.com/blog/{article.slug || 'article-slug'}
                </div>
                <div className="text-gray-600">
                  {article.seoDescription || article.excerpt || 'Article description...'}
                </div>
              </div>
            </div>

            {/* Article Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{article.content.split(/\s+/).length}</div>
                <div className="text-sm text-gray-600">Words</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{article.readTime}</div>
                <div className="text-sm text-gray-600">Min Read</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
