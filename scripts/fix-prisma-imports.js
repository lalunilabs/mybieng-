#!/usr/bin/env node

/**
 * Fix all prisma imports to use safeDbOperation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const filesToFix = [
  'app/api/bookmarks/add/route.ts',
  'app/api/bookmarks/remove/route.ts',
  'app/api/bookmarks/check/route.ts',
  'app/api/bookmarks/route.ts',
  'app/api/likes/add/route.ts',
  'app/api/likes/remove/route.ts',
  'app/api/likes/check/route.ts',
  'app/api/likes/count/route.ts',
  'app/api/runs/route.ts',
  'app/api/runs/export.csv/route.ts',
  'app/api/runs/export/route.ts',
  'app/api/quiz/complete/route.ts'
];

console.log('🔧 Fixing prisma imports...');

filesToFix.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Fix import statement
  if (content.includes("import { prisma } from '@/lib/db';")) {
    content = content.replace(
      "import { prisma } from '@/lib/db';",
      "import { prisma, safeDbOperation } from '@/lib/db';"
    );
    console.log(`✅ Fixed import in ${filePath}`);
  }
  
  // Fix direct prisma calls (simple ones)
  const simplePatterns = [
    {
      from: /await prisma\.(\w+)\.findFirst\(([^}]+}\s*)\);/g,
      to: 'await safeDbOperation(() => prisma!.$1.findFirst($2), null);'
    },
    {
      from: /await prisma\.(\w+)\.findMany\(([^}]+}\s*)\);/g,
      to: 'await safeDbOperation(() => prisma!.$1.findMany($2), []);'
    },
    {
      from: /await prisma\.(\w+)\.count\(([^}]*}\s*)\);/g,
      to: 'await safeDbOperation(() => prisma!.$1.count($2), 0);'
    },
    {
      from: /await prisma\.(\w+)\.create\(([^}]+}\s*)\);/g,
      to: 'await safeDbOperation(() => prisma!.$1.create($2), null);'
    },
    {
      from: /await prisma\.(\w+)\.delete\(([^}]+}\s*)\);/g,
      to: 'await safeDbOperation(() => prisma!.$1.delete($2), null);'
    }
  ];
  
  let changed = false;
  simplePatterns.forEach(pattern => {
    if (pattern.from.test(content)) {
      content = content.replace(pattern.from, pattern.to);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Fixed prisma calls in ${filePath}`);
  }
});

console.log('🎉 All prisma imports fixed!');
