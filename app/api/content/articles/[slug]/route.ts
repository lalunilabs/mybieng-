import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const contentDir = path.join(process.cwd(), 'content', 'articles');
    
    // Try both .md and .json extensions
    const mdPath = path.join(contentDir, `${slug}.md`);
    const jsonPath = path.join(contentDir, `${slug}.json`);
    
    let article = null;
    
    if (fs.existsSync(mdPath)) {
      // Load markdown article
      const fileContent = fs.readFileSync(mdPath, 'utf8');
      const { data: frontmatter, content } = matter(fileContent);
      
      article = {
        slug,
        type: 'markdown',
        ...frontmatter,
        content,
        wordCount: content.split(' ').length,
        readTime: Math.ceil(content.split(' ').length / 200),
        // SEO enhancements
        canonicalUrl: frontmatter.canonicalUrl || `/blog/${slug}`,
        ogImage: frontmatter.socialImage || frontmatter.image || `/images/articles/${slug}-og.jpg`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: frontmatter.title,
          description: frontmatter.excerpt || frontmatter.metaDescription,
          image: frontmatter.socialImage || frontmatter.image,
          author: {
            '@type': 'Person',
            name: frontmatter.author || 'Dr. N'
          },
          publisher: {
            '@type': 'Organization',
            name: 'MyBeing',
            logo: '/logo.png'
          },
          datePublished: frontmatter.publishedAt,
          dateModified: frontmatter.updatedAt || frontmatter.publishedAt,
          mainEntityOfPage: `${process.env.NEXT_PUBLIC_DOMAIN}/blog/${slug}`,
          keywords: frontmatter.keywords?.join(', ') || frontmatter.tags?.join(', ')
        }
      };
    } else if (fs.existsSync(jsonPath)) {
      // Load JSON article
      const fileContent = fs.readFileSync(jsonPath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      
      article = {
        slug,
        type: 'json',
        ...jsonData,
        wordCount: jsonData.content ? jsonData.content.split(' ').length : 0,
        readTime: jsonData.content ? Math.ceil(jsonData.content.split(' ').length / 200) : 5,
        // SEO enhancements
        canonicalUrl: `/blog/${slug}`,
        ogImage: jsonData.image || `/images/articles/${slug}-og.jpg`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: jsonData.title,
          description: jsonData.description || jsonData.excerpt,
          image: jsonData.image,
          author: {
            '@type': 'Person',
            name: jsonData.author || 'Dr. N'
          },
          publisher: {
            '@type': 'Organization',
            name: 'MyBeing',
            logo: '/logo.png'
          },
          datePublished: jsonData.publishedAt || jsonData.createdAt,
          mainEntityOfPage: `${process.env.NEXT_PUBLIC_DOMAIN}/blog/${slug}`
        }
      };
    }
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Load related articles
    const allFiles = fs.readdirSync(contentDir)
      .filter(file => (file.endsWith('.md') || file.endsWith('.json')) && !file.startsWith(slug));
    
    const relatedArticles = allFiles.slice(0, 4).map(file => {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      if (file.endsWith('.md')) {
        const { data } = matter(fileContent);
        return {
          slug: file.replace('.md', ''),
          title: data.title,
          excerpt: data.excerpt,
          image: data.image,
          publishedAt: data.publishedAt,
          readTime: data.readingTime || '5 min read'
        };
      } else {
        const jsonData = JSON.parse(fileContent);
        return {
          slug: file.replace('.json', ''),
          title: jsonData.title,
          excerpt: jsonData.description || jsonData.excerpt,
          image: jsonData.image,
          publishedAt: jsonData.publishedAt || jsonData.createdAt,
          readTime: '5 min read'
        };
      }
    });

    return NextResponse.json({
      article,
      relatedArticles
    });

  } catch (error) {
    console.error('Error loading article:', error);
    return NextResponse.json(
      { error: 'Failed to load article' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
