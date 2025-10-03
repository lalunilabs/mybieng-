"use strict";(()=>{var e={};e.id=744,e.ids=[744],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},54524:(e,t,s)=>{s.r(t),s.d(t,{originalPathname:()=>m,patchFetch:()=>f,requestAsyncStorage:()=>h,routeModule:()=>p,serverHooks:()=>y,staticGenerationAsyncStorage:()=>g});var n={};s.r(n),s.d(n,{POST:()=>d});var o=s(49303),r=s(88716),a=s(60670),i=s(87070),c=s(26729),l=s(65630),u=s(99186);async function d(e){try{let t;try{t=await e.json()}catch{return i.NextResponse.json({error:"Invalid JSON in request body"},{status:400})}let s=l.Ry({sessionId:l.Z_().min(1).max(200),message:l.Z_().min(1).max(1e3),conversationHistory:l.IX(l.Ry({role:l.Km(["user","assistant"]),content:l.Z_().min(1).max(1e3)})).max(20).optional()}).safeParse(t);if(!s.success)return i.NextResponse.json({error:"Invalid request",details:s.error.flatten()},{status:400});let{sessionId:n,message:o,conversationHistory:r=[]}=s.data,a=(0,u.Z$)(o),d=await (0,c.X)(a,{score:65,band:"Moderate Dissonance",bandDescription:"Some tension exists between your beliefs and behaviors.",keyInsights:[{pattern:"Justification Patterns",description:"You show moderate tendency to rationalize decisions that conflict with your values.",actionableAdvice:'Practice the "pause and reflect" technique when you notice quick justifications.',relatedContent:["mental-tug-of-war-cognitive-dissonance"]}],personalizedMessage:"Your cognitive dissonance score suggests some normal tension between ideals and reality.",recommendedActions:["Keep a brief daily log of value-action conflicts",'Practice the "values check" before major decisions',"Experiment with one small behavior change that aligns with your values"],nextSteps:["Take the Stress Patterns quiz","Read our blog post on cognitive dissonance","Set up weekly reflection time"]},r);return new i.NextResponse(JSON.stringify({response:d,sessionId:n}),{status:200,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}})}catch(e){return console.error("Chat API error:",e),i.NextResponse.json({error:"Failed to generate response"},{status:500})}}let p=new o.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/api/chat/route.ts",nextConfigOutput:"standalone",userland:n}),{requestAsyncStorage:h,staticGenerationAsyncStorage:g,serverHooks:y}=p,m="/api/chat/route";function f(){return(0,a.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:g})}},26729:(e,t,s)=>{async function n(e,t){if(process.env.OPENAI_API_KEY)try{return await o(e,t)}catch(e){console.error("OpenAI analysis failed, falling back to local analysis:",e)}return"cognitive-dissonance"===e?function(e){let t=e.filter(e=>"scale"===e.questionType),s=Math.round(t.reduce((e,t)=>e+t.answer,0)/(5*t.length)*100),n="Low Dissonance",o="You tend to maintain consistency between values and actions.";return s>40&&(n="Moderate Dissonance",o="Some tension exists between your beliefs and behaviors."),s>70&&(n="High Dissonance",o="Frequent conflicts between values and actions may be causing stress."),{score:s,band:n,bandDescription:o,keyInsights:[{pattern:"Justification Patterns",description:"Based on your responses, you show moderate tendency to rationalize decisions that conflict with your values.",actionableAdvice:'Practice the "pause and reflect" technique: when you notice yourself making quick justifications, take a moment to examine the underlying value conflict.',relatedContent:["mental-tug-of-war-cognitive-dissonance"]},{pattern:"Value-Action Alignment",description:"Your responses suggest some areas where your actions and values may not be fully aligned.",actionableAdvice:"Identify your top 3 core values and track for one week how often your daily decisions align with these values.",relatedContent:["tracking-stress-patterns"]}],personalizedMessage:`Your cognitive dissonance score of ${s} suggests ${o.toLowerCase()} This is completely normal - we all experience some tension between our ideals and reality. The key is developing awareness of these patterns so you can make more intentional choices.`,recommendedActions:["Keep a brief daily log of moments when you felt torn between what you wanted to do and what you thought you should do",'Practice the "values check" - before major decisions, ask yourself which of your core values this choice supports',"Experiment with one small behavior change that better aligns with your stated values"],nextSteps:["Take the Stress Patterns quiz to understand how this tension might be affecting your well-being","Read our blog post on cognitive dissonance patterns","Consider setting up weekly reflection time to process value-action conflicts"]}}(t):"stress-patterns"===e?function(e){let t=e.filter(e=>"scale"===e.questionType),s=Math.round(t.reduce((e,t)=>e+t.answer,0)/(5*t.length)*100),n="Low Stress",o="Your stress levels appear manageable.";return s>50&&(n="Moderate Stress",o="Some stress patterns worth monitoring."),s>75&&(n="High Stress",o="Consider stress management strategies."),{score:s,band:n,bandDescription:o,keyInsights:[{pattern:"Sleep Quality Impact",description:"Your sleep quality responses indicate this may be a key factor in your stress patterns.",actionableAdvice:"Focus on sleep hygiene: consistent bedtime, no screens 1 hour before sleep, and a cool, dark environment.",relatedContent:["tracking-stress-patterns"]}],personalizedMessage:`Your stress assessment reveals ${o.toLowerCase()} Remember, stress is information - it tells us about what matters to us and where we might need to make adjustments.`,recommendedActions:["Track your stress triggers for one week using a simple 1-5 scale","Identify your most effective stress relief activities and schedule them proactively","Practice one micro-recovery technique (deep breathing, brief walk, etc.) daily"],nextSteps:["Consider taking the Cognitive Dissonance quiz to explore any value conflicts contributing to stress","Read our stress management research articles","Set up a weekly stress pattern review"]}}(t):function(e){let t=e.filter(e=>"scale"===e.questionType);return{score:Math.round(t.reduce((e,t)=>e+t.answer,0)/(5*t.length)*100),band:"Assessment Complete",bandDescription:"Your responses have been analyzed for patterns and insights.",keyInsights:[{pattern:"Response Patterns",description:"Your responses show thoughtful consideration of the questions.",actionableAdvice:"Continue reflecting on these areas for personal growth.",relatedContent:[]}],personalizedMessage:"Thank you for taking the time to reflect on these important questions. Self-awareness is the first step toward positive change.",recommendedActions:["Reflect on your responses and identify one area for growth","Consider how these insights apply to your daily life","Share your insights with someone you trust"],nextSteps:["Explore our other assessments for additional insights","Read related blog posts for deeper understanding","Consider retaking this assessment in a few weeks to track changes"]}}(t)}async function o(e,t){let s=process.env.OPENAI_API_KEY,n=process.env.OPENAI_MODEL||"gpt-4",o=`You are a psychology expert analyzing quiz responses for the MyBeing self-discovery platform. 

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
}`,r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json"},body:JSON.stringify({model:n,messages:[{role:"system",content:"You are a psychology expert providing non-judgmental, research-backed insights for self-discovery. Focus on patterns and growth opportunities, not deficits."},{role:"user",content:o}],temperature:.7,max_tokens:1500})});if(!r.ok)throw Error(`OpenAI API error: ${r.statusText}`);let a=await r.json(),i=a.choices[0]?.message?.content;if(!i)throw Error("No response from OpenAI");try{return JSON.parse(i)}catch(e){throw console.error("Failed to parse OpenAI response:",e),Error("Invalid AI response format")}}async function r(e,t,s){if(process.env.OPENAI_API_KEY)try{return await a(e,t,s)}catch(e){console.error("OpenAI chat failed, falling back to local responses:",e)}let n=e.toLowerCase();if(n.includes("score")||n.includes("result"))return`Your score of ${t.score} places you in the "${t.band}" range. ${t.bandDescription} This means ${t.personalizedMessage}`;if(n.includes("what")&&n.includes("do"))return`Based on your results, here are some specific actions you can take:

