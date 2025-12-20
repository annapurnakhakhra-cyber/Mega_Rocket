module.exports=[24361,(a,b,c)=>{b.exports=a.x("util",()=>require("util"))},14747,(a,b,c)=>{b.exports=a.x("path",()=>require("path"))},87532,a=>{"use strict";let b=(0,a.i(70106).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);a.s(["Search",()=>b],87532)},6704,a=>{"use strict";let b,c;var d,e=a.i(72131);let f={data:""},g=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,h=/\/\*[^]*?\*\/|  +/g,i=/\n+/g,j=(a,b)=>{let c="",d="",e="";for(let f in a){let g=a[f];"@"==f[0]?"i"==f[1]?c=f+" "+g+";":d+="f"==f[1]?j(g,f):f+"{"+j(g,"k"==f[1]?"":b)+"}":"object"==typeof g?d+=j(g,b?b.replace(/([^,])+/g,a=>f.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,b=>/&/.test(b)?b.replace(/&/g,a):a?a+" "+b:b)):f):null!=g&&(f=/^--/.test(f)?f:f.replace(/[A-Z]/g,"-$&").toLowerCase(),e+=j.p?j.p(f,g):f+":"+g+";")}return c+(b&&e?b+"{"+e+"}":e)+d},k={},l=a=>{if("object"==typeof a){let b="";for(let c in a)b+=c+l(a[c]);return b}return a};function m(a){let b,c,d=this||{},e=a.call?a(d.p):a;return((a,b,c,d,e)=>{var f;let m=l(a),n=k[m]||(k[m]=(a=>{let b=0,c=11;for(;b<a.length;)c=101*c+a.charCodeAt(b++)>>>0;return"go"+c})(m));if(!k[n]){let b=m!==a?a:(a=>{let b,c,d=[{}];for(;b=g.exec(a.replace(h,""));)b[4]?d.shift():b[3]?(c=b[3].replace(i," ").trim(),d.unshift(d[0][c]=d[0][c]||{})):d[0][b[1]]=b[2].replace(i," ").trim();return d[0]})(a);k[n]=j(e?{["@keyframes "+n]:b}:b,c?"":"."+n)}let o=c&&k.g?k.g:null;return c&&(k.g=k[n]),f=k[n],o?b.data=b.data.replace(o,f):-1===b.data.indexOf(f)&&(b.data=d?f+b.data:b.data+f),n})(e.unshift?e.raw?(b=[].slice.call(arguments,1),c=d.p,e.reduce((a,d,e)=>{let f=b[e];if(f&&f.call){let a=f(c),b=a&&a.props&&a.props.className||/^go/.test(a)&&a;f=b?"."+b:a&&"object"==typeof a?a.props?"":j(a,""):!1===a?"":a}return a+d+(null==f?"":f)},"")):e.reduce((a,b)=>Object.assign(a,b&&b.call?b(d.p):b),{}):e,d.target||f,d.g,d.o,d.k)}m.bind({g:1});let n,o,p,q=m.bind({k:1});function r(a,b){let c=this||{};return function(){let d=arguments;function e(f,g){let h=Object.assign({},f),i=h.className||e.className;c.p=Object.assign({theme:o&&o()},h),c.o=/ *go\d+/.test(i),h.className=m.apply(c,d)+(i?" "+i:""),b&&(h.ref=g);let j=a;return a[0]&&(j=h.as||a,delete h.as),p&&j[0]&&p(h),n(j,h)}return b?b(e):e}}var s=(a,b)=>"function"==typeof a?a(b):a,t=(b=0,()=>(++b).toString()),u="default",v=(a,b)=>{let{toastLimit:c}=a.settings;switch(b.type){case 0:return{...a,toasts:[b.toast,...a.toasts].slice(0,c)};case 1:return{...a,toasts:a.toasts.map(a=>a.id===b.toast.id?{...a,...b.toast}:a)};case 2:let{toast:d}=b;return v(a,{type:+!!a.toasts.find(a=>a.id===d.id),toast:d});case 3:let{toastId:e}=b;return{...a,toasts:a.toasts.map(a=>a.id===e||void 0===e?{...a,dismissed:!0,visible:!1}:a)};case 4:return void 0===b.toastId?{...a,toasts:[]}:{...a,toasts:a.toasts.filter(a=>a.id!==b.toastId)};case 5:return{...a,pausedAt:b.time};case 6:let f=b.time-(a.pausedAt||0);return{...a,pausedAt:void 0,toasts:a.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+f}))}}},w=[],x={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},y={},z=(a,b=u)=>{y[b]=v(y[b]||x,a),w.forEach(([a,c])=>{a===b&&c(y[b])})},A=a=>Object.keys(y).forEach(b=>z(a,b)),B=(a=u)=>b=>{z(b,a)},C={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=a=>(b,c)=>{let d,e=((a,b="blank",c)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:b,ariaProps:{role:"status","aria-live":"polite"},message:a,pauseDuration:0,...c,id:(null==c?void 0:c.id)||t()}))(b,a,c);return B(e.toasterId||(d=e.id,Object.keys(y).find(a=>y[a].toasts.some(a=>a.id===d))))({type:2,toast:e}),e.id},E=(a,b)=>D("blank")(a,b);E.error=D("error"),E.success=D("success"),E.loading=D("loading"),E.custom=D("custom"),E.dismiss=(a,b)=>{let c={type:3,toastId:a};b?B(b)(c):A(c)},E.dismissAll=a=>E.dismiss(void 0,a),E.remove=(a,b)=>{let c={type:4,toastId:a};b?B(b)(c):A(c)},E.removeAll=a=>E.remove(void 0,a),E.promise=(a,b,c)=>{let d=E.loading(b.loading,{...c,...null==c?void 0:c.loading});return"function"==typeof a&&(a=a()),a.then(a=>{let e=b.success?s(b.success,a):void 0;return e?E.success(e,{id:d,...c,...null==c?void 0:c.success}):E.dismiss(d),a}).catch(a=>{let e=b.error?s(b.error,a):void 0;e?E.error(e,{id:d,...c,...null==c?void 0:c.error}):E.dismiss(d)}),a};var F=1e3,G=q`
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
`,Z=({reverseOrder:a,position:b="top-center",toastOptions:d,gutter:f,children:g,toasterId:h,containerStyle:i,containerClassName:j})=>{let{toasts:k,handlers:l}=((a,b="default")=>{let{toasts:c,pausedAt:d}=((a={},b=u)=>{let[c,d]=(0,e.useState)(y[b]||x),f=(0,e.useRef)(y[b]);(0,e.useEffect)(()=>(f.current!==y[b]&&d(y[b]),w.push([b,d]),()=>{let a=w.findIndex(([a])=>a===b);a>-1&&w.splice(a,1)}),[b]);let g=c.toasts.map(b=>{var c,d,e;return{...a,...a[b.type],...b,removeDelay:b.removeDelay||(null==(c=a[b.type])?void 0:c.removeDelay)||(null==a?void 0:a.removeDelay),duration:b.duration||(null==(d=a[b.type])?void 0:d.duration)||(null==a?void 0:a.duration)||C[b.type],style:{...a.style,...null==(e=a[b.type])?void 0:e.style,...b.style}}});return{...c,toasts:g}})(a,b),f=(0,e.useRef)(new Map).current,g=(0,e.useCallback)((a,b=F)=>{if(f.has(a))return;let c=setTimeout(()=>{f.delete(a),h({type:4,toastId:a})},b);f.set(a,c)},[]);(0,e.useEffect)(()=>{if(d)return;let a=Date.now(),e=c.map(c=>{if(c.duration===1/0)return;let d=(c.duration||0)+c.pauseDuration-(a-c.createdAt);if(d<0){c.visible&&E.dismiss(c.id);return}return setTimeout(()=>E.dismiss(c.id,b),d)});return()=>{e.forEach(a=>a&&clearTimeout(a))}},[c,d,b]);let h=(0,e.useCallback)(B(b),[b]),i=(0,e.useCallback)(()=>{h({type:5,time:Date.now()})},[h]),j=(0,e.useCallback)((a,b)=>{h({type:1,toast:{id:a,height:b}})},[h]),k=(0,e.useCallback)(()=>{d&&h({type:6,time:Date.now()})},[d,h]),l=(0,e.useCallback)((a,b)=>{let{reverseOrder:d=!1,gutter:e=8,defaultPosition:f}=b||{},g=c.filter(b=>(b.position||f)===(a.position||f)&&b.height),h=g.findIndex(b=>b.id===a.id),i=g.filter((a,b)=>b<h&&a.visible).length;return g.filter(a=>a.visible).slice(...d?[i+1]:[0,i]).reduce((a,b)=>a+(b.height||0)+e,0)},[c]);return(0,e.useEffect)(()=>{c.forEach(a=>{if(a.dismissed)g(a.id,a.removeDelay);else{let b=f.get(a.id);b&&(clearTimeout(b),f.delete(a.id))}})},[c,g]),{toasts:c,handlers:{updateHeight:j,startPause:i,endPause:k,calculateOffset:l}}})(d,h);return e.createElement("div",{"data-rht-toaster":h||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:j,onMouseEnter:l.startPause,onMouseLeave:l.endPause},k.map(d=>{let h,i,j=d.position||b,k=l.calculateOffset(d,{reverseOrder:a,gutter:f,defaultPosition:b}),m=(h=j.includes("top"),i=j.includes("center")?{justifyContent:"center"}:j.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:c?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${k*(h?1:-1)}px)`,...h?{top:0}:{bottom:0},...i});return e.createElement(X,{id:d.id,key:d.id,onHeightUpdate:l.updateHeight,className:d.visible?Y:"",style:m},"custom"===d.type?s(d.message,d):g?g(d):e.createElement(W,{toast:d,position:j}))}))};a.s(["Toaster",()=>Z,"default",()=>E],6704)},92258,a=>{"use strict";let b=(0,a.i(70106).default)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]);a.s(["Mail",()=>b],92258)},54799,(a,b,c)=>{b.exports=a.x("crypto",()=>require("crypto"))},88947,(a,b,c)=>{b.exports=a.x("stream",()=>require("stream"))},21517,(a,b,c)=>{b.exports=a.x("http",()=>require("http"))},24836,(a,b,c)=>{b.exports=a.x("https",()=>require("https"))},92509,(a,b,c)=>{b.exports=a.x("url",()=>require("url"))},6461,(a,b,c)=>{b.exports=a.x("zlib",()=>require("zlib"))},27699,(a,b,c)=>{b.exports=a.x("events",()=>require("events"))},22734,(a,b,c)=>{b.exports=a.x("fs",()=>require("fs"))},46786,(a,b,c)=>{b.exports=a.x("os",()=>require("os"))},83497,a=>{"use strict";let b=(0,a.i(70106).default)("package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]]);a.s(["Package",()=>b],83497)},49719,(a,b,c)=>{b.exports=a.x("assert",()=>require("assert"))},13749,50522,a=>{"use strict";var b=a.i(70106);let c=(0,b.default)("chevron-left",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);a.s(["ChevronLeft",()=>c],13749);let d=(0,b.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);a.s(["ChevronRight",()=>d],50522)},28790,a=>{"use strict";let b=(0,a.i(70106).default)("refresh-ccw",[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]]);a.s(["RefreshCcw",()=>b],28790)},77156,a=>{"use strict";let b=(0,a.i(70106).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);a.s(["Eye",()=>b],77156)},67367,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(84505),e=a.i(77156),f=a.i(28790),g=a.i(87532),h=a.i(60246),i=a.i(92258),j=a.i(70106);let k=(0,j.default)("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]),l=(0,j.default)("map-pin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);var m=a.i(83497),n=a.i(13749),o=a.i(50522),p=a.i(33508),q=a.i(83490);a.i(45747);var r=a.i(6704),s=a.i(50944);a.s(["default",0,()=>{let a=(0,s.useRouter)(),j=process.env.NEXT_PUBLIC_API_URL||"http://10.27.4.11:3001",[t,u]=(0,c.useState)(""),[v,w]=(0,c.useState)([]),[x,y]=(0,c.useState)([]),[z,A]=(0,c.useState)(1),[B,C]=(0,c.useState)(""),[D,E]=(0,c.useState)(!1),[F,G]=(0,c.useState)(null);(0,c.useEffect)(()=>{r.default.error("Please login first"),a.push("/auth/login")},[a]);let H=async()=>{let b=localStorage.getItem("token");if(!b)return void r.default.error("Authentication required");E(!0);try{let a=await q.default.get(`${j}/api/customer`,{headers:{Authorization:`Bearer ${b}`},timeout:2e4}),c=a.data?.customers||a.data?.data||[];Array.isArray(c)?(w(c),y(c),r.default.success(`Loaded ${c.length} customers`)):r.default.error("No customer data found")}catch(b){console.error("API Error:",b),b.response?.status===401?(localStorage.removeItem("token"),r.default.error("Session expired"),setTimeout(()=>a.push("/auth/login"),1500)):"ERR_NETWORK"===b.code?r.default.error("Cannot connect to server"):r.default.error(b.response?.data?.message||"Failed to load customers")}finally{E(!1)}};(0,c.useEffect)(()=>{t&&H()},[t]);let I=Math.ceil(x.length/10),J=x.slice((z-1)*10,10*z);return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(r.Toaster,{position:"top-right"}),(0,b.jsx)("div",{className:"min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100",children:(0,b.jsxs)("div",{className:"container mx-auto p-4 sm:p-6 lg:p-8",children:[(0,b.jsx)("div",{className:"bg-white rounded-2xl shadow-xl p-6 mb-6",children:(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold text-gray-800",children:"Customer Management"}),(0,b.jsxs)("p",{className:"text-gray-600 mt-1",children:["Store: ",(0,b.jsx)("strong",{className:"text-blue-600",children:t||"Loading..."})]})]}),(0,b.jsxs)("div",{className:"flex flex-wrap gap-3",children:[(0,b.jsxs)("button",{onClick:H,disabled:D,className:"flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50",children:[(0,b.jsx)(f.RefreshCcw,{className:`w-5 h-5 ${D?"animate-spin":""}`}),"Refresh"]}),(0,b.jsxs)("button",{onClick:()=>{if(0===v.length)return void r.default.error("No customers to export");let a=new Blob([[["First Name","Last Name","Email","Phone","Total Orders","City","Country"],...v.map(a=>[a.firstName||"",a.lastName||"",a.email||"",a.phone||"N/A",a.totalOrders||0,a.addresses?.[0]?.city||"",a.addresses?.[0]?.country||""])].map(a=>a.map(a=>`"${a}"`).join(",")).join("\n")],{type:"text/csv;charset=utf-8;"}),b=URL.createObjectURL(a),c=document.createElement("a");c.setAttribute("href",b),c.setAttribute("download",`${t}_customers_${new Date().toISOString().slice(0,10)}.csv`),c.style.visibility="hidden",document.body.appendChild(c),c.click(),document.body.removeChild(c),r.default.success("CSV exported successfully!")},className:"flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg",children:[(0,b.jsx)(d.Download,{className:"w-5 h-5"})," Export CSV"]})]})]})}),(0,b.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8",children:[(0,b.jsxs)("div",{className:"bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition",children:[(0,b.jsx)("div",{className:"bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4",children:(0,b.jsx)(h.Users,{className:"w-8 h-8 text-blue-600"})}),(0,b.jsx)("p",{className:"text-gray-600 text-sm",children:"Total Customers"}),(0,b.jsx)("p",{className:"text-4xl font-bold text-gray-800 mt-2",children:v.length.toLocaleString()})]}),(0,b.jsxs)("div",{className:"bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition",children:[(0,b.jsx)("div",{className:"bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4",children:(0,b.jsx)(m.Package,{className:"w-8 h-8 text-green-600"})}),(0,b.jsx)("p",{className:"text-gray-600 text-sm",children:"Total Orders"}),(0,b.jsx)("p",{className:"text-4xl font-bold text-green-600 mt-2",children:v.reduce((a,b)=>a+(b.totalOrders||0),0).toLocaleString()})]}),(0,b.jsxs)("div",{className:"bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition",children:[(0,b.jsx)("div",{className:"bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4",children:(0,b.jsx)(i.Mail,{className:"w-8 h-8 text-purple-600"})}),(0,b.jsx)("p",{className:"text-gray-600 text-sm",children:"Active Customers"}),(0,b.jsx)("p",{className:"text-4xl font-bold text-purple-600 mt-2",children:v.filter(a=>(a.totalOrders||0)>0).length.toLocaleString()})]})]}),(0,b.jsx)("div",{className:"bg-white rounded-2xl shadow-xl p-6 mb-6",children:(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)(g.Search,{className:"absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"}),(0,b.jsx)("input",{type:"text",placeholder:"Search by name or email...",className:"w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none",value:B,onChange:a=>{var b;(C(b=a.target.value),b.trim())?(y(v.filter(a=>`${a.firstName||""} ${a.lastName||""}`.toLowerCase().includes(b.toLowerCase())||(a.email||"").toLowerCase().includes(b.toLowerCase()))),A(1)):y(v)}})]})}),D?(0,b.jsxs)("div",{className:"text-center py-20",children:[(0,b.jsx)(f.RefreshCcw,{className:"w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600"}),(0,b.jsx)("p",{className:"text-lg text-gray-700",children:"Loading customers..."})]}):0===J.length?(0,b.jsxs)("div",{className:"text-center py-20 bg-white rounded-2xl shadow-xl",children:[(0,b.jsx)(h.Users,{className:"w-16 h-16 text-gray-400 mx-auto mb-4"}),(0,b.jsx)("p",{className:"text-2xl font-bold text-gray-700",children:"No Customers Found"}),(0,b.jsx)("p",{className:"text-gray-600 mt-2",children:"Try searching or refresh the list"})]}):(0,b.jsx)("div",{className:"bg-white rounded-2xl shadow-xl overflow-x-auto",children:(0,b.jsxs)("table",{className:"w-full min-w-[900px]",children:[(0,b.jsx)("thead",{className:"bg-gray-900 text-white",children:(0,b.jsxs)("tr",{children:[(0,b.jsx)("th",{className:"px-6 py-4 text-left",children:"#"}),(0,b.jsx)("th",{className:"px-6 py-4 text-left",children:"Customer"}),(0,b.jsx)("th",{className:"px-6 py-4 text-left",children:"Contact"}),(0,b.jsx)("th",{className:"px-6 py-4 text-left",children:"Orders"}),(0,b.jsx)("th",{className:"px-6 py-4 text-left",children:"Location"}),(0,b.jsx)("th",{className:"px-6 py-4 text-left",children:"Action"})]})}),(0,b.jsx)("tbody",{className:"divide-y divide-gray-200",children:J.map((a,c)=>{let d=a.addresses?.[0];return(0,b.jsxs)("tr",{className:"hover:bg-gray-50 transition",children:[(0,b.jsx)("td",{className:"px-6 py-4 text-sm font-medium",children:(z-1)*10+c+1}),(0,b.jsxs)("td",{className:"px-6 py-4",children:[(0,b.jsxs)("div",{className:"font-semibold text-gray-900",children:[a.firstName||""," ",a.lastName||""]}),(0,b.jsxs)("div",{className:"text-xs text-gray-500",children:["ID: ",a.id]})]}),(0,b.jsxs)("td",{className:"px-6 py-4 text-sm",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-1",children:[(0,b.jsx)(i.Mail,{size:14,className:"text-gray-400"}),(0,b.jsx)("span",{className:"truncate max-w-[200px]",children:a.email})]}),a.phone&&(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(k,{size:14,className:"text-gray-400"}),(0,b.jsx)("span",{children:a.phone})]})]}),(0,b.jsx)("td",{className:"px-6 py-4",children:(0,b.jsxs)("span",{className:"px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold",children:[a.totalOrders||0," orders"]})}),(0,b.jsx)("td",{className:"px-6 py-4 text-sm text-gray-700",children:d?`${d.city||"N/A"}, ${d.country||"N/A"}`:"No address"}),(0,b.jsx)("td",{className:"px-6 py-4",children:(0,b.jsxs)("button",{onClick:()=>G(a),className:"px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-1 transition",children:[(0,b.jsx)(e.Eye,{size:16})," View"]})})]},a.id||c)})})]})}),I>1&&(0,b.jsxs)("div",{className:"flex justify-center items-center gap-4 mt-8 bg-white rounded-xl shadow p-6",children:[(0,b.jsxs)("button",{onClick:()=>A(a=>Math.max(1,a-1)),disabled:1===z,className:"px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 flex items-center gap-2",children:[(0,b.jsx)(n.ChevronLeft,{className:"w-5 h-5"})," Previous"]}),(0,b.jsxs)("span",{className:"text-lg font-bold text-gray-700",children:["Page ",z," of ",I]}),(0,b.jsxs)("button",{onClick:()=>A(a=>Math.min(I,a+1)),disabled:z===I,className:"px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 flex items-center gap-2",children:["Next ",(0,b.jsx)(o.ChevronRight,{className:"w-5 h-5"})]})]}),F&&(0,b.jsx)("div",{className:"fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto",onClick:()=>G(null),children:(0,b.jsxs)("div",{className:"bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto",onClick:a=>a.stopPropagation(),children:[(0,b.jsxs)("div",{className:"sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center",children:[(0,b.jsx)("h2",{className:"text-xl font-bold",children:"Customer Details"}),(0,b.jsx)("button",{onClick:()=>G(null),className:"p-2 hover:bg-white/20 rounded-full transition",children:(0,b.jsx)(p.X,{className:"w-6 h-6"})})]}),(0,b.jsxs)("div",{className:"p-6 space-y-6",children:[(0,b.jsxs)("div",{className:"flex items-center gap-4",children:[(0,b.jsxs)("div",{className:"w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl",children:[F.firstName?.[0]||"?",F.lastName?.[0]||"?"]}),(0,b.jsxs)("div",{children:[(0,b.jsxs)("h3",{className:"text-xl font-bold text-gray-900",children:[F.firstName," ",F.lastName]}),(0,b.jsxs)("p",{className:"text-sm text-gray-500",children:["ID: ",F.id]})]})]}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{className:"flex items-start gap-3",children:[(0,b.jsx)(i.Mail,{className:"w-5 h-5 text-blue-600 mt-0.5"}),(0,b.jsx)("span",{className:"text-gray-800 break-all",children:F.email})]}),F.phone&&(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)(k,{className:"w-5 h-5 text-green-600"}),(0,b.jsx)("span",{className:"text-gray-800",children:F.phone})]}),(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)(m.Package,{className:"w-5 h-5 text-purple-600"}),(0,b.jsxs)("span",{className:"text-gray-800 font-medium",children:[F.totalOrders||0," total orders"]})]})]}),(0,b.jsxs)("div",{children:[(0,b.jsxs)("h4",{className:"font-semibold text-gray-900 mb-3 flex items-center gap-2",children:[(0,b.jsx)(l,{className:"w-5 h-5 text-red-600"}),"Addresses"]}),F.addresses&&F.addresses.length>0?(0,b.jsx)("div",{className:"space-y-3",children:F.addresses.map((a,c)=>(0,b.jsxs)("div",{className:"border border-gray-200 rounded-lg p-4 bg-gray-50",children:[(0,b.jsx)("p",{className:"font-medium text-sm text-gray-900 mb-1",children:0===c?"Primary Address":`Address ${c+1}`}),(0,b.jsxs)("p",{className:"text-sm text-gray-700 leading-relaxed",children:[a.address1,a.address2&&`, ${a.address2}`,(0,b.jsx)("br",{}),[a.city,a.province].filter(Boolean).join(", ")," ",a.zip,(0,b.jsx)("br",{}),a.country]})]},c))}):(0,b.jsx)("p",{className:"text-sm text-gray-500",children:"No address available"})]})]})]})})]})})]})}],67367)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__48906890._.js.map