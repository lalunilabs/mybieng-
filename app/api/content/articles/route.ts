import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(req: NextRequest) {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'articles');
    
    if (!fs.existsSync(contentDir)) {
      return NextResponse.json({ articles: [] });
    }

    const files = fs.readdirSync(contentDir)
      .filter(file => file.endsWith('.md') || file.endsWith('.json'));

    const articles = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        if (file.endsWith('.md')) {
          // Markdown article
          const { data: frontmatter, content } = matter(fileContent);
          return {
            slug: file.replace('.md', ''),
            type: 'markdown',
            ...frontmatter,
            content,
            wordCount: content.split(' ').length,
            readTime: Math.ceil(content.split(' ').length / 200)
          };
        } else {
          // JSON article
          const jsonData = JSON.parse(fileContent);
          return {
            slug: file.replace('.json', ''),
            type: 'json',
            ...jsonData,
            wordCount: jsonData.content ? jsonData.content.split(' ').length : 0,
            readTime: jsonData.content ? Math.ceil(jsonData.content.split(' ').length / 200) : 5
          };
        }
      })
    );

    // Sort by publishedAt date, newest first
    articles.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt || 0);
      const dateB = new Date(b.publishedAt || b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json({ 
      articles,
      count: articles.length 
    });

  } catch (error) {
    console.error('Error loading articles:', error);
    return NextResponse.json(
      { error: 'Failed to load articles' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
