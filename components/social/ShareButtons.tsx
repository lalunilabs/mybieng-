'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Twitter, Facebook, Linkedin, Link2, Check, Mail, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  variant?: 'floating' | 'inline' | 'minimal';
}

export function ShareButtons({ url, title, description = '', variant = 'floating' }: ShareButtonsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareOptions = [
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'hover:bg-blue-100 hover:text-blue-600',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'hover:bg-blue-100 hover:text-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'hover:bg-blue-100 hover:text-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'hover:bg-green-100 hover:text-green-600',
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      color: 'hover:bg-gray-100 hover:text-gray-700',
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`
    }
  ];

  const handleShare = (platform: string, shareUrl: string) => {
    window.open(shareUrl, platform, 'width=600,height=400');
    
    // Track share event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'share', {
        method: platform,
        content_type: 'article',
        item_id: url
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2">
        {shareOptions.slice(0, 3).map((option) => (
          <motion.button
            key={option.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare(option.name, option.url)}
            className={`p-2 rounded-lg transition-colors ${option.color}`}
            aria-label={`Share on ${option.name}`}
          >
            {option.icon}
          </motion.button>
        ))}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center justify-center gap-3 py-8">
        <span className="text-sm text-gray-600 font-medium">Share this:</span>
        {shareOptions.map((option) => (
          <motion.button
            key={option.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare(option.name, option.url)}
            className={`p-3 rounded-full bg-white shadow-md transition-all ${option.color}`}
            aria-label={`Share on ${option.name}`}
          >
            {option.icon}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyToClipboard}
          className="p-3 rounded-full bg-white shadow-md transition-all hover:bg-purple-100 hover:text-purple-600"
          aria-label="Copy link"
        >
          {copied ? <Check className="w-5 h-5 text-green-600" /> : <Link2 className="w-5 h-5" />}
        </motion.button>
      </div>
    );
  }

  // Floating variant (default)
  return (
    <>
      {/* Floating share button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center z-40"
        aria-label="Share"
      >
        <Share2 className="w-6 h-6" />
      </motion.button>

      {/* Share menu */}
      <AnimatePresence>
        {showShareMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareMenu(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Share panel */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 z-50"
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
              
              <h3 className="text-xl font-bold mb-4">Share this content</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {shareOptions.map((option) => (
                  <motion.button
                    key={option.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleShare(option.name, option.url);
                      setShowShareMenu(false);
                    }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors hover:bg-gray-50"
                  >
                    <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${option.color}`}>
                      {option.icon}
                    </div>
                    <span className="text-sm text-gray-700">{option.name}</span>
                  </motion.button>
                ))}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    copyToClipboard();
                    setShowShareMenu(false);
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors hover:bg-gray-50"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-purple-100 hover:text-purple-600">
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Link2 className="w-5 h-5" />}
                  </div>
                  <span className="text-sm text-gray-700">Copy Link</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
