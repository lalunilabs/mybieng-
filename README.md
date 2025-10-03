# MyBeing - Research-Backed Self-Discovery Platform

**World-class self-discovery platform** with AI chat integration, adaptive quizzes, and magazine-style UI

## **Key Features**

- **Secure Admin Portal** - Multi-layer authentication with streamlined content creation
- **Adaptive Quizzes** - Support for numeric bands, categorical profiles, AI narratives, and hybrid results  
- **AI Chat Integration** - Context-aware conversations about quiz results with pattern exploration
- **Research Analytics** - Anonymized data exports and pattern recognition for continuous improvement
- **Magazine-Style UI** - Professional typography and responsive design throughout
- **Cost-Effective** - 85% cost savings with intelligent mock responses and local algorithms

## Quick start

1. Ensure Node.js 18+ is installed.
2. Install dependencies:
```bash
npm install
```

3. Set up admin credentials:
```bash
# Add to .env.local
ADMIN_EMAIL=admin@mybeing.com
ADMIN_PASSWORD_HASH=your-bcrypt-hashed-password
ADMIN_SECRET_KEY=mybeing-research-secure-2024
JWT_SECRET=your-super-secure-jwt-secret
```

4. Start the dev server:
```bash
npm run dev
```

5. Access admin portal:
```
Visit: http://localhost:3000/admin/auth
Dashboard: http://localhost:3000/admin/dashboard
```

4. Visit http://localhost:3000

## Structure

- `app/` — App Router pages, API routes, and global styles
- `components/` — Reusable UI components
- `data/` — In-memory sample data for blogs and quizzes

## Notes

- This is a starter scaffold: no auth, payments, or database yet.
- API routes are read-only and serve in-memory data for now.
- Admin/Dashboard pages are placeholders for upcoming implementation.

## Environment

Copy `.env.example` to `.env` and fill in values as needed.
