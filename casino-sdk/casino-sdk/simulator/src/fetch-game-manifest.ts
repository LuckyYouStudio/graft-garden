import { validateCasinoGameManifest, type CasinoGameManifestV1 } from '@chain/casino-sdk';

/** Invalid/unavailable manifests keep the simulator's existing fallback behavior. */
export async function fetchGameManifest(gameUrl: string): Promise<CasinoGameManifestV1 | undefined> {
  try {
    const manifestUrl = new URL('game.manifest.json', gameUrl);
    const response = await fetch(manifestUrl, { signal: AbortSignal.timeout(5_000), cache: 'no-cache' });
    if (!response.ok) return;
    const result = validateCasinoGameManifest(await response.json());
    if (result.ok) return result.manifest;
  } catch {
    // The standalone SDK simulator also supports games without a manifest yet.
  }
}
