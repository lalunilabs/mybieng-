"use strict";(()=>{var e={};e.id=68,e.ids=[68],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},92048:e=>{e.exports=require("fs")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},21764:e=>{e.exports=require("util")},97221:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>R,patchFetch:()=>S,requestAsyncStorage:()=>b,routeModule:()=>A,serverHooks:()=>I,staticGenerationAsyncStorage:()=>x});var n={};r.r(n),r.d(n,{DELETE:()=>v,GET:()=>y,POST:()=>f,dynamic:()=>w});var i=r(49303),s=r(88716),o=r(60670),a=r(87070),l=r(57708),u=r(29489),c=r(35860),d=r(6659),h=r(4745),m=r(65630);let p=m.Ry({id:m.Z_().uuid().optional(),title:m.Z_().min(1,"Title is required").max(200),slug:m.Z_().min(1,"Slug is required").max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,"Slug must be lowercase, alphanumeric with hyphens"),excerpt:m.Z_().min(1,"Excerpt is required").max(500),content:m.Z_().min(1,"Content is required"),author:m.Z_().min(1,"Author is required").default("MyBeing Research"),publishedAt:m.Z_().datetime({offset:!0}),tags:m.IX(m.Z_().max(50)).min(1,"At least one tag is required").max(10),readTime:m.Rx().int().positive().default(5),imageUrl:m.Z_().url("Invalid image URL").optional(),published:m.O7().default(!0),relatedQuizzes:m.IX(m.Z_()).optional(),isPremium:m.O7().default(!1),likes:m.Rx().int().min(0).default(0),audioUrl:m.Z_().url("Invalid audio URL").optional(),price:m.Rx().min(0).optional(),metaTitle:m.Z_().max(100).optional(),metaDescription:m.Z_().max(160).optional(),keywords:m.IX(m.Z_()).optional(),canonicalUrl:m.Z_().url("Invalid URL").optional(),ogImage:m.Z_().url("Invalid image URL").optional(),robots:m.Z_().optional()}),g={"Content-Type":"application/json","Cache-Control":"no-store, max-age=0","X-Content-Type-Options":"nosniff"};async function y(e){try{await c.Yy.check(e,20);try{await (0,d.z3)(e)}catch(e){return new a.NextResponse(JSON.stringify({success:!1,error:"Unauthorized",code:"UNAUTHORIZED"}),{status:401,headers:g})}try{let e=(0,h.y8)().map(e=>{let t=e.publishedAt instanceof Date?e.publishedAt.toISOString():e.publishedAt;return{...e,publishedAt:t}});return new a.NextResponse(JSON.stringify({success:!0,data:{items:e}}),{headers:g})}catch(e){return console.error("Failed to load articles:",e),new a.NextResponse(JSON.stringify({success:!1,error:"Failed to load articles",code:"LOAD_ERROR"}),{status:500,headers:g})}}catch(e){if(e.message?.includes("Rate limit exceeded"))return new a.NextResponse(JSON.stringify({success:!1,error:"Too many requests",code:"RATE_LIMIT_EXCEEDED",message:"Please try again later."}),{status:429,headers:{...g,"Retry-After":"60"}});return console.error("Unexpected error in GET /api/admin/articles:",e),new a.NextResponse(JSON.stringify({success:!1,error:"Internal server error",code:"INTERNAL_ERROR",message:void 0}),{status:500,headers:g})}}async function f(e){try{let t;await c.Yy.check(e,10);try{await (0,d.z3)(e)}catch(e){return new a.NextResponse(JSON.stringify({success:!1,error:"Unauthorized",code:"UNAUTHORIZED"}),{status:401,headers:g})}try{let r=await e.json(),n={...r,published:r.published??!0,isPremium:r.isPremium??!1,readTime:r.readTime??5,tags:Array.isArray(r.tags)?r.tags:[],relatedQuizzes:Array.isArray(r.relatedQuizzes)?r.relatedQuizzes:[],likes:r.likes??0};t=p.parse(n)}catch(e){return console.error("Validation error:",e),new a.NextResponse(JSON.stringify({success:!1,error:"Invalid request data",code:"VALIDATION_ERROR",details:e instanceof u.j?e.format():void 0}),{status:400,headers:g})}try{let e=(0,h.j8)(t);try{let t=process.env.ALGOLIA_APP_ID,r=process.env.ALGOLIA_ADMIN_API_KEY,n=process.env.ALGOLIA_INDEX_NAME;if(t&&r&&n){let i=`https://${t}.algolia.net/1/indexes/${encodeURIComponent(n)}/${encodeURIComponent("article:"+e.slug)}`,s={objectID:"article:"+e.slug,docType:"article",slug:e.slug,title:e.title,excerpt:e.excerpt||e.metaDescription||"",tags:e.tags||[],imageUrl:e.imageUrl||"",publishedAt:e.publishedAt,published:e.published,isPremium:e.isPremium,readTime:e.readTime,author:e.author},o=await fetch(i,{method:"PUT",headers:{"Content-Type":"application/json","X-Algolia-Application-Id":t,"X-Algolia-API-Key":r},body:JSON.stringify(s)});o.ok||console.error("Failed to update Algolia index:",await o.text())}}catch(e){console.error("Error updating Algolia index:",e)}try{(0,l.revalidatePath)("/blog"),(0,l.revalidatePath)(`/blog/${e.slug}`),(0,l.revalidatePath)("/sitemap.xml"),(0,l.revalidatePath)("/rss.xml")}catch(e){console.error("Error revalidating paths:",e)}return new a.NextResponse(JSON.stringify({success:!0,data:{slug:e.slug,id:e.id,message:"Article saved successfully"}}),{status:200,headers:g})}catch(e){return console.error("Failed to save article:",e),new a.NextResponse(JSON.stringify({success:!1,error:"Failed to save article",code:"SAVE_ERROR",message:e instanceof Error?e.message:"Unknown error"}),{status:500,headers:g})}}catch(e){return console.error("Unexpected error in POST /api/admin/articles:",e),new a.NextResponse(JSON.stringify({success:!1,error:"Internal server error",code:"INTERNAL_ERROR",message:void 0}),{status:500,headers:g})}}async function v(e){try{await c.Yy.check(e,5);try{await (0,d.z3)(e)}catch(e){return new a.NextResponse(JSON.stringify({success:!1,error:"Unauthorized",code:"UNAUTHORIZED"}),{status:401,headers:g})}let{searchParams:t}=new URL(e.url),r=t.get("slug");if(!r)return new a.NextResponse(JSON.stringify({success:!1,error:"Slug is required",code:"VALIDATION_ERROR",details:{slug:["Slug is required"]}}),{status:400,headers:g});try{if(!(0,h.Wg)(r))return new a.NextResponse(JSON.stringify({success:!1,error:"Article not found",code:"NOT_FOUND"}),{status:404,headers:g});(0,h.jX)(r);try{let e=process.env.ALGOLIA_APP_ID,t=process.env.ALGOLIA_ADMIN_API_KEY,n=process.env.ALGOLIA_INDEX_NAME;if(e&&t&&n){let i=`https://${e}.algolia.net/1/indexes/${encodeURIComponent(n)}/${encodeURIComponent("article:"+r)}`,s=await fetch(i,{method:"DELETE",headers:{"X-Algolia-Application-Id":e,"X-Algolia-API-Key":t}});s.ok||console.error("Failed to remove from Algolia index:",await s.text())}}catch(e){console.error("Error removing from Algolia index:",e)}try{(0,l.revalidatePath)("/blog"),(0,l.revalidatePath)(`/blog/${r}`),(0,l.revalidatePath)("/sitemap.xml"),(0,l.revalidatePath)("/rss.xml")}catch(e){console.error("Error revalidating paths:",e)}return new a.NextResponse(JSON.stringify({success:!0,data:{slug:r,message:"Article deleted successfully"}}),{status:200,headers:g})}catch(e){return console.error("Failed to delete article:",e),new a.NextResponse(JSON.stringify({success:!1,error:"Failed to delete article",code:"DELETE_ERROR",message:e instanceof Error?e.message:"Unknown error"}),{status:500,headers:g})}}catch(e){if(e.message?.includes("Rate limit exceeded"))return new a.NextResponse(JSON.stringify({success:!1,error:"Too many requests",code:"RATE_LIMIT_EXCEEDED",message:"Please try again later."}),{status:429,headers:{...g,"Retry-After":"60"}});return console.error("Unexpected error in DELETE /api/admin/articles:",e),new a.NextResponse(JSON.stringify({success:!1,error:"Internal server error",code:"INTERNAL_ERROR",message:void 0}),{status:500,headers:g})}}let w="force-dynamic",A=new i.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/admin/articles/route",pathname:"/api/admin/articles",filename:"route",bundlePath:"app/api/admin/articles/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/api/admin/articles/route.ts",nextConfigOutput:"standalone",userland:n}),{requestAsyncStorage:b,staticGenerationAsyncStorage:x,serverHooks:I}=A,R="/api/admin/articles/route";function S(){return(0,o.patchFetch)({serverHooks:I,staticGenerationAsyncStorage:x})}},18147:(e,t,r)=>{r.d(t,{Z:()=>i,r:()=>s});var n=r(47090);let i=[{id:"1",title:"The Mental Tug-of-War: Understanding Cognitive Dissonance",slug:"mental-tug-of-war-cognitive-dissonance",excerpt:"Why our minds justify contradictions—and how to spot and resolve the tension.",content:`Cognitive dissonance is the discomfort we feel when our actions and values don't line up.

