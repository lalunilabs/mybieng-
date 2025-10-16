"use strict";(()=>{var e={};e.id=4712,e.ids=[4712],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},29789:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>y,patchFetch:()=>x,requestAsyncStorage:()=>h,routeModule:()=>m,serverHooks:()=>g,staticGenerationAsyncStorage:()=>f});var s={};r.r(s),r.d(s,{POST:()=>c});var i=r(49303),a=r(88716),n=r(60670),o=r(87070),d=r(96458);let l=new Map,p=new Map;function u(e,t){let r=Date.now(),s=e.get(t);return!s||r>s.resetAt?(e.set(t,{count:1,resetAt:r+6e5}),{allowed:!0,remaining:4}):s.count>=5?{allowed:!1,remaining:0,resetAt:s.resetAt}:(s.count+=1,{allowed:!0,remaining:5-s.count})}async function c(e){try{let{email:t,quizId:r,quizTitle:s,score:i,maxScore:a,band:n}=await e.json();if(!t||!r||!s||"number"!=typeof i||"number"!=typeof a)return o.NextResponse.json({error:"Invalid payload"},{status:400});let c=(e.headers.get("x-forwarded-for")||"").split(",")[0].trim()||"unknown";if(!u(l,c).allowed)return o.NextResponse.json({error:"Too many requests. Please try again later."},{status:429});let m=t.toLowerCase();if(!u(p,m).allowed)return o.NextResponse.json({error:"Too many requests for this email. Please try again later."},{status:429});let h="http://localhost:3000",f=`${h}/reports/${encodeURIComponent(r)}`,g=(0,d.tF)(i,a),y=n||g?.label||"Your result",x=g?.advice||"We will send you the detailed interpretation, patterns, and next steps.",v=(0,d.D9)(r);if(v?.bands?.length){let e=v.bands.find(e=>e.label.toLowerCase()===y.toLowerCase());e?.advice&&(x=e.advice)}let w=`${s} — Your Report`,b=process.env.EMAIL_FROM||"no-reply@mybeing.in",R=`Summary: ${y}`,A=function(e){let t=(e||"").toLowerCase();return t.includes("cognitive")||t.includes("dissonance")?["Where am I rationalizing a values conflict this week?","What is one small action to realign without major friction?","What value do I want to honor in a tough situation?"]:t.includes("stress")?["Which signal shows up first when stress builds for me?","What is one lever (sleep, movement, breaks) I can steady this week?","What is a small stress amplifier I can reduce for 7 days?"]:["What patterns should I pay attention to next week?","What is one small change that could have outsized benefits?","Which habit can I try for 7 days to test a better pattern?"]}(v?.slug),k=`${h}/apple-touch-icon.png`,I=`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>${w}</title>
          <style>
            body { background: #f8fafc; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; }
            .card { max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; }
            .h1 { font-size: 20px; margin: 0 0 8px; font-weight: 700; }
            .muted { color: #475569; }
            .pill { display:inline-block; background:#ede9fe; color:#6d28d9; padding:4px 10px; border-radius:999px; font-size:12px; font-weight:600; }
            .btn { display:inline-block; background:#6d28d9; color:#fff !important; text-decoration:none; padding:10px 16px; border-radius:12px; font-weight:600; }
            .footer { max-width: 640px; margin: 12px auto; color:#64748b; font-size:12px; }
            .brand { display:flex; align-items:center; gap:10px; margin-bottom: 12px; }
            .brand img { width: 28px; height: 28px; border-radius: 6px; }
            .brand-name { font-weight: 800; letter-spacing: 0.2px; }
            ul { padding-left: 18px; }
          </style>
        </head>
        <body>
          <span style="display:none !important; visibility:hidden; opacity:0; height:0; width:0; overflow:hidden;">${R}</span>
          <div class="card">
            <div class="brand">
              <img src="${k}" alt="MyBeing" />
              <div class="brand-name">MyBeing</div>
            </div>
            <div class="pill">${y}</div>
            <h1 class="h1">${s}</h1>
            <p class="muted">Here is a brief summary of your result. Your detailed report with interpretation, patterns, and next steps is ready.</p>
            <p>${x}</p>
            <p class="muted">When you’re ready, view your report and discuss it with the AI companion.</p>
            <p>
              <a class="btn" href="${f}" target="_blank" rel="noopener noreferrer">View your report</a>
            </p>
            <div style="height:12px"></div>
            <div>
              <div class="muted" style="font-weight:600; margin-bottom:4px;">Suggested questions for the AI</div>
              <ul>
                ${A.map(e=>`<li>${e}</li>`).join("")}
              </ul>
            </div>
          </div>
          <div class="footer">
            You’re receiving this because you requested your report from MyBeing. If this wasn’t you, you can ignore this email.
          </div>
        </body>
      </html>
    `,$=!1,q=[],S=Function("m","return import(m)");if(process.env.RESEND_API_KEY)try{let e=await S("resend"),r=e?.Resend;if(r){let e=new r(process.env.RESEND_API_KEY),s=await e.emails.send({from:b,to:t,subject:w,html:I});s?.id||s?.data?.id?$=!0:s?.error&&q.push(`Resend: ${s.error?.message||"unknown error"}`)}else q.push("Resend module missing Resend export")}catch(e){q.push(`Resend import/send failed: ${e?.message||e}`)}if(!$&&process.env.SENDGRID_API_KEY)try{let e=await S("@sendgrid/mail"),r=e?.default||e;if(r?.setApiKey&&r?.send){r.setApiKey(process.env.SENDGRID_API_KEY);let e=await r.send({to:t,from:b,subject:w,html:I});Array.isArray(e)&&(e[0]?.statusCode||0)>=200&&300>(e[0]?.statusCode||0)?$=!0:q.push("SendGrid returned unexpected response")}else q.push("SendGrid module missing expected exports")}catch(e){q.push(`SendGrid import/send failed: ${e?.message||e}`)}return $||console.info("[email-results] queued (no provider configured)",{email:t,quizId:r,quizTitle:s,score:i,maxScore:a,band:n,errors:q}),o.NextResponse.json({ok:!0,sent:$,providerErrors:q})}catch(e){return console.error("POST /api/quiz/email-results error",e),o.NextResponse.json({error:"Server error"},{status:500})}}let m=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/quiz/email-results/route",pathname:"/api/quiz/email-results",filename:"route",bundlePath:"app/api/quiz/email-results/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/api/quiz/email-results/route.ts",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:h,staticGenerationAsyncStorage:f,serverHooks:g}=m,y="/api/quiz/email-results/route";function x(){return(0,n.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:f})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[8948,5972,6458],()=>r(29789));module.exports=s})();