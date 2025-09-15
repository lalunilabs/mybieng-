# MyBeing Platform - Production Deployment Guide

## Environment Variables Setup

### Required Environment Variables

Copy `.env.example` to `.env.local` and configure the following variables:

```bash
# Core Application
NEXT_PUBLIC_SITE_NAME=mybeing
NEXT_PUBLIC_DOMAIN=https://yourdomain.com

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secure-random-string-here

# Admin Authentication
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
ADMIN_SESSION_TIMEOUT=86400

# Owner Access
OWNER_EMAIL=your-admin-email@domain.com

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Payment Processing
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# AI Services
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4

# Email Service
EMAIL_PROVIDER=sendgrid
EMAIL_API_KEY=your_email_api_key_here
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=MyBeing Self-Discovery

# Security
UNSUBSCRIBE_SECRET=your-unsubscribe-secret-here

# Optional: Monitoring
SENTRY_DSN=your_sentry_dsn_here
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Optional: Caching
REDIS_URL=redis://your-redis-instance:6379

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### Generating Secure Secrets

Use these commands to generate secure random strings:

```bash
# For NEXTAUTH_SECRET and ADMIN_JWT_SECRET
openssl rand -base64 32

# For UNSUBSCRIBE_SECRET
openssl rand -hex 32
```

## Production Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Database schema deployed
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] Email service tested
- [ ] Payment webhooks configured
- [ ] Admin user created
- [ ] Backup strategy implemented

### Security Hardening
- [ ] Remove demo credentials from production
- [ ] Enable HTTPS only
- [ ] Configure CORS policies
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Configure CSP policies
- [ ] Set up monitoring alerts

### Performance Optimization
- [ ] CDN configured for static assets
- [ ] Database connection pooling
- [ ] Redis caching enabled
- [ ] Image optimization configured
- [ ] Gzip compression enabled
- [ ] Bundle size optimized

## Admin User Setup

### Creating the First Admin User

1. Set the `OWNER_EMAIL` environment variable to your email
2. The system will automatically grant admin access to this email
3. Use the admin login page at `/admin/login`

### Admin Permissions

The system supports three admin roles:
- **super_admin**: Full system access
- **admin**: Content and user management
- **moderator**: Content moderation only

## Monitoring & Maintenance

### Health Checks
- Database connectivity: `/api/health/db`
- Redis connectivity: `/api/health/redis`
- External services: `/api/health/services`

### Log Monitoring
- Application logs via Sentry
- Server logs via hosting provider
- Database performance logs
- Payment processing logs

### Backup Strategy
- Daily automated database backups
- Weekly full system backups
- Monthly disaster recovery tests
- Backup retention: 30 days

## Troubleshooting

### Common Issues

**Admin login not working**
- Verify `ADMIN_JWT_SECRET` is set
- Check `OWNER_EMAIL` matches your login email
- Ensure HTTPS is properly configured

**Payment processing errors**
- Verify Stripe keys are correct
- Check webhook endpoint configuration
- Ensure webhook secret matches

**Email delivery issues**
- Verify email service API keys
- Check DNS records for domain
- Test with email service provider tools

**Database connection errors**
- Verify Supabase credentials
- Check connection limits
- Monitor database performance

## Support

For deployment assistance:
- Technical Documentation: `/docs/`
- Email Support: tech@mybeing.com
- Emergency Contact: Available in admin dashboard
