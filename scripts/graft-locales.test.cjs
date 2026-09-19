const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const i18n = require('../fruit-machine-ui/i18n.js');
const { message } = require('../fruit-machine-ui/host-errors.js');
const { chromium, launchOptions } = require('./browser-runtime.cjs');
const gameUrl = process.env.GAME_URL || 'http://localhost:4199/';
const manifest = require('../fruit-machine-ui/game.manifest.json');
const languages = ['en','de','es','ru','pt','vi','zh'];
const tokens = value => [...value.matchAll(/\{([A-Za-z]+)\}/g)].map(m=>m[1]).sort();
for (const language of languages) {
  const catalog = JSON.parse(fs.readFileSync(path.join(__dirname,'../fruit-machine-ui/locales/'+language+'.json'),'utf8'));
  assert.deepEqual(Object.keys(catalog).sort(),Object.keys(i18n.messages.en).sort());
  assert.deepEqual(catalog,i18n.messages[language]);
  assert.ok(manifest.locales[language]);
  for (const key of Object.keys(catalog)) {
    assert.ok(catalog[key].trim(),language+'/'+key);
    assert.deepEqual(tokens(catalog[key]),tokens(i18n.messages.en[key]),language+'/'+key+' placeholders');
  }
  for (const number of ['1.52','3.20','7.76','97%']) assert.ok(catalog.rules4.includes(number),language+' math '+number);
  assert.equal(message(new Error('InvalidGameData() return data:0xbcefcde4'),language),catalog.errorContract);
  assert.equal(message(new Error('Failed to fetch'),language),catalog.errorNetwork);
}
for (const [source,target] of [['de-DE','de'],['es_MX','es'],['ru-RU','ru'],['pt-BR','pt'],['vi-VN','vi'],['zh-CN','zh'],['en-GB','en'],['fr-FR',null]]) assert.equal(i18n.normalize(source),target);
console.log('PASS locale catalogs: seven complete dictionaries, placeholders,97% math, manifest and localized errors.');

(async()=>{
  const browser = await chromium.launch(launchOptions);
  const failures=[], errors=[], results=[];
  try {
    const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce',locale:'de-DE'});
    page.on('pageerror',error=>errors.push(error.message));
    await page.addInitScript(()=>{crypto.getRandomValues=array=>{array.fill(0);return array;};});
    await page.goto(gameUrl,{waitUntil:'domcontentloaded'});
    await page.locator('#jamBadgeSlot #chain-jam-badge').waitFor();
    assert.equal(await page.locator('html').getAttribute('lang'),'de','detect browser locale');
    assert.equal(await page.locator('#languageMenu [data-locale]').count(),7);
    for (const code of languages) {
      const catalog=i18n.messages[code];
      for (const [width,height] of [[1366,768],[390,844],[375,667]]) {
        await page.setViewportSize({width,height});
        await page.locator('#languageButton').click();
        const option=page.locator('[data-locale="'+code+'"]');
        await option.click();
        assert.equal(await page.locator('html').getAttribute('lang'),i18n.locales.find(x=>x.code===code).htmlLang);
        assert.equal(await page.locator('#wealthTitle').innerText(),catalog.balance);
        assert.equal(await page.locator('#harvestButton span').innerText(),catalog.harvest);
        assert.deepEqual(await page.locator('[data-rtp-value]').allTextContents(),['97.00%','97.00%']);
        assert.equal(await page.evaluate(()=>localStorage.getItem('graft.locale')),code);
        const layout=await page.evaluate(()=>{
          const rect=e=>e.getBoundingClientRect();
          const clipping=[...document.querySelectorAll('h1,.pay-button,.mode-picker button,#startButton,.layout-button,.language-button,#wealthValue,#prizeValue')]
            .filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.id||e.className);
          return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,footer:rect(document.querySelector('footer')).bottom,start:rect(document.querySelector('#startButton')).bottom,clipping};
        });
        if(layout.scrollWidth>width || layout.clipping.length || layout.footer>height+2) failures.push({code,...layout});
        results.push({code,...layout});
        if(width===375) {
          fs.mkdirSync(path.join(__dirname,'../reference-analysis'),{recursive:true});
          await page.screenshot({path:path.join(__dirname,'../reference-analysis/locale-'+code+'.png'),fullPage:true});
        }
      }
      await page.reload({waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('#wealthTitle').innerText(),catalog.balance,'saved language survives reload');
      await page.locator('#rulesButton').click();
      assert.equal(await page.locator('#dialogTitle').innerText(),catalog.rulesTitle);
      assert.ok((await page.locator('#dialogBody').innerText()).includes(catalog.rules4));
      await page.locator('#closeDialog').click();
    }
    // Changing language must not erase wagers, the completed harvest or its hits.
    await page.locator('.pay-button').first().click();
    await page.locator('#startButton').click();
    await page.locator('#startLabel').filter({hasText:i18n.messages.zh.collect}).waitFor();
    assert.equal(await page.locator('#prizeValue').innerText(),'3.20');
    await page.locator('#languageButton').click();
    await page.locator('[data-locale="ru"]').click();
    assert.equal(await page.locator('#prizeValue').innerText(),'3.20');
    assert.equal(await page.locator('.lane-stake').first().innerText(),'01');
    assert.equal(await page.locator('.lane-hit').first().innerText(),i18n.t('ru','hits',{n:3}));
    assert.ok(await page.locator('.pay-button').first().evaluate(e=>e.classList.contains('winner')));
    await page.locator('#startButton').click();
    assert.equal(await page.locator('#wealthValue').innerText(),'1000002.20');
    // Keyboard-open, navigate, select, and dismiss the seven-option picker.
    await page.locator('#languageButton').focus();
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator('#languageButton').getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Home');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    await page.locator('#languageButton').press('ArrowDown');
    await page.keyboard.press('Escape');
    assert.ok(await page.locator('#languageMenu').isHidden());
    assert.equal(await page.locator('#languageButton').getAttribute('aria-expanded'),'false');
    assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(__dirname,'../reference-analysis/GRAFT_LOCALES_VERIFICATION.json'),JSON.stringify({testedAt:new Date().toISOString(),gameUrl,results,failures,errors},null,2));
    assert.deepEqual(failures,[],'all supported languages fit desktop and phone layouts');
    console.log('PASS seven-language switching, persistence, dialogs, state preservation, keyboard picker and 21 desktop/mobile layouts.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});

