'use client';

import { useState } from 'react';
import { User, Mail, Calendar, Settings, Bell, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/ui/Label';

interface UserProfileFormProps {
  user: any;
}

export function UserProfileForm({ user }: UserProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    notifications: {
      quizReminders: true,
      newContent: true,
      aiInsights: false
    }
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="bio">About You (Optional)</Label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us a bit about your self-discovery journey..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Quiz Reminders</h4>
              <p className="text-sm text-gray-600">Get reminded to take new quizzes</p>
            </div>
            <input
              type="checkbox"
              checked={formData.notifications.quizReminders}
              onChange={(e) => setFormData({
                ...formData,
                notifications: { ...formData.notifications, quizReminders: e.target.checked }
              })}
              className="rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">New Content</h4>
              <p className="text-sm text-gray-600">Notifications about new articles and quizzes</p>
            </div>
            <input
              type="checkbox"
              checked={formData.notifications.newContent}
              onChange={(e) => setFormData({
                ...formData,
                notifications: { ...formData.notifications, newContent: e.target.checked }
              })}
              className="rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">AI Insights</h4>
              <p className="text-sm text-gray-600">Personalized insights based on your patterns</p>
            </div>
            <input
              type="checkbox"
              checked={formData.notifications.aiInsights}
              onChange={(e) => setFormData({
                ...formData,
                notifications: { ...formData.notifications, aiInsights: e.target.checked }
              })}
              className="rounded"
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">
            Change Password
          </Button>
          <Button variant="outline" className="w-full">
            Download My Data
          </Button>
          <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
