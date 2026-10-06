const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('http://tono.test/**',route=>route.fulfill({contentType:'text/html',body:fs.readFileSync('index.html','utf8')}));
 await page.goto('http://tono.test');
 const input=page.locator('.setrow input').first();await input.fill('12');
 await page.getByRole('button',{name:'Completar',exact:true}).first().click();assert.equal(await page.locator('#pct').textContent(),'20%');assert.equal(await input.inputValue(),'12');
 for(const name of ['📊 Progreso','🍽️ Nutrición','🏆 Récords','🏋️ Entrenamiento']){await page.getByRole('button',{name,exact:true}).click()}
 await page.getByRole('button',{name:'Martes · Correr/Caminar',exact:true}).click();await page.getByRole('button',{name:'Lunes · Fuerza A',exact:true}).click();assert.equal(await input.inputValue(),'12');
 await page.reload();assert.equal(await input.inputValue(),'12');assert.equal(await page.locator('#pct').textContent(),'20%');
 await page.getByRole('button',{name:'📊 Progreso'}).click();await page.getByRole('button',{name:'Guardar medición'}).click();assert.match(await page.locator('#status').textContent(),/Ingresa/);
 await page.locator('#bodyWeight').fill('83.5');await page.getByRole('button',{name:'Guardar medición'}).click();assert.match(await page.locator('#measureHistory').textContent(),/83.5/);
 await page.getByRole('button',{name:'🍽️ Nutrición'}).click();await page.locator('#foodChecks input').first().check();await page.reload();await page.getByRole('button',{name:'🍽️ Nutrición'}).click();assert(await page.locator('#foodChecks input').first().isChecked());
 await page.getByRole('button',{name:'🏆 Récords'}).click();await page.locator('#prPush').fill('15');await page.reload();assert.equal(await page.locator('#prPush').inputValue(),'15');
 await page.getByRole('button',{name:'Iniciar 2 min'}).click();await page.waitForTimeout(1100);await page.getByRole('button',{name:'Pausar',exact:true}).click();const paused=await page.locator('#clock').textContent();await page.waitForTimeout(1100);assert.equal(await page.locator('#clock').textContent(),paused);await page.getByRole('button',{name:'Continuar',exact:true}).click();await page.reload();assert.notEqual(await page.locator('#clock').textContent(),'02:00');
 await page.evaluate(()=>{deadline=Date.now()-1000;tick()});assert.equal(await page.locator('#clock').textContent(),'00:00');
 await page.evaluate(()=>{today='2000-01-01';refreshDate()});assert.equal(await page.locator('#pct').textContent(),'20%');
 for(const width of [320,390,768]){await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`)}
 await page.evaluate(()=>localStorage.setItem('tono-v2-measures','broken'));await page.reload();assert.equal(await page.locator('#content .card').count(),5);
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new Error('blocked')}});await page.getByRole('button',{name:'Completar',exact:true}).first().click();assert.match(await page.locator('#status').textContent(),/No se pudo guardar/);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: navigation, persistence, measurements, nutrition, records, timer, responsive layout, corrupt/blocked storage');
})().catch(e=>{console.error(e);process.exit(1)});