${t.recommendedActions.map(e=>`• ${e}`).join("\n")}

Would you like me to elaborate on any of these suggestions?`;if(n.includes("pattern")||n.includes("insight")){let e=t.keyInsights.map(e=>`**${e.pattern}**: ${e.description} ${e.actionableAdvice}`).join("\n\n");return`Here are the key patterns I identified in your responses:

${e}`}return n.includes("next")||n.includes("step")?`Here are your recommended next steps:

${t.nextSteps.map(e=>`• ${e}`).join("\n")}

Which of these resonates most with you?`:`I'm here to help you understand your quiz results better. You can ask me about:

• Your score and what it means
• Specific patterns in your responses
• Actionable steps you can take
• How to apply these insights to your daily life

What would you like to explore?`}async function a(e,t,s){let n=process.env.OPENAI_API_KEY,o=process.env.OPENAI_MODEL||"gpt-4",r=[{role:"system",content:`You are a supportive psychology expert helping someone understand their quiz results from MyBeing, a self-discovery platform. 

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
- No medical advice - focus on behavioral patterns and personal growth`},...s,{role:"user",content:e}],a=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json"},body:JSON.stringify({model:o,messages:r,temperature:.8,max_tokens:800})});if(!a.ok)throw Error(`OpenAI API error: ${a.statusText}`);let i=await a.json();return i.choices[0]?.message?.content||"I apologize, but I encountered an error. Please try asking your question again."}s.d(t,{X:()=>r,o:()=>n})}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),n=t.X(0,[8948,5972,5630,9186],()=>s(54524));module.exports=n})();