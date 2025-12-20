module.exports=[24361,(a,b,c)=>{b.exports=a.x("util",()=>require("util"))},14747,(a,b,c)=>{b.exports=a.x("path",()=>require("path"))},54799,(a,b,c)=>{b.exports=a.x("crypto",()=>require("crypto"))},88947,(a,b,c)=>{b.exports=a.x("stream",()=>require("stream"))},21517,(a,b,c)=>{b.exports=a.x("http",()=>require("http"))},24836,(a,b,c)=>{b.exports=a.x("https",()=>require("https"))},92509,(a,b,c)=>{b.exports=a.x("url",()=>require("url"))},6461,(a,b,c)=>{b.exports=a.x("zlib",()=>require("zlib"))},27699,(a,b,c)=>{b.exports=a.x("events",()=>require("events"))},22734,(a,b,c)=>{b.exports=a.x("fs",()=>require("fs"))},46786,(a,b,c)=>{b.exports=a.x("os",()=>require("os"))},83497,a=>{"use strict";let b=(0,a.i(70106).default)("package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]]);a.s(["Package",()=>b],83497)},69520,a=>{"use strict";let b=(0,a.i(70106).default)("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);a.s(["RefreshCw",()=>b],69520)},6704,a=>{"use strict";let b,c;var d,e=a.i(72131);let f={data:""},g=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,h=/\/\*[^]*?\*\/|  +/g,i=/\n+/g,j=(a,b)=>{let c="",d="",e="";for(let f in a){let g=a[f];"@"==f[0]?"i"==f[1]?c=f+" "+g+";":d+="f"==f[1]?j(g,f):f+"{"+j(g,"k"==f[1]?"":b)+"}":"object"==typeof g?d+=j(g,b?b.replace(/([^,])+/g,a=>f.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,b=>/&/.test(b)?b.replace(/&/g,a):a?a+" "+b:b)):f):null!=g&&(f=/^--/.test(f)?f:f.replace(/[A-Z]/g,"-$&").toLowerCase(),e+=j.p?j.p(f,g):f+":"+g+";")}return c+(b&&e?b+"{"+e+"}":e)+d},k={},l=a=>{if("object"==typeof a){let b="";for(let c in a)b+=c+l(a[c]);return b}return a};function m(a){let b,c,d=this||{},e=a.call?a(d.p):a;return((a,b,c,d,e)=>{var f;let m=l(a),n=k[m]||(k[m]=(a=>{let b=0,c=11;for(;b<a.length;)c=101*c+a.charCodeAt(b++)>>>0;return"go"+c})(m));if(!k[n]){let b=m!==a?a:(a=>{let b,c,d=[{}];for(;b=g.exec(a.replace(h,""));)b[4]?d.shift():b[3]?(c=b[3].replace(i," ").trim(),d.unshift(d[0][c]=d[0][c]||{})):d[0][b[1]]=b[2].replace(i," ").trim();return d[0]})(a);k[n]=j(e?{["@keyframes "+n]:b}:b,c?"":"."+n)}let o=c&&k.g?k.g:null;return c&&(k.g=k[n]),f=k[n],o?b.data=b.data.replace(o,f):-1===b.data.indexOf(f)&&(b.data=d?f+b.data:b.data+f),n})(e.unshift?e.raw?(b=[].slice.call(arguments,1),c=d.p,e.reduce((a,d,e)=>{let f=b[e];if(f&&f.call){let a=f(c),b=a&&a.props&&a.props.className||/^go/.test(a)&&a;f=b?"."+b:a&&"object"==typeof a?a.props?"":j(a,""):!1===a?"":a}return a+d+(null==f?"":f)},"")):e.reduce((a,b)=>Object.assign(a,b&&b.call?b(d.p):b),{}):e,d.target||f,d.g,d.o,d.k)}m.bind({g:1});let n,o,p,q=m.bind({k:1});function r(a,b){let c=this||{};return function(){let d=arguments;function e(f,g){let h=Object.assign({},f),i=h.className||e.className;c.p=Object.assign({theme:o&&o()},h),c.o=/ *go\d+/.test(i),h.className=m.apply(c,d)+(i?" "+i:""),b&&(h.ref=g);let j=a;return a[0]&&(j=h.as||a,delete h.as),p&&j[0]&&p(h),n(j,h)}return b?b(e):e}}var s=(a,b)=>"function"==typeof a?a(b):a,t=(b=0,()=>(++b).toString()),u="default",v=(a,b)=>{let{toastLimit:c}=a.settings;switch(b.type){case 0:return{...a,toasts:[b.toast,...a.toasts].slice(0,c)};case 1:return{...a,toasts:a.toasts.map(a=>a.id===b.toast.id?{...a,...b.toast}:a)};case 2:let{toast:d}=b;return v(a,{type:+!!a.toasts.find(a=>a.id===d.id),toast:d});case 3:let{toastId:e}=b;return{...a,toasts:a.toasts.map(a=>a.id===e||void 0===e?{...a,dismissed:!0,visible:!1}:a)};case 4:return void 0===b.toastId?{...a,toasts:[]}:{...a,toasts:a.toasts.filter(a=>a.id!==b.toastId)};case 5:return{...a,pausedAt:b.time};case 6:let f=b.time-(a.pausedAt||0);return{...a,pausedAt:void 0,toasts:a.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+f}))}}},w=[],x={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},y={},z=(a,b=u)=>{y[b]=v(y[b]||x,a),w.forEach(([a,c])=>{a===b&&c(y[b])})},A=a=>Object.keys(y).forEach(b=>z(a,b)),B=(a=u)=>b=>{z(b,a)},C={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=a=>(b,c)=>{let d,e=((a,b="blank",c)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:b,ariaProps:{role:"status","aria-live":"polite"},message:a,pauseDuration:0,...c,id:(null==c?void 0:c.id)||t()}))(b,a,c);return B(e.toasterId||(d=e.id,Object.keys(y).find(a=>y[a].toasts.some(a=>a.id===d))))({type:2,toast:e}),e.id},E=(a,b)=>D("blank")(a,b);E.error=D("error"),E.success=D("success"),E.loading=D("loading"),E.custom=D("custom"),E.dismiss=(a,b)=>{let c={type:3,toastId:a};b?B(b)(c):A(c)},E.dismissAll=a=>E.dismiss(void 0,a),E.remove=(a,b)=>{let c={type:4,toastId:a};b?B(b)(c):A(c)},E.removeAll=a=>E.remove(void 0,a),E.promise=(a,b,c)=>{let d=E.loading(b.loading,{...c,...null==c?void 0:c.loading});return"function"==typeof a&&(a=a()),a.then(a=>{let e=b.success?s(b.success,a):void 0;return e?E.success(e,{id:d,...c,...null==c?void 0:c.success}):E.dismiss(d),a}).catch(a=>{let e=b.error?s(b.error,a):void 0;e?E.error(e,{id:d,...c,...null==c?void 0:c.error}):E.dismiss(d)}),a};var F=1e3,G=q`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,H=q`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,I=q`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,J=r("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${G} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${H} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${a=>a.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${I} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,K=q`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,L=r("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${a=>a.secondary||"#e0e0e0"};
  border-right-color: ${a=>a.primary||"#616161"};
  animation: ${K} 1s linear infinite;
`,M=q`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,N=q`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,O=r("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${M} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${N} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${a=>a.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,P=r("div")`
  position: absolute;
`,Q=r("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,R=q`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,S=r("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${R} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,T=({toast:a})=>{let{icon:b,type:c,iconTheme:d}=a;return void 0!==b?"string"==typeof b?e.createElement(S,null,b):b:"blank"===c?null:e.createElement(Q,null,e.createElement(L,{...d}),"loading"!==c&&e.createElement(P,null,"error"===c?e.createElement(J,{...d}):e.createElement(O,{...d})))},U=r("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,V=r("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,W=e.memo(({toast:a,position:b,style:d,children:f})=>{let g=a.height?((a,b)=>{let d=a.includes("top")?1:-1,[e,f]=c?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*d}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*d}%,-1px) scale(.6); opacity:0;}
`];return{animation:b?`${q(e)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${q(f)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(a.position||b||"top-center",a.visible):{opacity:0},h=e.createElement(T,{toast:a}),i=e.createElement(V,{...a.ariaProps},s(a.message,a));return e.createElement(U,{className:a.className,style:{...g,...d,...a.style}},"function"==typeof f?f({icon:h,message:i}):e.createElement(e.Fragment,null,h,i))});d=e.createElement,j.p=void 0,n=d,o=void 0,p=void 0;var X=({id:a,className:b,style:c,onHeightUpdate:d,children:f})=>{let g=e.useCallback(b=>{if(b){let c=()=>{d(a,b.getBoundingClientRect().height)};c(),new MutationObserver(c).observe(b,{subtree:!0,childList:!0,characterData:!0})}},[a,d]);return e.createElement("div",{ref:g,className:b,style:c},f)},Y=m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Z=({reverseOrder:a,position:b="top-center",toastOptions:d,gutter:f,children:g,toasterId:h,containerStyle:i,containerClassName:j})=>{let{toasts:k,handlers:l}=((a,b="default")=>{let{toasts:c,pausedAt:d}=((a={},b=u)=>{let[c,d]=(0,e.useState)(y[b]||x),f=(0,e.useRef)(y[b]);(0,e.useEffect)(()=>(f.current!==y[b]&&d(y[b]),w.push([b,d]),()=>{let a=w.findIndex(([a])=>a===b);a>-1&&w.splice(a,1)}),[b]);let g=c.toasts.map(b=>{var c,d,e;return{...a,...a[b.type],...b,removeDelay:b.removeDelay||(null==(c=a[b.type])?void 0:c.removeDelay)||(null==a?void 0:a.removeDelay),duration:b.duration||(null==(d=a[b.type])?void 0:d.duration)||(null==a?void 0:a.duration)||C[b.type],style:{...a.style,...null==(e=a[b.type])?void 0:e.style,...b.style}}});return{...c,toasts:g}})(a,b),f=(0,e.useRef)(new Map).current,g=(0,e.useCallback)((a,b=F)=>{if(f.has(a))return;let c=setTimeout(()=>{f.delete(a),h({type:4,toastId:a})},b);f.set(a,c)},[]);(0,e.useEffect)(()=>{if(d)return;let a=Date.now(),e=c.map(c=>{if(c.duration===1/0)return;let d=(c.duration||0)+c.pauseDuration-(a-c.createdAt);if(d<0){c.visible&&E.dismiss(c.id);return}return setTimeout(()=>E.dismiss(c.id,b),d)});return()=>{e.forEach(a=>a&&clearTimeout(a))}},[c,d,b]);let h=(0,e.useCallback)(B(b),[b]),i=(0,e.useCallback)(()=>{h({type:5,time:Date.now()})},[h]),j=(0,e.useCallback)((a,b)=>{h({type:1,toast:{id:a,height:b}})},[h]),k=(0,e.useCallback)(()=>{d&&h({type:6,time:Date.now()})},[d,h]),l=(0,e.useCallback)((a,b)=>{let{reverseOrder:d=!1,gutter:e=8,defaultPosition:f}=b||{},g=c.filter(b=>(b.position||f)===(a.position||f)&&b.height),h=g.findIndex(b=>b.id===a.id),i=g.filter((a,b)=>b<h&&a.visible).length;return g.filter(a=>a.visible).slice(...d?[i+1]:[0,i]).reduce((a,b)=>a+(b.height||0)+e,0)},[c]);return(0,e.useEffect)(()=>{c.forEach(a=>{if(a.dismissed)g(a.id,a.removeDelay);else{let b=f.get(a.id);b&&(clearTimeout(b),f.delete(a.id))}})},[c,g]),{toasts:c,handlers:{updateHeight:j,startPause:i,endPause:k,calculateOffset:l}}})(d,h);return e.createElement("div",{"data-rht-toaster":h||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:j,onMouseEnter:l.startPause,onMouseLeave:l.endPause},k.map(d=>{let h,i,j=d.position||b,k=l.calculateOffset(d,{reverseOrder:a,gutter:f,defaultPosition:b}),m=(h=j.includes("top"),i=j.includes("center")?{justifyContent:"center"}:j.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:c?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${k*(h?1:-1)}px)`,...h?{top:0}:{bottom:0},...i});return e.createElement(X,{id:d.id,key:d.id,onHeightUpdate:l.updateHeight,className:d.visible?Y:"",style:m},"custom"===d.type?s(d.message,d):g?g(d):e.createElement(W,{toast:d,position:j}))}))};a.s(["Toaster",()=>Z,"default",()=>E],6704)},49719,(a,b,c)=>{b.exports=a.x("assert",()=>require("assert"))},92e3,a=>{"use strict";let b=(0,a.i(70106).default)("circle-alert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);a.s(["AlertCircle",()=>b],92e3)},24669,a=>{"use strict";let b=(0,a.i(70106).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);a.s(["TrendingUp",()=>b],24669)},14857,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(60246),e=a.i(11156),f=a.i(24669),g=a.i(69520),h=a.i(40784),i=a.i(41710),j=a.i(83497);let k=(0,a.i(70106).default)("user-check",[["path",{d:"m16 11 2 2 4-4",key:"9rsbq5"}],["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]);var l=a.i(92e3),m=a.i(6704),n=a.i(83490),o=a.i(50944);function p(){let a=(0,o.useRouter)(),p=process.env.NEXT_PUBLIC_API_URL||"http://10.27.4.11:3001",[q,r]=(0,c.useState)(new Date),[s,t]=(0,c.useState)(null),[u,v]=(0,c.useState)(!0),[w,x]=(0,c.useState)(null);(0,c.useEffect)(()=>{let a=setInterval(()=>r(new Date),1e3);return()=>clearInterval(a)},[]),(0,c.useEffect)(()=>{m.default.error("Please login first"),a.push("/auth/login")},[a]);let y=async()=>{let b=localStorage.getItem("token");if(!b){m.default.error("No token found"),v(!1);return}v(!0),x(null);try{let a=await n.default.get(`${p}/api/dashboard`,{headers:{Authorization:`Bearer ${b}`,"Content-Type":"application/json"},timeout:2e4});a.data&&a.data.dashboard?(t(a.data.dashboard),m.default.success("Dashboard updated!")):(x("No dashboard data returned"),m.default.error("Empty response from server"))}catch(b){if(console.error("Dashboard API Error:",b),b.response?.status===401)localStorage.removeItem("token"),m.default.error("Session expired"),setTimeout(()=>a.push("/auth/login"),1500);else if("ERR_NETWORK"===b.code)x("Cannot connect to server"),m.default.error("Server unreachable");else{let a=b.response?.data?.error||"Failed to load dashboard";x(a),m.default.error(a)}}finally{v(!1)}};(0,c.useEffect)(()=>{y()},[]);let{customers:z,orders:A,refunds:B}=s||{},C={total:A?.total||0,paid:A?.prepaidCount||0,pending:A?.pendingCount||0,revenue:A?.recent?.reduce((a,b)=>a+Number(b.total||0),0)||0};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(m.Toaster,{position:"top-right"}),(0,b.jsx)("div",{className:"min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100",children:(0,b.jsxs)("div",{className:"container mx-auto p-4 sm:p-6 lg:p-8",children:[(0,b.jsx)("div",{className:"bg-white rounded-2xl shadow-xl p-6 mb-6",children:(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold text-gray-800",children:"Dashboard Overview"}),(0,b.jsx)("p",{className:"text-gray-600 mt-1",children:"Welcome back! Here's your store summary"})]}),(0,b.jsxs)("button",{onClick:y,disabled:u,className:"flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition font-medium",children:[(0,b.jsx)(g.RefreshCw,{className:`w-5 h-5 ${u?"animate-spin":""}`}),"Refresh Data"]})]})}),u&&(0,b.jsxs)("div",{className:"text-center py-20",children:[(0,b.jsx)(g.RefreshCw,{className:"w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600"}),(0,b.jsx)("p",{className:"text-lg text-gray-700",children:"Loading dashboard..."})]}),w&&!u&&(0,b.jsxs)("div",{className:"bg-red-50 border border-red-300 text-red-700 p-8 rounded-2xl text-center mb-8",children:[(0,b.jsx)(l.AlertCircle,{className:"w-16 h-16 mx-auto mb-4 opacity-70"}),(0,b.jsx)("p",{className:"text-xl font-bold mb-2",children:"Error"}),(0,b.jsx)("p",{className:"mb-4",children:w}),(0,b.jsx)("button",{onClick:y,className:"px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg",children:"Try Again"})]}),!u&&!w&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",children:[(0,b.jsxs)("div",{className:"bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition",children:[(0,b.jsx)("div",{className:"bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4",children:(0,b.jsx)(h.ShoppingBag,{className:"w-8 h-8 text-blue-600"})}),(0,b.jsx)("p",{className:"text-gray-600 text-sm",children:"Total Orders"}),(0,b.jsx)("p",{className:"text-4xl font-bold text-gray-800 mt-2",children:C.total.toLocaleString()})]}),(0,b.jsxs)("div",{className:"bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition",children:[(0,b.jsx)("div",{className:"bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4",children:(0,b.jsx)(e.CreditCard,{className:"w-8 h-8 text-green-600"})}),(0,b.jsx)("p",{className:"text-gray-600 text-sm",children:"Paid Orders"}),(0,b.jsx)("p",{className:"text-4xl font-bold text-green-600 mt-2",children:C.paid.toLocaleString()})]}),(0,b.jsxs)("div",{className:"bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition",children:[(0,b.jsx)("div",{className:"bg-yellow-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4",children:(0,b.jsx)(i.Clock,{className:"w-8 h-8 text-yellow-600"})}),(0,b.jsx)("p",{className:"text-gray-600 text-sm",children:"Pending Orders"}),(0,b.jsx)("p",{className:"text-4xl font-bold text-yellow-600 mt-2",children:C.pending.toLocaleString()})]}),(0,b.jsxs)("div",{className:"bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition",children:[(0,b.jsx)("div",{className:"bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4",children:(0,b.jsx)(f.TrendingUp,{className:"w-8 h-8 text-purple-600"})}),(0,b.jsx)("p",{className:"text-gray-600 text-sm",children:"Total Revenue"}),(0,b.jsxs)("p",{className:"text-3xl font-bold text-purple-600 mt-2",children:["₹",C.revenue.toLocaleString("en-IN")]})]})]}),(0,b.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8",children:[(0,b.jsxs)("div",{className:"bg-white rounded-2xl shadow-xl p-6",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3 mb-6",children:[(0,b.jsx)("div",{className:"bg-blue-100 p-3 rounded-lg",children:(0,b.jsx)(d.Users,{className:"w-6 h-6 text-blue-600"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h2",{className:"text-xl font-bold text-gray-800",children:"Recent Customers"}),(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Latest registered users"})]})]}),z?.recent&&z.recent.length>0?(0,b.jsx)("div",{className:"space-y-3 max-h-96 overflow-y-auto",children:z.recent.map((a,c)=>(0,b.jsxs)("div",{className:"flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition border",children:[(0,b.jsxs)("div",{className:"w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold",children:[a.firstName?.[0]||"?",a.lastName?.[0]||"?"]}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsxs)("p",{className:"font-semibold text-gray-800",children:[a.firstName," ",a.lastName]}),(0,b.jsx)("p",{className:"text-sm text-gray-600 truncate",children:a.email})]}),(0,b.jsx)(k,{className:"w-5 h-5 text-green-500"})]},c))}):(0,b.jsxs)("div",{className:"text-center py-12 text-gray-500",children:[(0,b.jsx)(d.Users,{className:"w-12 h-12 mx-auto mb-3 opacity-30"}),(0,b.jsx)("p",{children:"No recent customers"})]})]}),(0,b.jsxs)("div",{className:"bg-white rounded-2xl shadow-xl p-6",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3 mb-6",children:[(0,b.jsx)("div",{className:"bg-orange-100 p-3 rounded-lg",children:(0,b.jsx)(j.Package,{className:"w-6 h-6 text-orange-600"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h2",{className:"text-xl font-bold text-gray-800",children:"Recent Refunds"}),(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Latest refund requests"})]})]}),B?.recent&&B.recent.length>0?(0,b.jsx)("div",{className:"space-y-3 max-h-96 overflow-y-auto",children:B.recent.map((a,c)=>(0,b.jsx)("div",{className:"p-4 bg-gray-50 hover:bg-orange-50 rounded-lg transition border",children:(0,b.jsxs)("div",{className:"flex justify-between items-start",children:[(0,b.jsxs)("div",{children:[(0,b.jsxs)("p",{className:"font-semibold text-gray-800",children:["Refund ID: ",(0,b.jsxs)("span",{className:"text-orange-600",children:["#",a.id||a.refundId]})]}),(0,b.jsx)("p",{className:"text-sm text-gray-600 mt-1",children:new Date(a.createdAt||a.date).toLocaleDateString("en-IN")})]}),(0,b.jsx)("span",{className:"px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold",children:"Pending"})]})},c))}):(0,b.jsxs)("div",{className:"text-center py-12 text-gray-500",children:[(0,b.jsx)(j.Package,{className:"w-12 h-12 mx-auto mb-3 opacity-30"}),(0,b.jsx)("p",{children:"No recent refunds"})]})]})]}),(0,b.jsx)("footer",{className:"text-center",children:(0,b.jsxs)("div",{className:"inline-flex flex-col sm:flex-row items-center gap-3 bg-white px-8 py-4 rounded-2xl shadow-lg",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(i.Clock,{className:"w-6 h-6 text-blue-600"}),(0,b.jsx)("span",{className:"text-gray-700 font-medium",children:"Last updated:"})]}),(0,b.jsx)("span",{className:"font-bold text-blue-600 text-lg",children:q.toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"medium"})})]})})]})]})})]})}a.i(45747),a.s(["default",()=>p],14857)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__b69778c6._.js.map