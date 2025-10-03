"use strict";(()=>{var e={};e.id=3703,e.ids=[3703],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5742:(e,t,o)=>{o.r(t),o.d(t,{originalPathname:()=>c,patchFetch:()=>x,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d});var r={};o.r(r),o.d(r,{GET:()=>n});var a=o(49303),s=o(88716),l=o(60670),i=o(87070);async function n(){let e=`User-agent: *
Allow: /

# Sitemap
Sitemap: http://localhost:3000/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow important pages
Allow: /
Allow: /about
Allow: /research
Allow: /blog
Allow: /quizzes
Allow: /blog/*
Allow: /quizzes/*`;return new i.NextResponse(e,{headers:{"Content-Type":"text/plain","Cache-Control":"public, s-maxage=86400, stale-while-revalidate=604800"}})}let p=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/robots.txt/route",pathname:"/robots.txt",filename:"route",bundlePath:"app/robots.txt/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/robots.txt/route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:u,staticGenerationAsyncStorage:d,serverHooks:m}=p,c="/robots.txt/route";function x(){return(0,l.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}}};var t=require("../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),r=t.X(0,[8948,5972],()=>o(5742));module.exports=r})();