This tension often shows up as quick justifications ("I had no choice"), gradual belief shifts ("maybe this isn't so important"), selective evidence gathering ("I'll look for articles that support me"), identity protection ("this isn't who I am"), or social reality distortion ("everyone does it").

Noticing the patterns gives you back choice. You can pause, name the tension, and decide whether to realign behavior with values—or update values with honesty.

A practical next step: take the Cognitive Dissonance Assessment to map where your tension shows up most and try one small alignment experiment this week.`,author:"MyBeing Research",publishedAt:new Date("2025-01-15"),tags:["psychology","self-awareness"],readTime:5,published:!0,relatedQuizzes:["cognitive-dissonance"],likes:0,isPremium:!1},{id:"2",title:"Tracking Stress Patterns: A Practical Guide",slug:"tracking-stress-patterns",excerpt:"Simple, research-backed ways to spot stress cycles and intervene early.",content:`Stress patterns often emerge subtly—through sleep, energy, or focus changes.

A simple weekly check-in across these dimensions reveals trends you can act on. Write down what you're noticing and the smallest helpful change you can make for the next 7 days.

Try the Stress Patterns quiz to get a baseline and identify one lever that gives you relief without requiring major life changes.`,author:"MyBeing Research",publishedAt:new Date("2025-02-04"),tags:["stress","habits"],readTime:4,published:!0,likes:0,isPremium:!1},{id:"3",title:"Advanced Behavioral Pattern Recognition",slug:"advanced-behavioral-patterns",excerpt:"Deep dive into unconscious behavioral loops and how to break them.",content:`This premium research article explores advanced techniques for identifying and modifying deeply ingrained behavioral patterns. Using cutting-edge neuroscience research and practical frameworks, we'll guide you through a comprehensive analysis of your unconscious habits.

