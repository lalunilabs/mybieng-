'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Brain, Plus, Save, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';

type ContentType = 'blog' | 'quiz' | null;

export function ContentCreator() {
  const [contentType, setContentType] = useState<ContentType>(null);
  const [blogData, setBlogData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    featured: false,
  });

  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: '',
    estimatedTime: 15,
    featured: false,
    questions: [],
  });

  const handleCreateBlog = async () => {
    try {
      const response = await fetch('/api/admin/content/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blogData,
          tags: blogData.tags.split(',').map(tag => tag.trim()),
          author: 'Dr. N',
          publishedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        alert('Blog post created successfully!');
        setBlogData({ title: '', excerpt: '', content: '', tags: '', featured: false });
      } else {
        alert('Failed to create blog post');
      }
    } catch (error) {
      alert('Error creating blog post');
    }
  };

  const handleCreateQuiz = async () => {
    try {
      const response = await fetch('/api/admin/content/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quizData,
          author: 'Dr. N',
          createdAt: new Date().toISOString(),
          researchBased: true,
        }),
      });

      if (response.ok) {
        alert('Quiz created successfully!');
        setQuizData({ title: '', description: '', category: '', estimatedTime: 15, featured: false, questions: [] });
      } else {
        alert('Failed to create quiz');
      }
    } catch (error) {
      alert('Error creating quiz');
    }
  };

  if (!contentType) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-300"
            onClick={() => setContentType('blog')}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Create Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Write research-backed articles and insights for your audience
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-purple-300"
            onClick={() => setContentType('quiz')}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Create Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Design self-discovery assessments and psychological evaluations
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (contentType === 'blog') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Create Blog Post</h2>
          <Button variant="outline" onClick={() => setContentType(null)}>
            Back to Selection
          </Button>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="blog-title">Title</Label>
                <Input
                  id="blog-title"
                  value={blogData.title}
                  onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                  placeholder="Enter blog post title"
                />
              </div>
              <div>
                <Label htmlFor="blog-tags">Tags (comma-separated)</Label>
                <Input
                  id="blog-tags"
                  value={blogData.tags}
                  onChange={(e) => setBlogData({ ...blogData, tags: e.target.value })}
                  placeholder="psychology, self-awareness, research"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="blog-excerpt">Excerpt</Label>
              <Textarea
                id="blog-excerpt"
                value={blogData.excerpt}
                onChange={(e) => setBlogData({ ...blogData, excerpt: e.target.value })}
                placeholder="Brief description of the blog post"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="blog-content">Content (Markdown)</Label>
              <Textarea
                id="blog-content"
                value={blogData.content}
                onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                placeholder="Write your blog post content in Markdown format"
                rows={15}
                className="font-mono"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="blog-featured"
                checked={blogData.featured}
                onChange={(e) => setBlogData({ ...blogData, featured: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="blog-featured">Featured post</Label>
            </div>

            <div className="flex space-x-4">
              <Button onClick={handleCreateBlog} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Create Blog Post
              </Button>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (contentType === 'quiz') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Create Quiz</h2>
          <Button variant="outline" onClick={() => setContentType(null)}>
            Back to Selection
          </Button>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="quiz-title">Quiz Title</Label>
                <Input
                  id="quiz-title"
                  value={quizData.title}
                  onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                  placeholder="Enter quiz title"
                />
              </div>
              <div>
                <Label htmlFor="quiz-category">Category</Label>
                <Input
                  id="quiz-category"
                  value={quizData.category}
                  onChange={(e) => setQuizData({ ...quizData, category: e.target.value })}
                  placeholder="Cognitive Psychology"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="quiz-description">Description</Label>
              <Textarea
                id="quiz-description"
                value={quizData.description}
                onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                placeholder="Describe what this quiz measures and its purpose"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="quiz-time">Estimated Time (minutes)</Label>
                <Input
                  id="quiz-time"
                  type="number"
                  value={quizData.estimatedTime}
                  onChange={(e) => setQuizData({ ...quizData, estimatedTime: parseInt(e.target.value) })}
                  min="5"
                  max="60"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="quiz-featured"
                  checked={quizData.featured}
                  onChange={(e) => setQuizData({ ...quizData, featured: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="quiz-featured">Featured quiz</Label>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Quiz Builder Coming Soon</h3>
              <p className="text-yellow-700 text-sm">
                The interactive quiz builder with question management is currently in development. 
                For now, you can create the basic quiz structure and add questions manually via the JSON files.
              </p>
            </div>

            <div className="flex space-x-4">
              <Button onClick={handleCreateQuiz} className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Create Quiz Structure
              </Button>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
