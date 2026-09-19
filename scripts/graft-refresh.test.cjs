// Regression coverage for a FULL simulator page refresh, including the next wager.
// Requires the local node, simulator (:3300), and game server (:4199) to be running.
// GAME_URL may point at the deployed game to repeat the same checks against Vercel.
// Uses isolated browser storage and the simulator's funded development wallet only.
const { chromium, launchOptions } = require('./browser-runtime.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const sdkRequire = createRequire(path.resolve('casino-sdk/casino-sdk/simulator/package.json'));
const { createPublicClient, createWalletClient, http, defineChain, bytesToHex, parseAbi } = sdkRequire('viem');
const { mnemonicToAccount } = sdkRequire('viem/accounts');

const gameUrl = process.env.GAME_URL || 'http://localhost:4199/';
const simulatorUrl = process.env.SIMULATOR_URL || 'http://localhost:3300/';
const simulatorOrigin = new URL(simulatorUrl).origin;
const gameOrigin = new URL(gameUrl).origin;
const deployed = JSON.parse(fs.readFileSync('casino-sdk/casino-sdk/simulator/local-node/deployed.json', 'utf8'));
const graft = deployed.games.find(game => game.name === 'GraftGardenGame');
const legacy = deployed.games.find(game => game.name === 'FruitTigerGame');
assert.ok(graft && legacy, 'Both GraftGardenGame and legacy FruitTigerGame are needed for the regression.');
const key = 'casino-sdk-simulator.config';
const results = [];
// Use a different funded Hardhat account from the user's active simulator.
const testAccount = mnemonicToAccount('test test test test test test test test test test test junk', { addressIndex: 2 });
const testPrivateKey = bytesToHex(testAccount.getHdKey().privateKey);

async function fundLocalTestAccount() {
  const rpcUrl = deployed.rpcUrl || 'http://127.0.0.1:8545';
  assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(rpcUrl).hostname), 'Test funding only runs on a loopback node');
  const publicClient = createPublicClient({ transport: http(rpcUrl) });
  assert.equal(await publicClient.getChainId(), 31337, 'Test funding only runs on local Hardhat chain 31337');
  const abi = parseAbi(['function balanceOf(address) view returns (uint256)', 'function mint(address,uint256)']);
  const balance = await publicClient.readContract({ address: deployed.token, abi, functionName: 'balanceOf', args: [testAccount.address] });
  if (balance >= 10000n * 10n ** 18n) return;
  const chain = defineChain({ id: 31337, name: 'Local regression chain', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpcUrls: { default: { http: [rpcUrl] } } });
  const wallet = createWalletClient({ account: testAccount, chain, transport: http(rpcUrl) });
  const hash = await wallet.writeContract({ address: deployed.token, abi, functionName: 'mint', args: [testAccount.address, 1000000n * 10n ** 18n] });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  assert.equal(receipt.status, 'success', 'Mint local test tokens for isolated regression account');
}

function url(address) {
  const result = new URL(simulatorUrl);
  result.searchParams.set('game', gameUrl);
  if (address) result.searchParams.set('gameAddress', address);
  return result.href;
}

async function createPage(browser, seed = {}, motion = 'reduce') {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: motion });
  await context.addInitScript(({ origin, storageKey, seed }) => {
    if (location.origin !== origin || localStorage.getItem('graft-refresh-test-seeded')) return;
    localStorage.setItem(storageKey, JSON.stringify(seed));
    localStorage.setItem('graft-refresh-test-seeded', 'yes');
  }, { origin: simulatorOrigin, storageKey: key, seed: { ...seed, playerPrivateKey: testPrivateKey } });
  await context.addInitScript(({ gameOrigin }) => {
    if (location.origin !== gameOrigin) return;
    window.__graftRecoveryGaps = [];
    const check = () => {
      const connected = document.querySelector('#connectionLabel')?.textContent.includes('Casino SDK');
      const unlocked = document.querySelector('#layoutButton')?.disabled === false;
      const pending = Object.keys(sessionStorage).some(key => key.startsWith('graft.pending:') && sessionStorage.getItem(key) !== 'null');
      if (connected && unlocked && pending) window.__graftRecoveryGaps.push(document.querySelector('#roundStatus')?.textContent);
    };
    document.addEventListener('DOMContentLoaded', () => {
      new MutationObserver(check).observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
      check();
    });
  }, { gameOrigin });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  return { context, page, frame: page.frameLocator('iframe'), errors };
}

