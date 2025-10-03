"use strict";(()=>{var e={};e.id=2287,e.ids=[2287],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},92048:e=>{e.exports=require("fs")},55315:e=>{e.exports=require("path")},26484:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>h,patchFetch:()=>x,requestAsyncStorage:()=>d,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>g});var i={};r.r(i),r.d(i,{GET:()=>u});var s=r(49303),n=r(88716),a=r(60670),o=r(87070),l=r(4745);function p(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}async function u(){try{let e="http://localhost:3000",t=Date.now(),r=(0,l.y8)().filter(e=>!1!==e.published&&e.publishedAt.getTime()<=t).sort((e,t)=>t.publishedAt.getTime()-e.publishedAt.getTime()).slice(0,50).map(t=>{let r=`${e}/blog/${t.slug}`,i=t.publishedAt.toUTCString(),s=p(t.title),n=p(t.metaDescription||t.excerpt||""),a=(t.tags||[]).map(e=>`<category>${p(e)}</category>`).join("");return`  <item>
    <title>${s}</title>
    <link>${r}</link>
    <guid isPermaLink="true">${r}</guid>
    <pubDate>${i}</pubDate>
    <description>${n}</description>
    ${a}
  </item>`}).join("\n"),i=`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>MyBeing Articles</title>
    <link>${e}/blog</link>
    <description>Research-backed articles on psychology, behavior, and personal growth.</description>
    <language>en-us</language>
${r}
  </channel>
</rss>`;return new o.NextResponse(i,{headers:{"Content-Type":"application/rss+xml; charset=utf-8","Cache-Control":"public, s-maxage=1800, stale-while-revalidate=86400"}})}catch(e){return new o.NextResponse("RSS generation failed",{status:500})}}let c=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/rss.xml/route",pathname:"/rss.xml",filename:"route",bundlePath:"app/rss.xml/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/rss.xml/route.ts",nextConfigOutput:"standalone",userland:i}),{requestAsyncStorage:d,staticGenerationAsyncStorage:g,serverHooks:m}=c,h="/rss.xml/route";function x(){return(0,a.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:g})}}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[8948,5972,4745],()=>r(26484));module.exports=i})();