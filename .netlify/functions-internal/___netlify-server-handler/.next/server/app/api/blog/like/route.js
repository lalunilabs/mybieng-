"use strict";(()=>{var e={};e.id=2090,e.ids=[2090],e.modules={53524:e=>{e.exports=require("@prisma/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},53379:(e,t,n)=>{n.r(t),n.d(t,{originalPathname:()=>y,patchFetch:()=>g,requestAsyncStorage:()=>m,routeModule:()=>d,serverHooks:()=>p,staticGenerationAsyncStorage:()=>h});var i={};n.r(i),n.d(i,{POST:()=>l});var s=n(49303),a=n(88716),r=n(60670),o=n(87070),u=n(86287),c=n(18147);async function l(e){try{let{email:t,articleId:n,action:i}=await e.json();if(!t||!n||!i)return o.NextResponse.json({error:"Missing required fields"},{status:400});let s=!1;if("like"===i?s=await (0,u.HA)(t,n):"unlike"===i&&(s=await (0,u.C2)(t,n)),s){let e=c.Z.find(e=>e.id===n);e&&("like"===i?e.likes=(e.likes||0)+1:e.likes=Math.max(0,(e.likes||0)-1))}return o.NextResponse.json({success:s})}catch(e){return console.error("Blog like API error:",e),o.NextResponse.json({error:"Internal server error"},{status:500})}}let d=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/blog/like/route",pathname:"/api/blog/like",filename:"route",bundlePath:"app/api/blog/like/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/api/blog/like/route.ts",nextConfigOutput:"standalone",userland:i}),{requestAsyncStorage:m,staticGenerationAsyncStorage:h,serverHooks:p}=d,y="/api/blog/like/route";function g(){return(0,r.patchFetch)({serverHooks:p,staticGenerationAsyncStorage:h})}},18147:(e,t,n)=>{n.d(t,{Z:()=>s,r:()=>a});var i=n(47090);let s=[{id:"1",title:"The Mental Tug-of-War: Understanding Cognitive Dissonance",slug:"mental-tug-of-war-cognitive-dissonance",excerpt:"Why our minds justify contradictions—and how to spot and resolve the tension.",content:`Cognitive dissonance is the discomfort we feel when our actions and values don't line up.

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

While everyone can access basic AI assistance, our **Premium subscription ($${i.$.monthly}/month)** transforms the experience into something truly personalized and comprehensive.

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

**[Start Your First Assessment](/quizzes) | [Subscribe for $${i.$.monthly}/month](/pricing) | [Chat with AI Now](/chat)**`,author:"MyBeing Research Team",publishedAt:new Date("2025-09-04"),tags:["ai","self-discovery","technology","personalization"],readTime:12,published:!0,likes:0,isPremium:!1,metaTitle:`MyBeing AI: Your Personal Self-Discovery Companion | $${i.$.monthly}/month Premium Plan`,metaDescription:`Discover how MyBeing AI transforms self-discovery with intelligent quiz analysis, personalized recommendations, and a $${i.$.monthly}/month premium plan including 2 free quizzes and 3 premium articles.`,keywords:["AI assistant","self-discovery","quiz analysis","personalized recommendations","personal growth","psychology AI","behavioral insights",`$${i.$.monthly} subscription`],ogImage:"/images/blog/mybeing-ai-companion.jpg"}];function a(e){return s.find(t=>t.slug===e)}},47090:(e,t,n)=>{n.d(t,{$:()=>i});let i={monthly:32,currency:"USD",features:["Audio versions of all articles (listen instead of read)","1 premium quiz/month (worth up to $50) - FREE","Subscriber-only articles & quizzes","Subscriber discounts on additional premium content","Ad-free experience","Progress tracking & personalized insights","Unlimited AI conversations"]}},9487:(e,t,n)=>{n.d(t,{_:()=>a,s:()=>r});var i=n(53524);let s=()=>({user:{findMany:async()=>[],findUnique:async()=>null,create:async e=>({id:"mock-user",...e}),count:async()=>0},quizRun:{findMany:async()=>[],findUnique:async()=>null,create:async e=>({id:"mock-run",...e}),count:async()=>0,update:async()=>({}),updateMany:async()=>({})},quizAnswer:{findMany:async()=>[],create:async e=>({id:"mock-answer",...e}),createMany:async()=>({count:0})},subscription:{findUnique:async()=>null,findFirst:async()=>null,findMany:async()=>[],create:async({data:e})=>({id:"mock-sub",...e}),update:async({data:e})=>({id:"mock-sub",...e}),upsert:async({create:e,update:t})=>({id:"mock-sub",...t||e}),delete:async()=>({})},manualDiscount:{findFirst:async()=>null,update:async({data:e})=>({id:"mock-discount",...e}),create:async({data:e})=>({id:"mock-discount",...e})},purchase:{findFirst:async()=>null,findMany:async()=>[],create:async({data:e})=>({id:"mock-purchase",...e}),count:async()=>0},emailLog:{create:async({data:e})=>({id:"mock-email",status:e?.status||"sent",...e}),update:async({where:e,data:t})=>({id:e?.id||"mock-email",...t}),findMany:async()=>[]},newsletter:{create:async e=>({id:"mock-subscriber",...e}),count:async()=>0},$connect:async()=>{},$disconnect:async()=>{},$transaction:async e=>e(void 0)}),a=globalThis.prisma??function(){if(!process.env.DATABASE_URL)return console.warn("No DATABASE_URL found - using mock client"),s();try{return new i.PrismaClient({log:["error"],datasources:{db:{url:process.env.DATABASE_URL}}})}catch(e){return console.error("Failed to create Prisma client:",e),s()}}();async function r(e,t){if(!a)return console.warn("Database not available - returning fallback value"),t;try{return await e()}catch(e){return console.error("Database operation failed:",e),t}}},86287:(e,t,n)=>{n.d(t,{C2:()=>k,EO:()=>f,F3:()=>g,F6:()=>l,FR:()=>d,HA:()=>b,XW:()=>a,Xt:()=>h,Z1:()=>z,cv:()=>c,gL:()=>p,kk:()=>v,m2:()=>A,qZ:()=>m,rz:()=>u,uF:()=>o,vQ:()=>y,vS:()=>r});var i=n(9487);let s={premiumArticlesLimit:3,freeQuizzesLimit:2,freeQuizValueCap:50,articleDiscountPercent:30,quizDiscountPercent:20,discountedQuizzesLimit:3};async function a(e,t,n,a){let r=new Date,o=new Date(r.getTime()+2592e6);return await i._.subscription.create({data:{userId:e,plan:"premium",status:"active",stripeCustomerId:t,stripeSubscriptionId:n,stripePriceId:a,startDate:r,endDate:o,currentPeriodStart:r,currentPeriodEnd:o,premiumArticlesUsed:0,premiumArticlesLimit:s.premiumArticlesLimit,freeQuizzesUsed:0,freeQuizzesLimit:s.freeQuizzesLimit,freeQuizValueCap:s.freeQuizValueCap,discountedQuizzesUsed:0,discountedQuizzesLimit:s.discountedQuizzesLimit,lastCycleReset:r}})}async function r(e){var t,n;let s=await i._.subscription.findUnique({where:{userId:e}});return s&&"active"===s.status?(t=new Date,n=s.lastCycleReset,t.getUTCFullYear()!==n.getUTCFullYear()||t.getUTCMonth()!==n.getUTCMonth())?await w(s.id):s:null}async function o(e){return await i._.subscription.findUnique({where:{stripeSubscriptionId:e}})}async function u(e){let t=await r(e);return!!t&&t.endDate>new Date&&"active"===t.status}async function c(e){let t=await r(e);return!!t&&t.premiumArticlesUsed<t.premiumArticlesLimit}async function l(e){let t=await r(e);return!!(t&&await c(e))&&(await i._.subscription.update({where:{id:t.id},data:{premiumArticlesUsed:{increment:1}}}),!0)}async function d(e,t){return await r(e)?await c(e)?0:Math.round(t*(1-s.articleDiscountPercent/100)*100)/100:null}async function m(e,t){let n=await r(e);return!!n&&n.freeQuizzesUsed<n.freeQuizzesLimit&&t<=n.freeQuizValueCap}async function h(e,t){let n=await r(e);return n?await m(e,t)?0:n.discountedQuizzesUsed<n.discountedQuizzesLimit?Math.round(t*(1-s.quizDiscountPercent/100)*100)/100:t:null}async function p(e){let t=await r(e);return!!t&&t.discountedQuizzesUsed<t.discountedQuizzesLimit&&(await i._.subscription.update({where:{id:t.id},data:{discountedQuizzesUsed:{increment:1}}}),!0)}async function y(e){let t=await r(e);return!!t&&t.freeQuizzesUsed<t.freeQuizzesLimit&&(await i._.subscription.update({where:{id:t.id},data:{freeQuizzesUsed:{increment:1}}}),!0)}async function g(e){let t=await r(e);return t?{plan:t.plan,status:t.status,premiumArticlesUsed:t.premiumArticlesUsed,premiumArticlesRemaining:t.premiumArticlesLimit-t.premiumArticlesUsed,freeQuizzesUsed:t.freeQuizzesUsed,freeQuizzesRemaining:t.freeQuizzesLimit-t.freeQuizzesUsed,freeQuizValueCap:t.freeQuizValueCap,discountedQuizzesUsed:t.discountedQuizzesUsed,discountedQuizzesRemaining:t.discountedQuizzesLimit-t.discountedQuizzesUsed,endDate:t.endDate,currentPeriodEnd:t.currentPeriodEnd,daysRemaining:Math.ceil((t.endDate.getTime()-Date.now())/864e5),cancelAtPeriodEnd:t.cancelAtPeriodEnd}:null}async function f(e,t=!0){let n=await r(e);return!!n&&(await i._.subscription.update({where:{id:n.id},data:{cancelAtPeriodEnd:t,canceledAt:new Date,...t?{}:{status:"cancelled",endDate:new Date}}}),!0)}async function w(e){let t=new Date,n=new Date(t.getTime()+2592e6);return await i._.subscription.update({where:{id:e},data:{premiumArticlesUsed:0,freeQuizzesUsed:0,discountedQuizzesUsed:0,lastCycleReset:t,currentPeriodStart:t,currentPeriodEnd:n}})}async function v(e,t){let n=await o(e);return n?await i._.subscription.update({where:{id:n.id},data:t}):null}async function z(e,t){return!1}async function b(e,t){return!0}async function k(e,t){return!0}async function A(e){return!!await r(e)&&(await i._.subscription.update({where:{userId:e},data:{premiumArticlesUsed:0,freeQuizzesUsed:0,discountedQuizzesUsed:0,lastCycleReset:new Date}}),!0)}}};var t=require("../../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),i=t.X(0,[8948,5972],()=>n(53379));module.exports=i})();