Topics covered:
- Neuroplasticity and habit formation
- Advanced pattern interruption techniques
- Cognitive behavioral therapy applications
- Mindfulness-based interventions
- Case studies from clinical practice

This article includes audio narration and interactive exercises for premium subscribers.`,author:"Dr. MyBeing",publishedAt:new Date("2025-02-10"),tags:["premium","neuroscience","behavior"],readTime:15,published:!0,likes:0,isPremium:!0,price:29,audioUrl:"/audio/advanced-behavioral-patterns.mp3"},{id:"4",title:"Introducing MyBeing AI: Your Personal Self-Discovery Companion",slug:"mybeing-ai-personal-discovery-companion",excerpt:"Meet your new AI assistant that transforms how you explore quiz results, discover content, and plan your personal growth journey.",content:`# Introducing MyBeing AI: Your Personal Self-Discovery Companion

Self-discovery is a deeply personal journey, but it doesn't have to be a lonely one. Today, we're excited to introduce **MyBeing AI** – your intelligent companion designed to help you understand yourself better, explore your quiz results more deeply, and discover personalized content that accelerates your growth.

## Beyond Traditional Quiz Results

Traditional assessments give you a score and send you on your way. We believe that's just the beginning. Your quiz results are rich with insights waiting to be explored, patterns ready to be understood, and actionable steps begging to be taken.

