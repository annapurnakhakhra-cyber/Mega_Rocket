(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,5766,e=>{"use strict";let t,r;var a,s=e.i(71645);let i={data:""},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,d=(e,t)=>{let r="",a="",s="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+o+";":a+="f"==i[1]?d(o,i):i+"{"+d(o,"k"==i[1]?"":t)+"}":"object"==typeof o?a+=d(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=d.p?d.p(i,o):i+":"+o+";")}return r+(t&&s?t+"{"+s+"}":s)+a},c={},u=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+u(e[r]);return t}return e};function p(e){let t,r,a=this||{},s=e.call?e(a.p):e;return((e,t,r,a,s)=>{var i;let p=u(e),m=c[p]||(c[p]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(p));if(!c[m]){let t=p!==e?e:(e=>{let t,r,a=[{}];for(;t=o.exec(e.replace(l,""));)t[4]?a.shift():t[3]?(r=t[3].replace(n," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(n," ").trim();return a[0]})(e);c[m]=d(s?{["@keyframes "+m]:t}:t,r?"":"."+m)}let h=r&&c.g?c.g:null;return r&&(c.g=c[m]),i=c[m],h?t.data=t.data.replace(h,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),m})(s.unshift?s.raw?(t=[].slice.call(arguments,1),r=a.p,s.reduce((e,a,s)=>{let i=t[s];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(a.target),a.g,a.o,a.k)}p.bind({g:1});let m,h,f,g=p.bind({k:1});function y(e,t){let r=this||{};return function(){let a=arguments;function s(i,o){let l=Object.assign({},i),n=l.className||s.className;r.p=Object.assign({theme:h&&h()},l),r.o=/ *go\d+/.test(n),l.className=p.apply(r,a)+(n?" "+n:""),t&&(l.ref=o);let d=e;return e[0]&&(d=l.as||e,delete l.as),f&&d[0]&&f(l),m(d,l)}return t?t(s):s}}var x=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),v=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},w="default",k=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return k(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},j=[],N={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},E=(e,t=w)=>{C[t]=k(C[t]||N,e),j.forEach(([e,r])=>{e===t&&r(C[t])})},A=e=>Object.keys(C).forEach(t=>E(e,t)),S=(e=w)=>t=>{E(t,e)},T={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},M=e=>(t,r)=>{let a,s=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||b()}))(t,e,r);return S(s.toasterId||(a=s.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===a))))({type:2,toast:s}),s.id},O=(e,t)=>M("blank")(e,t);O.error=M("error"),O.success=M("success"),O.loading=M("loading"),O.custom=M("custom"),O.dismiss=(e,t)=>{let r={type:3,toastId:e};t?S(t)(r):A(r)},O.dismissAll=e=>O.dismiss(void 0,e),O.remove=(e,t)=>{let r={type:4,toastId:e};t?S(t)(r):A(r)},O.removeAll=e=>O.remove(void 0,e),O.promise=(e,t,r)=>{let a=O.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?x(t.success,e):void 0;return s?O.success(s,{id:a,...r,...null==r?void 0:r.success}):O.dismiss(a),e}).catch(e=>{let s=t.error?x(t.error,e):void 0;s?O.error(s,{id:a,...r,...null==r?void 0:r.error}):O.dismiss(a)}),e};var $=1e3,D=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,P=g`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,R=g`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,z=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${D} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${P} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${R} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,I=g`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,q=y("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${I} 1s linear infinite;
`,L=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,U=g`
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
}`,F=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${L} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${U} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,_=y("div")`
  position: absolute;
`,H=y("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,B=g`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Y=y("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${B} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,K=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?s.createElement(Y,null,t):t:"blank"===r?null:s.createElement(H,null,s.createElement(q,{...a}),"loading"!==r&&s.createElement(_,null,"error"===r?s.createElement(z,{...a}):s.createElement(F,{...a})))},V=y("div")`
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
`,G=y("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,J=s.memo(({toast:e,position:t,style:r,children:a})=>{let i=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[a,s]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${g(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${g(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=s.createElement(K,{toast:e}),l=s.createElement(G,{...e.ariaProps},x(e.message,e));return s.createElement(V,{className:e.className,style:{...i,...r,...e.style}},"function"==typeof a?a({icon:o,message:l}):s.createElement(s.Fragment,null,o,l))});a=s.createElement,d.p=void 0,m=a,h=void 0,f=void 0;var W=({id:e,className:t,style:r,onHeightUpdate:a,children:i})=>{let o=s.useCallback(t=>{if(t){let r=()=>{a(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return s.createElement("div",{ref:o,className:t,style:r},i)},Z=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Q=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:i,toasterId:o,containerStyle:l,containerClassName:n})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:r,pausedAt:a}=((e={},t=w)=>{let[r,a]=(0,s.useState)(C[t]||N),i=(0,s.useRef)(C[t]);(0,s.useEffect)(()=>(i.current!==C[t]&&a(C[t]),j.push([t,a]),()=>{let e=j.findIndex(([e])=>e===t);e>-1&&j.splice(e,1)}),[t]);let o=r.toasts.map(t=>{var r,a,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||T[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...r,toasts:o}})(e,t),i=(0,s.useRef)(new Map).current,o=(0,s.useCallback)((e,t=$)=>{if(i.has(e))return;let r=setTimeout(()=>{i.delete(e),l({type:4,toastId:e})},t);i.set(e,r)},[]);(0,s.useEffect)(()=>{if(a)return;let e=Date.now(),s=r.map(r=>{if(r.duration===1/0)return;let a=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(a<0){r.visible&&O.dismiss(r.id);return}return setTimeout(()=>O.dismiss(r.id,t),a)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[r,a,t]);let l=(0,s.useCallback)(S(t),[t]),n=(0,s.useCallback)(()=>{l({type:5,time:Date.now()})},[l]),d=(0,s.useCallback)((e,t)=>{l({type:1,toast:{id:e,height:t}})},[l]),c=(0,s.useCallback)(()=>{a&&l({type:6,time:Date.now()})},[a,l]),u=(0,s.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:s=8,defaultPosition:i}=t||{},o=r.filter(t=>(t.position||i)===(e.position||i)&&t.height),l=o.findIndex(t=>t.id===e.id),n=o.filter((e,t)=>t<l&&e.visible).length;return o.filter(e=>e.visible).slice(...a?[n+1]:[0,n]).reduce((e,t)=>e+(t.height||0)+s,0)},[r]);return(0,s.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[r,o]),{toasts:r,handlers:{updateHeight:d,startPause:n,endPause:c,calculateOffset:u}}})(r,o);return s.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...l},className:n,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(r=>{let o,l,n=r.position||t,d=c.calculateOffset(r,{reverseOrder:e,gutter:a,defaultPosition:t}),u=(o=n.includes("top"),l=n.includes("center")?{justifyContent:"center"}:n.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(o?1:-1)}px)`,...o?{top:0}:{bottom:0},...l});return s.createElement(W,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?Z:"",style:u},"custom"===r.type?x(r.message,r):i?i(r):s.createElement(J,{toast:r,position:n}))}))};e.s(["Toaster",()=>Q,"default",()=>O],5766)},63488,e=>{"use strict";let t=(0,e.i(75254).default)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]);e.s(["Mail",()=>t],63488)},84614,e=>{"use strict";let t=(0,e.i(75254).default)("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);e.s(["User",()=>t],84614)},69638,e=>{"use strict";let t=(0,e.i(75254).default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["CheckCircle",()=>t],69638)},86536,e=>{"use strict";let t=(0,e.i(75254).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",()=>t],86536)},98919,e=>{"use strict";let t=(0,e.i(75254).default)("shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);e.s(["Shield",()=>t],98919)},35029,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(84614),s=e.i(63488),i=e.i(75254);let o=(0,i.default)("store",[["path",{d:"M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5",key:"slp6dd"}],["path",{d:"M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244",key:"o0xfot"}],["path",{d:"M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05",key:"wn3emo"}]]),l=(0,i.default)("link-2",[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]),n=(0,i.default)("key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]);var d=e.i(86536);let c=(0,i.default)("eye-off",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);var u=e.i(98919),p=e.i(69638),m=e.i(22016),h=e.i(18566),f=e.i(5766);function g(){let[e,i]=(0,r.useState)(!1),[g,y]=(0,r.useState)(!1),[x,b]=(0,r.useState)(""),[v,w]=(0,r.useState)(""),k=(0,h.useRouter)(),[j,N]=(0,r.useState)({adminName:"",email:"",shopName:"",shopUrl:"",accessToken:""}),C=e=>{let{name:t,value:r}=e.target;N(e=>({...e,[t]:r}))},E=async e=>{e.preventDefault(),y(!0),b(""),w("");try{let e=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({adminName:j.adminName.trim(),email:j.email.trim().toLowerCase(),shopName:j.shopName.trim(),shopUrl:j.shopUrl.trim().toLowerCase().replace("https://","").replace("http://",""),accessToken:j.accessToken.trim()})}),t=await e.json();if(!e.ok){let e=t.message||"Registration failed. Please try again.";b(e),f.default.error(e);return}w("Store connected successfully! 🎉"),f.default.success("Registration successful! Redirecting..."),setTimeout(()=>{k.push("/auth/login")},1500)}catch(t){console.error("Registration error:",t);let e="Network error. Please check your connection and try again.";b(e),f.default.error(e)}finally{y(!1)}};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(f.Toaster,{position:"top-center",reverseOrder:!1}),(0,t.jsx)("div",{className:"min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-8",children:(0,t.jsxs)("div",{className:"w-full max-w-2xl",children:[(0,t.jsxs)("div",{className:"bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/30",children:[(0,t.jsxs)("div",{className:"text-center mb-10",children:[(0,t.jsx)("div",{className:"w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl",children:(0,t.jsx)(u.Shield,{className:"w-12 h-12 text-white"})}),(0,t.jsx)("h1",{className:"text-3xl lg:text-4xl font-bold text-gray-800",children:"Shop Admin Registration"}),(0,t.jsx)("p",{className:"text-gray-600 mt-3 text-lg",children:"Connect your Shopify store securely"})]}),x&&(0,t.jsx)("div",{className:"mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-medium",children:x}),v&&(0,t.jsxs)("div",{className:"mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center font-medium flex items-center justify-center gap-2",children:[(0,t.jsx)(p.CheckCircle,{className:"w-5 h-5"}),v]}),(0,t.jsxs)("form",{onSubmit:E,className:"space-y-7",children:[(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)(a.User,{className:"absolute left-4 top-4 w-5 h-5 text-gray-400"}),(0,t.jsx)("input",{type:"text",name:"adminName",value:j.adminName,onChange:C,placeholder:"Admin Full Name",required:!0,className:"w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder-gray-500 font-medium text-base"})]}),(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)(s.Mail,{className:"absolute left-4 top-4 w-5 h-5 text-gray-400"}),(0,t.jsx)("input",{type:"email",name:"email",value:j.email,onChange:C,placeholder:"admin@yourstore.com",required:!0,className:"w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder-gray-500 font-medium text-base"})]}),(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)(o,{className:"absolute left-4 top-4 w-5 h-5 text-gray-400"}),(0,t.jsx)("input",{type:"text",name:"shopName",value:j.shopName,onChange:C,placeholder:"Your Store Name (e.g. My Fashion Hub)",required:!0,className:"w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder-gray-500 font-medium text-base"})]}),(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)(l,{className:"absolute left-4 top-4 w-5 h-5 text-gray-400"}),(0,t.jsx)("input",{type:"text",name:"shopUrl",value:j.shopUrl,onChange:C,placeholder:"your-store.myshopify.com",required:!0,className:"w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder-gray-500 font-medium text-base lowercase"}),(0,t.jsx)("small",{className:"block mt-2 text-gray-500 ml-12",children:"Enter your Shopify store URL (without https://)"})]}),(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)(n,{className:"absolute left-4 top-4 w-5 h-5 text-gray-400"}),(0,t.jsx)("input",{type:e?"text":"password",name:"accessToken",value:j.accessToken,onChange:C,placeholder:"Admin API Access Token (x-shopify-access-token)",required:!0,className:"w-full pl-12 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all text-gray-800 font-mono text-sm tracking-wider"}),(0,t.jsx)("button",{type:"button",onClick:()=>i(!e),className:"absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition",children:e?(0,t.jsx)(c,{className:"w-5 h-5"}):(0,t.jsx)(d.Eye,{className:"w-5 h-5"})})]}),(0,t.jsxs)("div",{className:"bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3",children:[(0,t.jsx)(p.CheckCircle,{className:"w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5"}),(0,t.jsxs)("div",{className:"text-sm text-amber-800",children:[(0,t.jsx)("strong",{children:"Secure Connection:"})," Your Access Token is encrypted and never stored in plain text. Required for reading orders, customers, and products."]})]}),(0,t.jsx)("button",{type:"submit",disabled:g,className:"w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl transform hover:scale-[1.02] transition-all duration-300 shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed",children:g?(0,t.jsx)(t.Fragment,{children:"Connecting to Shopify..."}):(0,t.jsxs)(t.Fragment,{children:["Register & Connect Store",(0,t.jsx)(p.CheckCircle,{className:"w-6 h-6"})]})})]}),(0,t.jsx)("div",{className:"mt-8 text-center",children:(0,t.jsxs)("p",{className:"text-gray-600",children:["Already registered?"," ",(0,t.jsx)(m.default,{href:"/auth/login",className:"text-indigo-600 font-bold hover:underline",children:"Sign In"})]})}),(0,t.jsx)("div",{className:"mt-10 pt-8 border-t border-gray-200 text-center",children:(0,t.jsxs)("p",{className:"text-sm text-gray-500",children:["Need help finding your ",(0,t.jsx)("strong",{children:"Admin API Access Token"}),"?"," ",(0,t.jsx)("a",{href:"https://www.youtube.com/results?search_query=shopify+admin+api+access+token",target:"_blank",className:"text-indigo-600 hover:underline font-medium",children:"Watch 30-second guide"})]})})]}),(0,t.jsx)("p",{className:"text-center mt-8 text-gray-500 text-sm",children:"© 2025 Fastrr Checkout • End-to-end encrypted • GDPR Compliant"})]})})]})}e.s(["default",()=>g],35029)}]);