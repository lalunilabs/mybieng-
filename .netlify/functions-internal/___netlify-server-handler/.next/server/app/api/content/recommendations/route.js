"use strict";(()=>{var e={};e.id=7842,e.ids=[7842],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},92048:e=>{e.exports=require("fs")},55315:e=>{e.exports=require("path")},99513:(e,t,n)=>{n.r(t),n.d(t,{originalPathname:()=>g,patchFetch:()=>y,requestAsyncStorage:()=>h,routeModule:()=>d,serverHooks:()=>p,staticGenerationAsyncStorage:()=>m});var i={};n.r(i),n.d(i,{GET:()=>u,dynamic:()=>c});var s=n(49303),o=n(88716),r=n(60670),a=n(87070),l=n(4745);async function u(e){try{let{searchParams:t}=new URL(e.url),n=t.get("quiz"),i=t.get("band");t.get("resultType");let s=parseInt(t.get("limit")||"6");if(!n)return a.NextResponse.json({error:"Quiz parameter required"},{status:400});let o=(0,l.y8)(),r=[],u=[...new Set([...{"cognitive-dissonance":["values","behavior","identity","decision-making","self-awareness","psychology"],"stress-patterns":["stress","sleep","energy","mindfulness","wellness","habits"],"motivation-language":["motivation","behavior","habits","productivity","goals","self-improvement"],"self-awareness-mixed":["self-awareness","reflection","personal-growth","mindfulness","psychology"]}[n]||[],...i&&({"Low Dissonance":["values","consistency","integrity","decision-making"],"Moderate Dissonance":["alignment","values","behavior-change","self-reflection"],"High Dissonance":["values-clarification","behavior-change","stress-management","therapy"],"Low Stress":["wellness","maintenance","prevention","habits"],"Moderate Stress":["stress-management","coping-strategies","self-care"],"High Stress":["stress-relief","recovery","professional-help","burnout"],"THE ARCHITECT (Progress-Driven)":["goal-setting","tracking","systems","productivity"],"THE ACHIEVER (Rewards-Driven)":["celebration","recognition","achievement","success"],"THE ENCOURAGER (Affirmation-Driven)":["support","community","encouragement","relationships"],"THE CONNECTOR (Accountability-Driven)":["accountability","teamwork","commitment","social"],"THE VISIONARY (Inspiration-Driven)":["purpose","meaning","vision","inspiration"]})[i]||[]])],c=o.filter(e=>e.published).map(e=>{let t=0,i=e.tags||[];u.forEach(e=>{i.some(t=>t.toLowerCase().includes(e.toLowerCase())||e.toLowerCase().includes(t.toLowerCase()))&&(t+=10)}),e.relatedQuizzes?.includes(n)&&(t+=15);let s=e.title.toLowerCase(),o=e.excerpt?.toLowerCase()||"";return u.forEach(e=>{s.includes(e.toLowerCase())&&(t+=5),o.includes(e.toLowerCase())&&(t+=3)}),e.isPremium&&(t+=2),{...e,relevanceScore:t}}).filter(e=>e.relevanceScore>0).sort((e,t)=>t.relevanceScore-e.relevanceScore).slice(0,s);if(c.length<s){let e=o.filter(e=>e.published&&!c.find(t=>t.slug===e.slug)).sort((e,t)=>(t.likes||0)-(e.likes||0)).slice(0,s-c.length).map(e=>({...e,relevanceScore:1}));r=[...c,...e]}else r=c;let d=r.map(e=>({slug:e.slug,title:e.title,excerpt:e.excerpt,author:e.author,readTime:e.readTime,tags:e.tags,imageUrl:e.imageUrl,isPremium:e.isPremium,relevanceScore:e.relevanceScore,publishedAt:e.publishedAt}));return a.NextResponse.json({articles:d,total:d.length,quiz:n,band:i,relevantTags:u})}catch(e){return console.error("Content recommendations error:",e),a.NextResponse.json({error:"Failed to get recommendations"},{status:500})}}let c="force-dynamic",d=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/content/recommendations/route",pathname:"/api/content/recommendations",filename:"route",bundlePath:"app/api/content/recommendations/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/api/content/recommendations/route.ts",nextConfigOutput:"standalone",userland:i}),{requestAsyncStorage:h,staticGenerationAsyncStorage:m,serverHooks:p}=d,g="/api/content/recommendations/route";function y(){return(0,r.patchFetch)({serverHooks:p,staticGenerationAsyncStorage:m})}},18147:(e,t,n)=>{n.d(t,{Z:()=>s,r:()=>o});var i=n(47090);let s=[{id:"1",title:"The Mental Tug-of-War: Understanding Cognitive Dissonance",slug:"mental-tug-of-war-cognitive-dissonance",excerpt:"Why our minds justify contradictions—and how to spot and resolve the tension.",content:`Cognitive dissonance is the discomfort we feel when our actions and values don't line up.

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

**[Start Your First Assessment](/quizzes) | [Subscribe for $${i.$.monthly}/month](/pricing) | [Chat with AI Now](/chat)**`,author:"MyBeing Research Team",publishedAt:new Date("2025-09-04"),tags:["ai","self-discovery","technology","personalization"],readTime:12,published:!0,likes:0,isPremium:!1,metaTitle:`MyBeing AI: Your Personal Self-Discovery Companion | $${i.$.monthly}/month Premium Plan`,metaDescription:`Discover how MyBeing AI transforms self-discovery with intelligent quiz analysis, personalized recommendations, and a $${i.$.monthly}/month premium plan including 2 free quizzes and 3 premium articles.`,keywords:["AI assistant","self-discovery","quiz analysis","personalized recommendations","personal growth","psychology AI","behavioral insights",`$${i.$.monthly} subscription`],ogImage:"/images/blog/mybeing-ai-companion.jpg"}];function o(e){return s.find(t=>t.slug===e)}},47090:(e,t,n)=>{n.d(t,{$:()=>i});let i={monthly:32,currency:"USD",features:["Audio versions of all articles (listen instead of read)","1 premium quiz/month (worth up to $50) - FREE","Subscriber-only articles & quizzes","Subscriber discounts on additional premium content","Ad-free experience","Progress tracking & personalized insights","Unlimited AI conversations"]}},4745:(e,t,n)=>{n.d(t,{Hf:()=>w,Wg:()=>y,em:()=>b,h6:()=>k,j8:()=>v,jX:()=>f,y3:()=>A,y8:()=>g});var i=n(92048),s=n.n(i),o=n(55315),r=n.n(o),a=n(18147),l=n(96458);let u=process.cwd(),c=r().join(u,"content","articles"),d=r().join(u,"content","quizzes");function h(){s().existsSync(c)||s().mkdirSync(c,{recursive:!0}),s().existsSync(d)||s().mkdirSync(d,{recursive:!0})}function m(e){try{let t=s().readFileSync(e,"utf-8");return JSON.parse(t)}catch{return null}}function p(e,t){s().writeFileSync(e,JSON.stringify(t,null,2),"utf-8")}function g(){h();let e=s().readdirSync(c).filter(e=>e.endsWith(".json")).map(e=>{let t=m(r().join(c,e));return t?{...t,publishedAt:new Date(t.publishedAt)}:null}).filter(Boolean),t=new Set(e.map(e=>e.slug));return[...e,...a.Z.filter(e=>!t.has(e.slug))]}function y(e){h();let t=m(r().join(c,`${e}.json`));return t?{...t,publishedAt:new Date(t.publishedAt)}:a.Z.find(t=>t.slug===e)}function v(e){h();let t=e.slug,n=r().join(c,`${t}.json`),i={...e,id:e.id||crypto.randomUUID(),author:e.author||"MyBeing Research",readTime:e.readTime||5,published:e.published??!0,isPremium:e.isPremium??!1,likes:e.likes??0,tags:e.tags||[]};return p(n,i),i}function f(e){h();let t=r().join(c,`${e}.json`);s().existsSync(t)&&s().unlinkSync(t)}function w(){h();let e=s().readdirSync(d).filter(e=>e.endsWith(".json")).map(e=>m(r().join(d,e))).filter(Boolean),t=new Set(e.map(e=>e.slug));return[...e,...l.ei.filter(e=>!t.has(e.slug))]}function b(e){return h(),m(r().join(d,`${e}.json`))||l.ei.find(t=>t.slug===e)}function k(e){h();let t=e.slug;p(r().join(d,`${t}.json`),e)}function A(e){h();let t=r().join(d,`${e}.json`);s().existsSync(t)&&s().unlinkSync(t)}}};var t=require("../../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),i=t.X(0,[8948,5972,6458],()=>n(99513));module.exports=i})();