### **Post-Quiz Conversations That Matter**

When you complete a MyBeing assessment, our AI assistant immediately becomes available to help you:

- **Understand Your Results**: Ask questions like "What does this mean for my daily life?" or "How can I work on this pattern?"
- **Get Practical Guidance**: Receive specific, actionable advice tailored to your score and category
- **Explore Patterns**: Dive deeper into the psychological patterns revealed by your assessment
- **Plan Next Steps**: Create a personalized action plan for the week ahead

**No complex forms, no waiting for reports** – just natural conversation about what matters most: your results and your growth.

### **Simple Feedback Collection**

We value your experience. After exploring your results, you can easily provide feedback through a simple star rating and optional comment. This helps us continuously improve our assessments and AI responses to serve you better.

## The Power of Personalized Content Discovery

One of the biggest challenges in self-discovery is knowing what to explore next. Should you take another quiz? Which blog post will actually help? What's the logical next step in your journey?

### **Intelligent Recommendations**

Our AI doesn't just give generic suggestions. It analyzes:
- Your quiz results and patterns
- Your conversation topics and interests  
- Your engagement history
- Research-backed connections between concepts

This means when you ask "What should I read next?" or "Which quiz would help me explore this further?", you get recommendations specifically chosen for your unique situation.

### **Content That Connects**

Every recommendation comes with context:
- **Why this content?** Understanding the reasoning behind suggestions
- **How it relates** to your current results or interests
- **What you'll gain** from engaging with the recommended content
- **Next steps** after consuming the content

## Premium Subscription: Unlocking Your Full Potential

While everyone can access basic AI assistance, our **Premium subscription ($${n.$.monthly}/month)** transforms the experience into something truly personalized and comprehensive.

### **What's Included in Premium**

**🎯 Monthly Allowances:**
- **2 free quizzes** (under $50 value each)
- **3 premium articles** with advanced research and insights
- **Unlimited AI conversations** with personalized guidance

**📊 Enhanced Features:**
- Personalized content curation based on your interests
- Custom 30-day learning plans tailored to your growth areas
- Subscriber discounts on additional quizzes and articles
- Progress tracking across all your assessments
- Priority recommendations that evolve with your journey

### **Smart Monthly Allowances**

Rather than overwhelming you with unlimited everything, we've designed a thoughtful allowance system:

- **2 Free Quizzes**: Carefully selected assessments under $50 value, perfect for monthly deep-dives
- **3 Premium Articles**: Research-backed content with advanced insights you won't find elsewhere
- **Strategic Pacing**: Encourages reflection and implementation rather than consumption overload

Additional content is available at subscriber discount rates, so you can explore more when you're ready.

## How It All Works Together

### **The Complete Experience**

1. **Take an Assessment**: Start with any of our research-backed quizzes
2. **Explore with AI**: Immediately dive into conversation about your results
3. **Get Recommendations**: Discover related content perfectly matched to your interests
4. **Plan Your Growth**: Create actionable steps for the week ahead
5. **Provide Feedback**: Help us improve through simple rating and comments
6. **Continue Learning**: Follow personalized recommendations to deepen your understanding

### **For Premium Subscribers: The Enhanced Journey**

Premium subscribers experience a fundamentally different level of personalization:

- **Usage Tracking**: See your monthly allowances and plan your exploration strategically
- **Conversation Memory**: Your AI remembers previous discussions and builds on them
- **Cross-Assessment Insights**: Discover patterns across multiple quiz results
- **Proactive Recommendations**: Get suggestions before you even ask
- **Learning Path Optimization**: Continuously refined recommendations based on your engagement

