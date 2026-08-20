import { mkdir, writeFile } from "node:fs/promises";

const repository = "sakots/appneo";
const branch = "main";
const outputDirectory = "dist";
const latestCommitApi = `https://api.github.com/repos/${repository}/commits/${branch}`;
const publishedScriptBase = `https://cdn.jsdelivr.net/gh/${repository}`;

const loader = `javascript:(async()=>{const id='appneo-loader';if(document.getElementById(id))return;let v='${branch}';try{const r=await fetch('${latestCommitApi}',{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});if(r.ok){const j=await r.json();if(/^[0-9a-f]{40}$/.test(j.sha))v=j.sha}}catch{}const s=document.createElement('script');s.id=id;s.charset='UTF-8';s.src='${publishedScriptBase}@'+v+'/dist/appneo.js'+(v==='${branch}'?'?t='+Date.now():'');s.onerror=()=>{s.remove();alert('appneoの読み込みに失敗しました。')};(document.head||document.documentElement).appendChild(s)})()`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(`${outputDirectory}/bookmarklet-loader.txt`, `${loader}\n`);
