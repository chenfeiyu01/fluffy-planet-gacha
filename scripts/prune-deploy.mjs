import { readdirSync, readFileSync, existsSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
function files(root){return readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(root,e.name)):[path.join(root,e.name)]);}
const code=[...files('src'), 'index.html'].map(p=>readFileSync(p,'utf8')).join('\n');
const keep=new Set([...code.matchAll(/\/(?:art|media|models|fonts)\/[a-zA-Z0-9_./-]+\.(?:png|jpg|jpeg|webp|mp4|glb|ttf|woff2?)/g)].map(m=>m[0].slice(1)));
keep.add('art/final/sr-frame.webp');keep.add('art/final/ssr-frame.webp');
let removed=0;
for(const file of files('public')){
 const relative=path.relative('public',file);
 if(relative==='fonts/OFL.txt' || keep.has(relative))continue;
 const target=path.join('dist',relative);
 if(existsSync(target)){removed+=statSync(target).size;rmSync(target);}
}
console.log(`Omitted ${(removed/1024/1024).toFixed(1)} MiB of unused proposal assets from deployment output.`);
