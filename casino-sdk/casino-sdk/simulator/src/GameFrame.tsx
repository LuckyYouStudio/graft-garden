// The frame the production host renders games in: same iframe attributes,
// bridge wiring, and vertical sizing hooks — minus production-only chrome
// (smart vault overlay, session timing panel).
import { useEffect, useState } from 'react';
import type { CasinoGameManifestV1 } from '@chain/casino-sdk';

import type { WalletStatusOverride } from './config';
import { manifestMismatch } from './config';
import type { GameIntegration } from './casino';
import type { SimulatorRuntime } from './runtime';
import { useGameManifest } from './use-game-manifest';
import { useGameHost } from './use-game-host';
import { useGameBridge } from './use-game-bridge';
import { useAvailableGameHeight } from './use-available-game-height';
import { useReportedContentHeight } from './use-reported-content-height';

export function GameFrame({
  runtime,
  integration,
  walletStatus,
  onContentSize,
}: {
  runtime: SimulatorRuntime;
  integration: GameIntegration;
  walletStatus: WalletStatusOverride;
  onContentSize?: (minHeight: number) => void;
}) {
  const { manifest, checked, declaredGameId } = useGameManifest(integration);
  const mismatch = declaredGameId && integration.gameName !== 'SimulatedGame'
    ? manifestMismatch(integration.gameName, declaredGameId)
    : undefined;
  if (!checked || mismatch) {
    return (
      <div role={mismatch ? 'alert' : 'status'} className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-sm font-medium text-neutral-300">{mismatch ? 'Game contract mismatch' : 'Checking game manifest…'}</p>
        {mismatch && <p className="max-w-lg text-xs text-amber-300">{mismatch}</p>}
      </div>
    );
  }
  // Do not mount a guest or expose betting methods until its declared game
  // identity has been checked against the selected integration.
  return <ConnectedGameFrame runtime={runtime} integration={integration} walletStatus={walletStatus} onContentSize={onContentSize} manifest={manifest} />;
}

function ConnectedGameFrame({ runtime, integration, walletStatus, onContentSize, manifest }: {
  runtime: SimulatorRuntime;
  integration: GameIntegration;
  walletStatus: WalletStatusOverride;
  onContentSize?: (minHeight: number) => void;
  manifest: CasinoGameManifestV1;
}) {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const availableHeight = useAvailableGameHeight(iframe);
  const { reportedContentHeight, reportContentHeight } = useReportedContentHeight(iframe);
  const { snapshot, methods, stuckSessionId } = useGameHost(
    runtime,
    integration,
    manifest,
    walletStatus,
    reportContentHeight,
    availableHeight,
  );

  // Games size their shell to `availableHeight` without re-reporting content
  // size when the hint arrives, so the host must combine both to avoid an
  // undersized iframe that scrolls internally.
  useEffect(() => {
    if (!onContentSize) return;
    const minHeight = Math.max(reportedContentHeight ?? 0, availableHeight ?? 0);
    if (minHeight > 0) onContentSize(minHeight);
  }, [onContentSize, reportedContentHeight, availableHeight]);

  const gameUrl = integration.url;
  useGameBridge({ iframe, gameUrl, methods, snapshot });

  if (!gameUrl) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-sm font-medium text-neutral-300">Game unavailable</p>
        <p className="max-w-sm text-xs text-neutral-500">Set a game URL in the setup panel.</p>
      </div>
    );
  }

  return (
    <>
      <iframe
        ref={setIframe}
        title={manifest.locales[manifest.defaultLocale]?.name ?? integration.name}
        src={gameUrl}
        // The host owns the wallet; the game only renders + calls the bridge. Same
        // origin is required so Penpal's WindowMessenger keeps a stable child origin.
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        allow="clipboard-write; fullscreen"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
      {stuckSessionId && (
        <div className="absolute bottom-4 left-1/2 z-10 flex max-w-[90%] -translate-x-1/2 items-center gap-3 rounded-lg border border-amber-700 bg-amber-950 px-4 py-2.5 text-sm">
          <span>
            Session #{stuckSessionId} is stuck waiting for randomness (deadline passed). Is the
            local VRF node running?
          </span>
          <button
            type="button"
            className="shrink-0 cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500"
            onClick={() => void methods.cancelStuckRandomness({ sessionId: stuckSessionId })}
          >
            Cancel &amp; refund
          </button>
        </div>
      )}
    </>
  );
}
