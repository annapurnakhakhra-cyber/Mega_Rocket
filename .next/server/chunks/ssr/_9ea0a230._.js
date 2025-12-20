module.exports=[69012,a=>{"use strict";let b=(0,a.i(70106).default)("funnel",[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]]);a.s(["Filter",()=>b],69012)},69520,a=>{"use strict";let b=(0,a.i(70106).default)("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);a.s(["RefreshCw",()=>b],69520)},6704,a=>{"use strict";let b,c;var d,e=a.i(72131);let f={data:""},g=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,h=/\/\*[^]*?\*\/|  +/g,i=/\n+/g,j=(a,b)=>{let c="",d="",e="";for(let f in a){let g=a[f];"@"==f[0]?"i"==f[1]?c=f+" "+g+";":d+="f"==f[1]?j(g,f):f+"{"+j(g,"k"==f[1]?"":b)+"}":"object"==typeof g?d+=j(g,b?b.replace(/([^,])+/g,a=>f.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,b=>/&/.test(b)?b.replace(/&/g,a):a?a+" "+b:b)):f):null!=g&&(f=/^--/.test(f)?f:f.replace(/[A-Z]/g,"-$&").toLowerCase(),e+=j.p?j.p(f,g):f+":"+g+";")}return c+(b&&e?b+"{"+e+"}":e)+d},k={},l=a=>{if("object"==typeof a){let b="";for(let c in a)b+=c+l(a[c]);return b}return a};function m(a){let b,c,d=this||{},e=a.call?a(d.p):a;return((a,b,c,d,e)=>{var f;let m=l(a),n=k[m]||(k[m]=(a=>{let b=0,c=11;for(;b<a.length;)c=101*c+a.charCodeAt(b++)>>>0;return"go"+c})(m));if(!k[n]){let b=m!==a?a:(a=>{let b,c,d=[{}];for(;b=g.exec(a.replace(h,""));)b[4]?d.shift():b[3]?(c=b[3].replace(i," ").trim(),d.unshift(d[0][c]=d[0][c]||{})):d[0][b[1]]=b[2].replace(i," ").trim();return d[0]})(a);k[n]=j(e?{["@keyframes "+n]:b}:b,c?"":"."+n)}let o=c&&k.g?k.g:null;return c&&(k.g=k[n]),f=k[n],o?b.data=b.data.replace(o,f):-1===b.data.indexOf(f)&&(b.data=d?f+b.data:b.data+f),n})(e.unshift?e.raw?(b=[].slice.call(arguments,1),c=d.p,e.reduce((a,d,e)=>{let f=b[e];if(f&&f.call){let a=f(c),b=a&&a.props&&a.props.className||/^go/.test(a)&&a;f=b?"."+b:a&&"object"==typeof a?a.props?"":j(a,""):!1===a?"":a}return a+d+(null==f?"":f)},"")):e.reduce((a,b)=>Object.assign(a,b&&b.call?b(d.p):b),{}):e,d.target||f,d.g,d.o,d.k)}m.bind({g:1});let n,o,p,q=m.bind({k:1});function r(a,b){let c=this||{};return function(){let d=arguments;function e(f,g){let h=Object.assign({},f),i=h.className||e.className;c.p=Object.assign({theme:o&&o()},h),c.o=/ *go\d+/.test(i),h.className=m.apply(c,d)+(i?" "+i:""),b&&(h.ref=g);let j=a;return a[0]&&(j=h.as||a,delete h.as),p&&j[0]&&p(h),n(j,h)}return b?b(e):e}}var s=(a,b)=>"function"==typeof a?a(b):a,t=(b=0,()=>(++b).toString()),u="default",v=(a,b)=>{let{toastLimit:c}=a.settings;switch(b.type){case 0:return{...a,toasts:[b.toast,...a.toasts].slice(0,c)};case 1:return{...a,toasts:a.toasts.map(a=>a.id===b.toast.id?{...a,...b.toast}:a)};case 2:let{toast:d}=b;return v(a,{type:+!!a.toasts.find(a=>a.id===d.id),toast:d});case 3:let{toastId:e}=b;return{...a,toasts:a.toasts.map(a=>a.id===e||void 0===e?{...a,dismissed:!0,visible:!1}:a)};case 4:return void 0===b.toastId?{...a,toasts:[]}:{...a,toasts:a.toasts.filter(a=>a.id!==b.toastId)};case 5:return{...a,pausedAt:b.time};case 6:let f=b.time-(a.pausedAt||0);return{...a,pausedAt:void 0,toasts:a.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+f}))}}},w=[],x={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},y={},z=(a,b=u)=>{y[b]=v(y[b]||x,a),w.forEach(([a,c])=>{a===b&&c(y[b])})},A=a=>Object.keys(y).forEach(b=>z(a,b)),B=(a=u)=>b=>{z(b,a)},C={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=a=>(b,c)=>{let d,e=((a,b="blank",c)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:b,ariaProps:{role:"status","aria-live":"polite"},message:a,pauseDuration:0,...c,id:(null==c?void 0:c.id)||t()}))(b,a,c);return B(e.toasterId||(d=e.id,Object.keys(y).find(a=>y[a].toasts.some(a=>a.id===d))))({type:2,toast:e}),e.id},E=(a,b)=>D("blank")(a,b);E.error=D("error"),E.success=D("success"),E.loading=D("loading"),E.custom=D("custom"),E.dismiss=(a,b)=>{let c={type:3,toastId:a};b?B(b)(c):A(c)},E.dismissAll=a=>E.dismiss(void 0,a),E.remove=(a,b)=>{let c={type:4,toastId:a};b?B(b)(c):A(c)},E.removeAll=a=>E.remove(void 0,a),E.promise=(a,b,c)=>{let d=E.loading(b.loading,{...c,...null==c?void 0:c.loading});return"function"==typeof a&&(a=a()),a.then(a=>{let e=b.success?s(b.success,a):void 0;return e?E.success(e,{id:d,...c,...null==c?void 0:c.success}):E.dismiss(d),a}).catch(a=>{let e=b.error?s(b.error,a):void 0;e?E.error(e,{id:d,...c,...null==c?void 0:c.error}):E.dismiss(d)}),a};var F=1e3,G=q`
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
`,Z=({reverseOrder:a,position:b="top-center",toastOptions:d,gutter:f,children:g,toasterId:h,containerStyle:i,containerClassName:j})=>{let{toasts:k,handlers:l}=((a,b="default")=>{let{toasts:c,pausedAt:d}=((a={},b=u)=>{let[c,d]=(0,e.useState)(y[b]||x),f=(0,e.useRef)(y[b]);(0,e.useEffect)(()=>(f.current!==y[b]&&d(y[b]),w.push([b,d]),()=>{let a=w.findIndex(([a])=>a===b);a>-1&&w.splice(a,1)}),[b]);let g=c.toasts.map(b=>{var c,d,e;return{...a,...a[b.type],...b,removeDelay:b.removeDelay||(null==(c=a[b.type])?void 0:c.removeDelay)||(null==a?void 0:a.removeDelay),duration:b.duration||(null==(d=a[b.type])?void 0:d.duration)||(null==a?void 0:a.duration)||C[b.type],style:{...a.style,...null==(e=a[b.type])?void 0:e.style,...b.style}}});return{...c,toasts:g}})(a,b),f=(0,e.useRef)(new Map).current,g=(0,e.useCallback)((a,b=F)=>{if(f.has(a))return;let c=setTimeout(()=>{f.delete(a),h({type:4,toastId:a})},b);f.set(a,c)},[]);(0,e.useEffect)(()=>{if(d)return;let a=Date.now(),e=c.map(c=>{if(c.duration===1/0)return;let d=(c.duration||0)+c.pauseDuration-(a-c.createdAt);if(d<0){c.visible&&E.dismiss(c.id);return}return setTimeout(()=>E.dismiss(c.id,b),d)});return()=>{e.forEach(a=>a&&clearTimeout(a))}},[c,d,b]);let h=(0,e.useCallback)(B(b),[b]),i=(0,e.useCallback)(()=>{h({type:5,time:Date.now()})},[h]),j=(0,e.useCallback)((a,b)=>{h({type:1,toast:{id:a,height:b}})},[h]),k=(0,e.useCallback)(()=>{d&&h({type:6,time:Date.now()})},[d,h]),l=(0,e.useCallback)((a,b)=>{let{reverseOrder:d=!1,gutter:e=8,defaultPosition:f}=b||{},g=c.filter(b=>(b.position||f)===(a.position||f)&&b.height),h=g.findIndex(b=>b.id===a.id),i=g.filter((a,b)=>b<h&&a.visible).length;return g.filter(a=>a.visible).slice(...d?[i+1]:[0,i]).reduce((a,b)=>a+(b.height||0)+e,0)},[c]);return(0,e.useEffect)(()=>{c.forEach(a=>{if(a.dismissed)g(a.id,a.removeDelay);else{let b=f.get(a.id);b&&(clearTimeout(b),f.delete(a.id))}})},[c,g]),{toasts:c,handlers:{updateHeight:j,startPause:i,endPause:k,calculateOffset:l}}})(d,h);return e.createElement("div",{"data-rht-toaster":h||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:j,onMouseEnter:l.startPause,onMouseLeave:l.endPause},k.map(d=>{let h,i,j=d.position||b,k=l.calculateOffset(d,{reverseOrder:a,gutter:f,defaultPosition:b}),m=(h=j.includes("top"),i=j.includes("center")?{justifyContent:"center"}:j.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:c?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${k*(h?1:-1)}px)`,...h?{top:0}:{bottom:0},...i});return e.createElement(X,{id:d.id,key:d.id,onHeightUpdate:l.updateHeight,className:d.visible?Y:"",style:m},"custom"===d.type?s(d.message,d):g?g(d):e.createElement(W,{toast:d,position:j}))}))};a.s(["Toaster",()=>Z,"default",()=>E],6704)},29020,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(84505),e=a.i(69012),f=a.i(69520),g=a.i(75750),h=a.i(6704);a.i(45747);var i=a.i(50944);a.s(["default",0,()=>{let a=(0,i.useRouter)();process.env.NEXT_PUBLIC_API_URL;let[j,k]=(0,c.useState)([]),[l,m]=(0,c.useState)([]),[n,o]=(0,c.useState)(!0),[p,q]=(0,c.useState)(""),[r,s]=(0,c.useState)({start:"",end:""}),[t,u]=(0,c.useState)("all"),[v,w]=(0,c.useState)(!1),[x,y]=(0,c.useState)(1);(0,c.useEffect)(()=>{h.default.error("Please login first"),a.push("/login")},[a]);let z=async()=>{h.default.error("Authentication token missing. Redirecting to login..."),a.push("/login")};(0,c.useEffect)(()=>{z()},[]),(0,c.useEffect)(()=>{let a=[...j];p&&(a=a.filter(a=>a.name?.toLowerCase().includes(p.toLowerCase())||a.customer?.firstName?.toLowerCase().includes(p.toLowerCase())||a.customer?.email?.toLowerCase().includes(p.toLowerCase()))),r.start&&r.end&&(a=a.filter(a=>{let b=new Date(a.createdAt),c=new Date(r.start),d=new Date(r.end);return d.setHours(23,59,59),b>=c&&b<=d})),"all"!==t&&(a=a.filter(a=>a.financialStatus?.toLowerCase()===t.toLowerCase())),m(a),y(1)},[p,r,t,j]);let A=10*x,B=l.slice(A-10,A),C=Math.ceil(l.length/10);return n&&0===j.length?(0,b.jsx)("div",{className:"flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100",children:(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)(f.RefreshCw,{className:"w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600"}),(0,b.jsx)("p",{className:"text-lg text-gray-700",children:"Loading your orders..."})]})}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(h.Toaster,{position:"top-right"}),(0,b.jsx)("div",{className:"min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100",children:(0,b.jsxs)("div",{className:"container mx-auto p-4 sm:p-6 lg:p-8",children:[(0,b.jsx)("div",{className:"bg-white rounded-2xl shadow-xl p-6 mb-6",children:(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap",children:[(0,b.jsxs)("div",{className:"flex-1 min-w-[200px]",children:[(0,b.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold text-gray-800",children:"Orders Management"}),(0,b.jsx)("p",{className:"text-gray-600 mt-1",children:"Track and manage all orders"})]}),(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto",children:[(0,b.jsxs)("button",{onClick:()=>w(!v),className:"flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition",children:[(0,b.jsx)(e.Filter,{className:"w-5 h-5"})," Filters"]}),(0,b.jsxs)("button",{onClick:z,disabled:n,className:"flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-70",children:[(0,b.jsx)(f.RefreshCw,{className:`w-5 h-5 ${n?"animate-spin":""}`})," Refresh"]}),(0,b.jsxs)("button",{onClick:()=>{let a=l.map(a=>({Order:a.name||"-",Date:new Date(a.createdAt).toLocaleDateString("en-IN"),Customer:`${a.customer?.firstName||"Guest"} ${a.customer?.lastName||""}`.trim(),Channel:a.channel||"-",Total:`₹${parseFloat(a.total||0).toFixed(2)}`,"Payment Status":a.financialStatus||"Unknown","Fulfillment Status":a.fulfillmentStatus||"Unknown",Items:a.items?.length||0,"Delivery Status":a.deliveryStatus||"Unknown","Delivery Method":a.deliveryMethod||"-",Tags:a.tags||"-"})),b=g.utils.json_to_sheet(a),c=g.utils.book_new();g.utils.book_append_sheet(c,b,"Orders"),g.writeFile(c,`orders_${new Date().toISOString().split("T")[0]}.xlsx`),h.default.success("Excel downloaded successfully!")},className:"flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition",children:[(0,b.jsx)(d.Download,{className:"w-5 h-5"})," Excel"]})]})]})}),v&&(0,b.jsxs)("div",{className:"bg-white rounded-xl shadow p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4",children:[(0,b.jsx)("input",{type:"text",placeholder:"Search orders...",value:p,onChange:a=>q(a.target.value),className:"px-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500"}),(0,b.jsx)("input",{type:"date",value:r.start,onChange:a=>s({...r,start:a.target.value}),className:"px-4 py-3 border rounded-lg"}),(0,b.jsx)("input",{type:"date",value:r.end,onChange:a=>s({...r,end:a.target.value}),className:"px-4 py-3 border rounded-lg"}),(0,b.jsxs)("select",{value:t,onChange:a=>u(a.target.value),className:"px-4 py-3 border rounded-lg",children:[(0,b.jsx)("option",{value:"all",children:"All Status"}),(0,b.jsx)("option",{value:"paid",children:"Paid"}),(0,b.jsx)("option",{value:"pending",children:"Pending"}),(0,b.jsx)("option",{value:"refunded",children:"Refunded"})]})]}),(0,b.jsx)("div",{className:"bg-white rounded-2xl shadow-xl overflow-hidden",children:(0,b.jsx)("div",{className:"overflow-x-auto",children:(0,b.jsxs)("table",{className:"w-full min-w-[1400px]",children:[(0,b.jsx)("thead",{className:"bg-gray-900 text-white",children:(0,b.jsxs)("tr",{children:[(0,b.jsx)("th",{className:"px-4 py-3 text-left text-sm font-medium",children:"Order"}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-sm font-medium",children:"Date"}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-sm font-medium",children:"Customer"}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-sm font-medium",children:"Channel"}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-sm font-medium",children:"Total"}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-sm font-medium",children:"Payment Status"}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-sm font-medium",children:"Fulfillment Status"}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-sm font-medium",children:"Items"}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-sm font-medium",children:"Delivery Status"}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-sm font-medium",children:"Delivery Method"}),(0,b.jsx)("th",{className:"px-4 py-3 text-left text-sm font-medium",children:"Tags"})]})}),(0,b.jsx)("tbody",{className:"divide-y divide-gray-200",children:0===B.length?(0,b.jsx)("tr",{children:(0,b.jsx)("td",{colSpan:"11",className:"text-center py-12 text-gray-500",children:"No orders found matching your criteria."})}):B.map(a=>(0,b.jsxs)("tr",{className:"hover:bg-gray-50 transition",children:[(0,b.jsx)("td",{className:"px-4 py-3 font-bold text-blue-600",children:a.name||"-"}),(0,b.jsx)("td",{className:"px-4 py-3 text-gray-700",children:new Date(a.createdAt).toLocaleDateString("en-IN")}),(0,b.jsx)("td",{className:"px-4 py-3 text-gray-700",children:a.customer?.firstName?`${a.customer.firstName} ${a.customer.lastName||""}`:"Guest"}),(0,b.jsx)("td",{className:"px-4 py-3 text-gray-700",children:a.channel||"-"}),(0,b.jsxs)("td",{className:"px-4 py-3 font-bold text-green-600",children:["₹",parseFloat(a.total||0).toFixed(2)]}),(0,b.jsx)("td",{className:"px-4 py-3",children:(0,b.jsx)("span",{className:`px-3 py-1 rounded-full text-xs font-medium ${(a=>{if(!a)return"bg-gray-100 text-gray-800";let b=a.toUpperCase();return b.includes("PAID")?"bg-green-100 text-green-800":b.includes("PENDING")?"bg-yellow-100 text-yellow-800":b.includes("REFUNDED")?"bg-red-100 text-red-800":"bg-gray-100 text-gray-800"})(a.financialStatus)}`,children:a.financialStatus||"Unknown"})}),(0,b.jsx)("td",{className:"px-4 py-3",children:(0,b.jsx)("span",{className:`px-3 py-1 rounded-full text-xs font-medium ${(a=>{if(!a)return"bg-gray-100 text-gray-800";let b=a.toUpperCase();return b.includes("FULFILLED")?"bg-green-100 text-green-800":b.includes("UNFULFILLED")?"bg-yellow-100 text-yellow-800":"bg-gray-100 text-gray-800"})(a.fulfillmentStatus)}`,children:a.fulfillmentStatus||"Unknown"})}),(0,b.jsx)("td",{className:"px-4 py-3 text-gray-700",children:a.items?.length||0}),(0,b.jsx)("td",{className:"px-4 py-3 text-gray-700",children:a.deliveryStatus||"-"}),(0,b.jsx)("td",{className:"px-4 py-3 text-gray-700",children:a.deliveryMethod||"-"}),(0,b.jsx)("td",{className:"px-4 py-3 text-gray-700",children:(0,b.jsx)("span",{className:"text-xs bg-gray-100 px-2 py-1 rounded",children:a.tags||"-"})})]},a.id))})]})})}),C>1&&(0,b.jsxs)("div",{className:"flex justify-center items-center gap-4 mt-8 bg-white rounded-xl shadow p-4",children:[(0,b.jsx)("button",{onClick:()=>y(a=>Math.max(1,a-1)),disabled:1===x,className:"px-5 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition",children:"Previous"}),(0,b.jsxs)("span",{className:"text-gray-700 font-medium",children:["Page ",x," of ",C]}),(0,b.jsx)("button",{onClick:()=>y(a=>Math.min(C,a+1)),disabled:x===C,className:"px-5 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition",children:"Next"})]})]})})]})}])}];

//# sourceMappingURL=_9ea0a230._.js.map