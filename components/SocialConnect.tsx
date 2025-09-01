'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface SocialConnectProps {
  className?: string;
}

export function SocialConnect({ className }: SocialConnectProps) {
  const [connections, setConnections] = useState({
    spotify: false,
    instagram: false
  });

  const handleConnect = (platform: 'spotify' | 'instagram') => {
    // Simulate connection process
    setConnections(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">🔗</span>
          Connect Your Accounts
        </CardTitle>
        <CardDescription>
          Link your social accounts to discover more about yourself through your digital footprint
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Spotify Connection */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Spotify</h4>
              <p className="text-sm text-gray-600">
                {connections.spotify ? 'Connected' : 'Analyze your music taste and mood patterns'}
              </p>
            </div>
          </div>
          <Button
            variant={connections.spotify ? 'secondary' : 'default'}
            size="sm"
            onClick={() => handleConnect('spotify')}
          >
            {connections.spotify ? 'Disconnect' : 'Connect'}
          </Button>
        </div>

        {/* Instagram Connection */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Instagram</h4>
              <p className="text-sm text-gray-600">
                {connections.instagram ? 'Connected' : 'Understand your visual preferences and social patterns'}
              </p>
            </div>
          </div>
          <Button
            variant={connections.instagram ? 'secondary' : 'default'}
            size="sm"
            onClick={() => handleConnect('instagram')}
          >
            {connections.instagram ? 'Disconnect' : 'Connect'}
          </Button>
        </div>

        {(connections.spotify || connections.instagram) && (
          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Great! Your accounts are connected</h4>
                <p className="text-sm text-blue-700 mt-1">
                  We'll analyze your data to provide deeper insights in your next assessment. All data is processed securely and remains private.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
