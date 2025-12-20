module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},38214,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),o=e.i(61916),i=e.i(14444),s=e.i(37092),l=e.i(69741),d=e.i(16795),u=e.i(87718),c=e.i(95169),p=e.i(47587),h=e.i(66012),m=e.i(70101),y=e.i(26937),g=e.i(10372),x=e.i(93695);e.i(52474);var R=e.i(5232),v=e.i(45761),f=e.i(64607);let C=f.gql`
  query GetAbandonedCheckouts($first: Int, $query: String) {
    abandonedCheckouts(first: $first, query: $query) {
      edges {
        node {
          id
          createdAt
          updatedAt
          abandonedCheckoutUrl

          customer {
            email
            firstName
            lastName
          }

          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }

          lineItems(first: 10) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  title
                }
                originalUnitPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                originalTotalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                discountedUnitPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                discountedTotalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;async function w(e){try{let t=new URL(e.url),r=parseInt(t.searchParams.get("limit"))||20,{data:a}=await v.default.query({query:C,variables:{first:r,query:"status:open"},fetchPolicy:"network-only"});if(!a?.abandonedCheckouts?.edges)return Response.json({success:!0,data:[],count:0,message:"No abandoned checkouts"});let n=a.abandonedCheckouts.edges.map(e=>{let t=e.node,r=t.totalPriceSet?.shopMoney?.amount??"0",a=t.totalPriceSet?.shopMoney?.currencyCode??"USD",n=new Date(t.createdAt).toLocaleString("en-IN",{weekday:"short",year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),o=t.customer?`${t.customer.firstName||""} ${t.customer.lastName||""}`.trim():"Guest";return{id:t.id,email:t.customer?.email||"No email",customerName:o||"Customer",recoveryUrl:t.abandonedCheckoutUrl,createdAt:n,timestamp:t.createdAt,totalValue:`${a} ${parseFloat(r).toFixed(2)}`,totalNumeric:parseFloat(r),currency:a,items:t.lineItems.edges.map(e=>{let t=e.node,r=t.originalUnitPriceSet.shopMoney.amount,a=t.originalUnitPriceSet.shopMoney.currencyCode;return{id:t.id,title:t.title,variant:t.variant?.title||"",quantity:t.quantity,unitPrice:`${a} ${parseFloat(r).toFixed(2)}`,totalPrice:`${a} ${(parseFloat(r)*t.quantity).toFixed(2)}`,image:t.image?.url||null,altText:t.image?.altText||t.title}})}});return Response.json({success:!0,data:n,count:n.length,fetchedAt:new Date().toISOString()})}catch(e){return console.error(e),Response.json({success:!1,error:e.message},{status:500})}}e.s(["GET",()=>w],67472);var E=e.i(67472);let b=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/abandoned-checkouts/route",pathname:"/api/abandoned-checkouts",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/abandoned-checkouts/route.js",nextConfigOutput:"",userland:E}),{workAsyncStorage:P,workUnitAsyncStorage:A,serverHooks:S}=b;function k(){return(0,a.patchFetch)({workAsyncStorage:P,workUnitAsyncStorage:A})}async function N(e,t,a){b.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/api/abandoned-checkouts/route";v=v.replace(/\/index$/,"")||"/";let f=await b.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!f)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:C,params:w,nextConfig:E,parsedUrl:P,isDraftMode:A,prerenderManifest:S,routerServerContext:k,isOnDemandRevalidate:N,revalidateOnlyGenerated:q,resolvedPathname:T,clientReferenceManifest:M,serverActionsManifest:U}=f,O=(0,l.normalizeAppPath)(v),I=!!(S.dynamicRoutes[O]||S.routes[T]),$=async()=>((null==k?void 0:k.render404)?await k.render404(e,t,P,!1):t.end("This page could not be found"),null);if(I&&!A){let e=!!S.routes[T],t=S.dynamicRoutes[O];if(t&&!1===t.fallback&&!e){if(E.experimental.adapterPath)return await $();throw new x.NoFallbackError}}let _=null;!I||b.isDev||A||(_="/index"===(_=T)?"/":_);let j=!0===b.isDev||!I,H=I&&!j;U&&M&&(0,i.setReferenceManifestsSingleton)({page:v,clientReferenceManifest:M,serverActionsManifest:U,serverModuleMap:(0,s.createServerModuleMap)({serverActionsManifest:U})});let D=e.method||"GET",F=(0,o.getTracer)(),K=F.getActiveScopeSpan(),L={params:w,prerenderManifest:S,renderOpts:{experimental:{authInterrupts:!!E.experimental.authInterrupts},cacheComponents:!!E.cacheComponents,supportsDynamicResponse:j,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:E.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>b.onRequestError(e,t,a,k)},sharedContext:{buildId:C}},G=new d.NodeNextRequest(e),B=new d.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(G,(0,u.signalFromNodeResponse)(t));try{let i=async e=>b.handle(V,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=F.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${D} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${D} ${v}`)}),s=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var o,l;let d=async({previousCacheEntry:r})=>{try{if(!s&&N&&q&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await i(n);e.fetchMetrics=L.renderOpts.fetchMetrics;let l=L.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let d=L.renderOpts.collectedTags;if(!I)return await (0,h.sendResponse)(G,B,o,L.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(o.headers);d&&(t[g.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,a=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await b.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:N})},k),t}},u=await b.handleResponse({req:e,nextConfig:E,cacheKey:_,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:S,isRoutePPREnabled:!1,isOnDemandRevalidate:N,revalidateOnlyGenerated:q,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:s});if(!I)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",N?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,m.fromNodeOutgoingHttpHeaders)(u.value.headers);return s&&I||c.delete(g.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,y.getCacheControlHeader)(u.cacheControl)),await (0,h.sendResponse)(G,B,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};K?await l(K):await F.withPropagatedContext(e.headers,()=>F.trace(c.BaseServerSpan.handleRequest,{spanName:`${D} ${v}`,kind:o.SpanKind.SERVER,attributes:{"http.method":D,"http.target":e.url}},l))}catch(t){if(t instanceof x.NoFallbackError||await b.onRequestError(e,t,{routerKind:"App Router",routePath:O,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:N})}),I)throw t;return await (0,h.sendResponse)(G,B,new Response(null,{status:500})),null}}e.s(["handler",()=>N,"patchFetch",()=>k,"routeModule",()=>b,"serverHooks",()=>S,"workAsyncStorage",()=>P,"workUnitAsyncStorage",()=>A],38214)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__bc18cdb6._.js.map