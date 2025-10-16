(()=>{var e={};e.id=2398,e.ids=[2398],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},92048:e=>{"use strict";e.exports=require("fs")},55315:e=>{"use strict";e.exports=require("path")},20198:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>a.a,__next_app__:()=>m,originalPathname:()=>u,pages:()=>c,routeModule:()=>h,tree:()=>d}),s(62005),s(36662),s(15778),s(35866);var i=s(23191),n=s(88716),r=s(37922),a=s.n(r),o=s(95231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);s.d(t,l);let d=["",{children:["quizzes",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,62005)),"/Users/niharikasai/mybeing/app/quizzes/page.tsx"]}]},{metadata:{icon:[],apple:[],openGraph:[],twitter:[],manifest:"/manifest.json"}}]},{layout:[()=>Promise.resolve().then(s.bind(s,36662)),"/Users/niharikasai/mybeing/app/layout.tsx"],template:[()=>Promise.resolve().then(s.bind(s,15778)),"/Users/niharikasai/mybeing/app/template.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,35866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[],apple:[],openGraph:[],twitter:[],manifest:"/manifest.json"}}],c=["/Users/niharikasai/mybeing/app/quizzes/page.tsx"],u="/quizzes/page",m={require:s,loadChunk:()=>Promise.resolve()},h=new i.AppPageRouteModule({definition:{kind:n.x.APP_PAGE,page:"/quizzes/page",pathname:"/quizzes",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},88644:(e,t,s)=>{Promise.resolve().then(s.bind(s,86236))},86236:(e,t,s)=>{"use strict";s.d(t,{default:()=>g});var i=s(10326),n=s(90434),r=s(21021),a=s(3679),o=s(81849),l=s(48998),d=s(54689),c=s(24230);let u=["\uD83E\uDDE0","\uD83C\uDFAF","\uD83D\uDCAD","\uD83D\uDD0D","⚡","\uD83C\uDF1F","\uD83C\uDFA8","\uD83D\uDD2E"];function m({slug:e,title:t,description:s,benefits:m,requirements:h}){let p=u[Math.floor(Math.random()*u.length)];return i.jsx(o.E.div,{whileHover:{y:-8,scale:1.02},transition:{duration:.3,ease:"easeOut"},children:i.jsx(n.default,{href:`/quizzes/${e}`,className:"block group",children:(0,i.jsxs)(r.Zb,{variant:"elevated",className:"h-full overflow-hidden border-2 border-foreground/5 bg-white shadow-brutal hover:shadow-brutal-lg transition-all duration-300",children:[(0,i.jsxs)("div",{className:"relative h-32 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10 overflow-hidden",children:[i.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20"}),i.jsx("div",{className:"absolute top-4 left-4",children:i.jsx("div",{className:"w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300",children:p})}),i.jsx("div",{className:"absolute top-4 right-4",children:i.jsx("span",{className:"px-3 py-1 bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-semibold rounded-full border border-purple-200 shadow-sm",children:"Assessment"})}),i.jsx("div",{className:"absolute bottom-2 right-6 w-8 h-8 bg-white/20 rounded-full"}),i.jsx("div",{className:"absolute bottom-6 right-2 w-4 h-4 bg-white/30 rounded-full"})]}),i.jsx(r.Ol,{className:"pb-4",children:i.jsx(r.ll,{className:"text-xl font-bold text-foreground group-hover:text-purple-600 transition-colors duration-200 leading-tight",children:t})}),(0,i.jsxs)(r.aY,{className:"flex-1 flex flex-col",children:[i.jsx("p",{className:"text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-3",children:s}),(!!m?.length||!!h?.length)&&(0,i.jsxs)("div",{className:"mb-5 space-y-3",children:[m?.length?(0,i.jsxs)("div",{children:[i.jsx("div",{className:"text-xs font-semibold text-slate-600 mb-1",children:"What you'll get"}),i.jsx("ul",{className:"text-sm text-slate-600 space-y-1 list-disc pl-4",children:m.slice(0,2).map((e,t)=>i.jsx("li",{className:"line-clamp-1",children:e},t))})]}):null,h?.length?(0,i.jsxs)("div",{children:[i.jsx("div",{className:"text-xs font-semibold text-slate-600 mb-1",children:"What you need"}),i.jsx("ul",{className:"text-sm text-slate-600 space-y-1 list-disc pl-4",children:h.slice(0,1).map((e,t)=>i.jsx("li",{className:"line-clamp-1",children:e},t))})]}):null]}),(0,i.jsxs)("div",{className:"space-y-4",children:[(0,i.jsxs)("div",{className:"flex items-center justify-between text-sm text-muted-foreground",children:[(0,i.jsxs)("div",{className:"flex items-center gap-1",children:[i.jsx(l.Z,{className:"w-4 h-4"}),i.jsx("span",{children:"5-15 min"})]}),(0,i.jsxs)("div",{className:"flex items-center gap-1",children:[i.jsx(d.Z,{className:"w-4 h-4"}),i.jsx("span",{children:"Retakeable"})]})]}),(0,i.jsxs)(a.z,{variant:"gradient",size:"lg",className:"w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 group-hover:shadow-glow-lg transition-all duration-300",children:[i.jsx("span",{className:"mr-2",children:"Start Quiz"}),i.jsx(c.Z,{className:"w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"})]})]})]})]})})})}var h=s(34834),p=s(17577);function g({quizzes:e}){let t=e.length,s=(0,p.useMemo)(()=>e,[e]);return i.jsx(h.ErrorBoundary,{children:(0,i.jsxs)("div",{className:"min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-12 relative overflow-hidden",children:[(0,i.jsxs)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",children:[i.jsx("div",{className:"absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl animate-float"}),i.jsx("div",{className:"absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float",style:{animationDelay:"2s"}})]}),i.jsx("section",{className:"relative px-4 py-16 sm:px-6 lg:px-8",children:(0,i.jsxs)("div",{className:"mx-auto max-w-7xl",children:[(0,i.jsxs)("div",{className:"text-center mb-16 animate-fade-in",children:[(0,i.jsxs)("div",{className:"mb-6 inline-flex items-center rounded-full bg-primary/10 px-6 py-3 text-sm font-medium text-primary ring-1 ring-primary/20 shadow-soft",children:[i.jsx("span",{className:"mr-2 text-lg",children:"\uD83E\uDDE0"}),i.jsx("span",{className:"font-semibold",children:"Research-backed assessments"})]}),(0,i.jsxs)("h1",{className:"text-5xl tracking-tight text-foreground sm:text-6xl lg:text-7xl mb-8",children:[i.jsx("span",{className:"block",children:"Discover Your"}),i.jsx("span",{className:"block text-gradient bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent",children:"Inner Patterns"})]}),(0,i.jsxs)("p",{className:"mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground sm:text-2xl",children:["Self-insight assessments built on ",i.jsx("span",{className:"text-primary font-semibold",children:"research-backed constructs"}),". Understand your cognitive patterns, stress responses, and behavioral tendencies."]}),(0,i.jsxs)("div",{className:"mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto",children:[(0,i.jsxs)("div",{className:"text-center group",children:[i.jsx("div",{className:"text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-200 numeric-figures",children:t}),i.jsx("div",{className:"text-sm text-muted-foreground font-medium",children:"Available Quizzes"})]}),(0,i.jsxs)("div",{className:"text-center group",children:[i.jsx("div",{className:"text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-200 numeric-figures",children:"5-15"}),i.jsx("div",{className:"text-sm text-muted-foreground font-medium",children:"Minutes Each"})]}),(0,i.jsxs)("div",{className:"text-center group",children:[i.jsx("div",{className:"text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-200 numeric-figures",children:"∞"}),i.jsx("div",{className:"text-sm text-muted-foreground font-medium",children:"Retakes Available"})]})]})]}),i.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",children:s.map((e,t)=>i.jsx("div",{className:"animate-scale-in",style:{animationDelay:`${.1*(t+1)}s`},children:i.jsx(m,{slug:e.slug,title:e.title,description:e.description,benefits:e.benefits,requirements:e.requirements})},e.slug))}),i.jsx("div",{className:"mt-20 text-center animate-fade-in",style:{animationDelay:"0.4s"},children:(0,i.jsxs)("div",{className:"bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-3xl p-12 border border-primary/10",children:[i.jsx("h2",{className:"text-3xl font-bold text-foreground mb-4",children:"Ready to Start Your Journey?"}),i.jsx("p",{className:"text-xl text-muted-foreground mb-8 max-w-2xl mx-auto",children:"Each quiz takes just a few minutes and provides personalized insights to help you understand yourself better."}),(0,i.jsxs)("div",{className:"flex flex-col sm:flex-row items-center justify-center gap-4",children:[(0,i.jsxs)("div",{className:"flex items-center text-sm text-muted-foreground",children:[i.jsx("span",{className:"mr-2",children:"✓"}),"No right or wrong answers"]}),(0,i.jsxs)("div",{className:"flex items-center text-sm text-muted-foreground",children:[i.jsx("span",{className:"mr-2",children:"✓"}),"Scientifically validated"]}),(0,i.jsxs)("div",{className:"flex items-center text-sm text-muted-foreground",children:[i.jsx("span",{className:"mr-2",children:"✓"}),"Completely private"]})]})]})})]})})]})})}},24230:(e,t,s)=>{"use strict";s.d(t,{Z:()=>i});let i=(0,s(62881).Z)("arrow-right",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]])},48998:(e,t,s)=>{"use strict";s.d(t,{Z:()=>i});let i=(0,s(62881).Z)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]])},54689:(e,t,s)=>{"use strict";s.d(t,{Z:()=>i});let i=(0,s(62881).Z)("rotate-ccw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]])},62005:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>l,metadata:()=>o,revalidate:()=>a});var i=s(19510),n=s(4745);let r=(0,s(68570).createProxy)(String.raw`/Users/niharikasai/mybeing/components/quizzes/QuizzesListClient.tsx#default`),a=600,o={title:"Quizzes | MyBeing",description:"Research-backed self-discovery assessments. No right/wrong answers — designed for pattern recognition and personal insight.",alternates:{canonical:"/quizzes",languages:{"en-IN":"/quizzes","en-US":"/quizzes","x-default":"/quizzes"}},openGraph:{title:"MyBeing Quizzes",description:"Assessments for insight, not judgment.",url:"/quizzes",type:"website",images:["/api/og?title=MyBeing%20Quizzes&subtitle=Assessments%20for%20insight%2C%20not%20judgment."]},twitter:{card:"summary_large_image",title:"MyBeing Quizzes",description:"Assessments for insight, not judgment.",images:["/api/og?title=MyBeing%20Quizzes&subtitle=Assessments%20for%20insight%2C%20not%20judgment."]},robots:{index:!0,follow:!0}};function l(){let e=Date.now(),t=(0,n.Hf)().filter(t=>!1!==t.published&&(!t.publishedAt||new Date(t.publishedAt).getTime()<=e)).sort((e,t)=>e.title.localeCompare(t.title)),s="http://localhost:3000",a={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${s}/`},{"@type":"ListItem",position:2,name:"Quizzes",item:`${s}/quizzes`}]};return(0,i.jsxs)(i.Fragment,{children:[i.jsx("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify(a)}}),i.jsx(r,{quizzes:t})]})}},18147:(e,t,s)=>{"use strict";s.d(t,{Z:()=>n,r:()=>r});var i=s(47090);let n=[{id:"1",title:"The Mental Tug-of-War: Understanding Cognitive Dissonance",slug:"mental-tug-of-war-cognitive-dissonance",excerpt:"Why our minds justify contradictions—and how to spot and resolve the tension.",content:`Cognitive dissonance is the discomfort we feel when our actions and values don't line up.

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

**[Start Your First Assessment](/quizzes) | [Subscribe for $${i.$.monthly}/month](/pricing) | [Chat with AI Now](/chat)**`,author:"MyBeing Research Team",publishedAt:new Date("2025-09-04"),tags:["ai","self-discovery","technology","personalization"],readTime:12,published:!0,likes:0,isPremium:!1,metaTitle:`MyBeing AI: Your Personal Self-Discovery Companion | $${i.$.monthly}/month Premium Plan`,metaDescription:`Discover how MyBeing AI transforms self-discovery with intelligent quiz analysis, personalized recommendations, and a $${i.$.monthly}/month premium plan including 2 free quizzes and 3 premium articles.`,keywords:["AI assistant","self-discovery","quiz analysis","personalized recommendations","personal growth","psychology AI","behavioral insights",`$${i.$.monthly} subscription`],ogImage:"/images/blog/mybeing-ai-companion.jpg"}];function r(e){return n.find(t=>t.slug===e)}},47090:(e,t,s)=>{"use strict";s.d(t,{$:()=>i});let i={monthly:32,currency:"USD",features:["Audio versions of all articles (listen instead of read)","1 premium quiz/month (worth up to $50) - FREE","Subscriber-only articles & quizzes","Subscriber discounts on additional premium content","Ad-free experience","Progress tracking & personalized insights","Unlimited AI conversations"]}},4745:(e,t,s)=>{"use strict";s.d(t,{Hf:()=>v,Wg:()=>y,em:()=>b,h6:()=>w,j8:()=>x,jX:()=>f,y3:()=>j,y8:()=>g});var i=s(92048),n=s.n(i),r=s(55315),a=s.n(r),o=s(18147),l=s(96458);let d=process.cwd(),c=a().join(d,"content","articles"),u=a().join(d,"content","quizzes");function m(){n().existsSync(c)||n().mkdirSync(c,{recursive:!0}),n().existsSync(u)||n().mkdirSync(u,{recursive:!0})}function h(e){try{let t=n().readFileSync(e,"utf-8");return JSON.parse(t)}catch{return null}}function p(e,t){n().writeFileSync(e,JSON.stringify(t,null,2),"utf-8")}function g(){m();let e=n().readdirSync(c).filter(e=>e.endsWith(".json")).map(e=>{let t=h(a().join(c,e));return t?{...t,publishedAt:new Date(t.publishedAt)}:null}).filter(Boolean),t=new Set(e.map(e=>e.slug));return[...e,...o.Z.filter(e=>!t.has(e.slug))]}function y(e){m();let t=h(a().join(c,`${e}.json`));return t?{...t,publishedAt:new Date(t.publishedAt)}:o.Z.find(t=>t.slug===e)}function x(e){m();let t=e.slug,s=a().join(c,`${t}.json`),i={...e,id:e.id||crypto.randomUUID(),author:e.author||"MyBeing Research",readTime:e.readTime||5,published:e.published??!0,isPremium:e.isPremium??!1,likes:e.likes??0,tags:e.tags||[]};return p(s,i),i}function f(e){m();let t=a().join(c,`${e}.json`);n().existsSync(t)&&n().unlinkSync(t)}function v(){m();let e=n().readdirSync(u).filter(e=>e.endsWith(".json")).map(e=>h(a().join(u,e))).filter(Boolean),t=new Set(e.map(e=>e.slug));return[...e,...l.ei.filter(e=>!t.has(e.slug))]}function b(e){return m(),h(a().join(u,`${e}.json`))||l.ei.find(t=>t.slug===e)}function w(e){m();let t=e.slug;p(a().join(u,`${t}.json`),e)}function j(e){m();let t=a().join(u,`${e}.json`);n().existsSync(t)&&n().unlinkSync(t)}}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),i=t.X(0,[8948,2247,124,6458],()=>s(20198));module.exports=i})();