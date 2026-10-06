const {JSDOM}=require('jsdom');
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
function boot(seed={}){const dom=new JSDOM(html,{url:'https://tono.test',runScripts:'dangerously',beforeParse(w){w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;for(const[k,v]of Object.entries(seed))w.localStorage.setItem(k,v)}});return dom}
let dom=boot(),w=dom.window,d=w.document;
const click=(s)=>d.querySelector(s).click();const input=(s,v)=>{const e=d.querySelector(s);e.value=v;e.dispatchEvent(new w.Event('input'))};
input('.setrow input','12');click('#content button');assert.equal(d.querySelector('#pct').textContent,'20%');assert.equal(d.querySelector('.setrow input').value,'12');
for(let i=0;i<4;i++){click(`#mainTabs button:nth-child(${i+1})`);assert.equal([...d.querySelectorAll('section')].filter(x=>!x.hidden).length,1)}
click('#tabs button:nth-child(2)');click('#tabs button:first-child');assert.equal(d.querySelector('.setrow input').value,'12');
w.addMeasure();assert.match(d.querySelector('#status').textContent,/Ingresa/);input('#bodyWeight','83.5');w.addMeasure();assert.match(d.querySelector('#measureHistory').textContent,/83.5/);
input('#prPush','15');click('#foodChecks input');w.startTimer();w.eval('deadline=Date.now()-1000;tick()');assert.equal(d.querySelector('#clock').textContent,'00:00');w.resetTimer();w.startTimer();w.pauseTimer();assert.equal(d.querySelector('#pauseTimer').textContent,'Continuar');
const seed=Object.fromEntries(Object.keys(w.localStorage).map(k=>[k,w.localStorage.getItem(k)]));dom.window.close();dom=boot(seed);w=dom.window;d=w.document;assert.equal(d.querySelector('.setrow input').value,'12');assert.equal(d.querySelector('#pct').textContent,'20%');assert.equal(d.querySelector('#prPush').value,'15');assert(d.querySelector('#foodChecks input').checked);
w.eval("localDate=()=> '2099-01-02';refreshDate()");assert.equal(d.querySelector('#pct').textContent,'0%');assert(!d.querySelector('#foodChecks input').checked);
w.eval("localDate=()=> '"+d.querySelector('#measureDate').value+"'");
w.localStorage.setItem('tono-v2-measures','broken');w.showMeasures();assert.match(d.querySelector('#measureHistory').textContent,/Sin mediciones/);
w.Storage.prototype.setItem=()=>{throw Error('blocked')};w.toggleDone(0);assert.match(d.querySelector('#status').textContent,/No se pudo guardar/);dom.window.close();
const migrated=boot({'tono-v2-Lunes · Fuerza A0':'1','tono-v2-prs':'{"a":"20"}'});assert.equal(migrated.window.document.querySelector('#pct').textContent,'20%');assert.equal(migrated.window.document.querySelector('#prPush').value,'20');migrated.window.close();
console.log('PASS: navigation, set persistence, progress, measurements, PRs, nutrition, timer, date rollover, migration, corrupt/blocked storage');
