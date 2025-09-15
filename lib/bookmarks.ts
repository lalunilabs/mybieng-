export async function getBookmarks() {
  const response = await fetch('/api/bookmarks', { method: 'GET' });
  if (!response.ok) {
    throw new Error('Failed to fetch bookmarks');
  }
  return response.json();
}

export async function addBookmark(type: 'quiz' | 'article', itemId: string, title: string) {
  const response = await fetch('/api/bookmarks/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, itemId, title }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add bookmark');
  }
  
  return response.json();
}

export async function removeBookmark(bookmarkId: string) {
  const response = await fetch('/api/bookmarks/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookmarkId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove bookmark');
  }
  
  return response.json();
}

export async function isBookmarked(type: 'quiz' | 'article', itemId: string) {
  // This will be handled client-side in the BookmarkButton component
  return false;
}
