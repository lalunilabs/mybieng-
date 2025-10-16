import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { loadArticleBySlug } from '@/lib/content';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const contentDir = path.join(process.cwd(), 'content', 'articles');
    const blogDir = path.join(process.cwd(), 'content', 'blog');
    const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
    
    // Try both .md and .json extensions
    const mdPath = path.join(contentDir, `${slug}.md`);
    const mdBlogPath = path.join(blogDir, `${slug}.md`);
    const jsonPath = path.join(contentDir, `${slug}.json`);
    const jsonBlogPath = path.join(blogDir, `${slug}.json`);
    
    let article = null as any;
    
    if (fs.existsSync(mdPath) || fs.existsSync(mdBlogPath)) {
      // Load markdown article
      const fileContent = fs.readFileSync(fs.existsSync(mdPath) ? mdPath : mdBlogPath, 'utf8');
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
        // Structured fields
        tldr: Array.isArray((frontmatter as any).tldr) ? (frontmatter as any).tldr : ((frontmatter as any).tldr ? [(frontmatter as any).tldr] : []),
        keyIdeas: Array.isArray((frontmatter as any).keyIdeas) ? (frontmatter as any).keyIdeas : (((frontmatter as any).keyIdeas || (frontmatter as any).key_ideas) ? [((frontmatter as any).keyIdeas || (frontmatter as any).key_ideas)] : []),
        frameworks: Array.isArray((frontmatter as any).frameworks) ? (frontmatter as any).frameworks : ((frontmatter as any).frameworks ? [(frontmatter as any).frameworks] : []),
        prompts: Array.isArray((frontmatter as any).prompts) ? (frontmatter as any).prompts : (((frontmatter as any).prompts || (frontmatter as any).reflectionPrompts || (frontmatter as any).reflection_prompts) ? [((frontmatter as any).prompts || (frontmatter as any).reflectionPrompts || (frontmatter as any).reflection_prompts)] : []),
        citations: Array.isArray((frontmatter as any).citations) ? (frontmatter as any).citations : ((frontmatter as any).citations ? [(frontmatter as any).citations] : []),
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
          mainEntityOfPage: `${base}/blog/${slug}`,
          keywords: frontmatter.keywords?.join(', ') || frontmatter.tags?.join(', ')
        }
      };
    } else if (fs.existsSync(jsonPath) || fs.existsSync(jsonBlogPath)) {
      // Load JSON article
      const fileContent = fs.readFileSync(fs.existsSync(jsonPath) ? jsonPath : jsonBlogPath, 'utf8');
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
        // Structured fields
        tldr: Array.isArray(jsonData.tldr) ? jsonData.tldr : (jsonData.tldr ? [jsonData.tldr] : []),
        keyIdeas: Array.isArray(jsonData.keyIdeas) ? jsonData.keyIdeas : (jsonData.keyIdeas ? [jsonData.keyIdeas] : []),
        frameworks: Array.isArray(jsonData.frameworks) ? jsonData.frameworks : (jsonData.frameworks ? [jsonData.frameworks] : []),
        prompts: Array.isArray(jsonData.prompts) ? jsonData.prompts : (jsonData.prompts ? [jsonData.prompts] : []),
        citations: Array.isArray(jsonData.citations) ? jsonData.citations : (jsonData.citations ? [jsonData.citations] : []),
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
          mainEntityOfPage: `${base}/blog/${slug}`
        }
      };
    }
    
    // Fallback to seeded articles if no file-based article is found
    if (!article) {
      const seed = loadArticleBySlug(slug);
      if (seed) {
        const content = seed.content || '';
        article = {
          type: 'seed',
          ...seed,
          // Normalize fields used by the UI
          image: seed.imageUrl,
          wordCount: content ? content.split(' ').length : 0,
          readTime: seed.readTime || (content ? Math.ceil(content.split(' ').length / 200) : 5),
          canonicalUrl: seed.canonicalUrl || `/blog/${slug}`,
          ogImage: seed.ogImage || seed.imageUrl || `/images/articles/${slug}-og.jpg`,
          // Structured fields (seed doesn't have them by default)
          tldr: [],
          keyIdeas: [],
          frameworks: [],
          prompts: [],
          citations: [],
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: seed.title,
            description: seed.metaDescription || seed.excerpt,
            image: seed.ogImage || seed.imageUrl,
            author: { '@type': 'Person', name: seed.author || 'Dr. N' },
            publisher: { '@type': 'Organization', name: 'MyBeing', logo: '/logo.png' },
            datePublished: seed.publishedAt,
            dateModified: seed.publishedAt,
            mainEntityOfPage: `${base}/blog/${slug}`,
            keywords: (seed.keywords && seed.keywords.join(', ')) || (seed.tags && seed.tags.join(', '))
          }
        };
      }

      if (!article) {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }
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
