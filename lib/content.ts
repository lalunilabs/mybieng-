import fs from 'fs';
import path from 'path';
import { blogs as seedBlogs, type Blog as SeedBlog } from '@/data/blogs';
import { quizzes as seedQuizzes, type Quiz as SeedQuiz } from '@/data/quizzes';

export type Blog = SeedBlog;
export type Quiz = SeedQuiz;

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles');
const QUIZZES_DIR = path.join(ROOT, 'content', 'quizzes');

function ensureDirs() {
  if (!fs.existsSync(ARTICLES_DIR)) fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  if (!fs.existsSync(QUIZZES_DIR)) fs.mkdirSync(QUIZZES_DIR, { recursive: true });
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJsonFile<T>(filePath: string, data: T) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Articles
export function loadAllArticles(): Blog[] {
  ensureDirs();
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
  const fromFiles: Blog[] = files.map(f => {
    const json = readJsonFile<any>(path.join(ARTICLES_DIR, f));
    if (!json) return null as any;
    return { ...json, publishedAt: new Date(json.publishedAt) } as Blog;
  }).filter(Boolean) as Blog[];

  // Merge with seed, favor file-based entries by slug
  const seen = new Set(fromFiles.map(b => b.slug));
  const merged: Blog[] = [...fromFiles, ...seedBlogs.filter(b => !seen.has(b.slug))];
  return merged;
}

export function loadArticleBySlug(slug: string): Blog | undefined {
  ensureDirs();
  const filePath = path.join(ARTICLES_DIR, `${slug}.json`);
  const json = readJsonFile<any>(filePath);
  if (json) return { ...json, publishedAt: new Date(json.publishedAt) } as Blog;
  // fallback to seed
  return seedBlogs.find(b => b.slug === slug);
}

import { ArticleInput } from '@/lib/validations/article';

export type SaveArticleInput = ArticleInput;

export function saveArticle(input: SaveArticleInput) {
  ensureDirs();
  const slug = input.slug;
  const filePath = path.join(ARTICLES_DIR, `${slug}.json`);
  
  // Ensure required fields have defaults
  const articleData = {
    ...input,
    id: input.id || crypto.randomUUID(),
    author: input.author || 'MyBeing Research',
    readTime: input.readTime || 5,
    published: input.published ?? true,
    isPremium: input.isPremium ?? false,
    likes: input.likes ?? 0,
    tags: input.tags || [],
  };
  
  writeJsonFile(filePath, articleData);
  return articleData;
}

export function deleteArticle(slug: string) {
  ensureDirs();
  const filePath = path.join(ARTICLES_DIR, `${slug}.json`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

// Quizzes
export function loadAllQuizzes(): Quiz[] {
  ensureDirs();
  const files = fs.readdirSync(QUIZZES_DIR).filter(f => f.endsWith('.json'));
  const fromFiles: Quiz[] = files.map(f => readJsonFile<Quiz>(path.join(QUIZZES_DIR, f))).filter(Boolean) as Quiz[];
  const seen = new Set(fromFiles.map(q => q.slug));
  const merged: Quiz[] = [...fromFiles, ...seedQuizzes.filter(q => !seen.has(q.slug))];
  return merged;
}

export function loadQuizBySlug(slug: string): Quiz | undefined {
  ensureDirs();
  const filePath = path.join(QUIZZES_DIR, `${slug}.json`);
  const json = readJsonFile<Quiz>(filePath);
  if (json) return json;
  return seedQuizzes.find(q => q.slug === slug);
}

export function saveQuiz(input: Quiz) {
  ensureDirs();
  const slug = input.slug;
  const filePath = path.join(QUIZZES_DIR, `${slug}.json`);
  writeJsonFile(filePath, input);
}

export function deleteQuiz(slug: string) {
  ensureDirs();
  const filePath = path.join(QUIZZES_DIR, `${slug}.json`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}
