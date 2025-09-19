#!/usr/bin/env node

/**
 * Article Management Script for MyBeing
 * Usage: node scripts/add-article.js
 * 
 * This script helps you easily add new articles to the MyBeing platform
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

async function createArticle() {
  console.log('\n🚀 MyBeing Article Creator\n');
  
  try {
    const title = await question('Article title: ');
    const excerpt = await question('Brief excerpt (1-2 sentences): ');
    const category = await question('Category (Psychology/Research/Self-Discovery): ');
    const readingTime = await question('Estimated reading time (e.g., "5 min read"): ');
    const tags = await question('Tags (comma-separated): ');
    const isPremium = await question('Is this a premium article? (y/n): ');
    const hasAudio = await question('Will this have audio narration? (y/n): ');
    const isFeatured = await question('Feature this article? (y/n): ');
    
    const slug = slugify(title);
    const publishedAt = getCurrentDate();
    const tagsArray = tags.split(',').map(tag => `"${tag.trim()}"`).join(', ');
    
    const frontmatter = `---
title: "${title}"
slug: "${slug}"
excerpt: "${excerpt}"
author: "Dr. N"
publishedAt: "${publishedAt}"
readingTime: "${readingTime}"
category: "${category}"
tags: [${tagsArray}]
featured: ${isFeatured.toLowerCase() === 'y'}
premium: ${isPremium.toLowerCase() === 'y'}
audioAvailable: ${hasAudio.toLowerCase() === 'y'}
image: "/images/articles/${slug}.jpg"
---

# ${title}

${excerpt}

## Introduction

[Write your introduction here]

## Main Content

[Add your main content sections here]

## Key Takeaways

- [Key point 1]
- [Key point 2]
- [Key point 3]

## Conclusion

[Write your conclusion here]

---

*This article is part of MyBeing's commitment to research-backed self-discovery. All insights are based on peer-reviewed studies and evidence-based practices.*`;

    const filename = `${slug}.md`;
    const filepath = path.join(__dirname, '..', 'content', 'articles', filename);
    
    fs.writeFileSync(filepath, frontmatter);
    
    console.log(`\n✅ Article created successfully!`);
    console.log(`📁 File: content/articles/${filename}`);
    console.log(`🔗 URL: /blog/${slug}`);
    console.log(`\n📝 Next steps:`);
    console.log(`1. Edit the article content in: content/articles/${filename}`);
    console.log(`2. Add an image to: public/images/articles/${slug}.jpg`);
    console.log(`3. Review and publish when ready`);
    
  } catch (error) {
    console.error('Error creating article:', error);
  } finally {
    rl.close();
  }
}

createArticle();