async function connected(frame) {
  await frame.locator('#connectionLabel').filter({ hasText: 'Casino SDK' }).waitFor({ timeout: 30000 });
}

async function settled(frame) {
  await frame.locator('#roundStatus').filter({ hasText: /条下注路径命中|未达到收成条件|wagered paths paid|No wagered path reached/ }).waitFor({ timeout: 60000 });
  // Status is presented before revealOutcome acknowledgement. Wait until controls unlock.
  await frame.locator('#layoutButton:not([disabled])').waitFor({ timeout: 15000 });
}

async function verification(frame) {
  await frame.locator('#verifyButton').click();
  await frame.locator('#dialogBody pre').waitFor();
  const result = JSON.parse(await frame.locator('#dialogBody pre').innerText());
  await frame.locator('#closeDialog').click();
  assert.equal(result.source, 'contract');
  assert.equal(result.theoreticalRtp, '97%');
  assert.ok(result.sessionId && result.sessionKey);
  return result;
}

function gameFrame(page) {
  const result = page.frames().find(frame => frame !== page.mainFrame() && frame.url().startsWith(gameOrigin));
  assert.ok(result, 'Game iframe is present');
  return result;
}

async function pendingRecord(page) {
  const frame = gameFrame(page);
  try {
    await frame.waitForFunction(() => Object.keys(sessionStorage).some(key => key.startsWith('graft.pending:') && sessionStorage.getItem(key) !== 'null'), null, { timeout: 15000 });
  } catch (error) {
    const diagnostic = await frame.evaluate(() => ({ status: document.querySelector('#roundStatus')?.textContent, connection: document.querySelector('#connectionLabel')?.textContent, start: document.querySelector('#startLabel')?.textContent, pending: Object.keys(sessionStorage).filter(key => key.startsWith('graft.pending:')) }));
    throw new Error(error.message + '\nGame state: ' + JSON.stringify(diagnostic));
  }
  return frame.evaluate(() => {
    const key = Object.keys(sessionStorage).find(key => key.startsWith('graft.pending:') && sessionStorage.getItem(key) !== 'null');
    return JSON.parse(sessionStorage.getItem(key));
  });
}

async function nextWager(frame, previous) {
  // Hosted winnings require Continue once, but zero-payout rounds do not.
  if (/^(继续|Continue)$/.test(await frame.locator('#startLabel').innerText())) await frame.locator('#startButton').click();
  if (await frame.locator('#clearBetsButton').isEnabled()) await frame.locator('#clearBetsButton').click();
  await frame.locator('.pay-button').first().click();
  await frame.locator('#startButton').click();
  await settled(frame);
  const next = await verification(frame);
  assert.notEqual(next.sessionId, previous.sessionId, 'Next wager must create and settle a NEW session');
  assert.notEqual(next.sessionKey, previous.sessionKey);
  assert.equal(next.stakes[0], '1000000000000000000');
  return next;
}

async function scenario(name, run) {
  try {
    const detail = await run();
    results.push({ name, passed: true, ...detail });
    console.log('PASS ' + name + ' ' + JSON.stringify(detail));
  } catch (error) {
    results.push({ name, passed: false, error: error.message });
    console.error('FAIL ' + name + ': ' + error.message);
  }
}

