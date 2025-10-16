"use strict";(()=>{var e={};e.id=4596,e.ids=[4596],e.modules={53524:e=>{e.exports=require("@prisma/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},84770:e=>{e.exports=require("crypto")},92048:e=>{e.exports=require("fs")},55315:e=>{e.exports=require("path")},32774:(e,t,n)=>{n.r(t),n.d(t,{originalPathname:()=>b,patchFetch:()=>v,requestAsyncStorage:()=>f,routeModule:()=>g,serverHooks:()=>h,staticGenerationAsyncStorage:()=>y});var a={};n.r(a),n.d(a,{POST:()=>m});var r=n(49303),o=n(88716),i=n(60670),s=n(87070),l=n(26729),c=n(36119),d=n(30372),u=n(9487),p=n(96458);async function m(e){try{let t=await e.json(),{quizSlug:n,responses:a,userEmail:r}=t;if(t?.sessionId&&t?.quizId){let e=String(t.sessionId),n=String(t.quizId),a=null;if(Array.isArray(t.responses)&&t.responses.length>0)try{a=await (0,l.o)(n,t.responses)}catch(e){a=null}let r="number"==typeof t.score?t.score:a?.score??0,o=Array.isArray(t.responses)&&5*t.responses.filter(e=>e?.questionType==="scale"||e?.questionType==="likert").length||100,i=a?.band?{label:a.band}:(0,p.tF)(r,o),c=await (0,u.s)(()=>u._.quizRun.create({data:{sessionId:e,quizSlug:n,total:r,bandLabel:i?.label||"Reported",metadata:a?JSON.stringify({analysis:a}):void 0,answers:Array.isArray(t.responses)?{create:t.responses.map(e=>({question:e?.questionId||e?.questionText||"q",value:"number"==typeof e?.answer?e.answer:0}))}:void 0},select:{id:!0,createdAt:!0}}),null);if(!c)return s.NextResponse.json({ok:!0,id:"mock-id",createdAt:new Date,analysis:a||void 0});return s.NextResponse.json({ok:!0,id:c.id,createdAt:c.createdAt,analysis:a||void 0})}if(!n||!a||!r)return s.NextResponse.json({error:"Missing required fields: quizSlug, responses, userEmail"},{status:400});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r))return s.NextResponse.json({error:"Invalid email format"},{status:400});let o=String(n),i=await (0,l.o)(o,a),m=e.headers.get("x-session-id")||"anonymous",g=e.headers.get("user-agent")||"unknown";(0,d.pO)(n,a,m,g,i.score,i.band);let f=(0,c._W)({userEmail:r,quizTitle:o,quizSlug:o,analysis:i,completedAt:new Date}),y={userEmail:r,quizTitle:o,quizSlug:o,analysis:i,completedAt:new Date,chatSessionId:f};if(!await (0,c.gx)(y))return s.NextResponse.json({error:"Failed to send results email"},{status:500});return s.NextResponse.json({success:!0,message:"Quiz completed successfully! Check your email for detailed results.",analysis:{score:i.score,band:i.band,bandDescription:i.bandDescription},chatSessionId:f,emailSent:!0})}catch(e){return console.error("Quiz completion error:",e),s.NextResponse.json({error:"Failed to process quiz completion"},{status:500})}}let g=new r.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/quiz/complete/route",pathname:"/api/quiz/complete",filename:"route",bundlePath:"app/api/quiz/complete/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/api/quiz/complete/route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:f,staticGenerationAsyncStorage:y,serverHooks:h}=g,b="/api/quiz/complete/route";function v(){return(0,i.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:y})}},9487:(e,t,n)=>{n.d(t,{_:()=>o,s:()=>i});var a=n(53524);let r=()=>({user:{findMany:async()=>[],findUnique:async()=>null,create:async e=>({id:"mock-user",...e}),count:async()=>0},quizRun:{findMany:async()=>[],findUnique:async()=>null,create:async e=>({id:"mock-run",...e}),count:async()=>0,update:async()=>({}),updateMany:async()=>({})},quizAnswer:{findMany:async()=>[],create:async e=>({id:"mock-answer",...e}),createMany:async()=>({count:0})},subscription:{findUnique:async()=>null,findFirst:async()=>null,findMany:async()=>[],create:async({data:e})=>({id:"mock-sub",...e}),update:async({data:e})=>({id:"mock-sub",...e}),upsert:async({create:e,update:t})=>({id:"mock-sub",...t||e}),delete:async()=>({})},manualDiscount:{findFirst:async()=>null,update:async({data:e})=>({id:"mock-discount",...e}),create:async({data:e})=>({id:"mock-discount",...e})},purchase:{findFirst:async()=>null,findMany:async()=>[],create:async({data:e})=>({id:"mock-purchase",...e}),count:async()=>0},emailLog:{create:async({data:e})=>({id:"mock-email",status:e?.status||"sent",...e}),update:async({where:e,data:t})=>({id:e?.id||"mock-email",...t}),findMany:async()=>[]},newsletter:{create:async e=>({id:"mock-subscriber",...e}),count:async()=>0},$connect:async()=>{},$disconnect:async()=>{},$transaction:async e=>e(void 0)}),o=globalThis.prisma??function(){if(!process.env.DATABASE_URL)return console.warn("No DATABASE_URL found - using mock client"),r();try{return new a.PrismaClient({log:["error"],datasources:{db:{url:process.env.DATABASE_URL}}})}catch(e){return console.error("Failed to create Prisma client:",e),r()}}();async function i(e,t){if(!o)return console.warn("Database not available - returning fallback value"),t;try{return await e()}catch(e){return console.error("Database operation failed:",e),t}}},36119:(e,t,n)=>{n.d(t,{Gk:()=>i,QO:()=>o,_W:()=>d,gx:()=>r});var a=n(36522);async function r(e){try{let{subject:t,html:n,text:a}=function(e){let{analysis:t,quizTitle:n,completedAt:a}=e,r=`Your ${n} Results - MyBeing Self-Discovery`,o=`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${r}</title>
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
      <p>Completed on ${a.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
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
  `;return{subject:r,html:o,text:`
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

Completed on ${a.toLocaleDateString()}

Visit MyBeing: https://mybeing.com
Take Another Quiz: https://mybeing.com/quizzes
Read Our Blog: https://mybeing.com/blog

Your privacy matters - we don't store your responses on our servers.
  `}}(e);if("sendgrid"===u.provider)return await s(e.userEmail,t,n,a);if("mailgun"===u.provider)return await l(e.userEmail,t,n,a);if("ses"===u.provider)return await c(e.userEmail,t,n,a);return console.log("\uD83D\uDCE7 [DEV MODE] Quiz results email:",{to:e.userEmail,subject:t,quizSlug:e.quizSlug,score:e.analysis.score}),!0}catch(e){return console.error("Failed to send quiz results email:",e),!1}}async function o(e){try{let t="Welcome to MyBeing — Let’s begin your self-discovery",n=(0,a.qm)(e),r="http://localhost:3000",o=`${r}/api/newsletter/unsubscribe?token=${encodeURIComponent(n)}`,i=`
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
        <a class="button" href="${r}/quizzes">Explore Quizzes</a>
      </p>
      <div class="footer">
        <p>You’ll receive occasional updates only. Your privacy matters.</p>
        <p style="font-size:12px; margin-top:8px;">If this wasn’t you or you no longer wish to receive emails, <a href="${o}" style="color:#6b21a8;">unsubscribe</a>.</p>
      </div>
    </div>
  </body>
  </html>
`,d=`Welcome to MyBeing!

Thanks for subscribing. You’ll receive research-backed insights and self-discovery quizzes.

Get started: ${r}/quizzes
Blog: ${r}/blog

You’ll receive occasional updates. Your privacy matters.

Unsubscribe: ${o}`;if("sendgrid"===u.provider)return await s(e,t,i,d);if("mailgun"===u.provider)return await l(e,t,i,d);if("ses"===u.provider)return await c(e,t,i,d);return console.log("\uD83D\uDCE7 [DEV MODE] Newsletter welcome email:",{to:e,subject:t}),!0}catch(e){return console.error("Failed to send newsletter welcome email:",e),!1}}async function i(e){try{let t="Confirm your subscription to MyBeing",n=(0,a.wf)(e),r="http://localhost:3000",o=`${r}/api/newsletter/confirm?token=${encodeURIComponent(n)}`,i=(0,a.qm)(e),d=`${r}/api/newsletter/unsubscribe?token=${encodeURIComponent(i)}`,p=`
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
        <a class="button" href="${o}">Confirm Subscription</a>
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

Confirm: ${o}

If you did not request this, ignore this email.

Unsubscribe: ${d}`;if("sendgrid"===u.provider)return await s(e,t,p,m);if("mailgun"===u.provider)return await l(e,t,p,m);if("ses"===u.provider)return await c(e,t,p,m);return console.log("\uD83D\uDCE7 [DEV MODE] Newsletter confirm email:",{to:e,subject:t}),!0}catch(e){return console.error("Failed to send newsletter confirmation email:",e),!1}}async function s(e,t,n,a){if(!u.apiKey)throw Error("SendGrid API key not configured");return(await fetch("https://api.sendgrid.com/v3/mail/send",{method:"POST",headers:{Authorization:`Bearer ${u.apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({personalizations:[{to:[{email:e}]}],from:{email:u.fromEmail,name:u.fromName},subject:t,content:[{type:"text/plain",value:a},{type:"text/html",value:n}]})})).ok}async function l(e,t,n,a){if(!u.apiKey)throw Error("Mailgun API key not configured");let r=process.env.MAILGUN_DOMAIN;if(!r)throw Error("Mailgun domain not configured");let o=new FormData;return o.append("from",`${u.fromName} <${u.fromEmail}>`),o.append("to",e),o.append("subject",t),o.append("text",a),o.append("html",n),(await fetch(`https://api.mailgun.net/v3/${r}/messages`,{method:"POST",headers:{Authorization:`Basic ${Buffer.from(`api:${u.apiKey}`).toString("base64")}`},body:o})).ok}async function c(e,t,n,a){throw Error("AWS SES integration not implemented yet")}function d(e){return`${Date.now()}-${Math.random().toString(36).substring(2)}`}let u={provider:process.env.EMAIL_PROVIDER||"sendgrid",apiKey:process.env.EMAIL_API_KEY,fromEmail:process.env.FROM_EMAIL||"noreply@mybeing.com",fromName:process.env.FROM_NAME||"MyBeing Self-Discovery"}},30372:(e,t,n)=>{n.d(t,{Vq:()=>l,at:()=>s,fr:()=>i,pO:()=>o});let a=[];function r(e){let t=[];return 1===new Set(e).size&&t.push("All respondents answered the same way"),t}function o(e,t,n,r,o,i){let s={id:Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15),quizSlug:e,responses:t,metadata:{completedAt:new Date,userAgent:r?r.replace(/\d+\.\d+\.\d+/g,"X.X.X"):"unknown",sessionId:function(e){let t=0;for(let n=0;n<e.length;n++)t=(t<<5)-t+e.charCodeAt(n),t&=t;return Math.abs(t).toString(36)}(n),totalScore:o,bandResult:i}};a.push(s),console.log("\uD83D\uDCCA [RESEARCH] Anonymous response collected:",{quizSlug:e,responseCount:t.length,totalScore:o,bandResult:i,timestamp:new Date().toISOString()})}function i(e="7d"){let t=new Date,n=new Date;switch(e){case"24h":n.setDate(t.getDate()-1);break;case"30d":n.setDate(t.getDate()-30);break;case"90d":n.setDate(t.getDate()-90);break;case"all":n=new Date(0);break;default:n.setDate(t.getDate()-7)}let o=a.filter(e=>new Date(e.metadata.completedAt)>=n),i=o.length,s={},l={};o.forEach(e=>{let t=e.quizSlug;s[t]=(s[t]||0)+1,void 0!==e.metadata.totalScore&&(l[t]||(l[t]=[]),l[t].push(e.metadata.totalScore))});let c={};Object.entries(l).forEach(([e,t])=>{c[e]=t.reduce((e,t)=>e+t,0)/t.length});let d=o.map(e=>e.metadata.totalScore).filter(e=>void 0!==e),u=d.length>0?d.reduce((e,t)=>e+t,0)/d.length:0,p={};o.forEach(e=>{e.responses.forEach(e=>{p[e.questionId]||(p[e.questionId]={questionText:e.questionText,responses:[],questionType:e.questionType}),p[e.questionId].responses.push(e.answer)})});let m=Object.entries(p).map(([e,t])=>{let n=t.responses,a={};n.forEach(e=>{a[e]=(a[e]||0)+1});let o="scale"===t.questionType?n.reduce((e,t)=>e+("number"==typeof t?t:Number(t)),0)/n.length:void 0;return{questionId:e,questionText:t.questionText,averageScore:o,responseDistribution:a,commonPatterns:r(n)}}),g=o.map(e=>e.metadata.completedAt),f=[],y={},h={};g.forEach(e=>{let t=e.getHours(),n=e.toISOString().split("T")[0];y[t]=(y[t]||0)+1,h[n]=(h[n]||0)+1});let b=Object.entries(y).sort(([,e],[,t])=>t-e).slice(0,3).map(([e])=>parseInt(e)),v=new Set(o.map(e=>e.metadata.sessionId));return v.size>0&&(o.length,v.size),{totalResponses:i,averageScore:parseFloat(u.toFixed(2)),quizBreakdown:s,responsePatterns:m,timeAnalytics:{averageCompletionTime:f.length>0?f.reduce((e,t)=>e+t,0)/f.length:0,peakUsageHours:b,dailyCompletions:h}}}function s(e="json"){return"csv"===e?function(e){if(!e.length)return"";let t=new Set;e.forEach(e=>{e.responses.forEach(e=>{t.add(e.questionId)})});let n=["response_id","quiz_slug","completed_at","total_score","band_result",...Array.from(t).map(e=>`q_${e}`)],a=e.map(e=>{let t={response_id:e.id,quiz_slug:e.quizSlug,completed_at:e.metadata.completedAt.toISOString(),total_score:String(e.metadata.totalScore||""),band_result:e.metadata.bandResult||""};return e.responses.forEach(e=>{t[`q_${e.questionId}`]=String(e.answer)}),n.map(e=>`"${String(t[e]||"").replace(/"/g,'""')}"`).join(",")});return[n.join(","),...a].join("\n")}(a):JSON.stringify(a.map(e=>({...e,metadata:{...e.metadata,userAgent:"sanitized",sessionId:"anonymized"}})),null,2)}function l(e,t="all"){let n=new Date,o=new Date(0);switch(t){case"24h":o.setDate(n.getDate()-1);break;case"7d":o.setDate(n.getDate()-7);break;case"30d":o.setDate(n.getDate()-30);break;case"90d":o.setDate(n.getDate()-90);break;default:o=new Date(0)}let i=a.filter(t=>t.quizSlug===e&&new Date(t.metadata.completedAt)>=o);if(0===i.length)return{totalCompletions:0,averageScore:0,scoreDistribution:{},scoreDistributionDetailed:{},commonResponsePatterns:[],improvementSuggestions:[],questionStats:{},completionTrend:[],completionRate:0,averageCompletionTime:0,timeRange:{start:o.toISOString(),end:n.toISOString(),label:t}};let s=i.length,l=i.map(e=>e.metadata.totalScore).filter(e=>void 0!==e),c=l.length>0?l.reduce((e,t)=>e+t,0)/l.length:0,d={};i.forEach(e=>{e.responses.forEach(e=>{d[e.questionId]||(d[e.questionId]={questionText:e.questionText,type:e.questionType,averageResponse:0,responseDistribution:{},skipped:0});let t=d[e.questionId].responseDistribution,n=String(e.answer);if(t[n]=(t[n]||0)+1,"scale"===e.questionType&&"number"==typeof e.answer){let n=d[e.questionId].averageResponse||0,a=Object.values(t).reduce((e,t)=>e+t,0);d[e.questionId].averageResponse=(n*(a-1)+e.answer)/a}})});let u={};i.forEach(e=>{let t=e.metadata.completedAt.toISOString().split("T")[0];u[t]=(u[t]||0)+1});let p=Object.entries(u).sort(([e],[t])=>e.localeCompare(t)).map(([e,t])=>({date:e,count:t})),m={},g={};i.forEach(e=>{if(e.metadata.bandResult){let t=e.metadata.bandResult;g[t]=(g[t]||0)+1,m[t]||(m[t]={count:0,percentage:0}),m[t].count++}}),Object.keys(m).forEach(e=>{m[e].percentage=s>0?m[e].count/s*100:0});let f=r(i.flatMap(e=>e.responses.map(e=>e.answer)));return{totalCompletions:s,averageScore:parseFloat(c.toFixed(2)),scoreDistribution:g,scoreDistributionDetailed:m,commonResponsePatterns:f,improvementSuggestions:["Consider adding more questions to assess different dimensions","Review questions with low response variance","Check for any ambiguous or confusing questions"],questionStats:d,completionTrend:p,completionRate:s>0?100:0,averageCompletionTime:0,timeRange:{start:o.toISOString(),end:n.toISOString(),label:t}}}},36522:(e,t,n)=>{n.d(t,{qm:()=>s,r_:()=>l,wf:()=>c,xX:()=>d});var a=n(84770);function r(e){return(Buffer.isBuffer(e)?e:Buffer.from(e,"utf8")).toString("base64").replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function o(e){let t=4-(e.length%4||4),n=e.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat(t%4);return Buffer.from(n,"base64").toString("utf8")}function i(){return process.env.UNSUBSCRIBE_SECRET||process.env.NEXTAUTH_SECRET||"development-secret"}function s(e,t=30){let n=Math.floor(Date.now()/1e3)+86400*t,o=r(e),s=`${o}.${n}`,l=r((0,a.createHmac)("sha256",i()).update(s).digest());return`${o}.${n}.${l}`}function l(e){try{let t=e.split(".");if(3!==t.length)return{valid:!1,reason:"Malformed token"};let[n,s,l]=t,c=parseInt(s,10);if(!c||c<Math.floor(Date.now()/1e3))return{valid:!1,reason:"Token expired"};let d=`${n}.${c}`,u=(0,a.createHmac)("sha256",i()).update(d).digest(),p=r(u);if(!(0,a.timingSafeEqual)(Buffer.from(p),Buffer.from(l)))return{valid:!1,reason:"Invalid signature"};let m=o(n).toLowerCase().trim();return{valid:!0,email:m}}catch(e){return{valid:!1,reason:"Verification error"}}}function c(e,t=7){let n=Math.floor(Date.now()/1e3)+86400*t,o=r(e),s=`confirm:${o}.${n}`,l=r((0,a.createHmac)("sha256",i()).update(s).digest());return`${o}.${n}.${l}`}function d(e){try{let t=e.split(".");if(3!==t.length)return{valid:!1,reason:"Malformed token"};let[n,s,l]=t,c=parseInt(s,10);if(!c||c<Math.floor(Date.now()/1e3))return{valid:!1,reason:"Token expired"};let d=`confirm:${n}.${c}`,u=(0,a.createHmac)("sha256",i()).update(d).digest(),p=r(u);if(!(0,a.timingSafeEqual)(Buffer.from(p),Buffer.from(l)))return{valid:!1,reason:"Invalid signature"};let m=o(n).toLowerCase().trim();return{valid:!0,email:m}}catch(e){return{valid:!1,reason:"Verification error"}}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),a=t.X(0,[8948,5972,6458,6729],()=>n(32774));module.exports=a})();