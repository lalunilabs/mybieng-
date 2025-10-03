"use strict";(()=>{var e={};e.id=878,e.ids=[878],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},84770:e=>{e.exports=require("crypto")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},68621:e=>{e.exports=require("punycode")},76162:e=>{e.exports=require("stream")},17360:e=>{e.exports=require("url")},71568:e=>{e.exports=require("zlib")},71894:(e,t,i)=>{i.r(t),i.d(t,{originalPathname:()=>y,patchFetch:()=>b,requestAsyncStorage:()=>m,routeModule:()=>g,serverHooks:()=>f,staticGenerationAsyncStorage:()=>h});var r={};i.r(r),i.d(r,{GET:()=>u});var a=i(49303),n=i(88716),o=i(60670),s=i(87070),l=i(36522),c=i(24544),d=i(36119);function p(e,t,i,r=!1){return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${e}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fafafa; color: #111827; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 10vh auto; background: #fff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); padding: 28px; border: 1px solid #eee; }
    h1 { margin: 0 0 12px; font-size: 24px; color: #111827; }
    p { margin: 10px 0; line-height: 1.6; color: #374151; }
    .ok { color: #065f46; }
    .err { color: #991b1b; }
    a.btn { display: inline-block; margin-top: 18px; padding: 10px 16px; background: #6b21a8; color: #fff; border-radius: 8px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>${t}</h1>
    <p>${i}</p>
    <a class="btn" href="/">Back to Home</a>
  </div>
  ${r?"<script>try{localStorage.setItem('newsletter-subscribed','true')}catch(e){}</script>":""}
</body>
</html>`}async function u(e){let t=new URL(e.url),i=t.searchParams.get("token")||"",r=(e.headers.get("accept")||"").includes("application/json")||"json"===t.searchParams.get("format");if(!i)return r?s.NextResponse.json({success:!1,error:"Missing token"},{status:400}):new s.NextResponse(p("Confirm Subscription - MyBeing","Confirm Subscription",'<span class="err">Missing token.</span>'),{status:400,headers:{"Content-Type":"text/html; charset=utf-8"}});let a=(0,l.xX)(i);if(!a.valid||!a.email)return r?s.NextResponse.json({success:!1,error:a.reason||"Invalid token"},{status:400}):new s.NextResponse(p("Confirm Subscription - MyBeing","Confirm Subscription",`<span class="err">${a.reason||"Invalid token."}</span>`),{status:400,headers:{"Content-Type":"text/html; charset=utf-8"}});try{await c.k.activateNewsletterSubscriptionByEmail(a.email),(0,d.QO)(a.email).catch(e=>console.warn("Welcome email threw unexpectedly after confirm:",e));let e="Subscription confirmed. Welcome to DID YOUR RESEARCH!";if(r)return s.NextResponse.json({success:!0,message:e});return new s.NextResponse(p("Subscription Confirmed - MyBeing","Subscription Confirmed",`<span class="ok">${e}</span>`,!0),{status:200,headers:{"Content-Type":"text/html; charset=utf-8"}})}catch(e){if(r)return s.NextResponse.json({success:!1,error:"Failed to confirm subscription"},{status:500});return new s.NextResponse(p("Confirm Subscription - MyBeing","Confirm Subscription",'<span class="err">Failed to confirm subscription. Please try again later.</span>'),{status:500,headers:{"Content-Type":"text/html; charset=utf-8"}})}}let g=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/newsletter/confirm/route",pathname:"/api/newsletter/confirm",filename:"route",bundlePath:"app/api/newsletter/confirm/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/api/newsletter/confirm/route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:m,staticGenerationAsyncStorage:h,serverHooks:f}=g,y="/api/newsletter/confirm/route";function b(){return(0,o.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:h})}},24544:(e,t,i)=>{i.d(t,{k:()=>s});var r=i(69498),a=i(58177);process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY;let n=(0,r.eI)(process.env.SUPABASE_URL||"https://placeholder.supabase.co",process.env.SUPABASE_ANON_KEY||"placeholder-key"),o=()=>process.env.SUPABASE_URL&&process.env.SUPABASE_ANON_KEY&&"https://your-project.supabase.co"!==process.env.SUPABASE_URL&&"your-supabase-anon-key"!==process.env.SUPABASE_ANON_KEY;class s{static async getAllBlogs(e=!1){if(!o())return a.QF.filter(t=>e||t.published);let t=n.from("blog_posts").select("*");e||(t=t.eq("published",!0));let{data:i,error:r}=await t.order("updated_at",{ascending:!1});if(r)throw r;return i}static async getBlogBySlug(e){if(!o())return a.QF.find(t=>t.slug===e)||null;let{data:t,error:i}=await n.from("blog_posts").select("*").eq("slug",e).single();if(i)throw i;return t}static async createBlog(e){let{data:t,error:i}=await n.from("blog_posts").insert(e).select().single();if(i)throw i;return t}static async updateBlog(e,t){let{data:i,error:r}=await n.from("blog_posts").update({...t,updated_at:new Date().toISOString()}).eq("id",e).select().single();if(r)throw r;return i}static async deleteBlog(e){let{error:t}=await n.from("blog_posts").delete().eq("id",e);if(t)throw t;return!0}static async getAllQuizzes(e=!1){if(!o())return a.RI.filter(t=>e||t.published);let t=n.from("quizzes").select("*");e||(t=t.eq("published",!0));let{data:i,error:r}=await t.order("updated_at",{ascending:!1});if(r)throw r;return i}static async getQuizBySlug(e){if(!o())return a.RI.find(t=>t.slug===e&&t.published)||null;let{data:t,error:i}=await n.from("quizzes").select("*").eq("slug",e).eq("published",!0).single();if(i)throw i;return t}static async createQuiz(e){let{data:t,error:i}=await n.from("quizzes").insert({...e,responses:0}).select().single();if(i)throw i;return t}static async updateQuiz(e,t){let{data:i,error:r}=await n.from("quizzes").update({...t,updated_at:new Date().toISOString()}).eq("id",e).select().single();if(r)throw r;return i}static async deleteQuiz(e){let{error:t}=await n.from("quizzes").delete().eq("id",e);if(t)throw t;return!0}static async getAllFeedback(){if(!o())return[];let{data:e,error:t}=await n.from("user_feedback").select("*").order("created_at",{ascending:!1});if(t)throw t;return e||[]}static async getFeedbackForQuiz(e){let{data:t,error:i}=await n.from("user_feedback").select("*").eq("quiz_id",e).order("created_at",{ascending:!1});if(i)throw i;return t}static async addFeedback(e){let{data:t,error:i}=await n.from("user_feedback").insert(e).select().single();if(i)throw i;return t}static async deleteFeedback(e){let{error:t}=await n.from("user_feedback").delete().eq("id",e);if(t)throw t;return!0}static async saveQuizResponse(e){let{data:t,error:i}=await n.from("quiz_responses").insert(e).select().single();if(i)throw i;return await n.rpc("increment_quiz_responses",{quiz_slug:e.quiz_slug}),t}static async getQuizAnalytics(e){let t=n.from("quiz_responses").select("*");e&&(t=t.eq("quiz_slug",e));let{data:i,error:r}=await t.order("completed_at",{ascending:!1});if(r)throw r;return i}static async createNewsletterSubscription(e){if(!o())return{id:Date.now().toString(),...e};let{data:t,error:i}=await n.from("newsletter_subscriptions").insert([e]).select().single();if(i)throw i;return t}static async getNewsletterSubscriptionByEmail(e){if(!o())return null;let t=e.toLowerCase().trim(),{data:i,error:r}=await n.from("newsletter_subscriptions").select("*").eq("email",t).limit(1).maybeSingle();if(r&&"PGRST116"!==r.code)throw r;return i||null}static async upsertNewsletterSubscription(e){if(!o())return{id:Date.now().toString(),subscribed_at:new Date().toISOString(),active:!!e.active,email:e.email};let t={email:e.email.toLowerCase().trim(),subscribed_at:e.subscribed_at||new Date().toISOString(),active:e.active??!0},{data:i,error:r}=await n.from("newsletter_subscriptions").upsert(t,{onConflict:"email"}).select().single();if(r)throw r;return i}static async getNewsletterSubscriptions(){if(!o())return[];let{data:e,error:t}=await n.from("newsletter_subscriptions").select("*").eq("active",!0).order("subscribed_at",{ascending:!1});if(t)throw t;return e||[]}static async deactivateNewsletterSubscriptionByEmail(e){if(!o())return!0;let t=e.toLowerCase().trim(),{error:i}=await n.from("newsletter_subscriptions").update({active:!1}).eq("email",t);if(i)throw i;return!0}static async activateNewsletterSubscriptionByEmail(e){if(!o())return!0;let t=e.toLowerCase().trim(),{error:i}=await n.from("newsletter_subscriptions").update({active:!0,subscribed_at:new Date().toISOString()}).eq("email",t);if(i)throw i;return!0}}},36119:(e,t,i)=>{i.d(t,{Gk:()=>o,QO:()=>n,_W:()=>d,gx:()=>a});var r=i(36522);async function a(e){try{let{subject:t,html:i,text:r}=function(e){let{analysis:t,quizTitle:i,completedAt:r}=e,a=`Your ${i} Results - MyBeing Self-Discovery`,n=`
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
  `;return{subject:a,html:n,text:`
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
  `}}(e);if("sendgrid"===p.provider)return await s(e.userEmail,t,i,r);if("mailgun"===p.provider)return await l(e.userEmail,t,i,r);if("ses"===p.provider)return await c(e.userEmail,t,i,r);return console.log("\uD83D\uDCE7 [DEV MODE] Quiz results email:",{to:e.userEmail,subject:t,quizSlug:e.quizSlug,score:e.analysis.score}),!0}catch(e){return console.error("Failed to send quiz results email:",e),!1}}async function n(e){try{let t="Welcome to MyBeing — Let’s begin your self-discovery",i=(0,r.qm)(e),a="http://localhost:3000",n=`${a}/api/newsletter/unsubscribe?token=${encodeURIComponent(i)}`,o=`
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
        <p style="font-size:12px; margin-top:8px;">If this wasn’t you or you no longer wish to receive emails, <a href="${n}" style="color:#6b21a8;">unsubscribe</a>.</p>
      </div>
    </div>
  </body>
  </html>
`,d=`Welcome to MyBeing!

Thanks for subscribing. You’ll receive research-backed insights and self-discovery quizzes.

Get started: ${a}/quizzes
Blog: ${a}/blog

You’ll receive occasional updates. Your privacy matters.

Unsubscribe: ${n}`;if("sendgrid"===p.provider)return await s(e,t,o,d);if("mailgun"===p.provider)return await l(e,t,o,d);if("ses"===p.provider)return await c(e,t,o,d);return console.log("\uD83D\uDCE7 [DEV MODE] Newsletter welcome email:",{to:e,subject:t}),!0}catch(e){return console.error("Failed to send newsletter welcome email:",e),!1}}async function o(e){try{let t="Confirm your subscription to MyBeing",i=(0,r.wf)(e),a="http://localhost:3000",n=`${a}/api/newsletter/confirm?token=${encodeURIComponent(i)}`,o=(0,r.qm)(e),d=`${a}/api/newsletter/unsubscribe?token=${encodeURIComponent(o)}`,u=`
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
        <a class="button" href="${n}">Confirm Subscription</a>
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

Confirm: ${n}

If you did not request this, ignore this email.

Unsubscribe: ${d}`;if("sendgrid"===p.provider)return await s(e,t,u,g);if("mailgun"===p.provider)return await l(e,t,u,g);if("ses"===p.provider)return await c(e,t,u,g);return console.log("\uD83D\uDCE7 [DEV MODE] Newsletter confirm email:",{to:e,subject:t}),!0}catch(e){return console.error("Failed to send newsletter confirmation email:",e),!1}}async function s(e,t,i,r){if(!p.apiKey)throw Error("SendGrid API key not configured");return(await fetch("https://api.sendgrid.com/v3/mail/send",{method:"POST",headers:{Authorization:`Bearer ${p.apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({personalizations:[{to:[{email:e}]}],from:{email:p.fromEmail,name:p.fromName},subject:t,content:[{type:"text/plain",value:r},{type:"text/html",value:i}]})})).ok}async function l(e,t,i,r){if(!p.apiKey)throw Error("Mailgun API key not configured");let a=process.env.MAILGUN_DOMAIN;if(!a)throw Error("Mailgun domain not configured");let n=new FormData;return n.append("from",`${p.fromName} <${p.fromEmail}>`),n.append("to",e),n.append("subject",t),n.append("text",r),n.append("html",i),(await fetch(`https://api.mailgun.net/v3/${a}/messages`,{method:"POST",headers:{Authorization:`Basic ${Buffer.from(`api:${p.apiKey}`).toString("base64")}`},body:n})).ok}async function c(e,t,i,r){throw Error("AWS SES integration not implemented yet")}function d(e){return`${Date.now()}-${Math.random().toString(36).substring(2)}`}let p={provider:process.env.EMAIL_PROVIDER||"sendgrid",apiKey:process.env.EMAIL_API_KEY,fromEmail:process.env.FROM_EMAIL||"noreply@mybeing.com",fromName:process.env.FROM_NAME||"MyBeing Self-Discovery"}},58177:(e,t,i)=>{i.d(t,{QF:()=>r,RI:()=>a});let r=[{id:"1",title:"Understanding Your Cognitive Patterns",slug:"understanding-cognitive-patterns",excerpt:"Discover how your mind processes information and makes decisions through research-backed insights.",content:`# Understanding Your Cognitive Patterns

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

Discover your behavioral tendencies with our specialized assessments.`,image_url:"/images/blog/behavioral-change.jpg",tags:["behavior","habits","personal-growth"],published:!0,published_at:"2024-01-05T00:00:00.000Z",created_at:"2024-01-05T00:00:00.000Z",updated_at:"2024-01-05T00:00:00.000Z",author_id:"dr-n",author:"Dr N",readTime:"10 min read"}],a=[{id:"1",title:"Cognitive Dissonance Assessment",slug:"cognitive-dissonance-assessment",description:"Discover how aligned your actions are with your core values and beliefs.",duration:"8-12 minutes",completions:"2.3k+",difficulty:"Beginner",category:"Self-Awareness",published:!0,created_at:"2024-01-01T00:00:00.000Z",updated_at:"2024-01-01T00:00:00.000Z",author_id:"dr-n",responses:2300},{id:"2",title:"Stress Pattern Analysis",slug:"stress-pattern-analysis",description:"Understand your stress triggers and develop personalized coping strategies.",duration:"10-15 minutes",completions:"1.8k+",difficulty:"Intermediate",category:"Wellness",published:!0,created_at:"2024-01-05T00:00:00.000Z",updated_at:"2024-01-05T00:00:00.000Z",author_id:"dr-n",responses:1800},{id:"3",title:"Behavioral Tendencies Quiz",slug:"behavioral-tendencies-quiz",description:"Explore your natural behavioral patterns and decision-making style.",duration:"6-10 minutes",completions:"3.1k+",difficulty:"Beginner",category:"Behavior",published:!0,created_at:"2024-01-10T00:00:00.000Z",updated_at:"2024-01-10T00:00:00.000Z",author_id:"dr-n",responses:3100}]},36522:(e,t,i)=>{i.d(t,{qm:()=>s,r_:()=>l,wf:()=>c,xX:()=>d});var r=i(84770);function a(e){return(Buffer.isBuffer(e)?e:Buffer.from(e,"utf8")).toString("base64").replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function n(e){let t=4-(e.length%4||4),i=e.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat(t%4);return Buffer.from(i,"base64").toString("utf8")}function o(){return process.env.UNSUBSCRIBE_SECRET||process.env.NEXTAUTH_SECRET||"development-secret"}function s(e,t=30){let i=Math.floor(Date.now()/1e3)+86400*t,n=a(e),s=`${n}.${i}`,l=a((0,r.createHmac)("sha256",o()).update(s).digest());return`${n}.${i}.${l}`}function l(e){try{let t=e.split(".");if(3!==t.length)return{valid:!1,reason:"Malformed token"};let[i,s,l]=t,c=parseInt(s,10);if(!c||c<Math.floor(Date.now()/1e3))return{valid:!1,reason:"Token expired"};let d=`${i}.${c}`,p=(0,r.createHmac)("sha256",o()).update(d).digest(),u=a(p);if(!(0,r.timingSafeEqual)(Buffer.from(u),Buffer.from(l)))return{valid:!1,reason:"Invalid signature"};let g=n(i).toLowerCase().trim();return{valid:!0,email:g}}catch(e){return{valid:!1,reason:"Verification error"}}}function c(e,t=7){let i=Math.floor(Date.now()/1e3)+86400*t,n=a(e),s=`confirm:${n}.${i}`,l=a((0,r.createHmac)("sha256",o()).update(s).digest());return`${n}.${i}.${l}`}function d(e){try{let t=e.split(".");if(3!==t.length)return{valid:!1,reason:"Malformed token"};let[i,s,l]=t,c=parseInt(s,10);if(!c||c<Math.floor(Date.now()/1e3))return{valid:!1,reason:"Token expired"};let d=`confirm:${i}.${c}`,p=(0,r.createHmac)("sha256",o()).update(d).digest(),u=a(p);if(!(0,r.timingSafeEqual)(Buffer.from(u),Buffer.from(l)))return{valid:!1,reason:"Invalid signature"};let g=n(i).toLowerCase().trim();return{valid:!0,email:g}}catch(e){return{valid:!1,reason:"Verification error"}}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),r=t.X(0,[8948,5972,9498],()=>i(71894));module.exports=r})();