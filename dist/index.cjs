"use strict";var N=Object.defineProperty;var a=(n,e)=>N(n,"name",{value:e,configurable:!0});Object.defineProperty(exports,"__esModule",{value:!0});var l=require("node:zlib"),R=require("@mongodb-js/zstd"),O=require("hono/utils/compress");class p{static{a(this,"NodeCompressionStream")}readable;writable;constructor(e,i){let r;switch(e){case"br":{r=l.createBrotliCompress(i);break}case"gzip":{r=l.createGzip(i);break}case"deflate":{r=l.createDeflate(i);break}default:r=l.createDeflateRaw(i)}this.readable=new ReadableStream({start(s){r.on("data",c=>s.enqueue(c)),r.once("end",()=>s.close())}}),this.writable=new WritableStream({write:a(s=>r.write(s),"write"),close:a(()=>r.end(),"close")})}}const T="Cloudflare-Workers",_=["gzip","deflate"],E=["zstd","br","gzip","deflate"],S=/(?:^|,)\s*?no-transform\s*?(?:,|$)/i,y=!!process.versions.bun,A=globalThis.navigator?.userAgent===T,D=!!globalThis.Deno;function z(n){const e=n.headers.get("Content-Type");return e&&O.COMPRESSIBLE_CONTENT_TYPE_REGEX.test(e)}a(z,"shouldCompress");function L(n){const e=n.headers.get("Cache-Control");return!e||!S.test(e)}a(L,"shouldTransform");async function q(n,e){const[i,r]=n.tee();let s=0;for await(const c of i)if(s+=c.length,s>=e)break;return{stream:r,length:s}}a(q,"readContentLength");const g=a(({encoding:n,encodings:e=[...E],options:i={},threshold:r=1024,zstdLevel:s=3}={})=>{n&&(e=[n]);const c=e.find(C=>!E.includes(C));if(c)throw new Error(`Invalid compression encoding: ${c}`);return a(async function(t,b){await b();let u=t.res.body;if(!u||t.req.method==="HEAD"||t.res.headers.has("Content-Encoding")||D||A||!z(t.res)||!L(t.res))return;const m=t.req.header("Accept-Encoding");if(!m)return;const d=e.find(o=>m.includes(o));if(!d)return;let f=Number(t.res.headers.get("Content-Length"));if(!f){const{stream:o,length:w}=await q(u,r);u=o,f=w}if(f<r)return;let h;if(d==="zstd"){const o=Buffer.from(await t.req.arrayBuffer());h=await R.compress(o,s)}else{let o;!y&&_.includes(d)?o=new CompressionStream(d):o=new p(d,i),h=u.pipeThrough(o)}t.res=new Response(h,t.res),t.res.headers.delete("Content-Length"),t.res.headers.set("Content-Encoding",d)},"compress2")},"compress");exports.NodeCompressionStream=p,exports.compress=g,exports.default=g;