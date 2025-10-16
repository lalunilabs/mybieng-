"use strict";(()=>{var e={};e.id=5497,e.ids=[5497],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},84770:e=>{e.exports=require("crypto")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},68621:e=>{e.exports=require("punycode")},76162:e=>{e.exports=require("stream")},17360:e=>{e.exports=require("url")},71568:e=>{e.exports=require("zlib")},91014:(e,t,i)=>{i.r(t),i.d(t,{originalPathname:()=>y,patchFetch:()=>b,requestAsyncStorage:()=>m,routeModule:()=>g,serverHooks:()=>f,staticGenerationAsyncStorage:()=>h});var r={};i.r(r),i.d(r,{GET:()=>p,POST:()=>u});var a=i(49303),s=i(88716),n=i(60670),o=i(87070),l=i(24544),c=i(36119),d=i(35860);async function u(e){try{await d.Yy.check(e,5);let{email:t,source:i="website"}=await e.json();if(!t||"string"!=typeof t)return o.NextResponse.json({error:"Valid email is required"},{status:400});if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(t))return o.NextResponse.json({error:"Please enter a valid email address"},{status:400});let r=t.toLowerCase().trim(),a=r.split("@")[1];if(["tempmail.org","10minutemail.com","guerrillamail.com","mailinator.com"].includes(a))return o.NextResponse.json({error:"Please use a permanent email address"},{status:400});let s="true"===(process.env.NEWSLETTER_DOUBLE_OPT_IN||"").toLowerCase(),n=await l.k.getNewsletterSubscriptionByEmail(r);if(n&&n.active)return o.NextResponse.json({message:"Already subscribed!",confirmed:!0},{status:200});if(s)return await l.k.upsertNewsletterSubscription({email:r,active:!1,subscribed_at:new Date().toISOString()}),(0,c.Gk)(r).then(e=>{e||console.warn("Confirmation email not sent (provider disabled or failed):",r)}).catch(e=>console.warn("Confirmation email threw unexpectedly:",e)),o.NextResponse.json({message:"Please check your email to confirm your subscription.",confirmed:!1},{status:201});return n&&!n.active?await l.k.activateNewsletterSubscriptionByEmail(r):await l.k.upsertNewsletterSubscription({email:r,active:!0,subscribed_at:new Date().toISOString()}),(0,c.QO)(r).then(e=>{e||console.warn("Welcome email not sent (provider disabled or failed):",r)}).catch(e=>console.warn("Welcome email threw unexpectedly:",e)),o.NextResponse.json({message:"Successfully subscribed!",confirmed:!0},{status:201})}catch(e){if(e.message?.includes("Rate limit exceeded"))return o.NextResponse.json({error:"Too many subscription attempts. Please try again later."},{status:429});return console.error("Newsletter subscription error:",e),o.NextResponse.json({error:"Failed to subscribe. Please try again."},{status:500})}}async function p(e){try{let e=await l.k.getNewsletterSubscriptions();return o.NextResponse.json({success:!0,data:e,count:e.length})}catch(e){return o.NextResponse.json({error:"Failed to fetch subscriptions"},{status:500})}}let g=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/newsletter/route",pathname:"/api/newsletter",filename:"route",bundlePath:"app/api/newsletter/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/api/newsletter/route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:m,staticGenerationAsyncStorage:h,serverHooks:f}=g,y="/api/newsletter/route";function b(){return(0,n.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:h})}},24544:(e,t,i)=>{i.d(t,{k:()=>o});var r=i(69498),a=i(58177);process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY;let s=(0,r.eI)(process.env.SUPABASE_URL||"https://placeholder.supabase.co",process.env.SUPABASE_ANON_KEY||"placeholder-key"),n=()=>process.env.SUPABASE_URL&&process.env.SUPABASE_ANON_KEY&&"https://your-project.supabase.co"!==process.env.SUPABASE_URL&&"your-supabase-anon-key"!==process.env.SUPABASE_ANON_KEY;class o{static async getAllBlogs(e=!1){if(!n())return a.QF.filter(t=>e||t.published);let t=s.from("blog_posts").select("*");e||(t=t.eq("published",!0));let{data:i,error:r}=await t.order("updated_at",{ascending:!1});if(r)throw r;return i}static async getBlogBySlug(e){if(!n())return a.QF.find(t=>t.slug===e)||null;let{data:t,error:i}=await s.from("blog_posts").select("*").eq("slug",e).single();if(i)throw i;return t}static async createBlog(e){let{data:t,error:i}=await s.from("blog_posts").insert(e).select().single();if(i)throw i;return t}static async updateBlog(e,t){let{data:i,error:r}=await s.from("blog_posts").update({...t,updated_at:new Date().toISOString()}).eq("id",e).select().single();if(r)throw r;return i}static async deleteBlog(e){let{error:t}=await s.from("blog_posts").delete().eq("id",e);if(t)throw t;return!0}static async getAllQuizzes(e=!1){if(!n())return a.RI.filter(t=>e||t.published);let t=s.from("quizzes").select("*");e||(t=t.eq("published",!0));let{data:i,error:r}=await t.order("updated_at",{ascending:!1});if(r)throw r;return i}static async getQuizBySlug(e){if(!n())return a.RI.find(t=>t.slug===e&&t.published)||null;let{data:t,error:i}=await s.from("quizzes").select("*").eq("slug",e).eq("published",!0).single();if(i)throw i;return t}static async createQuiz(e){let{data:t,error:i}=await s.from("quizzes").insert({...e,responses:0}).select().single();if(i)throw i;return t}static async updateQuiz(e,t){let{data:i,error:r}=await s.from("quizzes").update({...t,updated_at:new Date().toISOString()}).eq("id",e).select().single();if(r)throw r;return i}static async deleteQuiz(e){let{error:t}=await s.from("quizzes").delete().eq("id",e);if(t)throw t;return!0}static async getAllFeedback(){if(!n())return[];let{data:e,error:t}=await s.from("user_feedback").select("*").order("created_at",{ascending:!1});if(t)throw t;return e||[]}static async getFeedbackForQuiz(e){let{data:t,error:i}=await s.from("user_feedback").select("*").eq("quiz_id",e).order("created_at",{ascending:!1});if(i)throw i;return t}static async addFeedback(e){let{data:t,error:i}=await s.from("user_feedback").insert(e).select().single();if(i)throw i;return t}static async deleteFeedback(e){let{error:t}=await s.from("user_feedback").delete().eq("id",e);if(t)throw t;return!0}static async saveQuizResponse(e){let{data:t,error:i}=await s.from("quiz_responses").insert(e).select().single();if(i)throw i;return await s.rpc("increment_quiz_responses",{quiz_slug:e.quiz_slug}),t}static async getQuizAnalytics(e){let t=s.from("quiz_responses").select("*");e&&(t=t.eq("quiz_slug",e));let{data:i,error:r}=await t.order("completed_at",{ascending:!1});if(r)throw r;return i}static async createNewsletterSubscription(e){if(!n())return{id:Date.now().toString(),...e};let{data:t,error:i}=await s.from("newsletter_subscriptions").insert([e]).select().single();if(i)throw i;return t}static async getNewsletterSubscriptionByEmail(e){if(!n())return null;let t=e.toLowerCase().trim(),{data:i,error:r}=await s.from("newsletter_subscriptions").select("*").eq("email",t).limit(1).maybeSingle();if(r&&"PGRST116"!==r.code)throw r;return i||null}static async upsertNewsletterSubscription(e){if(!n())return{id:Date.now().toString(),subscribed_at:new Date().toISOString(),active:!!e.active,email:e.email};let t={email:e.email.toLowerCase().trim(),subscribed_at:e.subscribed_at||new Date().toISOString(),active:e.active??!0},{data:i,error:r}=await s.from("newsletter_subscriptions").upsert(t,{onConflict:"email"}).select().single();if(r)throw r;return i}static async getNewsletterSubscriptions(){if(!n())return[];let{data:e,error:t}=await s.from("newsletter_subscriptions").select("*").eq("active",!0).order("subscribed_at",{ascending:!1});if(t)throw t;return e||[]}static async deactivateNewsletterSubscriptionByEmail(e){if(!n())return!0;let t=e.toLowerCase().trim(),{error:i}=await s.from("newsletter_subscriptions").update({active:!1}).eq("email",t);if(i)throw i;return!0}static async activateNewsletterSubscriptionByEmail(e){if(!n())return!0;let t=e.toLowerCase().trim(),{error:i}=await s.from("newsletter_subscriptions").update({active:!0,subscribed_at:new Date().toISOString()}).eq("email",t);if(i)throw i;return!0}}},36119:(e,t,i)=>{i.d(t,{Gk:()=>n,QO:()=>s,_W:()=>d,gx:()=>a});var r=i(36522);async function a(e){try{let{subject:t,html:i,text:r}=function(e){let{analysis:t,quizTitle:i,completedAt:r}=e,a=`Your ${i} Results - MyBeing Self-Discovery`,s=`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${a}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
    .score-badge { background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 25px; display: inline-block; margin-top: 10px; }
    .insight-card { background: #f8fafc; border-left: 4px solid #7c3aed; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .action-item { background: #ecfdf5; border: 1px solid #d1fae5; padding: 15px; margin: 10px 0; border-radius: 8px; }
    .chat-cta { background: #7c3aed; color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 30px 0; }
    .chat-button { background: white; color: #7c3aed; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600; margin-top: 15px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your ${i} Results</h1>
      <div class="score-badge">
        <strong>${t.band}</strong> • Score: ${t.score}
      </div>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="color: #7c3aed;">Your Personal Analysis</h2>
      <p style="font-size: 16px; background: #faf5ff; padding: 20px; border-radius: 8px; border-left: 4px solid #7c3aed;">
        ${t.personalizedMessage}
      </p>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="color: #7c3aed;">Key Insights</h2>
      ${t.keyInsights.map(e=>`
        <div class="insight-card">
          <h3 style="margin-top: 0; color: #374151;">${e.pattern}</h3>
          <p style="margin-bottom: 10px;">${e.description}</p>
          <p style="margin-bottom: 0; font-weight: 500; color: #059669;">💡 ${e.actionableAdvice}</p>
        </div>
      `).join("")}
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="color: #7c3aed;">Recommended Actions</h2>
      ${t.recommendedActions.map(e=>`
        <div class="action-item">
          <p style="margin: 0;">✓ ${e}</p>
        </div>
      `).join("")}
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="color: #7c3aed;">Next Steps</h2>
      <ul style="padding-left: 20px;">
        ${t.nextSteps.map(e=>`<li style="margin-bottom: 8px;">${e}</li>`).join("")}
      </ul>
    </div>
    
    ${e.chatSessionId?`
    <div class="chat-cta">
      <h3 style="margin-top: 0;">Have Questions About Your Results?</h3>
      <p style="margin-bottom: 0;">Chat with our AI to dive deeper into your insights and get personalized guidance.</p>
      <a href="https://mybeing.com/chat/${e.chatSessionId}" class="chat-button">Start AI Chat Session</a>
    </div>
    `:""}
    
    <div class="footer">
      <p>Completed on ${r.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
      <p>
        <a href="https://mybeing.com" style="color: #7c3aed;">MyBeing</a> • 
        <a href="https://mybeing.com/quizzes" style="color: #7c3aed;">Take Another Quiz</a> • 
        <a href="https://mybeing.com/blog" style="color: #7c3aed;">Read Our Blog</a>
      </p>
      <p style="font-size: 12px; margin-top: 20px;">
        This email contains your personal quiz results. Your privacy is important to us - 
        we don't store your responses on our servers.
      </p>
    </div>
  </div>
</body>
</html>
  `;return{subject:a,html:s,text:`
Your ${i} Results - MyBeing Self-Discovery

Score: ${t.score} - ${t.band}

Personal Analysis:
${t.personalizedMessage}

Key Insights:
${t.keyInsights.map(e=>`
${e.pattern}:
${e.description}
Action: ${e.actionableAdvice}
`).join("\n")}

Recommended Actions:
${t.recommendedActions.map(e=>`• ${e}`).join("\n")}

Next Steps:
${t.nextSteps.map(e=>`• ${e}`).join("\n")}

${e.chatSessionId?`
Have questions? Chat with our AI: https://mybeing.com/chat/${e.chatSessionId}
`:""}

Completed on ${r.toLocaleDateString()}

Visit MyBeing: https://mybeing.com
Take Another Quiz: https://mybeing.com/quizzes
Read Our Blog: https://mybeing.com/blog

Your privacy matters - we don't store your responses on our servers.
  `}}(e);if("sendgrid"===u.provider)return await o(e.userEmail,t,i,r);if("mailgun"===u.provider)return await l(e.userEmail,t,i,r);if("ses"===u.provider)return await c(e.userEmail,t,i,r);return console.log("\uD83D\uDCE7 [DEV MODE] Quiz results email:",{to:e.userEmail,subject:t,quizSlug:e.quizSlug,score:e.analysis.score}),!0}catch(e){return console.error("Failed to send quiz results email:",e),!1}}async function s(e){try{let t="Welcome to MyBeing — Let’s begin your self-discovery",i=(0,r.qm)(e),a="http://localhost:3000",s=`${a}/api/newsletter/unsubscribe?token=${encodeURIComponent(i)}`,n=`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to MyBeing</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .button { background: #7c3aed; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
  </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to MyBeing</h1>
        <p style="margin-bottom:0;">Thanks for subscribing! You’ll get research-backed insights and new self-discovery quizzes.</p>
      </div>
      <p>Here’s what you can do next:</p>
      <ul>
        <li>Take a quiz to get personalized insights</li>
        <li>Read the latest research-backed posts</li>
        <li>Come back weekly to track changes over time</li>
      </ul>
      <p style="text-align:center;margin:28px 0;">
        <a class="button" href="${a}/quizzes">Explore Quizzes</a>
      </p>
      <div class="footer">
        <p>You’ll receive occasional updates only. Your privacy matters.</p>
        <p style="font-size:12px; margin-top:8px;">If this wasn’t you or you no longer wish to receive emails, <a href="${s}" style="color:#6b21a8;">unsubscribe</a>.</p>
      </div>
    </div>
  </body>
  </html>
`,d=`Welcome to MyBeing!

Thanks for subscribing. You’ll receive research-backed insights and self-discovery quizzes.

Get started: ${a}/quizzes
Blog: ${a}/blog

You’ll receive occasional updates. Your privacy matters.

Unsubscribe: ${s}`;if("sendgrid"===u.provider)return await o(e,t,n,d);if("mailgun"===u.provider)return await l(e,t,n,d);if("ses"===u.provider)return await c(e,t,n,d);return console.log("\uD83D\uDCE7 [DEV MODE] Newsletter welcome email:",{to:e,subject:t}),!0}catch(e){return console.error("Failed to send newsletter welcome email:",e),!1}}async function n(e){try{let t="Confirm your subscription to MyBeing",i=(0,r.wf)(e),a="http://localhost:3000",s=`${a}/api/newsletter/confirm?token=${encodeURIComponent(i)}`,n=(0,r.qm)(e),d=`${a}/api/newsletter/unsubscribe?token=${encodeURIComponent(n)}`,p=`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your subscription</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .button { background: #7c3aed; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
  </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Confirm your subscription</h1>
        <p style="margin-bottom:0;">Please confirm to start receiving DID YOUR RESEARCH every 14 days.</p>
      </div>
      <p>Click the button below to confirm your email address:</p>
      <p style="text-align:center;margin:28px 0;">
        <a class="button" href="${s}">Confirm Subscription</a>
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <div class="footer">
        <p>You’ll receive occasional updates only. Your privacy matters.</p>
        <p style="font-size:12px; margin-top:8px;">No longer wish to receive emails? <a href="${d}" style="color:#6b21a8;">unsubscribe</a>.</p>
      </div>
    </div>
  </body>
  </html>
`,g=`Confirm your subscription to MyBeing

Confirm: ${s}

If you did not request this, ignore this email.

Unsubscribe: ${d}`;if("sendgrid"===u.provider)return await o(e,t,p,g);if("mailgun"===u.provider)return await l(e,t,p,g);if("ses"===u.provider)return await c(e,t,p,g);return console.log("\uD83D\uDCE7 [DEV MODE] Newsletter confirm email:",{to:e,subject:t}),!0}catch(e){return console.error("Failed to send newsletter confirmation email:",e),!1}}async function o(e,t,i,r){if(!u.apiKey)throw Error("SendGrid API key not configured");return(await fetch("https://api.sendgrid.com/v3/mail/send",{method:"POST",headers:{Authorization:`Bearer ${u.apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({personalizations:[{to:[{email:e}]}],from:{email:u.fromEmail,name:u.fromName},subject:t,content:[{type:"text/plain",value:r},{type:"text/html",value:i}]})})).ok}async function l(e,t,i,r){if(!u.apiKey)throw Error("Mailgun API key not configured");let a=process.env.MAILGUN_DOMAIN;if(!a)throw Error("Mailgun domain not configured");let s=new FormData;return s.append("from",`${u.fromName} <${u.fromEmail}>`),s.append("to",e),s.append("subject",t),s.append("text",r),s.append("html",i),(await fetch(`https://api.mailgun.net/v3/${a}/messages`,{method:"POST",headers:{Authorization:`Basic ${Buffer.from(`api:${u.apiKey}`).toString("base64")}`},body:s})).ok}async function c(e,t,i,r){throw Error("AWS SES integration not implemented yet")}function d(e){return`${Date.now()}-${Math.random().toString(36).substring(2)}`}let u={provider:process.env.EMAIL_PROVIDER||"sendgrid",apiKey:process.env.EMAIL_API_KEY,fromEmail:process.env.FROM_EMAIL||"noreply@mybeing.com",fromName:process.env.FROM_NAME||"MyBeing Self-Discovery"}},58177:(e,t,i)=>{i.d(t,{QF:()=>r,RI:()=>a});let r=[{id:"1",title:"Understanding Your Cognitive Patterns",slug:"understanding-cognitive-patterns",excerpt:"Discover how your mind processes information and makes decisions through research-backed insights.",content:`# Understanding Your Cognitive Patterns

Cognitive patterns are the mental frameworks that guide how we process information, make decisions, and interpret the world around us. These patterns, developed over years of experience, can either serve us well or hold us back from reaching our full potential.

## What Are Cognitive Patterns?

Cognitive patterns are automatic ways of thinking that our brains use to quickly process information. They include:

- **Attention patterns**: What we notice and what we ignore
- **Processing styles**: How we analyze and organize information  
- **Decision-making frameworks**: The criteria we use to make choices
- **Bias tendencies**: Systematic errors in thinking

## Why Understanding Them Matters

Research shows that people who understand their cognitive patterns are better at:
- Making more objective decisions
- Recognizing when emotions might be clouding judgment
- Adapting their thinking to different situations
- Communicating more effectively with others

Take our Cognitive Patterns Assessment to discover your unique thinking style.`,image_url:"/images/blog/cognitive-patterns.jpg",tags:["psychology","self-awareness","decision-making"],published:!0,published_at:"2024-01-15T00:00:00.000Z",created_at:"2024-01-15T00:00:00.000Z",updated_at:"2024-01-15T00:00:00.000Z",author_id:"dr-n",author:"Dr N",readTime:"8 min read"},{id:"2",title:"The Science of Stress Response",slug:"stress-response-mechanisms",excerpt:"Learn about your body's stress mechanisms and how to develop healthier coping strategies.",content:`# The Science of Stress Response

Stress is an inevitable part of human experience, but understanding how your body and mind respond to stress can be the key to managing it effectively and maintaining your well-being.

## The Physiology of Stress

When you encounter a stressor, your body initiates a complex cascade of physiological responses through the HPA axis (hypothalamic-pituitary-adrenal axis).

## Individual Differences in Stress Response

Research shows significant variation in how people respond to stress based on genetic factors, environmental influences, and personality traits.

Take our Stress Pattern Analysis to identify your personal stress triggers and discover customized strategies.`,image_url:"/images/blog/stress-response.jpg",tags:["wellness","stress-management","health"],published:!0,published_at:"2024-01-10T00:00:00.000Z",created_at:"2024-01-10T00:00:00.000Z",updated_at:"2024-01-10T00:00:00.000Z",author_id:"dr-n",author:"Dr N",readTime:"6 min read"},{id:"3",title:"The Psychology of Behavioral Change",slug:"behavioral-change-psychology",excerpt:"Explore the science behind habit formation and sustainable personal transformation.",content:`# The Psychology of Behavioral Change

Understanding how and why we change our behaviors is crucial for personal growth and achieving our goals. This article explores the psychological mechanisms behind lasting behavioral change.

## The Science of Habit Formation

Habits are formed through a neurological loop consisting of a cue, routine, and reward. Understanding this loop is key to creating positive changes.

## Strategies for Sustainable Change

Research-backed approaches for creating lasting behavioral changes include implementation intentions, environmental design, and social accountability.

Discover your behavioral tendencies with our specialized assessments.`,image_url:"/images/blog/behavioral-change.jpg",tags:["behavior","habits","personal-growth"],published:!0,published_at:"2024-01-05T00:00:00.000Z",created_at:"2024-01-05T00:00:00.000Z",updated_at:"2024-01-05T00:00:00.000Z",author_id:"dr-n",author:"Dr N",readTime:"10 min read"}],a=[{id:"1",title:"Cognitive Dissonance Assessment",slug:"cognitive-dissonance-assessment",description:"Discover how aligned your actions are with your core values and beliefs.",duration:"8-12 minutes",completions:"2.3k+",difficulty:"Beginner",category:"Self-Awareness",published:!0,created_at:"2024-01-01T00:00:00.000Z",updated_at:"2024-01-01T00:00:00.000Z",author_id:"dr-n",responses:2300},{id:"2",title:"Stress Pattern Analysis",slug:"stress-pattern-analysis",description:"Understand your stress triggers and develop personalized coping strategies.",duration:"10-15 minutes",completions:"1.8k+",difficulty:"Intermediate",category:"Wellness",published:!0,created_at:"2024-01-05T00:00:00.000Z",updated_at:"2024-01-05T00:00:00.000Z",author_id:"dr-n",responses:1800},{id:"3",title:"Behavioral Tendencies Quiz",slug:"behavioral-tendencies-quiz",description:"Explore your natural behavioral patterns and decision-making style.",duration:"6-10 minutes",completions:"3.1k+",difficulty:"Beginner",category:"Behavior",published:!0,created_at:"2024-01-10T00:00:00.000Z",updated_at:"2024-01-10T00:00:00.000Z",author_id:"dr-n",responses:3100}]},35860:(e,t,i)=>{i.d(t,{Yy:()=>s});var r=i(10138);function a(e){let t=new r.z({max:e?.uniqueTokenPerInterval||500,ttl:e?.interval||6e4});return{check:(e,i,r)=>{let a=e.ip||"127.0.0.1",s=r||a,n=t.get(s)||[0];n[0]+=1,t.set(s,n);let o=n[0],l=o>i,c=new Headers;if(c.set("X-RateLimit-Limit",i.toString()),c.set("X-RateLimit-Remaining",l?"0":(i-o).toString()),l){let e=Math.ceil((t.getRemainingTTL(s)||0)/1e3);throw c.set("Retry-After",e.toString()),Error(`Rate limit exceeded. Try again in ${e} seconds.`)}return{limit:i,remaining:i-o,success:!0}}}}let s=a({interval:6e4,uniqueTokenPerInterval:500});a({interval:6e4,uniqueTokenPerInterval:1e3})},36522:(e,t,i)=>{i.d(t,{qm:()=>o,r_:()=>l,wf:()=>c,xX:()=>d});var r=i(84770);function a(e){return(Buffer.isBuffer(e)?e:Buffer.from(e,"utf8")).toString("base64").replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function s(e){let t=4-(e.length%4||4),i=e.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat(t%4);return Buffer.from(i,"base64").toString("utf8")}function n(){return process.env.UNSUBSCRIBE_SECRET||process.env.NEXTAUTH_SECRET||"development-secret"}function o(e,t=30){let i=Math.floor(Date.now()/1e3)+86400*t,s=a(e),o=`${s}.${i}`,l=a((0,r.createHmac)("sha256",n()).update(o).digest());return`${s}.${i}.${l}`}function l(e){try{let t=e.split(".");if(3!==t.length)return{valid:!1,reason:"Malformed token"};let[i,o,l]=t,c=parseInt(o,10);if(!c||c<Math.floor(Date.now()/1e3))return{valid:!1,reason:"Token expired"};let d=`${i}.${c}`,u=(0,r.createHmac)("sha256",n()).update(d).digest(),p=a(u);if(!(0,r.timingSafeEqual)(Buffer.from(p),Buffer.from(l)))return{valid:!1,reason:"Invalid signature"};let g=s(i).toLowerCase().trim();return{valid:!0,email:g}}catch(e){return{valid:!1,reason:"Verification error"}}}function c(e,t=7){let i=Math.floor(Date.now()/1e3)+86400*t,s=a(e),o=`confirm:${s}.${i}`,l=a((0,r.createHmac)("sha256",n()).update(o).digest());return`${s}.${i}.${l}`}function d(e){try{let t=e.split(".");if(3!==t.length)return{valid:!1,reason:"Malformed token"};let[i,o,l]=t,c=parseInt(o,10);if(!c||c<Math.floor(Date.now()/1e3))return{valid:!1,reason:"Token expired"};let d=`confirm:${i}.${c}`,u=(0,r.createHmac)("sha256",n()).update(d).digest(),p=a(u);if(!(0,r.timingSafeEqual)(Buffer.from(p),Buffer.from(l)))return{valid:!1,reason:"Invalid signature"};let g=s(i).toLowerCase().trim();return{valid:!0,email:g}}catch(e){return{valid:!1,reason:"Verification error"}}}}};var t=require("../../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),r=t.X(0,[8948,5972,9498,138],()=>i(91014));module.exports=r})();