# MyBeing Article Management Guide

## Quick Start: Adding Articles

### Method 1: Using the Article Creator Script
```bash
node scripts/add-article.js
```
This interactive script will guide you through creating a new article with proper frontmatter.

### Method 2: Manual Creation
1. Create a new `.md` file in `content/articles/`
2. Use the template below
3. Replace placeholder content with your article

## Article Template

```markdown
---
title: "Your Article Title"
slug: "your-article-slug"
excerpt: "Brief description that appears in previews and search results"
author: "Dr. N"
publishedAt: "2024-01-15"
readingTime: "5 min read"
category: "Psychology" # Psychology, Research, Self-Discovery
tags: ["tag1", "tag2", "tag3"]
featured: false # true for homepage featured articles
premium: false # true for subscriber-only content
audioAvailable: false # true if audio narration exists
image: "/images/articles/your-slug.jpg"
---

# Your Article Title

Your compelling introduction that hooks the reader...

## Section Headers

Use H2 (##) for main sections and H3 (###) for subsections.

### Key Points
- Use bullet points for easy scanning
- Keep paragraphs concise
- Include actionable insights

## Research Citations

When referencing studies, use this format:
> According to a 2023 study published in the Journal of Cognitive Psychology...

## Conclusion

End with clear takeaways and next steps for readers.

---

*This article is part of MyBeing's commitment to research-backed self-discovery.*
```

## Content Guidelines

### Writing Style
- **Conversational but authoritative**: Write like you're explaining to a smart friend
- **Research-backed**: Include studies and evidence when possible
- **Actionable**: Give readers specific steps they can take
- **Non-judgmental**: Avoid labels or "right/wrong" language

### Article Types

#### 1. Educational Articles (Free)
- Explain psychological concepts
- Share research findings
- Provide general self-awareness tips

#### 2. Premium Articles (Subscriber-only)
- In-depth analysis and research
- Advanced techniques and strategies
- Exclusive insights and case studies

#### 3. Assessment-Related Articles
- Explain specific quiz results
- Help users understand their patterns
- Connect to broader psychological concepts

### SEO Best Practices
- Use descriptive, keyword-rich titles
- Write compelling excerpts (150-160 characters)
- Include relevant tags
- Use proper heading hierarchy (H1 → H2 → H3)

## File Organization

```
content/articles/
├── understanding-cognitive-patterns.md
├── emotional-intelligence-guide.md
├── stress-response-patterns.md
└── [your-new-articles].md
```

## Images
- Add article images to: `public/images/articles/`
- Use format: `your-article-slug.jpg`
- Recommended size: 1200x630px for social sharing
- Include alt text in markdown: `![Alt description](image-path)`

## Publishing Workflow

1. **Create** article using script or template
2. **Write** content following style guidelines
3. **Add** hero image to `/public/images/articles/`
4. **Review** for accuracy and tone
5. **Test** locally to ensure proper rendering
6. **Commit** and push to deploy

## Article Categories

### Psychology
- Cognitive patterns and biases
- Emotional regulation
- Behavioral psychology
- Social psychology concepts

### Research
- Latest studies and findings
- Research methodology explanations
- Evidence-based practices
- Scientific insights

### Self-Discovery
- Personal growth strategies
- Self-awareness techniques
- Assessment interpretations
- Practical applications

## Premium Content Strategy

Premium articles should offer:
- **Deeper insights** than free content
- **Exclusive research** and case studies
- **Advanced techniques** and frameworks
- **Personalized guidance** based on assessment results

## Content Calendar Ideas

### Monthly Themes
- **January**: New Year, New Patterns
- **February**: Relationship Psychology
- **March**: Stress and Resilience
- **April**: Decision-Making Patterns
- **May**: Emotional Intelligence
- **June**: Social Psychology
- **July**: Cognitive Biases
- **August**: Personal Growth
- **September**: Work Psychology
- **October**: Change and Adaptation
- **November**: Gratitude and Mindfulness
- **December**: Reflection and Planning

## Need Help?

- Check existing articles for style examples
- Use the interactive script for guided creation
- Follow the template structure for consistency
- Focus on providing value to readers seeking self-understanding
