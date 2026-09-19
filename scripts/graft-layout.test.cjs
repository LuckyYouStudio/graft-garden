const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium, launchOptions } = require('./browser-runtime.cjs');

const gameUrl = process.env.GAME_URL || 'http://localhost:4199/';
const outputDir = path.resolve(__dirname, '../reference-analysis');
const viewports = [
  [1920, 945], [1440, 900], [1366, 768], [1024, 768], [768, 1024],
  [430, 932], [390, 844], [375, 667], [320, 568], [844, 390],
];
const keySelectors = [
  'h1', '#rtpValue', '#wealthValue', '#prizeValue', '#gardenBoard',
  '#windSummary', '#roundStatus', '#harvestButton', '#bloomButton',
  '#layoutButton', '#betHint', '#clearBetsButton', '#payButtons',
  '#pathDetail', '#totalStake', '#startButton', '#connectionLabel',
  '#previewButton', '#verifyButton', '.history', '.footnote',
];
const screenshotCases = new Set(['1920x945-zh', '1366x768-en', '390x844-zh', '390x844-en', '375x667-en', '320x568-en', '844x390-en']);

async function setLocale(surface, locale) {
  await surface.locator('#languageButton').click();
  await surface.locator(`[data-locale="${locale}"]`).click();
  await surface.locator('h1').filter({ hasText: locale === 'en' ? 'Graft Garden' : '嫁接果园' }).waitFor();
}

async function measure(surface) {
  return surface.evaluate((selectors) => {
    const rectangle = element => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom };
    };
    const items = selectors.map(selector => {
      const element = document.querySelector(selector);
      if (!element) return { selector, missing: true };
      const box = rectangle(element);
      const style = getComputedStyle(element);
      return { selector, ...box, visible: box.width > 0 && box.height > 0 && style.visibility !== 'hidden', text: element.textContent.trim() };
    });
    const targets = [...document.querySelectorAll('.pay-button,#startButton,#harvestButton,#bloomButton,#layoutButton,#clearBetsButton,#soundButton,#rulesButton,#languageButton,#previewButton,#verifyButton')]
      .map(element => ({ name: element.id || `path-${element.dataset.lane}`, core: element.matches('.pay-button,#startButton'), ...rectangle(element) }));
    const clippedText = [...document.querySelectorAll('h1,.pay-button,.mode-picker button,#startButton,#wealthValue,#prizeValue,#totalStake,.language-button')]
      .filter(element => element.scrollWidth > element.clientWidth + 2)
      .map(element => ({ name: element.id || element.className, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }));
    return {
      viewport: { width: innerWidth, height: innerHeight },
      document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      items, targets, clippedText,
    };
  }, keySelectors);
}

