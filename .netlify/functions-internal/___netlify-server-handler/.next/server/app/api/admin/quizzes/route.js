"use strict";(()=>{var e={};e.id=7256,e.ids=[7256],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},92048:e=>{e.exports=require("fs")},55315:e=>{e.exports=require("path")},15003:(e,t,n)=>{n.r(t),n.d(t,{originalPathname:()=>b,patchFetch:()=>w,requestAsyncStorage:()=>g,routeModule:()=>y,serverHooks:()=>v,staticGenerationAsyncStorage:()=>f});var r={};n.r(r),n.d(r,{DELETE:()=>h,GET:()=>d,POST:()=>p,dynamic:()=>m});var o=n(49303),i=n(88716),s=n(60670),a=n(87070),u=n(57708),l=n(3360),c=n(4745);async function d(e){if(!(0,l.DK)(e))return a.NextResponse.json({error:"Unauthorized"},{status:401});let t=(0,c.Hf)();return a.NextResponse.json({items:t})}async function p(e){if(!(0,l.DK)(e))return a.NextResponse.json({error:"Unauthorized"},{status:401});let t=await e.json().catch(()=>null),n=Array.isArray(t?.bands),r="string"==typeof t?.resultType&&(t?.resultType||"").length>0;if(!t||!t.slug||!t.title||!Array.isArray(t.questions)||!n&&!r)return a.NextResponse.json({error:"Invalid payload: provide numeric bands or a resultType"},{status:400});try{(0,c.h6)(t);try{let e=process.env.ALGOLIA_APP_ID,n=process.env.ALGOLIA_ADMIN_API_KEY,r=process.env.ALGOLIA_INDEX_NAME;if(e&&n&&r){let o=`https://${e}.algolia.net/1/indexes/${encodeURIComponent(r)}/${encodeURIComponent("quiz:"+t.slug)}`,i={objectID:"quiz:"+t.slug,docType:"quiz",slug:t.slug,title:t.title,excerpt:t.description||"",tags:t.tags||[],imageUrl:t.imageUrl||"",publishedAt:t.publishedAt||""};await fetch(o,{method:"PUT",headers:{"Content-Type":"application/json","X-Algolia-Application-Id":e,"X-Algolia-API-Key":n},body:JSON.stringify(i)})}}catch{}try{(0,u.revalidatePath)("/quizzes"),(0,u.revalidatePath)(`/quizzes/${t.slug}`),(0,u.revalidatePath)("/sitemap.xml")}catch{}return a.NextResponse.json({ok:!0})}catch(e){return a.NextResponse.json({error:e?.message||"Failed to save"},{status:500})}}async function h(e){if(!(0,l.DK)(e))return a.NextResponse.json({error:"Unauthorized"},{status:401});let{searchParams:t}=new URL(e.url),n=t.get("slug");if(!n)return a.NextResponse.json({error:"slug is required"},{status:400});(0,c.y3)(n);try{let e=process.env.ALGOLIA_APP_ID,t=process.env.ALGOLIA_ADMIN_API_KEY,r=process.env.ALGOLIA_INDEX_NAME;if(e&&t&&r){let o=`https://${e}.algolia.net/1/indexes/${encodeURIComponent(r)}/${encodeURIComponent("quiz:"+n)}`;await fetch(o,{method:"DELETE",headers:{"X-Algolia-Application-Id":e,"X-Algolia-API-Key":t}})}}catch{}try{(0,u.revalidatePath)("/quizzes"),(0,u.revalidatePath)(`/quizzes/${n}`),(0,u.revalidatePath)("/sitemap.xml")}catch{}return a.NextResponse.json({ok:!0})}let m="force-dynamic",y=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/admin/quizzes/route",pathname:"/api/admin/quizzes",filename:"route",bundlePath:"app/api/admin/quizzes/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/api/admin/quizzes/route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:g,staticGenerationAsyncStorage:f,serverHooks:v}=y,b="/api/admin/quizzes/route";function w(){return(0,s.patchFetch)({serverHooks:v,staticGenerationAsyncStorage:f})}},18147:(e,t,n)=>{n.d(t,{Z:()=>o,r:()=>i});var r=n(47090);let o=[{id:"1",title:"The Mental Tug-of-War: Understanding Cognitive Dissonance",slug:"mental-tug-of-war-cognitive-dissonance",excerpt:"Why our minds justify contradictions—and how to spot and resolve the tension.",content:`Cognitive dissonance is the discomfort we feel when our actions and values don't line up.

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

While everyone can access basic AI assistance, our **Premium subscription ($${r.$.monthly}/month)** transforms the experience into something truly personalized and comprehensive.

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

**[Start Your First Assessment](/quizzes) | [Subscribe for $${r.$.monthly}/month](/pricing) | [Chat with AI Now](/chat)**`,author:"MyBeing Research Team",publishedAt:new Date("2025-09-04"),tags:["ai","self-discovery","technology","personalization"],readTime:12,published:!0,likes:0,isPremium:!1,metaTitle:`MyBeing AI: Your Personal Self-Discovery Companion | $${r.$.monthly}/month Premium Plan`,metaDescription:`Discover how MyBeing AI transforms self-discovery with intelligent quiz analysis, personalized recommendations, and a $${r.$.monthly}/month premium plan including 2 free quizzes and 3 premium articles.`,keywords:["AI assistant","self-discovery","quiz analysis","personalized recommendations","personal growth","psychology AI","behavioral insights",`$${r.$.monthly} subscription`],ogImage:"/images/blog/mybeing-ai-companion.jpg"}];function i(e){return o.find(t=>t.slug===e)}},3360:(e,t,n)=>{n.d(t,{DK:()=>a,YH:()=>u,bc:()=>l,kF:()=>s});var r=n(71615),o=n(58585);let i="admin_auth";function s(){let e=(0,r.cookies)();e.get("admin_token")?.value||(0,o.redirect)("/admin/login")}function a(e){return!!e.cookies.get("admin_token")?.value||"1"===e.cookies.get(i)?.value}function u(){let e=new Headers;return e.append("Set-Cookie",`${i}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; Secure`),e}function l(){let e=new Headers;return e.append("Set-Cookie",`${i}=1; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=86400`),e}},47090:(e,t,n)=>{n.d(t,{$:()=>r});let r={monthly:32,currency:"USD",features:["Audio versions of all articles (listen instead of read)","1 premium quiz/month (worth up to $50) - FREE","Subscriber-only articles & quizzes","Subscriber discounts on additional premium content","Ad-free experience","Progress tracking & personalized insights","Unlimited AI conversations"]}},4745:(e,t,n)=>{n.d(t,{Hf:()=>b,Wg:()=>g,em:()=>w,h6:()=>A,j8:()=>f,jX:()=>v,y3:()=>x,y8:()=>y});var r=n(92048),o=n.n(r),i=n(55315),s=n.n(i),a=n(18147),u=n(96458);let l=process.cwd(),c=s().join(l,"content","articles"),d=s().join(l,"content","quizzes");function p(){o().existsSync(c)||o().mkdirSync(c,{recursive:!0}),o().existsSync(d)||o().mkdirSync(d,{recursive:!0})}function h(e){try{let t=o().readFileSync(e,"utf-8");return JSON.parse(t)}catch{return null}}function m(e,t){o().writeFileSync(e,JSON.stringify(t,null,2),"utf-8")}function y(){p();let e=o().readdirSync(c).filter(e=>e.endsWith(".json")).map(e=>{let t=h(s().join(c,e));return t?{...t,publishedAt:new Date(t.publishedAt)}:null}).filter(Boolean),t=new Set(e.map(e=>e.slug));return[...e,...a.Z.filter(e=>!t.has(e.slug))]}function g(e){p();let t=h(s().join(c,`${e}.json`));return t?{...t,publishedAt:new Date(t.publishedAt)}:a.Z.find(t=>t.slug===e)}function f(e){p();let t=e.slug,n=s().join(c,`${t}.json`),r={...e,id:e.id||crypto.randomUUID(),author:e.author||"MyBeing Research",readTime:e.readTime||5,published:e.published??!0,isPremium:e.isPremium??!1,likes:e.likes??0,tags:e.tags||[]};return m(n,r),r}function v(e){p();let t=s().join(c,`${e}.json`);o().existsSync(t)&&o().unlinkSync(t)}function b(){p();let e=o().readdirSync(d).filter(e=>e.endsWith(".json")).map(e=>h(s().join(d,e))).filter(Boolean),t=new Set(e.map(e=>e.slug));return[...e,...u.ei.filter(e=>!t.has(e.slug))]}function w(e){return p(),h(s().join(d,`${e}.json`))||u.ei.find(t=>t.slug===e)}function A(e){p();let t=e.slug;m(s().join(d,`${t}.json`),e)}function x(e){p();let t=s().join(d,`${e}.json`);o().existsSync(t)&&o().unlinkSync(t)}},58585:(e,t,n)=>{var r=n(61085);n.o(r,"notFound")&&n.d(t,{notFound:function(){return r.notFound}}),n.o(r,"permanentRedirect")&&n.d(t,{permanentRedirect:function(){return r.permanentRedirect}}),n.o(r,"redirect")&&n.d(t,{redirect:function(){return r.redirect}})},61085:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{ReadonlyURLSearchParams:function(){return s},RedirectType:function(){return r.RedirectType},notFound:function(){return o.notFound},permanentRedirect:function(){return r.permanentRedirect},redirect:function(){return r.redirect}});let r=n(83953),o=n(16399);class i extends Error{constructor(){super("Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams")}}class s extends URLSearchParams{append(){throw new i}delete(){throw new i}set(){throw new i}sort(){throw new i}}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},16399:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{isNotFoundError:function(){return o},notFound:function(){return r}});let n="NEXT_NOT_FOUND";function r(){let e=Error(n);throw e.digest=n,e}function o(e){return"object"==typeof e&&null!==e&&"digest"in e&&e.digest===n}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},8586:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"RedirectStatusCode",{enumerable:!0,get:function(){return n}}),function(e){e[e.SeeOther=303]="SeeOther",e[e.TemporaryRedirect=307]="TemporaryRedirect",e[e.PermanentRedirect=308]="PermanentRedirect"}(n||(n={})),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},83953:(e,t,n)=>{var r;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{RedirectType:function(){return r},getRedirectError:function(){return u},getRedirectStatusCodeFromError:function(){return m},getRedirectTypeFromError:function(){return h},getURLFromRedirectError:function(){return p},isRedirectError:function(){return d},permanentRedirect:function(){return c},redirect:function(){return l}});let o=n(54580),i=n(72934),s=n(8586),a="NEXT_REDIRECT";function u(e,t,n){void 0===n&&(n=s.RedirectStatusCode.TemporaryRedirect);let r=Error(a);r.digest=a+";"+t+";"+e+";"+n+";";let i=o.requestAsyncStorage.getStore();return i&&(r.mutableCookies=i.mutableCookies),r}function l(e,t){void 0===t&&(t="replace");let n=i.actionAsyncStorage.getStore();throw u(e,t,(null==n?void 0:n.isAction)?s.RedirectStatusCode.SeeOther:s.RedirectStatusCode.TemporaryRedirect)}function c(e,t){void 0===t&&(t="replace");let n=i.actionAsyncStorage.getStore();throw u(e,t,(null==n?void 0:n.isAction)?s.RedirectStatusCode.SeeOther:s.RedirectStatusCode.PermanentRedirect)}function d(e){if("object"!=typeof e||null===e||!("digest"in e)||"string"!=typeof e.digest)return!1;let[t,n,r,o]=e.digest.split(";",4),i=Number(o);return t===a&&("replace"===n||"push"===n)&&"string"==typeof r&&!isNaN(i)&&i in s.RedirectStatusCode}function p(e){return d(e)?e.digest.split(";",3)[2]:null}function h(e){if(!d(e))throw Error("Not a redirect error");return e.digest.split(";",2)[1]}function m(e){if(!d(e))throw Error("Not a redirect error");return Number(e.digest.split(";",4)[3])}(function(e){e.push="push",e.replace="replace"})(r||(r={})),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)}};var t=require("../../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),r=t.X(0,[8948,5972,2693,6458],()=>n(15003));module.exports=r})();