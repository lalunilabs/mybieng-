"use strict";(()=>{var e={};e.id=7640,e.ids=[7640],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},11957:(e,s,t)=>{t.r(s),t.d(s,{originalPathname:()=>w,patchFetch:()=>z,requestAsyncStorage:()=>y,routeModule:()=>g,serverHooks:()=>b,staticGenerationAsyncStorage:()=>f});var n={};t.r(n),t.d(n,{POST:()=>m});var r=t(49303),i=t(88716),o=t(60670),a=t(87070),u=t(99186),l=t(96458),c=t(18147);let d=new Map;async function m(e){try{let s;let t=function(e){let s=e.headers.get("x-forwarded-for"),t=e.headers.get("x-real-ip");return s?s.split(",")[0].trim():t?t.trim():"unknown"}(e);if(!function(e){let s=Date.now(),t=d.get(e);return!t||s>t.resetTime?(d.set(e,{count:1,resetTime:s+6e4}),!0):!(t.count>=30)&&(t.count++,!0)}(t))return a.NextResponse.json({error:"Too many requests. Please wait a moment before trying again."},{status:429});try{s=await e.json()}catch{return a.NextResponse.json({error:"Invalid JSON in request body"},{status:400})}let{message:n,mode:r,context:i}=u.$G.parse(s);if(!n||0===n.trim().length)return a.NextResponse.json({error:"Message cannot be empty"},{status:400});if(n.length>2e3)return a.NextResponse.json({error:"Message too long. Please keep it under 2000 characters."},{status:400});let o=(0,u.Z$)(n),l={...await p(o,r,i),timestamp:new Date().toISOString(),mode:r,requestId:h()};return a.NextResponse.json(l)}catch(t){console.error("Universal chat API error:",t);let{error:e,statusCode:s}=(0,u.R7)(t);return a.NextResponse.json({error:e,timestamp:new Date().toISOString(),requestId:h()},{status:s})}}async function p(e,s,t){try{if("quiz-results"===s&&!t.quizResults)throw Error("Quiz results required for quiz-results mode");if("subscription"===s&&!t.userSubscription)throw Error("User subscription data required for subscription mode");if("quiz-results"===s&&t.quizResults)return function(e,s){let t=e.toLowerCase();if(t.includes("mean")||t.includes("interpret"))return{response:`Your score of ${s.score}/${s.maxScore} in the "${s.band.label}" category suggests ${s.band.description.toLowerCase()}

This indicates specific patterns in how you handle the situations covered in this assessment. The key insight is understanding how this affects your daily decision-making and self-awareness.`,recommendations:(0,u.uk)(s.quizTitle)};if(t.includes("week")||t.includes("daily")||t.includes("focus"))return{response:`Based on your results, here's what to focus on this week:

${s.band.advice}

**This Week's Action Plan:**
1. **Awareness**: Notice when the patterns from your quiz show up
2. **Reflection**: Spend 5 minutes daily noting what you observed
3. **Small experiment**: Try one small change in how you respond
4. **Track progress**: Notice what feels different

Start small - awareness is the first step to change.`,recommendations:(0,u.uk)(s.quizTitle)};if(t.includes("content")||t.includes("read")||t.includes("related")){let e=(0,u.uk)(s.quizTitle);return{response:`Based on your ${s.quizTitle} results, I've found some content that might help deepen your understanding:

**Why these recommendations?**
Your score suggests you're in the "${s.band.label}" range, so these resources focus on practical strategies and deeper insights for your specific patterns.`,recommendations:e}}return t.includes("pattern")||t.includes("notice")||t.includes("recognize")?{response:`Here are key patterns to watch for based on your results:

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

Patterns become choices once you see them clearly.`}:{response:`I understand you're asking about your ${s.quizTitle} results. Your "${s.band.label}" score suggests specific patterns worth exploring.

**I can help you with:**
- Understanding what this means for your daily life
- Creating a practical action plan for this week
- Finding related content to deepen your insights
- Recognizing these patterns as they happen

What would be most helpful right now?`,recommendations:(0,u.uk)(s.quizTitle)}}(e,t.quizResults);if("subscription"===s&&t.userSubscription?.isSubscribed)return function(e,s){let t=e.toLowerCase(),n=(0,u.Cs)(s);if(t.includes("blog")||t.includes("read")||t.includes("article")){let e=(0,u.oJ)(s);return{response:`As a **Premium** subscriber, here are personalized blog recommendations:

**Your Premium Articles:** ${n.premiumArticlesRemaining} of 3 remaining this month

**Why these articles?**
I've selected these based on your engagement patterns and areas where you've shown interest in growing. Premium articles include advanced insights and research-backed strategies.`,recommendations:{blogs:e}}}if(t.includes("quiz")||t.includes("assessment")||t.includes("test")){let e=(0,u.uS)(s);return{response:`Based on your interests, here are quiz recommendations:

**Your Free Quizzes:** ${n.freeQuizzesRemaining} of 2 remaining this month (under $50 value)

**Personalized Selection:**
These assessments complement your previous results and can help you explore new dimensions of self-awareness. Additional quizzes available at subscriber discount rates.`,recommendations:{quizzes:e}}}return t.includes("plan")||t.includes("journey")||t.includes("growth")?{response:`Let's create a personalized growth plan! As a **Premium** subscriber, I can design a comprehensive learning journey.

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

Would you like me to recommend specific starting points?`,recommendations:{quizzes:(0,u.uS)(s),blogs:(0,u.oJ)(s)}}:t.includes("benefit")||t.includes("subscription")||t.includes("premium")?{response:`Your **Premium Subscription ($32/month)** includes:

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
- Free quizzes: ${n.freeQuizzesUsed}/2 used
- Premium articles: ${n.premiumArticlesUsed}/3 used

What would you like to explore with your remaining allowances?`}:{response:`As a **Premium** subscriber, you have access to enhanced features:

**This Month:**
🎯 Free quizzes remaining: ${n.freeQuizzesRemaining}/2
📚 Premium articles remaining: ${n.premiumArticlesRemaining}/3
💬 Unlimited AI conversations

**What would you like to explore?**
- Get personalized blog recommendations
- Find your next quiz based on interests
- Create a growth plan
- Learn about subscriber discounts`,recommendations:{quizzes:(0,u.uS)(s),blogs:(0,u.oJ)(s)}}}(e,t.userSubscription);return function(e,s){let t=e.toLowerCase(),n=s?.isSubscribed||!1;return t.includes("understand myself")||t.includes("self-discovery")?{response:`Self-discovery is about recognizing patterns in how you think, feel, and behave. Here's how to start:

**The MyBeing Approach:**
1. **Assess**: Take research-backed quizzes to identify patterns
2. **Reflect**: Understand what the results mean for you
3. **Experiment**: Try small changes based on insights
4. **Track**: Notice what shifts over time

**Start Here:**
- Take the Cognitive Dissonance assessment to understand value-behavior alignment
- Try the Stress Patterns check-in for immediate practical insights

${n?"":"\n**Want deeper insights?** Premium subscribers get 2 free quizzes monthly plus 3 premium articles with unlimited AI conversations."}`,recommendations:{quizzes:[{slug:"cognitive-dissonance",title:"The Mental Tug-of-War",description:"Understand when your values and actions are out of sync"},{slug:"stress-patterns",title:"Stress Patterns Check-in",description:"Identify your stress signals and response patterns"}]}}:t.includes("quiz")||t.includes("assessment")||t.includes("should i take")?{response:`Here are our research-backed assessments to help you understand yourself better:

**Most Popular Starting Points:**
- **Cognitive Dissonance**: Perfect for understanding value-behavior alignment
- **Stress Patterns**: Great for immediate, practical insights
- **Self-Awareness Check**: Explores your self-reflection habits

**How to Choose:**
- Start with what feels most relevant to your current challenges
- Each quiz takes 5-10 minutes
- You'll get immediate results with actionable insights

${n?"":"\n\uD83D\uDCA1 **Tip**: Premium subscribers get personalized quiz recommendations based on their interests and previous results."}`,recommendations:{quizzes:l.ei.slice(0,3).map(e=>({slug:e.slug,title:e.title,description:e.description}))}}:!n&&(t.includes("premium")||t.includes("subscription")||t.includes("upgrade"))?{response:`**MyBeing Premium Subscription ($32/month):**

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

${n?"":"\n**Want More?** Premium subscribers ($32/month) get 2 free quizzes + 3 premium articles monthly, plus unlimited conversations and personalized recommendations."}

What would you like to explore?`,recommendations:{quizzes:l.ei.slice(0,2).map(e=>({slug:e.slug,title:e.title,description:e.description})),blogs:c.Z.filter(e=>!e.isPremium).slice(0,2).map(e=>({slug:e.slug,title:e.title,excerpt:e.excerpt}))}}}(e,t.userSubscription)}catch(e){throw console.error("Error generating chat response:",e),e}}function h(){return`req_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}setInterval(()=>{let e=Date.now();for(let[s,t]of d.entries())e>t.resetTime&&d.delete(s)},6e4);let g=new r.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/ai/universal-chat/route",pathname:"/api/ai/universal-chat",filename:"route",bundlePath:"app/api/ai/universal-chat/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/api/ai/universal-chat/route.ts",nextConfigOutput:"standalone",userland:n}),{requestAsyncStorage:y,staticGenerationAsyncStorage:f,serverHooks:b}=g,w="/api/ai/universal-chat/route";function z(){return(0,o.patchFetch)({serverHooks:b,staticGenerationAsyncStorage:f})}}};var s=require("../../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),n=s.X(0,[8948,5972,5630,9186],()=>t(11957));module.exports=n})();