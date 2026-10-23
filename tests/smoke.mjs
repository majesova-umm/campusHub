import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({channel:'chrome'});
try {
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const width of [1440,1024,768,390,320]) {
    await page.setViewportSize({width,height:width===1440?1024:844});
    await page.goto('http://127.0.0.1:5173');await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow at ${width}`);
    const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));assert.deepEqual(broken,[]);
    if([1440,390].includes(width)) await page.screenshot({path:`/tmp/campus-${width}.png`,fullPage:true});
  }
  await page.setViewportSize({width:1440,height:1024});
  await page.locator('#new-task').fill('   ');await page.getByRole('button',{name:'Agregar tarea'}).click();
  assert.equal(await page.locator('.task-card').count(),4);
  await page.locator('#new-task').fill('Preparar exposición');await page.getByRole('button',{name:'Agregar tarea'}).click();
  assert.equal(await page.locator('.task-card').count(),5);assert.equal(await page.locator('.stat-value').first().textContent(),'4');
  await page.locator('#new-task').fill('Revisar apuntes');await page.locator('#new-task').press('Enter');
  assert.equal(await page.locator('.task-card').count(),6);
  await page.reload();assert.equal(await page.locator('.task-card').count(),6);
  await page.getByRole('textbox',{name:'Buscar tareas o materias'}).fill('exposición');assert.equal(await page.locator('.task-card').count(),1);
  assert.deepEqual(errors,[]);console.log('PASS: responsive widths, assets, empty input, button, Enter, counters, persistence, search, runtime errors.');
} finally {await browser.close();}
