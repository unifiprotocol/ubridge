(this.webpackJsonpubridge=this.webpackJsonpubridge||[]).push([[0],{1014:function(e,n,t){"use strict";t.r(n);var c,i,r,a,o,s,d,l,u,j,b,O,h,m,f,x,p,v,g,k,y,S,C,w,T,E,I,N,B,F=t(1),q=t.n(F),A=t(118),L=t.n(A),U=t(140),D=t(28),M=t(17),z=t(26),_=t(3),Y=q.a.createContext({connection:void 0,eventBus:void 0,balances:[]}),R=function(){var e,n,t=Object(F.useContext)(Y);return{addToken:Object(F.useCallback)((function(e){var n=t.eventBus;n&&n.emit(new U.a(e))}),[t]),connection:t.connection,adapter:null===(e=t.connection)||void 0===e||null===(n=e.adapter)||void 0===n?void 0:n.adapter,balances:t.balances,eventBus:t.eventBus}},P=t(18),W=t(108),X=Object(W.b)({key:"configState",default:{}}),H=function(){var e=Object(W.c)(X),n=Object(P.a)(e,2),t=n[0],c=n[1],i=R().connection,r=Object(F.useMemo)((function(){return i&&t[i.config.blockchain]?t[i.config.blockchain]:void 0}),[t,i]);return{config:t,blockchainConfig:r,setConfig:c}},J=t.p+"static/media/doodle.d0c47ef6.png",V=_.d.div(c||(c=Object(z.a)(["\n  padding-top: 2rem;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n"]))),$=_.d.div(i||(i=Object(z.a)(["\n  width: 100%;\n\n  background: url(",") #191a21;\n  background-repeat: no-repeat;\n  background-size: 60%;\n  background-position: -8rem;\n\n  padding: 0.75rem 1.5rem;\n  border-radius: 1rem;\n  text-align: justify;\n\n  @media (max-width: 576px) {\n    padding: 0;\n    max-width: 100%;\n    background: none;\n  }\n\n  h1 {\n    margin: 0.5rem 0;\n  }\n"])),J),G=_.d.div(r||(r=Object(z.a)(["\n  padding: 0.75rem;\n\n  h1 {\n    margin: 0;\n    font-size: 1rem;\n  }\n\n  .title {\n    text-transform: uppercase;\n    font-size: 0.8rem;\n    margin: 0.1rem 0;\n    margin-top: 0.5rem;\n    opacity: 0.8;\n    color: rgb(0, 230, 118);\n  }\n\n  .asset {\n    display: flex;\n    align-items: center;\n    padding: 0.2rem 0;\n\n    img {\n      height: 24px;\n      width: auto;\n    }\n\n    > * {\n      padding-right: 0.25rem;\n    }\n  }\n"]))),K=t(8),Q=_.d.div(a||(a=Object(z.a)(["\n  margin-top: 1rem;\n  width: 100vw;\n  display: flex;\n  justify-content: center;\n"]))),Z=function(e){var n=e.children,t=R().connection,c=H().config;return t&&c[t.config.blockchain]?Object(K.jsx)(Q,{children:n}):Object(K.jsx)(Q,{children:Object(K.jsx)("div",{style:{maxWidth:"992px",width:"100%"},children:Object(K.jsxs)($,{children:[Object(K.jsx)(D.l,{children:"Blockchain not supported"}),Object(K.jsx)("p",{children:"Working in progress to give you the availability of UNFI crosschain."}),Object(K.jsx)("p",{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."})]})})})},ee=t(481),ne=t(42),te=_.d.div(o||(o=Object(z.a)(["\n  max-width: 992px;\n  width: 100%;\n  margin-bottom: 2rem;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n"]))),ce=_.d.div(s||(s=Object(z.a)(["\n  padding: 1rem;\n"]))),ie=t(1019),re=(_.d.div(d||(d=Object(z.a)([""]))),_.d.div(l||(l=Object(z.a)([""])))),ae=_.d.div(u||(u=Object(z.a)([""]))),oe=(_.d.div(j||(j=Object(z.a)(["\n  display: flex;\n  align-items: center;\n"]))),_.d.div(b||(b=Object(z.a)(["\n  padding: 0.75rem;\n  line-height: 0;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 90%;\n  color: ",";\n\n  svg {\n    vertical-align: middle;\n    margin-right: 0.3rem;\n  }\n"])),(function(e){return e.theme.txt200}))),se=_.d.div(O||(O=Object(z.a)(["\n  padding: 1rem 0.3rem;\n"]))),de=Object(_.d)(D.k)(h||(h=Object(z.a)(["\n  font-weight: bold;\n  font-size: 110%;\n"]))),le=_.d.div(m||(m=Object(z.a)(["\n  cursor: pointer;\n  margin-top: 0.5rem;\n\n  :focus-within,\n  :hover {\n    color: ",";\n  }\n\n  input {\n    font-size: 0.95rem;\n  }\n"])),(function(e){return e.theme.primary})),ue=_.d.div(f||(f=Object(z.a)(["\n  text-align: center;\n  font-size: 0.85rem;\n"]))),je=_.d.div(x||(x=Object(z.a)(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 0.3rem;\n  margin-bottom: 0.5rem;\n"]))),be=t(49),Oe=_.d.ul(p||(p=Object(z.a)(["\n  padding: 0;\n  margin: 0;\n"]))),he=_.d.li(v||(v=Object(z.a)(["\n  padding: 0;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n"]))),me=_.d.div(g||(g=Object(z.a)(["\n  color: ",";\n"])),(function(e){return e.theme.txt200})),fe=_.d.div(k||(k=Object(z.a)([""]))),xe=function(){return Object(K.jsxs)(Oe,{children:[Object(K.jsxs)(he,{children:[Object(K.jsx)(me,{children:"Max swap size"}),Object(K.jsxs)(fe,{children:[14e3.toLocaleString()," UNFI"]})]}),Object(K.jsxs)(he,{children:[Object(K.jsx)(me,{children:"Swap fee"}),Object(K.jsx)(fe,{children:"0% ~ 0 UNFI"})]}),Object(K.jsxs)(he,{children:[Object(K.jsx)(me,{children:"Transaction cost"}),Object(K.jsx)(fe,{children:"~0.00001123 BNB"})]}),Object(K.jsxs)(he,{children:[Object(K.jsx)(me,{children:"Estimated time"}),Object(K.jsx)(fe,{children:"~2min"})]})]})},pe=_.d.div(y||(y=Object(z.a)(["\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin-bottom: 1rem;\n"]))),ve=_.d.div(S||(S=Object(z.a)(["\n  width: 50%;\n  b {\n    color: ",";\n  }\n  span {\n    display: block;\n\n    margin-bottom: 0.5rem;\n  }\n  padding: 0.5rem;\n  border: 3px solid ",";\n  border-radius: ",";\n"])),(function(e){return e.theme.primary}),(function(e){return e.theme.bgAlt2}),(function(e){return e.theme.borderRadius})),ge=Object(_.d)(ve)(C||(C=Object(z.a)([""]))),ke=Object(_.d)(ve)(w||(w=Object(z.a)([""]))),ye=_.d.div(T||(T=Object(z.a)(["\n  margin-bottom: 0.5rem;\n"]))),Se=_.d.div(E||(E=Object(z.a)(["\n  margin: 2rem 0 1rem 0;\n"]))),Ce=Object(_.d)(D.f)(I||(I=Object(z.a)(["\n  max-width: 28rem;\n"]))),we=_.d.div(N||(N=Object(z.a)(["\n  margin-bottom: 2rem;\n"]))),Te=function(e){var n=e.close,t=Object(F.useState)(!1),c=Object(P.a)(t,2),i=c[0],r=c[1];return Object(K.jsxs)(Ce,{children:[Object(K.jsxs)(D.i,{children:[Object(K.jsx)(D.j,{children:"Transfer overview"}),Object(K.jsx)(D.h,{onClick:n})]}),Object(K.jsxs)(D.g,{children:[Object(K.jsx)(we,{children:"You are about to confirm the crosschain transaction below: "}),Object(K.jsxs)(pe,{children:[Object(K.jsxs)(ge,{children:[Object(K.jsxs)("span",{children:["From ",Object(K.jsx)("b",{children:"Binance"})]}),Object(K.jsx)(ye,{children:Object(M.shortAddress)("0x52856Ca4ddb55A1420950857C7882cFC8E02281C")}),Object(K.jsx)(D.o,{token:new M.Currency("UNFI",18,"UNFI","UNFI"),amount:"100"})]}),Object(K.jsxs)(ke,{children:[Object(K.jsxs)("span",{children:["To ",Object(K.jsx)("b",{children:"Ethereum"})]}),Object(K.jsx)(ye,{children:Object(M.shortAddress)("0x49506Ca4ddb55A1420950857C7882cFC8E02123A")}),Object(K.jsx)(D.o,{token:new M.Currency("UNFI",18,"UNFI","UNFI"),amount:"99"})]})]}),Object(K.jsx)(xe,{}),Object(K.jsx)(Se,{children:Object(K.jsx)(D.c,{checked:i,onChange:r,label:Object(K.jsxs)(K.Fragment,{children:["I read and accept the ",Object(K.jsx)("a",{href:"#xd",children:"terms and conditions"})]})})}),Object(K.jsx)(D.k,{disabled:!i,block:!0,size:"xl",children:"Perform swap"})]})]})},Ee=function(){var e=H().blockchainConfig,n=R(),t=n.adapter,c=n.balances,i=n.connection,r=function(){var e=R().adapter,n=Object(F.useState)("0"),t=Object(P.a)(n,2),c=t[0],i=t[1],r=Object(F.useState)(void 0),a=Object(P.a)(r,2),o=a[0],s=a[1],d=Object(F.useState)((null===e||void 0===e?void 0:e.isConnected())?e.getAddress():""),l=Object(P.a)(d,2),u=l[0],j=l[1];return Object(F.useEffect)((function(){""===u&&(null===e||void 0===e?void 0:e.isConnected())&&j(e.getAddress())}),[e,u]),{amount:c,token0:o,token1:o,destinationAddress:u,setDestinationAddress:j,setAmount:i,setToken0:s}}(),a=r.amount,o=r.token0,s=r.token1,d=r.destinationAddress,l=r.setDestinationAddress,u=r.setAmount,j=r.setToken0,b=Object(F.useMemo)((function(){return{}}),[]),O=Object(D.s)({component:Te,props:b,options:{disableBackdropClick:!0}}),h=Object(P.a)(O,1)[0],m=Object(F.useMemo)((function(){return e?Object.values(e.tokens).map((function(e){return{currency:e}})):[]}),[e]);Object(F.useEffect)((function(){!o&&m.length>0&&j(m[0].currency)}),[j,o,m,m.length]);var f=Object(F.useMemo)((function(){var e;if(!o)return"0";var n=c.find((function(e){return e.currency.equals(o)}));return o.toFactorized(null!==(e=null===n||void 0===n?void 0:n.balance)&&void 0!==e?e:"0")}),[o,c]);return Object(K.jsx)(K.Fragment,{children:Object(K.jsx)(D.a,{children:Object(K.jsxs)(D.b,{children:[Object(K.jsxs)(re,{children:[Object(K.jsxs)(je,{children:[Object(K.jsx)("span",{children:"From"}),Object(K.jsx)(D.k,{variant:"outline",children:null===i||void 0===i?void 0:i.config.blockchain})]}),Object(K.jsx)(D.q,{label:"Send",balanceLabel:"Balance",amount:a,token:o,balance:f,onAmountChange:u,onTokenChange:j,tokenList:m})]}),Object(K.jsxs)(oe,{children:[Object(K.jsx)(be.a,{size:30})," ",Object(K.jsx)("span",{children:"You will receive"})]}),Object(K.jsxs)(ae,{children:[Object(K.jsxs)(je,{children:[Object(K.jsx)("span",{children:"To"}),Object(K.jsx)(D.k,{variant:"outline",children:M.Blockchains.Ethereum})]}),Object(K.jsx)(D.p,{label:"Receive",balanceLabel:"Balance",amount:a,token:s,disableTokenChange:!0,disableMaxAction:!0,disableAmountChange:!0,onAmountChange:function(){}}),t&&Object(K.jsx)(le,{children:Object(K.jsx)(D.e,{value:d,onChange:function(e){return l(e.currentTarget.value)},prefixAddon:Object(K.jsx)(ue,{children:"Destination Address"})})})]}),Object(K.jsx)(se,{children:Object(K.jsx)(xe,{})}),Object(K.jsxs)(de,{block:!0,size:"xl",onClick:h,children:[Object(K.jsx)(be.a,{size:30})," Transfer overview"]})]})})})},Ie=function(){return Object(K.jsxs)(K.Fragment,{children:[Object(K.jsxs)($,{children:[Object(K.jsx)(D.l,{children:"Bridge"}),Object(K.jsx)("p",{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."})]}),Object(K.jsx)(V,{children:Object(K.jsx)(Ee,{})})]})},Ne=t(6),Be=t.n(Ne),Fe=t(25),qe=t(139),Ae=t(120),Le=Object.values(Ae.Blockchains).reduce((function(e,n){var t=n,c=Object(Ae.getBlockchainOfflineConnector)(t,{random:!0});return c.connect(),e[t]=c,e}),{}),Ue=t(7),De=t(10),Me=t(11),ze=t(12);!function(e){e.BalanceOf="balanceOf"}(B||(B={}));var _e=function(e){Object(Me.a)(t,e);var n=Object(ze.a)(t);function t(e){return Object(Ue.a)(this,t),n.call(this,e.tokenAddress,B.BalanceOf,e,!1)}return Object(De.a)(t,[{key:"getArgs",value:function(){return[this.params.owner]}}]),t}(Ae.ContractUseCase),Ye=Object(W.b)({key:"liquidityState",default:Object.values(Ae.Blockchains).reduce((function(e,n){return e[n]=[],e}),{})}),Re=function(){var e=Object(W.c)(Ye),n=Object(P.a)(e,2),t=n[0],c=n[1],i=H().config,r=Object(F.useCallback)(Object(qe.a)(Be.a.mark((function e(){var n,r,a,o;return Be.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=Object(Fe.a)({},t),r=Be.a.mark((function e(){var t,c,r,s,d,l,u;return Be.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=o[a],r=i[c=t]){e.next=5;break}return e.abrupt("return","break");case 5:if(s=Object.values(r.tokens),d=Le[c].adapter){e.next=9;break}return e.abrupt("return","break");case 9:return l=s.map((function(e){return new _e({owner:r.bridgeContract,tokenAddress:e.address})})),e.next=12,Promise.all(s.map((function(e){return d.adapter.initializeToken(e.address)})));case 12:return e.next=14,d.multicall.execute(l);case 14:u=e.sent,n[c]=u.map((function(e,n){var t;return{currency:s[n],balance:null!==(t=e.value)&&void 0!==t?t:"0"}}));case 16:case"end":return e.stop()}}),e)})),a=0,o=Object.keys(i);case 3:if(!(a<o.length)){e.next=11;break}return e.delegateYield(r(),"t0",5);case 5:if("break"!==e.t0){e.next=8;break}return e.abrupt("break",11);case 8:a++,e.next=3;break;case 11:c(n);case 12:case"end":return e.stop()}}),e)}))),[i,t,c]);return{liquidity:t,updateLiquidity:r}},Pe=function(){var e=H().config;return Object(K.jsxs)(K.Fragment,{children:[Object(K.jsxs)($,{children:[Object(K.jsx)(D.l,{children:"Liquidity"}),Object(K.jsx)("p",{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."})]}),Object(K.jsx)(V,{children:Object.keys(e).map((function(e,n){var t=e;return Object(F.createElement)(We,{blockchain:t,key:n})}))})]})},We=function(e){var n=e.blockchain,t=Re().liquidity,c=Object(F.useMemo)((function(){return t[n]}),[n,t]);return Object(K.jsx)(D.d,{children:Object(K.jsxs)(G,{children:[Object(K.jsx)("h1",{children:M.VernacularBlockchains[n]}),Object(K.jsx)("div",{className:"title",children:"TVL"}),Object(K.jsxs)("div",{children:["$",5e6.toLocaleString()]}),Object(K.jsx)("div",{className:"title",children:"Assets"}),c.map((function(e,n){return Object(K.jsxs)("div",{className:"asset",children:[Object(K.jsx)("img",{src:"https://assets.unifiprotocol.com/UNFI.png",alt:"UNFI"}),Object(K.jsx)("span",{children:Object(M.BN)(e.balance).toNumber().toLocaleString()}),Object(K.jsx)("span",{children:e.currency.symbol})]},n)}))]})})},Xe=function(){var e=Object(F.useState)("swap"),n=Object(P.a)(e,2),t=n[0],c=n[1],i=(Object(ie.a)().i18n,Object(F.useMemo)((function(){return function(){return"swap"===t?Object(K.jsx)(Ie,{}):Object(K.jsx)(Pe,{})}}),[t]));return Object(K.jsxs)(te,{children:[Object(K.jsx)(ce,{children:Object(K.jsx)(D.m,{choices:[{value:"swap",label:"Swap"},{value:"liquidity",label:"Liquidity"}],onChange:c,selected:t})}),Object(K.jsx)(i,{})]})},He=t(1018),Je="https://proxy.unifiprotocol.com/bridge";function Ve(){return(Ve=Object(qe.a)(Be.a.mark((function e(){var n;return Be.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(Je,"/v1/blockchains")).then((function(e){return e.json()}));case 2:return n=e.sent,Object.keys(n.result).forEach((function(e){var t=e,c=n.result[t];Object.keys(c.tokens).forEach((function(e){var n=c.tokens[e];c.tokens[e]=new M.Currency(n.address,n.decimals,n.symbol,n.name)}))})),e.abrupt("return",Object(Fe.a)({},n));case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var $e=function(){var e=Object(F.useState)(!1),n=Object(P.a)(e,2),t=n[0],c=n[1],i=H(),r=i.config,a=i.setConfig,o=R(),s=o.adapter,d=o.eventBus,l=o.addToken,u=Object(F.useCallback)((function(){if(null===s||void 0===s?void 0:s.isConnected()){var e=s.blockchainConfig.blockchain,n=r[e];n&&(Object.values(n.tokens).forEach((function(e){l(e)})),setTimeout((function(){return null===d||void 0===d?void 0:d.emit(new U.b)})))}}),[s,r,d,l]);return Object(F.useEffect)((function(){(null===s||void 0===s?void 0:s.isConnected())&&Object.keys(r).length>0&&!t&&(u(),c(!0))}),[s,r,t,u]),Object(F.useEffect)((function(){(function(){return Ve.apply(this,arguments)})().then((function(e){a(e.result)}))}),[]),Object(K.jsx)(K.Fragment,{})},Ge=t(92),Ke=function(e){Object(Me.a)(t,e);var n=Object(ze.a)(t);function t(){var e;Object(Ue.a)(this,t);for(var c=arguments.length,i=new Array(c),r=0;r<c;r++)i[r]=arguments[r];return(e=n.call.apply(n,[this].concat(i))).clockTenSeconds=void 0,e.clockThirtySeconds=void 0,e.clockSixtySeconds=void 0,e.clockTwoMinutes=void 0,e}return Object(De.a)(t,[{key:"start",value:function(){var e=this;console.debug("[Clocks] Start"),this.emit("TEN_SECONDS",{}),this.emit("THIRTY_SECONDS",{}),this.emit("SIXTY_SECONDS",{}),this.emit("TWO_MINUTES",{}),this.clockTwoMinutes=setInterval((function(){e.emit("TWO_MINUTES",{})}),12e4),this.clockSixtySeconds=setInterval((function(){e.emit("SIXTY_SECONDS",{})}),6e4),this.clockThirtySeconds=setInterval((function(){e.emit("THIRTY_SECONDS",{})}),3e4),this.clockTenSeconds=setInterval((function(){e.emit("TEN_SECONDS",{})}),1e4)}},{key:"clear",value:function(){this.clockTwoMinutes&&clearInterval(this.clockTwoMinutes),this.clockSixtySeconds&&clearInterval(this.clockSixtySeconds),this.clockThirtySeconds&&clearInterval(this.clockThirtySeconds),this.clockTenSeconds&&clearInterval(this.clockTenSeconds)}}]),t}(t.n(Ge).a),Qe=new Ke,Ze=function(){var e=Object(F.useState)(!1),n=Object(P.a)(e,2),t=n[0],c=n[1],i=Re().updateLiquidity,r=H().config;return Object(F.useEffect)((function(){Object.keys(r).length>0&&!t&&(i(),c(!0))}),[r,t,i]),Object(F.useEffect)((function(){var e=function(){return i()};return Qe.on("SIXTY_SECONDS",e),function(){Qe.off("SIXTY_SECONDS",e)}}),[i]),Object(K.jsx)(K.Fragment,{})},en=function(e){var n=e.i18n,t=e.connection,c=e.balances,i=e.eventBus,r=Object(F.useMemo)((function(){var e,n;return null!==(e=null===(n=t.adapter)||void 0===n?void 0:n.adapter.blockchainConfig.blockchain)&&void 0!==e?e:M.Blockchains.Binance}),[t]);return Object(F.useEffect)((function(){Qe.start()}),[]),Object(K.jsx)(Y.Provider,{value:{connection:t,balances:c,eventBus:i},children:Object(K.jsx)(He.a,{i18n:n,children:Object(K.jsxs)(D.r,{theme:D.n.Dark,options:{tokenLogoResolver:M.TokenLogoResolvers[r]},children:[Object(K.jsx)($e,{}),Object(K.jsx)(Ze,{}),Object(K.jsx)(ee.a,{children:Object(K.jsx)(Z,{children:Object(K.jsx)(ne.c,{children:Object(K.jsx)(ne.a,{path:"/",children:Object(K.jsx)(Xe,{})})})})})]})})})},nn=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,1021)).then((function(n){var t=n.getCLS,c=n.getFID,i=n.getFCP,r=n.getLCP,a=n.getTTFB;t(e),c(e),i(e),r(e),a(e)}))};L.a.render(Object(K.jsx)(q.a.StrictMode,{children:Object(K.jsx)(W.a,{children:Object(K.jsx)(U.c,{Wrapped:en})})}),document.getElementById("root")),nn()},508:function(e,n){},510:function(e,n){},558:function(e,n){},578:function(e,n){},580:function(e,n){},592:function(e,n){},594:function(e,n){},619:function(e,n){},624:function(e,n){},626:function(e,n){},633:function(e,n){},646:function(e,n){}},[[1014,1,2]]]);
//# sourceMappingURL=main.a5986bf6.chunk.js.map