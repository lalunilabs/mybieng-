(()=>{var e={};e.id=2797,e.ids=[2797],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},92048:e=>{"use strict";e.exports=require("fs")},55315:e=>{"use strict";e.exports=require("path")},59229:(e,t,n)=>{"use strict";n.r(t),n.d(t,{GlobalError:()=>r.a,__next_app__:()=>h,originalPathname:()=>d,pages:()=>u,routeModule:()=>m,tree:()=>c}),n(33243),n(36662),n(15778),n(35866);var s=n(23191),i=n(88716),o=n(37922),r=n.n(o),a=n(95231),l={};for(let e in a)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>a[e]);n.d(t,l);let c=["",{children:["search",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(n.bind(n,33243)),"/Users/niharikasai/mybeing/app/search/page.tsx"]}]},{metadata:{icon:[],apple:[],openGraph:[],twitter:[],manifest:"/manifest.json"}}]},{layout:[()=>Promise.resolve().then(n.bind(n,36662)),"/Users/niharikasai/mybeing/app/layout.tsx"],template:[()=>Promise.resolve().then(n.bind(n,15778)),"/Users/niharikasai/mybeing/app/template.tsx"],"not-found":[()=>Promise.resolve().then(n.t.bind(n,35866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[],apple:[],openGraph:[],twitter:[],manifest:"/manifest.json"}}],u=["/Users/niharikasai/mybeing/app/search/page.tsx"],d="/search/page",h={require:n,loadChunk:()=>Promise.resolve()},m=new s.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/search/page",pathname:"/search",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},48732:(e,t,n)=>{Promise.resolve().then(n.t.bind(n,79404,23))},33243:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>l,dynamic:()=>r,generateMetadata:()=>a});var s=n(19510),i=n(57371),o=n(4745);let r="force-dynamic";async function a({searchParams:e}){let t=(e?.q||"").trim(),n=t?`Search: ${t} | MyBeing`:"Search | MyBeing",s=t?`Results for “${t}” across MyBeing articles and quizzes.`:"Search MyBeing articles and quizzes.";return{title:n,description:s,alternates:{canonical:`/search${t?`?q=${encodeURIComponent(t)}`:""}`},openGraph:{title:n,description:s,url:`/search${t?`?q=${encodeURIComponent(t)}`:""}`,type:"website",images:[`/api/og?title=${encodeURIComponent(n)}&subtitle=${encodeURIComponent(s)}`]},twitter:{card:"summary_large_image",title:n,description:s,images:[`/api/og?title=${encodeURIComponent(n)}&subtitle=${encodeURIComponent(s)}`]},robots:{index:!0,follow:!0}}}function l({searchParams:e}){let t=(e?.q||"").trim().toLowerCase(),n=Date.now(),r=(0,o.y8)().filter(e=>!1!==e.published&&e.publishedAt.getTime()<=n).filter(e=>!t||e.title.toLowerCase().includes(t)||(e.excerpt||"").toLowerCase().includes(t)),a=(0,o.Hf)().filter(e=>!1!==e.published&&(!e.publishedAt||new Date(e.publishedAt).getTime()<=n)).filter(e=>!t||e.title.toLowerCase().includes(t)||(e.description||"").toLowerCase().includes(t));return s.jsx("div",{className:"min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-12",children:(0,s.jsxs)("div",{className:"max-w-5xl mx-auto px-4",children:[s.jsx("h1",{className:"text-4xl font-extrabold tracking-tight mb-6",children:"Search"}),(0,s.jsxs)("form",{action:"/search",method:"get",className:"mb-8 flex gap-3",children:[s.jsx("input",{type:"text",name:"q",defaultValue:t,placeholder:"Search articles and quizzes...",className:"flex-1 border rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"}),s.jsx("button",{className:"px-5 py-3 rounded-lg bg-primary text-white font-semibold shadow hover:opacity-95",type:"submit",children:"Search"})]}),!t&&s.jsx("p",{className:"text-muted-foreground mb-10",children:"Type a keyword to find relevant research-backed articles and self-discovery quizzes."}),(0,s.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8",children:[(0,s.jsxs)("section",{children:[s.jsx("h2",{className:"text-xl font-semibold mb-3",children:"Articles"}),0===r.length?s.jsx("p",{className:"text-sm text-muted-foreground",children:t?"No matching articles.":"Start by entering a search term."}):s.jsx("ul",{className:"space-y-3",children:r.map(e=>s.jsx("li",{className:"p-4 rounded-xl border bg-white shadow-sm hover:shadow transition",children:(0,s.jsxs)(i.default,{href:`/blog/${e.slug}`,className:"block",children:[s.jsx("div",{className:"font-medium text-lg",children:e.title}),s.jsx("div",{className:"text-sm text-muted-foreground line-clamp-2",children:e.excerpt})]})},e.slug))})]}),(0,s.jsxs)("section",{children:[s.jsx("h2",{className:"text-xl font-semibold mb-3",children:"Quizzes"}),0===a.length?s.jsx("p",{className:"text-sm text-muted-foreground",children:t?"No matching quizzes.":"Start by entering a search term."}):s.jsx("ul",{className:"space-y-3",children:a.map(e=>s.jsx("li",{className:"p-4 rounded-xl border bg-white shadow-sm hover:shadow transition",children:(0,s.jsxs)(i.default,{href:`/quizzes/${e.slug}`,className:"block",children:[s.jsx("div",{className:"font-medium text-lg",children:e.title}),s.jsx("div",{className:"text-sm text-muted-foreground line-clamp-2",children:e.description})]})},e.slug))})]})]})]})})}},18147:(e,t,n)=>{"use strict";n.d(t,{Z:()=>i,r:()=>o});var s=n(47090);let i=[{id:"1",title:"The Mental Tug-of-War: Understanding Cognitive Dissonance",slug:"mental-tug-of-war-cognitive-dissonance",excerpt:"Why our minds justify contradictions—and how to spot and resolve the tension.",content:`Cognitive dissonance is the discomfort we feel when our actions and values don't line up.

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

While everyone can access basic AI assistance, our **Premium subscription ($${s.$.monthly}/month)** transforms the experience into something truly personalized and comprehensive.

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

**[Start Your First Assessment](/quizzes) | [Subscribe for $${s.$.monthly}/month](/pricing) | [Chat with AI Now](/chat)**`,author:"MyBeing Research Team",publishedAt:new Date("2025-09-04"),tags:["ai","self-discovery","technology","personalization"],readTime:12,published:!0,likes:0,isPremium:!1,metaTitle:`MyBeing AI: Your Personal Self-Discovery Companion | $${s.$.monthly}/month Premium Plan`,metaDescription:`Discover how MyBeing AI transforms self-discovery with intelligent quiz analysis, personalized recommendations, and a $${s.$.monthly}/month premium plan including 2 free quizzes and 3 premium articles.`,keywords:["AI assistant","self-discovery","quiz analysis","personalized recommendations","personal growth","psychology AI","behavioral insights",`$${s.$.monthly} subscription`],ogImage:"/images/blog/mybeing-ai-companion.jpg"}];function o(e){return i.find(t=>t.slug===e)}},47090:(e,t,n)=>{"use strict";n.d(t,{$:()=>s});let s={monthly:32,currency:"USD",features:["Audio versions of all articles (listen instead of read)","1 premium quiz/month (worth up to $50) - FREE","Subscriber-only articles & quizzes","Subscriber discounts on additional premium content","Ad-free experience","Progress tracking & personalized insights","Unlimited AI conversations"]}},4745:(e,t,n)=>{"use strict";n.d(t,{Hf:()=>v,Wg:()=>y,em:()=>w,h6:()=>x,j8:()=>f,jX:()=>b,y3:()=>j,y8:()=>g});var s=n(92048),i=n.n(s),o=n(55315),r=n.n(o),a=n(18147),l=n(96458);let c=process.cwd(),u=r().join(c,"content","articles"),d=r().join(c,"content","quizzes");function h(){i().existsSync(u)||i().mkdirSync(u,{recursive:!0}),i().existsSync(d)||i().mkdirSync(d,{recursive:!0})}function m(e){try{let t=i().readFileSync(e,"utf-8");return JSON.parse(t)}catch{return null}}function p(e,t){i().writeFileSync(e,JSON.stringify(t,null,2),"utf-8")}function g(){h();let e=i().readdirSync(u).filter(e=>e.endsWith(".json")).map(e=>{let t=m(r().join(u,e));return t?{...t,publishedAt:new Date(t.publishedAt)}:null}).filter(Boolean),t=new Set(e.map(e=>e.slug));return[...e,...a.Z.filter(e=>!t.has(e.slug))]}function y(e){h();let t=m(r().join(u,`${e}.json`));return t?{...t,publishedAt:new Date(t.publishedAt)}:a.Z.find(t=>t.slug===e)}function f(e){h();let t=e.slug,n=r().join(u,`${t}.json`),s={...e,id:e.id||crypto.randomUUID(),author:e.author||"MyBeing Research",readTime:e.readTime||5,published:e.published??!0,isPremium:e.isPremium??!1,likes:e.likes??0,tags:e.tags||[]};return p(n,s),s}function b(e){h();let t=r().join(u,`${e}.json`);i().existsSync(t)&&i().unlinkSync(t)}function v(){h();let e=i().readdirSync(d).filter(e=>e.endsWith(".json")).map(e=>m(r().join(d,e))).filter(Boolean),t=new Set(e.map(e=>e.slug));return[...e,...l.ei.filter(e=>!t.has(e.slug))]}function w(e){return h(),m(r().join(d,`${e}.json`))||l.ei.find(t=>t.slug===e)}function x(e){h();let t=e.slug;p(r().join(d,`${t}.json`),e)}function j(e){h();let t=r().join(d,`${e}.json`);i().existsSync(t)&&i().unlinkSync(t)}},57371:(e,t,n)=>{"use strict";n.d(t,{default:()=>i.a});var s=n(670),i=n.n(s)},670:(e,t,n)=>{"use strict";let{createProxy:s}=n(68570);e.exports=s("/Users/niharikasai/mybeing/node_modules/next/dist/client/link.js")}};var t=require("../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),s=t.X(0,[8948,2247,124,6458],()=>n(59229));module.exports=s})();