function evaluateLayout(result, label, failures, visibleHeight = result.viewport.height) {
  const { width, height } = result.viewport;
  const compactException = width <= 320 || height < 500;
  const topFold = compactException ? ['h1', '#rtpValue', '#wealthValue', '#prizeValue'] : keySelectors;
  const check = (condition, message) => { if (!condition) failures.push(`${label}: ${message}`); };
  check(result.document.width <= width + 1, `horizontal overflow ${result.document.width - width}px`);
  check(result.clippedText.length === 0, `clipped control text ${JSON.stringify(result.clippedText)}`);
  for (const item of result.items) {
    check(!item.missing && item.visible, `${item.selector} is missing or hidden`);
    if (item.missing) continue;
    check(item.x >= -1 && item.right <= width + 1, `${item.selector} exceeds horizontal bounds`);
    if (topFold.includes(item.selector)) check(item.y >= -1 && item.bottom <= visibleHeight + 2, `${item.selector} below visible area: bottom=${Math.ceil(item.bottom)}, available=${visibleHeight}`);
  }
  for (const target of result.targets) {
    const minimum = target.core ? 44 : 32;
    check(target.width >= minimum - 1 && target.height >= minimum - 1, `${target.name} target ${target.width.toFixed(1)}×${target.height.toFixed(1)} is smaller than ${minimum}px`);
  }
  for (let first = 0; first < result.targets.length; first++) {
    for (const second of result.targets.slice(first + 1)) {
      const target = result.targets[first];
      const overlapX = Math.min(target.right, second.right) - Math.max(target.x, second.x);
      const overlapY = Math.min(target.bottom, second.bottom) - Math.max(target.y, second.y);
      check(overlapX <= 1 || overlapY <= 1, `${target.name} and ${second.name} overlap`);
    }
  }
  // On an unusually small screen a short vertical document is preferable to
  // shrinking touch controls, but every item must still be reachable.
  const maxVerticalScroll = compactException ? (height < 500 ? 300 : 180) : 2;
  check(result.document.height <= height + maxVerticalScroll, `document needs ${result.document.height - height}px vertical scrolling (allowed ${maxVerticalScroll}px)`);
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch(launchOptions);
  const results = [], failures = [], pageErrors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 945 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.goto(gameUrl, { waitUntil: 'domcontentloaded' });
    await page.locator('.pay-button').nth(7).waitFor();
    assert.equal(await page.locator('.garden-node').count(), 24, 'all season nodes render');
    assert.equal(await page.locator('#rtpValue').innerText(), '97.00%', 'declared RTP remains visible');
    assert.equal(await page.locator('#startButton').isDisabled(), true, 'initial zero bets still disable start');

    for (const locale of ['zh', 'en']) {
      for (const [width, height] of viewports) {
        const label = `${width}x${height}-${locale}`;
        await page.setViewportSize({ width, height });
        await page.evaluate(() => scrollTo(0, 0));
        await setLocale(page, locale);
        await page.evaluate(() => scrollTo(0, 0));
        await page.waitForTimeout(90);
        const result = await measure(page);
        evaluateLayout(result, label, failures);
        // A real tap verifies that the compact grid still exposes every path.
        await page.locator('.pay-button').nth(7).click();
        assert.equal(await page.locator('.pay-button').nth(7).locator('.lane-stake').innerText(), '01');
        await page.locator('#clearBetsButton').click();
        assert.equal(await page.locator('.pay-button').nth(7).locator('.lane-stake').innerText(), '00');
        await page.evaluate(() => scrollTo(0, 0));
        results.push({ label, ...result });
        if (screenshotCases.has(label)) {
          await page.locator('#toast.show').waitFor({ state: 'hidden' });
          await page.screenshot({ path: path.join(outputDir, `graft-layout-${label}.png`), fullPage: true });
        }
        console.log(`${label}: ${result.document.width}×${result.document.height} document, start bottom ${Math.ceil(result.items.find(item => item.selector === '#startButton').bottom)}`);
      }
    }

    // Populate the result using actual standalone gameplay, then stress the
    // history row with eight maximum-size demo payouts. This fixture checks
    // wrapping only; it does not alter game math or any hosted session.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => { crypto.getRandomValues = array => { array.fill(0); return array; }; });
    await page.locator('.pay-button').first().click();
    await page.locator('#startButton').click();
    await page.locator('#startLabel').filter({ hasText: 'Collect harvest' }).waitFor();
    assert.equal(await page.locator('#prizeValue').innerText(), '3.20');
    await page.evaluate(() => {
      document.querySelector('#historyStrip').innerHTML = '<i class="win">310368.96</i>'.repeat(8);
    });
    for (const [width, height] of [[1366, 768], [390, 844], [375, 667]]) {
      const label = `history-stress-${width}x${height}`;
      await page.setViewportSize({ width, height });
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(90);
      const result = await measure(page);
      evaluateLayout(result, label, failures);
      results.push({ label, ...result });
      await page.screenshot({ path: path.join(outputDir, `graft-layout-${label}.png`), fullPage: true });
      console.log(`${label}: ${result.document.width}×${result.document.height} document`);
    }

    if (process.env.CHECK_SIMULATOR === '1') {
      const deployed = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../casino-sdk/casino-sdk/simulator/local-node/deployed.json'), 'utf8'));
      const address = deployed.games.find(game => game.name === 'GraftGardenGame').address;
      const simulatorUrl = process.env.SIMULATOR_URL || `http://localhost:3300/?game=${encodeURIComponent(gameUrl)}&gameAddress=${address}`;
      const host = await browser.newPage({ viewport: { width: 1920, height: 945 }, reducedMotion: 'reduce' });
      host.on('pageerror', error => pageErrors.push(error.message));
      await host.goto(simulatorUrl, { waitUntil: 'domcontentloaded' });
      const frameLocator = host.frameLocator('iframe');
      await frameLocator.locator('#connectionLabel').filter({ hasText: 'Casino SDK' }).waitFor({ timeout: 30000 });
      const gameFrame = host.frames().find(frame => frame.url().startsWith(gameUrl));
      assert.ok(gameFrame, 'SDK game iframe exists');
      for (const [width, height] of [[1920, 945], [1366, 768], [390, 844], [375, 667]]) {
        const label = `simulator-${width}x${height}`;
        await host.setViewportSize({ width, height });
        await setLocale(frameLocator, width >= 1000 ? 'zh' : 'en');
        await host.waitForTimeout(300);
        const frameBox = await host.locator('iframe').boundingBox();
        const result = await measure(gameFrame);
        evaluateLayout(result, label, failures, Math.min(result.viewport.height, height - frameBox.y));
        results.push({ label, frameBox, ...result });
        await host.screenshot({ path: path.join(outputDir, `graft-layout-${label}.png`), fullPage: true });
        console.log(`${label}: iframe ${result.viewport.width}×${result.viewport.height}, offset top ${Math.round(frameBox.y)}`);
      }
    }

    assert.deepEqual(pageErrors, [], 'no browser runtime errors');
    fs.writeFileSync(path.join(outputDir, 'GRAFT_LAYOUT_VERIFICATION.json'), JSON.stringify({ testedAt: new Date().toISOString(), gameUrl, results, failures, pageErrors }, null, 2));
    assert.deepEqual(failures, [], 'responsive layout checks');
    console.log(`PASS ${results.length} layout cases: zh/en, viewport bounds, legible text, tap targets, all eight paths, clear controls${process.env.CHECK_SIMULATOR === '1' ? ', SDK iframe sizing (no chain wagers)' : ''}.`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

