'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  BarChart3,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ContentManagement as ContentData } from '@/types/admin';

interface ContentTableProps {
  content: ContentData[];
  onContentAction: (contentId: string, action: string) => void;
}

function ContentTable({ content, onContentAction }: ContentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'quiz' | 'blog'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      quiz: 'bg-purple-100 text-purple-800',
      blog: 'bg-blue-100 text-blue-800'
    };
    return styles[type as keyof typeof styles] || styles.blog;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle>Content Management</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="quiz">Quizzes</option>
              <option value="blog">Blogs</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Content</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">by {item.author}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadge(item.type)}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">
                      {item.views.toLocaleString()} views
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.engagement}% engagement
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">
                      {item.revenue ? `$${item.revenue.toLocaleString()}` : 'Free'}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">
                      {item.publishedDate ? item.publishedDate.toLocaleDateString() : 'Not published'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {item.createdDate.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onContentAction(item.id, 'view')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onContentAction(item.id, 'edit')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onContentAction(item.id, 'analytics')}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onContentAction(item.id, 'delete')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredContent.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No content found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ContentManagement() {
  const [content, setContent] = useState<ContentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContent: 0,
    publishedContent: 0,
    totalViews: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockContent: ContentData[] = [
      {
        id: '1',
        type: 'blog',
        title: 'The Mental Tug-of-War: Understanding Cognitive Dissonance',
        status: 'published',
        author: 'MyBeing Research',
        createdDate: new Date('2025-01-10'),
        publishedDate: new Date('2025-01-15'),
        views: 2847,
        engagement: 68.2,
        revenue: 0
      },
      {
        id: '2',
        type: 'quiz',
        title: 'Cognitive Dissonance Assessment',
        status: 'published',
        author: 'Dr. MyBeing',
        createdDate: new Date('2025-01-05'),
        publishedDate: new Date('2025-01-12'),
        views: 1923,
        engagement: 84.5,
        revenue: 1847
      },
      {
        id: '3',
        type: 'blog',
        title: 'Advanced Behavioral Pattern Recognition',
        status: 'published',
        author: 'Dr. MyBeing',
        createdDate: new Date('2025-02-05'),
        publishedDate: new Date('2025-02-10'),
        views: 1456,
        engagement: 72.1,
        revenue: 1160
      },
      {
        id: '4',
        type: 'blog',
        title: 'Introducing MyBeing AI: Your Personal Self-Discovery Companion',
        status: 'published',
        author: 'MyBeing Research Team',
        createdDate: new Date('2025-09-01'),
        publishedDate: new Date('2025-09-04'),
        views: 892,
        engagement: 91.3,
        revenue: 0
      },
      {
        id: '5',
        type: 'quiz',
        title: 'Emotional Intelligence Deep Dive',
        status: 'draft',
        author: 'Dr. MyBeing',
        createdDate: new Date('2025-08-28'),
        views: 0,
        engagement: 0,
        revenue: 0
      }
    ];

    setTimeout(() => {
      setContent(mockContent);
      setStats({
        totalContent: mockContent.length,
        publishedContent: mockContent.filter(c => c.status === 'published').length,
        totalViews: mockContent.reduce((sum, c) => sum + c.views, 0),
        totalRevenue: mockContent.reduce((sum, c) => sum + (c.revenue || 0), 0)
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleContentAction = (contentId: string, action: string) => {
    console.log(`Action ${action} for content ${contentId}`);
    // Implement content actions here
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Content Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Content</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalContent}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedContent}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Content Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Create New Quiz
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Write New Blog Post
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Edit className="w-4 h-4 mr-2" />
                Review Drafts
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {content
                .filter(c => c.status === 'published')
                .sort((a, b) => b.views - a.views)
                .slice(0, 3)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.views.toLocaleString()} views
                      </p>
                    </div>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.type === 'quiz' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Content Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-900">Emotional Intelligence Quiz</p>
                  <p className="text-xs text-gray-500">Draft - needs review</p>
                </div>
                <Calendar className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No upcoming scheduled content</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Schedule Content
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Table */}
      <ContentTable content={content} onContentAction={handleContentAction} />
    </div>
  );
}
