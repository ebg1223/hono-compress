"use strict";var R=Object.create;var m=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var A=Object.getOwnPropertyNames;var O=Object.getPrototypeOf,D=Object.prototype.hasOwnProperty;var o=(e,r)=>m(e,"name",{value:r,configurable:!0});var S=(e,r,t,s)=>{if(r&&typeof r=="object"||typeof r=="function")for(let n of A(r))!D.call(e,n)&&n!==t&&m(e,n,{get:()=>r[n],enumerable:!(s=g(r,n))||s.enumerable});return e};var I=(e,r,t)=>(t=e!=null?R(O(e)):{},S(r||!e||!e.__esModule?m(t,"default",{value:e,enumerable:!0}):t,e));Object.defineProperty(exports,"__esModule",{value:!0});var k=require("hono/utils/compress"),N=require("@mongodb-js/zstd");const y="Cloudflare-Workers",w=["zstd","br","gzip","deflate"],P=/(?:^|,)\s*no-transform\s*(?:,|$)/i,v=1024,z=2,B=4,G=6,q=globalThis.navigator?.userAgent===y,M=globalThis.Deno?.env?.get("DENO_DEPLOYMENT_ID")!==void 0;function Z(e,r){const t=e.headers.get("Content-Type");return t?k.COMPRESSIBLE_CONTENT_TYPE_REGEX.test(t):r}o(Z,"shouldCompress");function F(e){const r=e.headers.get("Cache-Control");return!r||!P.test(r)}o(F,"shouldTransform");const U=import("node:zlib");let c;U.then(e=>{c=e}).catch(()=>null);class L extends TransformStream{static{o(this,"ZstdCompressionStream")}constructor(r){super({async transform(t,s){s.enqueue(await N.compress(t,r))}})}}class b{static{o(this,"ZlibCompressionStream")}readable;writable;constructor(r,t){let s;switch(r){case"br":{const{windowBits:n,level:l,memLevel:u,params:E,...h}=t??{},{BROTLI_PARAM_LGWIN:C,BROTLI_PARAM_QUALITY:a,BROTLI_PARAM_LGBLOCK:p}=c.constants,i={params:{...n&&{[C]:n},...l&&{[a]:l},...u&&{[p]:u},...E},...h};s=c.createBrotliCompress(i);break}case"deflate":{s=c.createDeflate(t);break}case"gzip":{s=c.createGzip(t);break}default:s=c.createDeflateRaw(t)}this.readable=new ReadableStream({async start(n){for await(const l of s.iterator())n.enqueue(l);n.close()}}),this.writable=new WritableStream({write:o(n=>s.write(n),"write"),close:o(()=>s.end(),"close")})}}function W(e){const r=e.find(t=>!w.includes(t));if(r)throw new Error(`Invalid compression encoding: ${r}`)}o(W,"checkCompressEncodings");function H(e){if(!e.res.body||e.req.method==="HEAD")throw Error}o(H,"checkResposeType");function V(e,r,t){if(e.req.header("x-no-compression")||e.res.headers.has("Content-Encoding"))throw Error;const s=Number(e.res.headers.get("Content-Length"));if(s&&s<r||!Z(e.res,t)||!F(e.res))throw Error}o(V,"checkResponseCompressible");function Y(e,r){if(r!=null){if(!r(e))throw Error}else if(M||q)throw Error}o(Y,"checkResponseFilter");function T(e,r){const t=e.req.header("Accept-Encoding");if(t)return r.find(s=>t.includes(s))}o(T,"findAcceptedEncoding");function $(e,r){return T(e,r.filter(t=>t==="gzip"||t==="deflate"))}o($,"findBackupEncoding");function _({encoding:e,encodings:r=[...w],force:t=!1,threshold:s=v,zstdLevel:n=z,brotliLevel:l=B,gzipLevel:u=G,options:E={},filter:h}={}){return e&&(r=[e]),W(r),o(async function(a,p){await p();try{H(a),V(a,s,t),Y(a,h)}catch{return}const i=T(a,r)??(t&&r[0]);if(!i)return;let d;if(i==="zstd")d=new L(n);else if(c){const f=i==="br"?l:u;d=new b(i,{level:f,...E})}else if(CompressionStream){const f=$(a,r);if(!f)return;d=new CompressionStream(f)}d&&(a.res=new Response(a.res.body.pipeThrough(d),a.res),a.res.headers.delete("Content-Length"),a.res.headers.set("Content-Encoding",i))},"compress2")}o(_,"compress"),exports.ZlibCompressionStream=b,exports.ZstdCompressionStream=L,exports.compress=_,exports.default=_;
