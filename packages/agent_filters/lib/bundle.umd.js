!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("graphai"),require("ajv"),require("@noble/hashes/sha2")):"function"==typeof define&&define.amd?define(["exports","graphai","ajv","@noble/hashes/sha2"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).graphai_agent_filters={},e.graphai,e.Ajv,e.sha2)}(this,(function(e,t,a,n){"use strict";const r=(e,t,n,r)=>{if(!(new a).compile(e)(t))throw new Error(`${n}(${r??"func"}) schema not matched`);return!0};const s=async(e,t,a,n,r)=>{const s=async function*(e,t,a){const{params:n,namedInputs:r,debugInfo:s,filterParams:o}=t,i={params:n,debugInfo:s,filterParams:o,namedInputs:r},c={...a,"Content-Type":"text/event-stream"},d=await fetch(e,{headers:c,method:"POST",body:JSON.stringify(i)}),u=d.body?.getReader();if(200!==d.status||!u)throw new Error("Request failed");const f=new TextDecoder("utf-8");let l=!1;for(;!l;){const{done:e,value:t}=await u.read();if(e)l=e,u.releaseLock();else{const e=f.decode(t,{stream:!0});yield e}}}(t,a,n),o=[];for await(const t of s)r&&console.log(t),t&&(o.push(t),-1===o.join("").indexOf("___END___")&&e.filterParams.streamTokenCallback&&e.filterParams.streamTokenCallback(t));const i=o.join("").split("___END___")[1];return JSON.parse(i)},o=e=>Array.isArray(e)?e.map((e=>o(e))):t.isObject(e)?Object.keys(e).sort().reduce(((t,a)=>(t[a]=e[a],t)),{}):e,i=e=>{const{namedInputs:t,params:a,debugInfo:r}=e,{agentId:s}=r,i=n.sha256(JSON.stringify(o({namedInputs:t,params:a,agentId:s})));return btoa(String.fromCharCode(...i))};e.agentFilterRunnerBuilder=e=>{const t=e;return(e,a)=>{let n=0;const r=e=>{const s=t[n++];return s?s.agent(e,r):a(e)};return r(e)}},e.agentInputValidator=r,e.cacheAgentFilterGenerator=e=>{const{getCache:t,setCache:a,getCacheKey:n}=e;return async(e,r)=>{if("pureAgent"===e.cacheType||void 0===e.cacheType){const s=n?n(e):i(e),o=await t(s);if(o)return o;const c=await r(e);return await a(s,c),c}return"impureAgent"===e.cacheType&&(e.filterParams.cache={getCache:t,setCache:a,getCacheKey:i}),r(e)}},e.httpAgentFilter=async(e,a)=>{const{params:n,debugInfo:r,filterParams:o,namedInputs:i,config:c}=e;if(o?.server){const{baseUrl:a,isDebug:d,serverAgentUrlDictionary:u}=o.server,f=c?.headers??{};if(!t.isObject(f))throw new Error("httpAgentFilter: headers is not object.");const l=r.agentId,p=void 0!==o.streamTokenCallback,h=u&&l&&u[l]?u[l]:[a,l].join("/");void 0===h&&console.log("httpAgentFilter: Url is not defined");const g={params:n,debugInfo:r,filterParams:o,namedInputs:i,inputs:i};return p?await s(e,h,g,f,d):await(async(e,t,a)=>{const n={...a,"Content-Type":"application/json"},r=await fetch(e,{method:"post",headers:n,body:JSON.stringify(t)});return await r.json()})(h,g,f)}return a(e)},e.namedInputValidatorFilter=async(e,t)=>{const{inputSchema:a,namedInputs:n}=e,{agentId:s,nodeId:o}=e.debugInfo;return a&&"array"!==a.type&&r(a,n||{},o,s),t(e)},e.sortObjectKeys=o,e.streamAgentFilterGenerator=e=>async(a,n)=>(a.debugInfo.isResult&&(a.filterParams.streamTokenCallback=n=>{a.debugInfo.state===t.NodeState.Executing&&e(a,n)}),n(a))}));
//# sourceMappingURL=bundle.umd.js.map
