import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DEFAULT_CONFIG,
  loadConfig,
  manifestMismatch,
  resolveLocalConfig,
  saveAppliedUrl,
  saveConfig,
  type LocalDeployedContracts,
} from './config';

const coin = '0x0000000000000000000000000000000000000001';
const fruit = '0x0000000000000000000000000000000000000002';
const graft = '0x0000000000000000000000000000000000000003';
const contracts: LocalDeployedContracts = {
  host: '0x0000000000000000000000000000000000000011',
  vault: '0x0000000000000000000000000000000000000012',
  token: '0x0000000000000000000000000000000000000013',
  games: [{ name: 'CoinflipGame', address: coin }, { name: 'FruitTigerGame', address: fruit }, { name: 'GraftGardenGame', address: graft }],
};

test('reload repairs a stale saved contract using the page manifest', () => {
  const stale = { ...DEFAULT_CONFIG, gameUrl: 'https://example.com/', gameAddress: fruit, gameName: 'FruitTigerGame' } as const;
  const result = resolveLocalConfig(stale, contracts, 'GraftGardenGame', false);
  assert.equal(result.config.gameAddress, graft);
  assert.equal(result.config.gameName, 'GraftGardenGame');
  assert.match(result.notice!, /previous contract selection was replaced/);
});

test('explicit URL address keeps its intended contract and synchronizes its name', () => {
  const result = resolveLocalConfig({ ...DEFAULT_CONFIG, gameAddress: graft }, contracts, 'GraftGardenGame', true);
  assert.equal(result.config.gameAddress, graft);
  assert.equal(result.config.gameName, 'GraftGardenGame');
  assert.equal(result.notice, undefined);
});

test('an explicit mismatched address is blocked rather than silently replaced', () => {
  assert.throws(() => resolveLocalConfig({ ...DEFAULT_CONFIG, gameAddress: fruit }, contracts, 'GraftGardenGame', true), /Game contract mismatch/);
});

test('initial manifest selects its deployment instead of the first contract', () => {
  assert.equal(resolveLocalConfig(DEFAULT_CONFIG, contracts, 'GraftGardenGame', false).config.gameAddress, graft);
  assert.equal(resolveLocalConfig(DEFAULT_CONFIG, contracts, undefined, false).config.gameAddress, coin);
});

test('game ID comparison follows SDK canonical naming rules', () => {
  assert.equal(manifestMismatch('GraftGardenGame', 'graft-garden'), undefined);
  assert.match(manifestMismatch('FruitTigerGame', 'GraftGardenGame')!, /FruitTigerGame/);
});

test('reload restores applied config rather than legacy draft edits; query address still wins', () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
  const location = { search: '', href: 'http://localhost:3300/' };
  Object.defineProperty(globalThis, 'location', { configurable: true, value: location });
  Object.defineProperty(globalThis, 'history', { configurable: true, value: { replaceState: (_state: unknown, _title: string, url: URL) => {
    location.href = url.toString();
    location.search = url.search;
  } } });
  const applied = { ...DEFAULT_CONFIG, gameUrl: 'https://example.com/', gameAddress: graft, gameName: 'GraftGardenGame' } as const;
  values.set('casino-sdk-simulator.config', JSON.stringify({ ...applied, gameAddress: fruit, gameName: 'FruitTigerGame' }));
  saveConfig(applied);
  assert.equal(loadConfig().gameAddress, graft);
  saveAppliedUrl(applied);
  assert.equal(new URL(location.href).searchParams.get('gameAddress'), graft);
  location.search = `?gameAddress=${fruit}`;
  assert.equal(loadConfig().gameAddress, fruit);
  assert.equal(loadConfig().gameName, 'SimulatedGame');
});
