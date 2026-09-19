import type { Address, Hex } from 'viem';
import { canonicalCasinoGameId } from '@chain/casino-sdk';

export type WalletStatusOverride = 'ready' | 'disconnected' | 'setup-required';

export type SimulatorConfig = {
  /** Origin the game iframe is served from, e.g. http://localhost:3100 */
  gameUrl: string;
  rpcUrl: string;
  /** EOA that plays; must hold the wagered token. Defaults to dev-mnemonic account #0. */
  playerPrivateKey: Hex;
  /** LocalCasinoHost address — the harness stand-in for the diamond proxy. */
  proxy: Address | '';
  liquidityVault: Address | '';
  token: Address | '';
  gameAddress: Address | '';
  gameName: string;
  /** Simulated latency of the indexed session feed. */
  indexerLagMs: number;
  /** Simulated latency of the flashblock event push. */
  flashblockLagMs: number;
  /** Lets game developers exercise their non-ready wallet UI states. */
  walletStatus: WalletStatusOverride;
};

// Hardhat/Anvil default mnemonic account #0 — the local-node deployment mints
// the test token to it.
export const DEFAULT_PLAYER_PRIVATE_KEY: Hex =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

export const DEFAULT_CONFIG: SimulatorConfig = {
  gameUrl: 'http://localhost:3100',
  rpcUrl: 'http://127.0.0.1:8545',
  playerPrivateKey: DEFAULT_PLAYER_PRIVATE_KEY,
  proxy: '',
  liquidityVault: '',
  token: '',
  gameAddress: '',
  gameName: 'SimulatedGame',
  indexerLagMs: 600,
  flashblockLagMs: 100,
  walletStatus: 'ready',
};

const STORAGE_KEY = 'casino-sdk-simulator.config';
const APPLIED_STORAGE_KEY = 'casino-sdk-simulator.applied-config';

export function loadConfig(): SimulatorConfig {
  let stored: Partial<SimulatorConfig> = {};
  try {
    // Older builds persisted unfinished setup edits here. Prefer the last
    // applied configuration so a page reload resumes the running game.
    stored = JSON.parse(
      localStorage.getItem(APPLIED_STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY) ?? '{}',
    ) as Partial<SimulatorConfig>;
  } catch {
    stored = {};
  }
  const config = { ...DEFAULT_CONFIG, ...stored };

  const params = new URLSearchParams(location.search);
  const game = params.get('game');
  if (game) config.gameUrl = game;
  const rpc = params.get('rpc');
  if (rpc) config.rpcUrl = rpc;
  const gameAddress = params.get('gameAddress');
  if (gameAddress) {
    if (gameAddress.toLowerCase() !== config.gameAddress.toLowerCase()) config.gameName = 'SimulatedGame';
    config.gameAddress = gameAddress as Address;
  }
  return config;
}

export function saveConfig(config: SimulatorConfig): void {
  localStorage.setItem(APPLIED_STORAGE_KEY, JSON.stringify(config));
}

/** Keep share/reload links in sync only when a new configuration is applied. */
export function saveAppliedUrl(config: SimulatorConfig): void {
  const url = new URL(location.href);
  url.searchParams.set('game', config.gameUrl);
  url.searchParams.set('rpc', config.rpcUrl);
  url.searchParams.set('gameAddress', config.gameAddress);
  history.replaceState(null, '', url);
}

export function manifestMismatch(gameName: string, manifestGameId: string): string | undefined {
  if (canonicalCasinoGameId(gameName) === canonicalCasinoGameId(manifestGameId)) return;
  return `Game contract mismatch: the page declares ${manifestGameId}, but the selected contract is ${gameName}. Select the matching game contract and restart the harness.`;
}

/** Match names and addresses together; never label an explicit address as the first game. */
export function resolveLocalConfig(
  current: SimulatorConfig,
  contracts: LocalDeployedContracts,
  manifestGameId: string | undefined,
  preserveGameAddress: boolean,
): { config: SimulatorConfig; notice?: string } {
  const selected = contracts.games.find(
    game => game.address.toLowerCase() === current.gameAddress.toLowerCase(),
  );
  const matching = manifestGameId
    ? contracts.games.find(game => canonicalCasinoGameId(game.name) === canonicalCasinoGameId(manifestGameId))
    : undefined;
  // A saved selection may belong to the previous page, or a previous node
  // deployment. A manifest match repairs it, except for a deliberate address.
  const game = preserveGameAddress && current.gameAddress
    ? selected
    : matching ?? selected ?? (!current.gameAddress ? contracts.games[0] : undefined);
  const gameAddress = game?.address ?? current.gameAddress;
  const gameName = game?.name ?? current.gameName;
  if (manifestGameId && gameName !== 'SimulatedGame') {
    const mismatch = manifestMismatch(gameName, manifestGameId);
    if (mismatch) throw new Error(mismatch);
  }
  const changed = gameAddress.toLowerCase() !== current.gameAddress.toLowerCase();
  return {
    config: {
      ...current,
      proxy: contracts.host,
      token: contracts.token,
      liquidityVault: contracts.vault,
      rpcUrl: current.rpcUrl === DEFAULT_CONFIG.rpcUrl && contracts.rpcUrl ? contracts.rpcUrl : current.rpcUrl,
      gameAddress,
      gameName,
    },
    notice: matching && changed
      ? `Matched the page manifest to ${matching.name}. The previous contract selection was replaced before starting.`
      : undefined,
  };
}

export type LocalDeployedContracts = {
  host: Address;
  vault: Address;
  token: Address;
  rpcUrl?: string;
  games: Array<{ name: string; address: Address }>;
};

/**
 * Reads local-node/deployed.json (written by `npm run local-node`) served by
 * the vite plugin. Absent (404) until the local node has deployed — the panel
 * then relies on manually entered addresses.
 */
export async function fetchLocalDeployedContracts(): Promise<LocalDeployedContracts | undefined> {
  try {
    const response = await fetch('/__local-contracts.json');
    if (!response.ok) return undefined;
    const raw = (await response.json()) as Partial<LocalDeployedContracts>;
    if (!raw.host || !raw.vault || !raw.token) return undefined;
    return {
      host: raw.host,
      vault: raw.vault,
      token: raw.token,
      rpcUrl: raw.rpcUrl,
      games: raw.games ?? [],
    };
  } catch {
    return undefined;
  }
}
