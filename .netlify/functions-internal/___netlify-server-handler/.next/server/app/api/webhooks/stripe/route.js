"use strict";(()=>{var e={};e.id=798,e.ids=[798],e.modules={53524:e=>{e.exports=require("@prisma/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},61282:e=>{e.exports=require("child_process")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},55315:e=>{e.exports=require("path")},21764:e=>{e.exports=require("util")},20741:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>A,patchFetch:()=>L,requestAsyncStorage:()=>U,routeModule:()=>k,serverHooks:()=>$,staticGenerationAsyncStorage:()=>C});var r,i={};a.r(i),a.d(i,{POST:()=>R});var o=a(49303),s=a(88716),n=a(60670),c=a(87070),u=a(89403),p=a(86287),l=a(64339),d=a(9487);!function(e){e.SUBSCRIPTION_WELCOME="subscription_welcome",e.SUBSCRIPTION_CANCELLED="subscription_cancelled",e.SUBSCRIPTION_REACTIVATED="subscription_reactivated",e.PAYMENT_SUCCESS="payment_success",e.PAYMENT_FAILED="payment_failed",e.PURCHASE_RECEIPT="purchase_receipt",e.QUIZ_RESULTS="quiz_results",e.NEWSLETTER="newsletter",e.WELCOME="welcome"}(r||(r={}));let m={subscription_welcome:{subject:"Welcome to MyBeing Premium! \uD83C\uDF89",template:e=>`
      <h1>Welcome to MyBeing Premium, ${e.name}!</h1>
      <p>Thank you for subscribing. Your premium membership is now active.</p>
      <h2>What's Included:</h2>
      <ul>
        <li>2 free quizzes per month (up to $50 value each)</li>
        <li>3 premium articles per month</li>
        <li>Unlimited AI conversations</li>
        <li>Personalized content curation</li>
        <li>Progress tracking</li>
        <li>Subscriber discounts on additional content</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_URL}/dashboard">Go to Your Dashboard</a></p>
    `},subscription_cancelled:{subject:"Your MyBeing Subscription Has Been Cancelled",template:e=>`
      <h1>We're sorry to see you go, ${e.name}</h1>
      <p>Your premium subscription has been cancelled. You'll continue to have access until the end of your billing period.</p>
      <p>We'd love to hear your feedback on how we can improve.</p>
      <p><a href="${process.env.NEXT_PUBLIC_URL}/feedback">Share Your Feedback</a></p>
    `},subscription_reactivated:{subject:"Welcome Back to MyBeing Premium!",template:e=>`
      <h1>Welcome back, ${e.name}! 🎉</h1>
      <p>Your premium subscription has been reactivated. We're glad to have you back!</p>
      <p><a href="${process.env.NEXT_PUBLIC_URL}/dashboard">Go to Your Dashboard</a></p>
    `},payment_success:{subject:"Payment Successful - MyBeing Premium",template:e=>`
      <h1>Payment Received</h1>
      <p>Hi ${e.name},</p>
      <p>We've successfully processed your payment of $${e.amount}.</p>
      ${e.invoiceUrl?`<p><a href="${e.invoiceUrl}">View Invoice</a></p>`:""}
      <p>Thank you for being a premium member!</p>
    `},payment_failed:{subject:"Payment Failed - Action Required",template:e=>`
      <h1>Payment Failed</h1>
      <p>Hi ${e.name},</p>
      <p>We were unable to process your payment of $${e.amount}.</p>
      <p>Please update your payment method to continue your premium membership.</p>
      <p><a href="${process.env.NEXT_PUBLIC_URL}/account/billing">Update Payment Method</a></p>
    `},purchase_receipt:{subject:"Purchase Receipt - MyBeing",template:e=>`
      <h1>Purchase Confirmation</h1>
      <p>Hi ${e.name},</p>
      <p>Thank you for your purchase!</p>
      <h2>Order Details:</h2>
      <p><strong>${"quiz"===e.itemType?"Quiz":"Article"}:</strong> ${e.itemTitle}</p>
      <p><strong>Amount:</strong> $${e.amount}</p>
      <p><a href="${process.env.NEXT_PUBLIC_URL}/${"quiz"===e.itemType?"quizzes":"articles"}/${e.itemId}">Access Your ${"quiz"===e.itemType?"Quiz":"Article"}</a></p>
    `},quiz_results:{subject:"Your Quiz Results - MyBeing",template:e=>`
      <h1>Your Quiz Results: ${e.quizTitle}</h1>
      <p>Hi ${e.name},</p>
      <p>You've completed "${e.quizTitle}". Here's a summary of your results:</p>
      <div style="padding: 20px; background: #f5f5f5; border-radius: 8px; margin: 20px 0;">
        <h2>${e.band}</h2>
        <p>${e.summary}</p>
      </div>
      <p><a href="${process.env.NEXT_PUBLIC_URL}/quizzes/${e.quizSlug}/results/${e.runId}">View Full Results</a></p>
      <p>Want to dive deeper? Chat with our AI about your results!</p>
    `},welcome:{subject:"Welcome to MyBeing!",template:e=>`
      <h1>Welcome to MyBeing, ${e.name}!</h1>
      <p>We're excited to have you on your self-discovery journey.</p>
      <h2>Get Started:</h2>
      <ul>
        <li><a href="${process.env.NEXT_PUBLIC_URL}/quizzes">Take your first quiz</a></li>
        <li><a href="${process.env.NEXT_PUBLIC_URL}/articles">Explore our articles</a></li>
        <li><a href="${process.env.NEXT_PUBLIC_URL}/subscribe">Learn about Premium</a></li>
      </ul>
      <p>Have questions? Just reply to this email.</p>
    `},newsletter:{subject:"MyBeing Newsletter",template:e=>`
      <h1>MyBeing Newsletter</h1>
      <p>Hi ${e.name},</p>
      ${e.content}
    `}};async function h({to:e,type:t,data:a,userId:r}){let i=m[t];if(!i)return console.error(`Email template not found: ${t}`),!1;let o=i.subject,s=i.template(a),n=await d._.emailLog.create({data:{userId:r,email:e,type:t,subject:o,status:"pending",metadata:JSON.stringify(a)}});try{let t=process.env.EMAIL_PROVIDER||"sendgrid";if("sendgrid"===t)await _(e,o,s);else if("postmark"===t)await y(e,o,s);else if("console"===t)console.log("\uD83D\uDCE7 Email:",{to:e,subject:o,htmlContent:s});else throw Error(`Unknown email provider: ${t}`);return await d._.emailLog.update({where:{id:n.id},data:{status:"sent",provider:t,sentAt:new Date}}),!0}catch(e){return console.error("Failed to send email:",e),await d._.emailLog.update({where:{id:n.id},data:{status:"failed",errorMessage:e.message||String(e)}}),!1}}async function _(e,t,a){let r=process.env.SENDGRID_API_KEY;if(!r)throw Error("SENDGRID_API_KEY not configured");let i=await fetch("https://api.sendgrid.com/v3/mail/send",{method:"POST",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"},body:JSON.stringify({personalizations:[{to:[{email:e}]}],from:{email:process.env.EMAIL_FROM||"noreply@mybeing.app",name:"MyBeing"},subject:t,content:[{type:"text/html",value:a}]})});if(!i.ok){let e=await i.text();throw Error(`SendGrid error: ${e}`)}}async function y(e,t,a){let r=process.env.POSTMARK_API_KEY;if(!r)throw Error("POSTMARK_API_KEY not configured");let i=await fetch("https://api.postmarkapp.com/email",{method:"POST",headers:{"X-Postmark-Server-Token":r,"Content-Type":"application/json"},body:JSON.stringify({From:process.env.EMAIL_FROM||"noreply@mybeing.app",To:e,Subject:t,HtmlBody:a,MessageStream:"outbound"})});if(!i.ok){let e=await i.text();throw Error(`Postmark error: ${e}`)}}async function b(e){await I(e);try{switch(e.type){case"checkout.session.completed":await f(e.data.object);break;case"customer.subscription.created":await w(e.data.object);break;case"customer.subscription.updated":await E(e.data.object);break;case"customer.subscription.deleted":await v(e.data.object);break;case"invoice.payment_succeeded":await g(e.data.object);break;case"invoice.payment_failed":await P(e.data.object);break;default:console.log(`Unhandled event type: ${e.type}`)}await T(e.id)}catch(t){throw console.error(`Error processing webhook ${e.id}:`,t),await S(e.id,t),t}}async function f(e){let t=e.metadata?.userId||e.client_reference_id;if(!t){console.error("No userId in checkout session metadata");return}let a=await d._.user.findUnique({where:{id:t}});if(!a){console.error(`User not found: ${t}`);return}if("subscription"===e.mode&&e.subscription){let i=e.subscription,o=await u.Ag.subscriptions.retrieve(i);await (0,p.XW)(t,o.customer,o.id,o.items.data[0]?.price.id),await h({to:a.email,type:r.SUBSCRIPTION_WELCOME,data:{name:a.name||a.email,subscriptionId:o.id}})}if("payment"===e.mode&&e.metadata){let{itemType:i,itemId:o,itemTitle:s}=e.metadata,n=e.amount_total?e.amount_total/100:0;i&&o&&(await (0,l.oP)({userId:t,type:i,itemId:o,itemTitle:s||o,basePrice:n,pricePaid:n,paymentMethod:"stripe",stripePaymentId:e.payment_intent,metadata:{checkoutSessionId:e.id}}),await h({to:a.email,type:r.PURCHASE_RECEIPT,data:{name:a.name||a.email,itemType:i,itemTitle:s||o,amount:n}}))}}async function w(e){console.log(`Subscription created: ${e.id}`)}async function E(e){if(await (0,p.kk)(e.id,{status:e.status,currentPeriodStart:new Date(1e3*e.current_period_start),currentPeriodEnd:new Date(1e3*e.current_period_end),cancelAtPeriodEnd:e.cancel_at_period_end}),!e.cancel_at_period_end&&"active"===e.status){let t=await (0,p.uF)(e.id);if(t){let e=await d._.user.findUnique({where:{id:t.userId}});e&&await h({to:e.email,type:r.SUBSCRIPTION_REACTIVATED,data:{name:e.name||e.email}})}}}async function v(e){await (0,p.kk)(e.id,{status:"cancelled"});let t=await (0,p.uF)(e.id);if(t){let e=await d._.user.findUnique({where:{id:t.userId}});e&&await h({to:e.email,type:r.SUBSCRIPTION_CANCELLED,data:{name:e.name||e.email}})}}async function g(e){let t=e.subscription;if(t){let a=await (0,p.uF)(t);if(a){let t=await d._.user.findUnique({where:{id:a.userId}});t&&await h({to:t.email,type:r.PAYMENT_SUCCESS,data:{name:t.name||t.email,amount:e.amount_paid/100,invoiceUrl:e.hosted_invoice_url}})}}}async function P(e){let t=e.subscription;if(t){let a=await (0,p.uF)(t);if(a){let i=await d._.user.findUnique({where:{id:a.userId}});i&&await h({to:i.email,type:r.PAYMENT_FAILED,data:{name:i.name||i.email,amount:e.amount_due/100}}),await (0,p.kk)(t,{status:"past_due"})}}}async function I(e){await d._.webhookEvent.create({data:{provider:"stripe",eventType:e.type,eventId:e.id,payload:JSON.stringify(e),processed:!1}})}async function T(e){await d._.webhookEvent.updateMany({where:{eventId:e},data:{processed:!0,processedAt:new Date}})}async function S(e,t){await d._.webhookEvent.updateMany({where:{eventId:e},data:{errorMessage:t.message||String(t),retryCount:{increment:1}}})}async function R(e){try{let t=await e.text(),a=e.headers.get("stripe-signature");if(!a)return c.NextResponse.json({error:"Missing stripe-signature header"},{status:400});let r=function(e,t){let a=process.env.STRIPE_WEBHOOK_SECRET;if(!a)throw Error("STRIPE_WEBHOOK_SECRET not configured");try{return u.Ag.webhooks.constructEvent(e,t,a)}catch(e){throw console.error("Webhook signature verification failed:",e),e}}(t,a);return await b(r),c.NextResponse.json({received:!0})}catch(e){return console.error("Stripe webhook error:",e),c.NextResponse.json({error:e.message||"Webhook handler failed"},{status:400})}}let k=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/webhooks/stripe/route",pathname:"/api/webhooks/stripe",filename:"route",bundlePath:"app/api/webhooks/stripe/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/api/webhooks/stripe/route.ts",nextConfigOutput:"standalone",userland:i}),{requestAsyncStorage:U,staticGenerationAsyncStorage:C,serverHooks:$}=k,A="/api/webhooks/stripe/route";function L(){return(0,n.patchFetch)({serverHooks:$,staticGenerationAsyncStorage:C})}},89403:(e,t,a)=>{a.d(t,{Ag:()=>i,Mc:()=>s});var r=a(39256);if(!process.env.STRIPE_SECRET_KEY)throw Error("STRIPE_SECRET_KEY is not defined in environment variables");let i=new r.Z(process.env.STRIPE_SECRET_KEY,{apiVersion:"2025-02-24.acacia",typescript:!0}),o={priceId:process.env.STRIPE_PRICE_ID||"",successUrl:process.env.NEXT_PUBLIC_URL+"/subscribe/success",cancelUrl:process.env.NEXT_PUBLIC_URL+"/subscribe",currency:"usd",billingInterval:"month"};async function s({userId:e,userEmail:t,successUrl:a,cancelUrl:r}){return await i.checkout.sessions.create({mode:"subscription",payment_method_types:["card"],line_items:[{price:o.priceId,quantity:1}],customer_email:t,client_reference_id:e,metadata:{userId:e},success_url:a||o.successUrl,cancel_url:r||o.cancelUrl,subscription_data:{metadata:{userId:e}},allow_promotion_codes:!0})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[8948,5972,9256,6458,4339],()=>a(20741));module.exports=r})();