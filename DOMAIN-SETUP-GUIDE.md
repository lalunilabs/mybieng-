# MyBeing.in Domain Setup Guide

## 🎉 Congratulations on Securing mybeing.in!

You've successfully purchased the perfect domain for your Personal Health Environment platform. Here's your complete setup guide.

## Current Status
- ✅ Domain purchased from GoDaddy: `mybeing.in`
- ✅ Codebase ready with proper branding
- ✅ Ad positioning optimized for sidebar-only
- 🔄 **Next: Domain configuration and deployment**

## Deployment Options

### Option 1: Netlify (Recommended for Next.js)
**Pros:** Excellent Next.js support, automatic deployments, edge functions
**Current Config:** Already configured in `netlify.toml`

#### Setup Steps:
1. **Connect Repository to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Deploy settings are already configured

2. **Add Custom Domain in Netlify**
   - Go to Site Settings → Domain Management
   - Add custom domain: `mybeing.in`
   - Add `www.mybeing.in` as alias

3. **Configure DNS in GoDaddy**
   ```
   Type: A Record
   Name: @
   Value: 75.2.60.5 (Netlify's load balancer)
   
   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   ```

### Option 2: Vercel (Alternative)
**Pros:** Excellent Next.js integration, global CDN
**Current Config:** Already configured in `vercel.json`

#### Setup Steps:
1. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy with existing configuration

2. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add `mybeing.in` and `www.mybeing.in`

3. **Configure DNS in GoDaddy**
   ```
   Type: A Record
   Name: @
   Value: 76.76.19.61 (Vercel's IP)
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

## GoDaddy DNS Configuration

### Step-by-Step DNS Setup:

1. **Login to GoDaddy**
   - Go to [godaddy.com](https://godaddy.com)
   - Navigate to "My Products" → "DNS"

2. **Configure DNS Records**
   
   **For Netlify:**
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   TTL: 1 Hour
   
   Type: CNAME
   Name: www
   Value: [your-netlify-site].netlify.app
   TTL: 1 Hour
   ```
   
   **For Vercel:**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   TTL: 1 Hour
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 1 Hour
   ```

3. **Additional Records (Optional but Recommended)**
   ```
   Type: TXT
   Name: @
   Value: "v=spf1 include:_spf.google.com ~all"
   Purpose: Email security
   
   Type: MX
   Name: @
   Value: 1 aspmx.l.google.com
   Purpose: Google Workspace (if using Gmail)
   ```

## SSL Certificate Setup

### Automatic SSL (Recommended)
Both Netlify and Vercel provide automatic SSL certificates:
- **Netlify:** Automatically provisions Let's Encrypt certificates
- **Vercel:** Automatic SSL with their global CDN

### Manual SSL (If needed)
If you need custom SSL:
1. Purchase SSL certificate from GoDaddy
2. Configure in your hosting platform
3. Update DNS records if required

## Environment Variables Setup

Update your deployment with production environment variables:

```bash
# Required for production
NEXT_PUBLIC_DOMAIN=https://mybeing.in
NEXT_PUBLIC_ENABLE_ADS=true
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1282817991856264

# Database (if using Supabase)
DATABASE_URL=your_production_database_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Analytics
GOOGLE_ANALYTICS_ID=your_ga_id
GOOGLE_SITE_VERIFICATION=your_verification_code
```

## Post-Deployment Checklist

### Immediate Actions (Day 1)
- [ ] Verify domain resolves to your site
- [ ] Test SSL certificate is working
- [ ] Check all pages load correctly
- [ ] Verify ads are displaying in sidebar only
- [ ] Test mobile responsiveness

### SEO & Analytics (Week 1)
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics
- [ ] Configure Google Search Console
- [ ] Test social media sharing (OpenGraph)
- [ ] Verify structured data is working

### Brand Protection (Month 1)
- [ ] Set up Google Alerts for "MyBeing"
- [ ] Monitor domain for proper branding
- [ ] Check competitor mentions
- [ ] Register social media handles (@mybeing)

## Monitoring & Maintenance

### Performance Monitoring
- **Core Web Vitals:** Monitor via Google PageSpeed Insights
- **Uptime:** Set up monitoring via UptimeRobot or similar
- **Analytics:** Track user engagement and ad performance

### Security
- **SSL Renewal:** Automatic with Netlify/Vercel
- **Security Headers:** Already configured in `netlify.toml`
- **Regular Updates:** Keep dependencies updated

## Troubleshooting Common Issues

### DNS Propagation
- **Issue:** Domain not resolving
- **Solution:** DNS changes can take 24-48 hours to propagate globally
- **Check:** Use [whatsmydns.net](https://whatsmydns.net) to verify propagation

### SSL Certificate Issues
- **Issue:** "Not Secure" warning
- **Solution:** Wait for automatic SSL provisioning (up to 24 hours)
- **Alternative:** Force SSL renewal in hosting platform

### Redirect Issues
- **Issue:** www not redirecting to non-www (or vice versa)
- **Solution:** Configure primary domain in hosting platform settings

## Next Steps After Domain Setup

1. **Content Audit**
   - Review all content for MyBeing PHE branding
   - Update any placeholder content
   - Ensure research-backed messaging is consistent

2. **User Testing**
   - Test quiz functionality on live domain
   - Verify AI chat integration works
   - Check subscription flow

3. **Marketing Launch**
   - Announce the official domain
   - Update any existing links or references
   - Begin SEO optimization campaign

## Support Resources

- **GoDaddy Support:** [godaddy.com/help](https://godaddy.com/help)
- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment:** [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

---

**Ready to launch your Personal Health Environment on mybeing.in! 🚀**

*This guide ensures your domain properly represents MyBeing's mission of empowering individuals through research-backed self-discovery tools.*