## Your Journey Starts Now

Self-discovery isn't a destination – it's an ongoing conversation with yourself about who you are, who you're becoming, and how you want to show up in the world.

Our AI assistant is here to make that conversation richer, more insightful, and more actionable. Whether you're just starting your self-discovery journey or you're a seasoned explorer looking for deeper insights, MyBeing AI adapts to meet you where you are.

**Ready to begin?** Take your first assessment and start the conversation. Your AI companion is waiting to help you unlock the insights that will transform how you understand yourself.

---

*MyBeing AI represents the next evolution in personal development technology – where artificial intelligence meets authentic self-discovery. Join thousands of users who are already experiencing the difference personalized AI guidance makes in their growth journey.*

**[Start Your First Assessment](/quizzes) | [Subscribe for $${n.$.monthly}/month](/pricing) | [Chat with AI Now](/chat)**`,author:"MyBeing Research Team",publishedAt:new Date("2025-09-04"),tags:["ai","self-discovery","technology","personalization"],readTime:12,published:!0,likes:0,isPremium:!1,metaTitle:`MyBeing AI: Your Personal Self-Discovery Companion | $${n.$.monthly}/month Premium Plan`,metaDescription:`Discover how MyBeing AI transforms self-discovery with intelligent quiz analysis, personalized recommendations, and a $${n.$.monthly}/month premium plan including 2 free quizzes and 3 premium articles.`,keywords:["AI assistant","self-discovery","quiz analysis","personalized recommendations","personal growth","psychology AI","behavioral insights",`$${n.$.monthly} subscription`],ogImage:"/images/blog/mybeing-ai-companion.jpg"}];function s(e){return i.find(t=>t.slug===e)}},6659:(e,t,r)=>{r.d(t,{Wg:()=>p,p$:()=>h,v9:()=>m,vN:()=>g,z3:()=>y});var n=r(71615),i=r(41482),s=r.n(i),o=r(84770);let a={super_admin:["users.read","users.write","users.delete","content.read","content.write","content.delete","subscriptions.read","subscriptions.write","ai_chat.read","ai_chat.moderate","system.read","system.write","analytics.read","reports.read","reports.export","settings.read","settings.write","security.read","security.write","admin.manage"]},l=process.env.OWNER_EMAIL||"",u=process.env.ADMIN_PASSWORD||"",c=Number(process.env.ADMIN_SESSION_TIMEOUT||"86400"),d=Number.isFinite(c)&&c>0?1e3*c:864e5;class h extends Error{constructor(e,t){super(e),this.code=t,this.name="AdminAuthError"}}async function m(e,t){if(!l||!u)throw new h("Admin not configured","ADMIN_NOT_CONFIGURED");let r=Buffer.from(e),n=Buffer.from(l),i=Buffer.from(t),c=Buffer.from(u),m=r.length===n.length&&(0,o.timingSafeEqual)(r,n),p=i.length===c.length&&(0,o.timingSafeEqual)(i,c);if(!m||!p)throw new h("Invalid credentials","INVALID_CREDENTIALS");let g={id:"admin_owner",email:l,name:l.split("@")[0],role:"super_admin",permissions:a.super_admin,createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()},y=s().sign({userId:g.id,email:g.email,role:g.role},function(){let e=process.env.ADMIN_JWT_SECRET;if(!e||e.length<16)throw new h("Admin not configured","ADMIN_NOT_CONFIGURED");return e}(),{expiresIn:`${Math.floor(d/1e3)}s`});return{user:g,token:y,expiresAt:new Date(Date.now()+d).toISOString()}}async function p(e){try{let t=process.env.ADMIN_JWT_SECRET;if(!t)return null;let r=s().verify(e,t);if(!r?.email||r.email!==l)return null;return{id:"admin_owner",email:l,name:l.split("@")[0],role:"super_admin",permissions:a.super_admin,createdAt:"2023-01-01T00:00:00Z",lastLogin:new Date().toISOString()}}catch(e){return null}}async function g(){try{let e=(0,n.cookies)(),t=e.get("admin_token")?.value;if(!t)return null;return await p(t)}catch(e){return null}}async function y(e){let t=await g();if(!t)throw new h("Authentication required","AUTH_REQUIRED");return t}},47090:(e,t,r)=>{r.d(t,{$:()=>n});let n={monthly:32,currency:"USD",features:["Audio versions of all articles (listen instead of read)","1 premium quiz/month (worth up to $50) - FREE","Subscriber-only articles & quizzes","Subscriber discounts on additional premium content","Ad-free experience","Progress tracking & personalized insights","Unlimited AI conversations"]}},4745:(e,t,r)=>{r.d(t,{Hf:()=>w,Wg:()=>y,em:()=>A,h6:()=>b,j8:()=>f,jX:()=>v,y3:()=>x,y8:()=>g});var n=r(92048),i=r.n(n),s=r(55315),o=r.n(s),a=r(18147),l=r(96458);let u=process.cwd(),c=o().join(u,"content","articles"),d=o().join(u,"content","quizzes");function h(){i().existsSync(c)||i().mkdirSync(c,{recursive:!0}),i().existsSync(d)||i().mkdirSync(d,{recursive:!0})}function m(e){try{let t=i().readFileSync(e,"utf-8");return JSON.parse(t)}catch{return null}}function p(e,t){i().writeFileSync(e,JSON.stringify(t,null,2),"utf-8")}function g(){h();let e=i().readdirSync(c).filter(e=>e.endsWith(".json")).map(e=>{let t=m(o().join(c,e));return t?{...t,publishedAt:new Date(t.publishedAt)}:null}).filter(Boolean),t=new Set(e.map(e=>e.slug));return[...e,...a.Z.filter(e=>!t.has(e.slug))]}function y(e){h();let t=m(o().join(c,`${e}.json`));return t?{...t,publishedAt:new Date(t.publishedAt)}:a.Z.find(t=>t.slug===e)}function f(e){h();let t=e.slug,r=o().join(c,`${t}.json`),n={...e,id:e.id||crypto.randomUUID(),author:e.author||"MyBeing Research",readTime:e.readTime||5,published:e.published??!0,isPremium:e.isPremium??!1,likes:e.likes??0,tags:e.tags||[]};return p(r,n),n}function v(e){h();let t=o().join(c,`${e}.json`);i().existsSync(t)&&i().unlinkSync(t)}function w(){h();let e=i().readdirSync(d).filter(e=>e.endsWith(".json")).map(e=>m(o().join(d,e))).filter(Boolean),t=new Set(e.map(e=>e.slug));return[...e,...l.ei.filter(e=>!t.has(e.slug))]}function A(e){return h(),m(o().join(d,`${e}.json`))||l.ei.find(t=>t.slug===e)}function b(e){h();let t=e.slug;p(o().join(d,`${t}.json`),e)}function x(e){h();let t=o().join(d,`${e}.json`);i().existsSync(t)&&i().unlinkSync(t)}},35860:(e,t,r)=>{r.d(t,{Yy:()=>s});var n=r(10138);function i(e){let t=new n.z({max:e?.uniqueTokenPerInterval||500,ttl:e?.interval||6e4});return{check:(e,r,n)=>{let i=e.ip||"127.0.0.1",s=n||i,o=t.get(s)||[0];o[0]+=1,t.set(s,o);let a=o[0],l=a>r,u=new Headers;if(u.set("X-RateLimit-Limit",r.toString()),u.set("X-RateLimit-Remaining",l?"0":(r-a).toString()),l){let e=Math.ceil((t.getRemainingTTL(s)||0)/1e3);throw u.set("Retry-After",e.toString()),Error(`Rate limit exceeded. Try again in ${e} seconds.`)}return{limit:r,remaining:r-a,success:!0}}}}let s=i({interval:6e4,uniqueTokenPerInterval:500});i({interval:6e4,uniqueTokenPerInterval:1e3})}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[8948,5972,1482,5630,138,2693,6458],()=>r(97221));module.exports=n})();