(async () => {
  await fundLocalTestAccount();
  const browser = await chromium.launch(launchOptions);
  try {
    for (const refreshAt of ['pending', 'animation']) {
      await scenario('full parent reload during ' + refreshAt + ', then next wager', async () => {
        const env = await createPage(browser, { gameAddress: graft.address, gameName: graft.name, indexerLagMs: 3000, flashblockLagMs: 100 }, refreshAt === 'animation' ? 'no-preference' : 'reduce');
        try {
          await env.page.goto(url(graft.address), { waitUntil: 'domcontentloaded' });
          await connected(env.frame);
          await env.frame.locator('.pay-button').first().click();
          await env.frame.locator('#startButton').click();
          const pending = await pendingRecord(env.page);
          if (refreshAt === 'animation') {
            // A text locator can miss the 250ms first-wind caption. The first
            // revealed window is stable through the rest of the animation.
            await gameFrame(env.page).waitForFunction(() => document.querySelector('#windSummary')?.children[0]?.classList.contains('revealed') && document.querySelector('#layoutButton')?.disabled, null, { timeout: 45000 });
          }
          await env.page.reload({ waitUntil: 'domcontentloaded' });
          await connected(env.frame);
          await settled(env.frame);
          const recovered = await verification(env.frame);
          assert.equal(recovered.sessionKey, pending.key, 'Refresh must recover exactly the interrupted wager');
          assert.deepEqual(recovered.stakes, pending.stakes);
          assert.deepEqual(await gameFrame(env.page).evaluate(() => window.__graftRecoveryGaps), [], 'Saved pending round must lock controls while host history reloads');
          const next = await nextWager(env.frame, recovered);
          assert.deepEqual(env.errors, []);
          return { recoveredSession: recovered.sessionId, nextSession: next.sessionId };
        } finally { await env.context.close(); }
      });
    }

    await scenario('stale FruitTiger storage + Graft manifest selects Graft on load and refresh', async () => {
      const env = await createPage(browser, { gameAddress: legacy.address, gameName: legacy.name });
      try {
        await env.page.goto(url(), { waitUntil: 'domcontentloaded' });
        await connected(env.frame);
        assert.equal((await env.page.getByLabel('Game contract').first().inputValue()).toLowerCase(), graft.address.toLowerCase());
        await env.page.reload({ waitUntil: 'domcontentloaded' });
        await connected(env.frame);
        assert.equal((await env.page.getByLabel('Game contract').first().inputValue()).toLowerCase(), graft.address.toLowerCase());
        await env.frame.locator('.pay-button').first().click();
        await env.frame.locator('#startButton').click();
        await settled(env.frame);
        const round = await verification(env.frame);
        assert.deepEqual(env.errors, []);
        return { session: round.sessionId, selectedGame: graft.name };
      } finally { await env.context.close(); }
    });

    await scenario('unapplied contract selector draft is discarded on full reload', async () => {
      const env = await createPage(browser, { gameAddress: graft.address, gameName: graft.name });
      try {
        await env.page.goto(url(), { waitUntil: 'domcontentloaded' });
        await connected(env.frame);
        await env.page.getByLabel('Game contract').first().selectOption(legacy.address);
        assert.equal((await env.page.getByLabel('Game contract').first().inputValue()).toLowerCase(), legacy.address.toLowerCase());
        // Deliberately do not press Restart harness.
        await env.page.reload({ waitUntil: 'domcontentloaded' });
        await connected(env.frame);
        assert.equal((await env.page.getByLabel('Game contract').first().inputValue()).toLowerCase(), graft.address.toLowerCase());
        await env.frame.locator('.pay-button').first().click();
        await env.frame.locator('#startButton').click();
        await settled(env.frame);
        const round = await verification(env.frame);
        assert.deepEqual(env.errors, []);
        return { session: round.sessionId, selectedGame: graft.name };
      } finally { await env.context.close(); }
    });

    await scenario('explicit wrong contract cannot enable a wager', async () => {
      const env = await createPage(browser, { gameAddress: graft.address, gameName: graft.name });
      try {
        await env.page.goto(url(legacy.address), { waitUntil: 'domcontentloaded' });
        // Either the simulator rejects this configuration, or the game must show a guarded state.
        await env.page.waitForFunction(() => {
          const frame = document.querySelector('iframe');
          return frame || /does not match|mismatch|wrong|不匹配/i.test(document.body.innerText);
        }, null, { timeout: 30000 });
        if (await env.page.locator('iframe').count()) {
          await env.frame.locator('#connectionLabel').waitFor();
          await env.frame.locator('#connectionLabel').filter({ hasNotText: /正在连接|Connecting/ }).waitFor({ timeout: 30000 });
          await env.frame.locator('.pay-button').first().click();
          assert.equal(await env.frame.locator('#startButton').isDisabled(), true, 'A manifest alone must not authorize sending Graft data to FruitTiger');
          assert.match(await env.frame.locator('#connectionLabel').innerText(), /GraftGardenGame|不匹配|mismatch|wrong/i);
        } else {
          assert.match(await env.page.locator('body').innerText(), /does not match|mismatch|wrong|不匹配/i);
        }
        assert.deepEqual(env.errors, []);
        return { blocked: true, transactionSubmitted: false };
      } finally { await env.context.close(); }
    });
  } finally { await browser.close(); }
  console.log(JSON.stringify({ gameUrl, testedAt: new Date().toISOString(), results }, null, 2));
  assert.equal(results.filter(result => !result.passed).length, 0, 'Full simulator refresh regressions must all pass');
})().catch(error => { console.error(error); process.exitCode = 1; });
