"use strict";(()=>{var e={};e.id=4596,e.ids=[4596],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},84770:e=>{e.exports=require("crypto")},32774:(e,t,n)=>{n.r(t),n.d(t,{originalPathname:()=>b,patchFetch:()=>v,requestAsyncStorage:()=>h,routeModule:()=>g,serverHooks:()=>y,staticGenerationAsyncStorage:()=>f});var o={};n.r(o),n.d(o,{POST:()=>m});var s=n(49303),a=n(88716),i=n(60670),r=n(87070),l=n(26729),c=n(36119),d=n(30372),u=n(52663),p=n(96458);async function m(e){try{let t=await e.json(),{quizSlug:n,responses:o,userEmail:s}=t;if(t?.sessionId&&t?.quizId){let e=String(t.sessionId),n=String(t.quizId),o="number"==typeof t.score?t.score:0,s=Array.isArray(t.responses)&&5*t.responses.filter(e=>e?.questionType==="scale").length||100,a=(0,p.tF)(o,s),i=await (0,u.s)(()=>u._.quizRun.create({data:{sessionId:e,quizSlug:n,total:o,bandLabel:a?.label||"Reported",answers:Array.isArray(t.responses)?{create:t.responses.map(e=>({question:e?.questionId||e?.questionText||"q",value:"number"==typeof e?.answer?e.answer:0}))}:void 0},select:{id:!0,createdAt:!0}}),null);if(!i)return r.NextResponse.json({ok:!0,id:"mock-id",createdAt:new Date});return r.NextResponse.json({ok:!0,id:i.id,createdAt:i.createdAt})}if(!n||!o||!s)return r.NextResponse.json({error:"Missing required fields: quizSlug, responses, userEmail"},{status:400});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))return r.NextResponse.json({error:"Invalid email format"},{status:400});let a=String(n),i=await (0,l.o)(a,o),m=e.headers.get("x-session-id")||"anonymous",g=e.headers.get("user-agent")||"unknown";(0,d.pO)(n,o,m,g,i.score,i.band);let h=(0,c._W)({userEmail:s,quizTitle:a,quizSlug:a,analysis:i,completedAt:new Date}),f={userEmail:s,quizTitle:a,quizSlug:a,analysis:i,completedAt:new Date,chatSessionId:h};if(!await (0,c.gx)(f))return r.NextResponse.json({error:"Failed to send results email"},{status:500});return r.NextResponse.json({success:!0,message:"Quiz completed successfully! Check your email for detailed results.",analysis:{score:i.score,band:i.band,bandDescription:i.bandDescription},chatSessionId:h,emailSent:!0})}catch(e){return console.error("Quiz completion error:",e),r.NextResponse.json({error:"Failed to process quiz completion"},{status:500})}}let g=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/quiz/complete/route",pathname:"/api/quiz/complete",filename:"route",bundlePath:"app/api/quiz/complete/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/api/quiz/complete/route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:h,staticGenerationAsyncStorage:f,serverHooks:y}=g,b="/api/quiz/complete/route";function v(){return(0,i.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:f})}},96458:(e,t,n)=>{n.d(t,{D9:()=>s,ei:()=>o,tF:()=>a});let o=[{slug:"cognitive-dissonance",title:"The Mental Tug-of-War (Cognitive Dissonance)",description:"Detect where your values and actions are out of sync across five patterns: instant justification, gradual belief shift, selective evidence, identity protection, and social reality distortion.",isPaid:!0,price:45,published:!0,publishedAt:"2025-08-01T00:00:00.000Z",tags:["cognitive dissonance","values","behavior","identity","justification","patterns"],metaTitle:"The Mental Tug-of-War: Cognitive Dissonance Assessment",metaDescription:"Spot contradictions between values and actions across 5 patterns. No right/wrong answers—use this assessment to recognize dissonance cues and choose small alignment steps.",keywords:["cognitive dissonance","values vs actions","instant justification","identity protection","selective evidence","self-discovery"],canonicalUrl:"/quizzes/cognitive-dissonance",ogImage:"",robots:"index,follow",questions:[{id:"cd1",text:"I quickly explain away choices that conflict with my values.",type:"likert"},{id:"cd2",text:"When I feel tension, I tell myself it was unavoidable.",type:"likert"},{id:"cd3",text:"Over time, I convince myself that a once-important value matters less.",type:"likert"},{id:"cd4",text:"I reframe past decisions to feel more consistent with who I am.",type:"likert"},{id:"cd5",text:"I look for information that supports my decision and ignore the rest.",type:"likert"},{id:"cd6",text:"I spend more time with people who validate my choices.",type:"likert"},{id:"cd7",text:"I feel threatened when feedback challenges a core part of my identity.",type:"likert"},{id:"cd8",text:"I defend my choices to protect how I see myself.",type:"likert"},{id:"cd9",text:"I justify actions by saying everyone around me does the same.",type:"likert"},{id:"cd10",text:"I downplay contradictions if my group supports the behavior.",type:"likert"}],bands:[{min:10,max:20,label:"Low dissonance",advice:"You generally act in alignment with your values. Keep reflecting on decisions and use that alignment as a strength."},{min:21,max:35,label:"Moderate dissonance",advice:"You may be managing occasional tensions by rationalizing or shifting beliefs. Choose one area to realign with a small, testable action."},{min:36,max:50,label:"High dissonance",advice:"You often experience value–behavior gaps. Map the biggest friction point, identify one value to honor this week, and remove a small obstacle to acting on it."}]},{slug:"stress-patterns",title:"Stress Patterns Check-in",description:"Spot recurring stress signals across sleep, energy, focus, mood, and social strain.",isPaid:!0,price:35,published:!0,publishedAt:"2025-08-10T00:00:00.000Z",tags:["stress","energy","sleep","focus","mood","patterns"],metaTitle:"Stress Patterns Check-in: Daily Signals Overview",metaDescription:"Identify stress signals across sleep, energy, focus, mood, and social strain. Quick check-in designed for practical insight and small adjustments.",keywords:["stress patterns","sleep","energy levels","focus","mood","self-assessment"],canonicalUrl:"/quizzes/stress-patterns",ogImage:"",robots:"index,follow",questions:[{id:"sp1",text:"My sleep is disrupted or unrefreshing.",type:"likert"},{id:"sp2",text:"My energy crashes during the day.",type:"likert"},{id:"sp3",text:"It is hard to focus or finish tasks.",type:"likert"},{id:"sp4",text:"I feel more irritable or on edge than usual.",type:"likert"},{id:"sp5",text:"I withdraw from people or avoid conversations.",type:"likert"},{id:"sp6",text:"Small problems feel overwhelming.",type:"likert"},{id:"sp7",text:"I rely on short-term relief (scrolling, snacking, etc.).",type:"likert"},{id:"sp8",text:"I notice physical tension (jaw, shoulders, stomach).",type:"likert"}],bands:[{min:8,max:16,label:"Low stress pattern load",advice:"You have manageable signals. Keep the basics steady: sleep window, movement, and one daily reset ritual."},{min:17,max:28,label:"Moderate stress pattern load",advice:"Pick one reliable lever (sleep, movement, or focused breaks). Reduce one stress amplifier (late caffeine, late screens, or constant notifications)."},{min:29,max:40,label:"High stress pattern load",advice:"Prioritize recovery. Create a wind-down routine, schedule a supportive conversation, and remove one commitment to free up capacity."}]},{slug:"self-awareness-mixed",title:"Self-Awareness Check (Mixed Format)",description:"A demonstration quiz using different question types to explore self-awareness patterns.",questions:[{id:"sa1",text:"I regularly reflect on my emotions and reactions.",type:"likert"},{id:"sa2",text:"Do you keep a journal or practice regular self-reflection?",type:"yes_no"},{id:"sa3",text:"What time of day do you feel most energetic?",type:"multiple_choice",options:["Early morning","Mid-morning","Afternoon","Evening","Late night"]},{id:"sa4",text:"I notice patterns in my behavior across different situations.",type:"likert"},{id:"sa5",text:"Describe a recent situation where you learned something new about yourself:",type:"text_input",placeholder:"Share your experience and what you discovered..."},{id:"sa6",text:"Do you actively seek feedback from others about your behavior?",type:"yes_no"},{id:"sa7",text:"Which best describes your approach to personal growth?",type:"multiple_choice",options:["Structured learning (books, courses)","Experiential learning (trying new things)","Social learning (conversations, mentors)","Reflective learning (journaling, meditation)","Mixed approach"]}],bands:[{min:4,max:8,label:"Developing awareness",advice:"You're building self-awareness foundations. Focus on one consistent reflection practice and seek regular feedback."},{min:9,max:12,label:"Growing awareness",advice:"You have good self-awareness habits. Deepen your practice by exploring patterns and seeking diverse perspectives."},{min:13,max:16,label:"Strong awareness",advice:"You demonstrate strong self-awareness. Use this foundation to help others and continue challenging your assumptions."}]}];function s(e){return o.find(t=>t.slug===e)}function a(e,t){let n=e/t*100;return n<=40?{min:10,max:20,label:"Low dissonance",advice:"You generally act in alignment with your values. Keep reflecting on decisions and use that alignment as a strength."}:n<=70?{min:21,max:35,label:"Moderate dissonance",advice:"You may be managing occasional tensions by rationalizing or shifting beliefs. Choose one area to realign with a small, testable action."}:{min:36,max:50,label:"High dissonance",advice:"You often experience value–behavior gaps. Map the biggest friction point, identify one value to honor this week, and remove a small obstacle to acting on it."}}},26729:(e,t,n)=>{async function o(e,t){if(process.env.OPENAI_API_KEY)try{return await s(e,t)}catch(e){console.error("OpenAI analysis failed, falling back to local analysis:",e)}return"cognitive-dissonance"===e?function(e){let t=e.filter(e=>"scale"===e.questionType),n=Math.round(t.reduce((e,t)=>e+t.answer,0)/(5*t.length)*100),o="Low Dissonance",s="You tend to maintain consistency between values and actions.";return n>40&&(o="Moderate Dissonance",s="Some tension exists between your beliefs and behaviors."),n>70&&(o="High Dissonance",s="Frequent conflicts between values and actions may be causing stress."),{score:n,band:o,bandDescription:s,keyInsights:[{pattern:"Justification Patterns",description:"Based on your responses, you show moderate tendency to rationalize decisions that conflict with your values.",actionableAdvice:'Practice the "pause and reflect" technique: when you notice yourself making quick justifications, take a moment to examine the underlying value conflict.',relatedContent:["mental-tug-of-war-cognitive-dissonance"]},{pattern:"Value-Action Alignment",description:"Your responses suggest some areas where your actions and values may not be fully aligned.",actionableAdvice:"Identify your top 3 core values and track for one week how often your daily decisions align with these values.",relatedContent:["tracking-stress-patterns"]}],personalizedMessage:`Your cognitive dissonance score of ${n} suggests ${s.toLowerCase()} This is completely normal - we all experience some tension between our ideals and reality. The key is developing awareness of these patterns so you can make more intentional choices.`,recommendedActions:["Keep a brief daily log of moments when you felt torn between what you wanted to do and what you thought you should do",'Practice the "values check" - before major decisions, ask yourself which of your core values this choice supports',"Experiment with one small behavior change that better aligns with your stated values"],nextSteps:["Take the Stress Patterns quiz to understand how this tension might be affecting your well-being","Read our blog post on cognitive dissonance patterns","Consider setting up weekly reflection time to process value-action conflicts"]}}(t):"stress-patterns"===e?function(e){let t=e.filter(e=>"scale"===e.questionType),n=Math.round(t.reduce((e,t)=>e+t.answer,0)/(5*t.length)*100),o="Low Stress",s="Your stress levels appear manageable.";return n>50&&(o="Moderate Stress",s="Some stress patterns worth monitoring."),n>75&&(o="High Stress",s="Consider stress management strategies."),{score:n,band:o,bandDescription:s,keyInsights:[{pattern:"Sleep Quality Impact",description:"Your sleep quality responses indicate this may be a key factor in your stress patterns.",actionableAdvice:"Focus on sleep hygiene: consistent bedtime, no screens 1 hour before sleep, and a cool, dark environment.",relatedContent:["tracking-stress-patterns"]}],personalizedMessage:`Your stress assessment reveals ${s.toLowerCase()} Remember, stress is information - it tells us about what matters to us and where we might need to make adjustments.`,recommendedActions:["Track your stress triggers for one week using a simple 1-5 scale","Identify your most effective stress relief activities and schedule them proactively","Practice one micro-recovery technique (deep breathing, brief walk, etc.) daily"],nextSteps:["Consider taking the Cognitive Dissonance quiz to explore any value conflicts contributing to stress","Read our stress management research articles","Set up a weekly stress pattern review"]}}(t):function(e){let t=e.filter(e=>"scale"===e.questionType);return{score:Math.round(t.reduce((e,t)=>e+t.answer,0)/(5*t.length)*100),band:"Assessment Complete",bandDescription:"Your responses have been analyzed for patterns and insights.",keyInsights:[{pattern:"Response Patterns",description:"Your responses show thoughtful consideration of the questions.",actionableAdvice:"Continue reflecting on these areas for personal growth.",relatedContent:[]}],personalizedMessage:"Thank you for taking the time to reflect on these important questions. Self-awareness is the first step toward positive change.",recommendedActions:["Reflect on your responses and identify one area for growth","Consider how these insights apply to your daily life","Share your insights with someone you trust"],nextSteps:["Explore our other assessments for additional insights","Read related blog posts for deeper understanding","Consider retaking this assessment in a few weeks to track changes"]}}(t)}async function s(e,t){let n=process.env.OPENAI_API_KEY,o=process.env.OPENAI_MODEL||"gpt-4",s=`You are a psychology expert analyzing quiz responses for the MyBeing self-discovery platform. 

Quiz: ${e}
User Responses: ${JSON.stringify(t,null,2)}

Analyze these responses and provide insights focused on:
1. Pattern recognition (no right/wrong answers)
2. Behavioral tendencies and self-awareness gaps
3. Actionable advice for personal growth
4. Research-backed recommendations

Return a JSON object with this structure:
{
  "score": number (0-100),
  "band": "descriptive category",
  "bandDescription": "brief explanation",
  "keyInsights": [
    {
      "pattern": "insight category",
      "description": "what the data shows",
      "actionableAdvice": "specific action they can take"
    }
  ],
  "personalizedMessage": "encouraging, personalized message",
  "recommendedActions": ["specific action 1", "specific action 2"],
  "nextSteps": ["next step 1", "next step 2"]
}`,a=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json"},body:JSON.stringify({model:o,messages:[{role:"system",content:"You are a psychology expert providing non-judgmental, research-backed insights for self-discovery. Focus on patterns and growth opportunities, not deficits."},{role:"user",content:s}],temperature:.7,max_tokens:1500})});if(!a.ok)throw Error(`OpenAI API error: ${a.statusText}`);let i=await a.json(),r=i.choices[0]?.message?.content;if(!r)throw Error("No response from OpenAI");try{return JSON.parse(r)}catch(e){throw console.error("Failed to parse OpenAI response:",e),Error("Invalid AI response format")}}async function a(e,t,n){if(process.env.OPENAI_API_KEY)try{return await i(e,t,n)}catch(e){console.error("OpenAI chat failed, falling back to local responses:",e)}let o=e.toLowerCase();if(o.includes("score")||o.includes("result"))return`Your score of ${t.score} places you in the "${t.band}" range. ${t.bandDescription} This means ${t.personalizedMessage}`;if(o.includes("what")&&o.includes("do"))return`Based on your results, here are some specific actions you can take:

${t.recommendedActions.map(e=>`• ${e}`).join("\n")}

Would you like me to elaborate on any of these suggestions?`;if(o.includes("pattern")||o.includes("insight")){let e=t.keyInsights.map(e=>`**${e.pattern}**: ${e.description} ${e.actionableAdvice}`).join("\n\n");return`Here are the key patterns I identified in your responses:

${e}`}return o.includes("next")||o.includes("step")?`Here are your recommended next steps:

${t.nextSteps.map(e=>`• ${e}`).join("\n")}

Which of these resonates most with you?`:`I'm here to help you understand your quiz results better. You can ask me about:

• Your score and what it means
• Specific patterns in your responses
• Actionable steps you can take
• How to apply these insights to your daily life

What would you like to explore?`}async function i(e,t,n){let o=process.env.OPENAI_API_KEY,s=process.env.OPENAI_MODEL||"gpt-4",a=[{role:"system",content:`You are a supportive psychology expert helping someone understand their quiz results from MyBeing, a self-discovery platform. 

Their quiz analysis:
- Score: ${t.score}
- Category: ${t.band}
- Description: ${t.bandDescription}
- Key Insights: ${JSON.stringify(t.keyInsights)}
- Recommended Actions: ${JSON.stringify(t.recommendedActions)}
- Next Steps: ${JSON.stringify(t.nextSteps)}

Guidelines:
- Be encouraging and non-judgmental
- Focus on growth and self-awareness
- Provide specific, actionable advice
- Reference their specific results when relevant
- Keep responses conversational and supportive
- No medical advice - focus on behavioral patterns and personal growth`},...n,{role:"user",content:e}],i=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${o}`,"Content-Type":"application/json"},body:JSON.stringify({model:s,messages:a,temperature:.8,max_tokens:800})});if(!i.ok)throw Error(`OpenAI API error: ${i.statusText}`);let r=await i.json();return r.choices[0]?.message?.content||"I apologize, but I encountered an error. Please try asking your question again."}n.d(t,{X:()=>a,o:()=>o})},52663:(e,t,n)=>{n.d(t,{_:()=>a,s:()=>i});let o=require("@prisma/client"),s=()=>({user:{findMany:async()=>[],findUnique:async()=>null,create:async e=>({id:"mock-user",...e}),count:async()=>0},quizRun:{findMany:async()=>[],findUnique:async()=>null,create:async e=>({id:"mock-run",...e}),count:async()=>0,update:async()=>({}),updateMany:async()=>({})},quizAnswer:{findMany:async()=>[],create:async e=>({id:"mock-answer",...e}),createMany:async()=>({count:0})},newsletter:{create:async e=>({id:"mock-subscriber",...e}),count:async()=>0},$connect:async()=>{},$disconnect:async()=>{},$transaction:async e=>e(void 0)}),a=globalThis.prisma??function(){if(!process.env.DATABASE_URL)return console.warn("No DATABASE_URL found - using mock client"),s();try{return new o.PrismaClient({log:["error"],datasources:{db:{url:process.env.DATABASE_URL}}})}catch(e){return console.error("Failed to create Prisma client:",e),s()}}();async function i(e,t){if(!a)return console.warn("Database not available - returning fallback value"),t;try{return await e()}catch(e){return console.error("Database operation failed:",e),t}}},36119:(e,t,n)=>{n.d(t,{Gk:()=>i,QO:()=>a,_W:()=>d,gx:()=>s});var o=n(36522);async function s(e){try{let{subject:t,html:n,text:o}=function(e){let{analysis:t,quizTitle:n,completedAt:o}=e,s=`Your ${n} Results - MyBeing Self-Discovery`,a=`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${s}</title>
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
      <h1>Your ${n} Results</h1>
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
      <p>Completed on ${o.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
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
  `;return{subject:s,html:a,text:`
Your ${n} Results - MyBeing Self-Discovery

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

Completed on ${o.toLocaleDateString()}

Visit MyBeing: https://mybeing.com
Take Another Quiz: https://mybeing.com/quizzes
Read Our Blog: https://mybeing.com/blog

Your privacy matters - we don't store your responses on our servers.
  `}}(e);if("sendgrid"===u.provider)return await r(e.userEmail,t,n,o);if("mailgun"===u.provider)return await l(e.userEmail,t,n,o);if("ses"===u.provider)return await c(e.userEmail,t,n,o);return console.log("\uD83D\uDCE7 [DEV MODE] Quiz results email:",{to:e.userEmail,subject:t,quizSlug:e.quizSlug,score:e.analysis.score}),!0}catch(e){return console.error("Failed to send quiz results email:",e),!1}}async function a(e){try{let t="Welcome to MyBeing — Let’s begin your self-discovery",n=(0,o.qm)(e),s="http://localhost:3000",a=`${s}/api/newsletter/unsubscribe?token=${encodeURIComponent(n)}`,i=`
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
        <a class="button" href="${s}/quizzes">Explore Quizzes</a>
      </p>
      <div class="footer">
        <p>You’ll receive occasional updates only. Your privacy matters.</p>
        <p style="font-size:12px; margin-top:8px;">If this wasn’t you or you no longer wish to receive emails, <a href="${a}" style="color:#6b21a8;">unsubscribe</a>.</p>
      </div>
    </div>
  </body>
  </html>
`,d=`Welcome to MyBeing!

Thanks for subscribing. You’ll receive research-backed insights and self-discovery quizzes.

Get started: ${s}/quizzes
Blog: ${s}/blog

You’ll receive occasional updates. Your privacy matters.

Unsubscribe: ${a}`;if("sendgrid"===u.provider)return await r(e,t,i,d);if("mailgun"===u.provider)return await l(e,t,i,d);if("ses"===u.provider)return await c(e,t,i,d);return console.log("\uD83D\uDCE7 [DEV MODE] Newsletter welcome email:",{to:e,subject:t}),!0}catch(e){return console.error("Failed to send newsletter welcome email:",e),!1}}async function i(e){try{let t="Confirm your subscription to MyBeing",n=(0,o.wf)(e),s="http://localhost:3000",a=`${s}/api/newsletter/confirm?token=${encodeURIComponent(n)}`,i=(0,o.qm)(e),d=`${s}/api/newsletter/unsubscribe?token=${encodeURIComponent(i)}`,p=`
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
        <a class="button" href="${a}">Confirm Subscription</a>
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <div class="footer">
        <p>You’ll receive occasional updates only. Your privacy matters.</p>
        <p style="font-size:12px; margin-top:8px;">No longer wish to receive emails? <a href="${d}" style="color:#6b21a8;">unsubscribe</a>.</p>
      </div>
    </div>
  </body>
  </html>
`,m=`Confirm your subscription to MyBeing

Confirm: ${a}

If you did not request this, ignore this email.

Unsubscribe: ${d}`;if("sendgrid"===u.provider)return await r(e,t,p,m);if("mailgun"===u.provider)return await l(e,t,p,m);if("ses"===u.provider)return await c(e,t,p,m);return console.log("\uD83D\uDCE7 [DEV MODE] Newsletter confirm email:",{to:e,subject:t}),!0}catch(e){return console.error("Failed to send newsletter confirmation email:",e),!1}}async function r(e,t,n,o){if(!u.apiKey)throw Error("SendGrid API key not configured");return(await fetch("https://api.sendgrid.com/v3/mail/send",{method:"POST",headers:{Authorization:`Bearer ${u.apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({personalizations:[{to:[{email:e}]}],from:{email:u.fromEmail,name:u.fromName},subject:t,content:[{type:"text/plain",value:o},{type:"text/html",value:n}]})})).ok}async function l(e,t,n,o){if(!u.apiKey)throw Error("Mailgun API key not configured");let s=process.env.MAILGUN_DOMAIN;if(!s)throw Error("Mailgun domain not configured");let a=new FormData;return a.append("from",`${u.fromName} <${u.fromEmail}>`),a.append("to",e),a.append("subject",t),a.append("text",o),a.append("html",n),(await fetch(`https://api.mailgun.net/v3/${s}/messages`,{method:"POST",headers:{Authorization:`Basic ${Buffer.from(`api:${u.apiKey}`).toString("base64")}`},body:a})).ok}async function c(e,t,n,o){throw Error("AWS SES integration not implemented yet")}function d(e){return`${Date.now()}-${Math.random().toString(36).substring(2)}`}let u={provider:process.env.EMAIL_PROVIDER||"sendgrid",apiKey:process.env.EMAIL_API_KEY,fromEmail:process.env.FROM_EMAIL||"noreply@mybeing.com",fromName:process.env.FROM_NAME||"MyBeing Self-Discovery"}},30372:(e,t,n)=>{n.d(t,{Vq:()=>l,at:()=>r,fr:()=>i,pO:()=>a});let o=[];function s(e){let t=[];return 1===new Set(e).size&&t.push("All respondents answered the same way"),t}function a(e,t,n,s,a,i){let r={id:Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15),quizSlug:e,responses:t,metadata:{completedAt:new Date,userAgent:s?s.replace(/\d+\.\d+\.\d+/g,"X.X.X"):"unknown",sessionId:function(e){let t=0;for(let n=0;n<e.length;n++)t=(t<<5)-t+e.charCodeAt(n),t&=t;return Math.abs(t).toString(36)}(n),totalScore:a,bandResult:i}};o.push(r),console.log("\uD83D\uDCCA [RESEARCH] Anonymous response collected:",{quizSlug:e,responseCount:t.length,totalScore:a,bandResult:i,timestamp:new Date().toISOString()})}function i(e="7d"){let t=new Date,n=new Date;switch(e){case"24h":n.setDate(t.getDate()-1);break;case"30d":n.setDate(t.getDate()-30);break;case"90d":n.setDate(t.getDate()-90);break;case"all":n=new Date(0);break;default:n.setDate(t.getDate()-7)}let a=o.filter(e=>new Date(e.metadata.completedAt)>=n),i=a.length,r={},l={};a.forEach(e=>{let t=e.quizSlug;r[t]=(r[t]||0)+1,void 0!==e.metadata.totalScore&&(l[t]||(l[t]=[]),l[t].push(e.metadata.totalScore))});let c={};Object.entries(l).forEach(([e,t])=>{c[e]=t.reduce((e,t)=>e+t,0)/t.length});let d=a.map(e=>e.metadata.totalScore).filter(e=>void 0!==e),u=d.length>0?d.reduce((e,t)=>e+t,0)/d.length:0,p={};a.forEach(e=>{e.responses.forEach(e=>{p[e.questionId]||(p[e.questionId]={questionText:e.questionText,responses:[],questionType:e.questionType}),p[e.questionId].responses.push(e.answer)})});let m=Object.entries(p).map(([e,t])=>{let n=t.responses,o={};n.forEach(e=>{o[e]=(o[e]||0)+1});let a="scale"===t.questionType?n.reduce((e,t)=>e+("number"==typeof t?t:Number(t)),0)/n.length:void 0;return{questionId:e,questionText:t.questionText,averageScore:a,responseDistribution:o,commonPatterns:s(n)}}),g=a.map(e=>e.metadata.completedAt),h=[],f={},y={};g.forEach(e=>{let t=e.getHours(),n=e.toISOString().split("T")[0];f[t]=(f[t]||0)+1,y[n]=(y[n]||0)+1});let b=Object.entries(f).sort(([,e],[,t])=>t-e).slice(0,3).map(([e])=>parseInt(e)),v=new Set(a.map(e=>e.metadata.sessionId));return v.size>0&&(a.length,v.size),{totalResponses:i,averageScore:parseFloat(u.toFixed(2)),quizBreakdown:r,responsePatterns:m,timeAnalytics:{averageCompletionTime:h.length>0?h.reduce((e,t)=>e+t,0)/h.length:0,peakUsageHours:b,dailyCompletions:y}}}function r(e="json"){return"csv"===e?function(e){if(!e.length)return"";let t=new Set;e.forEach(e=>{e.responses.forEach(e=>{t.add(e.questionId)})});let n=["response_id","quiz_slug","completed_at","total_score","band_result",...Array.from(t).map(e=>`q_${e}`)],o=e.map(e=>{let t={response_id:e.id,quiz_slug:e.quizSlug,completed_at:e.metadata.completedAt.toISOString(),total_score:String(e.metadata.totalScore||""),band_result:e.metadata.bandResult||""};return e.responses.forEach(e=>{t[`q_${e.questionId}`]=String(e.answer)}),n.map(e=>`"${String(t[e]||"").replace(/"/g,'""')}"`).join(",")});return[n.join(","),...o].join("\n")}(o):JSON.stringify(o.map(e=>({...e,metadata:{...e.metadata,userAgent:"sanitized",sessionId:"anonymized"}})),null,2)}function l(e,t="all"){let n=new Date,a=new Date(0);switch(t){case"24h":a.setDate(n.getDate()-1);break;case"7d":a.setDate(n.getDate()-7);break;case"30d":a.setDate(n.getDate()-30);break;case"90d":a.setDate(n.getDate()-90);break;default:a=new Date(0)}let i=o.filter(t=>t.quizSlug===e&&new Date(t.metadata.completedAt)>=a);if(0===i.length)return{totalCompletions:0,averageScore:0,scoreDistribution:{},scoreDistributionDetailed:{},commonResponsePatterns:[],improvementSuggestions:[],questionStats:{},completionTrend:[],completionRate:0,averageCompletionTime:0,timeRange:{start:a.toISOString(),end:n.toISOString(),label:t}};let r=i.length,l=i.map(e=>e.metadata.totalScore).filter(e=>void 0!==e),c=l.length>0?l.reduce((e,t)=>e+t,0)/l.length:0,d={};i.forEach(e=>{e.responses.forEach(e=>{d[e.questionId]||(d[e.questionId]={questionText:e.questionText,type:e.questionType,averageResponse:0,responseDistribution:{},skipped:0});let t=d[e.questionId].responseDistribution,n=String(e.answer);if(t[n]=(t[n]||0)+1,"scale"===e.questionType&&"number"==typeof e.answer){let n=d[e.questionId].averageResponse||0,o=Object.values(t).reduce((e,t)=>e+t,0);d[e.questionId].averageResponse=(n*(o-1)+e.answer)/o}})});let u={};i.forEach(e=>{let t=e.metadata.completedAt.toISOString().split("T")[0];u[t]=(u[t]||0)+1});let p=Object.entries(u).sort(([e],[t])=>e.localeCompare(t)).map(([e,t])=>({date:e,count:t})),m={},g={};i.forEach(e=>{if(e.metadata.bandResult){let t=e.metadata.bandResult;g[t]=(g[t]||0)+1,m[t]||(m[t]={count:0,percentage:0}),m[t].count++}}),Object.keys(m).forEach(e=>{m[e].percentage=r>0?m[e].count/r*100:0});let h=s(i.flatMap(e=>e.responses.map(e=>e.answer)));return{totalCompletions:r,averageScore:parseFloat(c.toFixed(2)),scoreDistribution:g,scoreDistributionDetailed:m,commonResponsePatterns:h,improvementSuggestions:["Consider adding more questions to assess different dimensions","Review questions with low response variance","Check for any ambiguous or confusing questions"],questionStats:d,completionTrend:p,completionRate:r>0?100:0,averageCompletionTime:0,timeRange:{start:a.toISOString(),end:n.toISOString(),label:t}}}},36522:(e,t,n)=>{n.d(t,{qm:()=>r,r_:()=>l,wf:()=>c,xX:()=>d});var o=n(84770);function s(e){return(Buffer.isBuffer(e)?e:Buffer.from(e,"utf8")).toString("base64").replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function a(e){let t=4-(e.length%4||4),n=e.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat(t%4);return Buffer.from(n,"base64").toString("utf8")}function i(){return process.env.UNSUBSCRIBE_SECRET||process.env.NEXTAUTH_SECRET||"development-secret"}function r(e,t=30){let n=Math.floor(Date.now()/1e3)+86400*t,a=s(e),r=`${a}.${n}`,l=s((0,o.createHmac)("sha256",i()).update(r).digest());return`${a}.${n}.${l}`}function l(e){try{let t=e.split(".");if(3!==t.length)return{valid:!1,reason:"Malformed token"};let[n,r,l]=t,c=parseInt(r,10);if(!c||c<Math.floor(Date.now()/1e3))return{valid:!1,reason:"Token expired"};let d=`${n}.${c}`,u=(0,o.createHmac)("sha256",i()).update(d).digest(),p=s(u);if(!(0,o.timingSafeEqual)(Buffer.from(p),Buffer.from(l)))return{valid:!1,reason:"Invalid signature"};let m=a(n).toLowerCase().trim();return{valid:!0,email:m}}catch(e){return{valid:!1,reason:"Verification error"}}}function c(e,t=7){let n=Math.floor(Date.now()/1e3)+86400*t,a=s(e),r=`confirm:${a}.${n}`,l=s((0,o.createHmac)("sha256",i()).update(r).digest());return`${a}.${n}.${l}`}function d(e){try{let t=e.split(".");if(3!==t.length)return{valid:!1,reason:"Malformed token"};let[n,r,l]=t,c=parseInt(r,10);if(!c||c<Math.floor(Date.now()/1e3))return{valid:!1,reason:"Token expired"};let d=`confirm:${n}.${c}`,u=(0,o.createHmac)("sha256",i()).update(d).digest(),p=s(u);if(!(0,o.timingSafeEqual)(Buffer.from(p),Buffer.from(l)))return{valid:!1,reason:"Invalid signature"};let m=a(n).toLowerCase().trim();return{valid:!0,email:m}}catch(e){return{valid:!1,reason:"Verification error"}}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),o=t.X(0,[8948,5972],()=>n(32774));module.exports=o})();