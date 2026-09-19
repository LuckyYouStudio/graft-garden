import { useEffect, useState } from 'react';

import type { CasinoGameManifestV1 } from '@chain/casino-sdk';

import type { GameIntegration } from './casino';
import { fetchGameManifest } from './fetch-game-manifest';

// A minimal, always-valid manifest used when the game origin doesn't (yet)
// serve a `game.manifest.json`, so the bridge always hands the iframe a
// complete HostSnapshotV1.
function fallbackManifest(integration: GameIntegration): CasinoGameManifestV1 {
  return {
    schemaVersion: 1,
    gameId: integration.gameName,
    apiVersion: 1,
    defaultLocale: 'en',
    locales: { en: { name: integration.name, description: integration.description } },
    assets: integration.image ? { iconUrl: integration.image } : undefined,
  };
}

/** Fetches + validates the game's `game.manifest.json` from its own origin. */
export function useGameManifest(integration: GameIntegration): {
  manifest: CasinoGameManifestV1;
  checked: boolean;
  declaredGameId?: string;
} {
  const [result, setResult] = useState<{ url: string; manifest?: CasinoGameManifestV1 } | null>(null);

  useEffect(() => {
    if (!integration.url) return;
    let cancelled = false;
    const url = integration.url;
    void fetchGameManifest(url).then(manifest => {
      if (!cancelled) setResult({ url, manifest });
    });
    return () => {
      cancelled = true;
    };
  }, [integration.url]);

  const checked = result?.url === integration.url;
  const manifest = checked ? result?.manifest : undefined;
  return { manifest: manifest ?? fallbackManifest(integration), checked, declaredGameId: manifest?.gameId };
}
