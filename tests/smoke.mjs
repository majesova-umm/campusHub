import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({channel:'chrome'});
try {
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.request.get(baseUrl);
  assert.equal(response.status(), 200);
  assert.match(await response.text(), /¡Hola, Ana!/);
  for(const width of [1440,1024,768,390,320]) {
    await page.setViewportSize({width,height:width===1440?1024:844});
    await page.goto(baseUrl);await page.locator('[data-tasks-ready="true"]').waitFor();await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow at ${width}`);
    const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));assert.deepEqual(broken,[]);
    if([1440,390].includes(width)) await page.screenshot({path:join(tmpdir(), `campus-${width}.png`),fullPage:true});
  }
  await page.setViewportSize({width:1440,height:1024});
  await page.locator('#new-task').fill('   ');await page.getByRole('button',{name:'Agregar tarea'}).click();
  assert.equal(await page.locator('.task-card').count(),4);
  await page.locator('#new-task').fill('Preparar exposición');await page.getByRole('button',{name:'Agregar tarea'}).click();
  assert.equal(await page.locator('.task-card').count(),5);assert.equal(await page.locator('.stat-value').first().textContent(),'4');
  await page.locator('#new-task').fill('Revisar apuntes');await page.locator('#new-task').press('Enter');
  assert.equal(await page.locator('.task-card').count(),6);
  await page.reload();await page.locator('[data-tasks-ready="true"]').waitFor();assert.equal(await page.locator('.task-card').count(),6);
  await page.getByRole('textbox',{name:'Buscar tareas o materias'}).fill('exposición');assert.equal(await page.locator('.task-card').count(),1);
  await page.getByRole('textbox',{name:'Buscar tareas o materias'}).fill('sin coincidencias');assert.equal(await page.locator('.task-card').count(),0);
  await page.evaluate(()=>localStorage.setItem('campus-hub-tasks-v1','[null]'));await page.reload();await page.locator('[data-tasks-ready="true"]').waitFor();assert.equal(await page.locator('.task-card').count(),4);
  await page.evaluate(()=>localStorage.setItem('campus-hub-tasks-v1','[]'));await page.reload();await page.locator('[data-tasks-ready="true"]').waitFor();assert.equal(await page.locator('.task-card').count(),0);assert.equal(await page.locator('.stat-value').first().textContent(),'0');
  await page.evaluate(()=>localStorage.setItem('campus-hub-tasks-v1',JSON.stringify([{id:'saved',title:'Tarea anterior a la migración',status:'pending'}])));
  await page.reload();await page.locator('[data-tasks-ready="true"]').waitFor();assert.equal(await page.locator('.task-card').count(),1);assert.match(await page.locator('.task-card').textContent(),/Tarea anterior/);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('campus-hub-tasks-v1'))[0].id),'saved');
  assert.deepEqual(errors,[]);console.log('PASS: responsive widths, assets, empty input, button, Enter, counters, persistence, search, runtime errors.');
} finally {await browser.close();}
