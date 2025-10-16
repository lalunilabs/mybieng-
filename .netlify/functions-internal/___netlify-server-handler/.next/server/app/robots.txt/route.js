"use strict";(()=>{var e={};e.id=3703,e.ids=[3703],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5742:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>m,patchFetch:()=>x,requestAsyncStorage:()=>d,routeModule:()=>p,serverHooks:()=>w,staticGenerationAsyncStorage:()=>u});var o={};a.r(o),a.d(o,{GET:()=>n});var r=a(49303),i=a(88716),s=a(60670),l=a(87070);async function n(){let e="https://mybeing.in",t=`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /_next/
Disallow: /static/
Disallow: *.json
Disallow: /dashboard/private/

User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /dashboard/private/

User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /dashboard/private/

Sitemap: ${e}/sitemap.xml
Host: ${e}`;return new l.NextResponse(t,{headers:{"Content-Type":"text/plain","Cache-Control":"public, max-age=86400, s-maxage=86400"}})}let p=new r.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/robots.txt/route",pathname:"/robots.txt",filename:"route",bundlePath:"app/robots.txt/route"},resolvedPagePath:"/Users/niharikasai/mybeing/app/robots.txt/route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:d,staticGenerationAsyncStorage:u,serverHooks:w}=p,m="/robots.txt/route";function x(){return(0,s.patchFetch)({serverHooks:w,staticGenerationAsyncStorage:u})}}};var t=require("../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),o=t.X(0,[8948,5972],()=>a(5742));module.exports=o})();