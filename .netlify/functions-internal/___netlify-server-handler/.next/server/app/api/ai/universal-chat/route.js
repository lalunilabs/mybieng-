"use strict";(()=>{var e={};e.id=7640,e.ids=[7640],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},11957:(e,t,s)=>{s.r(t),s.d(t,{originalPathname:()=>w,patchFetch:()=>v,requestAsyncStorage:()=>y,routeModule:()=>g,serverHooks:()=>b,staticGenerationAsyncStorage:()=>f});var i={};s.r(i),s.d(i,{POST:()=>m});var n=s(49303),r=s(88716),o=s(60670),a=s(87070),u=s(99186),l=s(96458),c=s(18147);let d=new Map;async function m(e){try{let t;let s=function(e){let t=e.headers.get("x-forwarded-for"),s=e.headers.get("x-real-ip");return t?t.split(",")[0].trim():s?s.trim():"unknown"}(e);if(!function(e){let t=Date.now(),s=d.get(e);return!s||t>s.resetTime?(d.set(e,{count:1,resetTime:t+6e4}),!0):!(s.count>=30)&&(s.count++,!0)}(s))return a.NextResponse.json({error:"Too many requests. Please wait a moment before trying again."},{status:429});try{t=await e.json()}catch{return a.NextResponse.json({error:"Invalid JSON in request body"},{status:400})}let{message:i,mode:n,context:r}=u.$G.parse(t);if(!i||0===i.trim().length)return a.NextResponse.json({error:"Message cannot be empty"},{status:400});if(i.length>2e3)return a.NextResponse.json({error:"Message too long. Please keep it under 2000 characters."},{status:400});let o=(0,u.Z$)(i),l={...await h(o,n,r),timestamp:new Date().toISOString(),mode:n,requestId:p()};return a.NextResponse.json(l)}catch(s){console.error("Universal chat API error:",s);let{error:e,statusCode:t}=(0,u.R7)(s);return a.NextResponse.json({error:e,timestamp:new Date().toISOString(),requestId:p()},{status:t})}}async function h(e,t,s){try{if("quiz-results"===t&&!s.quizResults)throw Error("Quiz results required for quiz-results mode");if("subscription"===t&&!s.userSubscription)throw Error("User subscription data required for subscription mode");if("quiz-results"===t&&s.quizResults)return function(e,t){let s=e.toLowerCase();if(s.includes("mean")||s.includes("interpret"))return{response:`Your score of ${t.score}/${t.maxScore} in the "${t.band.label}" category suggests ${t.band.description.toLowerCase()}

This indicates specific patterns in how you handle the situations covered in this assessment. The key insight is understanding how this affects your daily decision-making and self-awareness.`,recommendations:(0,u.uk)(t.quizTitle)};if(s.includes("week")||s.includes("daily")||s.includes("focus"))return{response:`Based on your results, here's what to focus on this week:

${t.band.advice}

**This Week's Action Plan:**
1. **Awareness**: Notice when the patterns from your quiz show up
2. **Reflection**: Spend 5 minutes daily noting what you observed
3. **Small experiment**: Try one small change in how you respond
4. **Track progress**: Notice what feels different

Start small - awareness is the first step to change.`,recommendations:(0,u.uk)(t.quizTitle)};if(s.includes("content")||s.includes("read")||s.includes("related")){let e=(0,u.uk)(t.quizTitle);return{response:`Based on your ${t.quizTitle} results, I've found some content that might help deepen your understanding:

**Why these recommendations?**
Your score suggests you're in the "${t.band.label}" range, so these resources focus on practical strategies and deeper insights for your specific patterns.`,recommendations:e}}return s.includes("pattern")||s.includes("notice")||s.includes("recognize")?{response:`Here are key patterns to watch for based on your results:

**Daily Life Signals:**
- Notice moments of discomfort or tension
- Pay attention to your first reactions in challenging situations
- Observe how you explain your choices to yourself
- Watch for times when you feel defensive

**The Pattern Recognition Practice:**
1. When you notice a signal, pause
2. Ask: "What pattern is this?"
3. Get curious rather than judgmental
4. Note it without trying to fix it immediately

Patterns become choices once you see them clearly.`}:{response:`I understand you're asking about your ${t.quizTitle} results. Your "${t.band.label}" score suggests specific patterns worth exploring.

**I can help you with:**
- Understanding what this means for your daily life
- Creating a practical action plan for this week
- Finding related content to deepen your insights
- Recognizing these patterns as they happen

What would be most helpful right now?`,recommendations:(0,u.uk)(t.quizTitle)}}(e,s.quizResults);if("subscription"===t&&s.userSubscription?.isSubscribed)return function(e,t){let s=e.toLowerCase(),i=(0,u.Cs)(t);if(s.includes("blog")||s.includes("read")||s.includes("article")){let e=(0,u.oJ)(t);return{response:`As a **Premium** subscriber, here are personalized blog recommendations:

**Your Premium Articles:** ${i.premiumArticlesRemaining} of 3 remaining this month

**Why these articles?**
I've selected these based on your engagement patterns and areas where you've shown interest in growing. Premium articles include advanced insights and research-backed strategies.`,recommendations:{blogs:e}}}if(s.includes("quiz")||s.includes("assessment")||s.includes("test")){let e=(0,u.uS)(t);return{response:`Based on your interests, here are quiz recommendations:

**Your Free Quizzes:** ${i.freeQuizzesRemaining} of 2 remaining this month (under $50 value)

**Personalized Selection:**
These assessments complement your previous results and can help you explore new dimensions of self-awareness. Additional quizzes available at subscriber discount rates.`,recommendations:{quizzes:e}}}return s.includes("plan")||s.includes("journey")||s.includes("growth")?{response:`Let's create a personalized growth plan! As a **Premium** subscriber, I can design a comprehensive learning journey.

**Your 30-Day Self-Discovery Plan:**

**Week 1-2: Foundation Building**
- Use your 2 free quizzes strategically
- Read your 3 premium articles for deeper understanding
- Start daily reflection practice (5 minutes)

**Week 3-4: Pattern Recognition**
- Take additional quizzes at subscriber discount
- Focus on identifying personal patterns
- Implement one small behavioral experiment

**Ongoing: Integration**
- Monthly check-ins with new assessments
- Curated reading based on your results
- Progress tracking and adjustment

Would you like me to recommend specific starting points?`,recommendations:{quizzes:(0,u.uS)(t),blogs:(0,u.oJ)(t)}}:s.includes("benefit")||s.includes("subscription")||s.includes("premium")?{response:`Your **Premium Subscription ($32/month)** includes:

**Monthly Allowances:**
🎯 2 free quizzes (under $50 value)
📚 3 premium articles with advanced insights
💬 Unlimited AI conversations

**Ongoing Benefits:**
📊 Personalized content recommendations
🎯 Custom learning plans
💰 Subscriber discounts on additional content
📈 Progress tracking across assessments

**Current Usage:**
- Free quizzes: ${i.freeQuizzesUsed}/2 used
- Premium articles: ${i.premiumArticlesUsed}/3 used

What would you like to explore with your remaining allowances?`}:{response:`As a **Premium** subscriber, you have access to enhanced features:

**This Month:**
🎯 Free quizzes remaining: ${i.freeQuizzesRemaining}/2
📚 Premium articles remaining: ${i.premiumArticlesRemaining}/3
💬 Unlimited AI conversations

**What would you like to explore?**
- Get personalized blog recommendations
- Find your next quiz based on interests
- Create a growth plan
- Learn about subscriber discounts`,recommendations:{quizzes:(0,u.uS)(t),blogs:(0,u.oJ)(t)}}}(e,s.userSubscription);return function(e,t){let s=e.toLowerCase(),i=t?.isSubscribed||!1;return s.includes("understand myself")||s.includes("self-discovery")?{response:`Self-discovery is about recognizing patterns in how you think, feel, and behave. Here's how to start:

**The MyBeing Approach:**
1. **Assess**: Take research-backed quizzes to identify patterns
2. **Reflect**: Understand what the results mean for you
3. **Experiment**: Try small changes based on insights
4. **Track**: Notice what shifts over time

**Start Here:**
- Take the Cognitive Dissonance assessment to understand value-behavior alignment
- Try the Stress Patterns check-in for immediate practical insights

${i?"":"\n**Want deeper insights?** Premium subscribers get 2 free quizzes monthly plus 3 premium articles with unlimited AI conversations."}`,recommendations:{quizzes:[{slug:"cognitive-dissonance",title:"The Mental Tug-of-War",description:"Understand when your values and actions are out of sync"},{slug:"stress-patterns",title:"Stress Patterns Check-in",description:"Identify your stress signals and response patterns"}]}}:s.includes("quiz")||s.includes("assessment")||s.includes("should i take")?{response:`Here are our research-backed assessments to help you understand yourself better:

**Most Popular Starting Points:**
- **Cognitive Dissonance**: Perfect for understanding value-behavior alignment
- **Stress Patterns**: Great for immediate, practical insights
- **Self-Awareness Check**: Explores your self-reflection habits

**How to Choose:**
- Start with what feels most relevant to your current challenges
- Each quiz takes 5-10 minutes
- You'll get immediate results with actionable insights

${i?"":"\n\uD83D\uDCA1 **Tip**: Premium subscribers get personalized quiz recommendations based on their interests and previous results."}`,recommendations:{quizzes:l.ei.slice(0,3).map(e=>({slug:e.slug,title:e.title,description:e.description}))}}:!i&&(s.includes("premium")||s.includes("subscription")||s.includes("upgrade"))?{response:`**MyBeing Premium Subscription ($32/month):**

**Monthly Allowances:**
🎯 2 free quizzes (under $50 value)
📚 3 premium articles with advanced research
💬 Unlimited AI conversations

**Ongoing Benefits:**
📊 Personalized content recommendations
🎯 Custom learning plans
💰 Subscriber discounts on additional content
📈 Progress tracking across assessments

**Why Subscribe?**
Get personalized guidance tailored to your unique patterns and interests, plus monthly allowances that let you explore deeply without worrying about individual costs.

[Subscribe for $32/month](/pricing)`,recommendations:{blogs:c.Z.filter(e=>!e.isPremium).slice(0,2).map(e=>({slug:e.slug,title:e.title,excerpt:e.excerpt}))}}:{response:`I'm here to help you on your self-discovery journey! I can:

**Free Features:**
• Help you understand quiz results
• Recommend assessments based on your interests
• Explain psychological concepts
• Provide basic content recommendations

**Popular Starting Points:**
• "What quizzes should I take?"
• "Help me understand cognitive patterns"
• "How does self-discovery work?"

${i?"":"\n**Want More?** Premium subscribers ($32/month) get 2 free quizzes + 3 premium articles monthly, plus unlimited conversations and personalized recommendations."}

What would you like to explore?`,recommendations:{quizzes:l.ei.slice(0,2).map(e=>({slug:e.slug,title:e.title,description:e.description})),blogs:c.Z.filter(e=>!e.isPremium).slice(0,2).map(e=>({slug:e.slug,title:e.title,excerpt:e.excerpt}))}}}(e,s.userSubscription)}catch(e){throw console.error("Error generating chat response:",e),e}}function p(){return`req_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}setInterval(()=>{let e=Date.now();for(let[t,s]of d.entries())e>s.resetTime&&d.delete(t)},6e4);let g=new n.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/ai/universal-chat/route",pathname:"/api/ai/universal-chat",filename:"route",bundlePath:"app/api/ai/universal-chat/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/api/ai/universal-chat/route.ts",nextConfigOutput:"standalone",userland:i}),{requestAsyncStorage:y,staticGenerationAsyncStorage:f,serverHooks:b}=g,w="/api/ai/universal-chat/route";function v(){return(0,o.patchFetch)({serverHooks:b,staticGenerationAsyncStorage:f})}},18147:(e,t,s)=>{s.d(t,{Z:()=>n,r:()=>r});var i=s(47090);let n=[{id:"1",title:"The Mental Tug-of-War: Understanding Cognitive Dissonance",slug:"mental-tug-of-war-cognitive-dissonance",excerpt:"Why our minds justify contradictions—and how to spot and resolve the tension.",content:`Cognitive dissonance is the discomfort we feel when our actions and values don't line up.

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

**[Start Your First Assessment](/quizzes) | [Subscribe for $${i.$.monthly}/month](/pricing) | [Chat with AI Now](/chat)**`,author:"MyBeing Research Team",publishedAt:new Date("2025-09-04"),tags:["ai","self-discovery","technology","personalization"],readTime:12,published:!0,likes:0,isPremium:!1,metaTitle:`MyBeing AI: Your Personal Self-Discovery Companion | $${i.$.monthly}/month Premium Plan`,metaDescription:`Discover how MyBeing AI transforms self-discovery with intelligent quiz analysis, personalized recommendations, and a $${i.$.monthly}/month premium plan including 2 free quizzes and 3 premium articles.`,keywords:["AI assistant","self-discovery","quiz analysis","personalized recommendations","personal growth","psychology AI","behavioral insights",`$${i.$.monthly} subscription`],ogImage:"/images/blog/mybeing-ai-companion.jpg"}];function r(e){return n.find(t=>t.slug===e)}},99186:(e,t,s)=>{s.d(t,{$G:()=>a,Cs:()=>u,R7:()=>p,Z$:()=>l,oJ:()=>m,uS:()=>d,uk:()=>c});var i=s(65630),n=s(29489),r=s(96458),o=s(18147);let a=i.Ry({message:i.Z_().min(1).max(1e3),mode:i.Km(["quiz-results","general","subscription"]),context:i.Ry({quizResults:i.Ry({quizTitle:i.Z_(),score:i.Rx(),maxScore:i.Rx(),band:i.Ry({label:i.Z_(),description:i.Z_(),advice:i.Z_()}),answers:i.IM(i.Z_(),i.Yj())}).optional(),userSubscription:i.Ry({isSubscribed:i.O7(),plan:i.Km(["free","premium"]),freeQuizzesUsed:i.Rx().optional(),premiumArticlesUsed:i.Rx().optional()}).optional(),conversationHistory:i.IX(i.Ry({role:i.Km(["user","assistant"]),content:i.Z_()})).optional()})});function u(e){let t=e?.freeQuizzesUsed||0,s=e?.premiumArticlesUsed||0;return{freeQuizzesLimit:2,premiumArticlesLimit:3,freeQuizzesUsed:t,premiumArticlesUsed:s,freeQuizzesRemaining:Math.max(0,2-t),premiumArticlesRemaining:Math.max(0,3-s)}}function l(e){return e.trim().replace(/\s+/g," ").substring(0,1e3)}function c(e){return{quizzes:r.ei.filter(t=>t.title!==e).slice(0,2).map(e=>({slug:e.slug,title:e.title,description:e.description,price:e.price,isFree:!e.price||e.price<50})),blogs:o.Z.filter(t=>t.relatedQuizzes?.some(t=>e.toLowerCase().includes(t.toLowerCase()))||t.tags.some(t=>e.toLowerCase().includes(t))).slice(0,2).map(e=>({slug:e.slug,title:e.title,excerpt:e.excerpt,isPremium:e.isPremium}))}}function d(e){let t=u(e);return r.ei.slice(0,3).map(e=>({slug:e.slug,title:e.title,description:e.description,price:e.price,isFree:t.freeQuizzesRemaining>0&&(!e.price||e.price<50)}))}function m(e){let t=u(e);return[...o.Z.filter(e=>e.isPremium).slice(0,t.premiumArticlesRemaining).map(e=>({slug:e.slug,title:e.title,excerpt:e.excerpt,isPremium:e.isPremium,isFree:!0})),...o.Z.filter(e=>!e.isPremium).slice(0,2).map(e=>({slug:e.slug,title:e.title,excerpt:e.excerpt,isPremium:!1}))].slice(0,3)}i.Ry({rating:i.Rx().min(1).max(5),comment:i.Z_().max(500).optional(),quizSlug:i.Z_().optional()});class h extends Error{constructor(e,t,s=400){super(e),this.code=t,this.statusCode=s,this.name="ChatError"}}function p(e){return e instanceof h?{error:e.message,statusCode:e.statusCode}:e instanceof n.j?{error:"Invalid request format",statusCode:400}:(console.error("Unexpected chat error:",e),{error:"An unexpected error occurred",statusCode:500})}},47090:(e,t,s)=>{s.d(t,{$:()=>i});let i={monthly:32,currency:"USD",features:["Audio versions of all articles (listen instead of read)","1 premium quiz/month (worth up to $50) - FREE","Subscriber-only articles & quizzes","Subscriber discounts on additional premium content","Ad-free experience","Progress tracking & personalized insights","Unlimited AI conversations"]}}};var t=require("../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),i=t.X(0,[8948,5972,5630,6458],()=>s(11957));module.exports=i})();